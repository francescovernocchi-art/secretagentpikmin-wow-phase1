# Roadmap — Secret Pikmin Missione Famiglia

## Fase 1 ✅ (fondamenta — implementata)
- [x] Identità gioco e dati centrali (`secretPikminWorld.ts`, `secretPikmin.ts`)
- [x] Menu definitivo a 9 sezioni + collegamenti nascosti
- [x] Home Centro Comando
- [x] Missioni principali con progresso visivo
- [x] Sistema Pikmin con specializzazioni e tipi
- [x] 8 biomi geolocalizzati
- [x] Collegamento radar/scanner/mappa
- [x] Villaggio diorama (loading + edifici) senza rompere Phaser
- [x] Market e Chat impostati
- [x] Report pulizia

## Fase 2 — Gameplay vivo
- [ ] Persistenza Supabase per `pikmin_units`, `planet_state`, `family_trades`
- [ ] Scanner → ritrovamento bioma-aware con salvataggio inventario/bestiario
- [ ] Navicella 3D/isometrica animata sincronizzata con `ship_parts_collected`
- [ ] Spedizioni collegate a bioma e specializzazione Pikmin
- [ ] Regole villaggi multipli (Centro Controllo Lv 1/3/5)
- [ ] Comando remoto con edificio dedicato

## Fase 3 — WOW visivo
- [ ] Villaggio Phaser con tile bioma e Pikmin pathfinding migliorato
- [ ] Transizioni cinematiche tra Home ↔ Villaggio ↔ Mappa
- [ ] Effetti particellari radar e scanner AR
- [ ] Audio dinamico per bioma

## Fase 4 — Famiglia espansa
- [ ] Onboarding nuovi Comandanti
- [ ] Chat canali separati in DB
- [ ] Storico scambi e donazioni
- [ ] Eventi famiglia settimanali

## Pulizia futura (solo dopo verifica)
- Unificare `/admin` e `/atelier`
- Estrarre `ImageUploader` da `nemici.tsx`
- Collegare `/ricordi` nel menu Profilo
- Allineare `PikminType` tra sprite (5) e enemies (9)
