import styles from "@/styles/village-diorama.module.css";

type VisualPikminRole = "explorer" | "worker" | "builder" | "technician";

interface VisualPikmin {
  id: string;
  role: VisualPikminRole;
  label: string;
  species: string;
  color: string;
  accent: string;
  x: number;
  y: number;
  z: number;
  path: "pathA" | "pathB" | "pathC" | "work" | "tech";
  delay: number;
  duration: number;
  flip?: boolean;
  cargo?: "crate" | "crystal" | "twig";
}

const VISUAL_PIKMIN: VisualPikmin[] = [
  { id: "scout-red-1", role: "explorer", label: "Esplora", species: "rosso", color: "#ef4444", accent: "#fecaca", x: 21, y: 56, z: 72, path: "pathA", delay: -0.4, duration: 7.5 },
  { id: "scout-blue-1", role: "explorer", label: "Pattuglia", species: "blu", color: "#38bdf8", accent: "#bae6fd", x: 44, y: 51, z: 75, path: "pathB", delay: -2.1, duration: 8.2, flip: true },
  { id: "scout-yellow-1", role: "explorer", label: "Sentiero", species: "giallo", color: "#facc15", accent: "#fef08a", x: 58, y: 55, z: 77, path: "pathC", delay: -1.2, duration: 7.8 },
  { id: "worker-purple-1", role: "worker", label: "Trasporta", species: "viola", color: "#a855f7", accent: "#e9d5ff", x: 32, y: 67, z: 76, path: "pathB", delay: -0.8, duration: 9.2, cargo: "crate" },
  { id: "worker-red-1", role: "worker", label: "Casse", species: "rosso", color: "#f97316", accent: "#fed7aa", x: 38, y: 61, z: 78, path: "pathA", delay: -3, duration: 8.8, cargo: "twig", flip: true },
  { id: "worker-blue-1", role: "worker", label: "Materiali", species: "blu", color: "#2563eb", accent: "#bfdbfe", x: 49, y: 71, z: 80, path: "pathC", delay: -4.4, duration: 9.6, cargo: "crystal" },
  { id: "builder-yellow-1", role: "builder", label: "Cantiere", species: "giallo", color: "#eab308", accent: "#fef3c7", x: 61, y: 64, z: 84, path: "work", delay: -0.2, duration: 3.4 },
  { id: "builder-rock-1", role: "builder", label: "Ripara", species: "roccia", color: "#64748b", accent: "#cbd5e1", x: 55, y: 72, z: 83, path: "work", delay: -1.8, duration: 3.9, flip: true },
  { id: "builder-white-1", role: "builder", label: "Misura", species: "bianco", color: "#f8fafc", accent: "#bbf7d0", x: 66, y: 68, z: 86, path: "work", delay: -2.5, duration: 4.2 },
  { id: "tech-blue-1", role: "technician", label: "Tecnico", species: "blu", color: "#0ea5e9", accent: "#7dd3fc", x: 74, y: 59, z: 90, path: "tech", delay: -0.7, duration: 4.8 },
  { id: "tech-red-1", role: "technician", label: "Cablaggi", species: "rosso", color: "#dc2626", accent: "#fca5a5", x: 80, y: 50, z: 91, path: "tech", delay: -2.2, duration: 5.1, flip: true },
  { id: "tech-wing-1", role: "technician", label: "Sensori", species: "alato", color: "#fb7185", accent: "#fbcfe8", x: 69, y: 46, z: 88, path: "tech", delay: -3.1, duration: 5.5 },
  { id: "scout-white-1", role: "explorer", label: "Ricogn.", species: "bianco", color: "#f8fafc", accent: "#ddd6fe", x: 27, y: 42, z: 68, path: "pathC", delay: -5.5, duration: 8.6 },
  { id: "worker-yellow-1", role: "worker", label: "Scorte", species: "giallo", color: "#fde047", accent: "#fef9c3", x: 72, y: 34, z: 70, path: "pathA", delay: -6.1, duration: 9.1, cargo: "crate" },
];

export function DioramaLivingColony() {
  return (
    <div className={styles.livingColonyLayer} aria-label="Pikmin del villaggio al lavoro">
      {VISUAL_PIKMIN.map((pikmin) => (
        <div
          key={pikmin.id}
          className={`${styles.livingPikmin} ${styles[`livingPikmin${pikmin.path}`]} ${styles[`livingPikmin${pikmin.role}`]}`}
          style={{
            left: `${pikmin.x}%`,
            top: `${pikmin.y}%`,
            zIndex: pikmin.z,
            ["--pikmin-color" as string]: pikmin.color,
            ["--pikmin-accent" as string]: pikmin.accent,
            ["--pikmin-delay" as string]: `${pikmin.delay}s`,
            ["--pikmin-duration" as string]: `${pikmin.duration}s`,
            ["--pikmin-flip" as string]: pikmin.flip ? -1 : 1,
          }}
          aria-label={`Pikmin ${pikmin.species}: ${pikmin.label}`}
        >
          <span className={styles.livingPikminShadow} aria-hidden />
          <span className={styles.livingPikminFigure} aria-hidden>
            <span className={styles.livingPikminStem} />
            <span className={styles.livingPikminLeaf} />
            <span className={styles.livingPikminHead}>
              <span className={styles.livingPikminEye} />
              <span className={styles.livingPikminEye} />
            </span>
            <span className={styles.livingPikminBody} />
            <span className={styles.livingPikminFoot} />
            <span className={styles.livingPikminFoot} />
          </span>
          {pikmin.cargo && <span className={`${styles.livingPikminCargo} ${styles[`livingCargo${pikmin.cargo}`]}`} aria-hidden />}
          {pikmin.role === "builder" && (
            <>
              <span className={styles.livingPikminTool} aria-hidden />
              <span className={styles.constructionDust} aria-hidden />
            </>
          )}
          {pikmin.role === "technician" && <span className={styles.techSpark} aria-hidden />}
          <span className={styles.livingPikminLabel}>{pikmin.label}</span>
        </div>
      ))}
    </div>
  );
}
