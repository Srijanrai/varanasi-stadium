# Content & Engagement Guide

Companion to `PHASE1_SPEC.md`. Read this before writing a single page.

---

## Part A — How Google actually judges content (so we don't get pushed down)

Google does **not** penalise content just because a tool helped write it. It pushes down content that is:
- **Unhelpful** — written for search engines, not people ("Varanasi stadium Varanasi stadium tickets Varanasi…").
- **Scaled / templated** — hundreds of near-identical pages with names swapped ("scaled content abuse" policy).
- **Unoriginal** — rewritten from other sites with nothing new added.
- **Untrustworthy** — no author, no sources, outdated facts, fake reviews.

What Google rewards is summed up as **E-E-A-T**: *Experience, Expertise, Authoritativeness, Trust*. For us, **Experience is the winning card** — we are local, we can visit, call, take photos and tell people things only a local knows.

### The 10 writing rules

1. **Write like you're answering a friend on WhatsApp.** Short sentences. Plain words. "Leave at least 2 hours early" beats "It is advisable to commence one's journey well in advance."
2. **Answer first, explain after.** The first line of every FAQ answer must answer the question. Details come next.
3. **Add something only a local knows** in every page: a shortcut, a timing trick, a "don't do this" warning, a price you actually paid. If a page has nothing first-hand, it isn't ready.
4. **Say "I / we" where it's true.** "When we drove from Cantt on a weekday at 5 pm, it took 50 minutes." Real experience = trust.
5. **Be honest about uncertainty.** "No official date yet" is better than guessing. Never present rumours as facts.
6. **Date everything that changes.** Fares, timings, construction progress → "checked on 25 Oct 2026".
7. **Cite facts.** Capacity, cost, timelines → link to the original source.
8. **No keyword stuffing.** Use the main phrase naturally once in the title, once in the first paragraph, and then just write normally. Use natural variations ("Ganjari stadium", "Banaras cricket ground", "the new stadium").
9. **No filler.** Delete any sentence that would fit on any city's website ("Varanasi is a city of rich culture and heritage…").
10. **Every listing description is different** because every place is different. If two hotel descriptions could be swapped without anyone noticing, rewrite both.

### Words & phrases to avoid (they read as generic/robotic)
"In today's fast-paced world", "nestled", "a testament to", "look no further", "unlock", "elevate your experience", "hidden gem" (unless it really is), "it is important to note that", "in conclusion", "delve", "seamless", "vibrant tapestry", "whether you're a … or a …".

### Hindi content
- Write the way people in Banaras actually speak and search — simple Hindi, English words where people use them ("टिकट", "स्टेडियम", "ऑटो", "रूट").
- Not a word-for-word translation of the English page. Re-write it for a Hindi reader.
- Use Devanagari script, not Roman Hindi, on `/hi/` pages.

### Before publishing — self-check
- [ ] Does the first line answer the question?
- [ ] Is there at least one first-hand detail?
- [ ] Are all changing facts dated and sourced?
- [ ] Would a local read this and nod, or cringe?
- [ ] Read it aloud. Does it sound like a person?
- [ ] All `[VERIFY]` and `[ADD FIRST-HAND]` tags removed?

---

## Part B — Engagement (keep people on the site, bring them back)

Engagement signals (people staying, clicking deeper, coming back) help indirectly, and they're what turns visitors into an audience you can monetise.

### Must-have in Phase 1 (frontend only, no backend needed)

