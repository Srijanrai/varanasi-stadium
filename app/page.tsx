import Link from "next/link";
import { getNextMatch, getPosts, getSiteImages, getStadium } from "@/lib/data/content";
import { getListing, getListings, getLiveCategories } from "@/lib/data/listings";
import { getSearchIndex } from "@/lib/data/search";
import { pageMeta } from "@/lib/seo/meta";
import { SITE } from "@/lib/site";
import { LANDMARKS, roadKmEstimate } from "@/lib/geo";
import { formatDate } from "@/lib/format";
import { StatusBoard } from "@/components/StatusBoard";
import { AlertCta } from "@/components/AlertCta";
import { ListingRail } from "@/components/ListingRow";
import { CategoryTabs } from "@/components/CategoryTabs";
import { SearchBox } from "@/components/SearchBox";
import { Photo, PhotoCredit } from "@/components/Photo";
import { StadiumImage } from "@/components/StadiumImage";
import { TrackedLink } from "@/components/TrackedLink";
import { WhatsAppIcon } from "@/components/ShareWhatsApp";
import { Container, SectionHeading } from "@/components/ui";
import { IconChevron, IconPin, IconTicket, IconRoute } from "@/components/icons";
import type { ListingType } from "@/lib/schema/listing";

export const metadata = pageMeta({
  title: `${SITE.name} – Varanasi cricket stadium & Kashi guide`,
  description: SITE.description,
  path: "/",
});

const RAILS: { type: ListingType; title: string; sub: string; sortBy: "stadium" | "kashiVishwanath"; all: string }[] = [
  { type: "hotel", title: "Stays near the stadium", sub: "Comfortable places to stay close to Ganjari and along the route.", sortBy: "stadium", all: "See all stays" },
  { type: "temple", title: "Temples to visit after the match", sub: "Darshan and aarti, starting from Kashi Vishwanath.", sortBy: "kashiVishwanath", all: "See all temples" },
  { type: "ghat", title: "Evenings on the ghats", sub: "Ganga aarti, boat rides and the river.", sortBy: "kashiVishwanath", all: "See all ghats" },
  { type: "transport", title: "Arriving in Varanasi", sub: "Stations, the airport and the ropeway.", sortBy: "stadium", all: "See all" },
];

const POPULAR = [
  { label: "Kashi Vishwanath", href: "/temples/kashi-vishwanath/" },
  { label: "Hotels near stadium", href: "/hotels/" },
  { label: "Assi Ghat", href: "/ghats/assi-ghat/" },
  { label: "Varanasi Cantt", href: "/transport/varanasi-cantt-station/" },
];

