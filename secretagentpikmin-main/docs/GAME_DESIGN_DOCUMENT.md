# Secret Pikmin — Missione Famiglia
## Game Design Document (Fase 1)

### Identità
- **Titolo:** Secret Pikmin
- **Sottotitolo:** Missione Famiglia
- **Comandanti:** Francesco e Lorenzo (nessuna classe utente)
- **Regola:** le specializzazioni appartengono ai Pikmin, non ai giocatori

### Scopo
Collaborare per salvare il pianeta originario attraverso 4 missioni principali:
1. Ricostruzione Navicella (6 pezzi)
2. Estinzione Debito Planetario (Market)
3. Cibo ed Energia (barre pianeta)
4. Bestiario e Classificazione

### Menu principale (Fase 1)
Home · Villaggio · Mappa · Pikmin · Missioni · Bestiario · Market · Chat Segreta · Profilo

Collegamenti secondari (menu Altro): Radar, Spedizioni, Navicella, Inventario, Lab, Ricette, Premi, Ricordi, Admin, Atelier, Edifici, Scambi.

### Sistemi Fase 1

#### Centro Comando (Home)
Stato pianeta, progresso navicella, spedizioni, ritrovamenti, famiglia online, accesso rapido radar/mappa/missioni.

#### Villaggio
Diorama isometrico + canvas Phaser esistente. Edifici base: Centro Controllo, Magazzino, Accademia, Laboratorio, Mercato, Hangar.

#### Mappa + Biomi
8 biomi geolocalizzati con risorse, creature, eventi, bonus/malus. Raggio d'azione 150m.

#### Radar + Scanner
EnergyScanner + fotocamera. Ritrovamenti coerenti col bioma → inventario / bestiario / squadra / navicella.

#### Pikmin
9 tipi, 7 specializzazioni, squadra mock in `MOCK_PIKMIN_SQUAD`. Archivio specie Supabase in `/archivio`.

#### Market
Mercato Galattico (debito) + Scambio Famiglia (mock + `/villaggio/scambi`).

#### Chat
Canali: Famiglia, Missioni, Villaggio, Comandante. Messaggi rapidi integrati.

### Stack tecnico
TanStack Start/Router, React 19, Supabase, Leaflet, Phaser 4, Tailwind 4.

### Dati centrali
- `src/types/secretPikmin.ts`
- `src/data/secretPikminWorld.ts`

### Componenti gioco Fase 1
- `src/components/game/CommandCenterHome.tsx`
- `src/components/game/VillageDiorama.tsx`
- `src/components/game/PikminSpecializationPanel.tsx`
- `src/components/game/MissionProgressPanel.tsx`
- `src/components/game/BiomeMapPanel.tsx`
- `src/components/game/RadarScannerPanel.tsx`
- `src/components/game/FamilyChatPanel.tsx`
- `src/components/game/MarketPanel.tsx`

### Non rimosso (vincoli)
Radar, scanner, archivio Pikmin, bestiario, asset manager, admin editors, Supabase, router, villaggio Phaser, mappa Leaflet.
