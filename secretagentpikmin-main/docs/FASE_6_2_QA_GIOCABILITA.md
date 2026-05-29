# Fase 6.2 — QA Giocabilità Completa

**Progetto:** Secret Pikmin  
**Baseline:** Fase 6.1 completata  
**Data:** 2026-05-29  
**Metodo:** review flussi codice + build + smoke browser (dev `localhost:8080`)  
**Vincoli:** nessuna nuova funzione, design invariato

---

## Riepilogo

| Area | Esito | Note |
|------|-------|------|
| Scanner / Radar | ✅ PASS (codice) | FX centralizzati in `processScanDiscovery` |
| Market | ✅ PASS (codice) | vendita → debito, FX, transazioni local/Supabase |
| Missioni | ✅ PASS (codice) | progressi reali, reload post-update |
| Chat | ⚠️ PASS dopo fix | 4 bug corretti in 6.2 |
| Villaggio | ✅ PASS (codice) | edifici, hangar, HUD, bottom nav |
| Mobile 390px | ✅ PASS (codice) | overflow-x-hidden, tooltip touch |
| Console / build | ✅ PASS | `npm run build` exit 0 |

---

## 1. Flusso scanner (`/radar`)

### Test eseguiti
- [x] Route `/radar` renderizza Radar, scanner area, BiomeMapPanel
- [x] `RadarScannerPanel` → `runAreaScan()` → `processScanDiscovery()` → `emitScanDiscoveryFx()`
- [x] Salvataggio scan in `scan_results` (Supabase) o `localStore`
- [x] Effetti per tipo: inventario (pickup), mostro/Pikmin (energy), navicella (ship-glow)
- [x] `ParticleEffect variant="radar"` decorativo sempre visibile
- [x] `EventFxLayer` globale per burst post-evento
- [x] Audio `radar_scan` + secondari via toggle (`gameAudio`)

### Verifica inventario / bestiario / navicella
| targetType | Effetto gioco |
|------------|---------------|
| default / oggetto | `addInventoryItem` |
| mostro | `recordMonsterEncounter` |
| pikmin_selvatico | `addPikminUnit` |
| pezzo_navicella | `collectSpaceshipPart` |

### Smoke browser
- Pagina `/radar` carica con bottom nav e pulsante "Scansiona Area"
- Sessione scaduta reindirizza a login (comportamento atteso)

---

## 2. Flusso market (`/mercato`)

### Test eseguiti
- [x] `MarketPanel` → `useMarket()` → `sellInventoryItem()`
- [x] Decremento quantità via `removeInventoryQuantity`
- [x] `payPlanetDebt(total)` aggiorna debito planetario
- [x] Transazione in `market_transactions` o `localStore.addTransaction`
- [x] `triggerGameFx("market_sell")` + flash `market-debt-flash` + label `−N cr`
- [x] `reloadProgress()` aggiorna barra debito
- [x] Card `market-card` con rarità SVG

### Fallback offline
- `safeGameQuery` + `localStore` garantiscono vendita anche senza Supabase

---

## 3. Flusso missioni (`/missioni`)

### Test eseguiti
- [x] `MissionProgressPanel` legge `fetchMissionProgress()` (ship, debt, food/energy, bestiary)
- [x] Barre e icone `CoreMissionIconSvg` coerenti con art direction
- [x] Completamento → `triggerGameFx("mission_complete")`
- [x] **`load()` dopo update** (fix 6.2) — UI aggiornata subito
- [x] `SpaceshipAssemblyPanel` allineato a `useSpaceshipParts`
- [x] Reward navicella su approvazione → `triggerGameFx("ship_part")`

---

## 4. Flusso chat (`/chat`)

### Test eseguiti
- [x] Apertura → `chat_open` audio
- [x] Invio → `sendChatMessage` (family_chat_messages + fallback legacy)
- [x] Persistenza localStorage via `localStore.addChat`
- [x] Particelle ambiente + `chat_message` su messaggio altrui

### Problemi trovati e corretti (6.2)

