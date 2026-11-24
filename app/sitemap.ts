import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getLiveCategories, getListings, isAreaIndexable } from "@/lib/data/listings";
import { getLiveCollections } from "@/lib/data/collections";
import { getAreas, getPosts, getStadium } from "@/lib/data/content";
import { listingUrl } from "@/lib/seo/jsonld";
import { HINDI_LISTING_PAIRS } from "@/lib/hindi";

// One sitemap is fine below ~5,000 URLs; switch to generateSitemaps() per type after that.
export default function sitemap(): MetadataRoute.Sitemap {
  const stadiumDate = getStadium().lastChecked;
  // An English page and its Hindi twin, each pointing at the other.
  const pair = (en: string, hi: string, enPriority: number, hiPriority: number): MetadataRoute.Sitemap => [
    { url: absoluteUrl(en), lastModified: stadiumDate, priority: enPriority, alternates: { languages: { "hi-IN": absoluteUrl(hi) } } },
    { url: absoluteUrl(hi), lastModified: stadiumDate, priority: hiPriority, alternates: { languages: { "en-IN": absoluteUrl(en) } } },
  ];
  const entries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: stadiumDate, changeFrequency: "weekly", priority: 1 },
    {
      url: absoluteUrl("/stadium/"),
      lastModified: stadiumDate,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: { languages: { "hi-IN": absoluteUrl("/hi/stadium/") } },
    },
    { url: absoluteUrl("/hi/stadium/"), lastModified: stadiumDate, alternates: { languages: { "en-IN": absoluteUrl("/stadium/") } } },
    ...pair("/stadium/how-to-reach/", "/hi/stadium/how-to-reach/", 0.9, 0.8),
    ...pair("/stadium/tickets/", "/hi/stadium/tickets/", 0.8, 0.7),
    ...pair("/stadium/matches/", "/hi/stadium/matches/", 0.8, 0.7),
    { url: absoluteUrl("/stadium/construction-updates/"), lastModified: stadiumDate },
    ...(getListings().length ? [{ url: absoluteUrl("/areas/") }] : []),
    ...(getLiveCategories().length ? [{ url: absoluteUrl("/explore/"), priority: 0.8 }] : []),
    ...(["blog", "guides", "festivals"] as const).filter((k) => getPosts(k).some((p) => p.status === "published")).map((k) => ({ url: absoluteUrl(`/${k}/`) })),
    ...["/about/", "/editorial-policy/", "/list-your-business/", "/contact/", "/disclaimer/", "/privacy-policy/", "/terms/", "/credits/"].map(
      (p) => ({ url: absoluteUrl(p) }),
    ),
  ];

  for (const c of getLiveCategories()) {
    entries.push({ url: absoluteUrl(`/${c.path}/`), priority: 0.8 });
    for (const col of getLiveCollections(c.type)) entries.push({ url: absoluteUrl(`/${c.path}/${col.slug}/`), priority: 0.7 });
  }
  for (const l of getListings().filter((l) => l.status === "published")) {
    const hi = HINDI_LISTING_PAIRS[listingUrl(l)];
    entries.push({
      url: absoluteUrl(listingUrl(l)),
      lastModified: l.updatedAt,
      priority: 0.6,
      ...(hi ? { alternates: { languages: { "hi-IN": absoluteUrl(hi) } } } : {}),
    });
    if (hi)
      entries.push({ url: absoluteUrl(hi), lastModified: l.updatedAt, priority: 0.6, alternates: { languages: { "en-IN": absoluteUrl(listingUrl(l)) } } });
  }
  for (const a of getAreas().filter((a) => isAreaIndexable(a.slug)))
    entries.push({ url: absoluteUrl(`/areas/${a.slug}/`) });
  for (const kind of ["blog", "guides", "festivals"] as const)
    for (const p of getPosts(kind).filter((p) => p.status === "published"))
      entries.push({ url: absoluteUrl(`/${kind}/${p.slug}/`), lastModified: p.updatedAt });

  return entries;
}
