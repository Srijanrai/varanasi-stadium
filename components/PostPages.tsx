import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getPosts, type Post, type PostKind } from "@/lib/data/content";
import { getCategoryByPath } from "@/lib/categories";
import { getListing } from "@/lib/data/listings";
import { articleJsonLd, eventJsonLd, listingUrl } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/format";
import { formatKm } from "@/lib/geo";
import { JsonLd } from "./JsonLd";
import { Photo, PhotoCredit } from "./Photo";
import { AlertCta } from "./AlertCta";
import { ShareWhatsApp } from "./ShareWhatsApp";
import { IconCalendar, IconChevron, IconPin } from "./icons";
import { Stay22Map } from "./Stay22Map";
import { Breadcrumbs, Container, DraftNotice, FaqList, PageIntro, SectionHeading, Sources } from "./ui";

const LABEL: Record<PostKind, string> = { blog: "News", guides: "Guides", festivals: "Festivals" };

/** "Fri, 15 Jan 2027", or a range when the festival runs over several days. */
function eventDate(e: NonNullable<Post["event"]>) {
  const f = (iso: string) =>
    new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Kolkata",
    });
  return e.endDate && e.endDate !== e.startDate ? `${f(e.startDate)} – ${f(e.endDate)}` : f(e.startDate);
}

export function hasPublishedPosts(kind: PostKind) {
  return getPosts(kind).some((p) => p.status === "published");
}

function Meta({ p }: { p: Post }) {
  return (
    <>
      <time dateTime={p.updatedAt}>
        {p.updatedAt !== p.publishedAt ? `Updated ${formatDate(p.updatedAt)}` : formatDate(p.publishedAt)}
      </time>
      {" · "}
      {p.readingMinutes} min read
    </>
  );
}