| # | Problema | Fix |
|---|----------|-----|
| 1 | Canale selezionato non applicato al form principale | Stato `channel` condiviso `ChatPage` ↔ `FamilyChatPanel` |
| 2 | Lista messaggi ignorava il canale | Filtro `visible` per `channel` + reload al cambio |
| 3 | `mine` confrontava `session.role` invece di `agentKey` | Uso `agentKeyFromSession` |
| 4 | Realtime solo su tabella `messages` legacy | Subscribe anche `family_chat_messages` + dedupe per `id` |
| 5 | Messaggi duplicati possibili | Helper `appendUnique` |

---

## 5. Flusso villaggio (`/villaggio`)

### Test eseguiti
- [x] Diorama con 5 edifici + hangar separato
- [x] Route edifici: CC→`/base`, accademia→`/archivio`, magazzino→`/inventario`, lab→`/lab`, mercato→`/villaggio/scambi`
- [x] Hangar → modal `SpaceshipAssemblyPanel`
- [x] `hapticBuildingClick` su tap edificio
- [x] `VillageGameHUD` + `VillageContextStrip` + quick tiles
- [x] Bottom nav visibile (route non in hide list)
- [x] Tooltip edifici: hover desktop, nascosti su touch (fix 6.2)

---

## 6. Flusso mobile (390px)

### Test eseguiti (CSS / layout)
- [x] `PageShell`: `overflow-x-hidden`
- [x] `/villaggio`: `overflow-x-hidden`, `pb-24`, `max-w-2xl mx-auto`
- [x] Bottom nav: icone 6+ “Altro”, safe area
- [x] Chat input/quick: `overflow-x-auto no-scrollbar` (scroll orizzontale solo interno ai chip)
- [x] Tooltip diorama disabilitati su `@media (hover: none)` per non bloccare tap

### Da verificare manualmente con device reale
- EnergyScanner camera/GPS (permessi browser)
- Leaflet mappa su touch

---

## 7. Console e build

### Build
```
npm run build → exit 0 (~8s)
```

### Warning (non bloccanti)
- Vite chunk splitting: import dinamico + statico Supabase (pre-esistente)
- npm `devdir` config warning ambiente locale

### Errori runtime
- Nessun import rotto rilevato in build
- Nessun loop infinito identificato nei flussi QA (useEffect con dipendenze stabili)
- React Strict Mode: nessun doppio-mount problematico oltre dedupe chat/FX

---

## 8. Problemi rimasti

| Priorità | Problema | Impatto |
|----------|----------|---------|
| Bassa | Tab ingredienti/ricette `/mercato` ancora layout legacy | Solo estetica |
| Bassa | QA browser completa richiede login Supabase/famiglia | Test manuale post-login |
| Bassa | EnergyScanner richiede hardware camera/motion | Non testabile in headless |
| Bassa | Realtime chat Supabase dipende da RLS/policy remote | Fallback local OK |
| Info | Phaser RTS non incluso in questa QA visiva | By design |

---

## 9. Fase 7 consigliata

1. Uniformare tab ingredienti/ricette e pannelli scambi/trasformazione (stile market-card)
2. Test multiplayer reale Papà ↔ Lorenzo (chat realtime + scambi)
3. QA device fisico iOS/Android (390px, safe area, haptic)
4. Pack audio opzionale + preload
5. Performance pass particelle globali su device entry-level

---

## File modificati in 6.2 (solo bugfix QA)

| File | Modifica |
|------|----------|
| `src/routes/chat.tsx` | Canali, dedupe, realtime, agent key |
| `src/components/game/FamilyChatPanel.tsx` | Channel controllato |
| `src/routes/missioni.tsx` | `load()` post-update missione |
| `src/components/PageShell.tsx` | `overflow-x-hidden` |
| `src/styles/village-diorama.module.css` | Tooltip non bloccanti su touch |

---

## Checklist test manuale post-login

Per completare QA umana con credenziali famiglia:

1. Login → `/radar` → "Scansiona Area" → verificare toast + FX + scan recenti
2. `/mercato` → vendi oggetto → debito ↓, flash verde, transazione in lista
3. `/missioni` → completa missione → FX + stato aggiornato
4. `/chat` → cambia canale → invia → messaggio nel canale corretto
5. `/villaggio` → ogni edificio + hangar → navicella %
6. DevTools 390px → nessuno scroll orizzontale pagina
