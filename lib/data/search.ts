import "server-only";
import { getListings } from "./listings";
import { getArea } from "./content";
import { listingUrl } from "../seo/jsonld";
import { getCategoryByType } from "../categories";

export type SearchItem = { title: string; sub: string; href: string; kind: string; keywords: string };

const PAGES: SearchItem[] = [
  { title: "Stadium guide", sub: "Status, facts and FAQs", href: "/stadium/", kind: "stadium", keywords: "ganjari rajatalab cricket stadium" },
  { title: "How to reach the stadium", sub: "Routes, timings, leave-by planner", href: "/stadium/how-to-reach/", kind: "stadium", keywords: "route cab auto distance planner" },
  { title: "Tickets", sub: "Are tickets on sale?", href: "/stadium/tickets/", kind: "stadium", keywords: "ticket booking scam price" },
  { title: "Matches", sub: "Officially announced fixtures", href: "/stadium/matches/", kind: "stadium", keywords: "ipl wpl ranji schedule fixture" },
  { title: "Construction updates", sub: "Progress, with sources", href: "/stadium/construction-updates/", kind: "stadium", keywords: "progress opening date" },
];

/** Small index shipped to the browser for instant search. */
export function getSearchIndex(): SearchItem[] {
  const listings = getListings().map((l) => ({
    title: l.name,
    sub: `${getCategoryByType(l.type).singular} • ${getArea(l.area)?.name ?? "Varanasi"}`,
    href: listingUrl(l),
    kind: l.type,
    keywords: [l.nameHi, l.area, ...l.tags].filter(Boolean).join(" "),
  }));
  return [...PAGES, ...listings];
}
