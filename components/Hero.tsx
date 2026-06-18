import type { T } from "@/lib/sonenta";

/**
 * Server Component — the text is resolved at BUILD by `getTranslations`, so the
 * HTML ships translated (no loading flash, SEO-perfect), then the client
 * hydrates the same engine. The "Rendered on the server" badge makes the point.
 */
export function Hero({ t }: { t: T }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24">
      <p className="mono text-[11px] uppercase tracking-[0.22em] text-emerald-400 inline-flex items-center gap-2">
        <span className="h-1 w-1 rounded-full bg-emerald-400" />
        {t("hero.eyebrow")}
      </p>
      <h1 className="mt-4 text-4xl md:text-6xl font-semibold tracking-[-0.03em] text-ink-50 leading-[1.05]">
        <span className="block">{t("hero.title.line1")}</span>
        <span className="block text-emerald-400">{t("hero.title.line2")}</span>
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-ink-300 leading-relaxed">
        {t("hero.lede")}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href="https://sonenta.com"
          className="inline-flex items-center rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-ink-950 hover:bg-emerald-400 transition-colors"
        >
          {t("hero.cta.primary")}
        </a>
        <a
          href="https://sonenta.com/docs"
          className="inline-flex items-center rounded-lg border border-ink-800 px-5 py-2.5 text-sm font-medium text-ink-100 hover:border-ink-700 transition-colors"
        >
          {t("hero.cta.secondary")}
        </a>
        <span className="mono inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.16em] text-emerald-300">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Rendered on the server
        </span>
      </div>
      <p className="mt-4 mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
        {t("hero.note")}
      </p>
    </section>
  );
}
