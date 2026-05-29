# Demo Lorenzo — Checklist guidata

**Progetto:** Secret Pikmin · Fase 7  
**Per:** Francesco (demo) → Lorenzo (showcase)  
**Durata stimata:** 15–20 minuti

---

## Prima di iniziare

1. Apri l'app (locale o deploy).
2. Nella schermata login, scegli **Demo giocabile**:
   - **Francesco** per guidare la demo come Comandante.
   - **Lorenzo** per far provare al figlio la stessa sessione dal lato agente.
3. Compare il banner **Modalità demo** in basso: usa i link rapidi se serve.

---

## 1. Base / Command Center (`/base`)

| Cosa fare | Cosa dovrebbe succedere |
|-----------|-------------------------|
| Apri **Home** dalla nav | Pannello bridge con missioni attive, XP, stato navicella |
| Tocca una missione o il link missioni | Navigazione fluida, card missione con barra progresso |
| Attiva/disattiva audio (icona in alto a destra) | Suono UI senza errori |

**Mostra a Lorenzo:** "Questa è la nostra base — da qui vediamo tutto quello che succede nel gioco."

---

## 2. Villaggio (`/villaggio`)

| Cosa fare | Cosa dovrebbe succedere |
|-----------|-------------------------|
| Entra nel **Villaggio** | Diorama isometrico con edifici cliccabili |
| Tocca **Centro Comando** | Vai a `/base` |
| Tocca **Hangar / Mercato / Radar** (se presenti) | Modal o navigazione verso la sezione giusta |
| Su mobile: tap su edificio | Tooltip breve, nessun blocco scroll |

**Mostra a Lorenzo:** "Il villaggio è la mappa — ogni edificio è una stanza del gioco."

---

## 3. Scanner / Radar (`/radar`)

| Cosa fare | Cosa dovrebbe succedere |
|-----------|-------------------------|
| Apri **Radar** | Mappa con segnali / area scansione |
| Avvia una **scansione** | Animazione + particelle (FX pickup/discovery) |
| Controlla inventario dopo scan | Nuovo oggetto o messaggio di scoperta |

**Mostra a Lorenzo:** "Qui cerchiamo tesori e pezzi della navicella nel mondo reale."

---

## 4. Mercato (`/mercato`)

| Cosa fare | Cosa dovrebbe succedere |
|-----------|-------------------------|
| Tab **Ingredienti** | Card gioco con rarità, emoji, prezzo in monete |
| Compra un ingrediente (es. Miele dorato) | Monete scalate, toast successo, FX pickup |
| Tab **Ricette** | Card ricetta con lucchetto / sbloccata |
| Sblocca una ricetta | FX mission_complete, badge "Sbloccata" |
| Scorri **Vendi inventario** | Card market uniformi, pulsante Vendi |
| Vendi un oggetto | Crediti/debito aggiornato, FX market_sell |

**Mostra a Lorenzo:** "Guadagniamo monete vendendo e le spendiamo per potenziare la squadra."

---

## 5. Trasformazioni (nel Mercato o laboratorio)

| Cosa fare | Cosa dovrebbe succedere |
|-----------|-------------------------|
| Trova **Trasformazione risorse** | 4 card (cibo, energia, materiali, crediti) |
| Tocca una trasformazione con oggetti compatibili | Flash verde, messaggio esito, inventario aggiornato |
| Prova con inventario vuoto per quel tipo | Pulsante disabilitato o messaggio errore |

**Mostra a Lorenzo:** "Possiamo convertire quello che troviamo in energia per la navicella."

---

## 6. Scambi famiglia (Mercato → Scambio P2P)

| Cosa fare | Cosa dovrebbe succedere |
|-----------|-------------------------|
| Apri sezione **Scambio Famiglia** | Card Francesco ↔ Lorenzo in alto |
| Come **Lorenzo**: vedi proposta in arrivo (miele ↔ batteria) | Badge notifica campana |
| **Accetta** o **Rifiuta** | Toast, inventario aggiornato, storico |
| Come **Francesco**: crea nuova proposta | Seleziona card oggetto, quantità, messaggio, invia |

**Mostra a Lorenzo:** "Papà e figlio possono scambiarsi oggetti come in un vero gioco cooperativo."

---

## 7. Missioni (`/missioni`)

| Cosa fare | Cosa dovrebbe succedere |
|-----------|-------------------------|
| Lista missioni | Card con icona core, progress bar, stato |
| Aggiorna progresso (se disponibile) | UI si refresha subito dopo salvataggio |
| Completa una missione (se possibile) | XP / FX mission_complete |

---

## 8. Chat (`/chat`)

| Cosa fare | Cosa dovrebbe succedere |
|-----------|-------------------------|
| Canale **Famiglia** | Messaggi demo pre-caricati |
| Canale **Missioni** / **Radar** | Filtro corretto per canale |
| Invia un messaggio | Appare in lista, suono/FX opzionale |

**Mostra a Lorenzo:** "Parliamo come agenti segreti — ogni canale ha un tema diverso."

---

## 9. Navicella / Hangar

| Cosa fare | Cosa dovrebbe succedere |
|-----------|-------------------------|
| Da villaggio o base, apri **Hangar** | Pezzi navicella con progresso (demo: 2/N raccolti) |
| Leggi stato riparazione | Label progresso coerente con seed demo |

---

## Uscire dalla demo

- Nel banner demo, tap **X** → torna al login e cancella sessione demo.
- Oppure chiudi tab / ricarica e scegli di nuovo Francesco o Lorenzo.

---

## Problemi noti (demo)

- Monete ingredienti/ricette in demo sono **locali** (non Supabase): il saldo resetta al reload tab mercato.
- Login Supabase reale e demo **non** vanno mescolati nella stessa sessione.
- Phaser RTS (`/villaggio/phaser`) resta legacy fullscreen — opzionale per la demo.

---

## Cosa dire a Lorenzo (30 secondi)

> "Abbiamo fatto un gioco segreto papà-figlio: esploriamo col radar, vendiamo al mercato, ripariamo la navicella e ci scambiamo oggetti. Tu sei l'agente Lorenzo — prova a comprare qualcosa e accetta lo scambio che ti mando!"
