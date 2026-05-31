# Fase V1.4 — Villaggio vivo mobile

**Route:** `/villaggio`  
**Ambito:** `VillageDiorama`, componenti `diorama/*`, CSS del diorama  
**Vincoli:** gameplay, database, missioni, market, radar, chat e XP invariati.

---

## V1.4B — Densità e scala mobile

Obiettivo: rendere il villaggio protagonista su mobile, evitando una card piccola e poco popolata.

### Interventi

- Diorama fullscreen più alto su mobile: la scena usa una variante dedicata a `/villaggio` e supera i 500 px nei viewport target.
- Popolazione visuale aumentata: 13 Pikmin decorativi distribuiti tra hangar, cantieri, sentieri, deposito e zone libere, in aggiunta ai Pikmin reali.
- Natura più fitta: aggiunti cespugli, fiori, funghi, rocce, erba alta, tronchetti, foglie e semi sulla piastra isometrica.
- Edifici meno iconici: aggiunti footprint, porte, finestre, materiali, ombre e impalcature.
- Hangar/navicella più fisico: aggiunti pad tecnico, materiali e impalcatura dedicata.

### Accettazione

- URL corrente contiene `/villaggio`.
- `VillageDiorama` renderizzato.
- Almeno 10 Pikmin/attori rilevati nel DOM.
- Diorama mobile più alto e visivamente dominante.
- Screenshot verificati a 390x844 e 430x932.
- `npm run build` completato con successo.
