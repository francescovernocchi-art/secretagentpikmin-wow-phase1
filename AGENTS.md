# AGENTS.md

Guidance for AI agents working in this repository.

## Repository layout

The product lives in `secretagentpikmin-main/` (Secret Pikmin: Missione Famiglia). The repo root only contains a short README.

## Cursor Cloud specific instructions

### Services

| Service | Required for dev | Notes |
|---------|------------------|-------|
| Vite dev server (`npm run dev`) | Yes | Single process: TanStack Start SSR + embedded Cloudflare/miniflare runtime via `@cloudflare/vite-plugin`. No separate worker or docker-compose. |
| Hosted Supabase (cloud) | Optional for demo E2E | Credentials are in `secretagentpikmin-main/.env`. Needed for real auth/persistence; not run locally. |
| Demo mode (localStorage) | Recommended for E2E | No external deps; use **Demo giocabile → Francesco** on `/`. See `secretagentpikmin-main/docs/DEMO_LORENZO_CHECKLIST.md`. |

### Commands (run from `secretagentpikmin-main/`)

- **Dev:** `npm run dev` — default port **5173** (`--host 0.0.0.0` if binding externally).
- **Build:** `npm run build`
- **Preview:** `npm run preview` (after build)
- **Lint:** `npm run lint` — currently reports many pre-existing Prettier/format issues; build still succeeds.

There is no `test` script in `package.json`.

### Package manager

Use **npm** (`package-lock.json`). Node **22+** works. A `bun.lock` also exists but npm is the documented path.

### Dev server startup

Start in a tmux session so it survives backgrounding:

```bash
cd secretagentpikmin-main && npm run dev -- --host 0.0.0.0 --port 5173
```

On first load, the app may show a connection/splash screen — click **Entra nella base** to reach the login page with demo buttons.

### Demo hello-world flow

1. Open `http://localhost:5173/`
2. Click **Entra nella base** (if shown)
3. Under **Demo giocabile**, choose **Francesco** (Comandante)
4. Navigate to `/mercato` and confirm ingredient cards load (e.g. Miele dorato, Cristallo verde)

### Optional env vars (not required for demo)

- `SUPABASE_SERVICE_ROLE_KEY` — admin/family member creation server functions
- `LOVABLE_API_KEY` — AI lab; falls back to static responses if unset

### Gotchas

- Do not add duplicate Vite plugins listed as forbidden in `vite.config.ts` comments (TanStack Start config is via `@lovable.dev/vite-tanstack-config`).
- Camera/geolocation features need a real browser with permissions; demo market/village flows work without them.
- Lint failures are mostly formatting debt and do not block `npm run build`.
