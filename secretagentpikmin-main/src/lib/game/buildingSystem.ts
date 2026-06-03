import type { BuildingKey } from "@/components/game/diorama/diorama-data";

/** Stato gameplay edificio — indipendente dagli asset grafici */
export type BuildingGameStatus = "locked" | "buildable" | "under_construction" | "completed";

export type BuildingResourceKey = "legno" | "resina" | "semi" | "rottami";

export interface BuildingResourceCost {
  legno?: number;
  resina?: number;
  semi?: number;
  rottami?: number;
}

export type BuildingBonusType =
  | "repair_capacity"
  | "pikmin_production"
  | "research_speed"
  | "storage_capacity"
  | "remote_villages"
  | "training_speed";

export interface BuildingBonus {
  type: BuildingBonusType;
  label: string;
  /** Valore bonus a questo livello */
  value: number;
  unit?: string;
}

export interface BuildingLevelConfig {
  /** Livello risultante (1 = prima costruzione) */
  level: number;
  costs: BuildingResourceCost;
  buildTimeSec: number;
  bonus: BuildingBonus;
}

export interface BuildingSystemDef {
  id: BuildingKey;
  name: string;
  maxLevel: number;
  /** Livelli configurabili — costi, tempo, bonus */
  levels: BuildingLevelConfig[];
  /** Stato iniziale demo */
  initialStatus?: BuildingGameStatus;
  initialLevel?: number;
}

export const BUILDING_RESOURCE_META: Record<
  BuildingResourceKey,
  { label: string; emoji: string; itemKey: string }
> = {
  legno: { label: "Legno", emoji: "🪵", itemKey: "legno" },
  resina: { label: "Resina", emoji: "🍯", itemKey: "resina" },
  semi: { label: "Semi", emoji: "🌱", itemKey: "semi" },
  rottami: { label: "Rottami", emoji: "⚙️", itemKey: "rottami" },
};

export const BUILDING_BONUS_LABEL: Record<BuildingBonusType, string> = {
  repair_capacity: "Capacità riparazione",
  pikmin_production: "Produzione Pikmin",
  research_speed: "Velocità ricerca",
  storage_capacity: "Capacità magazzino",
  remote_villages: "Villaggi gestibili",
  training_speed: "Velocità addestramento",
};

