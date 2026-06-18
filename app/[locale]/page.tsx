import type { Metadata } from "next";
import { getTranslations } from "@sonenta/next/server";
import { serverConfig, NAMESPACES, type AppLocale } from "@/lib/sonenta";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { LiveSection } from "@/components/LiveSection";
import { Features } from "@/components/Features";
import { InstallSnippet } from "@/components/InstallSnippet";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: { canonical: `https://sonenta.com/demos/next/${locale}/` },
  };
}

export default async function LocalePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // SERVER resolution at build: the same engine the client uses, so the
  // rendered HTML matches the hydrated client exactly (interpolation, plurals).
  const { t } = await getTranslations(
    serverConfig,
    locale as AppLocale,
    NAMESPACES,
  );

  return (
    <>
      <Header locale={locale as AppLocale} />
      <main className="flex-1">
        <Hero t={t} />
        <LiveSection />
        <Features t={t} />
        <InstallSnippet t={t} />
        <Pricing t={t} />
      </main>
      <Footer t={t} />
    </>
  );
}
