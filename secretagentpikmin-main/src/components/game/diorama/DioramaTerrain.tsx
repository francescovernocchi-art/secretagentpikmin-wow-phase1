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

const NATURE_DETAILS = [
  { kind: "bush", x: 12, y: 48, z: 9, icon: "🌿" },
  { kind: "bush", x: 22, y: 74, z: 10, icon: "🌱" },
  { kind: "bush", x: 86, y: 38, z: 12, icon: "🌿" },
  { kind: "flower", x: 16, y: 83, z: 13, icon: "🌼" },
  { kind: "flower", x: 74, y: 30, z: 12, icon: "🌸" },
  { kind: "flower", x: 89, y: 56, z: 14, icon: "🌻" },
  { kind: "mushroom", x: 24, y: 88, z: 15, icon: "🍄" },
  { kind: "mushroom", x: 35, y: 68, z: 13, icon: "🍄" },
  { kind: "grass", x: 18, y: 28, z: 9, icon: "〽" },
  { kind: "grass", x: 44, y: 82, z: 13, icon: "〽" },
  { kind: "grass", x: 63, y: 72, z: 15, icon: "〽" },
  { kind: "leaf", x: 58, y: 38, z: 11, icon: "🍃" },
  { kind: "leaf", x: 82, y: 72, z: 15, icon: "🍂" },
  { kind: "log", x: 30, y: 78, z: 12, icon: "▰" },
  { kind: "log", x: 71, y: 62, z: 14, icon: "▰" },
  { kind: "stone", x: 40, y: 57, z: 12, icon: "●" },
  { kind: "stone", x: 51, y: 74, z: 16, icon: "●" },
  { kind: "stone", x: 66, y: 41, z: 12, icon: "●" },
  { kind: "seed", x: 10, y: 70, z: 10, icon: "✦" },
  { kind: "seed", x: 92, y: 28, z: 12, icon: "✦" },
] as const;

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
            <path d="M 15 55 Q 35 48 50 52 Q 65 56 85 45" fill="none" stroke={theme.path} strokeWidth="6" strokeLinecap="round" opacity="0.7" />
            <path d="M 50 52 Q 55 65 48 78 Q 42 85 35 75" fill="none" stroke={theme.path} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          </svg>
          {theme.water && (
            <div className={styles.waterPond} style={{ background: theme.water, boxShadow: `inset 0 0 20px ${theme.accent}44` }} />
          )}
          {[12, 68, 82, 25].map((left, i) => (
            <div key={i} className={styles.rock} style={{ left: `${left}%`, top: `${[72, 78, 65, 82][i]}%`, opacity: 0.5 + (i % 2) * 0.2 }} />
          ))}
          {theme.decor.map((d, i) => (
            <span
              key={i}
              className={styles.decorItem}
              style={{ left: `${[8, 88, 5, 92, 18][i % 5]}%`, top: `${[15, 20, 75, 80, 45][i % 5]}%`, animationDelay: `${i * 0.7}s` }}
            >
              {d}
            </span>
          ))}
          {NATURE_DETAILS.map((detail, i) => (
            <span
              key={`${detail.kind}-${i}`}
              className={`${styles.natureDetail} ${styles[`nature${detail.kind[0].toUpperCase()}${detail.kind.slice(1)}`]}`}
              style={{ left: `${detail.x}%`, top: `${detail.y}%`, zIndex: detail.z, animationDelay: `${i * 0.18}s` }}
              aria-hidden
            >
              {detail.icon}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