/** Config edifici — gameplay only, sprite via Asset Manager */
export const BUILDING_SYSTEM: Record<BuildingKey, BuildingSystemDef> = {
  hangar: {
    id: "hangar",
    name: "Hangar Navicella",
    maxLevel: 5,
    initialStatus: "completed",
    initialLevel: 1,
    levels: [
      { level: 1, costs: { legno: 20, rottami: 10 }, buildTimeSec: 30, bonus: { type: "repair_capacity", label: "+10% riparazione", value: 10, unit: "%" } },
      { level: 2, costs: { legno: 30, rottami: 20, resina: 5 }, buildTimeSec: 45, bonus: { type: "repair_capacity", label: "+20% riparazione", value: 20, unit: "%" } },
      { level: 3, costs: { legno: 40, rottami: 30, resina: 10 }, buildTimeSec: 60, bonus: { type: "repair_capacity", label: "+35% riparazione", value: 35, unit: "%" } },
      { level: 4, costs: { legno: 55, rottami: 40, resina: 15, semi: 5 }, buildTimeSec: 90, bonus: { type: "repair_capacity", label: "+50% riparazione", value: 50, unit: "%" } },
      { level: 5, costs: { legno: 70, rottami: 55, resina: 20, semi: 10 }, buildTimeSec: 120, bonus: { type: "repair_capacity", label: "+70% riparazione", value: 70, unit: "%" } },
    ],
  },
  mercato: {
    id: "mercato",
    name: "Serra / Mercato",
    maxLevel: 5,
    initialStatus: "buildable",
    initialLevel: 0,
    levels: [
      { level: 1, costs: { legno: 15, semi: 10 }, buildTimeSec: 25, bonus: { type: "pikmin_production", label: "+1 Pikmin/ora", value: 1 } },
      { level: 2, costs: { legno: 25, semi: 15, resina: 5 }, buildTimeSec: 40, bonus: { type: "pikmin_production", label: "+2 Pikmin/ora", value: 2 } },
      { level: 3, costs: { legno: 35, semi: 20, resina: 10 }, buildTimeSec: 55, bonus: { type: "pikmin_production", label: "+3 Pikmin/ora", value: 3 } },
      { level: 4, costs: { legno: 50, semi: 25, resina: 15 }, buildTimeSec: 75, bonus: { type: "pikmin_production", label: "+4 Pikmin/ora", value: 4 } },
      { level: 5, costs: { legno: 65, semi: 30, resina: 20 }, buildTimeSec: 100, bonus: { type: "pikmin_production", label: "+6 Pikmin/ora", value: 6 } },
    ],
  },
  laboratorio: {
    id: "laboratorio",
    name: "Laboratorio",
    maxLevel: 5,
    initialStatus: "completed",
    initialLevel: 1,
    levels: [
      { level: 1, costs: { legno: 18, resina: 8 }, buildTimeSec: 30, bonus: { type: "research_speed", label: "+10% ricerca", value: 10, unit: "%" } },
      { level: 2, costs: { legno: 28, resina: 12, rottami: 5 }, buildTimeSec: 45, bonus: { type: "research_speed", label: "+20% ricerca", value: 20, unit: "%" } },
      { level: 3, costs: { legno: 38, resina: 18, rottami: 10 }, buildTimeSec: 60, bonus: { type: "research_speed", label: "+35% ricerca", value: 35, unit: "%" } },
      { level: 4, costs: { legno: 52, resina: 24, rottami: 15 }, buildTimeSec: 85, bonus: { type: "research_speed", label: "+50% ricerca", value: 50, unit: "%" } },
      { level: 5, costs: { legno: 68, resina: 30, rottami: 22 }, buildTimeSec: 110, bonus: { type: "research_speed", label: "+70% ricerca", value: 70, unit: "%" } },
    ],
  },
  magazzino: {
    id: "magazzino",
    name: "Magazzino",
    maxLevel: 5,
    initialStatus: "completed",
    initialLevel: 1,
    levels: [
      { level: 1, costs: { legno: 12, rottami: 5 }, buildTimeSec: 20, bonus: { type: "storage_capacity", label: "+20 slot", value: 20 } },
      { level: 2, costs: { legno: 22, rottami: 10 }, buildTimeSec: 35, bonus: { type: "storage_capacity", label: "+40 slot", value: 40 } },
      { level: 3, costs: { legno: 32, rottami: 15, resina: 8 }, buildTimeSec: 50, bonus: { type: "storage_capacity", label: "+65 slot", value: 65 } },
      { level: 4, costs: { legno: 45, rottami: 22, resina: 12 }, buildTimeSec: 70, bonus: { type: "storage_capacity", label: "+90 slot", value: 90 } },
      { level: 5, costs: { legno: 60, rottami: 30, resina: 18 }, buildTimeSec: 95, bonus: { type: "storage_capacity", label: "+120 slot", value: 120 } },
    ],
  },
  accademia: {
    id: "accademia",
    name: "Accademia Pikmin",
    maxLevel: 5,
    initialStatus: "completed",
    initialLevel: 1,
    levels: [
      { level: 1, costs: { legno: 16, semi: 8 }, buildTimeSec: 28, bonus: { type: "training_speed", label: "+10% addestramento", value: 10, unit: "%" } },
      { level: 2, costs: { legno: 26, semi: 12, resina: 6 }, buildTimeSec: 42, bonus: { type: "training_speed", label: "+20% addestramento", value: 20, unit: "%" } },
      { level: 3, costs: { legno: 36, semi: 18, resina: 10 }, buildTimeSec: 58, bonus: { type: "training_speed", label: "+35% addestramento", value: 35, unit: "%" } },
      { level: 4, costs: { legno: 48, semi: 24, resina: 14 }, buildTimeSec: 80, bonus: { type: "training_speed", label: "+50% addestramento", value: 50, unit: "%" } },
      { level: 5, costs: { legno: 62, semi: 30, resina: 20 }, buildTimeSec: 105, bonus: { type: "training_speed", label: "+70% addestramento", value: 70, unit: "%" } },
    ],
  },
  centro_controllo: {
    id: "centro_controllo",
    name: "Centro Controllo",
    maxLevel: 5,
    initialStatus: "completed",
    initialLevel: 1,
    levels: [
      { level: 1, costs: { legno: 25, rottami: 15 }, buildTimeSec: 35, bonus: { type: "remote_villages", label: "1 villaggio", value: 1 } },
      { level: 2, costs: { legno: 35, rottami: 20, resina: 10 }, buildTimeSec: 50, bonus: { type: "remote_villages", label: "1 villaggio", value: 1 } },
      { level: 3, costs: { legno: 50, rottami: 30, resina: 15 }, buildTimeSec: 70, bonus: { type: "remote_villages", label: "2 villaggi", value: 2 } },
      { level: 4, costs: { legno: 65, rottami: 40, resina: 22 }, buildTimeSec: 95, bonus: { type: "remote_villages", label: "2 villaggi", value: 2 } },
      { level: 5, costs: { legno: 80, rottami: 50, resina: 30, semi: 10 }, buildTimeSec: 120, bonus: { type: "remote_villages", label: "3 villaggi", value: 3 } },
    ],
  },
};

