import type { Metadata, Viewport } from "next";
import { Figtree, Hind } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { themeInitScript } from "@/components/ThemeToggle";
import { JsonLd } from "@/components/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { getListings, getLiveCategories } from "@/lib/data/listings";
import { getPosts } from "@/lib/data/content";

// Figtree for all Latin text; Hind covers Devanagari (Figtree has no Hindi glyphs).
const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree", display: "swap" });
const hind = Hind({ weight: ["400", "500", "600"], subsets: ["devanagari"], variable: "--font-hind", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} – Varanasi cricket stadium & Kashi guide`, template: "%s" }, // no brand suffix: keeps titles under ~60 chars
  description: SITE.description,
  applicationName: SITE.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#021e3a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = getLiveCategories().map((c) => ({ href: `/${c.path}/`, label: c.label }));
  const extra = [
    ...(getListings().length ? [{ href: "/areas/", label: "Areas" }] : []),
    ...(getPosts("guides").length ? [{ href: "/guides/", label: "Guides" }] : []),
    ...(getPosts("blog").length ? [{ href: "/blog/", label: "News" }] : []),
  ];
  return (
    <html lang="en-IN" className={`${figtree.variable} ${hind.variable}`} suppressHydrationWarning>
      <head>
        {/* Applies a saved light/dark choice before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh flex flex-col antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-brand focus:text-on-brand focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Skip to content
        </a>
        <Header categories={nav} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer categories={[...nav, ...extra]} />
        <BottomNav />
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
