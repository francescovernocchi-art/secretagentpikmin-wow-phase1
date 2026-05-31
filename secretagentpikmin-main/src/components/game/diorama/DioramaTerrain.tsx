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

export function DioramaTerrain({ theme }: DioramaTerrainProps) {
  const water = theme.water ?? "rgba(56,189,248,0.36)";
  const decor = [
    { item: theme.decor[0] ?? "🌲", cls: styles.decorLargeTree, left: 10, top: 18 },
    { item: theme.decor[1] ?? "🌳", cls: styles.decorLargeTree, left: 86, top: 22 },
    { item: "🌲", cls: styles.decorLargeTree, left: 7, top: 76 },
    { item: "🪵", cls: styles.decorLog, left: 22, top: 82 },
    { item: theme.decor[2] ?? "🍄", cls: styles.decorMushroom, left: 12, top: 64 },
    { item: "🍄", cls: styles.decorMushroom, left: 72, top: 74 },
    { item: "🌿", cls: styles.decorBush, left: 18, top: 48 },
    { item: "🌿", cls: styles.decorBush, left: 64, top: 26 },
    { item: "🌸", cls: styles.decorFlower, left: 34, top: 72 },
    { item: "🌼", cls: styles.decorFlower, left: 82, top: 58 },
    { item: theme.decor[3] ?? "🌿", cls: styles.decorBush, left: 91, top: 78 },
  ];

  return (
    <div className={styles.terrainWrap} style={{ background: theme.sky }}>
      <ParticleEffect variant="dust" density="medium" />
      <ParticleEffect variant="energy" density="low" className="opacity-60" />
      <div className={styles.sunGlow} style={{ boxShadow: `0 0 80px 40px ${theme.accent}33` }} />
      <div className={styles.isoStage}>
        <div className={`${styles.terrainDepthLayer} ${styles.terrainDepthLayerOne}`} aria-hidden />
        <div className={`${styles.terrainDepthLayer} ${styles.terrainDepthLayerTwo}`} aria-hidden />
        <div className={`${styles.terrainDepthLayer} ${styles.terrainDepthLayerThree}`} aria-hidden />
        <div
          className={styles.groundPlate}
          style={{
            background: `linear-gradient(135deg, ${theme.ground} 0%, ${theme.groundMid} 45%, ${theme.groundDark} 100%)`,
            borderColor: `${theme.accent}44`,
          }}
        >
          <div className={styles.terrainTexture} aria-hidden />
          <div className={`${styles.elevationPatch} ${styles.elevationPatchHigh}`} aria-hidden />
          <div className={`${styles.elevationPatch} ${styles.elevationPatchLow}`} aria-hidden />
          <div className={styles.scavataRidge} aria-hidden />
          <div className={styles.scavataRidgeAlt} aria-hidden />
          <div className={styles.cliffFaceFront} aria-hidden />
          <div className={styles.cliffFaceSide} aria-hidden />
          <svg className={styles.pathSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 8 66 C 18 58 26 60 35 50 C 45 39 58 44 67 37 C 75 31 83 35 92 28" fill="none" stroke={theme.path} strokeWidth="7" strokeLinecap="round" opacity="0.72" />
            <path d="M 32 52 C 41 57 43 66 38 77 C 35 84 29 86 22 80" fill="none" stroke={theme.path} strokeWidth="4.6" strokeLinecap="round" opacity="0.58" />
            <path d="M 58 42 C 62 52 69 58 80 60" fill="none" stroke={theme.path} strokeWidth="4" strokeLinecap="round" opacity="0.48" />
            <path d="M 14 68 C 25 63 34 58 44 52 C 55 46 67 38 86 30" fill="none" stroke="#fff7d6" strokeWidth="1.2" strokeLinecap="round" opacity="0.24" />
          </svg>
          <div className={styles.waterStream} style={{ background: water, boxShadow: `inset 0 0 16px ${theme.accent}55` }} aria-hidden />
          <div className={styles.waterPond} style={{ background: water, boxShadow: `inset 0 0 20px ${theme.accent}55` }} aria-hidden />
          {[12, 68, 82, 25, 47, 90, 6, 55].map((left, i) => (
            <div key={i} className={styles.rock} style={{ left: `${left}%`, top: `${[72, 78, 65, 82, 33, 48, 42, 86][i]}%`, opacity: 0.45 + (i % 3) * 0.16 }} />
          ))}
          {[
            { left: 4, top: 48, item: "🌿" },
            { left: 14, top: 87, item: "🪨" },
            { left: 37, top: 95, item: "🌿" },
            { left: 71, top: 90, item: "🪨" },
            { left: 95, top: 49, item: "🌿" },
          ].map((d, i) => (
            <span key={`edge-${i}`} className={`${styles.decorItem} ${styles.edgeScrub}`} style={{ left: `${d.left}%`, top: `${d.top}%` }}>
              {d.item}
            </span>
          ))}
          {decor.map((d, i) => (
            <span
              key={i}
              className={`${styles.decorItem} ${d.cls}`}
              style={{ left: `${d.left}%`, top: `${d.top}%`, animationDelay: `${i * 0.35}s` }}
            >
              {d.item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
