import { notFound } from "next/navigation";
import { getBundles } from "@sonenta/next/server";
import {
  serverConfig,
  LOCALES,
  NAMESPACES,
  type AppLocale,
} from "@/lib/sonenta";
import { Providers } from "./providers";

/** Pre-render one static route per locale (en/fr/es). */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(LOCALES as readonly string[]).includes(locale)) notFound();

  // BUILD-TIME CDN fetch: the App-Router server helper pulls the published
  // bundles so each locale is pre-rendered with real content, then handed to
  // the client provider as the hydration snapshot (no client refetch).
  const initialBundles = await getBundles(
    serverConfig,
    locale as AppLocale,
    NAMESPACES,
  );

  return (
    <Providers locale={locale as AppLocale} initialBundles={initialBundles}>
      {children}
    </Providers>
  );
}
