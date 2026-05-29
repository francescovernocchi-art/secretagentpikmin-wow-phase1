# Secret Pikmin — Roadmap WOW precisa

## Identità finale
Secret Pikmin è un gioco familiare collaborativo. Francesco e Lorenzo sono Comandanti della stessa missione famiglia: salvare il pianeta originario usando squadre di Pikmin reali, villaggi geolocalizzati, radar, scanner fotocamera, Market, navicella, debito planetario e bestiario.

Regola cardine: gli utenti non hanno classi. L'utente resta Comandante. Le specializzazioni sono dei Pikmin.

## Sistemi principali

### 1. Missioni famiglia
- Recupero navicella: menu con navicella a pezzi, ricostruzione visiva per ogni componente trovato.
- Estinzione debito pianeta: oggetti venduti al Market generano crediti per abbassare il debito.
- Cibo ed energia: frutta e ingredienti diventano cibo; cristalli e batterie diventano energia.
- Classificazione esseri viventi: mostri scannerizzati e studiati dai Pikmin spia aggiornano il bestiario.

### 2. Radar + scanner camera
Il radar trova oggetti, ingredienti, Pikmin selvatici, mostri, pezzi navicella e anomalie.
Il bottone Scansiona area apre la fotocamera/energy scanner già presente e deve salvare il ritrovamento nel sistema gioco.

### 3. Mappa geolocalizzata e biomi
La mappa non è solo drop: diventa mappa tattica con posizione utente, villaggi, raggio d'azione, mostri, oggetti, bioma corrente e spedizioni.
Ogni zona ha un bioma con materiali e creature probabili.

### 4. Villaggi
Ogni utente parte con un villaggio. Il Centro di Controllo aumenta il numero di villaggi gestibili: Lv1 = 1, Lv3 = 2, Lv5 = 3.
Un villaggio è gestibile solo se l'utente è dentro il raggio. Il comando remoto richiede Centro di Controllo Remoto.

### 5. Pikmin specializzati
Ogni Pikmin ha tipo, livello, esperienza, specializzazione, mansioni, bonus e affinità bioma.
Specializzazioni: raccolta, ricerca, scouting, spionaggio, trasporto, combattimento.

### 6. Market e scambi
Il Market vende oggetti e materiali per crediti. Deve supportare scambio oggetti tra utenti della famiglia e donazioni alla missione comune.

### 7. Archivi e asset editor
Mantenere archivio Pikmin, archivio mostri, schede consultabili e sistemi di caricamento/modifica asset. Non vanno rimossi.

## Pulizia controllata
Da rimuovere solo dopo verifica import/build:
- codice demo non collegato alla navigazione;
- vecchie schermate non raggiungibili;
- asset duplicati non referenziati;
- dipendenze non usate realmente.

Da NON rimuovere:
- Radar;
- CameraCapture/EnergyScanner;
- Archivio Pikmin;
- Bestiario/Nemici;
- AssetLibraryEditor, PikminEditor, MonstersEditor;
- Villaggio, mappa, missioni, market, inventario, navicella, spedizioni.

## Modifiche già applicate in questa patch
- Fix Rules of Hooks in `src/routes/villaggio.tsx` spostando `placingLockRef` prima dei return condizionali.
- Aggiornato branding PageShell da 007-Pikmin a Secret Pikmin.
- Aggiunti dati strutturati in `src/data/secretPikminWorld.ts`.
- Aggiunto pannello visione/specializzazioni/biomi in `src/components/SecretPikminVisionPanel.tsx`.
- Missioni ora mostrano missioni core e specializzazioni Pikmin.
- Radar ora espone Scansiona area e target scanner.
- Mappa ora è Mappa tattica con biomi geolocalizzati.
