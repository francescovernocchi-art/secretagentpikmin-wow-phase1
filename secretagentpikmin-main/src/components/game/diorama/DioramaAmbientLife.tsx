import { motion } from "framer-motion";
import { AnimatedPikmin } from "@/components/pikmin/AnimatedPikmin";
import type { PikminAnimation } from "@/data/pikminSprites";
import styles from "@/styles/village-diorama.module.css";

type AmbientTask = "walk" | "carry" | "work" | "idle";

interface AmbientPikmin {
  id: string;
  type: string;
  task: AmbientTask;
  label: string;
  x: number;
  y: number;
  z: number;
  flip?: boolean;
  path: Array<{ x: number; y: number }>;
}

const AMBIENT_PIKMIN: AmbientPikmin[] = [
  {
    id: "path-red-1",
    type: "red",
    task: "walk",
    label: "passeggia sul sentiero",
    x: 44,
    y: 52,
    z: 62,
    path: [
      { x: 0, y: 0 },
      { x: 18, y: -10 },
      { x: 31, y: -4 },
      { x: 12, y: 8 },
      { x: 0, y: 0 },
    ],
  },
  {
    id: "path-yellow-1",
    type: "yellow",
    task: "walk",
    label: "controlla la zona atterraggio",
    x: 53,
    y: 43,
    z: 63,
    flip: true,
    path: [
      { x: 0, y: 0 },
      { x: -12, y: 8 },
      { x: -24, y: 2 },
      { x: -8, y: -6 },
      { x: 0, y: 0 },
    ],
  },
  {
    id: "carry-blue-1",
    type: "blue",
    task: "carry",
    label: "trasporta una cassa",
    x: 34,
    y: 64,
    z: 70,
    path: [
      { x: 0, y: 0 },
      { x: 14, y: -7 },
      { x: 28, y: -2 },
      { x: 8, y: 7 },
      { x: 0, y: 0 },
    ],
  },
  {
    id: "carry-purple-1",
    type: "purple",
    task: "carry",
    label: "porta materiali al deposito",
    x: 65,
    y: 58,
    z: 73,
    flip: true,
    path: [
      { x: 0, y: 0 },
      { x: -13, y: 6 },
      { x: -26, y: 1 },
      { x: -7, y: -5 },
      { x: 0, y: 0 },
    ],
  },
  {
    id: "work-red-1",
    type: "red",
    task: "work",
    label: "lavora al cantiere",
    x: 61,
    y: 72,
    z: 74,
    path: [
      { x: 0, y: 0 },
      { x: 3, y: -2 },
      { x: -2, y: 2 },
      { x: 2, y: 1 },
      { x: 0, y: 0 },
    ],
  },
  {
    id: "work-yellow-1",
    type: "yellow",
    task: "work",
    label: "pianta picchetti",
    x: 74,
    y: 33,
    z: 64,
    path: [
      { x: 0, y: 0 },
      { x: 2, y: -3 },
      { x: -3, y: 1 },
      { x: 1, y: 3 },
      { x: 0, y: 0 },
    ],
  },
  {
    id: "work-white-1",
    type: "white",
    task: "work",
    label: "ripara la navicella",
    x: 72,
    y: 55,
    z: 76,
    flip: true,
    path: [
      { x: 0, y: 0 },
      { x: -4, y: -2 },
      { x: 2, y: 1 },
      { x: -1, y: 3 },
      { x: 0, y: 0 },
    ],
  },
  {
    id: "idle-rock-1",
    type: "rock",
    task: "idle",
    label: "sorveglia la capsula",
    x: 49,
    y: 33,
    z: 61,
    path: [
      { x: 0, y: 0 },
      { x: 2, y: -1 },
      { x: -1, y: 1 },
      { x: 0, y: 0 },
    ],
  },
  {
    id: "idle-wing-1",
    type: "wing",
    task: "idle",
    label: "si ferma vicino al deposito",
    x: 31,
    y: 58,
    z: 58,
    path: [
      { x: 0, y: 0 },
      { x: 1, y: -2 },
      { x: -2, y: 1 },
      { x: 0, y: 0 },
    ],
  },
  {
    id: "path-blue-2",
    type: "blue",
    task: "walk",
    label: "pattuglia tra i cespugli",
    x: 27,
    y: 72,
    z: 57,
    path: [
      { x: 0, y: 0 },
      { x: 11, y: -5 },
      { x: 23, y: 1 },
      { x: 9, y: 7 },
      { x: 0, y: 0 },
    ],
  },
  {
    id: "carry-red-2",
    type: "red",
    task: "carry",
    label: "sposta casse leggere",
    x: 55,
    y: 61,
    z: 69,
    path: [
      { x: 0, y: 0 },
      { x: 8, y: -4 },
      { x: 17, y: 1 },
      { x: 7, y: 5 },
      { x: 0, y: 0 },
    ],
  },
  {
    id: "idle-yellow-2",
    type: "yellow",
    task: "idle",
    label: "aspetta ordini",
    x: 39,
    y: 42,
    z: 59,
    flip: true,
    path: [
      { x: 0, y: 0 },
      { x: -2, y: -1 },
      { x: 1, y: 2 },
      { x: 0, y: 0 },
    ],
  },
  {
    id: "work-purple-2",
    type: "purple",
    task: "work",
    label: "rinforza le fondamenta",
    x: 78,
    y: 28,
    z: 66,
    flip: true,
    path: [
      { x: 0, y: 0 },
      { x: -2, y: 2 },
      { x: 3, y: -1 },
      { x: 0, y: 0 },
    ],
  },
];

const TASK_ANIMATION: Record<AmbientTask, PikminAnimation> = {
  walk: "walk",
  carry: "carry",
  work: "work",
  idle: "idle",
};

const PIKMIN_TINT: Record<string, string> = {
  red: "#ef4444",
  blue: "#3b82f6",
  yellow: "#facc15",
  purple: "#a855f7",
  white: "#f8fafc",
  rock: "#78716c",
  wing: "#f472b6",
};

interface DioramaAmbientLifeProps {
  count: number;
  compact?: boolean;
}

export function DioramaAmbientLife({ count, compact }: DioramaAmbientLifeProps) {
  return (
    <>
      {AMBIENT_PIKMIN.slice(0, count).map((p, index) => (
        <motion.div
          key={p.id}
          className={styles.ambientPikmin}
          style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: p.z }}
          animate={{
            x: p.path.map((step) => step.x),
            y: p.path.map((step) => step.y),
          }}
          transition={{
            repeat: Infinity,
            duration: p.task === "idle" ? 5 + index * 0.2 : 8 + (index % 4),
            ease: "easeInOut",
            delay: index * 0.35,
          }}
          title={p.label}
          aria-hidden
        >
          <div className={styles.pikminShadow} />
          {p.task === "carry" && <span className={styles.carryCrate}>▣</span>}
          {p.task === "work" && <span className={styles.workMark}>✦</span>}
          <AnimatedPikmin
            type={p.type}
            animation={TASK_ANIMATION[p.task]}
            size={compact ? 20 : 25}
            flip={p.flip}
            tintColor={PIKMIN_TINT[p.type]}
            showShadow={false}
            showDust={p.task === "walk" || p.task === "carry"}
            showParticles={p.task === "work"}
          />
        </motion.div>
      ))}
    </>
  );
}