| Feature | Where | Why it works |
|---|---|---|
| **Quick-answer box** at the top (3–4 bullet facts) | Stadium, how-to-reach, temple, hospital pages | Visitor gets the answer in 5 seconds → trusts the site → scrolls further |
| **Distance chips** ("🏟 12 km to stadium · 🛕 2 km to Kashi Vishwanath") | Every listing card & page | The one thing Google Maps doesn't show at a glance for match-day planning |
| **Sticky mobile action bar**: Call · WhatsApp · Directions | Listing pages (mobile) | Most visitors are on phones; one-tap actions = tracked clicks for future paid listings |
| **Stadium status card**: progress %, last update date, next official match or "Not announced yet" | Home + stadium page | Reason to come back; frequently updated |
| **Countdown** to the first official match (only when officially announced) | Home + matches page | Excitement + repeat visits |
| **"Plan my match day" planner** — pick where you're staying + match time → shows when to leave, route, nearby food, what to do after | `/stadium/how-to-reach/` | Interactive, genuinely useful, highly shareable. Pure client-side JS using the same JSON data |
| **"After the match" cards** — Ganga aarti, food spots, temples within X km | Stadium pages | Moves users from the stadium section into the rest of the site |
| **Nearby section** (4–6 places of other types) | Every listing | Internal links + longer sessions |
| **WhatsApp share button** with a pre-filled message | Guides, routes, matches | This is how Indians share — every share is free traffic |
| **Match-alert CTA** (inline, not a popup) | End of every stadium-related page | Builds the WhatsApp audience |
| **Construction timeline** with our own dated photos | `/stadium/construction-updates/` | Unique content nobody else has; reason to revisit |
| **"Last verified" badge + "Report wrong info" link** | Every listing | Trust; and gives you free corrections |
| **Language switcher** (EN ⇄ हिन्दी) to the same page | Header | Wider audience |

### Nice-to-have (Phase 2, still frontend)
- Simple **quiz / poll** ("Which IPL team would you like to see in Varanasi?") — client-side only, shareable result card.
- **Photo gallery of Kashi** by locals (with written permission).
- **Printable / save-to-phone match-day checklist** (PDF/image).

### Things that HURT ranking or engagement — don't do them
- ❌ **Full-screen popups** on mobile (Google penalises intrusive interstitials). Use inline CTAs or a small bottom banner.
- ❌ Auto-playing video / sound.
- ❌ Fake urgency ("Only 2 tickets left!") — we don't sell tickets.
- ❌ Infinite scroll without real paginated URLs.
- ❌ Heavy animations that slow down the page on cheap phones.
- ❌ Hiding content behind "Read more" clicks for the main answer.

### Design direction (v5, approved mockup — colours sampled from it)
Reference: `docs/design-reference/mockup-2026-10-25.jpeg`. All values below were measured from that image.

| Token | Hex | Used for |
|---|---|---|
| Page background | `#fbfaf8` | Near-white page (not cream) |
| Card | `#ffffff` | Cards, faint shadow, almost no border |
| Header / footer navy | `#021e3a` | Header, footer, navy chips |
| Bottom nav navy | `#00182c` | Phone bottom bar |
| Ink | `#0d1b36` | Headings and main text |
| Muted | `#6b6f78` | Secondary text |
| Bright gold | `#f6c35f` | Hero button, "Kashi", active nav, eyebrow on dark |
| Deep gold | `#d99a2b` | Search button, progress bar, category icons |
| Link gold-brown | `#95621a` | Links on light backgrounds |
| Gold tint | `#fbf1e1` | Category circles, construction icon tile |
| Cream / strong cream | `#f8f0dc` / `#f4e0b8` | Planner card / "Leave by" panel |
| Red / red tint | `#dc2f2f` / `#fde9e8` | "Not on sale", warning icons |
| Orange tint | `#fdf0e6` | Ropeway icon circle, airport distance tile |
| Teal tint | `#e0f4f4` | Stadium distance tile |
| Green / green tint | `#0a8f5c` / `#e3f4ec` | Call, WhatsApp, "Verified" |

- **Type:** Figtree for everything (headings 800 with tight tracking, body 400–600); Hind covers Hindi text.
- **Theme:** light by default; dark only when the visitor picks it with the toggle (saved per browser).
- **Hero photo** gets a warm sunset colour grade to match the mockup's golden tone.
- **No fake ratings.** "Verified" replaces the mockup's star ratings until real reviews exist.
- Every image falls back to the navy/gold placeholder.

---

## Part C — Page template for FAQ sections

```
## Frequently asked questions

### <Question exactly how people would ask it>
<One-line direct answer.> <1–3 sentences of useful detail or a local tip.> <Source link / "checked on <date>" if it can change.>
```

- 6–12 questions per page, taken from real searches (Google "People also ask", Search Console queries once live, questions people ask on WhatsApp groups).
- Don't repeat the same FAQ on multiple pages — each page gets questions about **its own topic**.
- Mark up with `FAQPage` JSON-LD, but write it for humans first.

Ready-to-edit drafts are in `/content/drafts/`.
