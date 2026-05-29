# FASE 5.1 — QA Diorama, Bugfix e Polish

**Data:** 29 maggio 2026  
**Build:** `npm run build` ✅ exit 0  
**Scope:** Stabilità, usabilità e polish del diorama Fase 5 — nessuna macro-funzione nuova.

---

## Route testate

| Route | Stato | Note |
|-------|--------|------|
| `/base` | ✅ | CommandCenterHome + HUD + diorama compact |
| `/villaggio` | ✅ | Diorama principale, HUD, context strip, BottomNav visibile |
| `/villaggio/phaser` | ✅ | Phaser RTS legacy, BottomNav nascosto (fullscreen) |
| `/villaggio/scambi` | ✅ | `FamilyTradePanel` Phase 4 |
| `/mappa` | ✅ | Leaflet `BiomeMapPanel` |
| `/missioni` | ✅ | Missioni Phase 2/3 |
| `/pikmin` | ✅ | Redirect → `/archivio` (alias QA) |
| `/radar` | ✅ | Scanner pesato |
| `/mercato` | ✅ | Market + scambi |
| `/chat` | ✅ | Chat famiglia |
| `/archivio` | ✅ | Pikmin / specializzazioni (menu “Pikmin”) |
| `/navicella` | ✅ | `SpaceshipAssemblyPanel` + catalogo legacy solo admin |

Verifica: analisi statica route tree + build Vite (2651 moduli). Test manuale browser consigliato su mobile reale.

---

## Bug trovati

### Critici
1. **Edifici diorama non posizionati** — `left`/`top` erano sul figlio `.building` dentro `.buildingHit` senza coordinate sul wrapper `Link`/`button`, quindi gli edifici cliccabili finivano in alto a sinistra (0,0) invece che sul piano isometrico.
2. **BottomNav nascosto su `/villaggio`** — `__root.tsx` nascondeva la nav anche sulla vista diorama, rendendo difficile la navigazione mobile.

### Medi
3. **Laboratorio → route errata** — puntava a `/mercato` invece di `/lab`.
4. **HUD villaggio ridondante** — 8+ celle su griglia stretta, rischio overflow e duplicazione bioma/alert con header.
5. **Tooltip edifici solo hover** — su touch non comparivano senza focus.
6. **SVG navicella ID duplicati** — `shipHull` / `shipDark` fissi rompevano gradienti con più istanze (home + villaggio).
7. **`/navicella` duplicazione visiva** — barra progresso legacy + griglia `ship_parts` duplicava `SpaceshipAssemblyPanel` per tutti gli utenti.
8. **`/pikmin` assente** — il menu usa `/archivio`; link esterni a `/pikmin` davano 404.

### Minori
9. Pikmin badge 6px poco leggibili su mobile.
10. Context strip senza scroll orizzontale su schermi stretti.
11. Mancanza `aria-label` su edifici, hangar, modal navicella.
12. `dioramaScene` senza `overflow: hidden` — rischio clipping/z-index.

---

## Bug corretti

| # | Fix applicato | File |
|---|----------------|------|
| 1 | Posizione `left/top/zIndex` su `.buildingHit`; `.building` relativo | `DioramaBuilding.tsx`, CSS |
| 2 | `hideBottomNav` solo su `/villaggio/phaser` | `__root.tsx` |
| 3 | Laboratorio → `/lab` | `diorama-data.ts` |
| 4 | `VillageGameHUD` griglia responsive + `compactExtras` su pagina villaggio | `VillageGameHUD.tsx`, `villaggio.tsx` |
| 5 | Tooltip `:focus-visible`, `:active`, `@media (hover: none)` | `village-diorama.module.css` |
| 6 | `useId()` per gradienti SVG unici | `DioramaShipHangar.tsx` |
| 7 | Rimossa barra progresso duplicata; griglia legacy solo `isPapa` | `navicella.tsx` |
| 8 | Route `/pikmin` → redirect `/archivio` | `pikmin.tsx` |
| 9–12 | Badge 7px, context scroll, a11y, overflow scene | CSS + componenti |

### Edifici — mappa azioni (post-fix)

| Edificio | Route / azione |
|----------|----------------|
| Centro Controllo | `/base` |
| Accademia Pikmin | `/archivio` |
| Magazzino | `/inventario` |
| Laboratorio | `/lab` |
| Mercato | `/villaggio/scambi` |
| Hangar | Modal `SpaceshipAssemblyPanel` |

---

## Problemi rimasti (non bloccanti)

1. **Tooltip touch** — su alcuni browser mobile il tooltip richiede tap prolungato o focus; non c’è pannello tap-to-pin dedicato (Fase 6).
2. **Due sistemi navicella dati** — `spaceship_parts` (gioco) vs `ship_parts` (admin legacy) coesistono; per non-admin solo `SpaceshipAssemblyPanel` è visibile.
3. **Phaser vs diorama edifici** — `base_buildings` (Phaser) e `village_buildings` (game loop) non sincronizzati visivamente.
4. **HUD polling notifiche** — `useGameNotifications` intervallo 15s (pre-esistente); accettabile ma monitorare in produzione.
5. **Animazioni Framer Pikmin** — loop infinito intenzionale; su device molto lenti valutare `prefers-reduced-motion` in Fase 6.
6. **Edificio Mercato vs Mercato globale** — il tile “Mercato” nel diorama apre scambi famiglia; il menu bottom “Market” è `/mercato` (vendite) — comportamento corretto ma da spiegare in onboarding.

---

## Consigli per Fase 6

1. **Asset sprite edifici** — sostituire placeholder CSS con sprite isometrici per leggibilità a 320px.
2. **`prefers-reduced-motion`** — disabilitare sway Pikmin e shimmer acqua.
3. **Tap tooltip** — primo tap mostra tooltip, secondo tap naviga (pattern mobile game).
4. **Unificare progress navicella** — una sola fonte `spaceship_parts` in UI; admin legacy in sezione collassata.
5. **Test Playwright** — smoke su click edifici e apertura hangar.
6. **Sync bioma terreno** — quando GPS cambia bioma, transizione colore terreno animata.

---

## Checklist QA richiesta

| Area | Esito |
|------|--------|
| Route principali | ✅ |
| Edifici visibili/cliccabili | ✅ (fix posizionamento) |
| Pikmin colori/badge/animazioni | ✅ polish |
| Navicella hangar + panel | ✅ |
| HUD responsive | ✅ |
| CSS layout / z-index | ✅ |
| Accessibilità base | ✅ migliorata |
| Performance | ✅ nessun nuovo interval; animazioni CSS |
| Mobile BottomNav | ✅ ripristinata su villaggio |
| Build | ✅ |

---

## File modificati (5.1)

- `src/components/game/diorama/DioramaBuilding.tsx`
- `src/components/game/diorama/DioramaShipHangar.tsx`
- `src/components/game/diorama/DioramaPikminActor.tsx`
- `src/components/game/diorama/VillageGameHUD.tsx`
- `src/components/game/diorama/diorama-data.ts`
- `src/components/game/VillageDiorama.tsx`
- `src/styles/village-diorama.module.css`
- `src/routes/__root.tsx`
- `src/routes/villaggio.tsx`
- `src/routes/navicella.tsx`
- `src/routes/pikmin.tsx` (nuovo)
