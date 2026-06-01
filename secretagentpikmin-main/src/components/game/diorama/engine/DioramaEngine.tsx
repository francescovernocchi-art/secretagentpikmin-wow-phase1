import type { ReactNode } from "react";
import type { DioramaLayout } from "@/data/dioramaLayouts";
import type { DioramaBuildingVisualState } from "@/data/dioramaLayouts";
import type { BiomeTheme } from "@/components/game/diorama/diorama-data";
import type { DioramaBuildingDef } from "@/components/game/diorama/diorama-data";
import type { PikminUnit } from "@/types/secretPikmin";
import type { DbSpaceshipPart } from "@/types/phase2-db";
import { DioramaCssFallback } from "./DioramaCssFallback";
import { DioramaImageStage } from "./DioramaImageStage";

export interface DioramaSceneBuilding {
  def: DioramaBuildingDef;
  level: number;
  status: "active" | "upgrading" | "locked";
  visualState?: DioramaBuildingVisualState;
}

export interface DioramaEngineSceneProps {
  layout: DioramaLayout;
  mode: "image" | "css";
  theme: BiomeTheme;
  compact?: boolean;
  isHero?: boolean;
  fullscreenMode?: boolean;
  sceneBuildings: DioramaSceneBuilding[];
  hangarDef: DioramaBuildingDef;
  parts: DbSpaceshipPart[];
  shipPct: number;
  visiblePikmin: PikminUnit[];
  loading: boolean;
  trafficSize: number;
  labelsOnDemand?: boolean;
  onShipClick: () => void;
  ariaLabel: string;
  editorMode?: boolean;
  editorSection?: "buildings" | "hotspots" | "roads" | "traffic";
  selectedBuildingKey?: string | null;
  selectedHotspotId?: string | null;
  selectedRoadId?: string | null;
  onSelectBuilding?: (key: string) => void;
  onSelectHotspot?: (id: string) => void;
  onSelectRoad?: (id: string) => void;
  onStageClick?: (x: number, y: number) => void;
  clickMarker?: { x: number; y: number } | null;
  trafficDebug?: boolean;
  trafficAgentCount?: number;
}

interface DioramaEngineProps extends DioramaEngineSceneProps {
  sceneClassName: string;
  children?: ReactNode;
}

export function DioramaEngine({
  mode,
  sceneClassName,
  children,
  editorMode,
  editorSection,
  selectedBuildingKey,
  selectedHotspotId,
  selectedRoadId,
  onSelectBuilding,
  onSelectHotspot,
  onSelectRoad,
  onStageClick,
  clickMarker,
  trafficDebug,
  trafficAgentCount,
  ...scene
}: DioramaEngineProps) {
  const editorProps = {
    editorMode,
    editorSection,
    selectedBuildingKey,
    selectedHotspotId,
    selectedRoadId,
    onSelectBuilding,
    onSelectHotspot,
    onSelectRoad,
    onStageClick,
    clickMarker,
    trafficDebug,
    trafficAgentCount,
  };
  return (
    <div className={sceneClassName} role="img" aria-label={scene.ariaLabel}>
      {mode === "image" ? (
        <DioramaImageStage {...scene} {...editorProps} />
      ) : (
        <DioramaCssFallback {...scene} {...editorProps} />
      )}
      {children}
    </div>
  );
}
