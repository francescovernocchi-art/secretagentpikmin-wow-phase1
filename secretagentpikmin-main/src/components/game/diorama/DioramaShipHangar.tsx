import { useId } from "react";
import { motion } from "framer-motion";
import type { DbSpaceshipPart } from "@/types/phase2-db";
import { ParticleEffect } from "@/components/fx/ParticleEffect";
import { shipVisualTier, SHIP_TIER_LABEL, type ShipVisualTier } from "./ship-visual-state";
import styles from "@/styles/village-diorama.module.css";

interface DioramaShipHangarProps {
  parts: DbSpaceshipPart[];
  percent: number;
  onClick?: () => void;
  compact?: boolean;
}

function tierFlags(tier: ShipVisualTier) {
  return {
    wings: tier !== "wreck",
    leftWingFull: tier === "p50" || tier === "p75" || tier === "complete",
    rightWingFull: tier === "p75" || tier === "complete",
    cockpit: tier !== "wreck",
    cockpitLit: tier === "p50" || tier === "p75" || tier === "complete",
    antenna: tier === "p75" || tier === "complete",
    stabilizers: tier === "p50" || tier === "p75" || tier === "complete",
    engines: tier !== "wreck",
    engineGlow: tier === "p75" || tier === "complete",
    panelsIntact: tier === "p75" || tier === "complete",
    hullBright: tier === "complete",
    navLights: tier !== "wreck",
    smoke: tier === "wreck" || tier === "p25",
    sparks: tier === "p25" || tier === "p50",
  };
}

