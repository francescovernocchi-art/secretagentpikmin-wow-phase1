import type { BiomeKey } from "@/types/secretPikmin";
import type { BuildingKey } from "@/components/game/diorama/diorama-data";
import { DIORAMA_BUILDINGS } from "@/components/game/diorama/diorama-data";
import boscoLorenzoV1Json from "./diorama-layouts/bosco-lorenzo-v1.json";
import type { DioramaTrafficConfig } from "@/lib/diorama/pikminTraffic";

/** Sprite Pikmin supportati dal motore */
export type DioramaPikminType = "red" | "blue" | "yellow" | "white" | "purple" | "rock" | "wing";

export type DioramaPikminAnim = "walk" | "carry" | "work" | "idle" | "gather";

export type DioramaEffectType =
  | "building-glow"
  | "construction-dust"
  | "hangar-lights"
  | "particle-dust"
  | "particle-energy";

export interface DioramaPoint {
  x: number;
  y: number;
}

/** Stati visivi sprite edificio — cambio automatico */
export type DioramaBuildingVisualState =
  | "locked"
  | "buildable"
  | "under_construction"
  | "level_1"
  | "level_2"
  | "level_3"
  | "level_4"
  | "level_5";

/** Slot asset per edificio — path public, immagini fornite manualmente */
export interface DioramaBuildingAssetSlots {
  basePath?: string;
  lv1?: string;
  lv2?: string;
  lv3?: string;
  lv4?: string;
  lv5?: string;
  construction?: string;
  destroyed?: string;
  locked?: string;
  buildable?: string;
}

/** Hangar evolutivo — sprite per stadio riparazione navicella */
export type DioramaHangarStage =
  | "hangar_lv1"
  | "hangar_lv2"
  | "hangar_lv3"
  | "hangar_lv4"
  | "hangar_complete";

export interface DioramaHangarAssetSlots {
  basePath?: string;
  hangar_lv1?: string;
  hangar_lv2?: string;
  hangar_lv3?: string;
  hangar_lv4?: string;
  hangar_complete?: string;
}

export interface DioramaLayoutBuilding {
  key: BuildingKey;
  x: number;
  y: number;
  z: number;
  scale?: number;
  depth?: number;
  /** Zona logica nel layout (hangar, piazza, …) */
  zone?: string;
  /** Slot sprite multi-livello */
  assets?: DioramaBuildingAssetSlots;
  /** Sprite overlay singolo (legacy / override) */
  image?: string;
  /** silhouette | emoji — fallback se manca sprite */
  fallback?: "silhouette" | "emoji";
  clickable?: boolean;
  /** Nascondi overlay in runtime / editor */
  hidden?: boolean;
}

export interface DioramaPikminRoute {
  id: string;
  type: DioramaPikminType;
  anim: DioramaPikminAnim;
  waypoints: DioramaPoint[];
  duration: number;
  enabled?: boolean;
}

export type DioramaHotspotKind =
  | "wreck"
  | "rare_flower"
  | "fruit"
  | "cave"
  | "mission_entrance"
  | "custom";

export type DioramaHotspotAction = "ship" | "route" | "custom" | "mission" | "inspect";

export interface DioramaHotspot {
  id: string;
  kind?: DioramaHotspotKind;
  x: number;
  y: number;
  w?: number;
  h?: number;
  label?: string;
  icon?: string;
  /** Sprite custom (public path o diorama-asset://) */
  sprite?: string;
  action?: DioramaHotspotAction;
  target?: string;
  /** Route TanStack per click (es. /missioni) */
  route?: string;
  z?: number;
  hidden?: boolean;
}

export type DioramaRoadType = "main" | "forest_trail" | "hangar_path";

export interface DioramaRoad {
  id: string;
  type: DioramaRoadType;
  waypoints: DioramaPoint[];
  enabled?: boolean;
  hidden?: boolean;
}

export interface DioramaLayoutZone {
  id: string;
  label: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
}

export interface DioramaEffect {
  id: string;
  type: DioramaEffectType;
  x?: number;
  y?: number;
  z?: number;
  target?: BuildingKey | string;
  intensity?: "low" | "medium" | "high";
}

export interface DioramaLayer {
  id: string;
  type: "background" | "midground" | "foreground" | "overlay";
  image?: string;
  z: number;
  opacity?: number;
}

export interface DioramaLayout {
  id: string;
  label: string;
  biome: BiomeKey;
  version: number;
  /** Path public, es. /assets/dioramas/colonia-bosco-v1.webp */
  backgroundImage?: string;
  aspectRatio: string;
  buildings: DioramaLayoutBuilding[];
  pikminRoutes: DioramaPikminRoute[];
  hotspots: DioramaHotspot[];
  effects: DioramaEffect[];
  layers: DioramaLayer[];
  /** Zone principali del bioma (metadata + editor) */
  zones?: DioramaLayoutZone[];
  /** Rete strade — percorsi futuri Pikmin / nav */
  roadNetwork?: DioramaRoad[];
  /** Sprite hangar evolutivo */
  hangarAssets?: DioramaHangarAssetSlots;
  /** Config traffico Pikmin V2.3 */
  trafficConfig?: DioramaTrafficConfig;
  /** Forza diorama CSS anche se lo sfondo esiste */
  forceCssFallback?: boolean;
}