export function PostIndex({ kind, title, lead }: { kind: PostKind; title: string; lead: string }) {
  const posts = getPosts(kind);
  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: LABEL[kind], path: `/${kind}/` }]} />
      <PageIntro title={title} lead={lead} />
      {posts.length === 0 ? (
        <p className="bg-soft p-5">Nothing here yet. Our first pieces are on the way.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {posts.map((p) => (
            <li key={p.slug}>
              <Link href={`/${kind}/${p.slug}/`} className="card group flex h-full flex-col p-5 sm:p-6">
                <span className="text-xs font-semibold text-gold-ink">
                  {p.event ? (
                    <>
                      <IconCalendar className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
                      {eventDate(p.event)}
                    </>
                  ) : (
                    <Meta p={p} />
                  )}
                </span>
                <h2 className="mt-2 text-[1.35rem] leading-snug group-hover:text-gold-ink">{p.title}</h2>
                <p className="mt-2 text-muted">{p.summary}</p>
                {p.status === "draft" && <span className="mt-3 text-xs font-semibold text-danger">Draft</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}

/** The listing a post is about, if it's set in the frontmatter and published. */
function placeFor(p: Post) {
  if (!p.place) return null;
  const [catPath, slug] = p.place.split("/");
  const c = getCategoryByPath(catPath);
  return c ? (getListing(c.type, slug) ?? null) : null;
}

function relatedPosts(kind: PostKind, p: Post, limit = 3) {
  const others = getPosts(kind).filter((x) => x.slug !== p.slug);
  const score = (x: Post) => x.tags.filter((t) => p.tags.includes(t)).length + (x.place && x.place === p.place ? 2 : 0);
  return others.sort((a, b) => score(b) - score(a)).slice(0, limit);
}

export function PostView({ kind, slug }: { kind: PostKind; slug: string }) {
  const p = getPost(kind, slug);
  if (!p) notFound();
  const path = `/${kind}/${p.slug}/`;
  const place = placeFor(p);
  const related = relatedPosts(kind, p);

  return (
    <Container>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: LABEL[kind], path: `/${kind}/` },
          { name: p.title, path },
        ]}
      />
      <article>
        <PageIntro title={p.title} lead={p.summary}>
          <p className="mt-4 text-sm text-muted">
            By {p.author} · Published {formatDate(p.publishedAt)}
            {p.updatedAt !== p.publishedAt && <> · Updated {formatDate(p.updatedAt)}</>} · {p.readingMinutes} min read
          </p>
          {p.status === "draft" && <DraftNotice />}
        </PageIntro>

        {p.event && (
          <div className="mb-8 flex max-w-[66ch] items-start gap-4 rounded-2xl bg-[var(--cream)] p-5">
            <span className="icon-tile h-11 w-11 shrink-0">
              <IconCalendar className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold tracking-[0.1em] text-muted">NEXT DATE</p>
              <p className="mt-0.5 text-lg font-bold">{eventDate(p.event)}</p>
              {p.event.dateNote && <p className="mt-1 text-sm text-muted">{p.event.dateNote}</p>}
            </div>
          </div>
        )}

        {p.photos[0] && (
          <figure className="mb-8">
            <Photo photo={p.photos[0]} aspect="aspect-[16/9]" sizes="(min-width:1152px) 1104px, 100vw" priority className="rounded-[20px]" />
            <PhotoCredit photo={p.photos[0]} className="mt-1.5" />
          </figure>
        )}

        {p.toc.length >= 3 && (
          <nav aria-label="In this guide" className="mb-8 max-w-[66ch] rounded-2xl bg-soft p-5">
            <p className="text-xs font-semibold tracking-[0.1em] text-muted">IN THIS GUIDE</p>
            <ol className="mt-2 list-decimal space-y-1.5 pl-5">
              {p.toc.map((t) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="link">
                    {t.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Markdown from our own repo files — trusted content. */}
        <div className="prose-local" dangerouslySetInnerHTML={{ __html: p.html }} />

        {place && (
          <Link href={listingUrl(place)} className="card group mt-10 flex max-w-[66ch] items-start gap-4 p-5">
            <span className="icon-tile h-11 w-11 shrink-0">
              <IconPin className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-semibold tracking-[0.1em] text-muted">PLACE IN THIS GUIDE</span>
              <span className="mt-0.5 block font-semibold group-hover:text-gold-ink">{place.name}</span>
              <span className="mt-1 block text-sm text-muted">
                {formatKm(place.distances.stadium)} from the stadium · timings, map and how to get there
              </span>
            </span>
            <IconChevron className="mt-3 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}

        {p.faqs.length > 0 && (
          <section className="mt-12 max-w-3xl" aria-labelledby="faq">
            <SectionHeading id="faq">Questions people ask</SectionHeading>
            <FaqList faqs={p.faqs} checked={p.updatedAt} />
          </section>
        )}

        {kind === "festivals" && place && (
          <div className="max-w-[66ch]">
            <Stay22Map name={place.name} geo={place.geo} campaign={`festival-${p.slug}`} />
          </div>
        )}

        {(kind === "guides" || kind === "festivals") && (
          <aside role="note" className="mt-10 max-w-[66ch] rounded-2xl bg-soft p-5 text-sm leading-relaxed">
            <p className="font-semibold">This information may change</p>
            <p className="mt-1 text-muted">
              {kind === "festivals" ? "Dates, timings, crowd arrangements and rules on this page" : "Timings, fares, distances and rules in this guide"} come from the sources listed below and were last reviewed
              on {formatDate(p.updatedAt)}. They can change with the season, festivals, crowd control or official notices,
              so please confirm locally before you go.{" "}
              <Link href="/contact/" className="link">
                Spotted something out of date? Tell us
              </Link>
              .
            </p>
          </aside>
        )}

        <div className="mt-8 space-y-4">
          <Sources sources={p.sources} />
          <ShareWhatsApp text={p.title} />
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-14">
          <SectionHeading action={{ href: `/${kind}/`, label: `All ${LABEL[kind].toLowerCase()}` }}>Keep reading</SectionHeading>
          <ul className="grid gap-4 md:grid-cols-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/${kind}/${r.slug}/`} className="card group block h-full p-5">
                  <span className="text-xs font-semibold text-gold-ink">
                    <Meta p={r} />
                  </span>
                  <h3 className="mt-2 text-[1.1rem] font-bold leading-snug group-hover:text-gold-ink">{r.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{r.summary}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-14">
        <AlertCta from={`${kind}-post`} />
      </div>
      <JsonLd data={articleJsonLd(p, path)} />
      {p.event && <JsonLd data={eventJsonLd(p.event, p, path, place?.name)} />}
    </Container>
  );
}

export function postParams(kind: PostKind) {
  return getPosts(kind).map((p) => ({ slug: p.slug }));
}
