import type {
  Bundles,
  Locale,
  Namespace,
  NextSonentaConfig,
} from "@sonenta/next/server";

/** The locales this demo pre-renders (static export → one route each). */
export const LOCALES = ["en", "fr", "es"] as const;
export type AppLocale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: AppLocale = "en";

/** Namespaces fetched from the CDN. The demo content lives in `common`. */
export const NAMESPACES: Namespace[] = ["common"];

/** The public demo-public project — same content the React/Vue/Svelte demos use. */
export const PROJECT_UUID = "06a07109-3e3c-7bd7-8000-95368a87bd2e";

/**
 * Server config for `@sonenta/next/server`. Used at BUILD time (static export)
 * to fetch the published CDN bundles for each locale. The CDN is public so no
 * token is required for the read; `SONENTA_API_KEY` is only needed if you wire
 * the real `missing:write` POST transport (the demo overrides it client-side).
 */
export const serverConfig: NextSonentaConfig = {
  token: process.env.SONENTA_API_KEY ?? "",
  projectUuid: PROJECT_UUID,
  defaultLocale: DEFAULT_LOCALE,
  revalidate: 3600,
};

export type { Bundles, Locale };

/** Minimal translator signature shared by the server-rendered sections. */
export type T = (key: string, options?: Record<string, unknown>) => string;