export const DIORAMA_LAYOUT_STORAGE_KEY = "secret-pikmin-diorama-layout";

/** Mappa chiavi editor Phaser → layout bioma CSS */
export const EDITOR_BIOME_TO_LAYOUT: Record<string, BiomeKey> = {
  foresta: "bosco",
  roccioso: "roccia",
  litorale: "acqua",
  montanaro: "roccia",
  vulcanico: "grotta",
  industriale: "industriale",
  spaziale: "citta",
  desertico: "campo",
};

export function resolveLayoutBiome(biome: string): BiomeKey {
  return (EDITOR_BIOME_TO_LAYOUT[biome] ?? biome) as BiomeKey;
}

/** Rotte demo validazione V2.1 — walk / carry / work */
export const VALIDATION_DEMO_ROUTES: DioramaPikminRoute[] = [
  {
    id: "demo-walk",
    type: "red",
    anim: "walk",
    waypoints: [
      { x: 50, y: 42 },
      { x: 78, y: 38 },
      { x: 50, y: 42 },
    ],
    duration: 10,
    enabled: true,
  },
  {
    id: "demo-carry",
    type: "yellow",
    anim: "carry",
    waypoints: [
      { x: 50, y: 28 },
      { x: 50, y: 40 },
      { x: 28, y: 70 },
      { x: 50, y: 40 },
    ],
    duration: 14,
    enabled: true,
  },
  {
    id: "demo-work",
    type: "blue",
    anim: "work",
    waypoints: [
      { x: 48, y: 40 },
      { x: 52, y: 42 },
      { x: 50, y: 44 },
      { x: 48, y: 40 },
    ],
    duration: 8,
    enabled: true,
  },
];

/** Rotte traffico default — Hangar → Piazza → Edifici */
const DEFAULT_TRAFFIC: DioramaPikminRoute[] = [
  { id: "tr-1", type: "yellow", anim: "carry", waypoints: [{ x: 50, y: 26 }, { x: 50, y: 38 }, { x: 50, y: 42 }, { x: 22, y: 48 }, { x: 50, y: 42 }], duration: 14, enabled: true },
  { id: "tr-2", type: "red", anim: "walk", waypoints: [{ x: 50, y: 42 }, { x: 78, y: 38 }, { x: 50, y: 42 }], duration: 10, enabled: true },
  { id: "tr-3", type: "blue", anim: "carry", waypoints: [{ x: 50, y: 28 }, { x: 50, y: 40 }, { x: 28, y: 70 }, { x: 50, y: 40 }], duration: 16, enabled: true },
  { id: "tr-4", type: "white", anim: "work", waypoints: [{ x: 48, y: 40 }, { x: 52, y: 42 }, { x: 50, y: 44 }, { x: 48, y: 40 }], duration: 8, enabled: true },
  { id: "tr-5", type: "yellow", anim: "walk", waypoints: [{ x: 50, y: 42 }, { x: 62, y: 74 }, { x: 50, y: 42 }], duration: 13, enabled: true },
  { id: "tr-6", type: "red", anim: "carry", waypoints: [{ x: 50, y: 30 }, { x: 50, y: 40 }, { x: 48, y: 36 }, { x: 50, y: 40 }], duration: 11, enabled: true },
  { id: "tr-7", type: "blue", anim: "walk", waypoints: [{ x: 22, y: 48 }, { x: 50, y: 42 }, { x: 78, y: 36 }, { x: 50, y: 42 }], duration: 15, enabled: true },
  { id: "tr-8", type: "purple", anim: "carry", waypoints: [{ x: 56, y: 43 }, { x: 50, y: 40 }, { x: 50, y: 28 }], duration: 12, enabled: true },
  { id: "tr-9", type: "rock", anim: "work", waypoints: [{ x: 58, y: 38 }, { x: 52, y: 40 }, { x: 44, y: 37 }, { x: 52, y: 40 }], duration: 9, enabled: true },
  { id: "tr-10", type: "white", anim: "carry", waypoints: [{ x: 50, y: 40 }, { x: 30, y: 68 }, { x: 50, y: 40 }, { x: 50, y: 26 }], duration: 18, enabled: true },
];

/** Sfondo demo validazione V2.1 */
export const VALIDATION_BACKGROUND = "/assets/dioramas/test-layout.webp";

const DEFAULT_EFFECTS: DioramaEffect[] = [
  { id: "fx-hangar-lights", type: "hangar-lights", target: "hangar", z: 88 },
  { id: "fx-dust", type: "particle-dust", z: 5, intensity: "medium" },
  { id: "fx-energy", type: "particle-energy", z: 6, intensity: "low" },
];

