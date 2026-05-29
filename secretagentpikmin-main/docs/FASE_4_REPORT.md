# FASE 4 — Report Cooperazione Famiglia, Villaggi Multipli e Mappa Reale

**Data:** 29 maggio 2026  
**Progetto:** Secret Pikmin — Missione Famiglia  
**Base:** Fase 3 completata (XP, spedizioni, scanner pesato, missioni giocabili)

---

## Obiettivo Fase 4

Rendere Secret Pikmin un gioco collaborativo tra Francesco (`papa`), Lorenzo (`lorenzo`) e futuri membri famiglia: scambi P2P reali, navicella unificata, villaggi multipli, controllo remoto GPS, bioma da geolocalizzazione, notifiche di gioco.

---

## Migration Supabase

**File:** `supabase/migrations/20260529200000_phase4_coop.sql`

### Tabelle nuove

| Tabella | Scopo |
|---------|-------|
| `family_trade_offers` | Proposte scambio P2P (stati: draft/pending/accepted/rejected/cancelled/completed) |
| `family_trade_items` | Oggetti offerti/richiesti per ogni proposta |
| `family_trade_history` | Storico azioni scambio |
| `game_notifications` | Notifiche gioco leggere (parallelo a `mission_notifications`) |

### Colonne aggiunte

| Tabella | Colonne |
|---------|---------|
| `villages` | `action_radius_m` (default 150m) |
| `player_profiles` | `active_village_id` (villaggio attivo) |

### Sync navicella

Migration SQL sincronizza `ship_parts_collected` → `spaceship_parts` senza perdita dati.

---

## 1. Scambi Famiglia Reali

**File:** `src/lib/game/family-trades.ts`  
**UI:** `FamilyTradePanel` (Mercato, sostituisce `MOCK_FAMILY_TRADES`)

| Funzione | Descrizione |
|----------|-------------|
| `createFamilyTradeOffer` | Invia oggetti + richiesta opzionale, valida inventario mittente |
| `acceptFamilyTrade` | Trasferisce inventario, log transazioni, chat automatica |
| `rejectFamilyTrade` | Rifiuto/annullamento |
| `fetchFamilyTrades` | Incoming, outgoing, storico |

**Regole implementate:**
- Quantità ≤ inventario mittente (validazione pre-invio e pre-accettazione)
- Accettazione: scala mittente → aggiunge destinatario (e viceversa per richieste)
- `market_transactions` con tipo `family_trade_in` / `family_trade_out`
- Messaggio automatico in chat canale `famiglia`
- Notifica `trade_received` / `trade_accepted` / `trade_rejected`
- Fallback `localStore` (`familyTrades`, `tradeItems`, `tradeHistory`)

---

## 2. Unificazione Navicella

**Fonte primaria:** `spaceship_parts` (Phase 2/3)  
**Adapter:** `src/lib/game/ship-bridge.ts`

| Legacy | Unified |
|--------|---------|
| `ship_parts` (catalogo 12 pezzi) | `spaceship_parts` (6 pezzi gameplay) |
| `ship_parts_collected` | flag `collected` su `spaceship_parts` |
| `collectShipPart()` in `lib/ship.ts` | delega a `collectShipPartUnified()` |

### Mapping legacy → spaceship (documentato)

| Legacy key | spaceship_parts key |
|------------|---------------------|
| motore | motore |
| antenna | antenna |
| cabina | cabina |
| reattore, chiave, scudo | nucleo |
| serbatoio, luci | modulo_energia |
| giroscopio, carrello, scafo | stabilizzatori |
| radar | antenna |

**Route `/navicella`:** mantiene UI legacy admin + `SpaceshipAssemblyPanel` + sync all'avvio via `syncLegacyCollectedToSpaceship()`.

Nessun dato legacy eliminato — doppia scrittura su accettazione drop/missioni.

---

## 3. Villaggi Multipli

**File:** `src/lib/game/villages.ts` (esteso)

| CC Level | Max villaggi |
|----------|--------------|
| 1 | 1 |
| 3 | 2 |
| 5 | 3 |

| Funzione | Descrizione |
|----------|-------------|
| `fetchAgentVillages` | Lista villaggi utente |
| `fetchActiveVillage` / `setActiveVillage` | Villaggio attivo |
| `createVillage` | Nome, bioma, GPS, edifici seed |
| `upgradeVillageBuilding` | Potenzia edificio singolo villaggio |
| `canRemoteControlVillage` | Verifica raggio GPS o CC remoto |

**UI:** `VillageNetworkPanel` (Home, creazione da mappa/GPS)

---

## 4. Controllo Remoto

**File:** `canRemoteControlVillage()` in `villages.ts`

