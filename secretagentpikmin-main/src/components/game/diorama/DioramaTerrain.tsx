import styles from "@/styles/village-diorama.module.css";
import { ParticleEffect } from "@/components/fx/ParticleEffect";

const NATURE_DETAILS = [
  { kind: "sapling", x: 10, y: 28, delay: -0.2 },
  { kind: "sapling", x: 18, y: 18, delay: -1.4 },
  { kind: "sapling", x: 88, y: 18, delay: -2.1 },
  { kind: "bush", x: 14, y: 72, delay: -0.7 },
  { kind: "bush", x: 23, y: 81, delay: -2.4 },
  { kind: "bush", x: 83, y: 68, delay: -1.6 },
  { kind: "bush", x: 73, y: 17, delay: -3.1 },
  { kind: "flower", x: 7, y: 52, delay: -0.1 },
  { kind: "flower", x: 19, y: 46, delay: -1.8 },
  { kind: "flower", x: 62, y: 83, delay: -2.7 },
  { kind: "flower", x: 91, y: 47, delay: -3.5 },
  { kind: "mushroom", x: 34, y: 18, delay: -0.5 },
  { kind: "mushroom", x: 77, y: 78, delay: -2.8 },
  { kind: "tallGrass", x: 29, y: 31, delay: -0.9 },
  { kind: "tallGrass", x: 41, y: 82, delay: -1.9 },
  { kind: "tallGrass", x: 53, y: 18, delay: -3.8 },
  { kind: "tallGrass", x: 92, y: 60, delay: -2.2 },
  { kind: "pebble", x: 47, y: 36, delay: 0 },
  { kind: "pebble", x: 58, y: 77, delay: 0 },
  { kind: "pebble", x: 80, y: 39, delay: 0 },
] as const;

const AMBIENT_MOTES = [
  { x: 16, y: 24, delay: -0.4 },
  { x: 38, y: 14, delay: -2.2 },
  { x: 64, y: 26, delay: -1.1 },
  { x: 84, y: 37, delay: -3.4 },
  { x: 28, y: 78, delay: -2.8 },
] as const;

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
          {NATURE_DETAILS.map((item, i) => (
            <span
              key={`${item.kind}-${i}`}
              className={`${styles.natureDetail} ${styles[`nature${item.kind}`]}`}
              style={{ left: `${item.x}%`, top: `${item.y}%`, animationDelay: `${item.delay}s` }}
              aria-hidden
            />
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
          {AMBIENT_MOTES.map((mote, i) => (
            <span
              key={`mote-${i}`}
              className={styles.ambientMote}
              style={{ left: `${mote.x}%`, top: `${mote.y}%`, animationDelay: `${mote.delay}s`, background: theme.accent }}
              aria-hidden
            />
          ))}
        </div>
      </div>
    </div>
  );
}
