# Deploy Vercel — TanStack Start + Nitro

L'app **non è una SPA Vite statica**: non esiste `dist/client/index.html` per servire `/`.
Nitro genera `dist/config.json` con routing SSR verso la function `__server`.

## Struttura output (dopo `NITRO_PRESET=vercel npm run build`)

```
dist/
  config.json          ← routing Vercel (filesystem + /__server)
  nitro.json
  client/              ← asset statici (JS/CSS), non homepage HTML
  functions/
    __server.func/     ← SSR TanStack Start (route "/")
      index.mjs
      .vc-config.json
```

`config.json` (estratto):

```json
{
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/__server" }
  ]
}
```

**Non usare** rewrite SPA `/(.*) → /index.html` (rompe Nitro SSR).

## Repo collegato

- GitHub: `francescovernocchi-art/secretagentpikmin-wow-phase1`
- App: cartella `secretagentpikmin-main/`
- Route `/`: `src/routes/index.tsx` (`createFileRoute("/")`)

## Progetti Vercel attivi (stesso repo)

Il repo alimenta **due** progetti Vercel:

| Progetto Vercel | Uso consigliato |
|-----------------|-----------------|
| `secretagentpikmin-main` | **Production principale** |
| `secret-pikmin-missione-famiglia` | Legacy / duplicato (stesso repo) |

Il dominio `secretagentpikmin-wow-phase1.vercel.app` (homepage GitHub) spesso **non** è collegato a un deploy attivo → **404**.

L'ultimo deploy funzionante (commit su `main`) espone URL tipo:
`https://secretagentpikmin-main-<hash>.vercel.app` (può essere 401 se **Deployment Protection** è attiva).

## Impostazioni dashboard Vercel

### Opzione A (consigliata) — Root Directory = `secretagentpikmin-main`

Usa `secretagentpikmin-main/vercel.json`.

| Campo | Valore |
|-------|--------|
| **Root Directory** | `secretagentpikmin-main` |
| **Install Command** | `npm ci` |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Framework Preset** | Other (o lasciare auto; **non** “Vite” statico) |

Variabili d'ambiente (Production + Preview):

- `NITRO_PRESET` = `vercel`
- `NODE_OPTIONS` = `--max-old-space-size=8192`
- `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (se serve login)

Poi in **Domains**: assegna `secretagentpikmin-wow-phase1.vercel.app` (o il dominio desiderato) a **questo** progetto, branch `main`.

### Opzione B — Root Directory = repository root (`.`)

Usa `vercel.json` nella root del repo.

| Campo | Valore |
|-------|--------|
| **Root Directory** | `.` (vuoto / root) |
| **Install Command** | `cd secretagentpikmin-main && npm ci` |
| **Build Command** | `cd secretagentpikmin-main && npm ci && npm run build` |
| **Output Directory** | `secretagentpikmin-main/dist` |

Stesse variabili d'ambiente.

## Errori comuni → 404 su `/`

| Errore | Effetto |
|--------|---------|
| Output = `dist/client` | Solo statici, nessun SSR → 404 su `/` |
| Output = `secretagentpikmin-main/dist` con Root = `secretagentpikmin-main` | Path doppio errato → 404 |
| Build senza `NITRO_PRESET=vercel` | Layout server sbagliato |
| Dominio su progetto Vercel sbagliato / mai deployato | 404 Vercel generico |
| Rewrite SPA su `index.html` | Conflitto con Nitro |

## Verifica locale

```bash
cd secretagentpikmin-main
npm ci
NITRO_PRESET=vercel NODE_OPTIONS=--max-old-space-size=8192 npm run build
# Controllare: dist/config.json, dist/functions/__server.func/index.mjs
```
