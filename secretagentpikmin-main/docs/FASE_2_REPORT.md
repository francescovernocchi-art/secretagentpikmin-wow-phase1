# Fase 2 — Report Persistenza e Game Loop

Data: 2026-05-29

## Tabelle create (migration `20260529120000_phase2_game_loop.sql`)

| Tabella | Ruolo |
|---------|--------|
| `family_members` | Francesco / Lorenzo comandanti |
| `player_profiles` | Profilo giocatore, bioma corrente, monete |
| `pikmin_specializations` | Catalogo specializzazioni |
| `pikmin_units` | Unità Pikmin persistenti |
| `planet_status` | Singleton stato pianeta (debito, cibo, energia, morale) |
| `spaceship_parts` | Pezzi navicella + flag collected |
| `player_inventory` | Inventario vendibile |
| `villages` | Villaggi per agente |
| `village_buildings` | Edifici per villaggio |
| `biome_zones` | 8 biomi con risorse/creature |
| `scan_results` | Log scansioni radar/scanner |
| `market_transactions` | Storico vendite market |
| `family_chat_messages` | Chat con canali |
| `bestiary_entries` | Bestiario da scan mostri |

**Nota:** `expeditions` usa la tabella legacy esistente.

## Seed iniziali

- Francesco (papa) e Lorenzo (lorenzo) in `family_members`
- Stato pianeta: debito 10000, versati 2350
- 6 pezzi navicella (3 raccolti)
- 8 biomi, 7 specializzazioni
- 4 Pikmin units, 2 villaggi con 6 edifici ciascuno
- Inventario iniziale per entrambi i comandanti
- 2 entry bestiario, messaggi chat di benvenuto

## Componenti collegati a Supabase

| Componente | Servizio | Dati |
|------------|----------|------|
| `CommandCenterHome` | `lib/game/home.ts` | planet, navicella, spedizioni, family, scan |
| `MissionProgressPanel` | `lib/game/planet.ts` | progresso 4 missioni |
| `PikminSpecializationPanel` | `lib/game/pikmin-units.ts` | squadra + assegnazione spec |
| `VillageDiorama` | `lib/game/villages.ts` | villaggio, edifici, livello CC |
| `RadarScannerPanel` | `lib/game/scanner.ts` | bioma, scan, ritrovamenti |
| `BiomeMapPanel` | `lib/game/scanner.ts` | bioma corrente da profile |
| `MarketPanel` | `lib/game/market.ts` | inventario, vendita, debito |
| `FamilyChatPanel` | `lib/game/chat.ts` | messaggi per canale |
| `/radar` route | `processEnergyScannerCatch` | scanner fotocamera → game loop |

## Fallback locali

- **`src/lib/game/local-store.ts`** — localStorage `secretPikmin.phase2.*`
- **`src/lib/game/db.ts`** — `isSupabaseConfigured()` + `safeGameQuery` / `withFallback`
- Se Supabase non risponde o env mancante: nessun crash, dati da localStorage con seed da `secretPikminWorld.ts`
- Chat: fallback scrive anche su tabella legacy `messages` quando possibile

## Funzioni completate (Fase 2)

- [x] Schema + seed migration
- [x] Home dinamica da DB
- [x] Pikmin da DB con select specializzazione
- [x] Scanner bioma-aware + salvataggio scan_results
- [x] Side effects scan: inventario / bestiario / pikmin_units / spaceship_parts
- [x] Missioni con progresso reale
- [x] Villaggio + edifici + regole Centro Controllo (Lv 1/3/5)
- [x] Market vendita → debito planetario + transactions
- [x] Chat canali + invio persistente
- [x] Hooks `src/hooks/useGameData.ts`

## Funzioni ancora mock / parziali

| Area | Stato |
|------|--------|
| Scambio Famiglia P2P | UI mock in MarketPanel; logica in `/villaggio/scambi` |
| XP Pikmin / level up | Visualizzato, non incrementa ancora da missioni |
| Food/energy/morale planet | Lettura DB; trasformazione ingredienti in Fase 3 |
| Geolocalizzazione bioma | Da `player_profiles.current_biome`; GPS auto in Fase 3 |
| Realtime chat | Parziale (legacy + nuova tabella) |
| Sync `spaceship_parts` ↔ `ship_parts` legacy | Tabelle separate; navicella route usa legacy |

## Prossima fase consigliata (Fase 3)

1. Incremento XP Pikmin da missioni/spedizioni completate
2. Trasformazione cibo/energia da inventario → `planet_status`
3. Bioma da GPS reale sulla mappa
4. Scambio famiglia persistente in DB
5. Unificare navicella Phase2 con route `/navicella` legacy
6. Regenerare `integrations/supabase/types.ts` dopo migration

## Build

Eseguire `npm run build` dopo `supabase db push` o applicare migration manualmente.
