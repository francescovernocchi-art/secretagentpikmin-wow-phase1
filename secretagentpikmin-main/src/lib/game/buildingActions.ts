import { fetchInventory, removeInventoryQuantity } from "@/lib/game/inventory";
import { localStore } from "@/lib/game/local-store";
import { gameTable, isSupabaseConfigured } from "@/lib/game/db";
import { fetchVillageBuildings } from "@/lib/game/villages";
import type { DbVillageBuilding } from "@/types/phase2-db";
import {
  BUILDING_RESOURCE_META,
  costEntries,
  getBuildingDef,
  getLevelConfig,
  getNextTargetLevel,
  normalizeBuildingStatus,
  type BuildingResourceCost,
} from "@/lib/game/buildingSystem";

export interface BuildingActionResult {
  success: boolean;
  buildings: DbVillageBuilding[];
  message: string;
}

function persistBuildings(villageId: string, buildings: DbVillageBuilding[]): void {
  localStore.setVillageBuildings(villageId, buildings);
}

async function trySyncSupabase(building: DbVillageBuilding): Promise<void> {
  try {
    if (!isSupabaseConfigured()) return;
    await gameTable("village_buildings")
      .update({
        level: building.level,
        status: building.status,
      })
      .eq("id", building.id);
  } catch {
    /* local-first */
  }
}

export async function canAffordCosts(
  agentKey: string,
  costs: BuildingResourceCost,
): Promise<boolean> {
  const { data: inv } = await fetchInventory(agentKey);
  for (const { key, amount } of costEntries(costs)) {
    const itemKey = BUILDING_RESOURCE_META[key].itemKey;
    const item = inv.find((i) => i.item_key === itemKey);
    if (!item || item.quantity < amount) return false;
  }
  return true;
}

async function consumeCosts(agentKey: string, costs: BuildingResourceCost): Promise<boolean> {
  for (const { key, amount } of costEntries(costs)) {
    const ok = await removeInventoryQuantity(agentKey, BUILDING_RESOURCE_META[key].itemKey, amount);
    if (!ok) return false;
  }
  return true;
}

/** Completa costruzioni scadute */
export function applyConstructionTimers(buildings: DbVillageBuilding[]): DbVillageBuilding[] {
  const now = Date.now();
  return buildings.map((b) => {
    const status = normalizeBuildingStatus(b.status);
    if (status !== "under_construction" || !b.build_end_at) return b;
    if (new Date(b.build_end_at).getTime() > now) return b;
    const targetLevel = b.level <= 0 ? 1 : b.level + 1;
    return {
      ...b,
      level: targetLevel,
      status: "completed",
      build_end_at: null,
      started_at: null,
    };
  });
}

export async function refreshVillageBuildings(villageId: string): Promise<DbVillageBuilding[]> {
  const buildings = applyConstructionTimers(await fetchVillageBuildings(villageId));
  persistBuildings(villageId, buildings);
  return buildings;
}

export async function startBuildingAction(opts: {
  villageId: string;
  agentKey: string;
  buildingKey: string;
  action: "build" | "upgrade";
}): Promise<BuildingActionResult> {
  const buildings = await refreshVillageBuildings(opts.villageId);
  const idx = buildings.findIndex((b) => b.building_key === opts.buildingKey);
  if (idx < 0) return { success: false, buildings, message: "Edificio non trovato" };

  const building = buildings[idx];
  const def = getBuildingDef(opts.buildingKey);
  if (!def) return { success: false, buildings, message: "Config edificio mancante" };

  const status = normalizeBuildingStatus(building.status);
  if (status === "under_construction") {
    return { success: false, buildings, message: "Costruzione già in corso" };
  }
  if (status === "locked") {
    return { success: false, buildings, message: "Edificio bloccato" };
  }

  const targetLevel = getNextTargetLevel(building.level, status);
  if (targetLevel > def.maxLevel) {
    return { success: false, buildings, message: "Livello massimo raggiunto" };
  }

  const levelCfg = getLevelConfig(opts.buildingKey, targetLevel);
  if (!levelCfg) return { success: false, buildings, message: "Config livello mancante" };

  if (opts.action === "build" && status !== "buildable" && building.level > 0) {
    return { success: false, buildings, message: "Edificio già costruito — usa Migliora" };
  }
  if (opts.action === "upgrade" && (status === "buildable" || building.level <= 0)) {
    return { success: false, buildings, message: "Costruisci prima l'edificio" };
  }

  const affordable = await canAffordCosts(opts.agentKey, levelCfg.costs);
  if (!affordable) return { success: false, buildings, message: "Risorse insufficienti" };

  const consumed = await consumeCosts(opts.agentKey, levelCfg.costs);
  if (!consumed) return { success: false, buildings, message: "Errore consumo risorse" };

  const now = new Date();
  const end = new Date(now.getTime() + levelCfg.buildTimeSec * 1000);
  const updated: DbVillageBuilding = {
    ...building,
    status: "under_construction",
    build_end_at: end.toISOString(),
    started_at: now.toISOString(),
  };
  buildings[idx] = updated;
  persistBuildings(opts.villageId, buildings);
  await trySyncSupabase(updated);

  const verb = opts.action === "build" ? "Costruzione" : "Miglioramento";
  return {
    success: true,
    buildings,
    message: `${verb} ${def.name} → Lv${targetLevel} avviato (${levelCfg.buildTimeSec}s)`,
  };
}

export async function completeBuildingNow(
  villageId: string,
  buildingKey: string,
): Promise<BuildingActionResult> {
  const buildings = await fetchVillageBuildings(villageId);
  const idx = buildings.findIndex((b) => b.building_key === buildingKey);
  if (idx < 0) return { success: false, buildings, message: "Edificio non trovato" };

  const b = buildings[idx];
  const status = normalizeBuildingStatus(b.status);
  if (status !== "under_construction") {
    return { success: false, buildings, message: "Nessuna costruzione in corso" };
  }

  const targetLevel = b.level <= 0 ? 1 : b.level + 1;
  const updated: DbVillageBuilding = {
    ...b,
    level: targetLevel,
    status: "completed",
    build_end_at: null,
    started_at: null,
  };
  buildings[idx] = updated;
  persistBuildings(villageId, buildings);
  await trySyncSupabase(updated);

  return { success: true, buildings, message: `${updated.name} completato · Lv${targetLevel}` };
}
