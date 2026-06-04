import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { hapticBuildingClick } from "@/lib/haptic";
import type { BuildingKey, DioramaBuildingDef } from "./diorama-data";
import styles from "@/styles/village-diorama.module.css";

interface DioramaBuildingProps {
  def: DioramaBuildingDef;
  level: number;
  status?: "active" | "upgrading" | "locked";
  onShipClick?: () => void;
  onBuildingClick?: (key: BuildingKey) => void;
  compact?: boolean;
  labelsOnDemand?: boolean;
}

const posStyle = (def: DioramaBuildingDef): React.CSSProperties => ({
  left: `${def.x}%`,
  top: `${def.y}%`,
  zIndex: def.z,
});

function BuildingSilhouette({
  buildingKey,
  color,
  compact,
}: {
  buildingKey: BuildingKey;
  color: string;
  compact?: boolean;
}) {
  const scaleStyle = compact ? { transform: "scale(0.82)" } : undefined;

  switch (buildingKey) {
    case "accademia":
      return (
        <div
          className={styles.silhouetteAccademia}
          style={{ ["--bld-color" as string]: color, ...scaleStyle }}
          aria-hidden
        >
          <div
            className={styles.silRoof}
            style={{ background: `linear-gradient(135deg, ${color}cc, ${color}55)` }}
          />
          <div className={styles.silWall}>
            <span className={styles.silFlag} style={{ left: "8%" }} />
            <span className={`${styles.silFlag} ${styles.silFlagAlt}`} />
            <span className={styles.silDummy} />
            <span className={styles.silTarget}>🎯</span>
          </div>
          <div className={styles.silYard}>
            <span className={styles.silPole} />
            <span className={styles.silMat}>▭</span>
          </div>
        </div>
      );
    case "laboratorio":
      return (
        <div
          className={styles.silhouetteLab}
          style={{ ["--bld-color" as string]: color, ...scaleStyle }}
          aria-hidden
        >
          <div className={styles.silRoofFlat} style={{ borderColor: color }} />
          <div className={styles.silWall}>
            <span className={styles.silAntenna} />
            <span className={styles.silTube}>🧪</span>
            <span className={styles.silGen} />
            <span className={styles.silLabLight} />
          </div>
          <span className={styles.silLabGlow} />
        </div>
      );
    case "mercato":
      return (
        <div
          className={styles.silhouetteMercato}
          style={{ ["--bld-color" as string]: color, ...scaleStyle }}
          aria-hidden
        >
          <div
            className={styles.silAwning}
            style={{ background: `linear-gradient(180deg, ${color}dd, ${color}88)` }}
          />
          <div className={styles.silWall}>
            <span className={styles.silSign}>MKT</span>
            <span className={styles.silGoods}>🍎</span>
            <span className={`${styles.silGoods} ${styles.silGoodsR}`}>⚡</span>
          </div>
          <div className={styles.silCratesRow}>
            <span>📦</span>
            <span>🧺</span>
          </div>
        </div>
      );
    case "magazzino":
      return (
        <div
          className={styles.silhouetteMagazzino}
          style={{ ["--bld-color" as string]: color, ...scaleStyle }}
          aria-hidden
        >
          <div className={styles.silContainer} style={{ borderColor: color }} />
          <div className={styles.silWallWide}>
            <span className={styles.silPallet}>▬</span>
            <span className={styles.silStack}>📦</span>
          </div>
        </div>
      );
    case "centro_controllo":
      return (
        <div
          className={styles.silhouetteCC}
          style={{ ["--bld-color" as string]: color, ...scaleStyle }}
          aria-hidden
        >
          <div className={styles.silRoofFlat} style={{ borderColor: color }} />
          <span className={styles.silParabolaL} />
          <span className={styles.silParabolaR} />
          <div className={styles.silWall}>
            <span className={styles.silDish} />
            <span className={styles.silRadarSweep} />
            <span className={styles.silSensorTurret} />
            <span className={styles.silDataLink} />
            <span className={styles.silOpLight} />
            <span className={`${styles.silOpLight} ${styles.silOpLightR}`} />
          </div>
          <span className={styles.silTower} />
        </div>
      );
    default:
      return null;
  }
}

export function DioramaBuilding({
  def,
  level,
  status = "active",
  onShipClick,
  onBuildingClick,
  compact,
  labelsOnDemand,
}: DioramaBuildingProps) {
  const [revealed, setRevealed] = useState(false);
  const ariaLabel = `${def.name}, livello ${level}. ${def.role}. Clicca per entrare.`;
  const hidePermanentLabels = labelsOnDemand === true;
  const hasSilhouette = def.key !== "hangar";

  const revealBriefly = useCallback(() => {
    setRevealed(true);
    window.setTimeout(() => setRevealed(false), 2200);
  }, []);

  const inner = (
    <motion.div
      className={`${styles.building} ${status === "locked" ? styles.buildingLocked : ""} ${revealed ? styles.buildingRevealed : ""} ${hasSilhouette ? styles.buildingUnique : ""}`}
      style={{ ["--bld-color" as string]: def.color }}
      whileHover={{ scale: 1.06, y: -3 }}
      whileTap={{ scale: 0.96 }}
    >
      <div className={styles.buildingShadow} aria-hidden />

      {hasSilhouette ? (
        <BuildingSilhouette buildingKey={def.key} color={def.color} compact={compact} />
      ) : (
        <div className={styles.buildingBody}>
          <div
            className={styles.buildingRoof}
            style={{ background: `linear-gradient(135deg, ${def.color}cc, ${def.color}66)` }}
          />
          <div
            className={styles.buildingWall}
            style={{ background: `linear-gradient(180deg, ${def.color}55, ${def.color}22)` }}
          >
            <span className={styles.buildingEmoji} aria-hidden>
              {def.emoji}
            </span>
          </div>
          <div className={styles.buildingBase} aria-hidden />
        </div>
      )}

      {!hidePermanentLabels && !compact && (
        <div className={styles.buildingLabel} aria-hidden>
          <span className={styles.buildingName}>{def.name.split(" ")[0]}</span>
          <span className={styles.buildingLevel}>Lv{level}</span>
        </div>
      )}

      <div className={styles.buildingTooltip} role="tooltip">
        <p className="font-medium">{def.name}</p>
        <p className="text-muted-foreground">
          {def.role} · Lv{level}
        </p>
        <p className="text-primary text-[9px] mt-0.5">Clicca per entrare</p>
      </div>

      {status === "upgrading" && (
        <span className={styles.buildingSpark} aria-hidden>
          ✨
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
          revealBriefly();
          onShipClick?.();
        }}
      >
        {inner}
      </button>
    );
  }

  if (def.route && onBuildingClick) {
    return (
      <button
        type="button"
        onClick={() => {
          hapticBuildingClick();
          revealBriefly();
          onBuildingClick(def.key);
        }}
        className={styles.buildingHit}
        style={posStyle(def)}
        aria-label={ariaLabel}
      >
        {inner}
      </button>
    );
  }

  if (def.route) {
    return (
      <Link
        to={def.route}
        onClick={() => {
          hapticBuildingClick();
          revealBriefly();
        }}
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
