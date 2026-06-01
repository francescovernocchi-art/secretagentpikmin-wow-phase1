# FASE V2.4 — Asset Manager Admin

**Data:** 2026-06-01  
**Base:** V2.3 Pikmin Traffic System  
**Scope:** Upload asset grafici da interfaccia admin, storage locale IndexedDB, collegamento automatico al layout, export/import pacchetto bioma.

**Non modificato:** gameplay, missioni, market, radar, scanner, XP, chat, Supabase database.

---

## Obiettivo

Permettere al **Comandante (papa)** di caricare sprite e sfondi dall’app senza editare JSON a mano. Gli asset restano in **IndexedDB**; il layout salva riferimenti virtuali `diorama-asset://{id}` in localStorage.

---

## Accesso

| Route | Ruolo |
|-------|-------|
| `/villaggio/editor/foresta` (bioma bosco) | `papa` in `localStorage` → `pikmin.session.v2` |
| Tab **Asset** | Asset Manager V2.4 |

---

## Funzioni

### 1. Upload asset

Tipi supportati:

| Tipo | Uso |
|------|-----|
| **Sfondo diorama** | `layout.backgroundImage` — disattiva fallback CSS |
| **Sprite edificio** | Slot `locked`, `buildable`, `construction`, `lv1`–`lv5` |
| **Sprite hangar** | `hangar_lv1` … `hangar_complete` |
| **Sprite hotspot** | Campo `hotspot.sprite` |
| **Decorazione** | Nuovo layer overlay o layer esistente |

Edifici selezionabili: hangar, centro_controllo, accademia, magazzino, laboratorio, mercato, **serra** (alias → mercato).

### 2. Salvataggio locale

| Store | Contenuto |
|-------|-----------|
| **IndexedDB** `secret-pikmin-diorama-assets` | Blob immagine + metadati |
| **localStorage** `secret-pikmin-diorama-layout:{biome}` | Layout con ref `diorama-asset://` |

Nessun file in `public/` — ideale per demo e iterazione rapida.

**Futuro Supabase Storage:** path predisposto `diorama-assets/{biome}/{assetId}.{ext}` in `dioramaAssetRefs.ts`.

### 3. Collegamento automatico al layout

Flusso upload:

1. Scegli tipo, edificio, stato/livello
2. Seleziona immagine
3. Blob → IndexedDB
4. `applyAssetToLayout()` aggiorna slot corretto
5. `persist()` → localStorage
6. Villaggio legge layout merged e risolve blob URL

**Esempio:** hangar + Hangar Lv 1 → `layout.hangarAssets.hangar_lv1 = "diorama-asset://da-…"`

### 4. Asset Library

Griglia con:

- Anteprima
- Nome file
- Tipo
- Edificio · slot
- **Usa** — riapplica ref al layout
- **Elimina** — rimuove da IndexedDB

### 5. Sfondo diorama

Upload tipo **Sfondo diorama** sostituisce lo sfondo del bioma corrente (es. bosco-lorenzo-v1) e imposta `forceCssFallback: false`. Il motore passa in modalità **image** quando il blob è caricabile.

### 6. Export / Import pacchetto

| Azione | Formato |
|--------|---------|
| **Esporta pacchetto** | JSON: layout + asset embedded base64 |
| **Importa pacchetto** | Ripristina IndexedDB + layout |

File: `{layout.id}-biome-pack.json`  
Campo `format: "json-base64"` — zip preparabile in fase successiva.

### 7. Fallback

Se asset mancante o errore caricamento:

- Edifici → silhouette CSS (`DioramaBuilding`)
- Hangar → navicella CSS (`DioramaShipHangar`)
- Hotspot → emoji icon
- Sfondo assente → diorama CSS procedurale

---

## Architettura

```
src/lib/diorama/
  dioramaAssetStore.ts      ← IndexedDB CRUD
  dioramaAssetRefs.ts       ← diorama-asset:// + path Supabase futuro
  dioramaAssetResolver.ts   ← blob URL cache
  applyDioramaAsset.ts      ← bind asset → layout
  dioramaBiomePack.ts       ← export/import JSON+base64

src/hooks/
  useDioramaAssets.ts       ← upload, library, pack
  useResolvedAssetUrl.ts    ← hook risoluzione ref → blob

src/components/village/editor/
  DioramaAssetManager.tsx   ← UI admin tab Asset

Engine (runtime):
  DioramaBuildingOverlay, DioramaHangarOverlay,
  DioramaImageStage, DioramaHotspotLayer
  → useResolvedAssetUrl() su ogni src
```

---

## Criteri di accettazione

| Criterio | Esito |
|----------|-------|
| Upload hangar_lv1 da interfaccia | ✅ |
| Associazione Hangar livello 1 | ✅ |
| Villaggio mostra sprite senza codice | ✅ |
| Upload sfondo diorama | ✅ |
| Villaggio usa sfondo caricato | ✅ |
| Export layout + asset | ✅ |
| Build OK | ✅ |

---

## Media

| File | Descrizione |
|------|-------------|
| `docs/screenshot-v2-4-asset-editor-390x844.png` | Tab Asset — upload + library |
| `docs/screenshot-v2-4-villaggio-custom-390x844.png` | Villaggio con asset IndexedDB |

Slideshow: `docs/walkthrough-v2-4.html`

---

## Test rapido

1. Imposta sessione demo: ruolo `papa` in `pikmin.session.v2`
2. Apri `/villaggio/editor/foresta` → tab **Asset**
3. Tipo **Sprite hangar**, stadio **Hangar Lv 1**, carica un PNG/WebP
4. Vai a `/villaggio` — hangar mostra lo sprite caricato
5. **Esporta pacchetto** → JSON con layout + immagini base64

---

## Riferimenti

- [FASE V2.3 Pikmin Traffic](./FASE_V2_3_PIKMIN_TRAFFIC_SYSTEM.md)
- [FASE V2.2 Bosco Lorenzo](./FASE_V2_2_BOSCO_LORENZO_V1.md)
