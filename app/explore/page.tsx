import Link from "next/link";
import { getListings, getLiveCategories } from "@/lib/data/listings";
import { getSearchIndex } from "@/lib/data/search";
import { pageMeta } from "@/lib/seo/meta";
import { CATEGORY_ICONS, IconChevron } from "@/components/icons";
import { ListingRail } from "@/components/ListingRow";
import { Photo } from "@/components/Photo";
import { SearchBox } from "@/components/SearchBox";
import { Breadcrumbs, Container, PageIntro, SectionHeading } from "@/components/ui";

export const generateMetadata = () =>
  pageMeta({
    title: "Explore Varanasi – temples, ghats, stays and transport",
    description: "Everything around the Varanasi cricket stadium in one place: temples, ghats, where to stay and how to get around.",
    path: "/explore/",
    noindex: getLiveCategories().length === 0,
  });

export default function ExplorePage() {
  const categories = getLiveCategories();
  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Explore", path: "/explore/" }]} />
      <PageIntro title="Explore Varanasi" lead="Everything around the match: where to stay, what to see, and how to get around." />
      <SearchBox index={getSearchIndex()} />

      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {categories.map((c) => {
          const items = getListings(c.type);
          const cover = items.find((l) => l.photos.length)?.photos[0];
          const Icon = CATEGORY_ICONS[c.type];
          return (
            <li key={c.path}>
              <Link href={`/${c.path}/`} className="group block">
                <Photo photo={cover} aspect="aspect-square" sizes="(min-width:1024px) 220px, 45vw" className="rounded-[20px]" kind={c.type} label={cover ? undefined : c.label}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                    <p className="flex items-center gap-1.5 font-bold">
                      <Icon className="h-4 w-4" /> {c.label}
                    </p>
                    <p className="text-xs text-white/80">
                      <span lang="hi">{c.labelHi}</span> • {items.length} places
                    </p>
                  </div>
                </Photo>
              </Link>
            </li>
          );
        })}
      </ul>

      {categories.map((c) => (
        <section key={c.path} className="mt-12">
          <SectionHeading action={{ href: `/${c.path}/`, label: "See all" }}>{c.label}</SectionHeading>
          <ListingRail listings={getListings(c.type).slice(0, 8)} />
        </section>
      ))}

      <p className="mt-12">
        <Link href="/areas/" className="link inline-flex items-center gap-1">
          Browse by area <IconChevron className="h-4 w-4" />
        </Link>
      </p>
    </Container>
  );
}
