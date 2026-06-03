import { useCallback, useMemo, useRef, useState, type ChangeEvent, type PointerEvent } from "react";
import { Copy, Download, Eye, EyeOff, RotateCcw, Save, Upload } from "lucide-react";
import { toast } from "sonner";
import { DioramaEngine } from "@/components/game/diorama/engine/DioramaEngine";
import { DIORAMA_BUILDINGS, BIOME_DIORAMA_THEMES } from "@/components/game/diorama/diorama-data";
import {
  resolveLayoutBiome,
  getDefaultLayout,
  parseDioramaLayoutJson,
  type DioramaLayout,
  type DioramaLayoutBuilding,
  type DioramaHotspot,
  type DioramaRoad,
  type DioramaBuildingVisualState,
  type DioramaHotspotKind,
  type DioramaRoadType,
} from "@/data/dioramaLayouts";
import { buildingAssetBasePath, resolveBuildingVisualState } from "@/lib/diorama/dioramaAssets";
import { generateTrafficAgents, saveTrafficCountOverride } from "@/lib/diorama/pikminTraffic";
import {
  formatBuildingCosts,
  getCurrentBonus,
  getLevelConfig,
  getNextTargetLevel,
  normalizeBuildingStatus,
  toDioramaRuntimeStatus,
} from "@/lib/game/buildingSystem";
import { useDioramaLayout, useEngineMode } from "@/hooks/useDioramaLayout";
import { useVillageDiorama } from "@/hooks/useGameData";
import { useSpaceshipParts } from "@/hooks/useGameData";
import { shipProgressPercent } from "@/lib/game/spaceship";
import type { BiomeKey } from "@/types/secretPikmin";
import styles from "@/styles/village-diorama.module.css";

type EditorSection = "buildings" | "hotspots" | "roads" | "traffic";

interface Props {
  biomeKey: string;
}

const VISUAL_STATES: DioramaBuildingVisualState[] = [
  "locked",
  "buildable",
  "under_construction",
  "level_1",
  "level_2",
  "level_3",
  "level_4",
  "level_5",
];

const HOTSPOT_KINDS: DioramaHotspotKind[] = ["wreck", "rare_flower", "fruit", "cave", "mission_entrance", "custom"];

const ROAD_TYPES: DioramaRoadType[] = ["main", "forest_trail", "hangar_path"];

