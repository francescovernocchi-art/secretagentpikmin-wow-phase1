# FASE V1.8A — Navicella Eroe + Pulizia Mobile

**Data:** 2026-06-01  
**Base:** V1.8 (hangar cinematica)  
**Scope:** Solo presentazione `/villaggio` — nessuna modifica a gameplay, Supabase, DB, missioni, market, radar, scanner, chat, XP, inventario.

---

## Obiettivo

Rendere la **navicella il centro visivo assoluto** del villaggio su mobile, riducendo rumore UI e massimizzando l’area diorama.

---

## Modifiche implementate

### 1. Navicella ~2× (`DioramaShipHangar` + CSS)

| Prima | Dopo |
|-------|------|
| SVG `clamp(110px, 34vw, 160px)` | `clamp(200px, 58vw, 290px)` |
| heroMode | `clamp(210px, 62vw, 300px)` |

- Hangar anchor più largo (`98vw`, max 400px) e più alto (`translate -52%`)
- Progress bar e tier label mantenuti sotto la navicella

### 2. Hangar ampliato

Nuovi elementi in `DioramaShipHangar.tsx`:

- Impalcatura centrale (`hangarScaffoldCenter`)
- Zona manutenzione con tool rack
- Gru con gancio
- 5 casse tecniche (📦🔋🔩🛢️⚙️)
- 4 luci guida (rosso/blu + amber laterali)
- Piattaforma atterraggio 88% width, glow pad, chevron centrale
- Cavo centrale energia

### 3. Banner demo compatto su `/villaggio`

`DemoModeBanner.tsx`:

- **Auto-collapse** su route `/villaggio*`
- Pill compatta: `Demo · 🕶️ Francesco` (~32px altezza, <10% schermo)
- Tap per espandere link rapidi; freccia per ricomprimere
- Posizione `bottom: 4.75rem` — non copre il diorama

### 4. Etichette edifici on-demand

`DioramaBuilding.tsx` con `labelsOnDemand` (attivo in `heroMode`):

- Nessuna etichetta permanente Lv/name
- Tooltip al **hover**, **focus**, **tap** (2.2s via `buildingRevealed`)
- Ruoli Pikmin tech nascosti in heroMode (`hideRoles`)

### 5. Spazio verticale

| File | Cambiamento |
|------|-------------|
| `villaggio.tsx` | Header compatto, HUD `dense`, footer diorama off, quick tiles 4-col minimali |
| `VillageGameHUD.tsx` | Prop `dense` → `.gameHudDense` |
| `VillageDiorama.tsx` | `heroMode`: no header interno, no footer, scene `.heroScene` |
| CSS | `.heroScene` min 68–72dvh, context strip padding ridotto |

### 6. Layout edifici

`diorama-data.ts`: hangar `y:12 z:90`, edifici spostati più in basso per lasciare spazio alla navicella.

---

## File toccati

- `src/components/game/diorama/DioramaShipHangar.tsx`
- `src/components/game/VillageDiorama.tsx`
- `src/components/game/diorama/DioramaBuilding.tsx`
- `src/components/game/diorama/DioramaTechCrew.tsx`
- `src/components/game/diorama/VillageGameHUD.tsx`
- `src/components/game/diorama/diorama-data.ts`
- `src/components/game/DemoModeBanner.tsx`
- `src/routes/villaggio.tsx`
- `src/styles/village-diorama.module.css`

---

## Screenshot (demo Francesco)

| Viewport | File |
|----------|------|
| 390×844 | `docs/screenshot-v1-8a-390x844.png` |
| 430×932 | `docs/screenshot-v1-8a-430x932.png` |

---

## Video walkthrough

Frame sequenza in `docs/walkthrough-frames/`:

1. `frame-01-diorama.png` — villaggio hero 390×844
2. `frame-02-hangar-panel.png` — tap navicella → pannello hangar
3. `frame-03-430-diorama.png` — villaggio 430×932

Slideshow auto-play: apri `docs/walkthrough-v1-8a.html` nel browser.

---

## Criteri di accettazione

| # | Criterio | Stato |
|---|----------|-------|
| 1 | Occhio va subito alla navicella | ✅ Navicella ~2×, hangar in cima scena |
| 2 | Banner non copre villaggio | ✅ Pill compatta auto-collapse |
| 3 | Etichette non sporcano scena | ✅ Solo on tap/focus in heroMode |
| 4 | Diorama occupa quasi tutto lo schermo | ✅ heroScene 68–72dvh |
| 5 | Build OK | ✅ `npm run build` exit 0 |

---

## Test locale

```bash
cd secretagentpikmin-main
npm run dev
# Login → Demo Francesco → /villaggio
# DevTools → 390×844 e 430×932
```

---

## Non modificato (come richiesto)

Gameplay, Supabase, database, missioni, market, radar, scanner, chat, XP, inventario, Phaser, asset manager, archivi.
