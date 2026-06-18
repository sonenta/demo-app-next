"use client";

import { useEffect } from "react";
import { SonentaProvider } from "@sonenta/next/client";
import { missingStore } from "@/lib/missing-store";
import {
  PROJECT_UUID,
  NAMESPACES,
  type AppLocale,
  type Bundles,
} from "@/lib/sonenta";

/**
 * Client boundary (`"use client"` above). `initialBundles` gives the instant
 * offline-first first paint; because this is a Client Component, the provider's
 * own `start()` runs on mount and does the background CDN fetch, which arms the
 * missing-key handler (`_attempted`) so reported fallbacks stream into the live
 * telemetry store via the `send` transport below.
 *
 * (When @sonenta/next ships its `/client` `use client` banner — 1.0.1 — this
 * wrapper becomes optional; SonentaProvider can be imported straight into the
 * App Router.)
 */
export function Providers({
  locale,
  initialBundles,
  children,
}: {
  locale: AppLocale;
  initialBundles: Bundles;
  children: React.ReactNode;
}) {
  // Static export shares one root <html>; keep its lang in sync with the route.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <SonentaProvider
      token={process.env.NEXT_PUBLIC_SONENTA_API_KEY ?? ""}
      projectUuid={PROJECT_UUID}
      defaultLocale={locale}
      fallbackLng="en"
      namespaces={NAMESPACES}
      initialBundles={initialBundles}
      // Explicit CDN target for the client's own start() fetch (the lever that
      // arms the missing-key handler); env=prod → cdnBase/p/<project>/main/latest.
      cdnBase="https://cdn.sonenta.com"
      version="main"
      env="prod"
      missingHandler="send"
      flushIntervalMs={4000}
      transport={(batch) => missingStore.pushBatch(batch)}
    >
      {children}
    </SonentaProvider>
  );
}
