import styles from "@/styles/village-diorama.module.css";
import { ParticleEffect } from "@/components/fx/ParticleEffect";

interface DioramaTerrainProps {
  theme: {
    sky: string;
    ground: string;
    groundMid: string;
    groundDark: string;
    path: string;
    water?: string;
    accent: string;
    decor: string[];
  };
}

const GRASS_PATCHES = [
  { left: 18, top: 30 },
  { left: 24, top: 66 },
  { left: 34, top: 42 },
  { left: 44, top: 74 },
  { left: 57, top: 34 },
  { left: 63, top: 62 },
  { left: 74, top: 47 },
  { left: 84, top: 68 },
  { left: 15, top: 80 },
  { left: 91, top: 28 },
  { left: 51, top: 84 },
  { left: 39, top: 18 },
];

const NATURE_DETAILS = [
  { kind: "bush", left: 20, top: 20, emoji: "🌿" },
  { kind: "bush", left: 70, top: 74, emoji: "🌿" },
  { kind: "flower", left: 14, top: 54, emoji: "🌸" },
  { kind: "flower", left: 46, top: 89, emoji: "🌼" },
  { kind: "flower", left: 83, top: 56, emoji: "🌺" },
  { kind: "mushroom", left: 28, top: 84, emoji: "🍄" },
  { kind: "mushroom", left: 61, top: 80, emoji: "🍄" },
  { kind: "sapling", left: 10, top: 36, emoji: "🌱" },
  { kind: "sapling", left: 88, top: 38, emoji: "🌱" },
  { kind: "sapling", left: 54, top: 20, emoji: "🌱" },
];

export function DioramaTerrain({ theme }: DioramaTerrainProps) {
  return (
    <div className={styles.terrainWrap} style={{ background: theme.sky }}>
      <ParticleEffect variant="dust" density="medium" />
      <ParticleEffect variant="energy" density="low" className="opacity-60" />
      <div className={styles.sunGlow} style={{ boxShadow: `0 0 80px 40px ${theme.accent}33` }} />
      <div className={styles.isoStage}>
        <div
          className={styles.groundPlate}
          style={{
            background: `linear-gradient(135deg, ${theme.ground} 0%, ${theme.groundMid} 45%, ${theme.groundDark} 100%)`,
            borderColor: `${theme.accent}44`,
          }}
        >
          <svg className={styles.pathSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M 15 55 Q 35 48 50 52 Q 65 56 85 45"
              fill="none"
              stroke={theme.path}
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.7"
            />
            <path
              d="M 50 52 Q 55 65 48 78 Q 42 85 35 75"
              fill="none"
              stroke={theme.path}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
          {theme.water && (
            <div
              className={styles.waterPond}
              style={{ background: theme.water, boxShadow: `inset 0 0 20px ${theme.accent}44` }}
            />
          )}
          {[12, 68, 82, 25].map((left, i) => (
            <div
              key={i}
              className={styles.rock}
              style={{
                left: `${left}%`,
                top: `${[72, 78, 65, 82][i]}%`,
                opacity: 0.5 + (i % 2) * 0.2,
              }}
            />
          ))}
          {GRASS_PATCHES.map((g, i) => (
            <span
              key={`grass-${i}`}
              className={styles.grassPatch}
              style={{ left: `${g.left}%`, top: `${g.top}%`, animationDelay: `${i * 0.18}s` }}
            >
              <span />
              <span />
              <span />
            </span>
          ))}
          {NATURE_DETAILS.map((d, i) => (
            <span
              key={`${d.kind}-${i}`}
              className={`${styles.natureDetail} ${styles[`nature${d.kind}` as keyof typeof styles] ?? ""}`}
              style={{ left: `${d.left}%`, top: `${d.top}%`, animationDelay: `${i * 0.23}s` }}
            >
              {d.emoji}
            </span>
          ))}
          {theme.decor.map((d, i) => (
            <span
              key={i}
              className={styles.decorItem}
              style={{
                left: `${[8, 88, 5, 92, 18][i % 5]}%`,
                top: `${[15, 20, 75, 80, 45][i % 5]}%`,
                animationDelay: `${i * 0.7}s`,
              }}
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
