import Link from "next/link";
import { marked } from "marked";
import type { CategoryConfig } from "@/lib/categories";
import { getNearby, isCategoryLive, type ListingWithDistances } from "@/lib/data/listings";
import { getArea } from "@/lib/data/content";
import { listingJsonLd, listingUrl } from "@/lib/seo/jsonld";
import { LANDMARKS, formatKm, type LandmarkKey } from "@/lib/geo";
import { formatDate, formatPriceRange } from "@/lib/format";
import { SITE } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";
import { ActionBar } from "@/components/ActionBar";
import { ShareWhatsApp } from "@/components/ShareWhatsApp";
import { PhotoCard, listingKind } from "@/components/ListingRow";
import { Gallery } from "@/components/Gallery";
import { CATEGORY_ICONS, IconCheck, IconPin } from "@/components/icons";
import { Breadcrumbs, Container, DraftNotice, QuickAnswers, SectionHeading, Sources } from "@/components/ui";

export function ListingDetail({ category: c, listing: l }: { category: CategoryConfig; listing: ListingWithDistances }) {
  const area = getArea(l.area);
  const nearby = getNearby(l, 8);
  const Icon = CATEGORY_ICONS[l.type];
  // Descriptions come from our own content files (and, in Phase 3, moderated submissions —
  // sanitize there before rendering).
  const descriptionHtml = marked.parse(l.description, { async: false }) as string;
  const price = l.type === "hotel" ? formatPriceRange(l.priceMin, l.priceMax) : null;

  return (
    <Container className="pb-24 sm:pb-0">
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          // Link the category only once its list page exists (it needs 5 published listings).
          ...(isCategoryLive(c) ? [{ name: c.label, path: `/${c.path}/` }] : []),
          ...(area ? [{ name: area.name, path: `/areas/${area.slug}/` }] : []),
          { name: l.name, path: listingUrl(l) },
        ]}
      />

      <div className="mt-4">
        <Gallery photos={l.photos} kind={l.type} name={l.name} />
      </div>

      <div className="mt-5 grid gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="min-w-0">
          <h1 className="text-[clamp(1.8rem,5.5vw,2.6rem)]">{l.name}</h1>
          {l.nameHi && (
            <p lang="hi" className="mt-1 text-muted">
              {l.nameHi}
            </p>
          )}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="chip bg-navy text-on-navy">
              <Icon className="h-3.5 w-3.5" /> {listingKind(l)}
            </span>
            {area && (
              <Link href={`/areas/${area.slug}/`} className="chip bg-soft text-ink hover:underline">
                <IconPin className="h-3.5 w-3.5 text-gold-ink" /> {area.name}
              </Link>
            )}
            {l.verifiedAt && (
              <span className="chip bg-ok-tint text-ok">
                <IconCheck className="h-3.5 w-3.5" /> Verified {formatDate(l.verifiedAt)}
              </span>
            )}
          </div>
          {price && (
            <p className="mt-4 text-[1.6rem] font-bold leading-none">
              {price}
              <span className="mt-1 block font-sans text-sm font-normal text-muted">per night (approx.)</span>
            </p>
          )}
          <p className="mt-3 max-w-[60ch] text-[1.05rem] text-muted">{l.summary}</p>
          {l.status === "draft" && <DraftNotice />}

          <div className="mt-6">
            <ActionBar listingId={l.id} type={l.type} name={l.name} phone={l.phone[0]} whatsapp={l.whatsapp} website={l.website} geo={l.geo} />
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {(["stadium", "kashiVishwanath", "cantt", "airport"] as LandmarkKey[])
              .filter((k) => l.distances[k] > 0.1)
              .map((k) => (
                <li key={k} className={`flex items-start gap-2 rounded-xl p-3 ${k === "stadium" ? "bg-teal-tint" : k === "airport" ? "bg-orange-tint" : "bg-soft"}`}>
                  {k === "stadium" ? <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-ink" /> : <span className="w-0" />}
                  <span className="leading-tight">
                    <span className="block font-bold">{formatKm(l.distances[k])}</span>
                    <span className="text-xs text-muted">to {LANDMARKS[k].label}</span>
                  </span>
                </li>
              ))}
          </ul>
          <p className="mt-2 text-xs text-muted">Straight-line distance. The drive is usually a bit longer.</p>

          {l.quickFacts.length > 0 && (
            <div className="mt-8">
              <QuickAnswers items={l.quickFacts} checked={l.verifiedAt} />
            </div>
          )}

          <TypeDetails l={l} />

          <section className="mt-10">
            <SectionHeading>About</SectionHeading>
            <div className="prose-local" dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
            {l.sources.length > 0 && (
              <div className="mt-4">
                <Sources sources={l.sources} />
              </div>
            )}
          </section>

          <div className="mt-6">
            <ShareWhatsApp text={`${l.name} — ${l.summary}`} />
          </div>
        </div>

        <aside className="space-y-3 lg:sticky lg:top-24">
          <section className="card p-5">
            <h2 className="text-base">Address</h2>
            <p className="mt-2 text-[0.95rem]">
              {l.address}, {l.pincode}
            </p>
            {l.phone.length > 0 && <p className="mt-2 text-[0.95rem]">{l.phone.join(", ")}</p>}
            {l.website && (
              <a href={l.website} target="_blank" rel="noopener nofollow" className="link mt-2 inline-block text-sm">
                Official website
              </a>
            )}
          </section>
          <section className="card p-5 text-sm">
            <p className={l.verifiedAt ? "text-ok" : "text-muted"}>
              {l.verifiedAt
                ? `Checked ${formatDate(l.verifiedAt)}${l.verificationMethod ? ` by ${l.verificationMethod.replace("-", " ")}` : ""}`
                : "Not yet verified"}
            </p>
            <a href={SITE.forms.reportWrongInfo} target="_blank" rel="noopener" className="link mt-2 inline-block">
              Something wrong? Tell us
            </a>
            {(l.type === "hotel" || l.type === "hospital") && (
              <p className="mt-1">
                <Link href="/list-your-business/" className="link">
                  Is this your business? Update it
                </Link>
              </p>
            )}
          </section>
        </aside>
      </div>

      {nearby.length > 0 && (
        <section className="mt-12">
          <SectionHeading sub="Closest places of every kind">Nearby</SectionHeading>
          <div className="rail -mx-4 px-4 sm:mx-0 sm:px-0">
            {nearby.map(({ listing: n }) => (
              <PhotoCard key={n.id} listing={n} />
            ))}
          </div>
        </section>
      )}
      <JsonLd data={listingJsonLd(l)} />
    </Container>
  );
}

