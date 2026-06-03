import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { hapticBuildingClick } from "@/lib/haptic";
import { DioramaBuilding } from "@/components/game/diorama/DioramaBuilding";
import type { DioramaBuildingDef } from "@/components/game/diorama/diorama-data";
import type { DioramaBuildingVisualState, DioramaLayoutBuilding } from "@/data/dioramaLayouts";
import { layoutBuildingToDef } from "@/data/dioramaLayouts";
import { resolveBuildingSprite } from "@/lib/diorama/dioramaAssets";
import { useResolvedAssetUrl } from "@/hooks/useResolvedAssetUrl";
import styles from "@/styles/village-diorama.module.css";

interface Props {
  layoutBuilding: DioramaLayoutBuilding;
  def: DioramaBuildingDef;
  level: number;
  status?: "active" | "upgrading" | "locked";
  visualState?: DioramaBuildingVisualState;
  compact?: boolean;
  labelsOnDemand?: boolean;
  onShipClick?: () => void;
  onBuildingClick?: (key: string) => void;
  editorMode?: boolean;
  selected?: boolean;
  onSelect?: (key: string) => void;
}

export function DioramaBuildingOverlay({
  layoutBuilding,
  def,
  level,
  status = "active",
  visualState = "level_1",
  compact,
  labelsOnDemand,
  onShipClick,
  onBuildingClick,
  editorMode,
  selected,
  onSelect,
}: Props) {
  const merged = layoutBuildingToDef(layoutBuilding, def) ?? def;
  const scale = layoutBuilding.scale ?? 1;
  const [imgFailed, setImgFailed] = useState(false);
  const rawSprite = layoutBuilding.image ?? resolveBuildingSprite(layoutBuilding.assets, visualState, layoutBuilding.key);
  const spriteSrc = useResolvedAssetUrl(rawSprite);
  const useSprite = Boolean(spriteSrc) && !imgFailed;
  const fallback = layoutBuilding.fallback ?? "silhouette";

  if (layoutBuilding.hidden && !editorMode) return null;

  const posStyle: React.CSSProperties = {
    left: `${merged.x}%`,
    top: `${merged.y}%`,
    zIndex: merged.z,
    opacity: layoutBuilding.hidden ? 0.35 : 1,
  };

  if (editorMode) {
    return (
      <button
        type="button"
        className={`${styles.engineEditorMarker} ${selected ? styles.engineEditorMarkerSelected : ""} ${layoutBuilding.hidden ? styles.engineEditorMarkerHidden : ""}`}
        style={posStyle}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(layoutBuilding.key);
        }}
        aria-label={`Edificio ${def.name}${layoutBuilding.hidden ? " (nascosto)" : ""}`}
      >
        <span className={styles.engineEditorMarkerLabel}>{def.name.split(" ")[0]}</span>
        <span className={styles.engineEditorMarkerDot} />
      </button>
    );
  }

  if (useSprite && spriteSrc) {
    const inner = (
      <motion.div
        className={`${styles.engineBuildingSpriteWrap} ${status === "upgrading" ? styles.engineBuildingUpgrading : ""}`}
        style={{ transform: `translate(-50%, -50%) scale(${scale})` }}
        whileHover={{ scale: scale * 1.06 }}
        whileTap={{ scale: scale * 0.96 }}
      >
        <img
          src={spriteSrc}
          alt=""
          className={styles.engineBuildingSprite}
          onError={() => setImgFailed(true)}
          draggable={false}
        />
        {status === "upgrading" && <span className={styles.buildingSpark} aria-hidden>✨</span>}
        {!labelsOnDemand && !compact && visualState.startsWith("level_") && (
          <span className={styles.engineBuildingBadge}>Lv{level}</span>
        )}
        <div className={styles.buildingTooltip} role="tooltip">
          <p className="font-medium">{def.name}</p>
          <p className="text-muted-foreground">{def.role} · Lv{level}</p>
          <p className="text-primary text-[9px] mt-0.5">Clicca per entrare</p>
        </div>
      </motion.div>
    );

    if (def.action === "ship") {
      return (
        <button type="button" className={styles.engineBuildingHit} style={posStyle} onClick={() => { hapticBuildingClick(); onShipClick?.(); }} aria-label={`${def.name}, livello ${level}`}>
          {inner}
        </button>
      );
    }
    if (def.route && layoutBuilding.clickable !== false && onBuildingClick) {
      return (
        <button
          type="button"
          className={styles.engineBuildingHit}
          style={posStyle}
          onClick={() => { hapticBuildingClick(); onBuildingClick(layoutBuilding.key); }}
          aria-label={`${def.name}, livello ${level}`}
        >
          {inner}
        </button>
      );
    }
    if (def.route && layoutBuilding.clickable !== false) {
      return (
        <Link to={def.route} className={styles.engineBuildingHit} style={posStyle} onClick={hapticBuildingClick} aria-label={`${def.name}, livello ${level}`}>
          {inner}
        </Link>
      );
    }
    return <div className={styles.engineBuildingHit} style={posStyle}>{inner}</div>;
  }

  if (fallback === "emoji") {
    return (
      <DioramaBuilding
        def={{ ...merged, emoji: def.emoji }}
        level={level}
        status={status}
        compact={compact}
        labelsOnDemand={labelsOnDemand}
        onShipClick={onShipClick}
        onBuildingClick={onBuildingClick}
      />
    );
  }

  return (
    <DioramaBuilding
      def={merged}
      level={level}
      status={status}
      compact={compact}
      labelsOnDemand={labelsOnDemand}
      onShipClick={onShipClick}
      onBuildingClick={onBuildingClick}
    />
  );
}
