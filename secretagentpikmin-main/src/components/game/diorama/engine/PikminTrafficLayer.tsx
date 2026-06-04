import { memo, useMemo } from "react";
import type { DioramaLayout } from "@/data/dioramaLayouts";
import {
  buildTrafficStylesheet,
  CARGO_ICON,
  generateTrafficAgents,
  PIKMIN_TINT,
  readTrafficCountOverride,
  taskToAnimation,
  type PikminTrafficAgent,
} from "@/lib/diorama/pikminTraffic";
import styles from "@/styles/village-diorama.module.css";

interface Props {
  layout: DioramaLayout;
  compact?: boolean;
  size?: number;
  /** Override conteggio agenti (editor debug) */
  agentCount?: number;
  debug?: boolean;
}

function TrafficAgent({
  agent,
  size,
  debug,
}: {
  agent: PikminTrafficAgent;
  size: number;
  debug?: boolean;
}) {
  const anim = taskToAnimation(agent.currentTask);
  const showCargo = agent.currentTask === "carry" && agent.cargo;

  return (
    <div
      className={`${styles.trafficAgent} ${debug ? styles.trafficAgentDebug : ""}`}
      style={{
        animation: `${agent.cssId} ${agent.duration}s linear infinite`,
        animationDelay: `${agent.delay}s`,
        zIndex: 58 + (agent.id.charCodeAt(6) % 8),
      }}
      aria-hidden={!debug}
      title={
        debug
          ? `${agent.id} · ${agent.currentTask} · ${agent.homeStructure}→${agent.destination}`
          : undefined
      }
    >
      <span className={styles.pikminShadow} />
      <span
        className={`${styles.trafficAgentBody} ${styles[`trafficAnim_${anim}`]}`}
        style={{
          width: size,
          height: Math.round(size * 1.15),
          background: PIKMIN_TINT[agent.type] ?? "#94a3b8",
        }}
      />
      {showCargo && agent.cargo && (
        <span className={styles.trafficCargo} aria-hidden>
          {CARGO_ICON[agent.cargo]}
        </span>
      )}
      {debug && <span className={styles.trafficAgentLabel}>{agent.currentTask}</span>}
    </div>
  );
}

const MemoAgent = memo(TrafficAgent);

export function PikminTrafficLayer({ layout, compact, size = 20, agentCount, debug }: Props) {
  const count = agentCount ?? readTrafficCountOverride() ?? undefined;
  const maxAgents = compact
    ? Math.min(12, layout.trafficConfig?.maxCount ?? 30)
    : (layout.trafficConfig?.maxCount ?? 30);
  const effectiveCount = Math.min(maxAgents, count ?? layout.trafficConfig?.initialCount ?? 10);

  const agents = useMemo(
    () => generateTrafficAgents(layout, effectiveCount),
    [layout, effectiveCount],
  );

  const sheet = useMemo(() => buildTrafficStylesheet(agents), [agents]);
  const agentSize = compact ? Math.max(14, size - 4) : size;

  if (agents.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: sheet }} />
      {agents.map((agent) => (
        <MemoAgent key={agent.id} agent={agent} size={agentSize} debug={debug} />
      ))}
    </>
  );
}

/** Overlay debug — route e destinazioni */
export function PikminTrafficDebugOverlay({
  agents,
}: {
  layout: DioramaLayout;
  agents: PikminTrafficAgent[];
}) {
  return (
    <div className={styles.trafficDebugOverlay} aria-hidden>
      <svg className={styles.trafficDebugSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
        {agents.map((a) => (
          <polyline
            key={a.id}
            points={a.waypoints.map((w) => `${w.x},${w.y}`).join(" ")}
            className={styles.trafficDebugLine}
            fill="none"
          />
        ))}
      </svg>
      {agents.map((a) => {
        const dest = a.waypoints[Math.floor(a.waypoints.length / 2)] ?? a.waypoints[0];
        if (!dest) return null;
        return (
          <div
            key={`dest-${a.id}`}
            className={styles.trafficDebugDest}
            style={{ left: `${dest.x}%`, top: `${dest.y}%` }}
            title={`${a.id}: ${a.homeStructure} → ${a.destination}`}
          />
        );
      })}
    </div>
  );
}

export { generateTrafficAgents };
