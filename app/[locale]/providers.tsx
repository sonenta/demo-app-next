"use client";

import { useEffect } from "react";
import { SonentaProvider, useTranslation } from "@sonenta/next/client";
import { missingStore } from "@/lib/missing-store";
import {
  PROJECT_UUID,
  NAMESPACES,
  type AppLocale,
  type Bundles,
} from "@/lib/sonenta";

/**
 * Does the normal client CDN fetch once on mount. `initialBundles` already gave
 * the instant offline-first first paint, but a snapshot-only client never opens
 * the missing-key handler's gate (the engine only reports once `_attempted` is
 * set, which a real fetch — start()/reload() — does; per @sonenta/i18n-core).
 * `reload()` arms the handler AND refreshes the bundles in the background.
 */
function ArmClientFetch() {
  const { i18n } = useTranslation();
  useEffect(() => {
    void i18n.reload();
  }, [i18n]);
  return null;
}

/**
 * Client boundary. Hydrates the shared `@sonenta/react-i18next` engine from the
 * server's `initialBundles` snapshot — offline-first, no second round-trip
 * (#757). The missing-key handler is wired to `send` with a transport that
 * feeds the live telemetry store instead of POSTing, so the showcase visualises
 * every fallback in place.
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
      missingHandler="send"
      flushIntervalMs={4000}
      transport={(batch) => missingStore.pushBatch(batch)}
    >
      <ArmClientFetch />
      {children}
    </SonentaProvider>
  );
}
