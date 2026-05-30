import { useId } from "react";
import { motion } from "framer-motion";
import type { DbSpaceshipPart } from "@/types/phase2-db";
import { ParticleEffect } from "@/components/fx/ParticleEffect";
import styles from "@/styles/village-diorama.module.css";

interface DioramaShipHangarProps {
  parts: DbSpaceshipPart[];
  percent: number;
  onClick?: () => void;
  compact?: boolean;
}

type ShipVisualState = "wreck" | "initial" | "p25" | "p50" | "p75" | "complete";

function resolveShipVisualState(percent: number, collectedCount: number): ShipVisualState {
  if (percent >= 100) return "complete";
  if (percent >= 75) return "p75";
  if (percent >= 50) return "p50";
  if (percent >= 25) return "p25";
  if (collectedCount > 0 || percent > 0) return "initial";
  return "wreck";
}

function hasPart(parts: DbSpaceshipPart[], key: string): boolean {
  return parts.some((p) => p.key === key && p.collected);
}

export function DioramaShipHangar({ parts, percent, onClick, compact }: DioramaShipHangarProps) {
  const uid = useId().replace(/:/g, "");
  const hullId = `shipHull-${uid}`;
  const darkId = `shipDark-${uid}`;
  const energyId = `shipEnergy-${uid}`;
  const collected = parts.filter((p) => p.collected);
  const progress = parts.length > 0 ? percent : 0;
  const visualState = resolveShipVisualState(progress, collected.length);
  const damaged = visualState !== "complete";
  const glow = visualState === "p75" || visualState === "complete";
  const hasMotor = hasPart(parts, "motore");
  const hasAntenna = hasPart(parts, "antenna");
  const hasCabin = hasPart(parts, "cabina");
  const hasEnergy = hasPart(parts, "modulo_energia") || hasPart(parts, "nucleo");
  const hasStabilizers = hasPart(parts, "stabilizzatori");
  const missingParts = [
    !hasStabilizers && "ala mancante",
    !hasMotor && "motore spento",
    !hasEnergy && "pannello aperto",
    !hasAntenna && "antenna assente",
  ].filter(Boolean) as string[];

  return (
    <button
      type="button"
      className={`${styles.shipHangar} ${styles.shipHangarHero} ${styles[`shipState_${visualState}`]}`}
      onClick={onClick}
      aria-label={`Navicella ${visualState === "complete" ? "completa" : "da riparare"}, ${progress}% riparata, ${collected.length} di ${parts.length} pezzi`}
    >
      <ParticleEffect variant="ship-glow" />
      <div className={styles.shipHeroPlatform} aria-hidden>
        <span className={styles.shipPlatformRing} />
        <span className={styles.shipRunwayLine} />
        <span className={styles.shipRunwayLine} />
        <span className={styles.shipPlatformGlow} />
      </div>
      {!compact && (
        <div className={styles.hangarLightRig} aria-hidden>
          <span />
          <span />
          <span />
        </div>
      )}
      <motion.div
        className={`${styles.shipModel} ${styles.shipHeroModel} ${glow ? styles.shipGlow : ""}`}
        animate={{ y: damaged ? [0, -2, 0] : [0, -5, 0] }}
        transition={{ repeat: Infinity, duration: damaged ? 3.4 : 2.4, ease: "easeInOut" }}
        aria-hidden
      >
        <svg viewBox="0 0 160 112" className={styles.shipSvg} aria-hidden>
          <defs>
            <linearGradient id={hullId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <linearGradient id={darkId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e3a5f" />
              <stop offset="100%" stopColor="#0c1929" />
            </linearGradient>
            <radialGradient id={energyId} cx="50%" cy="50%" r="55%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="55%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.1" />
            </radialGradient>
          </defs>
          <ellipse cx="80" cy="92" rx="55" ry="14" fill="#00000055" />
          <path
            d="M 34 83 Q 80 62 126 83"
            fill="none"
            stroke="#7dd3fc"
            strokeWidth="2"
            strokeDasharray="5 5"
            opacity="0.45"
          />

          {hasStabilizers ? (
            <>
              <path
                d="M 47 66 L 14 78 L 49 78 Z"
                fill="#0284c7"
                stroke="#7dd3fc"
                strokeWidth="2"
                opacity={damaged ? 0.75 : 1}
              />
              <path
                d="M 113 66 L 146 78 L 111 78 Z"
                fill="#0284c7"
                stroke="#7dd3fc"
                strokeWidth="2"
                opacity={damaged ? 0.75 : 1}
              />
            </>
          ) : (
            <>
              <path
                d="M 47 66 L 19 78 L 49 78"
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeDasharray="5 4"
              />
              <path
                d="M 113 66 L 144 78"
                fill="none"
                stroke="#f97316"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <text x="15" y="70" fill="#fed7aa" fontSize="8">
                ala?
              </text>
            </>
          )}

          <path
            d="M 80 9 L 122 76 L 80 95 L 38 76 Z"
            fill={`url(#${hullId})`}
            stroke="#7dd3fc"
            strokeWidth="2.5"
            opacity={visualState === "wreck" ? 0.55 : damaged ? 0.82 : 1}
          />

          <path
            d="M 80 28 L 102 72 L 80 84 L 58 72 Z"
            fill={`url(#${darkId})`}
            opacity={hasCabin ? 0.58 : 0.78}
          />
          <ellipse
            cx="80"
            cy="50"
            rx="12"
            ry="16"
            fill="#bae6fd"
            opacity={hasCabin ? 0.86 : 0.28}
          />
          {!hasCabin && (
            <path
              d="M 72 43 L 88 59 M 88 43 L 72 59"
              stroke="#f97316"
              strokeWidth="2"
              strokeLinecap="round"
            />
          )}

          {hasEnergy ? (
            <circle
              cx="80"
              cy="72"
              r="10"
              fill={`url(#${energyId})`}
              opacity={glow ? 0.95 : 0.65}
            />
          ) : (
            <>
              <rect
                x="70"
                y="65"
                width="20"
                height="15"
                rx="2"
                fill="#020617"
                stroke="#f97316"
                strokeWidth="2"
              />
              <path d="M 72 66 L 64 58" stroke="#f97316" strokeWidth="2" strokeLinecap="round" />
            </>
          )}

          {hasMotor ? (
            <>
              <circle cx="65" cy="82" r="6" fill="#38bdf8" opacity="0.85" />
              <circle cx="95" cy="82" r="6" fill="#38bdf8" opacity="0.85" />
              {glow && (
                <>
                  <path d="M 63 89 Q 65 103 72 91" fill="#fef08a" opacity="0.85" />
                  <path d="M 93 89 Q 95 103 102 91" fill="#fef08a" opacity="0.85" />
                </>
              )}
            </>
          ) : (
            <>
              <circle cx="65" cy="82" r="6" fill="#020617" stroke="#f97316" strokeWidth="2" />
              <circle cx="95" cy="82" r="6" fill="#020617" stroke="#f97316" strokeWidth="2" />
            </>
          )}

          {hasAntenna ? (
            <>
              <path d="M 80 13 L 80 -1" stroke="#bae6fd" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 72 8 Q 80 1 88 8" fill="none" stroke="#bae6fd" strokeWidth="2" />
            </>
          ) : (
            <path d="M 76 14 L 87 4" stroke="#f97316" strokeWidth="2" strokeDasharray="3 3" />
          )}

          {damaged && (
            <>
              <path
                d="M 57 57 L 68 68 L 61 78"
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M 101 33 L 112 24 L 108 43"
                fill="none"
                stroke="#f97316"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle cx="113" cy="28" r="5" fill="#111827" opacity="0.62" />
            </>
          )}
        </svg>

        {!compact && (
          <div className={styles.shipPartsRow}>
            {parts.slice(0, 6).map((p) => (
              <span
                key={p.key}
                className={`${styles.shipPartDot} ${p.collected ? styles.shipPartOn : styles.shipPartOff}`}
                title={p.name}
                aria-hidden
              >
                {p.emoji}
              </span>
            ))}
          </div>
        )}
      </motion.div>

      <div className={styles.shipProgressBar} aria-hidden>
        <motion.div
          className={styles.shipProgressFill}
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", stiffness: 80 }}
        />
      </div>
      <p className={styles.shipProgressLabel} aria-hidden>
        {progress}% · {collected.length}/{parts.length || 6}
      </p>
      {!compact && (
        <>
          <div className={styles.shipMissingTags} aria-hidden>
            {(damaged ? missingParts : ["navicella completa"]).slice(0, 3).map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className={styles.shipYardDetails} aria-hidden>
            <span className={styles.shipYardCrate}>▣</span>
            <span className={styles.shipYardCrate}>▣</span>
            <span className={styles.shipYardTools}>⚒</span>
            <span className={styles.shipWorkerPikmin} />
            <span className={styles.shipWorkerPikmin} />
            <span className={styles.shipWorkerPikmin} />
          </div>
          {damaged && (
            <p className={styles.shipDamageTag}>
              {visualState === "wreck" ? "Relitto" : "Riparazione"}
            </p>
          )}
        </>
      )}
    </button>
  );
}
