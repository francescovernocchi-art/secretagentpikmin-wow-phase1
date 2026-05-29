# Fase 7 — Uniformare legacy e demo giocabile

**Progetto:** Secret Pikmin  
**Baseline:** Fase 6.2 completata, build OK  
**Data:** 2026-05-29  
**Vincoli rispettati:** gameplay, Supabase, fallback, XP, villaggi, scambi, radar, scanner, archivi, asset manager e Phaser non alterati nella logica core.

---

## 1. Legacy uniformati

### Mercato — tab Ingredienti e Ricette (`src/routes/mercato.tsx`)

- Tab con stile `market-tab` / `market-tab-active` (art direction Fase 6).
- Lista ingredienti e ricette su **`MarketGameCard`**: SVG risorsa, rarità, valore monete, footer azione.
- FX `pickup` all'acquisto ingrediente, `mission_complete` allo sblocco ricetta.
- Fallback demo: `DEMO_INGREDIENTS` / `DEMO_RECIPES` quando Supabase assente o demo attiva.

### MarketPanel vendita (`src/components/game/MarketPanel.tsx`)

- Refactor su **`MarketGameCard`** condiviso (elimina markup card duplicato).

### ResourceTransformPanel (`src/components/game/ResourceTransformPanel.tsx`)

- Card `market-card` + `transform-card` con icona SVG, emoji, preview freccia risultato.
- Flash `market-debt-flash` e messaggio esito post-trasformazione.
- FX `pickup` al successo.

### FamilyTradePanel (`src/components/game/FamilyTradePanel.tsx`)

- Card familiari Francesco ↔ Lorenzo.
- Selezione oggetti con `MarketGameCard` (rarità da prezzo).
- Notifiche in arrivo, proposte inviate, storico compatto.
- Trade card con emoji oggetti e azioni Accetta/Rifiuta.

### Componente condiviso

- **`src/components/game/market/MarketGameCard.tsx`** — card mercato riusabile (rarità, SVG, footer, badge).

### CSS (`src/styles/art-direction.css`)

- `.market-tab`, `.market-tab-active`
- `.transform-card`, `.transform-preview-arrow`

---

## 2. Demo mode

### Modulo (`src/lib/demo-mode.ts`)

- Agenti **Francesco** (`papa`) e **Lorenzo** (`lorenzo`).
- `enterDemoSession()`, `ensureDemoSeed()`, `isDemoModeActive()`, `isDemoEligible()`.
- Seed locale: inventario ricco, chat demo, scambio P2P in arrivo per Lorenzo, 2 pezzi navicella.

### Entry point (`src/routes/index.tsx`)

- Blocco **Demo giocabile** con pulsanti Francesco / Lorenzo quando appropriato.
- Skip `refreshSession` se sessione demo già attiva.

### Banner (`src/components/game/DemoModeBanner.tsx`)

- Banner fisso con link rapidi: Scanner, Market, Villaggio, Missioni, Chat.
- Uscita demo: clear session + redirect login.

### Root (`src/routes/__root.tsx`)

- Monta `DemoModeBanner` nell'app shell.
- `ensureDemoSeed()` al mount se demo o Supabase non configurato.
- Auth listener **non** cancella sessione se `isDemoModeActive()`.

### Mercato demo

- Acquisti ingredienti/ricette con monete **locali** (stato componente) senza chiamate Supabase.

---

## 3. Documentazione demo

- **`docs/DEMO_LORENZO_CHECKLIST.md`** — percorso guidato per Francesco → showcase Lorenzo (base, villaggio, radar, market, scambi, missioni, chat, navicella).

---

## 4. Problemi rimasti

| Area | Nota |
|------|------|
| Monete demo mercato | Solo stato React; reload pagina resetta saldo tab ingredienti/ricette |
| `coins.ts` / `ingredients.ts` | Nessun fallback locale — OK per produzione Supabase, limitato in demo offline |
| Phaser RTS | Route legacy `/villaggio/phaser` non uniformata visivamente |
| Admin grant monete (Papà) | In demo senza Supabase può non persistere |
| Checklist | File markdown in repo, non route in-app (link banner → chat/missioni) |

---

## 5. Prossima fase consigliata — Fase 8

1. **Persistenza demo locale** — monete e unlock ricette in `localStorage` via `localStore`.
2. **Smoke E2E demo** — script Playwright per percorso checklist Lorenzo.
3. **Phaser / villaggio** — allineare loading e HUD Phaser alla art direction (senza toccare gameplay RTS).
4. **PWA offline** — service worker per demo installabile su tablet di Lorenzo.
5. **Dual-session demo** — due tab Francesco+Lorenzo con sync event bus locale per scambi live.

---

## 6. Build

```bash
npm run build
```

**Esito:** OK (exit 0, ~49s) — 2661 moduli, nessun errore TypeScript.

---

## File principali toccati

| File | Modifica |
|------|----------|
| `src/components/game/market/MarketGameCard.tsx` | Nuovo |
| `src/lib/demo-mode.ts` | Nuovo |
| `src/components/game/DemoModeBanner.tsx` | Nuovo |
| `src/routes/mercato.tsx` | UI uniforme + demo |
| `src/components/game/MarketPanel.tsx` | MarketGameCard |
| `src/components/game/FamilyTradePanel.tsx` | UI gioco |
| `src/components/game/ResourceTransformPanel.tsx` | Preview trasformazione |
| `src/routes/index.tsx` | Entry demo |
| `src/routes/__root.tsx` | Banner + seed |
| `src/styles/art-direction.css` | Tab + transform |
| `docs/DEMO_LORENZO_CHECKLIST.md` | Nuovo |
| `docs/FASE_7_REPORT.md` | Questo report |
