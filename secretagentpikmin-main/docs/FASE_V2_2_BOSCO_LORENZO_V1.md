# FASE V2.2 — Bosco Lorenzo V1

**Data:** 2026-06-01  
**Base:** V2.1 Diorama Engine validato  
**Scope:** Primo bioma definitivo — struttura asset, layout JSON, editor esteso. **Nessuna grafica generata.**

---

## Obiettivo

Preparare il bioma **Bosco Lorenzo** come layout production-ready: zone, edifici, hotspot, rete strade e slot sprite multi-livello. Gli asset grafici vanno aggiunti manualmente in `public/assets/`.

**Non modificato:** missioni, market, chat, radar, scanner, XP, inventario, Supabase, database.

---

## Layout `bosco-lorenzo-v1`

| File | Ruolo |
|------|--------|
| `src/data/diorama-layouts/bosco-lorenzo-v1.json` | Layout canonico |
| `src/data/dioramaLayouts.ts` | Tipi estesi + `BOSCO_LORENZO_V1` default bioma `bosco` |

### Zone principali

| ID | Label |
|----|--------|
| `hangar` | Hangar |
| `piazza` | Piazza Centrale |
| `accademia` | Accademia |
| `magazzino` | Magazzino |
| `laboratorio` | Laboratorio |
| `mercato` | Mercato |
| `centro_controllo` | Centro Controllo Remoto |

### Sfondo atteso

```
public/assets/dioramas/bosco-lorenzo-v1.webp
```

Path layout: `/assets/dioramas/bosco-lorenzo-v1.webp`  
Se assente → fallback CSS automatico (nessun paesaggio simulato in CSS).

---

## 1. Slot asset edificio

Convenzione documentata in `public/assets/buildings/README.md`:

```
public/assets/buildings/{edificio}/
  lv1.webp … lv5.webp
  construction.webp
  destroyed.webp
  locked.webp
  buildable.webp
```

### Resolver

`src/lib/diorama/dioramaAssets.ts`

- `resolveBuildingSprite(assets, visualState, key)` — path esplicito JSON → `basePath` → path standard
- `resolveBuildingVisualState(status, level)` — mappa stato gioco → sprite
- Fallback silhouette CSS se immagine non carica (`onError`)

---

## 2. Stati visivi edificio

| Stato | Sprite |
|-------|--------|
| `locked` | locked.webp |
| `buildable` | buildable.webp |
| `under_construction` | construction.webp |
| `level_1` … `level_5` | lv1.webp … lv5.webp |

Cambio automatico in runtime da `status` + `level` edificio (`VillageDiorama`).

---

## 3. Hangar evolutivo

| % riparazione | Stage |
|---------------|--------|
| 0–12% | hangar_lv1 |
| 13–37% | hangar_lv2 |
| 38–62% | hangar_lv3 |
| 63–87% | hangar_lv4 |
| 88%+ | hangar_complete |

Componente: `DioramaHangarOverlay` — sprite se asset presente, altrimenti `DioramaShipHangar` CSS esistente. **Solo visualizzazione**, nessuna logica gameplay aggiunta.

Config JSON: `hangarAssets` nel layout.

---

## 4. Hotspot POI

Tipi supportati: `wreck`, `rare_flower`, `fruit`, `cave`, `mission_entrance`, `custom`.

Componente: `DioramaHotspotLayer`

- Cliccabili (route, ship, inspect toast)
- Configurabili da JSON
- Nascondibili (`hidden`)
- Editor: spostamento, label, tipo, route

Hotspot Bosco Lorenzo (estratto):

| ID | Tipo | Label |
|----|------|--------|
| hs-wreck | wreck | Relitto |
| hs-flower | rare_flower | Fiore raro |
| hs-fruit | fruit | Frutto |
| hs-cave | cave | Grotta |
| hs-mission | mission_entrance | Ingresso missione → `/missioni` |

---

## 5. Road network (futuro)

Campo layout: `roadNetwork[]`

```json
{ "id": "road-main", "type": "main", "waypoints": [{ "x": 50, "y": 78 }, …] }
```

Tipi: `main`, `forest_trail`, `hangar_path`

- Preview solo in **editor** (`DioramaRoadPreview`)
- Nessuna animazione Pikmin sulle strade (fase futura)

---

## 6. Editor aggiornato

`DioramaLayoutEditor` — sezioni:

| Sezione | Funzioni |
|---------|----------|
| **Buildings** | Posizione, Z, scale, basePath, nascondi, preview stati sprite |
| **Hotspots** | Posizione, tipo, label, route, nascondi |
| **Roads** | Selezione strada, aggiungi waypoint click, tipo, nascondi |

Export/import JSON include `zones`, `roadNetwork`, `hangarAssets`, `assets` per edificio.

Percorso: `/villaggio/editor/foresta` → tab **Layout** (Comandante).

---

## 7. Mobile first

CSS `@media (max-width: 430px)`:

- Editor stage max-height ridotta
- Sprite edificio / hangar scalati
- `object-fit: contain` su sfondo
- Nessun overflow orizzontale su editor frame

Viewport target: **390×844**, **430×932**.

---

## Architettura file

```
src/data/diorama-layouts/bosco-lorenzo-v1.json
src/data/dioramaLayouts.ts          ← tipi V2.2
src/lib/diorama/dioramaAssets.ts    ← resolver sprite
src/components/game/diorama/engine/
  DioramaBuildingOverlay.tsx        ← multi-sprite
  DioramaHangarOverlay.tsx          ← hangar evolutivo
  DioramaHotspotLayer.tsx           ← POI
  DioramaRoadPreview.tsx            ← editor roads
  DioramaImageStage.tsx
  DioramaCssFallback.tsx
src/components/village/editor/DioramaLayoutEditor.tsx
public/assets/buildings/README.md
public/assets/dioramas/bosco-lorenzo-v1.webp  ← da fornire
```

---

## Criteri di accettazione

| Criterio | Esito |
|----------|-------|
| Bioma bosco creato (`bosco-lorenzo-v1`) | ✅ |
| Supporto sprite multipli edificio | ✅ |
| Hangar evolutivo (visual) | ✅ |
| Hotspot configurabili | ✅ |
| Road network configurabile | ✅ |
| Editor Buildings / Hotspots / Roads | ✅ |
| Build OK | ✅ |
| Nessuna grafica generata | ✅ |

---

## Prossimi passi (manuale)

1. Aggiungere `public/assets/dioramas/bosco-lorenzo-v1.webp`
2. Aggiungere sprite in `public/assets/buildings/{edificio}/`
3. Aggiungere hangar stages in `public/assets/buildings/hangar/`
4. Verificare image mode al refresh villaggio bioma bosco

---

## Riferimenti

- [FASE V2.1 Validazione Engine](./FASE_V2_1_VALIDAZIONE_ENGINE.md)
- [FASE V2.0 Diorama Engine](./FASE_V2_0_DIORAMA_ENGINE.md)
