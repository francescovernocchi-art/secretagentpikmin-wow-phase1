import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { VILLAGE_BUILDINGS } from "@/data/secretPikminWorld";
import { hapticTap } from "@/lib/haptic";
import { useVillageDiorama, useSpaceshipParts, usePikminSquad, usePlayerBiome } from "@/hooks/useGameData";
import { useDioramaLayout, useEngineMode } from "@/hooks/useDioramaLayout";
import { shipProgressPercent } from "@/lib/game/spaceship";
import { resolveBuildingVisualState } from "@/lib/diorama/dioramaAssets";
import { applyConstructionTimers } from "@/lib/game/buildingActions";
import { normalizeBuildingStatus, toDioramaRuntimeStatus } from "@/lib/game/buildingSystem";
import { getBiomeByKey } from "@/data/secretPikminWorld";
import { SpaceshipAssemblyPanel } from "@/components/game/SpaceshipAssemblyPanel";
import { DioramaBuildingPanel } from "@/components/game/diorama/DioramaBuildingPanel";
import { DioramaEngine } from "@/components/game/diorama/engine/DioramaEngine";
import { DIORAMA_BUILDINGS, BIOME_DIORAMA_THEMES, type BuildingKey } from "@/components/game/diorama/diorama-data";
import styles from "@/styles/village-diorama.module.css";
import type { BiomeKey } from "@/types/secretPikmin";

interface VillageDioramaProps {
  buildingCount?: number;
  pikminCount?: number;
  compact?: boolean;
  ownerAgent?: string;
  showFooter?: boolean;
  fullScreen?: boolean;
  heroMode?: boolean;
  fullscreenMode?: boolean;
}

