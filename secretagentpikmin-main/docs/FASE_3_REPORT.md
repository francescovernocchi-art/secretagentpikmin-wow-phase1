# FASE 3 — Report Missioni Giocabili, XP Pikmin e Progressione

**Data:** 29 maggio 2026  
**Progetto:** Secret Pikmin — Missione Famiglia  
**Base:** Fase 2 completata (Supabase + fallback localStorage)

---

## Obiettivo Fase 3

Trasformare Secret Pikmin da dashboard persistente a gioco con progressione reale: XP Pikmin, missioni aggiornate, trasformazione risorse, spedizioni giocabili, scanner pesato, navicella visiva, villaggio vivo, bestiario reale.

---

## Migration Supabase

**File:** `supabase/migrations/20260529180000_phase3_progression.sql`

### Tabelle modificate

| Tabella | Colonne aggiunte |
|---------|------------------|
| `pikmin_units` | `spec_badge`, `total_xp_earned` |
| `bestiary_entries` | `study_status`, `data_points`, `weakness_unlocked` |

### Tabelle nuove

| Tabella | Scopo |
|---------|-------|
| `pikmin_activity_log` | Log XP e attività per Pikmin |
| `pikmin_expedition_units` | Join spedizione ↔ unità Pikmin (Phase 3) |

---

## Funzioni XP

**File:** `src/lib/game/pikmin-xp.ts`

| Funzione | Descrizione |
|----------|-------------|
| `addPikminXp(pikminId, amount, reason, meta?)` | Core XP + level-up + badge specializzazione |
| `addXpToAvailableSquad(agent, amount, reason, limit?)` | XP squadra disponibile (scan, raccolta…) |
| `addXpToPikminIds(ids, amount, reason)` | XP multiplo (spedizioni) |
| `fetchActivityLog(pikminId?, limit?)` | Log attività |
| `xpToNextLevel(level)` | Curva progressiva: `100 + level*80 + level²*10` |
| `specBadgeForLevel(spec, level)` | Badge a Lv3/5/8 |

### XP per attività (`XP_AMOUNTS`)

| Reason | XP | Trigger |
|--------|-----|---------|
| `scan` | 15 | Scansione area |
| `raccolta` | 12 | Oggetto in inventario |
| `pikmin_selvatico` | 20 | Cattura Pikmin |
| `studio_mostro` | 25 | Bestiario |
| `pezzo_navicella` | 50 | Pezzo navicella |
| `spedizione` | 30+ | Completamento spedizione |
| `vendita` | 10 | Vendita mercato |
| `trasformazione` | 8 | Laboratorio risorse |
| `difesa` | 35 | Spedizione difesa villaggio |

---

## Missioni resa giocabili

Le 4 missioni principali (`MissionProgressPanel`) leggono dati reali e si aggiornano tramite:

| Missione | Meccanica Fase 3 |
|----------|------------------|
| **Navicella** | `collectSpaceshipPart` + scanner pesato + spedizioni `ricerca_navicella` → `SpaceshipAssemblyPanel` |
| **Debito** | `sellInventoryItem` + trasformazione `credits` → `payPlanetDebt` |
| **Cibo/Energia** | `transformInventory(food\|energy)` → `addPlanetResources` |
| **Bestiario** | `recordMonsterEncounter` → stati avvistato/studiato/classificato |

---

## Trasformazione risorse

**File:** `src/lib/game/transformations.ts`  
**UI:** `ResourceTransformPanel` (Home, Mercato, Missioni)

| Azione | Input | Output |
|--------|-------|--------|
| Trasforma in Cibo | ingredienti/frutta | `planet_status.food` +% |
| Trasforma in Energia | cristalli/batterie | `planet_status.energy` +% |
| Trasforma in Materiali | rottami/metallo | item `materiali_raffinati` |
| Vendi per Crediti | reliquie/oggetti rari | debito planetario ↓ |

Classificazione automatica per regex su `item_key` e `category`.

---

## Spedizioni Pikmin (Phase 3 loop)

**File:** `src/lib/game/expeditions-loop.ts`  
**UI:** `ExpeditionLaunchPanel` su `/spedizioni`

