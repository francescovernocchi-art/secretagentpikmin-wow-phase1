import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { hapticBuildingClick } from "@/lib/haptic";
import type { DioramaBuildingDef } from "./diorama-data";
import styles from "@/styles/village-diorama.module.css";

export type DioramaBuildingState =
  | "locked"
  | "buildable"
  | "under_construction"
  | "level_1"
  | "level_2"
  | "level_3"
  | "level_4"
  | "level_5";

interface DioramaBuildingProps {
  def: DioramaBuildingDef;
  level: number;
  state: DioramaBuildingState;
  progress?: number;
  canUpgrade?: boolean;
  onShipClick?: () => void;
  compact?: boolean;
}

const posStyle = (def: DioramaBuildingDef): React.CSSProperties => ({
  left: `${def.x}%`,
  top: `${def.y}%`,
  zIndex: def.z,
});

const stateLabel: Record<DioramaBuildingState, string> = {
  locked: "Bloccato",
  buildable: "Costruibile",
  under_construction: "In costruzione",
  level_1: "Livello 1",
  level_2: "Livello 2",
  level_3: "Livello 3",
  level_4: "Livello 4",
  level_5: "Livello 5",
};

function isBuilt(state: DioramaBuildingState) {
  return state.startsWith("level_");
}

function BuildingStructure({
  def,
  state,
}: {
  def: DioramaBuildingDef;
  state: DioramaBuildingState;
}) {
  if (state === "locked") {
    return (
      <div className={styles.lockedPlot} aria-hidden>
        <div className={styles.lockedFence} />
        <div className={`${styles.buildingSilhouette} ${styles[`variant_${def.variant}`]}`} />
        <div className={styles.lockedSign}>REQ</div>
      </div>
    );
  }

  if (state === "buildable") {
    return (
      <div className={styles.buildablePlot} aria-hidden>
        <div className={styles.foundationGrid} />
        <div className={styles.materialStack}>
          <span />
          <span />
          <span />
        </div>
        <div className={styles.buildSign}>costruisci</div>
      </div>
    );
  }

  if (state === "under_construction") {
    return (
      <div className={styles.constructionPlot} aria-hidden>
        <div className={styles.constructionLight} />
        <div className={`${styles.partialBuilding} ${styles[`variant_${def.variant}`]}`}>
          <div className={styles.partialWall} />
          <div className={styles.scaffoldLeft} />
          <div className={styles.scaffoldRight} />
        </div>
        <div className={styles.crateStack}>
          <span />
          <span />
        </div>
        <div className={styles.workerPikmin}>
          <span />
          <span />
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.buildingBody} ${styles[`variant_${def.variant}`]}`} aria-hidden>
      <div className={styles.buildingRoof} />
      <div className={styles.buildingWall}>
        <span className={styles.windowDot} />
        <span className={styles.windowDot} />
        <span className={styles.windowDot} />
      </div>
      <div className={styles.buildingDoor} />
      <div className={styles.buildingBase} />
      <div className={styles.buildingAntenna} />
      <div className={styles.levelDetails}>
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}

export function DioramaBuilding({
  def,
  level,
  state,
  progress = 0,
  canUpgrade = false,
  onShipClick,
  compact,
}: DioramaBuildingProps) {
  const built = isBuilt(state);
  const ariaLabel = `${def.name}, ${stateLabel[state]}. ${def.role}. Clicca per entrare.`;
  const progressValue = Math.max(12, Math.min(100, progress));

  const inner = (
    <motion.div
      className={`${styles.building} ${styles[`state_${state}`]} ${built && level >= 4 ? styles.buildingHero : ""}`}
      style={{
        ["--bld-color" as string]: def.color,
        ["--progress" as string]: `${progressValue}%`,
      }}
      whileHover={{ scale: 1.08, y: -4 }}
      whileTap={{ scale: 0.96 }}
    >
      <div className={styles.buildingShadow} aria-hidden />
      <BuildingStructure def={def} state={state} />

      {!compact && (
        <div className={styles.buildingLabel} aria-hidden>
          <span className={styles.buildingName}>{def.name.split(" ")[0]}</span>
          <span className={styles.buildingLevel}>{built ? `Lv${level}` : stateLabel[state]}</span>
        </div>
      )}

      <div className={styles.buildingTooltip} role="tooltip">
        <p className="font-medium">{def.name}</p>
        <p className="text-muted-foreground">
          {def.role} · {built ? `Lv${level}` : stateLabel[state]}
        </p>
        {!built && <p className="text-amber-200 text-[9px] mt-0.5">{def.requirement}</p>}
        {built && canUpgrade && <p className="text-primary text-[9px] mt-0.5">Può migliorare</p>}
        <p className="text-primary text-[9px] mt-0.5">Clicca per entrare</p>
      </div>

      {state === "under_construction" && (
        <div className={styles.buildProgressBar} aria-hidden>
          <span />
        </div>
      )}
      {built && canUpgrade && (
        <span className={styles.upgradeBeacon} aria-hidden>
          +
        </span>
      )}
    </motion.div>
  );

  if (def.action === "ship") {
    return (
      <button
        type="button"
        className={styles.buildingHit}
        style={posStyle(def)}
        aria-label={ariaLabel}
        onClick={() => {
          hapticBuildingClick();
          onShipClick?.();
        }}
      >
        {inner}
      </button>
    );
  }

  if (def.route) {
    return (
      <Link
        to={def.route}
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
    <div className={styles.buildingHit} style={posStyle(def)} aria-label={ariaLabel}>
      {inner}
    </div>
  );
}
