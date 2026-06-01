# FASE V2.0 — Diorama Engine (non disegno CSS)

**Data:** 2026-05-29  
**Base:** V2.0 piazza centrale (fallback CSS)  
**Scope:** Motore diorama configurabile — posizionamento, profondità, animazioni, percorsi, effetti, editor layout.

---

## Cambio direzione

Il villaggio **non viene più disegnato interamente in CSS**. Gli sfondi e gli sprite saranno caricati manualmente in:

```
public/assets/dioramas/
```

Il codice gestisce solo:
- posizionamento overlay (%)
- z-index / profondità
- click edifici
- animazioni Pikmin
- percorsi configurabili
- effetti (glow, dust, luci hangar)
- **fallback CSS** se manca lo sfondo

---

## Architettura

```
VillageDiorama
  └── useDioramaLayout(biome)
  └── useEngineMode(layout)  → "image" | "css"
  └── DioramaEngine
        ├── DioramaImageStage   (sfondo + overlay)
        └── DioramaCssFallback  (diorama V1.x procedurale)
```

### File principali

| File | Ruolo |
|------|--------|
| `src/data/dioramaLayouts.ts` | Tipi + layout default per bioma |
| `src/data/diorama-layouts/colonia-bosco-v1.json` | Layout JSON di riferimento |
| `src/hooks/useDioramaLayout.ts` | Merge default + localStorage |
| `src/components/game/diorama/engine/DioramaEngine.tsx` | Router image/css |
| `src/components/game/diorama/engine/DioramaImageStage.tsx` | Stage immagine |
| `src/components/game/diorama/engine/DioramaCssFallback.tsx` | Fallback procedurale |
| `src/components/game/diorama/engine/DioramaBuildingOverlay.tsx` | Sprite o silhouette cliccabile |
| `src/components/game/diorama/engine/DioramaEffectsLayer.tsx` | Pikmin traffic + FX |
| `src/components/village/editor/DioramaLayoutEditor.tsx` | Editor coordinate |

---

## Configurazione layout

Ogni layout (`DioramaLayout`) include:

| Campo | Descrizione |
|-------|-------------|
| `backgroundImage` | Path public es. `/assets/dioramas/colonia-bosco-v1.webp` |
| `aspectRatio` | Es. `"390 / 480"` |
| `buildings[]` | `key`, `x`, `y`, `z`, `scale`, `image?`, `fallback` |
| `pikminRoutes[]` | `waypoints`, `anim`, `duration` |
| `hotspots[]` | Aree interattive opzionali |
| `effects[]` | `building-glow`, `construction-dust`, `hangar-lights`, particelle |
| `layers[]` | Overlay immagine aggiuntivi |

---

## Modalità engine

1. **Image mode** — sfondo caricato OK → solo overlay posizionati
2. **CSS fallback** — sfondo assente o `forceCssFallback: true` → diorama V1.x (terreno, piazza, silhouette)

---

## Editor layout

**Percorso:** `/villaggio/editor/$biome` → tab **Layout** (solo Comandante)

Funzioni:
- Click stage → coordinate % + sposta edificio selezionato
- Slider X/Y/Z/scale per edificio
- Campo sfondo + sprite opzionale
- **Salva locale** → `localStorage` (`secret-pikmin-diorama-layout:{biome}`)
- **Esporta JSON** → download layout
- **Reset** → default da `dioramaLayouts.ts`

---

## Asset manuali

Vedi `public/assets/dioramas/README.md`

Quando aggiungi `colonia-bosco-v1.webp`, il villaggio passa automaticamente in image mode (senza rebuild, solo refresh).

---

## Animazioni standard (engine)

| Tipo | Gestione |
|------|----------|
| Pikmin walk/carry/work | `DioramaPikminTraffic` + rotte layout |
| Building glow | effect `building-glow` |
| Construction dust | effect `construction-dust` |
| Hangar lights | effect `hangar-lights` |
| Particelle | `particle-dust`, `particle-energy` |

Sistema navicella (`DioramaShipHangar`) invariato — solo posizionamento da layout.

---

## Non modificato

Missioni, Supabase, market, chat, radar, scanner, XP, inventario, economia, gameplay hooks.

---

## Test

```bash
npm run build   # ✅
npm run dev
# /villaggio — fallback CSS finché manca lo sfondo
# /villaggio/editor/foresta → tab Layout
# Aggiungi public/assets/dioramas/colonia-bosco-v1.webp → image mode
```

---

## Criteri di accettazione

| # | Criterio | Stato |
|---|----------|-------|
| 1 | Sfondo caricabile da public | ✅ |
| 2 | Config layout in dioramaLayouts.ts | ✅ |
| 3 | Edifici overlay sprite + fallback | ✅ |
| 4 | Animazioni e percorsi configurabili | ✅ |
| 5 | Editor coordinate + export JSON | ✅ |
| 6 | Fallback CSS se manca sfondo | ✅ |
| 7 | Build OK | ✅ |
