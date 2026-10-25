import Link from "next/link";
import { getFaqs, getNextMatch, getSiteImages, getStadium } from "@/lib/data/content";
import { getListings } from "@/lib/data/listings";
import { pageMeta } from "@/lib/seo/meta";
import { stadiumJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { StatusBoard } from "@/components/StatusBoard";
import { AlertCta } from "@/components/AlertCta";
import { ListingRail } from "@/components/ListingRow";
import { ShareWhatsApp } from "@/components/ShareWhatsApp";
import { StadiumImage } from "@/components/StadiumImage";
import { IconCalendar, IconCrane, IconRoute, IconTicket } from "@/components/icons";
import { Breadcrumbs, Container, FaqList, QuickAnswers, SectionHeading, Sources } from "@/components/ui";

export const metadata = pageMeta({
  title: "Varanasi Cricket Stadium (Ganjari) – status, matches, how to reach",
  description:
    "Everything we know about the new Varanasi international cricket stadium at Ganjari: construction status, first match, tickets, seating and how to get there.",
  path: "/stadium/",
  hindiPath: "/hi/stadium/",
});

const PLAN = [
  { href: "/stadium/how-to-reach/", title: "How to reach", body: "Routes, timings and a leave-by planner", Icon: IconRoute },
  { href: "/stadium/tickets/", title: "Tickets", body: "What we know, and the scams to avoid", Icon: IconTicket },
  { href: "/stadium/matches/", title: "Matches", body: "Only officially announced fixtures", Icon: IconCalendar },
  { href: "/stadium/construction-updates/", title: "Construction", body: "Dated progress notes with sources", Icon: IconCrane },
];

export default function StadiumPage() {
  const stadium = getStadium();
  const images = getSiteImages();
  const faqs = getFaqs("stadium.en");
  const stays = getListings("hotel")
    .sort((a, b) => a.distances.stadium - b.distances.stadium)
    .slice(0, 8);
  const sources = stadium.facts
    .flatMap((f) => (f.source ? [f.source] : []))
    .filter((s, i, a) => a.findIndex((x) => x.url === s.url) === i);

  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Stadium", path: "/stadium/" }]} />

      <div className="mt-4">
        <StadiumImage desktop={images.stadium ?? images.hero} mobile={images.stadiumMobile} priority className="rounded-[20px]">
          <div className="absolute inset-0 bg-gradient-to-t from-[#021e3a]/90 via-[#021e3a]/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
            <span className="text-xs font-semibold tracking-[0.14em] text-gold">GANJARI, RAJATALAB · ~30,000 SEATS</span>
            <h1 className="mt-2 text-[clamp(1.8rem,6vw,3rem)] leading-[1.1]">Varanasi International Cricket Stadium</h1>
          </div>
        </StadiumImage>
      </div>

      <p className="mt-6 max-w-[62ch] text-[1.05rem] text-muted">
        The new stadium at Ganjari is nearly built, but it isn&apos;t open and no match has been officially fixed. Here&apos;s
        what&apos;s confirmed, what&apos;s only talk, and how to plan for the first game.
      </p>

      <div className="mt-6">
        <StatusBoard stadium={stadium} nextMatch={getNextMatch()} />
      </div>

      <section className="mt-12">
        <SectionHeading>Plan your match day</SectionHeading>
        <ul className="grid grid-cols-4 gap-2 sm:gap-4">
          {PLAN.map(({ href, title, body, Icon }) => (
            <li key={href}>
              <Link href={href} className="card group flex h-full flex-col items-center gap-2 p-3 text-center transition-transform hover:-translate-y-0.5 sm:p-5">
                <span className="icon-tile h-11 w-11 sm:h-14 sm:w-14">
                  <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                </span>
                <span className="text-[0.7rem] font-semibold leading-tight break-words sm:text-base">{title}</span>
                <span className="hidden text-xs text-muted sm:block sm:text-sm">{body}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <section>
          <SectionHeading>The basics</SectionHeading>
          <dl className="card divide-y divide-border px-5">
            {stadium.facts.map((f) => (
              <div key={f.label} className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-sm text-muted">{f.label}</dt>
                <dd className="text-right font-semibold">{f.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-2">
            <Sources sources={sources} />
          </div>
        </section>
        <section>
          <SectionHeading>What it looks like</SectionHeading>
          <QuickAnswers
            title="Designed around Kashi"
            items={[
              "Floodlight towers shaped like a trishul",
              "A curved roof that recalls a crescent moon",
              "You can see the floodlights from the highway near Rajatalab",
            ]}
          />
          <p className="mt-3 text-sm text-muted">We&apos;ll add our own photos from outside the site with each construction update.</p>
        </section>
      </div>

      {stays.length > 0 && (
        <section className="mt-12">
          <SectionHeading sub="Sorted by distance to Ganjari" action={{ href: "/hotels/", label: "See all" }}>
            Closest places to stay
          </SectionHeading>
          <ListingRail listings={stays} />
        </section>
      )}

      <section className="mt-12" aria-labelledby="faq">
        <SectionHeading id="faq">Questions people ask</SectionHeading>
        <FaqList faqs={faqs} checked={stadium.lastChecked} />
      </section>

      <div className="mt-6">
        <ShareWhatsApp text="Everything we know about the new Varanasi cricket stadium so far:" />
      </div>

      <div className="mt-12">
        <AlertCta from="stadium" />
      </div>
      <JsonLd data={stadiumJsonLd()} />
    </Container>
  );
}
