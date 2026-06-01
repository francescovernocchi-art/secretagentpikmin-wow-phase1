# FASE V1.9 — Asset Pass Edifici e Ambientazione

**Data:** 2026-05-29  
**Base:** V1.8B (fullscreen diorama)  
**Scope:** Solo `VillageDiorama`, `DioramaBuilding`, `DioramaTerrain`, `DioramaShipHangar`, CSS diorama, documentazione — nessuna modifica a gameplay, missioni, radar, scanner, market, inventario, XP, chat, Supabase, database, economia.

---

## Obiettivo

Il villaggio deve sembrare una **colonia reale e vissuta**: edifici riconoscibili, natura distribuita, sentieri percorsi, Pikmin attivi, hangar operativo. La navicella resta protagonista.

---

## Modifiche

### 1. Edifici unici (`DioramaBuilding.tsx` + CSS)

Componente `BuildingSilhouette` con silhouette dedicate per ogni chiave:

| Edificio | Elementi visivi |
|----------|-----------------|
| **Accademia Pikmin** | Bandiere, manichino, bersaglio, area addestramento |
| **Laboratorio** | Provette, generatore, antenna, luci tecnologiche |
| **Mercato** | Tenda, insegna MKT, merci esposte, casse |
| **Magazzino** | Container, pallet, casse impilate |
| **Centro Controllo** | Parabole, radar sweep, torretta sensori, collegamenti dati, luci operative |

Hangar navicella gestito separatamente da `DioramaShipHangar` (già V1.8).

### 2. Natura (`DioramaTerrain.tsx`)

- `NATURE_SCATTER` — 12 elementi asimmetrici: alberi, cespugli, fiori, rocce, funghi, tronchi, erba
- Livelli scena (`sceneNature`) + piatto isometrico (`groundNature`)
- `tallGrass` ai bordi del terreno
- Decor bioma esistente mantenuto

### 3. Sentieri (`DioramaTerrain.tsx`)

- `COLONY_PATHS` — SVG da hangar → piazza → ogni edificio + tracce di usura
- `hangarPathOverlay` — collegamento visivo hangar → villaggio

### 4. Pikmin vivi (`VillageDiorama.tsx`)

- 4 Pikmin ambientali (`ambientPikmin`) con `AnimatedPikmin` (walk / carry / work)
- Posizionati vicino agli edifici; max 4 per impatto performance minimo
- Crew hangar (`DioramaTechCrew`) e squad reale invariati

### 5. Area hangar (`DioramaShipHangar.tsx`)

`hangarYard` (non compact):

- Fari (`hangarFloodLight`)
- Striscia pista (`hangarRunwayStrip`)
- Forklift, mini cart, pile materiali, banco lavoro, casse yard

### 6. CSS (`village-diorama.module.css`)

Blocchi V1.9: silhouette, natura, sentieri overlay, hangar yard, Pikmin ambientali, scaling mobile ≤430px.

---

## File modificati

- `src/components/game/VillageDiorama.tsx`
- `src/components/game/diorama/DioramaBuilding.tsx`
- `src/components/game/diorama/DioramaTerrain.tsx`
- `src/components/game/diorama/DioramaShipHangar.tsx`
- `src/styles/village-diorama.module.css`

---

## Screenshot

| Viewport | File |
|----------|------|
| 390×844 | `docs/screenshot-v1-9-390x844.png` |
| 430×932 | `docs/screenshot-v1-9-430x932.png` |

Walkthrough (slideshow): `docs/walkthrough-v1-9.html`

---

## Criteri di accettazione

| # | Criterio | Stato |
|---|----------|-------|
| 1 | Sembra una colonia, non icone | ✅ silhouette + natura + sentieri |
| 2 | Ogni edificio riconoscibile | ✅ 5 silhouette uniche |
| 3 | Natura visibile | ✅ scatter asimmetrico + erba alta |
| 4 | Villaggio vivo | ✅ Pikmin ambientali + crew hangar |
| 5 | Navicella protagonista | ✅ layout V1.8B invariato |
| 6 | Build OK | ✅ `npm run build` |

---

## Test

```bash
npm run dev
# Demo Francesco → /villaggio
# DevTools 390×844 / 430×932
```

Apri `docs/walkthrough-v1-9.html` nel browser per il video walkthrough (slideshow automatico tra i due viewport).
