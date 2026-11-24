import { SITE, absoluteUrl } from "@/lib/site";
import { getNextMatch, getPosts, getStadium } from "@/lib/data/content";
import { getListings } from "@/lib/data/listings";
import { listingUrl } from "@/lib/seo/jsonld";
import { HINDI_LISTING_PAIRS } from "@/lib/hindi";

// A plain-text guide to the site for AI tools (the proposed llms.txt convention).
// Built from the same data as the pages, so it changes whenever they do.
export const dynamic = "force-static";

export function GET() {
  const s = getStadium();
  const next = getNextMatch();
  const facts = s.facts.map((f) => `- ${f.label}: ${f.value}`).join("\n");
  const listings = getListings()
    .filter((l) => l.status === "published")
    .map((l) => `- [${l.name}](${absoluteUrl(listingUrl(l))}): ${l.summary}`)
    .join("\n");
  const posts = (["guides", "festivals", "blog"] as const)
    .flatMap((k) => getPosts(k).filter((p) => p.status === "published").map((p) => ({ ...p, kind: k })))
    .map((p) => `- [${p.title}](${absoluteUrl(`/${p.kind}/${p.slug}/`)}): ${p.summary} (updated ${p.updatedAt})`)
    .join("\n");
  const hindiListings = Object.values(HINDI_LISTING_PAIRS)
    .map((p) => `- ${absoluteUrl(p)}`)
    .join("\n");

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.disclaimer} Every fact on the site shows when it was last checked and links to its source.

## Stadium status (last checked ${s.lastChecked})

- Construction: about ${s.progressPercent}% complete. ${s.progressNote}
- First match: ${next ? `${next.title}, ${next.date ?? "date to be confirmed"}` : s.firstMatchNote}
- Tickets: ${s.ticketStatus === "on-sale" && s.ticketSeller ? `on sale at ${s.ticketSeller.name} (${s.ticketSeller.url})` : "not on sale; no official tickets exist yet"}
${facts}

## Stadium pages

- [Varanasi International Cricket Stadium (Ganjari)](${absoluteUrl("/stadium/")}): status, key facts and common questions
- [Match schedule](${absoluteUrl("/stadium/matches/")}): only fixtures officially announced by BCCI or UPCA
- [Tickets](${absoluteUrl("/stadium/tickets/")}): sale status, price and how to avoid ticket scams
- [How to reach](${absoluteUrl("/stadium/how-to-reach/")}): location, distances and routes from Cantt, the ghats, BHU and the airport
- [Construction updates](${absoluteUrl("/stadium/construction-updates/")}): dated progress notes with sources

## Hindi pages

- ${absoluteUrl("/hi/stadium/")}
- ${absoluteUrl("/hi/stadium/matches/")}
- ${absoluteUrl("/hi/stadium/tickets/")}
- ${absoluteUrl("/hi/stadium/how-to-reach/")}
${hindiListings}

${posts ? `## Guides and news\n\n${posts}\n\n` : ""}## Places in Varanasi

${listings}

## About

- [About us](${absoluteUrl("/about/")})
- [How we check listings](${absoluteUrl("/editorial-policy/")})
- Contact: ${SITE.email}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
