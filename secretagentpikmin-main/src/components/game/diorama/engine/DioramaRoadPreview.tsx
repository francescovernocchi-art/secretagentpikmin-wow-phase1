import type { DioramaRoad } from "@/data/dioramaLayouts";
import styles from "@/styles/village-diorama.module.css";

const ROAD_CLASS: Record<string, string> = {
  main: styles.engineRoadMain,
  forest_trail: styles.engineRoadForest,
  hangar_path: styles.engineRoadHangar,
};

interface Props {
  roads: DioramaRoad[];
  editorMode?: boolean;
  selectedRoadId?: string | null;
  onSelectRoad?: (id: string) => void;
}

/** Preview rete strade — editor; percorsi Pikmin futuri */
export function DioramaRoadPreview({ roads, editorMode, selectedRoadId, onSelectRoad }: Props) {
  const visible = roads.filter((r) => r.enabled !== false && !r.hidden);

  return (
    <>
      {visible.map((road) => {
        const roadClass = ROAD_CLASS[road.type] ?? styles.engineRoadMain;
        const selected = editorMode && selectedRoadId === road.id;
        const points = road.waypoints.map((w) => `${w.x},${w.y}`).join(" ");

        return (
          <div
            key={road.id}
            className={`${styles.engineRoadGroup} ${selected ? styles.engineRoadSelected : ""}`}
            onClick={
              editorMode
                ? (e) => {
                    e.stopPropagation();
                    onSelectRoad?.(road.id);
                  }
                : undefined
            }
            role={editorMode ? "button" : undefined}
            aria-label={editorMode ? road.id : undefined}
          >
            {points.length > 0 && (
              <svg
                className={styles.engineRoadSvg}
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                aria-hidden
              >
                <polyline
                  points={points}
                  className={`${styles.engineRoadPolyline} ${roadClass}`}
                  fill="none"
                />
              </svg>
            )}
            {editorMode &&
              road.waypoints.map((w, i) => (
                <span
                  key={`${road.id}-${i}`}
                  className={`${styles.engineRoadDot} ${roadClass}`}
                  style={{ left: `${w.x}%`, top: `${w.y}%` }}
                  title={`${road.id} #${i + 1}`}
                  aria-hidden
                />
              ))}
          </div>
        );
      })}
    </>
  );
}
