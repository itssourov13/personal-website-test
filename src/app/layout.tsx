import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { headers } from "next/headers";
import Script from "next/script";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";

import CommandPalette from "@/components/command/CommandPalette";
import ShortcutsOverlay from "@/components/command/ShortcutsOverlay";
import BackToTop from "@/components/layout/BackToTop";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import RouteFocus from "@/components/layout/RouteFocus";
import SkipLink from "@/components/layout/SkipLink";
import LenisProvider from "@/components/motion/LenisProvider";
import {
  getAllIdeas,
  getAllLab,
  getAllNotes,
  getAllWork,
  getTopics,
} from "@/lib/content";
import { jsonLdScript, personJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site.config";

import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(`https://${siteConfig.domain}`),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    types: {
      "application/rss+xml": siteConfig.socials.rss,
      "application/feed+json": "/feed.json",
    },
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: `https://${siteConfig.domain}`,
    siteName: siteConfig.name,
    type: "website",
    images: [`/og/home?title=${encodeURIComponent(siteConfig.tagline)}`],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const nonce = (await headers()).get("x-nonce") ?? undefined;
  const paletteWork = getAllWork().map((item) => ({
    title: item.title,
    slug: item.slug,
  }));
  const paletteNotes = getAllNotes().map((item) => ({
    title: item.title,
    slug: item.slug,
  }));
  const paletteLab = getAllLab().map((item) => ({
    title: item.title,
    slug: item.slug,
  }));
  const paletteIdeas = getAllIdeas().map((item) => ({
    title: item.title,
    slug: item.slug,
  }));
  const paletteTopics = getTopics().map((topic) => ({
    label: topic.label,
    slug: topic.slug,
  }));

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body className="font-sans">
        <script {...jsonLdScript(personJsonLd())} nonce={nonce} />
        {process.env.NODE_ENV === "production" ? (
          <Script
            src="https://plausible.io/js/script.js"
            data-domain={siteConfig.domain}
            strategy="afterInteractive"
            nonce={nonce}
          />
        ) : null}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LenisProvider />
          <RouteFocus />
          <SkipLink />
          <Header />
          <main id="main-content" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <BackToTop />
          <CommandPalette
            work={paletteWork}
            notes={paletteNotes}
            lab={paletteLab}
            ideas={paletteIdeas}
            topics={paletteTopics}
          />
          <ShortcutsOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
