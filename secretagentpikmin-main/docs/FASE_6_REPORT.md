# Fase 6 — Art Direction, Asset finali, Suoni e Particelle

**Progetto:** Secret Pikmin  
**Baseline:** Fase 5.1 completata, build OK  
**Data:** 2026-05-29  
**Vincoli rispettati:** nessuna nuova macro-funzione; gameplay, Supabase, fallback, missioni, XP, villaggi, scambi, radar, scanner, archivi e asset manager invariati nella logica.

---

## 1. Art direction — palette ufficiale

Definita in `src/data/artDirection.ts` (`ART_PALETTE`) e applicata via CSS variables in `src/styles/art-direction.css`:

| Ruolo | Colori | Uso |
|--------|--------|-----|
| **Natura** | verde/muschio `#4ade80`, `#3d7a4a` | Home, Villaggio |
| **Energia aliena** | blu/viola `#6366f1`, `#a78bfa` | Mappa, Chat, Radar |
| **Missioni** | giallo/oro `#fbbf24`, `#f59e0b` | Missioni, Mercato |
| **Pericolo** | rosso/arancio `#ef4444`, `#fb923c` | Bestiario |
| **Navicella** | grigio/metallo + glow ciano `#94a3b8`, `#38bdf8` | Hangar, pannelli nave |

### Schermate tematizzate

- **Home** (`/base`) — `PageShell theme="home"` + pannelli `bridge-panel` in `CommandCenterHome`
- **Villaggio** (`/villaggio`) — `section-theme-village` sul wrapper route
- **Missioni** — `theme="mission"`
- **Mappa** — `theme="map"` (+ radar con stesso tema)
- **Market** — `theme="market"`
- **Chat** — `theme="chat"`
- **Bestiario** (`/nemici`) — `theme="bestiary"` + card `creature-card`

---

## 2. Asset placeholder migliorati (CSS/SVG)

File centralizzato: `src/components/game/assets/GameIcons.tsx`

| Asset | Componente | Dove |
|--------|------------|------|
| Edifici diorama | `BuildingIconSvg` | `DioramaBuilding.tsx` |
| Navicella preview | `ShipPreviewSvg` | `CommandCenterHome`, `SpaceshipAssemblyPanel`, hangar |
| Risorse | `ResourceIconSvg` | disponibile per pannelli inventario/mercato |
| Missioni | `MissionIconSvg` | disponibile per liste missione |
| Biomi | `BiomeIconSvg` | mappa/scanner (import pronto) |
| Pikmin | `PikminIconSvg` | archivio/UI |
| Mostri | `CreaturePortraitSvg` | `BestiaryGamePanel` |

Nessuna immagine esterna rotte: tutto inline SVG, niente quadrati generici.

---

## 3. Particelle ed effetti (CSS leggeri)

Componente: `src/components/fx/ParticleEffect.tsx`  
Stili: `src/styles/art-direction.css` (keyframes `fx-*`, `prefers-reduced-motion` riduce animazioni)

| Variante | Effetto | Integrato in |
|----------|---------|----------------|
| `energy` | scintille viola/verde | Home bridge, Bestiario, terreno diorama |
| `dust` | polvere sentieri | Home, `DioramaTerrain` |
| `ship-glow` | bagliore navicella | Home, hangar diorama, `SpaceshipAssemblyPanel` |
| `pickup` | burst raccolta | **CSS pronto**, hook gameplay da collegare |
| `mission` | completamento missione | **CSS pronto**, da collegare a toast/haptic missione |
| `chat` | nuovo messaggio / ambiente chat | `chat.tsx` pannello messaggi |
| `radar` | anelli scansione | `radar.tsx` |

Polvere Pikmin in corsa/trasporto: `pikmin-dust` in `pikminAnimations.css` + `showDust` in `DioramaPikminActor`.

---

## 4. Sistema audio opzionale

- **Modulo:** `src/lib/game-audio.ts` — wrapper su `sfx.ts` (Web Audio sintetico, nessun file MP3 richiesto)
- **Persistenza:** `localStorage` chiave `sap_audio_enabled` (default ON)
- **Toggle UI:** `AudioToggle` fisso in `__root.tsx` (angolo alto-destra)
- **Suoni mappati:**

