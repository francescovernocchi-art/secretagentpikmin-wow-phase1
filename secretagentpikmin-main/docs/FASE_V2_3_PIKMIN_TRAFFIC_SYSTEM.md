# FASE V2.3 — Pikmin Traffic System

**Data:** 2026-06-01  
**Base:** V2.2 Bosco Lorenzo V1  
**Scope:** Colonia viva con agenti Pikmin placeholder — traffico automatico, cargo visual, debug editor.

**Non modificato:** missioni, market, chat, radar, scanner, XP, inventario, Supabase, database.

---

## Obiettivo

Far sembrare la colonia **viva** anche senza sprite finali: 10–30 Pikmin placeholder animati con compiti, percorsi struttura→struttura e oggetti trasportati.

---

## Agente Pikmin

| Campo | Descrizione |
|-------|-------------|
| `id` | Es. `agent-0` |
| `type` | red, yellow, blue, white, purple, rock |
| `currentTask` | walk, carry, work, idle, gather |
| `routeId` | Pattern traffico (es. `tp-magazzino-hangar`) |
| `homeStructure` | Edificio/zona origine |
| `destination` | Edificio/zona/hotspot destinazione |

### Compiti

| Task | Comportamento |
|------|----------------|
| **idle** | Loop casuale vicino alla home |
| **walk** | Percorso A↔B via road network |
| **carry** | Come walk + cargo visivo (semi, foglie, frutti, metallo) |
| **work** | Micro-loop sul punto lavoro (piazza/lab) |
| **gather** | Home → hotspot → ritorno |

---

## Traffico automatico (Bosco Lorenzo)

Pattern predefiniti in `trafficConfig.patterns`:

| Pattern | Percorso | Task | Cargo |
|---------|----------|------|-------|
| tp-serra-magazzino | Mercato (Serra) → Magazzino | carry | 🌱 seed |
| tp-magazzino-hangar | Magazzino → Hangar | carry | ⚙️ metal |
| tp-accademia-piazza | Accademia → Piazza | walk | — |
| tp-laboratorio-piazza | Laboratorio → Piazza | work | — |
| tp-gather-flower | Accademia → hs-flower | gather | 🍃 leaf |
| tp-gather-fruit | Magazzino → hs-fruit | gather | 🍎 fruit |
| tp-idle-plaza | Piazza | idle | — |

Gli agenti vengono **generati automaticamente** da `generateTrafficAgents(layout, count)`.

---

## Spawn

| Parametro | Default |
|-----------|---------|
| `initialCount` | 10 |
| `maxCount` | 30 |

Override runtime: `localStorage` chiave `secret-pikmin-traffic-count`  
Editor: slider tab **Traffic**.

---

## Visual feedback cargo

| Tipo | Icona |
|------|-------|
| seed | 🌱 |
| leaf | 🍃 |
| fruit | 🍎 |
| metal | ⚙️ |

Mostrato solo su agenti `carry` / `gather` con cargo definito.

---

## Performance (mobile first)

- **Nessun framer-motion** per agenti traffico — solo CSS `@keyframes` su `left`/`top`
- `will-change: left, top` + `contain: layout style`
- Placeholder oval colorati (no fetch sprite) — leggeri
- Compact mode: max 12 agenti
- Target verificato: **390×844**, **430×932**, fino a **30 agenti**

---

## Architettura

```
src/lib/diorama/pikminTraffic.ts          ← tipi, generator, pathfinding
src/components/game/diorama/engine/
  PikminTrafficLayer.tsx                  ← render agenti + cargo
  DioramaImageStage / DioramaCssFallback  ← integrazione runtime
src/data/diorama-layouts/bosco-lorenzo-v1.json  ← trafficConfig
```

Sostituisce `DioramaPikminTraffic` (route statiche V2.0) nel runtime villaggio.

---

## Editor — modalità debug

Tab **Traffic** in `/villaggio/editor/foresta` → Layout:

- Slider agenti 1–30
- Checkbox debug: route gialle tratteggiate + label task
- Lista agenti: id, task, home→destinazione
- Preview live sullo stage

---

## File media

| File | Descrizione |
|------|-------------|
| `docs/screenshot-v2-3-traffic-villaggio-390x844.png` | Villaggio con 10 agenti |
| `docs/screenshot-v2-3-traffic-debug-390x844.png` | Editor debug 30 agenti |
| `docs/video/v2-3-traffic-walkthrough.webm` | Walkthrough traffico |

---

## Criteri di accettazione

| Criterio | Esito |
|----------|-------|
| Agenti walk/carry/work/idle/gather | ✅ |
| Traffico auto (pattern struttura) | ✅ |
| Spawn 10, max 30 configurabile | ✅ |
| Cargo visual | ✅ |
| 30 Pikmin mobile-friendly | ✅ |
| Editor debug route/agenti | ✅ |
| Build OK | ✅ |

---

## Riferimenti

- [FASE V2.2 Bosco Lorenzo](./FASE_V2_2_BOSCO_LORENZO_V1.md)
- [FASE V2.1 Validazione Engine](./FASE_V2_1_VALIDAZIONE_ENGINE.md)
