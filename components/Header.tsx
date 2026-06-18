"use client";

import { useTranslation } from "@sonenta/next/client";
import { Brand } from "./Brand";
import { LangSwitcher } from "./LangSwitcher";
import type { AppLocale } from "@/lib/sonenta";

export function Header({ locale }: { locale: AppLocale }) {
  const { t } = useTranslation();
  return (
    <header className="sticky top-0 z-40 border-b border-ink-800/70 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between gap-6">
        <Brand size={24} />
        <nav className="hidden md:flex items-center gap-7 text-sm text-ink-300">
          <a href="#features" className="hover:text-ink-50 transition-colors">
            {t("nav.product")}
          </a>
          <a href="#pricing" className="hover:text-ink-50 transition-colors">
            {t("nav.pricing")}
          </a>
          <a
            href="https://sonenta.com/docs"
            className="hover:text-ink-50 transition-colors"
          >
            {t("nav.docs")}
          </a>
        </nav>
        <LangSwitcher locale={locale} />
      </div>
    </header>
  );
}
