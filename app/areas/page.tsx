import Link from "next/link";
import { getAreas } from "@/lib/data/content";
import { getListings, getListingsInArea } from "@/lib/data/listings";
import { pageMeta } from "@/lib/seo/meta";
import { LANDMARKS, formatKm, haversineKm } from "@/lib/geo";
import { Breadcrumbs, Container, PageIntro } from "@/components/ui";

export const generateMetadata = () =>
  pageMeta({
  title: "Areas of Varanasi – where to stay and what's nearby",
  description: "A local's guide to Varanasi neighbourhoods — Assi, Godowlia, Cantt, Lanka, Rajatalab and more — with distance to the cricket stadium.",
  path: "/areas/",
  noindex: !getListings().some((l) => l.status === "published"),
  });

export default function AreasPage() {
  const areas = getAreas()
    .map((a) => ({ ...a, count: getListingsInArea(a.slug).length, km: haversineKm(a.geo, LANDMARKS.stadium.geo) }))
    .filter((a) => a.count > 0)
    .sort((a, b) => a.km - b.km);

  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Areas", path: "/areas/" }]} />
      <PageIntro
        title="Areas of Varanasi"
        lead="Banaras changes a lot from one neighbourhood to the next. Here's what each area is like and how far it is from the stadium."
      />
      <ul className="divide-y divide-border border-y border-border">
        {areas.map((a) => (
          <li key={a.slug} className="relative grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:gap-6">
            <div>
              <h2 className="text-[1.55rem]">
                <Link href={`/areas/${a.slug}/`} className="after:absolute after:inset-0 hover:underline underline-offset-4">
                  {a.name}
                </Link>{" "}
                {a.nameHi && <span lang="hi" className="font-normal text-muted">{a.nameHi}</span>}
              </h2>
              <p className="mt-1 max-w-[60ch] text-muted">{a.summary}</p>
            </div>
            <p className="text-sm text-muted sm:text-right">
              {formatKm(a.km)} to stadium
              <br />
              {a.count} {a.count === 1 ? "place" : "places"}
            </p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
