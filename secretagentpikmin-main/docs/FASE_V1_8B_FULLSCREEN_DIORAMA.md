# FASE V1.8B — Fullscreen Diorama

**Data:** 2026-06-01  
**Base:** V1.8A (navicella eroe)  
**Scope:** Solo `/villaggio`, `VillageDiorama`, `VillageGameHUD`, CSS diorama — nessuna modifica a gameplay, Supabase, DB, missioni, radar, scanner, chat, XP, inventario, market.

---

## Obiettivo

Il **villaggio diventa protagonista** della schermata: diorama ≥60% viewport, HUD minimale, niente effetto dashboard.

---

## Modifiche

### 1. HUD compatto (−40/50%)

`VillageGameHUD` prop **`strip`**:

- Singola fascia orizzontale (6 stat: icona + valore)
- Niente barre di progresso, niente label testuali
- Padding ~0.15rem, font 9px
- Classe `.gameHud.gameHudStrip` con `display: flex !important`

### 2. Diorama XXL

Layout pagina **`villageFullscreenPage`** (`100dvh`, flex column):

| Zona | Altezza |
|------|---------|
| Header + HUD strip | ~52px |
| **Diorama stage** | `flex: 1` (≥60% viewport) |
| Quick dock icone | 32px |
| Nav bottom (app) | 4.25rem riservato |

`VillageDiorama` prop **`fullscreenMode`**:

- `.heroSceneFullscreen` — flex 1, no max-height, aspect-ratio unset
- `.fullscreenMode` — diorama riempie lo stage

### 3. Navicella nel primo viewport

- Hangar anchor `translate(-54%)` in fullscreen
- Posizione hangar invariata (V1.8A) — sempre in cima scena

### 4. Riduzione rumore

Rimosso da `/villaggio`:

- `VillageContextStrip` (chip bioma/raggio/remoto)
- Titolo duplicato "Secret Pikmin"
- Quick tiles con label → **4 icone** nel dock
- Badge Pikmin nascosti (`hideBadges` in fullscreen)
- Motion wrapper rimosso (meno padding)

### 5. Priorità visiva

1. Navicella (top hangar)  
2. Villaggio (edifici + terreno)  
3. Pikmin (senza badge)  
4. HUD strip  
5. Menu (dock + nav app)

---

## File modificati

- `src/routes/villaggio.tsx`
- `src/components/game/VillageDiorama.tsx`
- `src/components/game/diorama/VillageGameHUD.tsx`
- `src/components/game/diorama/DioramaPikminActor.tsx`
- `src/styles/village-diorama.module.css`

---

## Screenshot

| Viewport | File |
|----------|------|
| 390×844 | `docs/screenshot-v1-8b-390x844.png` |
| 430×932 | `docs/screenshot-v1-8b-430x932.png` |

Walkthrough: `docs/walkthrough-v1-8b.html`

---

## Criteri di accettazione

| # | Criterio | Stato |
|---|----------|-------|
| 1 | Villaggio domina schermata | ✅ flex stage ≥60% |
| 2 | Navicella focus | ✅ hangar top, sempre in viewport |
| 3 | Diorama > metà schermo | ✅ heroSceneFullscreen |
| 4 | Non sembra dashboard | ✅ strip HUD, no context strip |
| 5 | Build OK | ✅ |

---

## Test

```bash
npm run dev
# Demo Francesco → /villaggio
# DevTools 390×844 / 430×932
```
