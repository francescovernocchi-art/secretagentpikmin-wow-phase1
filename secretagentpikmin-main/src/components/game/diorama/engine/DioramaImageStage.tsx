import { useMemo } from "react";
import type { PointerEvent } from "react";
import { useResolvedAssetUrl } from "@/hooks/useResolvedAssetUrl";
import { DioramaTechCrew } from "@/components/game/diorama/DioramaTechCrew";
import { DioramaPikminActor } from "@/components/game/diorama/DioramaPikminActor";
import { DioramaBuildingOverlay } from "./DioramaBuildingOverlay";
import { DioramaEffectsLayer } from "./DioramaEffectsLayer";
import { PikminTrafficLayer, PikminTrafficDebugOverlay, generateTrafficAgents } from "./PikminTrafficLayer";
import { DioramaHotspotLayer } from "./DioramaHotspotLayer";
import { DioramaHangarOverlay } from "./DioramaHangarOverlay";
import { DioramaRoadPreview } from "./DioramaRoadPreview";
import type { DioramaEngineSceneProps } from "./DioramaEngine";
import styles from "@/styles/village-diorama.module.css";

/** Stage con sfondo immagine — solo posizionamento overlay */
export function DioramaImageStage({
  layout,
  compact,
  isHero,
  sceneBuildings,
  hangarDef,
  parts,
  shipPct,
  visiblePikmin,
  trafficSize,
  labelsOnDemand,
  onShipClick,
  fullscreenMode,
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
}: DioramaEngineSceneProps) {
  const hangarLayout = layout.buildings.find((b) => b.key === "hangar");
  const bgSrc = useResolvedAssetUrl(layout.backgroundImage);

  const handleStageClick = (e: PointerEvent<HTMLDivElement>) => {
    if (!editorMode || !onStageClick) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 1000) / 10;
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 1000) / 10;
    onStageClick(x, y);
  };

  const showRoads = editorMode;
  const debugAgents = useMemo(
    () => (trafficDebug || (editorMode && editorSection === "traffic") ? generateTrafficAgents(layout, trafficAgentCount) : []),
    [trafficDebug, editorMode, editorSection, layout, trafficAgentCount],
  );

  return (
    <div className={styles.engineStage} onClick={handleStageClick}>
      {bgSrc && (
        <img src={bgSrc} alt="" className={styles.engineBackground} draggable={false} />
      )}

      {layout.layers.map((layer) =>
        layer.image ? (
          <LayerImage key={layer.id} src={layer.image} z={layer.z} opacity={layer.opacity} />
        ) : null,
      )}

      <DioramaEffectsLayer effects={layout.effects} />

      {showRoads && (
        <DioramaRoadPreview
          roads={layout.roadNetwork ?? []}
          editorMode={editorMode}
          selectedRoadId={editorSection === "roads" ? selectedRoadId : null}
          onSelectRoad={onSelectRoad}
        />
      )}

      <DioramaHotspotLayer
        hotspots={layout.hotspots}
        onShipClick={onShipClick}
        editorMode={editorMode}
        selectedId={editorSection === "hotspots" ? selectedHotspotId : null}
        onSelect={onSelectHotspot}
      />

      {sceneBuildings.map(({ def, level, status, visualState }) => {
        const lb = layout.buildings.find((b) => b.key === def.key) ?? {
          key: def.key,
          x: def.x,
          y: def.y,
          z: def.z,
        };
        return (
          <DioramaBuildingOverlay
            key={def.key}
            layoutBuilding={lb}
            def={def}
            level={level}
            status={status}
            visualState={visualState}
            compact={compact}
            labelsOnDemand={labelsOnDemand}
            onShipClick={onShipClick}
            editorMode={editorMode && editorSection === "buildings"}
            selected={selectedBuildingKey === def.key}
            onSelect={onSelectBuilding}
          />
        );
      })}

      <div
        className={styles.hangarAnchor}
        style={{
          left: `${hangarLayout?.x ?? hangarDef.x}%`,
          top: `${hangarLayout?.y ?? hangarDef.y}%`,
          zIndex: hangarLayout?.z ?? hangarDef.z,
          transform: hangarLayout?.scale ? `translate(-50%, -52%) scale(${hangarLayout.scale})` : undefined,
        }}
      >
        {editorMode && editorSection === "buildings" ? (
          <DioramaBuildingOverlay
            layoutBuilding={hangarLayout ?? { key: "hangar", x: hangarDef.x, y: hangarDef.y, z: hangarDef.z }}
            def={hangarDef}
            level={1}
            editorMode
            selected={selectedBuildingKey === "hangar"}
            onSelect={onSelectBuilding}
          />
        ) : (
          <DioramaHangarOverlay
            hangarAssets={layout.hangarAssets}
            shipPct={shipPct}
            parts={parts}
            compact={compact && !isHero}
            scale={hangarLayout?.scale ?? 1}
            onClick={onShipClick}
          />
        )}
      </div>

      {( !editorMode || (editorMode && editorSection === "traffic")) && (
        <>
          {!editorMode && (
            <>
              <DioramaTechCrew compact={compact && !isHero} hideRoles={isHero} />
              {visiblePikmin.map((p, i) => (
                <DioramaPikminActor key={p.id} pikmin={p} index={i} compact={compact} hideBadges={fullscreenMode || isHero} />
              ))}
            </>
          )}
          <PikminTrafficLayer
            layout={layout}
            compact={compact}
            size={trafficSize}
            debug={trafficDebug || (editorMode && editorSection === "traffic")}
            agentCount={trafficAgentCount}
          />
          {(trafficDebug || (editorMode && editorSection === "traffic")) && debugAgents.length > 0 && (
            <PikminTrafficDebugOverlay layout={layout} agents={debugAgents} />
          )}
        </>
      )}

      {editorMode && clickMarker && (
        <div
          className={styles.engineClickMarker}
          style={{ left: `${clickMarker.x}%`, top: `${clickMarker.y}%` }}
          aria-hidden
        />
      )}

      {editorMode &&
        layout.pikminRoutes.flatMap((r) =>
          r.waypoints.map((w, i) => (
            <div
              key={`${r.id}-${i}`}
              className={styles.engineRouteDot}
              style={{ left: `${w.x}%`, top: `${w.y}%` }}
              title={`${r.id} #${i + 1}`}
              aria-hidden
            />
          )),
        )}
    </div>
  );
}

function LayerImage({ src, z, opacity }: { src: string; z: number; opacity?: number }) {
  const resolved = useResolvedAssetUrl(src);
  if (!resolved) return null;
  return (
    <img
      src={resolved}
      alt=""
      className={styles.engineLayer}
      style={{ zIndex: z, opacity: opacity ?? 1 }}
      draggable={false}
    />
  );
}
