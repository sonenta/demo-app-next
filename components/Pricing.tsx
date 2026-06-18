import type { T } from "@/lib/sonenta";

const TIERS = ["free", "hobby", "pro", "team"] as const;

export function Pricing({ t }: { t: T }) {
  return (
    <section
      id="pricing"
      className="mx-auto max-w-6xl px-6 py-20 border-t border-ink-800"
    >
      <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-ink-50">
        {t("pricing.title")}
      </h2>
      <p className="mt-3 max-w-2xl text-ink-300">{t("pricing.subtitle")}</p>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TIERS.map((tier) => (
          <div
            key={tier}
            className="rounded-2xl border border-ink-800 bg-ink-900 p-6 flex flex-col"
          >
            <h3 className="mono text-[11px] uppercase tracking-[0.18em] text-emerald-400">
              {t(`pricing.${tier}.name`)}
            </h3>
            <p className="mt-3 text-3xl font-semibold text-ink-50">
              {t(`pricing.${tier}.price`)}
              <span className="text-sm font-normal text-ink-300">
                {" "}
                {t("pricing.month")}
              </span>
            </p>
            <ul className="mt-4 space-y-1 text-sm text-ink-300">
              <li>{t(`pricing.${tier}.line1`)}</li>
              <li>{t(`pricing.${tier}.line2`)}</li>
            </ul>
            <span className="mt-6 inline-flex items-center justify-center rounded-lg border border-ink-800 px-4 py-2 text-sm font-medium text-ink-100">
              {t("pricing.cta")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