/** Normalizza status legacy (active → completed) */
export function normalizeBuildingStatus(raw: string): BuildingGameStatus {
  if (raw === "locked") return "locked";
  if (raw === "buildable") return "buildable";
  if (raw === "under_construction" || raw === "upgrading" || raw === "building") return "under_construction";
  if (raw === "completed" || raw === "active" || raw === "idle") return "completed";
  return "completed";
}

/** Mappa status gameplay → runtime diorama sprite */
export function toDioramaRuntimeStatus(status: BuildingGameStatus): "active" | "upgrading" | "locked" {
  if (status === "locked") return "locked";
  if (status === "under_construction") return "upgrading";
  return "active";
}

export function getBuildingDef(key: string): BuildingSystemDef | undefined {
  return BUILDING_SYSTEM[key as BuildingKey];
}

export function getLevelConfig(key: string, targetLevel: number): BuildingLevelConfig | undefined {
  return getBuildingDef(key)?.levels.find((l) => l.level === targetLevel);
}

/** Prossimo livello da costruire/migliorare */
export function getNextTargetLevel(level: number, status: BuildingGameStatus): number {
  if (status === "buildable" || level <= 0) return 1;
  return level + 1;
}

export function getCurrentBonus(key: string, level: number, status: BuildingGameStatus): BuildingBonus | null {
  if (status !== "completed" || level <= 0) return null;
  return getLevelConfig(key, level)?.bonus ?? null;
}

export function getPendingBonus(key: string, targetLevel: number): BuildingBonus | null {
  return getLevelConfig(key, targetLevel)?.bonus ?? null;
}

export function formatBuildingCosts(costs: BuildingResourceCost): string[] {
  return (Object.entries(costs) as [BuildingResourceKey, number][])
    .filter(([, n]) => n > 0)
    .map(([k, n]) => `${BUILDING_RESOURCE_META[k].emoji} ${n} ${BUILDING_RESOURCE_META[k].label}`);
}

export function costEntries(costs: BuildingResourceCost): { key: BuildingResourceKey; amount: number }[] {
  return (Object.entries(costs) as [BuildingResourceKey, number | undefined][])
    .filter(([, n]) => (n ?? 0) > 0)
    .map(([key, amount]) => ({ key, amount: amount! }));
}

export function getInitialBuildingState(key: string): { level: number; status: BuildingGameStatus } {
  const def = getBuildingDef(key);
  return {
    level: def?.initialLevel ?? 1,
    status: def?.initialStatus ?? "completed",
  };
}