export function DioramaShipHangar({ parts, percent, onClick, compact }: DioramaShipHangarProps) {
  const uid = useId().replace(/:/g, "");
  const hullId = `shipHull-${uid}`;
  const darkId = `shipDark-${uid}`;
  const glowId = `shipGlow-${uid}`;
  const metalId = `shipMetal-${uid}`;

  const collected = parts.filter((p) => p.collected);
  const tier = shipVisualTier(percent);
  const flags = tierFlags(tier);
  const tierClass = styles[`shipTier_${tier}`];

  return (
    <button
      type="button"
      className={`${styles.shipHangar} ${compact ? styles.shipHangarCompact : ""}`}
      onClick={onClick}
      aria-label={`Hangar navicella — ${SHIP_TIER_LABEL[tier]}, ${percent}% completata, ${collected.length} di ${parts.length} pezzi`}
    >
      <div className={styles.hangarCompound} aria-hidden>
        {/* Struttura fisica hangar */}
        <div className={styles.hangarRoof}>
          <span className={styles.hangarTruss} />
          <span className={`${styles.hangarTruss} ${styles.hangarTrussAlt}`} />
          <span className={styles.hangarRoofSheet} />
        </div>

        <div className={styles.hangarScaffoldL} />
        <div className={styles.hangarScaffoldR} />
        <div className={styles.hangarScaffoldCenter} />

        <div className={styles.hangarMaintenanceBay}>
          <span className={styles.hangarToolRack}>🔧</span>
          <span className={styles.hangarToolRack}>⚡</span>
        </div>

        <div className={styles.hangarCrane}>
          <span className={styles.hangarCraneArm} />
          <span className={styles.hangarCraneCable} />
          <span className={styles.hangarCraneHook} />
        </div>

        <div className={styles.hangarCrate} style={{ left: "4%", bottom: "14%" }}>
          📦
        </div>
        <div className={styles.hangarCrate} style={{ left: "88%", bottom: "12%" }}>
          🔋
        </div>
        <div className={styles.hangarCrateSm} style={{ left: "10%", bottom: "24%" }}>
          🔩
        </div>
        <div className={styles.hangarCrateSm} style={{ left: "78%", bottom: "22%" }}>
          🛢️
        </div>
        <div className={styles.hangarCrateSm} style={{ left: "92%", bottom: "26%" }}>
          ⚙️
        </div>

        <div className={styles.hangarCableL} />
        <div className={styles.hangarCableR} />
        <div className={styles.hangarCableCenter} />

        <div className={styles.hangarGuideLightL} />
        <div className={styles.hangarGuideLightR} />
        <div className={styles.hangarGuideLightLL} />
        <div className={styles.hangarGuideLightRR} />

        <div className={styles.hangarLandingPad}>
          <span className={styles.hangarPadRing} />
          <span className={styles.hangarPadMark} />
          <span className={styles.hangarPadChevron} />
        </div>

        <div className={styles.hangarPadGlow} />

        {/* FX ambiente */}
        {flags.smoke && <div className={styles.shipSmoke} />}
        {flags.sparks && <div className={styles.shipSparks} />}
        <ParticleEffect
          variant="ship-glow"
          className={flags.engineGlow ? styles.shipFxStrong : styles.shipFxSoft}
        />

        {/* Navicella */}
        <motion.div
          className={`${styles.shipModel} ${tierClass} ${flags.engineGlow ? styles.shipGlow : ""}`}
          animate={{ y: tier === "complete" ? [0, -5, 0] : [0, -3, 0] }}
          transition={{
            repeat: Infinity,
            duration: tier === "complete" ? 2.4 : 3.2,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 160 120" className={styles.shipSvg} aria-hidden>
            <defs>
              <linearGradient id={hullId} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor={flags.hullBright ? "#7dd3fc" : "#38bdf8"} />
                <stop offset="100%" stopColor={flags.hullBright ? "#0ea5e9" : "#0369a1"} />
              </linearGradient>
              <linearGradient id={darkId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e3a5f" />
                <stop offset="100%" stopColor="#0c1929" />
              </linearGradient>
              <linearGradient id={metalId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
              <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ombra */}
            <ellipse cx="80" cy="108" rx="52" ry="10" fill="#00000055" />

            {/* Stabilizzatori */}
            {flags.stabilizers && (
              <>
                <path
                  d="M 48 88 L 38 102 L 48 98 Z"
                  fill={`url(#${metalId})`}
                  opacity={flags.panelsIntact ? 1 : 0.65}
                />
                <path
                  d="M 112 88 L 122 102 L 112 98 Z"
                  fill={`url(#${metalId})`}
                  opacity={flags.panelsIntact ? 1 : 0.65}
                />
              </>
            )}

            {/* Ala sinistra */}
            {flags.wings && (
              <path
                d={
                  flags.leftWingFull
                    ? "M 18 58 L 4 72 L 18 78 L 32 68 Z"
                    : "M 22 62 L 12 72 L 22 76 L 30 68 Z"
                }
                fill={flags.leftWingFull ? `url(#${hullId})` : "#334155"}
                stroke={flags.leftWingFull ? "#7dd3fc" : "#475569"}
                strokeWidth="1.2"
                opacity={flags.leftWingFull ? 1 : 0.75}
              />
            )}
            {tier === "wreck" && (
              <path
                d="M 20 64 L 8 76 L 18 74 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1"
                opacity="0.8"
              />
            )}

            {/* Ala destra */}
            {flags.rightWingFull ? (
              <path
                d="M 142 58 L 156 72 L 142 78 L 128 68 Z"
                fill={`url(#${hullId})`}
                stroke="#7dd3fc"
                strokeWidth="1.2"
              />
            ) : flags.wings ? (
              <path
                d="M 138 62 L 148 72 L 138 76 L 130 68 Z"
                fill="#334155"
                stroke="#475569"
                strokeWidth="1"
                opacity="0.7"
              />
            ) : null}

            {/* Motori */}
            {flags.engines && (
              <>
                <rect
                  x="58"
                  y="92"
                  width="14"
                  height="12"
                  rx="2"
                  fill={`url(#${darkId})`}
                  stroke="#64748b"
                  strokeWidth="0.8"
                />
                <rect
                  x="88"
                  y="92"
                  width="14"
                  height="12"
                  rx="2"
                  fill={`url(#${darkId})`}
                  stroke="#64748b"
                  strokeWidth="0.8"
                />
                {flags.engineGlow && (
                  <>
                    <ellipse
                      cx="65"
                      cy="104"
                      rx="6"
                      ry="4"
                      fill={`url(#${glowId})`}
                      className={styles.shipEnginePulse}
                    />
                    <ellipse
                      cx="95"
                      cy="104"
                      rx="6"
                      ry="4"
                      fill={`url(#${glowId})`}
                      className={styles.shipEnginePulse}
                    />
                  </>
                )}
              </>
            )}

            {/* Scafo principale */}
            <path
              d="M 80 14 L 128 68 L 80 96 L 32 68 Z"
              fill={`url(#${hullId})`}
              stroke={flags.panelsIntact ? "#bae6fd" : "#64748b"}
              strokeWidth="2"
            />
            <path
              d="M 80 28 L 112 64 L 80 82 L 48 64 Z"
              fill={`url(#${darkId})`}
              opacity={flags.panelsIntact ? 0.45 : 0.75}
            />

            {/* Pannelli danneggiati (relitto) */}
            {(tier === "wreck" || tier === "p25") && (
              <>
                <path
                  d="M 70 42 L 78 50 L 72 58 L 64 50 Z"
                  fill="#0f172a"
                  stroke="#ef4444"
                  strokeWidth="0.8"
                  opacity="0.85"
                />
                <path
                  d="M 92 48 L 98 56 L 90 62 L 84 54 Z"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="0.6"
                  opacity="0.7"
                />
              </>
            )}

            {/* Cockpit */}
            {flags.cockpit && (
              <ellipse
                cx="80"
                cy="48"
                rx="14"
                ry="18"
                fill={flags.cockpitLit ? "#bae6fd" : "#334155"}
                opacity={flags.cockpitLit ? 0.85 : 0.5}
                stroke={flags.cockpitLit ? "#e0f2fe" : "#64748b"}
                strokeWidth="1.5"
              />
            )}

            {/* Antenna */}
            {flags.antenna && (
              <>
                <line x1="80" y1="14" x2="80" y2="4" stroke="#94a3b8" strokeWidth="2" />
                <circle
                  cx="80"
                  cy="3"
                  r="3"
                  fill={flags.hullBright ? "#38bdf8" : "#64748b"}
                  className={styles.shipAntennaBlink}
                />
              </>
            )}

            {/* Luci di navigazione */}
            {flags.navLights && (
              <>
                <circle cx="34" cy="66" r="2.5" fill="#ef4444" className={styles.shipNavLightRed} />
                <circle
                  cx="126"
                  cy="66"
                  r="2.5"
                  fill="#38bdf8"
                  className={styles.shipNavLightBlue}
                />
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
                >
                  {p.emoji}
                </span>
              ))}
            </div>
          )}
        </motion.div>

        {!compact && (
          <div className={styles.hangarYard} aria-hidden>
            <span className={styles.hangarYardTape} />
            <span className={styles.hangarFloodLight} style={{ left: "2%" }} />
            <span className={styles.hangarFloodLight} style={{ right: "2%" }} />
            <span className={styles.hangarFloodLight} style={{ left: "48%" }} />
            <span className={styles.hangarRunwayStrip} />
            <span className={styles.hangarWarningLight} style={{ left: "8%" }} />
            <span className={styles.hangarWarningLight} style={{ right: "8%" }} />
            <span className={styles.hangarForklift}>🛞</span>
            <span className={styles.hangarMiniCart}>🚜</span>
            <span className={styles.hangarCart2}>🛒</span>
            <div className={styles.hangarMaterialPile}>
              <span>🔩</span>
              <span>📦</span>
              <span>🛢️</span>
            </div>
            <div className={styles.hangarPalletStack}>
              <span className={styles.hangarPallet}>▬</span>
              <span>📦</span>
            </div>
            <div className={styles.hangarWorkBench}>🔧⚡</div>
            <div className={styles.hangarTechSpot}>
              <span>👷</span>
              <span className={styles.hangarTechBadge}>TEC</span>
            </div>
            <span className={styles.hangarYardCrate} style={{ left: "14%" }}>
              📦
            </span>
            <span className={styles.hangarYardCrate} style={{ left: "68%" }}>
              🔋
            </span>
            <span className={styles.hangarYardCrate} style={{ left: "82%" }}>
              ⚙️
            </span>
            <span className={styles.hangarYardMaterial} style={{ left: "24%" }}>
              🪵
            </span>
            <span className={styles.hangarYardMaterial} style={{ left: "58%" }}>
              🔩
            </span>
          </div>
        )}
      </div>

      <div className={styles.shipProgressBar} aria-hidden>
        <motion.div
          className={styles.shipProgressFill}
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ type: "spring", stiffness: 80 }}
        />
      </div>
      <p className={styles.shipProgressLabel} aria-hidden>
        {SHIP_TIER_LABEL[tier]} · {percent}%
      </p>
    </button>
  );
}
