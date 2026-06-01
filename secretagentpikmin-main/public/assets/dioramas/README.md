# Asset diorama (public)

Carica qui gli sfondi e gli sprite del villaggio.

## Sfondi

```
public/assets/dioramas/bosco-lorenzo-v1.webp   ← Bosco Lorenzo V1 (production)
public/assets/dioramas/colonia-bosco-v1.webp
public/assets/dioramas/test-layout.webp        ← demo validazione V2.1
…
```

Path usato nel layout: `/assets/dioramas/colonia-bosco-v1.webp`

## Sprite edifici (opzionale)

```
public/assets/dioramas/edifici/accademia.webp
public/assets/dioramas/edifici/mercato.webp
…
```

Referenziati nel campo `image` di ogni edificio in `src/data/dioramaLayouts.ts` o nel JSON esportato dall'editor.

## Formato consigliato

- WebP o PNG
- Aspect ratio diorama: **390×480** (o multipli)
- Navicella in alto, piazza al centro, edifici sul piatto isometrico
