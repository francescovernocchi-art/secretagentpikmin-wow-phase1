import type { DbVillageBuilding } from "@/types/phase2-db";
import type { BuildingKey, DioramaBuildingDef } from "./diorama-data";

export type ColonyBuildingStage =
  | "locked"
  | "buildable"
  | "under_construction"
  | "level_1"
  | "level_2"
  | "level_3"
  | "level_4"
  | "level_5";

export interface ColonyBuildingPresentation {
  name: string;
  emoji: string;
  role: string;
  label: string;
  actionLabel: string;
  route?: string;
  accessible: boolean;
}

const ARRIVAL_STAGE_BY_KEY: Partial<Record<BuildingKey, ColonyBuildingStage>> = {
  hangar: "under_construction",
  accademia: "locked",
  laboratorio: "under_construction",
  mercato: "buildable",
};

const ARRIVAL_PRESENTATION: Partial<
  Record<BuildingKey, Partial<Record<ColonyBuildingStage, Partial<ColonyBuildingPresentation>>>>
> = {
  centro_controllo: {
    level_1: {
      name: "Capsula comando",
      emoji: "🛸",
      role: "Comando provvisorio appena atterrato",
      label: "Capsula",
      actionLabel: "Entra nella capsula",
    },
  },
  magazzino: {
    level_1: {
      name: "Piccolo deposito",
      emoji: "📦",
      role: "Cassoni e risorse recuperate",
      label: "Deposito",
      actionLabel: "Apri deposito",
    },
  },
  accademia: {
    locked: {
      name: "Area accademia",
      emoji: "🔒",
      role: "Area bloccata: servono risorse e spazio sicuro",
      label: "Bloccata",
      actionLabel: "Area bloccata",
    },
  },
  laboratorio: {
    under_construction: {
      name: "Cantiere laboratorio",
      emoji: "🏗️",
      role: "Sagoma tecnica in montaggio",
      label: "Cantiere",
      actionLabel: "Controlla il cantiere",
    },
  },
  mercato: {
    buildable: {
      name: "Fondamenta mercato",
      emoji: "🪵",
      role: "Fondamenta pronte, mercato non costruito",
      label: "Fondamenta",
      actionLabel: "Vai agli edifici",
    },
  },
  hangar: {
    under_construction: {
      name: "Navicella danneggiata",
      emoji: "🚀",
      role: "Relitto da riparare pezzo dopo pezzo",
      label: "Danneggiata",
      actionLabel: "Apri riparazioni",
    },
  },
};

function stageFromLevel(level: number): ColonyBuildingStage {
  const safeLevel = Math.min(5, Math.max(1, Math.round(level)));
  return `level_${safeLevel}` as ColonyBuildingStage;
}

export function resolveColonyBuildingStage(
  def: DioramaBuildingDef,
  building?: DbVillageBuilding,
): ColonyBuildingStage {
  const status = building?.status;
  const level = building?.level ?? 0;

  if (status === "locked" || status === "buildable" || status === "under_construction")
    return status;
  if (status === "building" || status === "upgrading") return "under_construction";
  if (status?.startsWith("level_")) return status as ColonyBuildingStage;

  if (level <= 0) return ARRIVAL_STAGE_BY_KEY[def.key] ?? "buildable";

  // Legacy seed rows marked every structure as active Lv1. Keep the arrival fantasy
  // until real progression pushes these structures beyond the initial placeholder.
  if (
    (status === "active" || status === "idle" || !status) &&
    level <= 1 &&
    ARRIVAL_STAGE_BY_KEY[def.key]
  ) {
    return ARRIVAL_STAGE_BY_KEY[def.key]!;
  }

  return stageFromLevel(level);
}

export function getColonyBuildingPresentation(
  def: DioramaBuildingDef,
  stage: ColonyBuildingStage,
): ColonyBuildingPresentation {
  const level = stage.startsWith("level_") ? Number(stage.replace("level_", "")) : 0;
  const override = ARRIVAL_PRESENTATION[def.key]?.[stage] ?? {};
  const isAccessible = level > 0 && stage !== "locked";
  const route = isAccessible
    ? def.route
    : stage === "buildable" || stage === "under_construction"
      ? "/villaggio/edifici"
      : undefined;

  return {
    name: override.name ?? def.name,
    emoji: override.emoji ?? def.emoji,
    role: override.role ?? def.role,
    label:
      override.label ?? (level > 0 ? `Lv${level}` : stage === "buildable" ? "Pronto" : "Cantiere"),
    actionLabel:
      override.actionLabel ?? (isAccessible ? "Clicca per entrare" : "Cresce con la colonia"),
    route,
    accessible: !!route,
  };
}

export function isOperationalColonyStage(stage: ColonyBuildingStage): boolean {
  return stage.startsWith("level_");
}
