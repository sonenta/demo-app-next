import type { T } from "@/lib/sonenta";

const ITEMS = ["one", "two", "three"] as const;

export function Features({ t }: { t: T }) {
  return (
    <section
      id="features"
      className="mx-auto max-w-6xl px-6 py-20 border-t border-ink-800"
    >
      <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-ink-50 max-w-2xl">
        {t("features.title")}
      </h2>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {ITEMS.map((k) => (
          <div
            key={k}
            className="rounded-2xl border border-ink-800 bg-ink-900 p-6"
          >
            <h3 className="text-lg font-semibold text-ink-50">
              {t(`features.${k}.title`)}
            </h3>
            <p className="mt-2 text-sm text-ink-300 leading-relaxed">
              {t(`features.${k}.body`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
