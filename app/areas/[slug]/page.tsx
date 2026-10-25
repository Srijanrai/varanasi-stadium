import { notFound } from "next/navigation";
import { getArea, getAreas } from "@/lib/data/content";
import { getListingsInArea } from "@/lib/data/listings";
import { CATEGORIES } from "@/lib/categories";
import { pageMeta } from "@/lib/seo/meta";
import { LANDMARKS, formatKm, haversineKm } from "@/lib/geo";
import { JsonLd } from "@/components/JsonLd";
import { ListingList } from "@/components/ListingRow";
import { Breadcrumbs, Container, PageIntro, QuickAnswers, SectionHeading } from "@/components/ui";
import { itemListJsonLd } from "@/lib/seo/jsonld";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return getAreas()
    .filter((a) => getListingsInArea(a.slug).length > 0)
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const a = getArea((await params).slug);
  if (!a) return {};
  return pageMeta({
    title: `${a.name}, Varanasi – stays, temples and distance to the stadium`,
    description: a.summary,
    path: `/areas/${a.slug}/`,
  });
}

export default async function AreaPage({ params }: { params: Promise<Params> }) {
  const a = getArea((await params).slug);
  if (!a) notFound();
  const listings = getListingsInArea(a.slug);
  if (!listings.length) notFound();

  return (
    <Container>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Areas", path: "/areas/" },
          { name: a.name, path: `/areas/${a.slug}/` },
        ]}
      />
      <PageIntro title={`${a.name}, Varanasi`} lead={a.summary} />
      <QuickAnswers
        items={[
          `${formatKm(haversineKm(a.geo, LANDMARKS.stadium.geo))} from the stadium (straight line)`,
          `${formatKm(haversineKm(a.geo, LANDMARKS.kashiVishwanath.geo))} from Kashi Vishwanath`,
          `${formatKm(haversineKm(a.geo, LANDMARKS.cantt.geo))} from Cantt station`,
        ]}
      />
      {CATEGORIES.map((c) => {
        const items = listings.filter((l) => l.type === c.type);
        if (!items.length) return null;
        return (
          <section key={c.type} className="mt-12">
            <SectionHeading>{c.label}</SectionHeading>
            <ListingList listings={items} />
          </section>
        );
      })}
      <JsonLd data={itemListJsonLd(`${a.name}, Varanasi`, listings)} />
    </Container>
  );
}