const yesNo = (b?: boolean) => (b === undefined ? null : b ? "Yes" : "No");
const slots = (s: { name: string; time: string; note?: string }[]) =>
  s.length ? (
    <ul>
      {s.map((x) => (
        <li key={x.name}>
          {x.name}: <span className="font-semibold">{x.time}</span>
          {x.note && <span className="text-muted"> ({x.note})</span>}
        </li>
      ))}
    </ul>
  ) : null;

function TypeDetails({ l }: { l: ListingWithDistances }) {
  let rows: [string, React.ReactNode][] = [];
  if (l.type === "hotel")
    rows = [
      ["Check-in / out", l.checkIn && l.checkOut ? `${l.checkIn} / ${l.checkOut}` : null],
      ["Foreign guests", yesNo(l.acceptsForeigners)],
      ["Amenities", l.amenities.length ? l.amenities.join(", ") : null],
    ];
  if (l.type === "hospital")
    rows = [
      ["Type", l.ownership],
      ["24×7 emergency", yesNo(l.emergency24x7)],
      ["OPD", l.opdTimings.length ? l.opdTimings.map((o) => `${o.days}: ${o.hours}`).join("; ") : null],
      ["Specialties", l.specialties.length ? l.specialties.join(", ") : null],
      ["Ayushman Bharat", yesNo(l.ayushmanBharat)],
    ];
  if (l.type === "temple")
    rows = [
      ["Deity", l.deity],
      ["Opening hours", slots(l.openingHours)],
      ["Aarti", slots(l.aartiTimings)],
      ["Dress code", l.dressCode],
      ["Photography", l.photographyAllowed === undefined ? null : l.photographyAllowed ? "Allowed" : "Not allowed inside"],
    ];
  if (l.type === "ghat")
    rows = [
      ["Aarti", slots(l.aarti)],
      ["Boats", yesNo(l.boatsAvailable)],
      ["What happens here", l.activities.length ? l.activities.join(", ").replace(/-/g, " ") : null],
    ];
  if (l.type === "transport")
    rows = [
      ["Hours", l.operatingHours],
      ["Fares", l.fareInfo],
    ];
  const shown = rows.filter(([, v]) => v !== null && v !== undefined && v !== "");
  if (!shown.length) return null;
  return (
    <section className="mt-10">
      <SectionHeading>Good to know</SectionHeading>
      <dl className="card divide-y divide-border">
        {shown.map(([k, v]) => (
          <div key={k} className="grid gap-1 px-4 py-3 sm:grid-cols-[11rem_1fr]">
            <dt className="text-sm text-muted">{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
