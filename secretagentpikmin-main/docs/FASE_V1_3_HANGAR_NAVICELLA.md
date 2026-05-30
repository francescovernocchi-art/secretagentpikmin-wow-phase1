# FASE V1.3 - Hangar e Navicella Eroe

## Obiettivo

Rendere la navicella il centro emotivo del villaggio: entrando nel diorama il giocatore deve capire subito che la colonia esiste per ripararla e completarla.

## Confini

- Solo diorama del villaggio.
- Nessuna modifica a missioni, database, Supabase, market, radar, scanner, chat o XP.
- Nessuna nuova meccanica, schermata o menu.
- La progressione visuale usa i dati gia presenti di `spaceship_parts` e la percentuale calcolata da `shipProgressPercent`.

## Stati visuali navicella

La UI dell'hangar risolve questi stati:

- `relitto`: nessun pezzo disponibile o progresso 0%.
- `riparazione iniziale`: primi pezzi recuperati, struttura ancora fragile.
- `25%`: compaiono parti e prime luci tecniche.
- `50%`: aumenta il dettaglio e la piattaforma si accende di piu.
- `75%`: glow forte e nave quasi operativa.
- `completa`: nave pienamente illuminata e senza tag di danno.

## Componenti mancanti visibili

I pezzi mancanti sono rappresentati nel modello:

- stabilizzatori mancanti -> ala tratteggiata / ala mancante;
- motore mancante -> ugelli spenti;
- modulo energia o nucleo mancanti -> pannello aperto;
- antenna mancante -> antenna assente;
- cabina mancante -> cockpit incrinato.

## Hangar eroe

L'hangar e stato:

- ingrandito;
- spostato nella zona alta del diorama;
- collocato su una piattaforma di atterraggio tecnologica;
- arricchito con luci, runway, materiali, casse, attrezzi e Pikmin operai.

## Fallback

Se i dati della navicella non sono disponibili, il diorama mostra lo stato `relitto`.