/** Diorama Engine — sfondo immagine + overlay, fallback CSS */
export function VillageDiorama({
  buildingCount,
  pikminCount = 12,
  compact = false,
  ownerAgent,
  showFooter = true,
  fullScreen = false,
  heroMode = false,
  fullscreenMode = false,
}: VillageDioramaProps) {
  const isHero = heroMode || fullscreenMode;
  const { buildings, villageId, villageName, controlLevel, maxVillages, loading, reload, agent } =
    useVillageDiorama(ownerAgent);
  const { parts } = useSpaceshipParts();
  const { squad } = usePikminSquad(ownerAgent);
  const { biome } = usePlayerBiome(ownerAgent);
  const { layout } = useDioramaLayout(biome);
  const engineMode = useEngineMode(layout);
  const shipPct = shipProgressPercent(parts);
  const [shipOpen, setShipOpen] = useState(false);
  const [buildingPanelKey, setBuildingPanelKey] = useState<BuildingKey | null>(null);

  const liveBuildings = useMemo(() => applyConstructionTimers(buildings), [buildings]);

  useEffect(() => {
    const id = window.setInterval(() => reload(), 5000);
    return () => window.clearInterval(id);
  }, [reload]);

  const openShip = useCallback(() => {
    hapticTap();
    setShipOpen(true);
  }, []);
  const closeShip = useCallback(() => setShipOpen(false), []);

  const openBuilding = useCallback((key: string) => {
    if (key === "hangar") return;
    hapticTap();
    setBuildingPanelKey(key as BuildingKey);
  }, []);
  const closeBuilding = useCallback(() => setBuildingPanelKey(null), []);

  useEffect(() => {
    if (!shipOpen && !buildingPanelKey) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeShip();
        closeBuilding();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shipOpen, buildingPanelKey, closeShip, closeBuilding]);

  const theme = BIOME_DIORAMA_THEMES[(biome as BiomeKey) ?? "bosco"] ?? BIOME_DIORAMA_THEMES.bosco;
  const biomeDef = getBiomeByKey(biome);

  const buildingByKey = useMemo(() => new Map(liveBuildings.map((b) => [b.building_key, b])), [liveBuildings]);

  const displayBuildings =
    liveBuildings.length > 0
      ? DIORAMA_BUILDINGS.map((def) => {
          const row = buildingByKey.get(def.key);
          const gameStatus = normalizeBuildingStatus(row?.status ?? "completed");
          const level = gameStatus === "buildable" ? 0 : (row?.level ?? 1);
          const status = toDioramaRuntimeStatus(gameStatus);
          return {
            def,
            level,
            status,
            visualState: resolveBuildingVisualState(status, level),
          };
        })
      : DIORAMA_BUILDINGS.slice(0, (buildingCount ?? 3) + 3).map((def, i) => ({
          def,
          level: VILLAGE_BUILDINGS.find((b) => b.key === def.key)?.level ?? i + 1,
          status: "active" as const,
          visualState: resolveBuildingVisualState("active", VILLAGE_BUILDINGS.find((b) => b.key === def.key)?.level ?? i + 1),
        }));

  const selectedBuilding = buildingPanelKey ? buildingByKey.get(buildingPanelKey) : undefined;

  const visiblePikmin = squad.length > 0 ? squad.slice(0, compact ? 2 : isHero ? 2 : 4) : [];
  const onMission = squad.filter((p) => p.status === "in_spedizione" || p.status === "in_missione");
  const hangarDef = DIORAMA_BUILDINGS.find((b) => b.key === "hangar")!;
  const sceneBuildings = displayBuildings.filter((b) => b.def.key !== "hangar");
  const trafficSize = compact ? 20 : isHero ? 24 : 26;

  return (
    <section className={`${styles.dioramaRoot} ${compact ? styles.compact : ""} ${isHero ? styles.heroMode : ""} ${fullscreenMode ? styles.fullscreenMode : ""} ${engineMode === "image" ? styles.engineImageMode : ""} ${fullScreen ? "rounded-none border-0 min-h-0 flex-1 flex flex-col" : ""}`}>
      {!compact && villageName && !isHero && (
        <div className={styles.dioramaHeader}>
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-primary/90 font-display">{villageName}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5">
              {biomeDef?.emoji} {biomeDef?.label} · CC Lv{controlLevel} · max {maxVillages} villaggi
              {engineMode === "image" && <span className="text-primary/60"> · engine</span>}
            </p>
          </div>
          {!fullScreen && (
            <Link to="/villaggio/edifici" onClick={hapticTap} className="text-[9px] uppercase tracking-widest text-primary panel px-2 py-1">
              Edifici →
            </Link>
          )}
        </div>
      )}

      <DioramaEngine
        layout={layout}
        mode={engineMode}
        theme={theme}
        compact={compact}
        isHero={isHero}
        fullscreenMode={fullscreenMode}
        sceneBuildings={sceneBuildings}
        hangarDef={hangarDef}
        parts={parts}
        shipPct={shipPct}
        visiblePikmin={visiblePikmin}
        loading={loading}
        trafficSize={trafficSize}
        labelsOnDemand={isHero}
        onShipClick={openShip}
        onBuildingClick={openBuilding}
        ariaLabel={`Villaggio ${villageName || ""} nel bioma ${biomeDef?.label ?? biome}`}
        sceneClassName={`${styles.dioramaScene} ${isHero ? styles.heroScene : ""} ${fullscreenMode ? styles.heroSceneFullscreen : ""}`}
      />

      {showFooter && !compact && !isHero && (
        <div className="relative px-4 pb-3 flex items-center justify-between gap-2 flex-wrap border-t border-primary/10 bg-black/20">
          <div className="text-[10px] uppercase tracking-widest py-2">
            <span className="text-primary">{squad.length || pikminCount}</span>{" "}
            <span className="text-muted-foreground">Pikmin · {loading ? "…" : `${displayBuildings.length} edifici`}</span>
            {onMission.length > 0 && (
              <span className="block text-[9px] text-amber-300 mt-0.5">{onMission.length} in spedizione</span>
            )}
          </div>
          <div className="flex gap-1">
            {parts.filter((p) => p.collected).slice(0, 5).map((p) => (
              <span key={p.key} className="text-sm drop-shadow-[0_0_4px_rgba(56,189,248,0.6)]" title={p.name}>{p.emoji}</span>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {shipOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-night/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
            onClick={closeShip}
            role="presentation"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="panel-strong w-full max-w-lg p-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="ship-hangar-title"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 id="ship-hangar-title" className="font-display text-lg text-glow">Hangar Navicella</h3>
                <button type="button" onClick={closeShip} className="panel p-1.5" aria-label="Chiudi hangar">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <SpaceshipAssemblyPanel />
            </motion.div>
          </motion.div>
        )}

        {buildingPanelKey && selectedBuilding && villageId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-night/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
            onClick={closeBuilding}
            role="presentation"
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="panel-strong w-full max-w-md p-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-labelledby="building-panel-title"
            >
              <div className="flex items-center justify-between mb-2">
                <span id="building-panel-title" className="sr-only">{selectedBuilding.name}</span>
                <button type="button" onClick={closeBuilding} className="panel p-1.5 ml-auto" aria-label="Chiudi pannello edificio">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <DioramaBuildingPanel
                building={selectedBuilding}
                villageId={villageId}
                agentKey={agent}
                onUpdated={(next) => {
                  reload();
                  if (buildingPanelKey && !next.find((b) => b.building_key === buildingPanelKey)) {
                    closeBuilding();
                  }
                }}
                onClose={closeBuilding}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
