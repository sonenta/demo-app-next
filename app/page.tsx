"use client";

import { useEffect } from "react";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/sonenta";

/**
 * Root `/demos/next/` — no content of its own. A static export can't redirect
 * at the edge, so we pick the visitor's preferred locale client-side and
 * replace into the localized route. `<noscript>` keeps it reachable too.
 */
const BASE = "/demos/next";

function pickLocale(): string {
  if (typeof navigator === "undefined") return DEFAULT_LOCALE;
  for (const lang of navigator.languages ?? [navigator.language]) {
    const code = lang.slice(0, 2).toLowerCase();
    if ((LOCALES as readonly string[]).includes(code)) return code;
  }
  return DEFAULT_LOCALE;
}

export default function RootRedirect() {
  useEffect(() => {
    window.location.replace(`${BASE}/${pickLocale()}/`);
  }, []);

  return (
    <main className="flex-1 grid place-items-center text-ink-300 text-sm">
      <p>
        Redirecting…{" "}
        <a href={`${BASE}/${DEFAULT_LOCALE}/`} className="text-emerald-400">
          continue
        </a>
        <noscript>
          {" "}
          — <a href={`${BASE}/${DEFAULT_LOCALE}/`}>enter the demo</a>
        </noscript>
      </p>
    </main>
  );
}
