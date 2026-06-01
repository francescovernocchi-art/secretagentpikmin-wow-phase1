# Fase V1.8 — Navicella cinematografica e hangar eroe

**Progetto:** Secret Pikmin  
**Baseline:** V1.7B approvata  
**Data:** 2026-05-29  
**Scope:** solo presentazione villaggio — nessuna modifica a gameplay, DB, Supabase, missioni, market, chat, radar, scanner, XP, inventario.

---

## Obiettivo

Rendere la navicella l’elemento visivo dominante del diorama `/villaggio`, con hangar fisico credibile e stati di riparazione leggibili a colpo d’occhio su mobile.

---

## Modifiche implementate

### 1. Presenza scenica (posizione e scala)

| Elemento | Prima | Dopo |
|----------|-------|------|
| Posizione hangar | x:72%, y:52% (basso-destra) | **x:50%, y:18%** (centro-alto) |
| z-index | 35 | **85** (sopra edifici e Pikmin) |
| SVG navicella | 64×48 px | **clamp(110–160px)** larghezza |
| Scene aspect | 16/11 | **390/420** mobile-first |

File: `diorama-data.ts`, `village-diorama.module.css`, `VillageDiorama.tsx`

### 2. Hangar fisico

Struttura semicoperta aggiunta in `DioramaShipHangar.tsx` + CSS:

- Tetto con travi e lamiera (`hangarRoof`, `hangarTruss`)
- Impalcature sinistra/destra (`hangarScaffoldL/R`)
- Gru con braccio oscillante e cavo (`hangarCrane`)
- Piattaforma atterraggio con anelli (`hangarLandingPad`)
- Luci guida rosse/blu lampeggianti
- Casse tecniche (📦 🔋 🔩)
- Cavi energia con pulse luminoso

### 3. Stati visivi navicella

Logica in `ship-visual-state.ts` — usa **solo** `percent` già calcolato da `shipProgressPercent(parts)`:

| Stato | Soglia | Aspetto |
|-------|--------|---------|
| **Relitto** | 0–12% | Scafo scuro, pannelli rotti, fumo, ala spezzata, no motori |
| **25%** | 13–37% | Ala stub, cockpit opaco, scintille, luci nav deboli |
| **50%** | 38–62% | Ala sinistra, stabilizzatori, cockpit acceso, motori visibili |
| **75%** | 63–87% | Entrambe le ali, antenna, motori con bagliore, pannelli intatti |
| **Completa** | 88–100% | Hull luminoso, glow pieno, antenna attiva, hover più ampio |

Ogni stato modifica: ali, cockpit, antenna, stabilizzatori, motori, pannelli, luci nav, fumo/scintille.

### 4. Effetti leggeri

- `ParticleEffect` ship-glow (opacità tier-dependent)
- Fumo (`shipSmoke`) su relitto/25%
- Scintille CSS (`shipSparks`) su 25%/50%
- Pulse motori SVG (`shipEnginePulse`)
- Luci nav rossa/blu alternate
- Luci guida hangar lampeggianti
- Cavi con glow pulsante

Nessuna particella pesante — solo CSS + 1 layer FX esistente.

### 5. Pikmin tecnici

Nuovo `DioramaTechCrew.tsx` — 5 Pikmin decorativi (2 in modalità compact):

| Ruolo | Prop | Posizione |
|-------|------|-----------|
| Trasporto | 📦 | 34%, 28% |
| Motori | 🔧 | 66%, 26% |
| Impalcature | 🪜 | 38%, 34% |
| Materiali | 🔩 | 62%, 32% |
| Energia | ⚡ | 50%, 38% |

Patrol Pikmin spostati in zona bassa per non coprire l’hangar.

### 6. Mobile first

- Viewport test target: **390×844**, **430×932**
- Navicella min **118px** su schermi ≤430px
- Hangar anchor `width: 96vw` su mobile
- Scene ratio ottimizzato per altezza verticale

---

## File toccati

| File | Tipo |
|------|------|
| `src/components/game/diorama/DioramaShipHangar.tsx` | Riscrittura hangar + navicella SVG |
| `src/components/game/diorama/ship-visual-state.ts` | Nuovo — tier visivi |
| `src/components/game/diorama/DioramaTechCrew.tsx` | Nuovo — crew decorativa |
| `src/components/game/diorama/diorama-data.ts` | Posizione hangar + crew + patrol |
| `src/components/game/VillageDiorama.tsx` | Anchor hangar + tech crew |
| `src/styles/village-diorama.module.css` | +~280 righe hangar/FX/mobile |
| `docs/FASE_V1_8_NAVICELLA_CINEMATICA.md` | Questo report |

**Non modificati:** `spaceship.ts`, hooks DB, routes gameplay, Supabase, modal `SpaceshipAssemblyPanel` (solo UI diorama).

---

## Criteri accettazione

| Criterio | Stato |
|----------|-------|
| Occhio va subito alla navicella | ✅ Centro-alto, 2× scala, z-index max |
| Hangar e navicella sembrano fisici | ✅ Travi, impalcature, pad, gru, casse |
| Non sembrano icone piatte | ✅ SVG dettagliato + struttura CSS 3D |
| Visibile su mobile senza zoom | ✅ clamp + aspect mobile |
| Build OK | ✅ (verificare con `npm run build`) |

---

## Test consigliato

1. Apri `/villaggio` su mobile (DevTools 390×844)
2. Verifica navicella in alto al centro con hangar intorno
3. Con 0% progresso → relitto + fumo
4. Simula progresso alto (demo con pezzi raccolti) → stati 50%/75%/completa
5. Tap navicella → modal hangar esistente si apre (invariato)

---

## Prossimi passi (opzionali, fuori scope)

- Transizione animata tra tier al cambio percent
- Specular highlight hull basato su bioma
- Suono ambiente hangar (loop meccanico leggero)
