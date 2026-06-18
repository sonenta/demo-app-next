"use client";

import Link from "next/link";
import { useTranslation } from "@sonenta/next/client";
import { LOCALES, type AppLocale } from "@/lib/sonenta";

/**
 * Each locale is its own statically-exported route, so switching language is a
 * navigation (the next page is pre-rendered server-side in that locale), not a
 * client-side string swap — that IS the @sonenta/next story.
 */
export function LangSwitcher({ locale }: { locale: AppLocale }) {
  const { t } = useTranslation();
  return (
    <div
      role="group"
      aria-label={t("lang.switcher.label")}
      className="inline-flex items-center rounded-full border border-ink-700 bg-ink-900/60 p-0.5 text-xs font-medium"
    >
      {LOCALES.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={`/${code}`}
            aria-current={active ? "page" : undefined}
            aria-label={t(`lang.${code}`)}
            lang={code}
            className={[
              "px-3 py-1 rounded-full transition-colors uppercase tracking-wider",
              active ? "bg-ink-50 text-ink-950" : "text-ink-300 hover:text-ink-50",
            ].join(" ")}
          >
            {code}
          </Link>
        );
      })}
    </div>
  );
}
