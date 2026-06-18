import type { T } from "@/lib/sonenta";

const INSTALL = `npm install @sonenta/next i18next react-i18next`;

const SERVER = `// app/[locale]/page.tsx — Server Component
import { getTranslations } from "@sonenta/next/server";

export default async function Page({ params }) {
  const { locale } = await params;
  const { t } = await getTranslations(config, locale);
  return <h1>{t("hero.title.line1")}</h1>; // resolved at build
}`;

const CLIENT = `// app/[locale]/providers.tsx — Client Component
"use client";
import { SonentaProvider } from "@sonenta/next/client";

export function Providers({ locale, initialBundles, children }) {
  // hydrates from the server snapshot — no client refetch
  return (
    <SonentaProvider defaultLocale={locale} initialBundles={initialBundles}>
      {children}
    </SonentaProvider>
  );
}`;

export function InstallSnippet({ t }: { t: T }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20 border-t border-ink-800">
      <header className="max-w-2xl mb-8">
        <p className="mono text-[11px] uppercase tracking-[0.22em] text-emerald-400 inline-flex items-center gap-2">
          <span className="h-1 w-1 rounded-full bg-emerald-400" />
          {t("install.eyebrow")}
        </p>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-[-0.02em] text-ink-50 mt-3">
          {t("install.title")}
        </h2>
      </header>
      <div className="grid gap-4">
        <CodeBlock caption="terminal" code={INSTALL} />
        <div className="grid lg:grid-cols-2 gap-4">
          <CodeBlock caption="server component" code={SERVER} />
          <CodeBlock caption="client provider" code={CLIENT} />
        </div>
      </div>
    </section>
  );
}

function CodeBlock({ caption, code }: { caption: string; code: string }) {
  return (
    <figure className="rounded-2xl border border-ink-800 bg-ink-900 overflow-hidden shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)]">
      <figcaption className="flex items-center gap-3 px-4 py-2.5 border-b border-ink-800 text-xs">
        <span className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-700" />
        </span>
        <span className="mono uppercase tracking-[0.18em] text-ink-300">
          {caption}
        </span>
      </figcaption>
      <pre className="overflow-x-auto px-5 py-4 text-[13px] leading-relaxed mono text-ink-100">
        <code>{code}</code>
      </pre>
    </figure>
  );
}
