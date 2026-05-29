# Report Pulizia — Secret Pikmin Missione Famiglia

Data: 2026-05-29  
Base tecnica: `secretagentpikmin-main` (derivato da secretpikmin / Lovable TanStack Start)

## File mantenuti (core gioco)

### Routes attive
| Route | Motivo |
|-------|--------|
| `/` | Login Comandanti |
| `/base` | Home Centro Comando |
| `/villaggio` | Villaggio Phaser fullscreen |
| `/villaggio/edifici`, `/scambi`, `/$agent`, `/editor/$biome` | Gestione villaggio |
| `/mappa` | Mappa geolocalizzata Leaflet |
| `/archivio` | Archivio Pikmin (Supabase) |
| `/missioni` | Missioni famiglia + core missions |
| `/nemici` | Bestiario mostri |
| `/mercato` | Market |
| `/chat` | Chat Segreta |
| `/profilo`, `/agenti` | Profilo famiglia |
| `/radar` | Radar + EnergyScanner |
| `/spedizioni`, `/navicella`, `/inventario`, `/lab`, `/ricette`, `/premi` | Accorpate in menu Altro |
| `/admin`, `/atelier` | Asset manager e editor (admin) |
| `/ricordi` | Timeline foto — mantenuta, non in nav principale |

### Componenti preservati
- `Radar.tsx`, `EnergyScanner.tsx`, `CameraCapture.tsx`, `ArPikminOverlay.tsx`
- `SecretPikminVisionPanel.tsx` (retrocompatibilità biomi legacy)
- Admin: `AssetLibraryEditor`, `CardsEditor`, `PikminEditor`, `MonstersEditor`, `BuildingsEditor`, `MissionsEditor`, `RewardsEditor`, `AudioEditor`, `IconUploader`
- Villaggio: `VillageGameCanvas`, pannelli build/defense/bonus/aesthetic/pikmin
- Mappa: `EnemyLayer`, filtri, radius layers, scouting panel

### Lib e dati
- Supabase client, migrations, `integrations/supabase/types.ts`
- `lib/pikmin.ts`, `lib/ship.ts`, `lib/base.ts`, `lib/expeditions.ts`, `lib/enemies.ts`
- `data/pikminSprites.ts`

## File creati (Fase 1)

| File | Ruolo |
|------|-------|
| `src/types/secretPikmin.ts` | Tipi centrali mondo |
| `src/data/secretPikminWorld.ts` | Dati mock strutturati (espanso) |
| `src/components/game/*.tsx` | 8 pannelli gioco |
| `docs/GAME_DESIGN_DOCUMENT.md` | GDD |
| `docs/ROADMAP_SECRET_PIKMIN.md` | Roadmap |
| `docs/REPORT_PULIZIA_SECRET_PIKMIN.md` | Questo report |

## File rimossi

**Nessuno** in Fase 1 — per vincolo esplicito: non eliminare radar, archivi, scanner, asset manager senza certezza.

## File da rivedere (Fase 2+)

| File / area | Motivazione |
|-------------|-------------|
| `src/routes/[index].tsx` | Redirect ridondante verso `/` |
| `src/routes/ricordi.tsx` | Orfana — collegare da Profilo |
| `src/routes/admin.tsx` vs `atelier.tsx` | Responsabilità sovrapposte |
| `nemici.tsx` inline `ImageUploader` | Duplica `IconUploader` |
| `PikminType` in `pikminSprites.ts` vs `enemies.ts` | 5 vs 9 tipi — unificare |
| `package.json` name `tanstack_start_ts` | Rinominare in `secret-pikmin` |
| Bottoni duplicati radar | `/radar` aveva 2 CTA identiche — parzialmente risolto con `RadarScannerPanel` |
| `SECRET_PIKMIN_WOW_ROADMAP.md` (root) | Consolidare con `docs/ROADMAP_SECRET_PIKMIN.md` |

## Modifiche navigazione

- **Prima:** 5 gruppi espandibili (Gioco, Villaggio, Risorse, Stile, Profilo)
- **Dopo:** 9 voci dirette (Home, Villaggio, Mappa, Pikmin, Missioni, Bestiario, Market, Chat, Profilo) + menu **Altro** per route secondarie e admin

## Verifica build

Eseguire `npm run build` dopo ogni fase di pulizia futura.

## Conclusione

Fase 1: rifondazione identità e fondamenta **senza rimozioni distruttive**. Codice legacy non collegato resta accessibile via menu Altro fino a verifica esplicita in Fase 2.
