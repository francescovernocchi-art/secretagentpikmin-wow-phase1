import { motion } from "framer-motion";
import { AnimatedPikmin } from "@/components/pikmin/AnimatedPikmin";
import type { DioramaEffect, DioramaPikminRoute } from "@/data/dioramaLayouts";
import { ParticleEffect } from "@/components/fx/ParticleEffect";
import styles from "@/styles/village-diorama.module.css";

export function DioramaPikminTraffic({
  routes,
  compact,
  size,
}: {
  routes: DioramaPikminRoute[];
  compact?: boolean;
  size: number;
}) {
  const active = routes.filter((r) => r.enabled !== false);
  const list = compact ? active.slice(0, 4) : active.slice(0, 12);

  return (
    <>
      {list.map((route, index) => {
        const xs = route.waypoints.map((w) => `${w.x}%`);
        const ys = route.waypoints.map((w) => `${w.y}%`);
        const anim = route.anim === "idle" ? "walk" : route.anim;
        return (
          <motion.div
            key={route.id}
            className={styles.trafficPikmin}
            style={{ zIndex: 62 + index }}
            initial={{ left: xs[0], top: ys[0] }}
            animate={{ left: xs, top: ys }}
            transition={{
              repeat: Infinity,
              duration: route.duration,
              ease: "linear",
              delay: index * 0.55,
            }}
            aria-hidden
          >
            <div className={styles.pikminShadow} />
            <AnimatedPikmin
              type={route.type}
              animation={anim}
              size={size}
              showShadow={false}
              showDust={route.anim === "carry"}
            />
          </motion.div>
        );
      })}
    </>
  );
}

export function DioramaEffectsLayer({ effects }: { effects: DioramaEffect[] }) {
  return (
    <>
      {effects.map((fx) => {
        if (fx.type === "particle-dust") {
          return (
            <ParticleEffect
              key={fx.id}
              variant="dust"
              density={fx.intensity === "high" ? "high" : fx.intensity === "low" ? "low" : "medium"}
            />
          );
        }
        if (fx.type === "particle-energy") {
          return (
            <ParticleEffect
              key={fx.id}
              variant="energy"
              density={fx.intensity === "high" ? "high" : "low"}
              className="opacity-60"
            />
          );
        }
        if (fx.type === "building-glow" && fx.x != null && fx.y != null) {
          return (
            <div
              key={fx.id}
              className={styles.engineBuildingGlow}
              style={{ left: `${fx.x}%`, top: `${fx.y}%`, zIndex: fx.z ?? 45 }}
              aria-hidden
            />
          );
        }
        if (fx.type === "construction-dust" && fx.x != null && fx.y != null) {
          return (
            <div
              key={fx.id}
              className={styles.engineConstructionDust}
              style={{ left: `${fx.x}%`, top: `${fx.y}%`, zIndex: fx.z ?? 50 }}
              aria-hidden
            />
          );
        }
        if (fx.type === "hangar-lights") {
          return (
            <div key={fx.id} className={styles.engineHangarLights} style={{ zIndex: fx.z ?? 88 }} aria-hidden>
              <span className={styles.engineHangarLight} style={{ left: "18%" }} />
              <span className={styles.engineHangarLight} style={{ left: "50%" }} />
              <span className={styles.engineHangarLight} style={{ left: "82%" }} />
            </div>
          );
        }
        return null;
      })}
    </>
  );
}
