# Fase 6.1 — Polish eventi visivi e UI coerente

**Progetto:** Secret Pikmin  
**Baseline:** Fase 6 completata  
**Data:** 2026-05-29  
**Vincoli:** nessuna macro-funzione; logiche gioco, Supabase, fallback, XP, villaggi, scambi, radar, scanner, archivi e asset manager invariati.

---

## 1. Particelle collegate agli eventi reali

Sistema centralizzato: `src/lib/game-event-fx.ts` + overlay globale `EventFxLayer` in `__root.tsx`.

| Evento | Particella | Trigger |
|--------|------------|---------|
| Pickup risorsa | `pickup` | Raccolta drop mappa (`mappa.tsx`), scan inventario (`processScanDiscovery`) |
| Ritrovamento raro | `energy` | Scan mostro/Pikmin selvatico (`emitScanDiscoveryFx`) |
| Pezzo navicella | `ship-glow` | Drop mappa ship, approvazione missione con reward, admin navicella |
| Missione completata | `mission` | Status `completata` / `approvata` (`missioni.tsx`) |
| Vendita market | `pickup` | Vendita inventario OK (`MarketPanel`) |
| Messaggio chat | `chat` | INSERT realtime messaggio altrui (`chat.tsx`) |
| Scanner completato | `radar` | Fine `processScanDiscovery` (radar, scanner area, EnergyScanner) |

Dedupe 280 ms per evitare doppie burst ravvicinate.

---

## 2. Audio collegato (toggle rispettato)

Esteso `game-audio.ts` con `building_click`, `market_sell`, `ship_update` (sostituisce `ship_build` al mount).

| Evento | Suono | Trigger |
|--------|-------|---------|
| Click edificio | `building_click` | `DioramaBuilding` → `hapticBuildingClick()` |
| Scan radar | `radar_scan` | `emitScanDiscoveryFx` → `scanner_complete` |
| Ritrovamento raro | `rare_find` | Scan mostro/Pikmin (particella secondaria, suono unico) |
| Vendita oggetto | `market_sell` | Vendita market OK |
| Completamento missione | `mission_complete` | Update missione completata/approvata |
| Apertura chat | `chat_open` | Mount pagina chat |
| Navicella aggiornata | `ship_update` | Salvataggio pezzo admin + raccolta pezzo |

Tutti passano da `gameAudio.play()` → rispettano `sap_audio_enabled`.

---

## 3. Mercato — card uniformate

`MarketPanel.tsx`:

- Card `market-card` con bordo rarità (`itemRarityFromPrice`)
- Icona SVG `ResourceIconSvg` + emoji overlay
- Valore in crediti, categoria, quantità
- Effetto vendita: `triggerGameFx("market_sell")` + flash `market-debt-flash` + label `−N cr al debito`
- Barra progresso debito planetario

Tab ingredienti/ricette in `mercato.tsx` restano layout legacy (solo header tematizzato).

---

## 4. Missioni — card uniformate

`MissionProgressPanel.tsx`:

- `CoreMissionIconSvg` per navicella / debito / pianeta / bestiario
- Barre `progress-mission` con fill per tipo (ship, planet, mission)
- Badge stato: Iniziata / In corso / Avanzata / Completata
- Glow `mission-card-complete` al 100%

`missioni.tsx` (missioni famiglia):

- Card `mission-card` + `MissionIconSvg`
- FX + audio su completamento/approvazione
- `ship_part` FX su reward navicella

---

## 5. Parti ancora legacy

- Tab **Ingredienti/Ricette** in `/mercato` (emoji + panel base)
- **FamilyTradePanel** / **ResourceTransformPanel** (stile panel-strong)
- **Phaser RTS** e editor admin (non toccati)
- **EnergyScanner** flash: solo vibrazione, audio delegato a `processScanDiscovery`
- Nessun file audio `.mp3` — solo WebAudio sintetico
- Pickup audio dedicato non richiesto (solo particella)

---

## 6. Prossima fase consigliata (Fase 7)

1. Uniformare tab ingredienti/ricette e pannelli scambi/trasformazione
2. Micro-FX su expedition return e bestiario classify
3. Pack audio opzionale in `public/audio/`
4. QA mobile performance particelle globali

---

## 7. Build

```bash
npm run build
```

---

## File principali

| File | Ruolo |
|------|--------|
| `src/lib/game-event-fx.ts` | Bus eventi FX |
| `src/components/fx/EventFxLayer.tsx` | Overlay particelle globali |
| `src/lib/game-audio.ts` | Suoni estesi |
| `src/lib/haptic.ts` | `hapticBuildingClick` |
| `src/lib/game/scanner.ts` | `emitScanDiscoveryFx` post-scan |
| `MarketPanel.tsx`, `MissionProgressPanel.tsx` | UI coerente |
| `src/styles/art-direction.css` | `.market-card`, `.mission-card`, debt flash |
