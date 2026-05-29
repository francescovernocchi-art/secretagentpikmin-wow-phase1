// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
// @cloudflare/vite-plugin builds from this — wrangler.jsonc main alone is insufficient.
// Vercel injects env before `npm run build`; NITRO_PRESET è il segnale più affidabile.
const isVercelBuild =
  process.env.NITRO_PRESET === "vercel" ||
  process.env.VERCEL === "1" ||
  Boolean(process.env.VERCEL_ENV);

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  // Layout Nitro atteso da Vercel (Lovable di default usa dist/server → 404).
  nitro: isVercelBuild
    ? {
        preset: "vercel",
        output: {
          dir: "dist",
          publicDir: "dist/client",
          serverDir: "dist/functions/__server.func",
        },
      }
    : undefined,
});
