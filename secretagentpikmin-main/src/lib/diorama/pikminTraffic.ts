import type {
  DioramaHotspot,
  DioramaLayout,
  DioramaLayoutBuilding,
  DioramaPoint,
  DioramaPikminType,
  DioramaRoad,
} from "@/data/dioramaLayouts";

/** Compiti agente traffico colonia */
export type PikminAgentTask = "walk" | "carry" | "work" | "idle" | "gather";

/** Oggetti trasportati (visual feedback) */
export type PikminCargoType = "seed" | "leaf" | "fruit" | "metal";

export interface DioramaTrafficPattern {
  id: string;
  /** Edificio o zone id (es. piazza, mercato) */
  from: string;
  to: string;
  task: PikminAgentTask;
  cargo?: PikminCargoType;
  label?: string;
}

export interface DioramaTrafficConfig {
  initialCount?: number;
  maxCount?: number;
  patterns?: DioramaTrafficPattern[];
}

/** Agente Pikmin runtime — generato automaticamente */
export interface PikminTrafficAgent {
  id: string;
  type: DioramaPikminType;
  currentTask: PikminAgentTask;
  routeId: string;
  homeStructure: string;
  destination: string;
  waypoints: DioramaPoint[];
  duration: number;
  delay: number;
  cargo?: PikminCargoType;
  cssId: string;
}

export const PIKMIN_TRAFFIC_STORAGE_KEY = "secret-pikmin-traffic-count";

export const CARGO_ICON: Record<PikminCargoType, string> = {
  seed: "🌱",
  leaf: "🍃",
  fruit: "🍎",
  metal: "⚙️",
};

export const PIKMIN_TINT: Record<DioramaPikminType, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  yellow: "#eab308",
  white: "#f8fafc",
  purple: "#a855f7",
  rock: "#78716c",
  wing: "#38bdf8",
};

const PIKMIN_TYPES: DioramaPikminType[] = ["red", "yellow", "blue", "white", "purple", "rock"];

/** Pattern traffico Bosco Lorenzo — Serra mappata su mercato (proxy) */
export const DEFAULT_BOSCO_TRAFFIC_PATTERNS: DioramaTrafficPattern[] = [
  { id: "tp-serra-magazzino", from: "mercato", to: "magazzino", task: "carry", cargo: "seed", label: "Serra → Magazzino" },
  { id: "tp-magazzino-hangar", from: "magazzino", to: "hangar", task: "carry", cargo: "metal" },
  { id: "tp-accademia-piazza", from: "accademia", to: "piazza", task: "walk" },
  { id: "tp-laboratorio-piazza", from: "laboratorio", to: "piazza", task: "work" },
  { id: "tp-gather-flower", from: "accademia", to: "hs-flower", task: "gather", cargo: "leaf" },
  { id: "tp-gather-fruit", from: "magazzino", to: "hs-fruit", task: "gather", cargo: "fruit" },
  { id: "tp-idle-plaza", from: "piazza", to: "piazza", task: "idle" },
];

