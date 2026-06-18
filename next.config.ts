import type { NextConfig } from "next";

/**
 * Served as a fully STATIC export under https://sonenta.com/demos/next/
 * (flat docroot, rsync — parity with the React/Vue/Svelte demos; no Node
 * process on the box). Each locale (en/fr/es) is pre-rendered at build by a
 * Server Component that fetches the real CDN bundles via @sonenta/next/server
 * (getBundles/getTranslations) — the SDK's App-Router USP — then the client
 * provider hydrates from that snapshot with no refetch.
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/demos/next",
  trailingSlash: true,
  images: { unoptimized: true },
  // Pin the workspace root to this app (sibling demos each ship their own
  // lockfile, which would otherwise make Next infer the monorepo parent).
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