| Condizione | Effetto |
|------------|---------|
| Utente nel raggio GPS villaggio | Tutte le azioni consentite |
| CC Lv1+ fuori raggio | Comandi base |
| CC Lv3+ fuori raggio | + Spedizioni remote |
| CC Lv5 fuori raggio | + Market/trasformazioni remote |

**UI:** `RemoteControlPanel` (Home)

---

## 5. Mappa GPS e Biomi Reali

**File:** `src/lib/game/player-location.ts`

| Funzione | Descrizione |
|----------|-------------|
| `requestBrowserGeolocation` | API browser |
| `syncGeolocationToProfile` | Salva lat/lng + bioma su `player_profiles` |
| `detectBiomeFromCoords` | Bioma deterministico da coordinate |
| `setManualBiome` | Fallback manuale se GPS negato |
| `fetchCurrentBiome` (scanner) | Legge profilo GPS/bioma |

**UI:** `CurrentBiomeStatusPanel` integrato in `BiomeMapPanel` e `/mappa`

Il bioma influenza: scanner pesato, spedizioni, risorse/mostri/Pikmin (via `BIOMES` data).

---

## 6. UI Cooperativa

| Componente | Dove |
|------------|------|
| `FamilyTradePanel` | `/mercato` (MarketPanel) |
| `VillageNetworkPanel` | `/base` (Home) |
| `RemoteControlPanel` | `/base` |
| `CurrentBiomeStatusPanel` | BiomeMapPanel, `/mappa` |
| `GameNotificationsPanel` | `/base` + badge unread |

---

## 7. Notifiche di Gioco

**File:** `src/lib/game/notifications.ts`  
**Hook:** `useGameNotifications`

| Kind | Trigger |
|------|---------|
| `trade_received` | Nuovo scambio |
| `trade_accepted` | Scambio completato |
| `trade_rejected` | Scambio rifiutato |
| `expedition_completed` | Phase 3 spedizione |
| `ship_part_found` | Pezzo navicella (bridge) |
| `debt_reduced` | Vendita mercato |
| `monster_classified` | Bestiario classificato |
| `village_created` | Nuovo villaggio |

Dual-write su `game_notifications` + `mission_notifications` per compatibilità spedizioni legacy.

---

## File aggiunti/modificati

```
src/types/phase4-db.ts
src/lib/game/family-trades.ts
src/lib/game/ship-bridge.ts
src/lib/game/notifications.ts
src/lib/game/player-location.ts
src/lib/game/villages.ts (esteso)
src/lib/ship.ts (adapter)
src/lib/game/local-store.ts (trades, villages, notifications, GPS)
src/lib/game/scanner.ts (bioma da profilo)
src/lib/game/market.ts, bestiary.ts, expeditions-loop.ts (+ notifiche)
src/components/game/FamilyTradePanel.tsx
src/components/game/VillageNetworkPanel.tsx
src/components/game/RemoteControlPanel.tsx
src/components/game/CurrentBiomeStatusPanel.tsx
src/components/game/GameNotificationsPanel.tsx
src/components/game/BiomeMapPanel.tsx, MarketPanel.tsx, CommandCenterHome.tsx
src/hooks/useGameData.ts (+ useGameNotifications, usePlayerBiome)
supabase/migrations/20260529200000_phase4_coop.sql
```

---

## Parti ancora mock / dual-system residui

| Area | Stato |
|------|-------|
| Villaggio Phaser (`lib/base.ts`) | Convive con `villages` Phase 2 — non unificato |
| Legacy `trade_offers` + Ambasciata | Route `/villaggio/scambi` intatta |
| Catalogo `ship_parts` 12 pezzi | Admin `/navicella` — display legacy |
| Bioma GPS | Formula deterministica, non mappe reali OpenStreetMap |
| Membri famiglia oltre papa/lorenzo | Schema pronto (`family_members`), UI 2 agenti |

---

## Prossima Fase 5 consigliata

1. Unificare `base` Phaser ↔ `villages` Phase 2/4
2. Mappe bioma reali (tile server o zone disegnate su Leaflet)
3. Onboarding membri famiglia aggiuntivi
4. Realtime Supabase su scambi e notifiche
5. Mansioni Pikmin persistenti per edificio
6. Battaglie coop famiglia vs mostri

---

## Build

```bash
npm run build
```

---

## Regole rispettate

- ✅ Nessuna UI finta — ogni bottone persiste dati
- ✅ Fasi 1–3 intatte (XP, spedizioni, scanner, missioni)
- ✅ Supabase + fallback localStorage
- ✅ Radar, Phaser, Leaflet, archivi, asset manager non rimossi
