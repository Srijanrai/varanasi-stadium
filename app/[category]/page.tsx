import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategoryByPath } from "@/lib/categories";
import { getListings, isCategoryLive } from "@/lib/data/listings";
import { getLiveCollections } from "@/lib/data/collections";
import { getAreas } from "@/lib/data/content";
import { pageMeta } from "@/lib/seo/meta";
import { itemListJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { ListingBrowser } from "@/components/ListingBrowser";
import { CategoryTabs } from "@/components/CategoryTabs";
import { getLiveCategories } from "@/lib/data/listings";
import { Breadcrumbs, Container, PageIntro } from "@/components/ui";
import type { LandmarkKey } from "@/lib/geo";

type Params = { category: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return CATEGORIES.filter(isCategoryLive).map((c) => ({ category: c.path }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const c = getCategoryByPath((await params).category);
  if (!c) return {};
  return pageMeta({ title: c.metaTitle, description: c.metaDescription, path: `/${c.path}/` });
}

const CHIPS: Record<string, LandmarkKey[]> = {
  hotel: ["stadium", "kashiVishwanath", "cantt"],
  hospital: ["cantt", "bhu", "stadium"],
  temple: ["kashiVishwanath", "stadium"],
  ghat: ["kashiVishwanath", "stadium"],
  transport: ["stadium", "kashiVishwanath"],
};

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const c = getCategoryByPath((await params).category);
  if (!c || !isCategoryLive(c)) notFound();
  const listings = getListings(c.type);
  const collections = getLiveCollections(c.type);
  const areas = getAreas().map((a) => ({ slug: a.slug, name: a.name }));

  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: c.label, path: `/${c.path}/` }]} />
      <div className="mt-4">
        <CategoryTabs categories={getLiveCategories()} active={c.path} />
      </div>
      <PageIntro title={c.h1} lead={c.intro} />

      {collections.length > 0 && (
        <nav aria-label="Popular lists" className="mb-8 flex flex-wrap gap-2">
          {collections.map((col) => (
            <Link
              key={col.slug}
              href={`/${c.path}/${col.slug}/`}
              className="chip min-h-10 border border-border px-4 text-sm text-ink hover:border-ink"
            >
              {col.h1}
            </Link>
          ))}
        </nav>
      )}

      {/* Keeps heading levels in order for screen readers (h1 → h2 → listing h3s) */}
      <h2 className="sr-only">All {c.label.toLowerCase()}</h2>
      <ListingBrowser listings={listings} areas={areas} chips={CHIPS[c.type]} showPrice={c.type === "hotel"} />

      <p className="mt-8 max-w-[60ch] text-muted">
        Run a {c.singular.toLowerCase()} in Varanasi that should be here?{" "}
        <Link href="/list-your-business/" className="link">
          Add it for free
        </Link>
        .
      </p>
      <JsonLd data={itemListJsonLd(c.h1, listings)} />
    </Container>
  );
}
