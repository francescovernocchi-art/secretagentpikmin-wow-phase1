# FASE V1.5 - Evoluzione edifici e cantieri

## Scope

Intervento limitato a `/villaggio`, `VillageDiorama`, componenti diorama, CSS diorama e documentazione.
Non sono stati modificati gameplay, database, missioni, market, radar, chat, XP, inventario o Supabase.

## Stati visuali coperti

- `locked`: sagoma scura, area recintata e cartello requisito; non renderizza l'edificio completo.
- `buildable`: fondamenta illuminate, griglia base, materiali pronti e cartello "costruisci".
- `under_construction`: impalcature, casse, Pikmin operai, luce/polvere da cantiere e barra progresso visuale.
- `level_1`: edificio piccolo, base semplice e pochi dettagli.
- `level_2` / `level_3`: volume più grande, finestre accese, dettagli esterni e indicatore di miglioramento.
- `level_4` / `level_5`: edificio scenico, struttura completa ed effetto luminoso.

## Edifici gestiti

- Centro di Controllo
- Magazzino
- Laboratorio
- Accademia Pikmin
- Mercato
- Centro Controllo Remoto
- Hangar/Navicella

## Fallback colonia iniziale

Quando i dati reali non descrivono una progressione (assenza dati oppure seed locale tutto `active` a livello 1), il diorama usa una progressione coerente da colonia iniziale:

- Centro di Controllo e Magazzino costruiti a livello 1.
- Hangar/Navicella in cantiere.
- Laboratorio costruibile.
- Accademia Pikmin, Mercato e Centro Controllo Remoto bloccati.

In presenza di stati reali (`locked`, `buildable`, `building`, `upgrading`) il diorama li rispetta per comunicare costruzione o blocco.

## Mobile first

Le aree cliccabili degli edifici sono state aumentate e restano link/button esistenti, quindi tooltip, focus e bottom sheet dell'Hangar continuano a funzionare.
Verifica prevista su viewport 390x844 e 430x932.
