# Secret Pikmin — Pulizia e fasi principali

## Fase 1 completata in questa patch
1. Fix villaggio: `placingLockRef` non viola più le Rules of Hooks.
2. Branding aggiornato a Secret Pikmin.
3. Missioni rese coerenti con i quattro macro-obiettivi.
4. Radar ampliato concettualmente a scanner area/fotocamera.
5. Mappa rinominata e impostata come mappa tattica con biomi.
6. Sistema specializzazioni Pikmin formalizzato in codice.

## Fase 2 da implementare dopo verifica build locale
- Collegare `GEO_BIOME_RULES` al punto GPS reale.
- Salvare bioma corrente in database su basi/villaggi.
- Aggiungere tabella Pikmin individuali con specializzazione ed esperienza.
- Aggiornare Market per debito pianeta e scambi familiari.
- Collegare scanner ai ritrovamenti reali in inventario/bestiario.

## File da mantenere
- `src/components/Radar.tsx`
- `src/components/EnergyScanner.tsx`
- `src/components/CameraCapture.tsx`
- `src/routes/archivio.tsx`
- `src/routes/nemici.tsx`
- `src/components/admin/AssetLibraryEditor.tsx`
- `src/components/admin/PikminEditor.tsx`
- `src/components/admin/MonstersEditor.tsx`

## Pulizia sicura consigliata
Prima di cancellare file, eseguire:

```bash
npm install
npm run build
```

Poi rimuovere solo file non importati e non collegati. Non eliminare editor asset, archivio, radar, scanner, nemici, mappa, missioni e villaggio.
