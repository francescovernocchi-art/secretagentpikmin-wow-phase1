# Fase V1.6 — Fullscreen Mobile Diorama

**Progetto:** Secret Pikmin  
**Baseline:** V1.5 approvata  
**Data:** 2026-05-31  
**Scope:** solo `/villaggio`, layout mobile `VillageDiorama`, CSS diorama e componenti visuali del villaggio.

---

## Obiettivo

Il villaggio diventa la schermata principale mobile: micro HUD in alto, diorama grande subito visibile, bottom nav in overlay leggero.

---

## Interventi

- `/villaggio` usa una sola riga compatta con nome villaggio e micro-chip per debito, cibo, energia e morale.
- La griglia HUD grande non viene renderizzata nella schermata villaggio fullscreen.
- `VillageDiorama` in modalità `fullScreen` rimuove header/card interna e usa una scena mobile con altezza calcolata sul viewport.
- Il CSS diorama elimina il limite mobile di 420px per la scena fullscreen e ingrandisce stage, edifici, label e hangar/navicella.
- I contenuti secondari del villaggio restano sotto il primo viewport, lasciando il diorama come elemento dominante.
- Gli stati visuali edificio restano supportati: `locked`, `buildable`, `under_construction`/`building`, `upgrading`, livelli e hangar/navicella.

---

## Vincoli rispettati

- Nessuna modifica a gameplay, database, missioni, market, radar, chat, XP, inventario o Supabase.
- Nessuna modifica alla logica dati del villaggio.
- Nessuna modifica alla bottom nav globale: su `/villaggio` il contenuto mobile riduce il padding basso per permettere overlay leggero.

---

## QA richiesto

- `/villaggio` a 390x844
- `/villaggio` a 430x932
- Screenshot reali
- `npm run build`
