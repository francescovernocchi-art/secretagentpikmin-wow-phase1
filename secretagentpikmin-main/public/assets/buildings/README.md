# Sprite edifici (public)

Struttura prevista dal Diorama Engine V2.2. **Non committare asset grafici qui** — aggiungerli manualmente.

## Convenzione path

```
public/assets/buildings/{edificio}/
  lv1.webp
  lv2.webp
  lv3.webp
  lv4.webp
  lv5.webp
  construction.webp
  destroyed.webp
  locked.webp
  buildable.webp
```

Esempio laboratorio:

```
public/assets/buildings/laboratorio/
  lv1.webp
  lv2.webp
  lv3.webp
  construction.webp
  destroyed.webp
```

## Hangar evolutivo

```
public/assets/buildings/hangar/
  hangar_lv1.webp
  hangar_lv2.webp
  hangar_lv3.webp
  hangar_lv4.webp
  hangar_complete.webp
```

Il motore seleziona lo sprite in base alla **percentuale riparazione navicella** (solo visualizzazione).

## Riferimento layout

Configurazione in `src/data/diorama-layouts/bosco-lorenzo-v1.json` — campo `assets.basePath` per edificio e `hangarAssets` per hangar.
