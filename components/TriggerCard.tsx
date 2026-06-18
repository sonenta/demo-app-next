"use client";

import { useTranslation } from "@sonenta/next/client";

/**
 * Four keys intentionally absent from every locale bundle. Calling `t()` on one
 * makes the SDK serve a fallback AND report the miss through the provider's
 * transport → it lands in the live telemetry panel.
 */
const TRIGGERS = [
  { key: "legal.gdpr.long_clause", labelKey: "live.trigger.button.legal" },
  { key: "checkout.tax.tooltip", labelKey: "live.trigger.button.checkout" },
  { key: "error.payment.declined", labelKey: "live.trigger.button.error" },
  { key: "landing.coming_soon", labelKey: "live.trigger.button.coming" },
] as const;

export function TriggerCard() {
  const { t } = useTranslation();

  return (
    <aside className="rounded-2xl border border-ink-800 bg-ink-900 p-6">
      <div className="flex items-center gap-2 mb-1.5">
        <svg
          aria-hidden
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="text-emerald-400"
        >
          <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" strokeLinejoin="round" />
        </svg>
        <h3 className="text-[1.05rem] font-semibold tracking-tight text-ink-50">
          {t("live.trigger.title")}
        </h3>
      </div>
      <p className="text-sm text-ink-300 mb-4">{t("live.trigger.subtitle")}</p>

      <div className="grid gap-2.5">
        {TRIGGERS.map((trig) => (
          <button
            key={trig.key}
            type="button"
            onClick={() => {
              t(trig.key);
            }}
            className="group flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-ink-800 bg-ink-950/40 hover:border-ink-700 hover:bg-ink-900 transition-colors text-left"
          >
            <span className="flex flex-col">
              <span className="text-sm font-medium text-ink-100">
                {t(trig.labelKey)}
              </span>
              <code className="mono text-[11px] text-ink-300 mt-0.5">
                t(&quot;{trig.key}&quot;)
              </code>
            </span>
            <span
              aria-hidden
              className="mono text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-sm bg-amber-soft text-amber-bright group-hover:bg-amber group-hover:text-ink-50 transition-colors"
            >
              fire
            </span>
          </button>
        ))}
      </div>
    </aside>
  );
}
