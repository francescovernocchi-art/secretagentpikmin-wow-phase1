# Fase V1.4 — Villaggio Vivo Mobile-First

**Progetto:** Secret Pikmin  
**Baseline:** V1.3 completata  
**Data:** 2026-05-30  
**Vincoli:** solo `/villaggio`, componenti diorama, CSS diorama e micro-componenti visuali

---

## Riepilogo

La V1.4 rende il diorama del villaggio piu abitato senza aggiungere meccaniche, tabelle o nuove entita di gameplay.

---

## File modificati

- `src/components/game/VillageDiorama.tsx`
- `src/components/game/diorama/DioramaLivingColony.tsx`
- `src/components/game/diorama/DioramaTerrain.tsx`
- `src/components/game/diorama/DioramaShipHangar.tsx`
- `src/styles/village-diorama.module.css`
- `docs/FASE_V1_4_VILLAGGIO_VIVO.md`

---

## Elementi visuali aggiunti

- 14 Pikmin ambientali staticamente definiti nel diorama, solo visuali.
- Ruoli visuali: esploratori, operai, costruttori e tecnici.
- Specie/colori distinguibili: rosso, blu, giallo, viola, bianco, roccia e alato.
- Ombra, corpo, testa, occhi, foglia, badge ruolo e piccoli accessori per ogni Pikmin.
- Materiali trasportati: casse, cristalli e rametti.
- Dettagli naturali piu densi: alberelli, cespugli, fiori, funghi, erba alta, rocce e ciottoli.
- Hangar piu leggibile: pad luminoso, beacon laterali e navicella piu prominente.

---

## Animazioni aggiunte

- Camminate CSS leggere su tre percorsi brevi.
- Oscillazione di operai con carico.
- Movimento di lavoro vicino ai cantieri con polvere.
- Idle tecnico vicino a hangar/navicella con scintille.
- Erba e vegetazione con sway leggero.
- Particelle ambientali lente e luci hangar.

---

## Test mobile eseguiti

- Da completare dopo smoke browser a 390x844.
- Da completare dopo smoke browser a 430x932.

---

## Problemi rimasti

- Nessuno noto prima della verifica finale.
