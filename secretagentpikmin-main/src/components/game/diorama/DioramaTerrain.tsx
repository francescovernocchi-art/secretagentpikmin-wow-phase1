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
  compact?: boolean;
}

/** Natura asimmetrica — posizioni fisse (V1.9), leggermente ridotta ai bordi per non coprire piazza */
const NATURE_SCATTER: {
  kind: string;
  left: number;
  top: number;
  size?: "sm" | "md" | "lg";
  rotate?: number;
}[] = [
  { kind: "🌳", left: 6, top: 38, size: "lg", rotate: -8 },
  { kind: "🌿", left: 14, top: 52, size: "sm" },
  { kind: "🪨", left: 11, top: 68, size: "md" },
  { kind: "🍄", left: 19, top: 78, size: "sm" },
  { kind: "🌸", left: 73, top: 42, size: "sm", rotate: 12 },
  { kind: "🌲", left: 88, top: 55, size: "md", rotate: 6 },
  { kind: "🪵", left: 82, top: 72, size: "sm" },
  { kind: "🌾", left: 67, top: 82, size: "md" },
  { kind: "🌿", left: 42, top: 88, size: "sm" },
  { kind: "🪨", left: 55, top: 76, size: "sm" },
  { kind: "🌼", left: 31, top: 58, size: "sm" },
  { kind: "🍃", left: 91, top: 38, size: "sm", rotate: -15 },
];

/** Punti di interesse colonia (V2.0) */
const COLONY_POIS: { key: string; icon: string; left: number; top: number; label?: string }[] = [
  { key: "campfire", icon: "🔥", left: 41, top: 43, label: "Falò" },
  { key: "depot", icon: "📦", left: 57, top: 42 },
  { key: "board", icon: "📋", left: 59, top: 37, label: "Missioni" },
  { key: "antenna", icon: "📡", left: 45, top: 31 },
  { key: "well", icon: "⚡", left: 55, top: 44 },
  { key: "research", icon: "🔬", left: 43, top: 36 },
];

/** Sentieri Hangar → Piazza → Edifici (V2.0) */
const COLONY_PATHS = (pathColor: string, accent: string) => (
  <>
    {/* Hangar → piazza — arteria principale */}
    <path
      d="M 50 8 L 50 28 Q 50 38 50 46"
      fill="none"
      stroke={pathColor}
      strokeWidth="6"
      strokeLinecap="round"
      opacity="0.85"
    />
    <path
      d="M 50 8 L 50 28 Q 50 38 50 46"
      fill="none"
      stroke={accent}
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.35"
    />
    {/* Usura centrale */}
    <path
      d="M 48 20 Q 50 34 50 46 Q 52 34 52 20"
      fill="none"
      stroke={pathColor}
      strokeWidth="3"
      strokeLinecap="round"
      opacity="0.4"
    />

    {/* Hub piazza → edifici */}
    <path
      d="M 50 46 Q 32 48 22 50"
      fill="none"
      stroke={pathColor}
      strokeWidth="5"
      strokeLinecap="round"
      opacity="0.78"
    />
    <path
      d="M 50 46 Q 68 44 78 42"
      fill="none"
      stroke={pathColor}
      strokeWidth="5"
      strokeLinecap="round"
      opacity="0.78"
    />
    <path
      d="M 50 46 Q 38 58 28 68"
      fill="none"
      stroke={pathColor}
      strokeWidth="4.5"
      strokeLinecap="round"
      opacity="0.68"
    />
    <path
      d="M 50 46 Q 58 58 62 70"
      fill="none"
      stroke={pathColor}
      strokeWidth="4.5"
      strokeLinecap="round"
      opacity="0.68"
    />
    <path
      d="M 50 46 Q 50 40 48 36"
      fill="none"
      stroke={pathColor}
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.6"
    />

    {/* Anello piazza — zona ritrovo */}
    <ellipse
      cx="50"
      cy="46"
      rx="11"
      ry="8"
      fill="none"
      stroke={pathColor}
      strokeWidth="2.5"
      opacity="0.55"
      strokeDasharray="3 2"
    />

    {/* Tracce incrociate usura */}
    <path
      d="M 18 52 Q 34 48 50 46 Q 66 48 82 44"
      fill="none"
      stroke={pathColor}
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.32"
    />
    <path
      d="M 30 68 Q 40 58 50 46 Q 60 58 70 68"
      fill="none"
      stroke={pathColor}
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.28"
    />
  </>
);

