import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sonenta · Next.js i18n demo",
  description:
    "Live demo of @sonenta/next, the adaptive content layer for Next.js — App Router Server Components render real CDN translations at build, the client hydrates from the same snapshot, and the runtime missing-key handler streams every fallback.",
  metadataBase: new URL("https://sonenta.com"),
  // basePath is NOT auto-prepended to metadata asset URLs — include it so the
  // favicon/OG image resolve under /demos/next/ in production.
  icons: { icon: "/demos/next/favicon.svg" },
  openGraph: {
    type: "website",
    title: "Sonenta · Next.js i18n demo",
    description:
      "Server-rendered i18n on the App Router + a live missing-key handler. The adaptive content layer.",
    url: "https://sonenta.com/demos/next/",
    images: ["/demos/next/og.svg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonenta · Next.js i18n demo",
    description:
      "Server-rendered i18n on the App Router + a live missing-key handler. The adaptive content layer.",
    images: ["/demos/next/og.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Per-locale <html lang> is set client-side by the provider (static export
  // shares one root layout across locales). Default to "en" for first paint.
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
