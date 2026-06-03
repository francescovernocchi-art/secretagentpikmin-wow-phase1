# FASE V2.5 — Building System

**Data:** 2026-06-01  
**Base:** V2.4 Asset Manager Admin  
**Scope:** Livelli, costi, costruzione e miglioramento edifici — indipendente dalla grafica.

**Non modificato:** missioni, market, radar, scanner, XP, chat, Supabase database, traffic system.

---

## Obiettivo

Gameplay edifici separato dagli asset: sprite risolti via Asset Manager (V2.4), progressione via config locale.

---

## Modello edificio

| Campo | Descrizione |
|-------|-------------|
| `id` | UUID locale / Supabase |
| `building_key` | hangar, magazzino, mercato, … |
| `name` | Nome visualizzato |
| `level` | 0 = non costruito, 1–5 |
| `max_level` | Da config |
| `status` | locked · buildable · under_construction · completed |

### Stati

| Status | Sprite (via `resolveBuildingVisualState`) |
|--------|-------------------------------------------|
| locked | locked |
| buildable | buildable (lv 0) |
| under_construction | under_construction |
| completed | level_N |

---

## Costi risorse

Configurabili per livello in `buildingSystem.ts`:

| Risorsa | item_key inventario |
|---------|---------------------|
| Legno | `legno` |
| Resina | `resina` |
| Semi | `semi` |
| Rottami | `rottami` |

Demo: seed inventario con quantità iniziali (localStore).

---

## Upgrade per livello

Ogni entry in `BUILDING_SYSTEM[key].levels`:

- `costs` — legno/resina/semi/rottami
- `buildTimeSec` — timer costruzione
- `bonus` — effetto gameplay

### Bonus per edificio

| Edificio | Bonus |
|----------|-------|
| Hangar | + capacità riparazione |
| Serra/Mercato | + produzione Pikmin |
| Laboratorio | + velocità ricerca |
| Magazzino | + capacità |
| Accademia | + velocità addestramento |
| Centro Controllo | + villaggi gestibili |

---

## UI villaggio

Tap edificio (non hangar) → pannello modale:

- Nome · Livello · Stato
- Bonus attivo
- Costi prossimo livello
- **Costruisci** (status buildable)
- **Migliora** (status completed)

Hangar → pannello navicella + sezione **Potenzia Hangar** (costruzione/miglioramento bonus riparazione).

---

## Editor layout

Tab **Layout → Buildings**: box **Building System V2.5** con livello, stato, bonus, costi prossimo livello; checkbox **Anteprima stato gioco** sincronizza gli sprite sullo stage con il runtime.

---

## Architettura

```
src/lib/game/buildingSystem.ts     ← config, bonus, costi
src/lib/game/buildingActions.ts    ← build/upgrade, timer, consume risorse
src/components/game/diorama/DioramaBuildingPanel.tsx
src/components/game/VillageDiorama.tsx   ← tap → pannello
src/hooks/useGameData.ts           ← useVillageDiorama + reload
```

Sprite: **nessuna dipendenza** — `DioramaBuildingOverlay` usa solo `level` + `status` runtime.

---

## Criteri di accettazione

| Criterio | Esito |
|----------|-------|
| Livelli + stati edificio | ✅ |
| Costi legno/resina/semi/rottami | ✅ |
| Costruzione con timer | ✅ |
| Miglioramento con bonus | ✅ |
| Pannello tap edificio | ✅ |
| Editor mostra livello/stato/bonus | ✅ |
| Indipendente da asset grafici | ✅ |
| Build OK | ✅ |

---

## Media

| File | Descrizione |
|------|-------------|
| `docs/screenshot-v2-5-building-panel-390x844.png` | Pannello edificio |
| `docs/screenshot-v2-5-villaggio-build-390x844.png` | Villaggio + Serra buildable |
| `docs/walkthrough-v2-5.html` | Slideshow walkthrough |

---

## Test rapido

1. `/villaggio` → tap **Mercato/Serra** (buildable di default)
2. Pannello → **Costruisci** (costi legno + semi)
3. Attendi timer → livello 1 completato, bonus attivo
4. **Migliora** → livello 2
5. Editor → Layout → Buildings → verifica box V2.5

---

## Riferimenti

- [FASE V2.4 Asset Manager](./FASE_V2_4_ASSET_MANAGER_ADMIN.md)
- [FASE V2.3 Pikmin Traffic](./FASE_V2_3_PIKMIN_TRAFFIC_SYSTEM.md)
