import { useState } from "react";
import type { DbSpaceshipPart } from "@/types/phase2-db";
import type { DioramaHangarAssetSlots } from "@/data/dioramaLayouts";
import { resolveHangarSprite, resolveHangarStage } from "@/lib/diorama/dioramaAssets";
import { useResolvedAssetUrl } from "@/hooks/useResolvedAssetUrl";
import { DioramaShipHangar } from "@/components/game/diorama/DioramaShipHangar";
import styles from "@/styles/village-diorama.module.css";

interface Props {
  hangarAssets?: DioramaHangarAssetSlots;
  shipPct: number;
  parts: DbSpaceshipPart[];
  compact?: boolean;
  scale?: number;
  onClick?: () => void;
}

/** Hangar evolutivo — sprite da asset se disponibile, altrimenti fallback CSS navicella */
export function DioramaHangarOverlay({
  hangarAssets,
  shipPct,
  parts,
  compact,
  scale = 1,
  onClick,
}: Props) {
  const stage = resolveHangarStage(shipPct);
  const rawSrc = resolveHangarSprite(hangarAssets, stage);
  const src = useResolvedAssetUrl(rawSrc);
  const [imgFailed, setImgFailed] = useState(false);

  if (src && !imgFailed) {
    return (
      <button
        type="button"
        className={styles.engineHangarSpriteBtn}
        onClick={onClick}
        aria-label={`Hangar — ${stage.replace("_", " ")}, ${shipPct}% riparazione`}
        style={{ transform: `scale(${scale})` }}
      >
        <img
          src={src}
          alt=""
          className={styles.engineHangarSprite}
          onError={() => setImgFailed(true)}
          draggable={false}
        />
      </button>
    );
  }

  return <DioramaShipHangar parts={parts} percent={shipPct} compact={compact} onClick={onClick} />;
}
