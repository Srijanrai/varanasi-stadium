import Link from "next/link";
import { JsonLd } from "./JsonLd";
import { IconChevron, IconStadium } from "./icons";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo/jsonld";
import { LANDMARKS, formatKm, type LandmarkKey } from "@/lib/geo";
import { formatDate } from "@/lib/format";
import type { Faq } from "@/lib/data/content";

export function Container({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-6xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <>
      <nav aria-label="Breadcrumb" className="pt-4 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {items.map((it, i) => (
            <li key={it.path} className="flex items-center gap-1.5">
              {i > 0 && <IconChevron className="h-3.5 w-3.5" />}
              {i === items.length - 1 ? (
                <span aria-current="page" className="text-ink">
                  {it.name}
                </span>
              ) : (
                <Link href={it.path} className="hover:text-ink">
                  {it.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(items)} />
    </>
  );
}

export function PageIntro({ title, lead, children }: { title: string; lead?: string; children?: React.ReactNode }) {
  return (
    <div className="pt-5 pb-6 sm:pt-8">
      <h1 className="max-w-[22ch] text-[clamp(1.9rem,6vw,2.9rem)]">{title}</h1>
      {lead && <p className="mt-4 max-w-[60ch] text-[1.08rem] text-muted">{lead}</p>}
      {children}
    </div>
  );
}

/** The 5-second answer at the top of a page. */
export function QuickAnswers({ items, checked, title = "Quick answers" }: { items: string[]; checked?: string | null; title?: string }) {
  if (!items.length) return null;
  return (
    <aside aria-label={title} className="card p-5 sm:p-6">
      <h2 className="text-[1.3rem]">{title}</h2>
      <ul className="mt-3 divide-y divide-border">
        {items.map((t) => (
          <li key={t} className="py-2.5">
            {t}
          </li>
        ))}
      </ul>
      {checked && <p className="mt-3 text-xs text-muted">Last checked {formatDate(checked)}</p>}
    </aside>
  );
}

const CHIP_LABELS: Partial<Record<LandmarkKey, string>> = {
  stadium: "to stadium",
  kashiVishwanath: "to Kashi Vishwanath",
  cantt: "to Cantt",
  bhu: "to BHU",
  airport: "to airport",
};

export function DistanceChips({
  distances,
  show = ["stadium", "kashiVishwanath", "cantt"],
}: {
  distances: Record<LandmarkKey, number>;
  show?: LandmarkKey[];
}) {
  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Approximate straight-line distances">
      {show
        .filter((k) => distances[k] > 0.1)
        .map((k) => (
          <li key={k} className={`chip ${k === "stadium" ? "bg-gold-tint text-gold-ink" : "bg-soft text-muted"}`}>
            {k === "stadium" && <IconStadium className="h-3.5 w-3.5" />}
            {formatKm(distances[k])} {CHIP_LABELS[k] ?? LANDMARKS[k].label}
          </li>
        ))}
    </ul>
  );
}

export function FaqList({ faqs, withSchema = true, checked }: { faqs: Faq[]; withSchema?: boolean; checked?: string }) {
  if (!faqs.length) return null;
  return (
    <>
      <div className="card divide-y divide-border overflow-hidden">
        {faqs.map((f) => (
          <details key={f.q} className="group px-4 sm:px-5">
            <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[1.05rem] font-medium [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gold-tint text-gold-ink transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <p className="max-w-[64ch] pb-5 text-muted">{f.a}</p>
          </details>
        ))}
      </div>
      {checked && <p className="mt-2 text-xs text-muted">Answers last checked {formatDate(checked)}</p>}
      {withSchema && <JsonLd data={faqJsonLd(faqs.map((f) => ({ q: f.q, a: f.a })))} />}
    </>
  );
}

export function DraftNotice() {
  return (
    <p role="note" className="mt-5 rounded-2xl bg-danger-tint px-4 py-3 text-sm text-danger">
      Draft, visible only in development. This page isn&apos;t verified yet and won&apos;t be published until it passes the
      checks in the editorial policy.
    </p>
  );
}

export function SectionHeading({
  id,
  children,
  sub,
  action,
}: {
  id?: string;
  children: React.ReactNode;
  sub?: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:mb-5 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
      <div>
        <h2 id={id} className="text-[clamp(1.5rem,4.5vw,2rem)]">
          {children}
        </h2>
        {sub && <p className="mt-1 text-[0.98rem] text-muted">{sub}</p>}
      </div>
      {action && (
        <Link href={action.href} className="group inline-flex shrink-0 items-center gap-1 self-start text-sm font-semibold text-ink underline underline-offset-4 sm:self-auto">
          {action.label}
          <IconChevron className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function Sources({ sources }: { sources: { label: string; url: string }[] }) {
  if (!sources.length) return null;
  return (
    <p className="text-sm text-muted">
      Sources:{" "}
      {sources.map((s, i) => (
        <span key={s.url}>
          {i > 0 && ", "}
          <a href={s.url} rel="noopener nofollow" target="_blank" className="underline underline-offset-2">
            {s.label}
          </a>
        </span>
      ))}
    </p>
  );
}