export default function HomePage() {
  const stadium = getStadium();
  const images = getSiteImages();
  const categories = getLiveCategories();
  const posts = getPosts("blog").slice(0, 3);
  const ropewayLive = Boolean(getListing("transport", "kashi-ropeway"));
  const canttKm = Math.round(roadKmEstimate(LANDMARKS.cantt.geo, LANDMARKS.stadium.geo));
  const aartiGhat = getListing("ghat", "dashashwamedh-ghat");
  const searchIndex = getSearchIndex();
  // Only suggest links whose pages actually exist in this build.
  const livePaths = new Set([...searchIndex.map((i) => i.href), ...categories.map((c) => `/${c.path}/`)]);
  const popular = POPULAR.filter((p) => livePaths.has(p.href));

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <Photo
          photo={images.hero}
          aspect="aspect-[3/4] sm:aspect-[21/8]"
          sizes="100vw"
          priority
          // Warm sunset grade so the lit ghats glow amber, as in the approved mockup
          imgClassName="[filter:sepia(0.55)_saturate(1.9)_hue-rotate(-10deg)_brightness(1.08)_contrast(1.05)]"
        >
          <div className="absolute inset-0 bg-gradient-to-bl from-[#ff8a1f]/35 via-transparent to-transparent mix-blend-soft-light" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#021e3a]/90 via-[#021e3a]/45 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#021e3a] from-15% via-[#021e3a]/55 via-45% to-transparent sm:from-[#021e3a]/30 sm:from-0% sm:via-transparent" />
          <div className="absolute inset-x-0 bottom-0 sm:inset-y-0 sm:flex sm:items-center">
            <div className="mx-auto w-full max-w-6xl px-5 pb-20 text-white sm:px-6 sm:pb-6">
              <p className="text-xs font-semibold tracking-[0.14em] text-gold">GANJARI, VARANASI</p>
              <h1 className="mt-3 max-w-[16ch] text-[clamp(2.3rem,5.2vw,3.9rem)] leading-[1.08]">
                The new home of cricket in <span className="text-gold">Kashi</span>
              </h1>
              <p className="mt-4 max-w-[44ch] text-[0.98rem] text-white/85 sm:text-[1.05rem]">
                Getting to the stadium, where to stay, and how to spend the hours around the match in the world&apos;s oldest
                living city.
              </p>
              <div className="mt-6 flex gap-2.5 sm:gap-3">
                <Link href="/stadium/how-to-reach/" className="btn btn-gold !min-h-10 !px-3.5 text-[0.78rem] whitespace-nowrap sm:!min-h-12 sm:!px-5 sm:text-[0.92rem]">
                  Plan your match day <IconChevron className="h-4 w-4" />
                </Link>
                {SITE.whatsappChannelUrl && (
                <TrackedLink href={SITE.whatsappChannelUrl} target="_blank" rel="noopener" event="alert_signup" params={{ from: "home-hero" }} className="btn btn-outline-light !min-h-10 !px-3.5 text-[0.78rem] whitespace-nowrap sm:!min-h-12 sm:!px-5 sm:text-[0.92rem]">
                  <WhatsAppIcon className="h-4 w-4" /> Get match alerts
                </TrackedLink>
                )}
              </div>
            </div>
          </div>
          <PhotoCredit photo={images.hero} className="absolute top-3 right-4 hidden text-right text-white/70 sm:block [&_a]:text-white/80" />
        </Photo>
      </section>

      {/* Search card overlapping the hero */}
      <Container className="relative z-10 -mt-12 sm:-mt-10">
        <div className="card p-3 sm:p-4">
          <SearchBox index={searchIndex} popular={popular} />
        </div>
        <PhotoCredit photo={images.hero} className="mt-1.5 text-right sm:hidden" />
      </Container>

      <Container className="mt-8">
        <CategoryTabs categories={categories} />
      </Container>

      {/* Status */}
      <Container className="mt-10">
        <SectionHeading sub="We update this the day anything official changes." action={{ href: "/stadium/", label: "View full stadium guide" }}>
          Where things stand
        </SectionHeading>
        {images.stadium && (
          <Link href="/stadium/" className="group mb-4 block">
            <StadiumImage desktop={images.stadium} mobile={images.stadiumMobile} className="rounded-[20px]">
              <div className="absolute inset-0 bg-gradient-to-r from-[#021e3a]/85 via-[#021e3a]/35 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex max-w-md flex-col justify-end p-5 text-white sm:justify-center sm:p-8">
                <p className="text-xs font-semibold tracking-[0.14em] text-gold">GANJARI, RAJATALAB</p>
                <h3 className="mt-1 text-[clamp(1.25rem,3.5vw,1.9rem)] font-extrabold leading-tight">Varanasi International Cricket Stadium</h3>
                <p className="mt-1 text-sm text-white/80">About 30,000 seats, nearly built.</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-gold">
                  Full stadium guide <IconChevron className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </StadiumImage>
          </Link>
        )}
        <StatusBoard stadium={stadium} nextMatch={getNextMatch()} />
      </Container>

      {/* Before you set out */}
      <Container className="mt-10">
        <SectionHeading sub="A few important things to keep in mind.">Before you set out</SectionHeading>
        <div className="rail -mx-4 px-4 sm:mx-0 sm:grid-flow-row sm:grid-cols-3 sm:px-0 sm:[grid-auto-columns:auto]">
          <InfoCard
            Icon={IconPin}
            title="It's outside the city"
            body={`Ganjari is roughly ${canttKm} km from Cantt station. Plan on a cab rather than a walk from the ghats.`}
            href="/stadium/how-to-reach/"
            cta="See the routes"
          />
          <InfoCard
            Icon={IconTicket}
            title="No tickets exist yet"
            body="No match has been officially announced. Anyone selling tickets for this stadium today is running a scam."
            href="/stadium/tickets/"
            cta="How tickets will work"
          />
          <InfoCard
            Icon={IconRoute}
            tint="bg-orange-tint"
            title="The ropeway won't take you there"
            body="It will link Cantt and Godowlia inside the city once it opens. Handy for the ghats, no use for the stadium."
            href={ropewayLive ? "/transport/kashi-ropeway/" : "/stadium/how-to-reach/"}
            cta={ropewayLive ? "About the ropeway" : "Other ways to go"}
          />
        </div>
      </Container>

      {/* Rails */}
      {RAILS.map((r) => {
        const items = getListings(r.type)
          .sort((a, b) => a.distances[r.sortBy] - b.distances[r.sortBy])
          .slice(0, 8);
        if (!items.length) return null;
        const cat = categories.find((c) => c.type === r.type);
        return (
          <Container key={r.type} className="mt-10">
            <SectionHeading sub={r.sub} action={cat ? { href: `/${cat.path}/`, label: r.all } : undefined}>
              {r.title}
            </SectionHeading>
            <ListingRail listings={items} label={r.title} />
          </Container>
        );
      })}

      {/* Aarti feature */}
      {images.aarti && (
        <Container className="mt-10">
          <Link href={aartiGhat ? "/ghats/dashashwamedh-ghat/" : "/stadium/"} className="group block">
            <Photo photo={images.aarti} aspect="aspect-[4/5] sm:aspect-[21/8]" sizes="(min-width:1152px) 1104px, 100vw" className="rounded-[20px]" label="Ganga aarti">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b1430]/90 via-[#0b1430]/35 to-transparent sm:bg-gradient-to-r" />
              <div className="absolute inset-x-0 bottom-0 max-w-lg p-6 text-white sm:inset-y-0 sm:flex sm:flex-col sm:justify-center sm:p-12">
                <p className="text-xs font-semibold tracking-[0.14em] text-gold">AFTER THE MATCH</p>
                <h2 className="mt-2 text-[clamp(1.8rem,5vw,2.8rem)]">The evening Ganga aarti</h2>
                <p className="mt-3 text-white/85">
                  Lamps, conch shells and chanting on the river steps every evening. Here&apos;s where to stand and when to arrive.
                </p>
                <span className="btn btn-gold mt-5 self-start">
                  Plan your evening <IconChevron className="h-4 w-4" />
                </span>
              </div>
            </Photo>
          </Link>
          <PhotoCredit photo={images.aarti} className="mt-1.5 text-right" />
        </Container>
      )}

      {posts.length > 0 && (
        <Container className="mt-10">
          <SectionHeading action={{ href: "/blog/", label: "All news" }}>From the ground</SectionHeading>
          <ul className="grid gap-4 md:grid-cols-3">
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}/`} className="card group block h-full p-5">
                  <time className="text-xs font-semibold text-gold-ink" dateTime={p.publishedAt}>
                    {formatDate(p.publishedAt)}
                  </time>
                  <h3 className="mt-2 text-[1.15rem] font-bold leading-snug group-hover:text-gold-ink">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{p.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}

      <Container className="mt-10">
        <AlertCta from="home-bottom" />
      </Container>
    </>
  );
}

function InfoCard({
  Icon,
  tint = "bg-danger-tint",
  title,
  body,
  href,
  cta,
}: {
  Icon: (p: { className?: string }) => React.ReactElement;
  tint?: string;
  title: string;
  body: string;
  href: string;
  cta: string;
}) {
  return (
    <Link href={href} className="card group flex h-full gap-4 p-5">
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full text-danger ${tint}`}>
        <Icon className="h-6 w-6 [stroke-width:2.2]" />
      </span>
      <span className="flex flex-col">
        <span className="font-bold">{title}</span>
        <span className="mt-1.5 text-sm text-muted">{body}</span>
        <span className="link mt-3 inline-flex items-center gap-1 text-sm">
          {cta} <IconChevron className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </span>
    </Link>
  );
}
