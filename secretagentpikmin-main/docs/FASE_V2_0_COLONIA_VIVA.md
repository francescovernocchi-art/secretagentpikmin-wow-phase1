# FASE V2.0 — Piazza Centrale Viva

**Data:** 2026-05-29  
**Base:** V1.9 (asset pass edifici e ambientazione)  
**Scope:** Solo `VillageDiorama`, `DioramaTerrain`, `DioramaBuilding`, `DioramaShipHangar`, CSS diorama, documentazione.

---

## Obiettivo

La colonia deve sembrare **abitata e connessa**: un cuore visivo (piazza centrale), Pikmin in movimento, flussi chiari Hangar → Piazza → Edifici, hangar operativo in costruzione.

---

## Modifiche

### 1. Piazza centrale (`DioramaTerrain.tsx`)

Nuovo componente `DioramaCentralPlaza`:

| Zona | Elementi |
|------|----------|
| **Pavimentazione** | Ellisse pavimentata tra hangar e villaggio + hub sul piatto isometrico |
| **Raccolta materiali** | Pile 📦 🪵 🔩 |
| **Area operativa** | Coni, luci rosse |
| **Ritrovo Pikmin** | Marcatura ◎ centrale animata |
| **Ponte hangar** | Striscia pavimentata hangar → piazza |

### 2. Traffico Pikmin (`VillageDiorama.tsx`)

- **10 rotte** (4 in compact) con waypoints Hangar → Piazza → Edifici
- Animazioni `walk`, `carry`, `work` via `ColonyTrafficPikmin`
- Squad reale ridotta a 2 in hero/fullscreen per restare leggeri
- Priorità visiva: navicella → piazza → Pikmin → edifici

### 3. Flussi colonia (`DioramaTerrain.tsx`)

Sentieri SVG V2.0:

- Arteria principale hangar → piazza (doppio stroke + usura)
- Raggi piazza → ogni edificio
- Anello ritrovo in piazza
- Tracce incrociate di usura

### 4. Area operativa hangar (`DioramaShipHangar.tsx`)

Espansione `hangarYard` (+28% altezza):

- Nastro cantiere, luci warning, faro centrale
- Pallet, carrelli extra, materiali sparsi
- Spot tecnico 👷 TEC

### 5. Punti di interesse

| POI | Icona | Posizione |
|-----|-------|-----------|
| Falò | 🔥 | Sinistra piazza |
| Deposito materiali | 📦 | Destra piazza |
| Bacheca missioni | 📋 | Sopra piazza |
| Antenna secondaria | 📡 | Hangar-side |
| Pozzo energetico | ⚡ | Destra-bassa |
| Area ricerca | 🔬 | Sinistra-alta |

### 6. Priorità visiva CSS

Z-index e dimensioni calibrati: piazza z34, traffico z62+, edifici z25–40, natura ai bordi.

---

## File modificati

- `src/components/game/VillageDiorama.tsx`
- `src/components/game/diorama/DioramaTerrain.tsx`
- `src/components/game/diorama/DioramaShipHangar.tsx`
- `src/styles/village-diorama.module.css`

---

## Screenshot

| Viewport | File |
|----------|------|
| 390×844 | `docs/screenshot-v2-0-390x844.png` |
| 430×932 | `docs/screenshot-v2-0-430x932.png` |

Walkthrough: `docs/walkthrough-v2-0.html`

---

## Criteri di accettazione

| # | Criterio | Stato |
|---|----------|-------|
| 1 | Colonia viva con attività | ✅ traffico 10 Pikmin |
| 2 | Pikmin evidenti | ✅ rotte piazza/edifici |
| 3 | Piazza centrale visibile | ✅ pavimentazione + hub |
| 4 | Edifici collegati | ✅ sentieri radiali |
| 5 | Villaggio racconta una storia | ✅ POI + hangar cantiere |
| 6 | Navicella protagonista | ✅ layout V1.8B invariato |
| 7 | Build OK | ✅ |

---

## Test

```bash
npm run dev
# Demo Francesco → /villaggio
# DevTools 390×844 / 430×932
```

Apri `docs/walkthrough-v2-0.html` per il video walkthrough (slideshow automatico).
