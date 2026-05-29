# FASE 5 — Diorama WOW e UI da Gioco

**Data:** 29 maggio 2026  
**Build:** `npm run build` ✅ exit 0

---

## Obiettivo

Trasformare Secret Pikmin da app funzionale a gioco visivo con diorama isometrico 2.5D, HUD da gioco e unificazione del villaggio — senza rompere le fasi 1–4.

---

## Cosa è stato ridisegnato

### Villaggio (diorama principale)
- **`VillageDiorama`** riscritto come diorama isometrico 2.5D con:
  - Terreno a palette per bioma (cielo, suolo, sentieri, acqua, rocce, decorazioni)
  - Edifici CSS/SVG cliccabili con ombre, tooltip, livello e animazioni
  - Pikmin animati con badge specializzazione e ruolo operativo
  - Navicella SVG nell'hangar con pezzi accesi/spenti e barra progresso
  - Modal hangar → `SpaceshipAssemblyPanel`

### HUD da gioco
- **`VillageGameHUD`**: debito, cibo, energia, morale, missioni, Pikmin, bioma, notifiche
- **`VillageContextStrip`**: bioma GPS, raggio d'azione, controllo remoto, spedizioni attive, risorse bioma

### Home (plancia di comando)
- **`CommandCenterHome`** ridisegnato:
  - Header stile plancia con HUD integrato
  - Anteprima diorama compatta + link “Entra nel Villaggio”
  - Pannelli pianeta/navicella affiancati con gauge animate
  - Quick-link game-style, famiglia online, radar

### Menu navigazione
- **`BottomNav`**: icone più grandi, badge notifiche/missioni, indicatore famiglia online nel drawer “Altro”, transizioni spring

### Route villaggio
- **`/villaggio`** → vista diorama full-page (nuova default)
- **`/villaggio/phaser`** → modalità Phaser RTS legacy (costruzione avanzata)
- **`/villaggio/scambi`** → `FamilyTradePanel` Phase 4 (sostituisce Ambasciata legacy)

---

## Cosa è stato unificato

| Prima | Dopo |
|-------|------|
| `/villaggio` = Phaser fullscreen | `/villaggio` = Diorama WOW |
| `/villaggio/scambi` = `lib/trade.ts` Ambasciata | `FamilyTradePanel` + `family-trades.ts` |
| VillageDiorama emoji piatto | Sistema diorama modulare (`diorama/*`) |
| Home = pannelli admin | Home = plancia comando + diorama |

**Phaser** mantenuto in `/villaggio/phaser` via `VillaggioPhaserView` — nessuna perdita di costruzione RTS, minacce, regali, pannelli.

---

## Componenti creati

| File | Ruolo |
|------|-------|
| `src/components/game/diorama/diorama-data.ts` | Posizioni edifici, temi bioma, mapping Pikmin |
| `src/components/game/diorama/DioramaTerrain.tsx` | Terreno isometrico, sentieri, acqua, decor |
| `src/components/game/diorama/DioramaBuilding.tsx` | Edificio cliccabile 2.5D |
| `src/components/game/diorama/DioramaPikminActor.tsx` | Pikmin animato con badge/ruolo |
| `src/components/game/diorama/DioramaShipHangar.tsx` | Navicella SVG + pezzi |
| `src/components/game/diorama/VillageGameHUD.tsx` | HUD fisso da gioco |
| `src/components/game/diorama/VillageContextStrip.tsx` | Bioma, raggio, remoto, spedizioni |
| `src/styles/village-diorama.module.css` | Stili diorama/HUD (~400 righe) |
| `src/components/village/VillaggioPhaserView.tsx` | Pagina Phaser RTS legacy |
| `src/routes/villaggio.phaser.tsx` | Route Phaser |

---

## Componenti legacy ancora presenti (volutamente)

| Componente | Motivo |
|------------|--------|
| `lib/base.ts` + `VillageGameCanvas` | Costruzione RTS Phaser, slot, minacce |
| `lib/trade.ts` | Codice Ambasciata legacy (non più usato da `/villaggio/scambi`) |
| `VillageBottomMenu` + pannelli Phaser | Solo in `/villaggio/phaser` |
| `ship_parts` admin su `/navicella` | Coesiste con `SpaceshipAssemblyPanel` |
| Leaflet `BiomeMapPanel`, radar, scanner | Fasi 2–4 intatte |
| Asset manager / archivi / admin | Non toccati |

---

## Edifici nel diorama

Tutti cliccabili con tooltip e route:

- Centro di Controllo → `/base`
- Magazzino → `/inventario`
- Accademia Pikmin → `/archivio`
- Laboratorio → `/mercato`
- Mercato → `/villaggio/scambi`
- Hangar Navicella → modal `SpaceshipAssemblyPanel`

---

## Pikmin nel villaggio

- Sprite `AnimatedPikmin` con animazione per stato (`walk`, `run`, `work`, `idle`, `sleep`)
- Badge specializzazione e etichetta ruolo (Raccolta, Spedizione, Allenamento, ecc.)
- Pattuglia su punti `%` del piano isometrico

---

## Responsive

- Diorama: `aspect-ratio` + `min-height` adattivi, modal ship full-screen mobile
- HUD: griglia 3 col mobile → 6 col desktop
- BottomNav: scroll orizzontale, touch-friendly
- CommandCenterHome: grid 1→2 colonne su `sm:`

---

## Cosa manca per Fase 6

1. **Asset artistici reali** — edifici/navicella/Pikmin usano CSS/SVG placeholder (qualità alta ma non sprite finali)
2. **Unificazione navicella admin** — `/navicella` legacy + `SpaceshipAssemblyPanel` ancora duali
3. **Rimozione `lib/trade.ts`** — deprecare dopo migrazione dati Ambasciata → `family_trades`
4. **Phaser ↔ Diorama sync** — edifici Phaser (`base_buildings`) vs edifici game loop (`village_buildings`) non sincronizzati visivamente
5. **Animazioni particellari** — polvere, luci hangar al ritrovamento pezzo, effetti bioma
6. **Suoni UI diorama** — click edificio, ambiente bioma
7. **Test E2E** — flussi villaggio/scambi/spedizioni su mobile reale

---

## Verifica build

```bash
npm run build
# ✓ 2650 modules transformed
# ✓ villaggio-DWR-pmB_.js (diorama ~6.5 kB server)
# ✓ villaggio.phaser-CdV01Sra.js (Phaser ~161 kB server)
# ✓ VillageDiorama-BUxrA1H-.js (~29 kB server)
```

---

## Vincoli rispettati

- ✅ Supabase + fallback locale
- ✅ XP, spedizioni Phase 3, GPS/biomi Phase 4
- ✅ Scambi famiglia (`FamilyTradePanel`)
- ✅ Radar, scanner, archivi, asset manager
- ✅ Phaser e Leaflet preservati
- ✅ Nessuna cancellazione funzionalità Fase 1–4
