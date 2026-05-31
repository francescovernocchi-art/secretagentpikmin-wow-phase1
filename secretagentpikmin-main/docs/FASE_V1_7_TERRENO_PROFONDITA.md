# Fase V1.7 — Terreno reale e profondità

**Progetto:** Secret Pikmin  
**Baseline:** V1.6 approvata  
**Data:** 2026-05-31  
**Scope:** solo `VillageDiorama`, componenti diorama, CSS diorama e layout villaggio.

---

## Obiettivo

Eliminare l'effetto "rettangolo verde con edifici sopra" e trasformare il villaggio in una colonia in miniatura: terreno modellato, natura irregolare, acqua, sentieri vissuti e hangar come landmark.

---

## Interventi

- Terreno con sagoma organica, bordo scavato, profondità, scarpate e zone rialzate.
- Sentieri curvi con biforcazioni e tracce consumate dai Pikmin.
- Acqua sempre presente tramite piccolo ruscello e stagno laterale.
- Natura più varia: alberi grandi, cespugli, tronchi, funghi, fiori e rocce distribuite.
- Edifici integrati con basamenti, ombre, footprint nel terreno e dettagli esterni.
- Hangar/navicella valorizzati con piattaforma di atterraggio, luci guida, casse, materiali, impalcatura e tecnici.

---

## Vincoli rispettati

- Nessuna modifica a gameplay, Supabase, database, missioni, market, chat, radar, scanner, XP o inventario.
- Nessuna modifica alle API dati o alla persistenza.
- Variazioni limitate a diorama, componenti visuali e report.

---

## QA richiesto

- `/villaggio` a 390x844
- `/villaggio` a 430x932
- Screenshot reali
- Video walkthrough
- `npm run build`