Flusso:
1. Scegli bioma + obiettivo + squadra (max 5 Pikmin)
2. Durata e rischio → probabilità successo calcolata (livello + specializzazione)
3. Avvio → Pikmin `in_spedizione`
4. Completamento automatico al timeout → ricompense + XP
5. Salvataggio Supabase (`expeditions` + `pikmin_expedition_units`) o localStorage

### Obiettivi

| Key | Effetto al successo |
|-----|---------------------|
| `raccolta` | Ingredienti in inventario |
| `ricerca_navicella` | Pezzo navicella mancante |
| `studio_mostri` | Entry bestiario |
| `scouting` | Aggiorna bioma agente |
| `ingredienti` | Ingredienti bioma |
| `difesa` | Morale pianeta +5% |

> Il sistema legacy coop (`src/lib/expeditions.ts`) resta intatto e convive con Phase 3.

---

## Scanner bioma-aware migliorato

**File:** `src/lib/game/scanner-weights.ts`

Tabella pesata considera:
- Bioma corrente (modificatori per tipo ritrovamento)
- Specializzazione Pikmin squadra (bonus ricerca → pezzi navicella, ecc.)
- Livello medio squadra (rarità, mostri)
- Pezzi navicella mancanti (boost ultimi pezzi)

`runWeightedAreaScan()` sostituisce la generazione casuale naive in `useScannerBiome`.

---

## Componenti aggiornati / nuovi

| Componente | Ruolo |
|------------|-------|
| `SpaceshipAssemblyPanel` | Navicella a pezzi, %, ultimo pezzo, prossimo indizio |
| `ResourceTransformPanel` | 4 azioni trasformazione |
| `ExpeditionLaunchPanel` | Game loop spedizioni Phase 3 |
| `BestiaryGamePanel` | Bestiario giocabile con stati studio |
| `VillageDiorama` | Pikmin in missione, edifici con ruoli, animazioni CSS |
| `PikminSpecializationPanel` | Badge specializzazione + barra XP |
| `MarketPanel` | + pannello trasformazione |
| `CommandCenterHome` | + navicella + laboratorio |

---

## File lib aggiunti

```
src/lib/game/pikmin-xp.ts
src/lib/game/scanner-weights.ts
src/lib/game/transformations.ts
src/lib/game/bestiary.ts
src/lib/game/expeditions-loop.ts
src/types/phase3-db.ts
```

---

## Parti ancora mock / dual-system

| Area | Stato |
|------|-------|
| Scambio Famiglia (`MOCK_FAMILY_TRADES`) | Mock — P2P in Fase 4 |
| Navicella legacy (`ship_parts` vs `spaceship_parts`) | Due sistemi convivono: Phase 2/3 usa `spaceship_parts`, route `/navicella` legacy intatta |
| Spedizioni coop legacy | Restano su template Supabase originali |
| Nemici Pikipedia (`enemies` table) | Wiki statica separata da `bestiary_entries` giocabile |
| Chat famiglia | Funzionale Fase 2, nessun XP chat |
| Phaser villaggio route | Non modificato |
| Asset manager / radar fotocamera | Non modificati |

---

## Prossima Fase 4 consigliata

1. **Unificare navicella** — bridge `ship_parts` ↔ `spaceship_parts` con sync bidirezionale
2. **Scambi P2P reali** — sostituire `MOCK_FAMILY_TRADES` con transazioni tra agenti
3. **Mansioni Pikmin persistenti** — assegnare Pikmin a edificio (hangar, laboratorio…) con bonus passivi
4. **Notifiche push spedizioni** — integrare `mission_notifications` con Phase 3 loop
5. **Battaglie mostri** — collegare `bestiary_entries` weakness a combattimento `/nemici`
6. **Achievement e premi** — badge famiglia collegati a XP e missioni
7. **Realtime Supabase** — subscription su `pikmin_activity_log` e spedizioni Phase 3

---

## Build

```bash
npm run build
```

Build verificata OK al completamento Fase 3.

---

## Regole rispettate

- ✅ Supabase quando configurato + fallback localStorage sempre
- ✅ Nessuna rimozione Fase 1/2 (radar, scanner, archivi, Phaser, Leaflet, asset manager)
- ✅ Ogni bottone esegue azione reale con persistenza
- ✅ Menu 9 voci invariato
