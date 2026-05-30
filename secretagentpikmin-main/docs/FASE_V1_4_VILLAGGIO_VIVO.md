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
- `src/routes/villaggio.tsx`
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

- 390x844: `/villaggio` aperto, nessuno scroll orizzontale, bottom nav visibile, Pikmin e navicella leggibili.
- 430x932: `/villaggio` aperto, nessuno scroll orizzontale, bottom nav visibile, quick action non coperte dai floating button.
- Screenshot prodotti in `/opt/cursor/artifacts/villaggio_mobile_390x844_v14_final.png`.
- Screenshot prodotti in `/opt/cursor/artifacts/villaggio_mobile_430x932_v14_final.png`.
- Walkthrough video prodotto in `/opt/cursor/artifacts/villaggio_vivo_mobile_walkthrough_v14_final.webm`.

---

## Problemi rimasti

- `npm run lint` globale fallisce ancora su errori preesistenti fuori scope; i file V1.4 modificati passano ESLint mirato.
