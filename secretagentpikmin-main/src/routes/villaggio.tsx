import { createFileRoute, Link } from "@tanstack/react-router";
import { Gamepad2, Home, Map } from "lucide-react";
import { motion } from "framer-motion";
import { VillageDiorama } from "@/components/game/VillageDiorama";
import { VillageGameHUD } from "@/components/game/diorama/VillageGameHUD";
import { VillageContextStrip } from "@/components/game/diorama/VillageContextStrip";
import { getBiomeByKey } from "@/data/secretPikminWorld";
import { GAME_IDENTITY } from "@/data/secretPikminWorld";
import { hapticTap } from "@/lib/haptic";
import { usePlayerBiome, useVillageDiorama } from "@/hooks/useGameData";
import { getSession } from "@/lib/session";
import { agentKeyFromSession } from "@/lib/game/planet";

export const Route = createFileRoute("/villaggio")({
  component: VillaggioDioramaPage,
  head: () => ({
    meta: [
      { title: "Villaggio Pikmin · Diorama" },
      { name: "description", content: "Il tuo villaggio isometrico vivo — edifici, Pikmin e navicella." },
    ],
  }),
});

function VillaggioDioramaPage() {
  const session = typeof window !== "undefined" ? getSession() : null;
  const agent = agentKeyFromSession(session?.role);
  const { biome } = usePlayerBiome(agent);
  const { villageName, loading } = useVillageDiorama(agent);
  const biomeDef = getBiomeByKey(biome);

  return (
    <div className="min-h-[100dvh] pb-16 sm:pb-24 overflow-x-hidden section-theme-village bg-[linear-gradient(180deg,oklch(0.12_0.04_250)_0%,oklch(0.08_0.03_280)_100%)]">
      {/* Micro HUD */}
      <header
        className="sticky top-0 z-30 border-b border-primary/15 bg-night/90 backdrop-blur-md"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="flex items-center gap-1.5 px-2 py-1.5 min-h-10">
          <Link to="/base" onClick={hapticTap} className="panel p-1.5 shrink-0" aria-label="Torna al centro comando">
            <Home className="h-3.5 w-3.5" />
          </Link>
          <div className="min-w-[4.25rem] max-w-[5.25rem] text-left">
            <p className="text-[7px] uppercase tracking-[0.22em] text-primary/60 truncate">{GAME_IDENTITY.title}</p>
            <h1 className="font-display text-[11px] leading-none text-glow truncate">{loading ? "…" : villageName || "Villaggio"}</h1>
          </div>
          <VillageGameHUD biomeLabel={biomeDef?.label} biomeEmoji={biomeDef?.emoji} compactExtras micro />
          <Link to="/mappa" onClick={hapticTap} className="panel p-1.5 shrink-0" aria-label="Apri mappa biomi">
            <Map className="h-3.5 w-3.5" />
          </Link>
        </div>
      </header>

      <main className="px-0 pt-0 space-y-3 max-w-2xl mx-auto sm:px-2 sm:pt-3">
        <motion.div className="min-h-[calc(100dvh-7.75rem)] sm:min-h-0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <VillageDiorama fullScreen showFooter ownerAgent={agent} />
        </motion.div>

        <div className="px-2">
          <VillageContextStrip />
        </div>

        {/* Quick actions — game style */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-2">
          <QuickTile to="/villaggio/edifici" emoji="🏗️" label="Edifici" />
          <QuickTile to="/villaggio/scambi" emoji="🤝" label="Scambi" />
          <QuickTile to="/navicella" emoji="🚀" label="Navicella" />
          <QuickTile to="/villaggio/phaser" emoji="🎮" label="Phaser RTS" icon={<Gamepad2 className="h-4 w-4 text-primary" />} />
        </div>

        <p className="text-[9px] text-center text-muted-foreground uppercase tracking-widest px-4">
          Clicca un edificio o la navicella · Modalità Phaser RTS disponibile per costruzione avanzata
        </p>
      </main>
    </div>
  );
}

function QuickTile({
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
      className="panel-strong p-3 flex flex-col items-center gap-1.5 active:scale-95 transition-transform hover:ring-1 hover:ring-primary/40"
    >
      <span className="text-2xl">{emoji}</span>
      {icon}
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </Link>
  );
}
