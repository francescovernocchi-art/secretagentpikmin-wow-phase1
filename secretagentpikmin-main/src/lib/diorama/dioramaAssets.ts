import type {
  DioramaBuildingAssetSlots,
  DioramaBuildingVisualState,
  DioramaHangarAssetSlots,
  DioramaHangarStage,
} from "@/data/dioramaLayouts";

/** Path public default per edificio — es. /assets/buildings/laboratorio */
export function buildingAssetBasePath(key: string): string {
  return `/assets/buildings/${key}`;
}

const BUILDING_FILE_BY_STATE: Record<DioramaBuildingVisualState, string> = {
  locked: "locked.webp",
  buildable: "buildable.webp",
  under_construction: "construction.webp",
  level_1: "lv1.webp",
  level_2: "lv2.webp",
  level_3: "lv3.webp",
  level_4: "lv4.webp",
  level_5: "lv5.webp",
};

const BUILDING_SLOT_BY_STATE: Record<DioramaBuildingVisualState, keyof DioramaBuildingAssetSlots> =
  {
    locked: "locked",
    buildable: "buildable",
    under_construction: "construction",
    level_1: "lv1",
    level_2: "lv2",
    level_3: "lv3",
    level_4: "lv4",
    level_5: "lv5",
  };

/** Mappa stato gioco → stato visivo sprite */
export function resolveBuildingVisualState(
  status: "active" | "upgrading" | "locked",
  level: number,
): DioramaBuildingVisualState {
  if (status === "locked") return "locked";
  if (status === "upgrading") return "under_construction";
  if (level <= 0) return "buildable";
  const clamped = Math.min(5, Math.max(1, level));
  return `level_${clamped}` as DioramaBuildingVisualState;
}

/** Risolve path sprite edificio per stato visivo (override JSON → basePath → undefined) */
export function resolveBuildingSprite(
  assets: DioramaBuildingAssetSlots | undefined,
  state: DioramaBuildingVisualState,
  buildingKey?: string,
): string | undefined {
  if (!assets) {
    if (buildingKey) {
      return `${buildingAssetBasePath(buildingKey)}/${BUILDING_FILE_BY_STATE[state]}`;
    }
    return undefined;
  }

  const slotKey = BUILDING_SLOT_BY_STATE[state];
  const explicit = assets[slotKey];
  if (typeof explicit === "string" && explicit.length > 0) return explicit;

  const base = assets.basePath ?? (buildingKey ? buildingAssetBasePath(buildingKey) : undefined);
  if (base) return `${base.replace(/\/$/, "")}/${BUILDING_FILE_BY_STATE[state]}`;

  return undefined;
}

/** Sprite distrutto — slot separato, non legato a gameplay */
export function resolveDestroyedSprite(
  assets: DioramaBuildingAssetSlots | undefined,
  buildingKey?: string,
): string | undefined {
  if (assets?.destroyed) return assets.destroyed;
  const base = assets?.basePath ?? (buildingKey ? buildingAssetBasePath(buildingKey) : undefined);
  return base ? `${base.replace(/\/$/, "")}/destroyed.webp` : undefined;
}

const HANGAR_FILE_BY_STAGE: Record<DioramaHangarStage, string> = {
  hangar_lv1: "hangar_lv1.webp",
  hangar_lv2: "hangar_lv2.webp",
  hangar_lv3: "hangar_lv3.webp",
  hangar_lv4: "hangar_lv4.webp",
  hangar_complete: "hangar_complete.webp",
};

/** Hangar evolutivo — solo visualizzazione da % riparazione navicella */
export function resolveHangarStage(shipPercent: number): DioramaHangarStage {
  if (shipPercent >= 88) return "hangar_complete";
  if (shipPercent >= 63) return "hangar_lv4";
  if (shipPercent >= 38) return "hangar_lv3";
  if (shipPercent >= 13) return "hangar_lv2";
  return "hangar_lv1";
}

export function resolveHangarSprite(
  assets: DioramaHangarAssetSlots | undefined,
  stage: DioramaHangarStage,
): string | undefined {
  if (assets?.[stage]) return assets[stage];

  const base = assets?.basePath ?? buildingAssetBasePath("hangar");
  return `${base.replace(/\/$/, "")}/${HANGAR_FILE_BY_STAGE[stage]}`;
}
