import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { hapticBuildingClick } from "@/lib/haptic";
import type { DioramaBuildingDef } from "./diorama-data";
import {
  getColonyBuildingPresentation,
  type ColonyBuildingStage,
} from "./colonyProgression";
import styles from "@/styles/village-diorama.module.css";
import { BuildingIconSvg } from "@/components/game/assets/GameIcons";

interface DioramaBuildingProps {
  def: DioramaBuildingDef;
  level: number;
  stage: ColonyBuildingStage;
  onShipClick?: () => void;
  compact?: boolean;
}

const posStyle = (def: DioramaBuildingDef): React.CSSProperties => ({
  left: `${def.x}%`,
  top: `${def.y}%`,
  zIndex: def.z,
});

const STAGE_CLASS: Record<ColonyBuildingStage, string> = {
  locked: styles.buildingStageLocked,
  buildable: styles.buildingStageBuildable,
  under_construction: styles.buildingStageConstruction,
  level_1: styles.buildingStageLevel1,
  level_2: styles.buildingStageLevel2,
  level_3: styles.buildingStageLevel3,
  level_4: styles.buildingStageLevel4,
  level_5: styles.buildingStageLevel5,
};

export function DioramaBuilding({ def, level, stage, onShipClick, compact }: DioramaBuildingProps) {
  const presentation = getColonyBuildingPresentation(def, stage);
  const ariaLabel = `${presentation.name}, stato ${presentation.label}. ${presentation.role}. ${presentation.actionLabel}.`;
  const isLocked = stage === "locked";
  const isBuildable = stage === "buildable";
  const isConstruction = stage === "under_construction";

  const inner = (
    <motion.div
      className={`${styles.building} ${STAGE_CLASS[stage]} ${isLocked ? styles.buildingLocked : ""}`}
      style={{ ["--bld-color" as string]: def.color }}
      whileHover={isLocked ? undefined : { scale: 1.08, y: -4 }}
      whileTap={isLocked ? undefined : { scale: 0.96 }}
    >
      <div className={styles.buildingShadow} aria-hidden />

      <div className={styles.buildingBody}>
        {isLocked ? (
          <div className={styles.lockedPlot} aria-hidden>
            <span className={styles.buildingEmoji}>{presentation.emoji}</span>
          </div>
        ) : isBuildable ? (
          <div className={styles.foundationPlot} aria-hidden>
            <span className={styles.foundationStake} />
            <span className={styles.foundationStake} />
            <span className={styles.foundationStake} />
          </div>
        ) : (
          <>
            <div className={styles.buildingRoof} style={{ background: `linear-gradient(135deg, ${def.color}cc, ${def.color}66)` }} />
            <div className={styles.buildingWall} style={{ background: `linear-gradient(180deg, ${def.color}55, ${def.color}22)` }}>
              <span className={styles.buildingEmoji} aria-hidden>{presentation.emoji}</span>
              <div className="absolute inset-0 flex items-center justify-center opacity-50 pointer-events-none">
                <BuildingIconSvg buildingKey={def.key} size={26} color={def.color} />
              </div>
              {isConstruction && <div className={styles.scaffold} aria-hidden />}
            </div>
            <div className={styles.buildingBase} aria-hidden />
          </>
        )}
      </div>

      {!compact && (
        <div className={styles.buildingLabel} aria-hidden>
          <span className={styles.buildingName}>{presentation.name.split(" ")[0]}</span>
          <span className={styles.buildingLevel}>{presentation.label}</span>
        </div>
      )}

      <div className={styles.buildingTooltip} role="tooltip">
        <p className="font-medium">{presentation.name}</p>
        <p className="text-muted-foreground">{presentation.role}{level > 0 ? ` · Lv${level}` : ""}</p>
        <p className="text-primary text-[9px] mt-0.5">{presentation.actionLabel}</p>
      </div>

      {isConstruction && <span className={styles.buildingSpark} aria-hidden>🔨</span>}
    </motion.div>
  );

  if (def.action === "ship") {
    return (
      <button
        type="button"
        className={styles.buildingHit}
        style={posStyle(def)}
        aria-label={ariaLabel}
        onClick={() => { hapticBuildingClick(); onShipClick?.(); }}
      >
        {inner}
      </button>
    );
  }

  if (presentation.route) {
    return (
      <Link
        to={presentation.route}
        onClick={hapticBuildingClick}
        className={styles.buildingHit}
        style={posStyle(def)}
        aria-label={ariaLabel}
      >
        {inner}
      </Link>
    );
  }

  return (
    <div className={`${styles.buildingHit} ${isLocked ? styles.buildingHitLocked : ""}`} style={posStyle(def)} aria-label={ariaLabel}>
      {inner}
    </div>
  );
}
