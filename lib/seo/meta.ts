import type { Metadata } from "next";
import { SITE, absoluteUrl } from "../site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  hindiPath?: string; // set when a Hindi equivalent exists
  englishPath?: string; // set on Hindi pages
  /** Page-specific share image (e.g. a listing photo). Falls back to the site-wide opengraph-image. */
  image?: { url: string; width: number; height: number; alt: string };
};

export function pageMeta({ title, description, path, noindex, hindiPath, englishPath, image }: PageMetaInput): Metadata {
  // A page-level openGraph object replaces the root one, so always set an image explicitly.
  const shareImage = image ?? { url: absoluteUrl("/opengraph-image"), width: 1200, height: 630, alt: `${SITE.name} – Varanasi cricket stadium guide` };
  const languages: Record<string, string> = {};
  if (hindiPath) {
    languages["en-IN"] = absoluteUrl(path);
    languages["hi-IN"] = absoluteUrl(hindiPath);
    languages["x-default"] = absoluteUrl(path);
  }
  if (englishPath) {
    languages["en-IN"] = absoluteUrl(englishPath);
    languages["hi-IN"] = absoluteUrl(path);
    languages["x-default"] = absoluteUrl(englishPath);
  }
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path), ...(Object.keys(languages).length ? { languages } : {}) },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName: SITE.name,
      locale: englishPath ? "hi_IN" : SITE.locale,
      type: "website",
      images: [shareImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [shareImage.url] },
    robots: noindex ? { index: false, follow: true } : undefined,
  };
}
