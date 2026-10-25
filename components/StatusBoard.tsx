import Link from "next/link";
import type { Stadium } from "@/lib/data/content";
import type { Match } from "@/lib/schema/listing";
import { formatDate } from "@/lib/format";
import { IconCalendar, IconCrane, IconTicket } from "./icons";

/** Three status cards: construction (with progress bar), first match, tickets. */
export function StatusBoard({
  stadium,
  nextMatch,
  lang = "en",
}: {
  stadium: Stadium;
  nextMatch?: Match;
  lang?: "en" | "hi";
}) {
  const hi = lang === "hi";
  const t = hi
    ? { built: "निर्माण", match: "पहला मैच", tickets: "टिकट", none: "घोषित नहीं", noSale: "बिक्री शुरू नहीं", onSale: "बिक्री जारी", checked: "आख़िरी जाँच", builtNote: "2026 के बीच की ख़बरों के अनुसार", matchNote: "अभी कोई आधिकारिक तारीख़ नहीं", ticketNote: "हम टिकट नहीं बेचते" }
    : { built: "Construction progress", match: "First match", tickets: "Tickets", none: "Not announced", noSale: "Not on sale", onSale: "On sale", checked: "Last checked", builtNote: "Nearly built, per mid-2026 reports.", matchNote: "No official date yet.", ticketNote: "We never sell tickets." };
  const ticketsOpen = stadium.ticketStatus === "on-sale";

  const cards = [
    { label: t.built, value: `~ ${stadium.progressPercent}%`, note: t.builtNote, href: "/stadium/construction-updates/", Icon: IconCrane, danger: false, progress: stadium.progressPercent },
    { label: t.match, value: nextMatch?.date ? formatDate(nextMatch.date, hi ? "hi-IN" : "en-IN") : t.none, note: t.matchNote, href: "/stadium/matches/", Icon: IconCalendar, danger: false, redIcon: true },
    { label: t.tickets, value: ticketsOpen ? t.onSale : t.noSale, note: t.ticketNote, href: "/stadium/tickets/", Icon: IconTicket, danger: !ticketsOpen },
  ];

  return (
    <section aria-label={hi ? "स्टेडियम की स्थिति" : "Stadium status"}>
      <ul className="grid grid-cols-3 gap-2.5 sm:gap-4">
        {cards.map((c) => (
          <li key={c.label}>
            <Link
              href={c.href}
              className="card flex h-full flex-col items-center gap-2 p-3 text-center transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-start sm:gap-4 sm:p-5 sm:text-left"
            >
              <span className={`icon-tile h-11 w-11 shrink-0 !rounded-xl sm:h-14 sm:w-14 ${c.danger || "redIcon" in c ? "!bg-danger-tint !text-danger" : "!text-gold-deep"}`}>
                <c.Icon className="h-7 w-7 [stroke-width:1.9]" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col sm:gap-0.5">
                <span className="order-2 text-[0.72rem] text-muted sm:order-1 sm:text-sm sm:font-semibold sm:text-ink">{c.label}</span>
                <span className={`order-1 text-[0.76rem] font-bold leading-tight whitespace-nowrap sm:whitespace-normal sm:order-2 sm:text-[1.5rem] ${"progress" in c ? "font-sans text-[1.1rem]" : "font-sans sm:font-serif"} ${c.danger ? "text-danger" : ""}`}>{c.value}</span>
                {"progress" in c && c.progress !== undefined && (
                  <span className="order-3 mt-2 hidden h-2.5 overflow-hidden rounded-full bg-gold-tint sm:block" aria-hidden>
                    <span className="block h-full rounded-full bg-gold-deep" style={{ width: `${c.progress}%` }} />
                  </span>
                )}
                <span className="order-4 mt-1.5 hidden text-xs text-muted sm:block">{c.note}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 text-xs text-muted sm:text-right">
        {t.checked}: {formatDate(stadium.lastChecked, hi ? "hi-IN" : "en-IN")}
      </p>
    </section>
  );
}