/** Piazza centrale tra hangar e villaggio (V2.0) */
export function DioramaCentralPlaza({ compact }: { compact?: boolean }) {
  if (compact) return null;

  return (
    <div className={styles.centralPlazaWrap} aria-hidden>
      {/* Ponte scena hangar → piazza */}
      <div className={styles.plazaBridge}>
        <span className={styles.plazaBridgeStripe} />
        <span className={styles.plazaBridgeStripe} style={{ animationDelay: "0.5s" }} />
      </div>

      <div className={styles.centralPlaza}>
        <div className={styles.plazaPavement} />
        <div className={styles.plazaRing} />

        {/* Area raccolta materiali */}
        <div className={styles.plazaMaterialZone}>
          <span>📦</span>
          <span>🪵</span>
          <span>🔩</span>
        </div>

        {/* Area operativa */}
        <div className={styles.plazaOpsZone}>
          <span className={styles.plazaCone}>▲</span>
          <span className={styles.plazaOpsLight} />
        </div>

        {/* Punto ritrovo Pikmin */}
        <div className={styles.plazaGather}>
          <span className={styles.plazaGatherMark}>◎</span>
        </div>
      </div>

      {/* POI intorno alla piazza */}
      {COLONY_POIS.map((poi) => (
        <div
          key={poi.key}
          className={`${styles.colonyPoi} ${styles[`poi_${poi.key}`]}`}
          style={{ left: `${poi.left}%`, top: `${poi.top}%` }}
        >
          <span className={styles.poiIcon}>{poi.icon}</span>
          {poi.label && <span className={styles.poiLabel}>{poi.label}</span>}
        </div>
      ))}
    </div>
  );
}

export function DioramaTerrain({ theme, compact }: DioramaTerrainProps) {
  return (
    <div className={styles.terrainWrap} style={{ background: theme.sky }}>
      <ParticleEffect variant="dust" density="medium" />
      <ParticleEffect variant="energy" density="low" className="opacity-60" />
      <div className={styles.sunGlow} style={{ boxShadow: `0 0 80px 40px ${theme.accent}33` }} />

      <DioramaCentralPlaza compact={compact} />

      <div className={styles.sceneNature} aria-hidden>
        {NATURE_SCATTER.slice(0, 6).map((n, i) => (
          <span
            key={`sn-${i}`}
            className={`${styles.natureItem} ${styles[`nature_${n.size ?? "md"}`]}`}
            style={{
              left: `${n.left}%`,
              top: `${n.top}%`,
              rotate: `${n.rotate ?? 0}deg`,
              animationDelay: `${i * 0.35}s`,
            }}
          >
            {n.kind}
          </span>
        ))}
      </div>

      <div className={styles.isoStage}>
        <div
          className={styles.groundPlate}
          style={{
            background: `linear-gradient(135deg, ${theme.ground} 0%, ${theme.groundMid} 45%, ${theme.groundDark} 100%)`,
            borderColor: `${theme.accent}44`,
          }}
        >
          {/* Piazza pavimentata sul piatto isometrico */}
          {!compact && (
            <div
              className={styles.groundPlazaHub}
              style={{ boxShadow: `inset 0 0 24px ${theme.accent}22` }}
            >
              <div className={styles.groundPlazaInner} style={{ borderColor: `${theme.path}88` }} />
            </div>
          )}

          <svg className={styles.pathSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
            {COLONY_PATHS(theme.path, theme.accent)}
          </svg>

          {theme.water && (
            <div
              className={styles.waterPond}
              style={{ background: theme.water, boxShadow: `inset 0 0 20px ${theme.accent}44` }}
            />
          )}

          {[8, 22, 76, 91].map((left, i) => (
            <div
              key={`grass-${i}`}
              className={styles.tallGrass}
              style={{ left: `${left}%`, top: `${[84, 90, 88, 85][i]}%` }}
            />
          ))}

          {NATURE_SCATTER.map((n, i) => (
            <span
              key={`gn-${i}`}
              className={`${styles.groundNature} ${styles[`nature_${n.size ?? "md"}`]}`}
              style={{ left: `${n.left}%`, top: `${n.top}%`, rotate: `${n.rotate ?? 0}deg` }}
            >
              {n.kind}
            </span>
          ))}

          {theme.decor.slice(0, 3).map((d, i) => (
            <span
              key={`dec-${i}`}
              className={styles.decorItem}
              style={{
                left: `${[8, 88, 5][i]}%`,
                top: `${[15, 20, 75][i]}%`,
                animationDelay: `${i * 0.7}s`,
              }}
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      <svg
        className={styles.hangarPathOverlay}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          d="M 50 6 L 50 20 Q 50 32 50 40"
          fill="none"
          stroke={theme.path}
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M 47 18 L 50 40 L 53 18"
          fill="none"
          stroke={theme.path}
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
    </div>
  );
}