export function DioramaLayoutEditor({ biomeKey }: Props) {
  const layoutBiome = resolveLayoutBiome(biomeKey);
  const { layout, persist, reset, hasOverride } = useDioramaLayout(layoutBiome);
  const [draft, setDraft] = useState<DioramaLayout>(() => structuredClone(layout));
  const [section, setSection] = useState<EditorSection>("buildings");
  const [selectedKey, setSelectedKey] = useState<string | null>("accademia");
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(draft.hotspots[0]?.id ?? null);
  const [selectedRoadId, setSelectedRoadId] = useState<string | null>(draft.roadNetwork?.[0]?.id ?? null);
  const [previewVisualState, setPreviewVisualState] = useState<DioramaBuildingVisualState>("level_1");
  const [clickMarker, setClickMarker] = useState<{ x: number; y: number } | null>(null);
  const [bgInput, setBgInput] = useState(layout.backgroundImage ?? "");
  const [forceCss, setForceCss] = useState(layout.forceCssFallback ?? false);
  const [trafficCount, setTrafficCount] = useState(layout.trafficConfig?.initialCount ?? 10);
  const [trafficDebug, setTrafficDebug] = useState(true);
  const [useGameBuildingPreview, setUseGameBuildingPreview] = useState(true);
  const stageRef = useRef<HTMLDivElement>(null);

  const engineMode = useEngineMode({ ...draft, forceCssFallback: forceCss });
  const { parts } = useSpaceshipParts();
  const shipPct = shipProgressPercent(parts);
  const theme = BIOME_DIORAMA_THEMES[layoutBiome as BiomeKey] ?? BIOME_DIORAMA_THEMES.bosco;
  const { buildings: gameBuildings } = useVillageDiorama();
  const selectedGameBuilding = gameBuildings.find((b) => b.building_key === selectedKey);
  const gameStatus = selectedGameBuilding ? normalizeBuildingStatus(selectedGameBuilding.status) : null;
  const gameBonus = selectedGameBuilding && gameStatus
    ? getCurrentBonus(selectedGameBuilding.building_key, selectedGameBuilding.level, gameStatus)
    : null;
  const nextLevel = selectedGameBuilding && gameStatus
    ? getNextTargetLevel(selectedGameBuilding.level, gameStatus)
    : null;
  const nextLevelCfg = selectedKey && nextLevel ? getLevelConfig(selectedKey, nextLevel) : null;

  const sceneBuildings = useMemo(
    () =>
      DIORAMA_BUILDINGS.filter((b) => b.key !== "hangar").map((def) => {
        const row = gameBuildings.find((b) => b.building_key === def.key);
        if (useGameBuildingPreview && row) {
          const gs = normalizeBuildingStatus(row.status);
          const level = gs === "buildable" ? 0 : row.level;
          const status = toDioramaRuntimeStatus(gs);
          return {
            def,
            level,
            status,
            visualState: resolveBuildingVisualState(status, level),
          };
        }
        return {
          def,
          level: previewVisualState.startsWith("level_") ? Number(previewVisualState.split("_")[1]) : 1,
          status: (previewVisualState === "locked"
            ? "locked"
            : previewVisualState === "under_construction"
              ? "upgrading"
              : "active") as "active" | "upgrading" | "locked",
          visualState: previewVisualState,
        };
      }),
    [previewVisualState, useGameBuildingPreview, gameBuildings],
  );
  const hangarDef = DIORAMA_BUILDINGS.find((b) => b.key === "hangar")!;

  const selectedBuilding = draft.buildings.find((b) => b.key === selectedKey);
  const selectedHotspot = draft.hotspots.find((h) => h.id === selectedHotspotId);
  const selectedRoad = draft.roadNetwork?.find((r) => r.id === selectedRoadId);

  const updateBuilding = useCallback((key: string, patch: Partial<DioramaLayoutBuilding>) => {
    setDraft((prev) => ({
      ...prev,
      buildings: prev.buildings.map((b) => (b.key === key ? { ...b, ...patch } : b)),
    }));
  }, []);

  const updateHotspot = useCallback((id: string, patch: Partial<DioramaHotspot>) => {
    setDraft((prev) => ({
      ...prev,
      hotspots: prev.hotspots.map((h) => (h.id === id ? { ...h, ...patch } : h)),
    }));
  }, []);

  const updateRoad = useCallback((id: string, patch: Partial<DioramaRoad>) => {
    setDraft((prev) => ({
      ...prev,
      roadNetwork: (prev.roadNetwork ?? []).map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, []);

  const handleStageClick = useCallback(
    (x: number, y: number) => {
      setClickMarker({ x, y });
      if (section === "buildings" && selectedKey) {
        updateBuilding(selectedKey, { x, y });
        toast.message(`Posizione ${selectedKey}`, { description: `${x}%, ${y}%` });
      } else if (section === "hotspots" && selectedHotspotId) {
        updateHotspot(selectedHotspotId, { x, y });
        toast.message(`Hotspot ${selectedHotspotId}`, { description: `${x}%, ${y}%` });
      } else if (section === "roads" && selectedRoadId) {
        setDraft((prev) => ({
          ...prev,
          roadNetwork: (prev.roadNetwork ?? []).map((r) =>
            r.id === selectedRoadId ? { ...r, waypoints: [...r.waypoints, { x, y }] } : r,
          ),
        }));
        toast.message(`Waypoint ${selectedRoadId}`, { description: `${x}%, ${y}%` });
      }
    },
    [section, selectedKey, selectedHotspotId, selectedRoadId, updateBuilding, updateHotspot],
  );

  const buildPersistLayout = (): DioramaLayout => ({
    ...draft,
    backgroundImage: bgInput.trim() || undefined,
    forceCssFallback: forceCss,
    trafficConfig: {
      ...draft.trafficConfig,
      initialCount: trafficCount,
      maxCount: draft.trafficConfig?.maxCount ?? 30,
    },
  });

  const handleSave = () => {
    const next = buildPersistLayout();
    persist(next);
    setDraft(next);
    saveTrafficCountOverride(trafficCount);
    toast.success("Layout salvato in localStorage");
  };

  const handleExport = () => {
    const next = buildPersistLayout();
    const blob = new Blob([JSON.stringify(next, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${next.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON esportato");
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = parseDioramaLayoutJson(JSON.parse(String(reader.result)));
        if (!parsed) {
          toast.error("JSON layout non valido");
          return;
        }
        setDraft(structuredClone(parsed));
        setBgInput(parsed.backgroundImage ?? "");
        setForceCss(parsed.forceCssFallback ?? false);
        toast.success(`Layout "${parsed.id}" importato — salva per applicare`);
      } catch {
        toast.error("Impossibile leggere il file JSON");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleCopyCoords = () => {
    if (!clickMarker) return;
    void navigator.clipboard.writeText(`{ "x": ${clickMarker.x}, "y": ${clickMarker.y} }`);
    toast.success("Coordinate copiate");
  };

  const handleReset = () => {
    reset();
    const fresh = getDefaultLayout(layoutBiome);
    setDraft(structuredClone(fresh));
    setBgInput(fresh.backgroundImage ?? "");
    setForceCss(false);
    toast.message("Layout ripristinato ai default");
  };

  const onBuildingDrag = (e: PointerEvent<HTMLInputElement>, axis: "x" | "y") => {
    if (!selectedKey) return;
    updateBuilding(selectedKey, { [axis]: Number(e.currentTarget.value) });
  };

  const applyAssetBasePath = () => {
    if (!selectedKey) return;
    updateBuilding(selectedKey, {
      assets: { basePath: buildingAssetBasePath(selectedKey) },
    });
    toast.message("Base path asset impostato");
  };

  const editorLayout: DioramaLayout = {
    ...draft,
    backgroundImage: bgInput.trim() || undefined,
    forceCssFallback: forceCss,
    trafficConfig: {
      ...draft.trafficConfig,
      initialCount: trafficCount,
      maxCount: draft.trafficConfig?.maxCount ?? 30,
    },
  };

  const previewAgents = useMemo(
    () => generateTrafficAgents(editorLayout, trafficCount),
    [editorLayout, trafficCount],
  );

  return (
    <div className="space-y-4">
      <div className="panel p-3 space-y-3">
        <p className="text-xs font-display text-primary">Diorama Engine · {draft.label}</p>
        <p className="text-[10px] text-muted-foreground">
          Layout: <strong>{draft.id}</strong> · Bioma: <strong>{layoutBiome}</strong> · Modalità: <strong>{engineMode}</strong>
          {hasOverride && " · override locale"}
        </p>

        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground">
          Sfondo (public path)
          <input
            className="mt-1 w-full panel px-2 py-1.5 text-xs font-mono"
            value={bgInput}
            onChange={(e) => setBgInput(e.target.value)}
            placeholder="/assets/dioramas/bosco-lorenzo-v1.webp"
          />
        </label>

        <label className="flex items-center gap-2 text-[10px]">
          <input type="checkbox" checked={forceCss} onChange={(e) => setForceCss(e.target.checked)} />
          Forza fallback CSS
        </label>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleSave} className="btn-neon px-3 py-1.5 text-[10px] inline-flex items-center gap-1">
            <Save className="h-3 w-3" /> Salva locale
          </button>
          <button type="button" onClick={handleExport} className="panel px-3 py-1.5 text-[10px] inline-flex items-center gap-1">
            <Download className="h-3 w-3" /> Esporta JSON
          </button>
          <label className="panel px-3 py-1.5 text-[10px] inline-flex items-center gap-1 cursor-pointer">
            <Upload className="h-3 w-3" /> Importa JSON
            <input type="file" accept="application/json,.json" className="sr-only" onChange={handleImport} />
          </label>
          <button type="button" onClick={handleCopyCoords} className="panel px-3 py-1.5 text-[10px] inline-flex items-center gap-1" disabled={!clickMarker}>
            <Copy className="h-3 w-3" /> Copia coords
          </button>
          <button type="button" onClick={handleReset} className="panel px-3 py-1.5 text-[10px] inline-flex items-center gap-1">
            <RotateCcw className="h-3 w-3" /> Reset
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
        {(["buildings", "hotspots", "roads", "traffic"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSection(s)}
            className={`shrink-0 px-3 py-2 rounded-xl text-[10px] uppercase tracking-wider border min-h-[36px] ${
              section === s ? "border-primary bg-primary/20 text-primary" : "border-border/50 text-muted-foreground"
            }`}
          >
            {s === "buildings" ? "Buildings" : s === "hotspots" ? "Hotspots" : s === "roads" ? "Roads" : "Traffic"}
          </button>
        ))}
      </div>

      <div ref={stageRef} className={`${styles.dioramaRoot} ${styles.engineEditorFrame}`}>
        <DioramaEngine
          layout={editorLayout}
          mode={engineMode}
          theme={theme}
          isHero
          sceneBuildings={sceneBuildings}
          hangarDef={hangarDef}
          parts={parts}
          shipPct={shipPct}
          visiblePikmin={[]}
          loading={false}
          trafficSize={22}
          labelsOnDemand
          onShipClick={() => {}}
          ariaLabel="Editor layout diorama"
          sceneClassName={`${styles.dioramaScene} ${styles.heroScene} ${styles.engineEditorScene}`}
          editorMode
          editorSection={section}
          selectedBuildingKey={selectedKey}
          selectedHotspotId={selectedHotspotId}
          selectedRoadId={selectedRoadId}
          onSelectBuilding={setSelectedKey}
          onSelectHotspot={setSelectedHotspotId}
          onSelectRoad={setSelectedRoadId}
          onStageClick={handleStageClick}
          clickMarker={clickMarker}
          trafficDebug={section === "traffic" && trafficDebug}
          trafficAgentCount={trafficCount}
        />
      </div>

      {clickMarker && (
        <p className="text-[10px] font-mono text-primary text-center">
          Click: x={clickMarker.x}% y={clickMarker.y}%
        </p>
      )}

      {section === "buildings" && (
        <div className="panel p-3 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Buildings</p>
          <div className="flex flex-wrap gap-1.5">
            {draft.buildings.map((b) => (
              <button
                key={b.key}
                type="button"
                onClick={() => setSelectedKey(b.key)}
                className={`px-2 py-1 rounded-lg text-[10px] border inline-flex items-center gap-1 ${
                  selectedKey === b.key ? "border-primary bg-primary/20 text-primary" : "border-border/50 text-muted-foreground"
                }`}
              >
                {b.hidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3 opacity-40" />}
                {b.key}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-[10px] mb-2">
            <input
              type="checkbox"
              checked={useGameBuildingPreview}
              onChange={(e) => setUseGameBuildingPreview(e.target.checked)}
            />
            Anteprima stato gioco (livello/status runtime)
          </label>

          <label className="block text-[10px]">
            Preview stato sprite {useGameBuildingPreview ? "(override manuale disattivo)" : ""}
            <select
              className="mt-1 w-full panel px-2 py-1.5 text-xs"
              value={previewVisualState}
              disabled={useGameBuildingPreview}
              onChange={(e) => setPreviewVisualState(e.target.value as DioramaBuildingVisualState)}
            >
              {VISUAL_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>

          {selectedBuilding && (
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              {selectedGameBuilding && (
                <div className="col-span-2 panel px-3 py-2 space-y-1 border border-primary/20">
                  <p className="text-[9px] uppercase tracking-widest text-primary">Building System · V2.5</p>
                  <p>Livello: {selectedGameBuilding.level} / {selectedGameBuilding.max_level}</p>
                  <p>Stato: {gameStatus}</p>
                  {gameBonus && <p>Bonus attivo: {gameBonus.label}</p>}
                  {nextLevelCfg && gameStatus !== "under_construction" && (
                    <>
                      <p className="text-muted-foreground">Prossimo: {nextLevelCfg.bonus.label} · {nextLevelCfg.buildTimeSec}s</p>
                      <p className="text-muted-foreground">Costi: {formatBuildingCosts(nextLevelCfg.costs).join(" · ")}</p>
                    </>
                  )}
                </div>
              )}
              <label className="col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedBuilding.hidden ?? false}
                  onChange={(e) => updateBuilding(selectedBuilding.key, { hidden: e.target.checked })}
                />
                Nascondi overlay
              </label>
              <label>
                X %
                <input type="range" min={0} max={100} step={0.5} value={selectedBuilding.x} onChange={(e) => onBuildingDrag(e, "x")} className="w-full" />
              </label>
              <label>
                Y %
                <input type="range" min={0} max={100} step={0.5} value={selectedBuilding.y} onChange={(e) => onBuildingDrag(e, "y")} className="w-full" />
              </label>
              <label>
                Z
                <input type="range" min={1} max={100} value={selectedBuilding.z} onChange={(e) => updateBuilding(selectedBuilding.key, { z: Number(e.target.value) })} className="w-full" />
              </label>
              <label>
                Scale
                <input type="range" min={0.5} max={2} step={0.05} value={selectedBuilding.scale ?? 1} onChange={(e) => updateBuilding(selectedBuilding.key, { scale: Number(e.target.value) })} className="w-full" />
              </label>
              <label className="col-span-2">
                Asset basePath
                <input
                  className="mt-1 w-full panel px-2 py-1 font-mono text-[10px]"
                  value={selectedBuilding.assets?.basePath ?? ""}
                  onChange={(e) =>
                    updateBuilding(selectedBuilding.key, {
                      assets: { ...selectedBuilding.assets, basePath: e.target.value || undefined },
                    })
                  }
                  placeholder={buildingAssetBasePath(selectedBuilding.key)}
                />
              </label>
              <button type="button" onClick={applyAssetBasePath} className="col-span-2 text-[10px] text-primary underline text-left">
                Applica path standard /assets/buildings/{selectedBuilding.key}
              </button>
              <label className="col-span-2">
                Sprite override (singolo)
                <input
                  className="mt-1 w-full panel px-2 py-1 font-mono text-[10px]"
                  value={selectedBuilding.image ?? ""}
                  onChange={(e) => updateBuilding(selectedBuilding.key, { image: e.target.value || undefined })}
                />
              </label>
            </div>
          )}
        </div>
      )}

      {section === "hotspots" && (
        <div className="panel p-3 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Hotspots</p>
          <div className="flex flex-wrap gap-1.5">
            {draft.hotspots.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => setSelectedHotspotId(h.id)}
                className={`px-2 py-1 rounded-lg text-[10px] border ${
                  selectedHotspotId === h.id ? "border-primary bg-primary/20 text-primary" : "border-border/50 text-muted-foreground"
                }`}
              >
                {h.hidden ? "🚫 " : ""}{h.label ?? h.id}
              </button>
            ))}
          </div>

          {selectedHotspot && (
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <label className="col-span-2 flex items-center gap-2">
                <input type="checkbox" checked={selectedHotspot.hidden ?? false} onChange={(e) => updateHotspot(selectedHotspot.id, { hidden: e.target.checked })} />
                Nascondi hotspot
              </label>
              <label>
                X
                <input type="range" min={0} max={100} step={0.5} value={selectedHotspot.x} onChange={(e) => updateHotspot(selectedHotspot.id, { x: Number(e.target.value) })} className="w-full" />
              </label>
              <label>
                Y
                <input type="range" min={0} max={100} step={0.5} value={selectedHotspot.y} onChange={(e) => updateHotspot(selectedHotspot.id, { y: Number(e.target.value) })} className="w-full" />
              </label>
              <label className="col-span-2">
                Label
                <input className="mt-1 w-full panel px-2 py-1" value={selectedHotspot.label ?? ""} onChange={(e) => updateHotspot(selectedHotspot.id, { label: e.target.value })} />
              </label>
              <label>
                Tipo
                <select className="mt-1 w-full panel px-2 py-1" value={selectedHotspot.kind ?? "custom"} onChange={(e) => updateHotspot(selectedHotspot.id, { kind: e.target.value as DioramaHotspotKind })}>
                  {HOTSPOT_KINDS.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </label>
              <label>
                Route click
                <input className="mt-1 w-full panel px-2 py-1 font-mono" value={selectedHotspot.route ?? ""} onChange={(e) => updateHotspot(selectedHotspot.id, { route: e.target.value || undefined })} placeholder="/missioni" />
              </label>
            </div>
          )}
        </div>
      )}

      {section === "roads" && (
        <div className="panel p-3 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Road network</p>
          <div className="flex flex-wrap gap-1.5">
            {(draft.roadNetwork ?? []).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRoadId(r.id)}
                className={`px-2 py-1 rounded-lg text-[10px] border ${
                  selectedRoadId === r.id ? "border-primary bg-primary/20 text-primary" : "border-border/50 text-muted-foreground"
                }`}
              >
                {r.id} ({r.type})
              </button>
            ))}
          </div>
          <p className="text-[9px] text-muted-foreground">Clicca sullo stage per aggiungere waypoint alla strada selezionata.</p>

          {selectedRoad && (
            <div className="grid grid-cols-2 gap-3 text-[10px]">
              <label className="col-span-2 flex items-center gap-2">
                <input type="checkbox" checked={selectedRoad.hidden ?? false} onChange={(e) => updateRoad(selectedRoad.id, { hidden: e.target.checked })} />
                Nascondi strada
              </label>
              <label>
                Tipo
                <select className="mt-1 w-full panel px-2 py-1" value={selectedRoad.type} onChange={(e) => updateRoad(selectedRoad.id, { type: e.target.value as DioramaRoadType })}>
                  {ROAD_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-end">
                <button
                  type="button"
                  className="panel px-2 py-1 w-full"
                  onClick={() => updateRoad(selectedRoad.id, { waypoints: selectedRoad.waypoints.slice(0, -1) })}
                  disabled={selectedRoad.waypoints.length === 0}
                >
                  Rimuovi ultimo WP
                </button>
              </label>
              <p className="col-span-2 font-mono text-[9px] text-muted-foreground">
                {selectedRoad.waypoints.length} waypoint
              </p>
            </div>
          )}
        </div>
      )}

      {section === "traffic" && (
        <div className="panel p-3 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Pikmin Traffic · Debug</p>

          <label className="block text-[10px]">
            Agenti attivi: {trafficCount} / {draft.trafficConfig?.maxCount ?? 30}
            <input
              type="range"
              min={1}
              max={draft.trafficConfig?.maxCount ?? 30}
              value={trafficCount}
              onChange={(e) => {
                const n = Number(e.target.value);
                setTrafficCount(n);
                saveTrafficCountOverride(n);
              }}
              className="w-full"
            />
          </label>

          <label className="flex items-center gap-2 text-[10px]">
            <input type="checkbox" checked={trafficDebug} onChange={(e) => setTrafficDebug(e.target.checked)} />
            Mostra route, agenti e destinazioni
          </label>

          <div className="max-h-48 overflow-y-auto space-y-1">
            {previewAgents.map((a) => (
              <div key={a.id} className="text-[9px] font-mono panel px-2 py-1 flex justify-between gap-2">
                <span>{a.id}</span>
                <span className="text-primary">{a.currentTask}</span>
                <span className="text-muted-foreground truncate">{a.homeStructure}→{a.destination}</span>
              </div>
            ))}
          </div>

          <p className="text-[9px] text-muted-foreground">
            Pattern: Serra(mercato)→Magazzino, Magazzino→Hangar, Accademia→Piazza, Lab→Piazza, gather hotspot, idle.
          </p>
        </div>
      )}
    </div>
  );
}