function buildingsFromData(): DioramaLayoutBuilding[] {
  return DIORAMA_BUILDINGS.map((b) => ({
    key: b.key,
    x: b.x,
    y: b.y,
    z: b.z,
    scale: b.key === "hangar" ? 1 : 1,
    depth: b.z,
    fallback: "silhouette" as const,
    clickable: true,
  }));
}

function createLayout(biome: BiomeKey, id: string, label: string, backgroundImage?: string): DioramaLayout {
  return {
    id,
    label,
    biome,
    version: 1,
    backgroundImage,
    aspectRatio: "390 / 480",
    buildings: buildingsFromData(),
    pikminRoutes: DEFAULT_TRAFFIC.map((r) => ({ ...r })),
    hotspots: [
      { id: "hs-plaza", x: 50, y: 40, w: 18, h: 12, label: "Piazza centrale" },
      { id: "hs-hangar", x: 50, y: 12, w: 40, h: 28, label: "Hangar", action: "ship" },
    ],
    effects: DEFAULT_EFFECTS.map((e) => ({ ...e })),
    layers: [],
  };
}

/** Layout predefiniti per bioma — V2.1 usa sfondo demo condiviso per validazione */
function validationLayout(biome: BiomeKey, id: string, label: string): DioramaLayout {
  return {
    ...createLayout(biome, id, label, VALIDATION_BACKGROUND),
    pikminRoutes: VALIDATION_DEMO_ROUTES.map((r) => ({ ...r })),
  };
}

/** Layout Bosco Lorenzo V1 — primo bioma definitivo */
export const BOSCO_LORENZO_V1 = boscoLorenzoV1Json as DioramaLayout;

export const DIORAMA_LAYOUTS: Record<BiomeKey, DioramaLayout> = {
  bosco: structuredClone(BOSCO_LORENZO_V1),
  giardino: validationLayout("giardino", "test-layout-giardino", "Test Layout Giardino"),
  acqua: validationLayout("acqua", "test-layout-acqua", "Test Layout Acqua"),
  roccia: validationLayout("roccia", "test-layout-roccia", "Test Layout Roccia"),
  grotta: validationLayout("grotta", "test-layout-grotta", "Test Layout Grotta"),
  campo: validationLayout("campo", "test-layout-campo", "Test Layout Campo"),
  citta: validationLayout("citta", "test-layout-citta", "Test Layout Città"),
  industriale: validationLayout("industriale", "test-layout-industriale", "Test Layout Industriale"),
};

export function getDefaultLayout(biome: BiomeKey): DioramaLayout {
  return structuredClone(DIORAMA_LAYOUTS[biome] ?? DIORAMA_LAYOUTS.bosco);
}

export function mergeLayout(base: DioramaLayout, patch: Partial<DioramaLayout>): DioramaLayout {
  return {
    ...base,
    ...patch,
    buildings: patch.buildings ?? base.buildings,
    pikminRoutes: patch.pikminRoutes ?? base.pikminRoutes,
    hotspots: patch.hotspots ?? base.hotspots,
    effects: patch.effects ?? base.effects,
    layers: patch.layers ?? base.layers,
    zones: patch.zones ?? base.zones,
    roadNetwork: patch.roadNetwork ?? base.roadNetwork,
    hangarAssets: patch.hangarAssets ?? base.hangarAssets,
    trafficConfig: patch.trafficConfig ?? base.trafficConfig,
  };
}

export function layoutBuildingToDef(
  layoutB: DioramaLayoutBuilding,
  dataDef = DIORAMA_BUILDINGS.find((b) => b.key === layoutB.key),
) {
  if (!dataDef) return null;
  return {
    ...dataDef,
    x: layoutB.x,
    y: layoutB.y,
    z: layoutB.z,
  };
}

export function storageKeyForBiome(biome: BiomeKey): string {
  return `${DIORAMA_LAYOUT_STORAGE_KEY}:${biome}`;
}

/** Valida e normalizza JSON importato dall'editor */
export function parseDioramaLayoutJson(raw: unknown): DioramaLayout | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Partial<DioramaLayout>;
  if (!o.id || !o.biome || !Array.isArray(o.buildings) || o.buildings.length === 0) return null;
  const biome = o.biome as BiomeKey;
  const base = getDefaultLayout(biome);
  return mergeLayout(base, {
    ...o,
    buildings: o.buildings,
    pikminRoutes: Array.isArray(o.pikminRoutes) ? o.pikminRoutes : base.pikminRoutes,
    hotspots: Array.isArray(o.hotspots) ? o.hotspots : base.hotspots,
    effects: Array.isArray(o.effects) ? o.effects : base.effects,
    layers: Array.isArray(o.layers) ? o.layers : base.layers,
    zones: Array.isArray(o.zones) ? o.zones : base.zones,
    roadNetwork: Array.isArray(o.roadNetwork) ? o.roadNetwork : base.roadNetwork,
    hangarAssets: o.hangarAssets ?? base.hangarAssets,
    trafficConfig: o.trafficConfig ?? base.trafficConfig,
  });
}
