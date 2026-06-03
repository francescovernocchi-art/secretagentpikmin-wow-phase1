import { useCallback, useEffect, useMemo, useState } from "react";
import { Hammer, ArrowUpCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { BuildingKey } from "@/components/game/diorama/diorama-data";
import type { DbVillageBuilding } from "@/types/phase2-db";
import {
  applyConstructionTimers,
  canAffordCosts,
  refreshVillageBuildings,
  startBuildingAction,
} from "@/lib/game/buildingActions";
import {
  formatBuildingCosts,
  getBuildingDef,
  getCurrentBonus,
  getLevelConfig,
  getNextTargetLevel,
  getPendingBonus,
  normalizeBuildingStatus,
} from "@/lib/game/buildingSystem";
import styles from "@/styles/village-diorama.module.css";

interface Props {
  building: DbVillageBuilding;
  villageId: string;
  agentKey: string;
  onUpdated: (buildings: DbVillageBuilding[]) => void;
  onClose: () => void;
}

function formatCountdown(endIso: string | null | undefined): string {
  if (!endIso) return "—";
  const ms = new Date(endIso).getTime() - Date.now();
  if (ms <= 0) return "Completamento…";
  const sec = Math.ceil(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function DioramaBuildingPanel({ building, villageId, agentKey, onUpdated, onClose }: Props) {
  const key = building.building_key as BuildingKey;
  const def = getBuildingDef(key);
  const [live, setLive] = useState(() => applyConstructionTimers([building])[0] ?? building);
  const [busy, setBusy] = useState(false);
  const [affordable, setAffordable] = useState<boolean | null>(null);

  const status = normalizeBuildingStatus(live.status);
  const targetLevel = getNextTargetLevel(live.level, status);
  const levelCfg = getLevelConfig(key, targetLevel);
  const currentBonus = getCurrentBonus(key, live.level, status);
  const pendingBonus = levelCfg ? getPendingBonus(key, targetLevel) : null;
  const isMax = def ? live.level >= def.maxLevel && status === "completed" : false;
  const underConstruction = status === "under_construction";
  const canBuild = status === "buildable" || (live.level <= 0 && status !== "locked");
  const canUpgrade = status === "completed" && live.level > 0 && !isMax;

  useEffect(() => {
    const tick = () => {
      setLive((prev) => {
        const next = applyConstructionTimers([prev])[0] ?? prev;
        if (next.status === "completed" && normalizeBuildingStatus(prev.status) === "under_construction") {
          refreshVillageBuildings(villageId).then(onUpdated);
          toast.success(`${next.name} completato`, { description: `Livello ${next.level}` });
        }
        return next;
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [villageId, onUpdated]);

  useEffect(() => {
    if (!levelCfg?.costs) {
      setAffordable(null);
      return;
    }
    canAffordCosts(agentKey, levelCfg.costs).then(setAffordable);
  }, [agentKey, levelCfg, live.status]);

  const handleAction = useCallback(
    async (action: "build" | "upgrade") => {
      setBusy(true);
      try {
        const res = await startBuildingAction({ villageId, agentKey, buildingKey: key, action });
        if (res.success) {
          onUpdated(res.buildings);
          const updated = res.buildings.find((b) => b.building_key === key);
          if (updated) setLive(updated);
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      } finally {
        setBusy(false);
      }
    },
    [villageId, agentKey, key, onUpdated],
  );

  const statusLabel = useMemo(() => {
    switch (status) {
      case "locked": return "Bloccato";
      case "buildable": return "Costruibile";
      case "under_construction": return "In costruzione";
      case "completed": return "Completato";
    }
  }, [status]);

  return (
    <div className={styles.buildingPanel}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl">{live.emoji}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg text-glow truncate">{live.name}</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Livello {Math.max(0, live.level)} / {def?.maxLevel ?? live.max_level} · {statusLabel}
          </p>
        </div>
      </div>

      {currentBonus && (
        <div className="panel px-3 py-2 mb-3 text-[11px]">
          <p className="text-[9px] uppercase tracking-widest text-primary mb-1">Bonus attivo</p>
          <p>{currentBonus.label}{currentBonus.unit ? ` ${currentBonus.unit}` : ""}</p>
        </div>
      )}

      {underConstruction && (
        <div className="panel px-3 py-2 mb-3 text-[11px] flex items-center gap-2 text-amber-200">
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          <span>Costruzione in corso · {formatCountdown(live.build_end_at)}</span>
        </div>
      )}

      {!underConstruction && !isMax && pendingBonus && levelCfg && (
        <>
          <div className="panel px-3 py-2 mb-3 text-[11px]">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1">
              {canBuild ? "Bonus dopo costruzione" : "Bonus prossimo livello"}
            </p>
            <p className="text-primary">{pendingBonus.label}</p>
            <p className="text-[9px] text-muted-foreground mt-1">Tempo: {levelCfg.buildTimeSec}s</p>
          </div>

          <div className="panel px-3 py-2 mb-4 text-[11px]">
            <p className="text-[9px] uppercase tracking-widest text-muted-foreground mb-1.5">Costi</p>
            <ul className="space-y-1">
              {formatBuildingCosts(levelCfg.costs).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            {affordable === false && (
              <p className="text-destructive text-[10px] mt-2">Risorse insufficienti</p>
            )}
          </div>
        </>
      )}

      {isMax && (
        <p className="text-[11px] text-muted-foreground mb-4 text-center">Livello massimo raggiunto</p>
      )}

      <div className="flex gap-2">
        {canBuild && !underConstruction && (
          <button
            type="button"
            className="btn-neon flex-1 py-2.5 text-xs inline-flex items-center justify-center gap-1.5"
            disabled={busy || affordable === false}
            onClick={() => handleAction("build")}
          >
            <Hammer className="h-3.5 w-3.5" /> Costruisci
          </button>
        )}
        {canUpgrade && !underConstruction && (
          <button
            type="button"
            className="btn-neon flex-1 py-2.5 text-xs inline-flex items-center justify-center gap-1.5"
            disabled={busy || affordable === false}
            onClick={() => handleAction("upgrade")}
          >
            <ArrowUpCircle className="h-3.5 w-3.5" /> Migliora
          </button>
        )}
        <button type="button" className="panel px-4 py-2.5 text-xs" onClick={onClose}>
          Chiudi
        </button>
      </div>
    </div>
  );
}
