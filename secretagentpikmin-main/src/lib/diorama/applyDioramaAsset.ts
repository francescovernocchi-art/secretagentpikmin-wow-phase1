import type { BuildingKey } from "@/components/game/diorama/diorama-data";
import type {
  DioramaBuildingAssetSlots,
  DioramaBuildingVisualState,
  DioramaHangarStage,
  DioramaLayout,
} from "@/data/dioramaLayouts";
import { makeAssetRef } from "./dioramaAssetRefs";
import type { DioramaAssetMeta, DioramaAssetSlot, DioramaAssetType } from "./dioramaAssetStore";
import { isAssetRef, parseAssetRef } from "./dioramaAssetRefs";

/** Edificio UI "serra" → chiave layout mercato */
export function normalizeBuildingKey(key: BuildingKey | "serra"): BuildingKey {
  return key === "serra" ? "mercato" : key;
}

export const BUILDING_SLOT_OPTIONS: { value: DioramaBuildingVisualState; label: string; slot: keyof DioramaBuildingAssetSlots }[] = [
  { value: "locked", label: "Locked", slot: "locked" },
  { value: "buildable", label: "Buildable", slot: "buildable" },
  { value: "under_construction", label: "Construction", slot: "construction" },
  { value: "level_1", label: "Lv 1", slot: "lv1" },
  { value: "level_2", label: "Lv 2", slot: "lv2" },
  { value: "level_3", label: "Lv 3", slot: "lv3" },
  { value: "level_4", label: "Lv 4", slot: "lv4" },
  { value: "level_5", label: "Lv 5", slot: "lv5" },
];

export const HANGAR_SLOT_OPTIONS: { value: DioramaHangarStage; label: string }[] = [
  { value: "hangar_lv1", label: "Hangar Lv 1" },
  { value: "hangar_lv2", label: "Hangar Lv 2" },
  { value: "hangar_lv3", label: "Hangar Lv 3" },
  { value: "hangar_lv4", label: "Hangar Lv 4" },
  { value: "hangar_complete", label: "Hangar Complete" },
];

export const UPLOAD_BUILDING_KEYS: (BuildingKey | "serra")[] = [
  "hangar",
  "centro_controllo",
  "accademia",
  "magazzino",
  "laboratorio",
  "mercato",
  "serra",
];

export function slotFromVisualState(state: DioramaBuildingVisualState): keyof DioramaBuildingAssetSlots {
  return BUILDING_SLOT_OPTIONS.find((o) => o.value === state)?.slot ?? "lv1";
}

export interface ApplyAssetInput {
  assetId: string;
  type: DioramaAssetType;
  buildingKey?: BuildingKey | "serra";
  slot?: DioramaAssetSlot;
  hotspotId?: string;
  layerId?: string;
}

/** Collega asset al layout — nessuna modifica JSON manuale */
export function applyAssetToLayout(layout: DioramaLayout, input: ApplyAssetInput): DioramaLayout {
  const ref = makeAssetRef(input.assetId);
  const next = structuredClone(layout);

  switch (input.type) {
    case "background":
      next.backgroundImage = ref;
      next.forceCssFallback = false;
      break;

    case "hangar": {
      const stage = (input.slot as DioramaHangarStage) ?? "hangar_lv1";
      next.hangarAssets = { ...next.hangarAssets, [stage]: ref };
      break;
    }

    case "building": {
      const key = normalizeBuildingKey(input.buildingKey ?? "hangar");
      const slot = (input.slot as keyof DioramaBuildingAssetSlots) ?? "lv1";

      if (key === "hangar" && typeof input.slot === "string" && input.slot.startsWith("hangar_")) {
        next.hangarAssets = { ...next.hangarAssets, [input.slot as DioramaHangarStage]: ref };
        break;
      }

      next.buildings = next.buildings.map((b) => {
        if (b.key !== key) return b;
        return {
          ...b,
          assets: { ...b.assets, [slot]: ref },
          image: undefined,
        };
      });
      break;
    }

    case "hotspot": {
      if (!input.hotspotId) break;
      next.hotspots = next.hotspots.map((h) =>
        h.id === input.hotspotId ? { ...h, sprite: ref } : h,
      );
      break;
    }

    case "decoration": {
      if (input.layerId) {
        next.layers = next.layers.map((l) =>
          l.id === input.layerId ? { ...l, image: ref } : l,
        );
      } else {
        next.layers = [
          ...next.layers,
          { id: `layer-${input.assetId.slice(-6)}`, type: "overlay", image: ref, z: 20, opacity: 1 },
        ];
      }
      break;
    }
  }

  return next;
}

/** Raccoglie tutti i ref asset usati nel layout */
export function collectAssetRefsFromLayout(layout: DioramaLayout): string[] {
  const refs = new Set<string>();

  const add = (v?: string) => {
    if (v && isAssetRef(v)) refs.add(parseAssetRef(v)!);
  };

  add(layout.backgroundImage);
  for (const b of layout.buildings) {
    add(b.image);
    if (b.assets) {
      for (const v of Object.values(b.assets)) add(typeof v === "string" ? v : undefined);
    }
  }
  if (layout.hangarAssets) {
    for (const v of Object.values(layout.hangarAssets)) add(typeof v === "string" ? v : undefined);
  }
  for (const h of layout.hotspots) add(h.sprite);
  for (const l of layout.layers) add(l.image);

  return [...refs];
}

export function describeAssetBinding(meta: DioramaAssetMeta): string {
  if (meta.type === "background") return "Sfondo diorama";
  if (meta.type === "decoration") return meta.layerId ? `Decorazione · ${meta.layerId}` : "Decorazione";
  if (meta.type === "hotspot") return meta.hotspotId ? `Hotspot · ${meta.hotspotId}` : "Hotspot";
  const bKey = meta.buildingKey === "serra" ? "Serra (mercato)" : meta.buildingKey;
  const slot = meta.slot ?? "—";
  return `${bKey ?? "—"} · ${slot}`;
}
