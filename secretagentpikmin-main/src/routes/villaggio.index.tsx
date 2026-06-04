import { createFileRoute, Link } from "@tanstack/react-router";
import { Gamepad2, Home, Map } from "lucide-react";
import { VillageDiorama } from "@/components/game/VillageDiorama";
import { VillageGameHUD } from "@/components/game/diorama/VillageGameHUD";
import { hapticTap } from "@/lib/haptic";
import { useVillageDiorama } from "@/hooks/useGameData";
import { getSession } from "@/lib/session";
import { agentKeyFromSession } from "@/lib/game/planet";
import styles from "@/styles/village-diorama.module.css";

export const Route = createFileRoute("/villaggio/")({
  component: VillaggioDioramaPage,
  head: () => ({
    meta: [
      { title: "Villaggio Pikmin · Diorama" },
      {
        name: "description",
        content: "Il tuo villaggio isometrico vivo — edifici, Pikmin e navicella.",
      },
    ],
  }),
});

function VillaggioDioramaPage() {
  const session = typeof window !== "undefined" ? getSession() : null;
  const agent = agentKeyFromSession(session?.role);
  const { villageName, loading } = useVillageDiorama(agent);

  return (
    <div className={styles.villageFullscreenPage}>
      <header
        className={styles.villageTopChrome}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className={styles.villageTitleRow}>
          <Link
            to="/base"
            onClick={hapticTap}
            className={`panel ${styles.villageIconBtn}`}
            aria-label="Torna al centro comando"
          >
            <Home className="h-3.5 w-3.5" />
          </Link>
          <h1 className={styles.villageTitle}>{loading ? "…" : villageName || "Villaggio"}</h1>
          <Link
            to="/mappa"
            onClick={hapticTap}
            className={`panel ${styles.villageIconBtn}`}
            aria-label="Apri mappa biomi"
          >
            <Map className="h-3.5 w-3.5" />
          </Link>
        </div>
        <VillageGameHUD compactExtras strip />
      </header>

      <main className={styles.villageStage}>
        <VillageDiorama fullScreen showFooter={false} heroMode fullscreenMode ownerAgent={agent} />
      </main>

      <nav className={styles.villageQuickDock} aria-label="Azioni villaggio">
        <QuickIcon to="/villaggio/edifici" emoji="🏗️" label="Edifici" />
        <QuickIcon to="/villaggio/scambi" emoji="🤝" label="Scambi" />
        <QuickIcon to="/navicella" emoji="🚀" label="Navicella" />
        <QuickIcon
          to="/villaggio/phaser"
          emoji="🎮"
          label="Phaser"
          icon={<Gamepad2 className="h-3.5 w-3.5 text-primary" />}
        />
      </nav>
    </div>
  );
}

function QuickIcon({
  to,
  emoji,
  label,
  icon,
}: {
  to: string;
  emoji: string;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={hapticTap}
      className={styles.villageQuickIcon}
      aria-label={label}
      title={label}
    >
      <span className="text-base leading-none">{emoji}</span>
      {icon}
    </Link>
  );
}
