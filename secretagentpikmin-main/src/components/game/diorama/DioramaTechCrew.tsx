import { motion } from "framer-motion";
import { AnimatedPikmin } from "@/components/pikmin/AnimatedPikmin";
import { HANGAR_TECH_CREW } from "./diorama-data";
import styles from "@/styles/village-diorama.module.css";

interface DioramaTechCrewProps {
  compact?: boolean;
  hideRoles?: boolean;
}

/** Pikmin tecnici decorativi — solo scena hangar, nessuna logica gameplay. */
export function DioramaTechCrew({ compact, hideRoles }: DioramaTechCrewProps) {
  const crew = compact ? HANGAR_TECH_CREW.slice(0, 2) : HANGAR_TECH_CREW;

  return (
    <>
      {crew.map((spot, i) => (
        <motion.div
          key={spot.id}
          className={styles.techPikmin}
          style={{ left: `${spot.x}%`, top: `${spot.y}%`, zIndex: spot.z }}
          animate={{
            y: [0, -2, 0],
            x: spot.anim === "carry" ? [0, 2, 0] : [0, -1, 0],
          }}
          transition={{ repeat: Infinity, duration: 2.8 + i * 0.35, ease: "easeInOut", delay: i * 0.2 }}
          aria-hidden
        >
          <div className={styles.techPikminShadow} />
          {spot.prop && <span className={styles.techProp}>{spot.prop}</span>}
          <AnimatedPikmin
            type={spot.type}
            animation={spot.anim}
            size={compact ? 22 : 26}
            showShadow={false}
            showDust={spot.anim === "carry"}
          />
          {!compact && !hideRoles && <span className={styles.techRole}>{spot.role}</span>}
        </motion.div>
      ))}
    </>
  );
}
