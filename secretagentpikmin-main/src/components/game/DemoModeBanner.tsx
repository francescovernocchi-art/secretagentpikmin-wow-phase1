import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronUp, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { isDemoModeActive, exitDemoMode, DEMO_AGENTS } from "@/lib/demo-mode";
import { getSession, clearSession } from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/game/db";

function isVillaggioPath(pathname: string) {
  return pathname === "/villaggio" || pathname.startsWith("/villaggio/");
}

export function DemoModeBanner() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onVillaggio = isVillaggioPath(pathname);
  const [hidden, setHidden] = useState(false);
  const [expanded, setExpanded] = useState(!onVillaggio);
  const session = typeof window !== "undefined" ? getSession() : null;

  useEffect(() => {
    setExpanded(!onVillaggio);
  }, [onVillaggio]);

  if (!session || hidden) return null;
  if (!isDemoModeActive() && isSupabaseConfigured()) return null;

  const agent = session.role === "papa" ? DEMO_AGENTS.papa : DEMO_AGENTS.lorenzo;

  if (onVillaggio && !expanded) {
    return (
      <div className="fixed bottom-[4.75rem] left-3 right-3 z-40 max-w-lg mx-auto pointer-events-none">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="pointer-events-auto mx-auto flex items-center gap-1.5 rounded-full border border-primary/35 bg-night/92 px-3 py-1.5 text-[9px] uppercase tracking-widest text-primary shadow-lg backdrop-blur-sm"
          aria-label="Espandi banner demo"
        >
          <Sparkles className="h-3 w-3" />
          <span>
            Demo · {agent.emoji} {agent.name}
          </span>
          <ChevronUp className="h-3 w-3 opacity-70" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`fixed left-3 right-3 z-40 max-w-lg mx-auto pointer-events-none ${onVillaggio ? "bottom-[4.75rem]" : "bottom-[5.5rem]"}`}
    >
      <div
        className={`market-card pointer-events-auto border-primary/40 shadow-lg ${onVillaggio ? "p-2" : "p-3"}`}
      >
        <div className="flex items-start gap-2">
          <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-primary/80">Modalità demo</p>
            {!onVillaggio && (
              <p className="text-xs text-foreground/90 mt-0.5">
                Sei{" "}
                <strong>
                  {agent.emoji} {agent.name}
                </strong>
                . Prova radar, market, villaggio, missioni e chat — tutto in locale.
              </p>
            )}
            {onVillaggio && (
              <p className="text-[10px] text-foreground/80 mt-0.5">
                {agent.emoji} {agent.name} · demo locale
              </p>
            )}
            <div className={`flex flex-wrap gap-1.5 ${onVillaggio ? "mt-1" : "mt-2"}`}>
              <Link
                to="/radar"
                className="btn-neon px-2 py-0.5 text-[8px] uppercase tracking-wider"
              >
                Scanner
              </Link>
              <Link
                to="/mercato"
                className="btn-neon px-2 py-0.5 text-[8px] uppercase tracking-wider"
              >
                Market
              </Link>
              <Link
                to="/villaggio"
                className="btn-neon px-2 py-0.5 text-[8px] uppercase tracking-wider"
              >
                Villaggio
              </Link>
              <Link
                to="/missioni"
                className="btn-neon px-2 py-0.5 text-[8px] uppercase tracking-wider"
              >
                Missioni
              </Link>
              <Link to="/chat" className="btn-neon px-2 py-0.5 text-[8px] uppercase tracking-wider">
                Chat
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-1 shrink-0">
            {onVillaggio && (
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="panel p-1"
                aria-label="Comprimi banner demo"
              >
                <ChevronUp className="h-3.5 w-3.5 rotate-180" />
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (isDemoModeActive()) {
                  exitDemoMode();
                  clearSession();
                  window.location.href = "/";
                } else setHidden(true);
              }}
              className="panel p-1"
              aria-label="Chiudi demo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
