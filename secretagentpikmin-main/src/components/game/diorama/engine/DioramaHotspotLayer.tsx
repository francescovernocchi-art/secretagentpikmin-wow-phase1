import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { hapticTap } from "@/lib/haptic";
import { useResolvedAssetUrl } from "@/hooks/useResolvedAssetUrl";
import type { DioramaHotspot } from "@/data/dioramaLayouts";
import styles from "@/styles/village-diorama.module.css";

const KIND_ICON: Record<string, string> = {
  wreck: "🛸",
  rare_flower: "🌸",
  fruit: "🍎",
  cave: "🕳️",
  mission_entrance: "🎯",
  custom: "📍",
};

interface Props {
  hotspots: DioramaHotspot[];
  onShipClick?: () => void;
  editorMode?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
}

export function DioramaHotspotLayer({
  hotspots,
  onShipClick,
  editorMode,
  selectedId,
  onSelect,
}: Props) {
  const visible = hotspots.filter((h) => !h.hidden);

  return (
    <>
      {visible.map((hs) => (
        <HotspotMarker
          key={hs.id}
          hs={hs}
          editorMode={editorMode}
          selectedId={selectedId}
          onSelect={onSelect}
          onShipClick={onShipClick}
        />
      ))}
    </>
  );
}

function HotspotMarker({
  hs,
  editorMode,
  selectedId,
  onSelect,
  onShipClick,
}: {
  hs: DioramaHotspot;
  editorMode?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  onShipClick?: () => void;
}) {
  const spriteUrl = useResolvedAssetUrl(hs.sprite);
  const icon = hs.icon ?? (hs.kind ? KIND_ICON[hs.kind] : "📍");
  const style: React.CSSProperties = {
    left: `${hs.x}%`,
    top: `${hs.y}%`,
    zIndex: hs.z ?? 50,
    width: hs.w ? `${hs.w}%` : undefined,
    height: hs.h ? `${hs.h}%` : undefined,
  };

  const iconContent = spriteUrl ? (
    <img src={spriteUrl} alt="" className={styles.engineHotspotSprite} draggable={false} />
  ) : (
    <span className={styles.engineHotspotIcon}>{icon}</span>
  );

  if (editorMode) {
    return (
      <button
        type="button"
        className={`${styles.engineHotspot} ${styles.engineHotspotEditor} ${selectedId === hs.id ? styles.engineHotspotSelected : ""}`}
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          onSelect?.(hs.id);
        }}
        aria-label={hs.label ?? hs.id}
      >
        {iconContent}
        {hs.label && <span className={styles.engineHotspotLabel}>{hs.label}</span>}
      </button>
    );
  }

  const handleInspect = () => {
    hapticTap();
    toast.message(hs.label ?? hs.id, { description: hs.kind ?? "Punto di interesse" });
  };

  if (hs.action === "ship") {
    return (
      <button
        type="button"
        className={styles.engineHotspot}
        style={style}
        onClick={() => {
          hapticTap();
          onShipClick?.();
        }}
        aria-label={hs.label ?? "Hangar"}
      >
        {iconContent}
      </button>
    );
  }

  if (hs.route) {
    return (
      <Link
        to={hs.route}
        className={styles.engineHotspot}
        style={style}
        onClick={hapticTap}
        aria-label={hs.label ?? hs.id}
      >
        {iconContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={styles.engineHotspot}
      style={style}
      onClick={handleInspect}
      aria-label={hs.label ?? hs.id}
    >
      {iconContent}
    </button>
  );
}
