import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { Download, ImagePlus, Trash2, Upload, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { DioramaEngine } from "@/components/game/diorama/engine/DioramaEngine";
import { DIORAMA_BUILDINGS, BIOME_DIORAMA_THEMES } from "@/components/game/diorama/diorama-data";
import type { BuildingKey } from "@/components/game/diorama/diorama-data";
import {
  resolveLayoutBiome,
  type DioramaBuildingVisualState,
  type DioramaHangarStage,
  type DioramaLayout,
} from "@/data/dioramaLayouts";
import {
  BUILDING_SLOT_OPTIONS,
  HANGAR_SLOT_OPTIONS,
  UPLOAD_BUILDING_KEYS,
  describeAssetBinding,
  normalizeBuildingKey,
  slotFromVisualState,
} from "@/lib/diorama/applyDioramaAsset";
import type { DioramaAssetType } from "@/lib/diorama/dioramaAssetStore";
import { useDioramaAssets } from "@/hooks/useDioramaAssets";
import { useDioramaLayout, useEngineMode } from "@/hooks/useDioramaLayout";
import { useResolvedAssetUrl } from "@/hooks/useResolvedAssetUrl";
import { useSpaceshipParts } from "@/hooks/useGameData";
import { shipProgressPercent } from "@/lib/game/spaceship";
import type { BiomeKey } from "@/types/secretPikmin";
import styles from "@/styles/village-diorama.module.css";

interface Props {
  biomeKey: string;
}

const ASSET_TYPES: { value: DioramaAssetType; label: string }[] = [
  { value: "background", label: "Sfondo diorama" },
  { value: "building", label: "Sprite edificio" },
  { value: "hangar", label: "Sprite hangar" },
  { value: "hotspot", label: "Sprite hotspot" },
  { value: "decoration", label: "Decorazione" },
];

function AssetThumb({ assetId }: { assetId: string }) {
  const url = useResolvedAssetUrl(`diorama-asset://${assetId}`);
  if (!url) return <div className={styles.assetThumbPlaceholder} />;
  return <img src={url} alt="" className={styles.assetThumbImg} draggable={false} />;
}

export function DioramaAssetManager({ biomeKey }: Props) {
  const layoutBiome = resolveLayoutBiome(biomeKey);
  const { layout, persist } = useDioramaLayout(layoutBiome);
  const [draft, setDraft] = useState<DioramaLayout>(() => structuredClone(layout));
  const onLayoutChange = useCallback((l: DioramaLayout) => setDraft(structuredClone(l)), []);

  const { assets, loading, uploadAsset, applyExistingAsset, removeAsset, exportPack, importPack } =
    useDioramaAssets(layoutBiome, draft, (l) => {
      onLayoutChange(l);
      persist(l);
    });

  const fileRef = useRef<HTMLInputElement>(null);
  const packRef = useRef<HTMLInputElement>(null);
  const [assetType, setAssetType] = useState<DioramaAssetType>("building");
  const [buildingKey, setBuildingKey] = useState<BuildingKey | "serra">("hangar");
  const [visualState, setVisualState] = useState<DioramaBuildingVisualState>("level_1");
  const [hangarStage, setHangarStage] = useState<DioramaHangarStage>("hangar_lv1");
  const [hotspotId, setHotspotId] = useState(draft.hotspots[0]?.id ?? "");
  const [forceCss, setForceCss] = useState(draft.forceCssFallback ?? false);

  useEffect(() => {
    setDraft(structuredClone(layout));
  }, [layout]);

  const engineMode = useEngineMode({ ...draft, forceCssFallback: forceCss });
  const { parts } = useSpaceshipParts();
  const shipPct = shipProgressPercent(parts);
  const theme = BIOME_DIORAMA_THEMES[layoutBiome as BiomeKey] ?? BIOME_DIORAMA_THEMES.bosco;

  const sceneBuildings = useMemo(
    () =>
      DIORAMA_BUILDINGS.filter((b) => b.key !== "hangar").map((def) => ({
        def,
        level: 1,
        status: "active" as const,
        visualState: "level_1" as const,
      })),
    [],
  );
  const hangarDef = DIORAMA_BUILDINGS.find((b) => b.key === "hangar")!;

  const handleUploadClick = () => fileRef.current?.click();

  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Seleziona un'immagine (webp, png, jpg…)");
      return;
    }

    try {
      const slot =
        assetType === "hangar" || (assetType === "building" && buildingKey === "hangar")
          ? hangarStage
          : slotFromVisualState(visualState);

      await uploadAsset(file, {
        type: assetType === "building" && buildingKey === "hangar" ? "hangar" : assetType,
        buildingKey: assetType === "background" ? undefined : buildingKey,
        slot,
        hotspotId: assetType === "hotspot" ? hotspotId : undefined,
      });

      if (assetType === "background") setForceCss(false);

      toast.success("Asset caricato", { description: file.name });
    } catch (err) {
      toast.error("Upload fallito", { description: String(err) });
    }
  };

  const handleImportPack = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const count = await importPack(file);
      toast.success("Pacchetto importato", { description: `${count} asset ripristinati` });
    } catch (err) {
      toast.error("Import fallito", { description: String(err) });
    }
  };

  const buildingLabel = (key: BuildingKey | "serra") => {
    if (key === "serra") return "Serra (mercato)";
    return DIORAMA_BUILDINGS.find((b) => b.key === key)?.name ?? key;
  };

  return (
    <div className="space-y-4">
      <div className="panel p-3 space-y-2">
        <p className="text-[10px] uppercase tracking-widest text-primary">Asset Manager · V2.4</p>
        <p className="text-[10px] text-muted-foreground">
          Upload locale (IndexedDB) — collegamento automatico al layout. Futuro: Supabase Storage.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-neon px-3 py-2 text-[10px] inline-flex items-center gap-1.5"
            onClick={handleUploadClick}
          >
            <ImagePlus className="h-3.5 w-3.5" /> Carica asset
          </button>
          <button
            type="button"
            className="panel px-3 py-2 text-[10px] inline-flex items-center gap-1.5"
            onClick={() => exportPack()}
          >
            <Download className="h-3.5 w-3.5" /> Esporta pacchetto
          </button>
          <button
            type="button"
            className="panel px-3 py-2 text-[10px] inline-flex items-center gap-1.5"
            onClick={() => packRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" /> Importa pacchetto
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
        <input
          ref={packRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImportPack}
        />
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="panel p-3 space-y-3">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Nuovo upload
          </p>

          <label className="block text-[10px]">
            Tipo asset
            <select
              className="mt-1 w-full panel px-2 py-1.5 text-xs bg-transparent"
              value={assetType}
              onChange={(e) => setAssetType(e.target.value as DioramaAssetType)}
            >
              {ASSET_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>

          {(assetType === "building" || assetType === "hangar") && (
            <label className="block text-[10px]">
              Edificio
              <select
                className="mt-1 w-full panel px-2 py-1.5 text-xs bg-transparent"
                value={buildingKey}
                onChange={(e) => setBuildingKey(e.target.value as BuildingKey | "serra")}
              >
                {UPLOAD_BUILDING_KEYS.map((k) => (
                  <option key={k} value={k}>
                    {buildingLabel(k)}
                  </option>
                ))}
              </select>
            </label>
          )}

          {(assetType === "hangar" || (assetType === "building" && buildingKey === "hangar")) && (
            <label className="block text-[10px]">
              Stadio hangar
              <select
                className="mt-1 w-full panel px-2 py-1.5 text-xs bg-transparent"
                value={hangarStage}
                onChange={(e) => setHangarStage(e.target.value as DioramaHangarStage)}
              >
                {HANGAR_SLOT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {assetType === "building" && buildingKey !== "hangar" && (
            <label className="block text-[10px]">
              Stato / livello
              <select
                className="mt-1 w-full panel px-2 py-1.5 text-xs bg-transparent"
                value={visualState}
                onChange={(e) => setVisualState(e.target.value as DioramaBuildingVisualState)}
              >
                {BUILDING_SLOT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          )}

          {assetType === "hotspot" && (
            <label className="block text-[10px]">
              Hotspot
              <select
                className="mt-1 w-full panel px-2 py-1.5 text-xs bg-transparent"
                value={hotspotId}
                onChange={(e) => setHotspotId(e.target.value)}
              >
                {draft.hotspots.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.label ?? h.id}
                  </option>
                ))}
              </select>
            </label>
          )}

          {assetType === "background" && (
            <p className="text-[9px] text-muted-foreground">
              Sostituisce lo sfondo del bioma ({draft.id}) e disattiva il fallback CSS.
            </p>
          )}

          <button
            type="button"
            className="btn-neon w-full py-2 text-[10px]"
            onClick={handleUploadClick}
          >
            Scegli file immagine…
          </button>
        </div>

        <div
          className={`${styles.assetManagerPreview} rounded-xl overflow-hidden border border-border/40`}
        >
          <DioramaEngine
            mode={engineMode}
            layout={draft}
            theme={theme}
            compact={false}
            sceneBuildings={sceneBuildings}
            hangarDef={hangarDef}
            parts={parts}
            shipPct={shipPct}
            visiblePikmin={[]}
            trafficSize={14}
            editorMode
          />
        </div>
      </div>

      <div className="panel p-3 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Asset Library
          </p>
          <span className="text-[9px] text-muted-foreground">
            {loading ? "…" : `${assets.length} asset`}
          </span>
        </div>

        {assets.length === 0 && !loading && (
          <p className="text-[10px] text-muted-foreground text-center py-4">
            Nessun asset locale — carica il primo sprite.
          </p>
        )}

        <div className={styles.assetLibraryGrid}>
          {assets.map((a) => (
            <div key={a.id} className={styles.assetLibraryCard}>
              <AssetThumb assetId={a.id} />
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-[10px] font-medium truncate">{a.name}</p>
                <p className="text-[9px] text-primary truncate">{a.type}</p>
                <p className="text-[9px] text-muted-foreground truncate">
                  {describeAssetBinding(a)}
                </p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button
                  type="button"
                  className="panel p-1.5"
                  title="Usa nel layout"
                  onClick={() => {
                    applyExistingAsset(a);
                    toast.message("Asset applicato", { description: a.name });
                  }}
                >
                  <Wand2 className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  className="panel p-1.5 text-destructive"
                  title="Elimina"
                  onClick={async () => {
                    await removeAsset(a.id);
                    toast.message("Asset eliminato");
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[9px] text-muted-foreground px-1">
        Edificio attivo: {buildingLabel(buildingKey)} ({normalizeBuildingKey(buildingKey)}) · Bioma:{" "}
        {layoutBiome}
      </p>
    </div>
  );
}
