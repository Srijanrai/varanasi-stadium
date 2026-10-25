import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { getLiveCategories, getListings, getListingsInArea } from "@/lib/data/listings";
import { getLiveCollections } from "@/lib/data/collections";
import { getAreas, getPosts, getStadium } from "@/lib/data/content";
import { listingUrl } from "@/lib/seo/jsonld";

// One sitemap is fine below ~5,000 URLs; switch to generateSitemaps() per type after that.
export default function sitemap(): MetadataRoute.Sitemap {
  const stadiumDate = getStadium().lastChecked;
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
    { url: absoluteUrl("/stadium/how-to-reach/"), lastModified: stadiumDate, priority: 0.9 },
    { url: absoluteUrl("/stadium/tickets/"), lastModified: stadiumDate, priority: 0.8 },
    { url: absoluteUrl("/stadium/matches/"), lastModified: stadiumDate, priority: 0.8 },
    { url: absoluteUrl("/stadium/construction-updates/"), lastModified: stadiumDate },
    ...(getListings().length ? [{ url: absoluteUrl("/areas/") }] : []),
    ...(["blog", "guides"] as const).filter((k) => getPosts(k).some((p) => p.status === "published")).map((k) => ({ url: absoluteUrl(`/${k}/`) })),
    ...["/about/", "/editorial-policy/", "/list-your-business/", "/contact/", "/disclaimer/", "/privacy-policy/", "/terms/", "/credits/"].map(
      (p) => ({ url: absoluteUrl(p) }),
    ),
  ];

  for (const c of getLiveCategories()) {
    entries.push({ url: absoluteUrl(`/${c.path}/`), priority: 0.8 });
    for (const col of getLiveCollections(c.type)) entries.push({ url: absoluteUrl(`/${c.path}/${col.slug}/`), priority: 0.7 });
  }
  for (const l of getListings().filter((l) => l.status === "published"))
    entries.push({ url: absoluteUrl(listingUrl(l)), lastModified: l.updatedAt, priority: 0.6 });
  for (const a of getAreas().filter((a) => getListingsInArea(a.slug).length > 0))
    entries.push({ url: absoluteUrl(`/areas/${a.slug}/`) });
  for (const kind of ["blog", "guides"] as const)
    for (const p of getPosts(kind).filter((p) => p.status === "published"))
      entries.push({ url: absoluteUrl(`/${kind}/${p.slug}/`), lastModified: p.updatedAt });

  return entries;
}
