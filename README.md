# Sonenta Next.js demo

Live showcase + dogfooding app for [`@sonenta/next`](https://www.npmjs.com/package/@sonenta/next) — the official **Next.js App Router** binding for [Sonenta](https://sonenta.com), the adaptive content layer.

Live at **https://sonenta.com/demos/next/** · sibling of the [React](https://sonenta.com/demos/react/), Vue and Svelte demos · MIT.

## What it shows

- **Server Components render real translations at build.** Each locale (`/en`, `/fr`, `/es`) is a statically pre-rendered route. The `[locale]` layout calls `getBundles()` and the page calls `getTranslations()` from `@sonenta/next/server`, fetching the published CDN bundles for the `demo-public` project — so the HTML ships translated (SEO-perfect, no loading flash).
- **The client hydrates from the same snapshot.** `app/[locale]/providers.tsx` mounts `<SonentaProvider>` from `@sonenta/next/client` with the server's `initialBundles` — offline-first, no client refetch.
- **Runtime missing-key handler.** The trigger card calls `t()` on keys that don't exist in any bundle; the SDK serves a fallback and reports the miss through the provider transport, which streams into the live telemetry panel.
- **Language switch = navigation.** Each locale is its own server-rendered static page, so the `LangSwitcher` links between routes rather than swapping strings client-side — that is the `@sonenta/next` story.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript · `@sonenta/next` + `@sonenta/react-i18next`. Dark + emerald design system, system font stacks (no Google Fonts), canonical Sonenta "S" mark.

## Develop

```sh
npm install
npm run dev          # http://localhost:3000/demos/next/en/
npm run typecheck
npm run build        # static export → out/  (output: 'export', basePath /demos/next)
```

## Deploy

Fully static export, rsynced to the sonenta box (parity with the other demos — no Node process):

```sh
./scripts/deploy.sh           # build + rsync out/ → sonenta@sonenta-web:/data/clients/sonenta/sonenta.com/demos/next/
./scripts/deploy.sh --dry-run
```

nginx serves `/demos/next/` as a multi-page static site (`try_files $uri $uri/ $uri.html`). Verify the live commit with `curl https://sonenta.com/demos/next/version.txt`.

## Config

The demo reads the public `demo-public` project from the CDN, so no API key is needed to run it (see `.env.example`). Translation content is managed in Sonenta and shipped via the CDN — the demo never hardcodes copy.
