import Link from "next/link";
import type { CategoryConfig } from "@/lib/categories";
import { getCollectionListings, type Collection } from "@/lib/data/collections";
import { itemListJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { ListingList } from "@/components/ListingRow";
import { Breadcrumbs, Container, PageIntro } from "@/components/ui";
import type { LandmarkKey } from "@/lib/geo";

const CHIPS: Record<string, LandmarkKey[]> = {
  "near-stadium": ["stadium", "cantt"],
  "near-kashi-vishwanath": ["kashiVishwanath", "stadium"],
  "near-bhu": ["bhu", "stadium"],
};

export function CollectionView({ category: c, collection: col }: { category: CategoryConfig; collection: Collection }) {
  const listings = getCollectionListings(col);
  return (
    <Container>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: c.label, path: `/${c.path}/` },
          { name: col.h1, path: `/${c.path}/${col.slug}/` },
        ]}
      />
      <PageIntro title={col.h1} lead={col.intro} />
      <h2 className="sr-only">{col.h1}</h2>
      <ListingList listings={listings} chips={CHIPS[col.slug]} />
      <p className="mt-8">
        <Link href={`/${c.path}/`} className="link">
          See every place in {c.label.toLowerCase()}
        </Link>
      </p>
      <JsonLd data={itemListJsonLd(col.h1, listings)} />
    </Container>
  );
}