function resolvePoint(
  layout: DioramaLayout,
  key: string,
  buildings: DioramaLayoutBuilding[],
  hotspots: DioramaHotspot[],
): DioramaPoint {
  const b = buildings.find((x) => x.key === key);
  if (b) return { x: b.x, y: b.y };
  const z = layout.zones?.find((x) => x.id === key);
  if (z) return { x: z.x, y: z.y };
  const hs = hotspots.find((x) => x.id === key);
  if (hs) return { x: hs.x, y: hs.y };
  return { x: 50, y: 42 };
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function midpoint(a: DioramaPoint, b: DioramaPoint): DioramaPoint {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

/** Usa road network se collega due aree, altrimenti via piazza */
function pathViaRoads(
  layout: DioramaLayout,
  from: DioramaPoint,
  to: DioramaPoint,
  roundTrip: boolean,
): DioramaPoint[] {
  const roads = (layout.roadNetwork ?? []).filter((r) => r.enabled !== false && !r.hidden);
  const plaza = resolvePoint(layout, "piazza", layout.buildings, layout.hotspots);

  const best = pickBestRoad(roads, from, to);
  if (best && best.length >= 2) {
    const forward = orientRoad(best, from, to);
    if (roundTrip) return [...forward, ...forward.slice(0, -1).reverse()];
    return forward;
  }

  const via = midpoint(from, to);
  const path = [from, { x: lerp(from.x, via.x, 0.5), y: lerp(from.y, plaza.y, 0.4) }, to];
  if (roundTrip) return [...path, ...path.slice(0, -1).reverse()];
  return path;
}

function pickBestRoad(roads: DioramaRoad[], from: DioramaPoint, to: DioramaPoint): DioramaPoint[] | null {
  let best: DioramaRoad | null = null;
  let bestScore = Infinity;
  for (const road of roads) {
    if (road.waypoints.length < 2) continue;
    const d0 = dist(from, road.waypoints[0]) + dist(to, road.waypoints[road.waypoints.length - 1]);
    const d1 = dist(from, road.waypoints[road.waypoints.length - 1]) + dist(to, road.waypoints[0]);
    const score = Math.min(d0, d1);
    if (score < bestScore) {
      bestScore = score;
      best = road;
    }
  }
  return best?.waypoints ?? null;
}

function orientRoad(waypoints: DioramaPoint[], from: DioramaPoint, to: DioramaPoint): DioramaPoint[] {
  const dStart = dist(from, waypoints[0]) + dist(to, waypoints[waypoints.length - 1]);
  const dEnd = dist(from, waypoints[waypoints.length - 1]) + dist(to, waypoints[0]);
  const wps = dStart <= dEnd ? waypoints : [...waypoints].reverse();
  return [from, ...wps, to];
}

function dist(a: DioramaPoint, b: DioramaPoint) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function idleLoop(home: DioramaPoint, seed: number): DioramaPoint[] {
  const r = 3 + (seed % 3);
  const a = seed * 0.7;
  return [
    home,
    { x: home.x + Math.cos(a) * r, y: home.y + Math.sin(a) * r },
    { x: home.x + Math.cos(a + 1.2) * r, y: home.y + Math.sin(a + 1.2) * r },
    { x: home.x + Math.cos(a + 2.4) * r, y: home.y + Math.sin(a + 2.4) * r },
    home,
  ];
}

function workLoop(center: DioramaPoint): DioramaPoint[] {
  return [
    { x: center.x - 1.5, y: center.y },
    { x: center.x + 1.5, y: center.y },
    { x: center.x, y: center.y + 1.2 },
    { x: center.x, y: center.y - 1.2 },
    { x: center.x - 1.5, y: center.y },
  ];
}

function pathLength(wps: DioramaPoint[]) {
  let len = 0;
  for (let i = 1; i < wps.length; i++) len += dist(wps[i - 1], wps[i]);
  return len;
}

function buildAgentPath(
  layout: DioramaLayout,
  pattern: DioramaTrafficPattern,
  seed: number,
): { waypoints: DioramaPoint[]; homeStructure: string; destination: string } {
  const from = resolvePoint(layout, pattern.from, layout.buildings, layout.hotspots);
  const to = resolvePoint(layout, pattern.to, layout.buildings, layout.hotspots);
  const homeStructure = pattern.from;
  const destination = pattern.to;

  switch (pattern.task) {
    case "idle":
      return { waypoints: idleLoop(from, seed), homeStructure, destination };
    case "work":
      return { waypoints: workLoop(to), homeStructure, destination: pattern.to };
    case "gather":
      return {
        waypoints: pathViaRoads(layout, from, to, true),
        homeStructure,
        destination: pattern.to,
      };
    case "carry":
      return {
        waypoints: pathViaRoads(layout, from, to, true),
        homeStructure,
        destination: pattern.to,
      };
    case "walk":
    default:
      return {
        waypoints: pathViaRoads(layout, from, to, true),
        homeStructure,
        destination: pattern.to,
      };
  }
}

function cssKeyframes(id: string, wps: DioramaPoint[]): string {
  if (wps.length === 0) return "";
  const steps = wps.map((w, i) => {
    const pct = wps.length === 1 ? 0 : Math.round((i / (wps.length - 1)) * 1000) / 10;
    return `${pct}% { left: ${w.x}%; top: ${w.y}%; }`;
  });
  return `@keyframes ${id} { ${steps.join(" ")} }`;
}

/** Genera agenti traffico automatici per il layout */
export function generateTrafficAgents(layout: DioramaLayout, countOverride?: number): PikminTrafficAgent[] {
  const cfg = layout.trafficConfig;
  const patterns = cfg?.patterns?.length ? cfg.patterns : DEFAULT_BOSCO_TRAFFIC_PATTERNS;
  const max = cfg?.maxCount ?? 30;
  const count = Math.min(max, Math.max(1, countOverride ?? cfg?.initialCount ?? 10));

  const agents: PikminTrafficAgent[] = [];

  for (let i = 0; i < count; i++) {
    const pattern = patterns[i % patterns.length]!;
    const type = PIKMIN_TYPES[i % PIKMIN_TYPES.length]!;
    const { waypoints, homeStructure, destination } = buildAgentPath(layout, pattern, i);
    const len = pathLength(waypoints);
    const duration = Math.max(6, Math.min(22, len * 0.35 + (pattern.task === "work" ? 5 : 8)));
    const cssId = `pikmin-traffic-${i}`;

    agents.push({
      id: `agent-${i}`,
      type,
      currentTask: pattern.task,
      routeId: pattern.id,
      homeStructure,
      destination,
      waypoints,
      duration,
      delay: (i * 0.65) % 4,
      cargo: pattern.cargo,
      cssId,
    });
  }

  return agents;
}

export function buildTrafficStylesheet(agents: PikminTrafficAgent[]): string {
  return agents.map((a) => cssKeyframes(a.cssId, a.waypoints)).join("\n");
}

export function taskToAnimation(task: PikminAgentTask): "walk" | "carry" | "work" | "idle" {
  if (task === "carry") return "carry";
  if (task === "work") return "work";
  if (task === "idle") return "idle";
  return "walk";
}

export function readTrafficCountOverride(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(PIKMIN_TRAFFIC_STORAGE_KEY);
    if (!raw) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

export function saveTrafficCountOverride(count: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PIKMIN_TRAFFIC_STORAGE_KEY, String(count));
}