| Evento | ID | Trigger |
|--------|-----|---------|
| Click UI | `ui_click` | `haptic.ts` tap |
| Scan radar | `radar_scan` | `haptic.ts` scan |
| Ritrovamento raro | `rare_find` | salvataggio radar |
| Missione completata | `mission_complete` | `haptic.ts` success |
| Apertura chat | `chat_open` | mount `chat.tsx` |
| Costruzione navicella | `ship_build` | mount `SpaceshipAssemblyPanel` |

Se audio OFF: `playGameSound` esce subito (fallback silenzioso). In futuro si possono aggiungere file in `public/audio/` senza cambiare API.

---

## 5. Animazioni Pikmin

- **Diorama:** `statusToAnimation()` in `diorama-data.ts` — walk / run / carry / work / idle / sleep per stato e specializzazione
- **CSS:** `pikminAnimations.css` — bob camminata, corsa accentuata, trasporto pesante, lavoro/allenamento, sonno, festa, polvere, bolle
- **Nuovo:** `.pikmin-anim-study` (glow viola per ricerca/combattimento), `.pikmin-anim-expedition-return` (ritorno spedizione, classe pronta)
- **Sprites:** `AnimatedPikmin` invariato nella logica asset manager

Animazioni solo `transform`/`filter` — leggere per mobile.

---

## 6. Home più WOW

`CommandCenterHome.tsx`:

- Layout plancia con `bridge-panel`, angoli HUD, particelle energia/polvere/nave
- `ShipPreviewSvg` + stato pianeta con barra `progress-planet-fill` e copy emotivo (debito / esplorazione)
- Missioni con `progress-mission` / barre dorate
- Famiglia online in evidenza (`family-online-highlight`)
- Radar preview con link a `/radar`

---

## 7. Bestiario più WOW

`BestiaryGamePanel.tsx` + route `/nemici`:

- Card `creature-card` con ritratto SVG (`CreaturePortraitSvg`)
- Badge rarità (`rarityColor` da art direction)
- Bioma e stato classificazione (barra progress)
- Debolezza nascosta fino a sblocco classificazione
- Particelle energia di sfondo

---

## 8. Problemi / gap rimasti

1. **Particelle `pickup` e `mission`** — stili e componente ok, non ancora agganciati ai flussi di raccolta risorse / completamento missione in-game (solo audio via haptic su success).
2. **Mercato / Missioni interni** — tema header applicato; card interne ancora mix di classi legacy (`panel-strong`) senza icone SVG ovunque.
3. **Audio file reali** — solo sintesi WebAudio; nessun asset `.ogg`/`.mp3` in repo.
4. **`ship_build` / `chat_open` al mount** — suono una volta all’apertura pannello/pagina; potrebbe essere spostato su azione utente se troppo frequente.
5. **Phaser RTS** (`/villaggio/phaser`) — non ritoccato in Fase 6 (by design).
6. **Animazione `expedition-return`** — classe CSS definita; mapping stato `ritorno_spedizione` da aggiungere se compare in dati live.

---

## 9. Prossima fase consigliata (Fase 7)

1. Collegare particelle `pickup` / `mission` a eventi reali (scanner, completamento missione, scambi).
2. Uniformare card Mercato/Missioni con `ResourceIconSvg` / `MissionIconSvg`.
3. Opzionale: pack audio leggero in `public/audio/` + preload in `game-audio.ts`.
4. Performance pass su mobile (ridurre `density="medium"` dove non serve).
5. QA multiplayer Supabase + test regressione Phaser/Leaflet dopo polish visivo.

---

## 10. Build

```bash
npm run build
```

(Eseguito a fine Fase 6 — verificare output locale.)

---

## File principali creati/modificati

| File | Ruolo |
|------|--------|
| `src/data/artDirection.ts` | Palette e temi sezione |
| `src/styles/art-direction.css` | Temi, FX, card, progress bar |
| `src/components/game/assets/GameIcons.tsx` | SVG curati |
| `src/components/fx/ParticleEffect.tsx` | Particelle |
| `src/lib/game-audio.ts` | Audio opzionale |
| `src/components/game/AudioToggle.tsx` | Toggle ON/OFF |
| `CommandCenterHome.tsx`, `BestiaryGamePanel.tsx` | WOW home/bestiario |
| `diorama/*`, `village-diorama.module.css` | Asset edifici + FX terreno |
