import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryByPath } from "@/lib/categories";
import { getListing, getListings, isCategoryLive } from "@/lib/data/listings";
import { COLLECTIONS, getCollection, isCollectionLive } from "@/lib/data/collections";
import { pageMeta } from "@/lib/seo/meta";
import { CollectionView } from "./CollectionView";
import { ListingDetail } from "./ListingDetail";
import { getArea } from "@/lib/data/content";

type Params = { category: string; slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  const out: Params[] = [];
  for (const c of CATEGORIES) {
    // Each published listing gets its page straight away; only the category list waits for 5.
    for (const l of getListings(c.type)) out.push({ category: c.path, slug: l.slug });
    if (!isCategoryLive(c)) continue;
    for (const col of COLLECTIONS.filter((x) => x.type === c.type && isCollectionLive(x)))
      out.push({ category: c.path, slug: col.slug });
  }
  return out;
}

function resolve(p: Params) {
  const c = getCategoryByPath(p.category);
  if (!c) return null;
  const col = getCollection(c.type, p.slug);
  if (col) return isCollectionLive(col) ? { c, col } : null;
  const listing = getListing(c.type, p.slug);
  return listing ? { c, listing } : null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const r = resolve(await params);
  if (!r) return {};
  if ("col" in r && r.col)
    return pageMeta({ title: r.col.metaTitle, description: r.col.metaDescription, path: `/${r.c.path}/${r.col.slug}/` });
  const l = r.listing!;
  const area = getArea(l.area)?.name ?? "Varanasi";
  const title =
    l.type === "hotel"
      ? `${l.name}, ${area} – price, distance to stadium`
      : l.type === "temple"
        ? `${l.name} – timings, aarti, darshan tips`
        : l.type === "hospital"
          ? `${l.name} – OPD timings, emergency, contact`
          : l.type === "ghat"
            ? `${l.name} – aarti time, boats, what to know`
            : `${l.name} – distance to stadium, how to get around`;
  return pageMeta({
    title,
    description: l.summary,
    path: `/${r.c.path}/${l.slug}/`,
    noindex: l.status !== "published",
    image: l.photos[0] ? { url: l.photos[0].src, width: l.photos[0].width, height: l.photos[0].height, alt: l.photos[0].alt } : undefined,
  });
}

export default async function SlugPage({ params }: { params: Promise<Params> }) {
  const r = resolve(await params);
  if (!r) notFound();
  if ("col" in r && r.col) return <CollectionView category={r.c} collection={r.col} />;
  return <ListingDetail category={r.c} listing={r.listing!} />;
}
