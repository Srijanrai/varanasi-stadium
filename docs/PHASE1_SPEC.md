# Phase 1 Spec — Varanasi Stadium & Kashi Guide (Static Frontend MVP)

> Working name: **Varanasi Stadium Guide** (final brand + domain TBD — written as `{domain}` below).
> Goal of Phase 1: ship a fast, content-rich, SEO-optimised **static** website so Google starts crawling and indexing it, while the backend (Phase 3) is built in parallel.
>
> Writing rules, engagement features and sample copy: see `CONTENT_AND_ENGAGEMENT_GUIDE.md` and `/content/drafts/`.

---

## 1. Goals & Non-Goals

### Goals
1. Go live in **2–3 weeks** with real, verified, original content — no empty pages.
2. Every listing (hotel, hospital, temple, ghat, transport stand) gets **its own indexable page** with structured data.
3. URLs and data shapes are **final from day one**, so the Phase 3 backend swaps the data source without changing any URL.
4. Start building an audience: WhatsApp channel + "Get match alerts" sign-up.
5. **Zero copyright / trademark risk** (see §10).

### Non-Goals (Phase 1)
- No backend, database, login, or business portal (Phase 3).
- No payments, bookings, or ticket sales — **ever** for tickets (link to official seller only).
- No ads / AdSense (apply only after ~30+ quality pages and some traffic; Phase 4).

---

## 2. Tech Stack

| Concern | Choice | Reason |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript** | Static generation (`generateStaticParams`) now; server data source later without URL changes |
| Rendering | **SSG** for all pages | Fastest pages, fully crawlable HTML |
| Styling | Tailwind CSS | Fast to build, small CSS |
| Content — listings | **JSON files** in `/content/<type>/*.json` | Mirrors future DB rows 1:1 |
| Content — guides & blog | **MDX** in `/content/guides`, `/content/blog` | Long-form writing with components |
| Validation | **Zod** schemas in `/lib/schema` | Build fails if a listing is missing required fields; same schemas reused by the backend |
| Images | `next/image`, WebP/AVIF, stored in `/public/images/<type>/<slug>/` | Core Web Vitals |
| Hosting | Vercel (free) or Cloudflare Pages | Free, global CDN, auto deploy on git push |
| Analytics | Google Search Console (mandatory) + GA4 **or** Plausible | Indexing + click tracking |
| Forms (temporary) | Google Form / Tally for "List your business" + "Match alerts" | Replaced by the portal in Phase 3 |
| Fonts / Icons | Google Fonts (OFL license) — e.g. *Noto Sans* + *Noto Sans Devanagari*; Lucide icons (ISC license) | Free for commercial use, Hindi support |

**Data access layer:** all pages read data through `/lib/data/*.ts` functions (e.g. `getHotels()`, `getHotelBySlug()`). In Phase 1 these read JSON; in Phase 3 they query the database. **Pages never import JSON directly.**

---

## 3. Information Architecture & URL Structure

Rules: lowercase, hyphenated, English slugs, no dates in URLs, no trailing IDs, **never change a URL once live** (if forced, 301 redirect).

```
/                                         Home
/stadium/                                 Stadium guide (pillar page)
/stadium/how-to-reach/                    Routes from Cantt, Airport, Ghats, BHU, Bus stand
/stadium/matches/                         Upcoming matches (official only) + alert sign-up
/stadium/tickets/                         Honest ticket status + official seller link + scam warning
/stadium/faq/                             Stadium FAQs
/stadium/construction-updates/            Dated progress log (own photos)

/hotels/                                  All hotels (filters: area, price, distance)
/hotels/near-stadium/                     Collection page (≥5 listings to publish)
/hotels/near-kashi-vishwanath/            Collection page
/hotels/near-bhu/                         Collection page
/hotels/<hotel-slug>/                     Hotel detail

/hospitals/                               All hospitals
/hospitals/<hospital-slug>/               Hospital detail

/temples/                                 Temples
/temples/<temple-slug>/                   Temple detail (timings, aarti, dress code)

/ghats/                                   Ghats
/ghats/<ghat-slug>/                       Ghat detail (aarti, boats, activities)

/transport/                               Cab/auto/e-rickshaw stands, ropeway, railway, airport
/transport/<slug>/                        Detail (e.g. /transport/kashi-ropeway/)

/areas/<area-slug>/                       Locality hub (Assi, Godowlia, Lanka, Cantt, Rajatalab…) — lists everything in the area

/guides/<guide-slug>/                     Evergreen guides (e.g. 2-day-kashi-trip-with-a-match)
/blog/                                    News/updates index
/blog/<post-slug>/                        Post

/list-your-business/                      Info + link to form
/about/  /contact/  /disclaimer/  /privacy-policy/  /terms/  /editorial-policy/

/hi/...                                   Hindi versions (same paths under /hi) — see §7
```

**Publish rule:** a category or collection page goes live only when it has **≥5 real listings** (or, for guides, ≥600 words of original content). Until then it does not exist (no "coming soon" pages).

---

## 4. Data Model (mirrors future DB tables)

### 4.1 Base listing (shared by every type)

| Field | Type | Req | Notes |
|---|---|---|---|
| `id` | string (uuid) | ✓ | Stable forever; becomes DB primary key |
| `slug` | string | ✓ | Unique within type; becomes URL |
| `type` | enum `hotel \| hospital \| temple \| ghat \| transport` | ✓ | |
| `name` | string | ✓ | Official business name |
| `nameHi` | string | | Hindi name |
| `area` | string (area slug) | ✓ | Links to `/areas/<area>` |
| `address` | string | ✓ | Full postal address |
| `pincode` | string | ✓ | |
| `geo` | `{ lat: number, lng: number }` | ✓ | Verified on map; drives distance calculations |
| `phone` | string[] | | E.164 format (`+91…`) |
| `whatsapp` | string | | E.164 |
| `website` | url | | Official site only |
| `summary` | string (120–160 chars) | ✓ | Used for meta description |
| `description` | markdown (≥150 words) | ✓ | **Original writing** — never copied |
| `descriptionHi` | markdown | | |
| `photos` | `Photo[]` | ✓ (≥1) | See §4.3 |
| `tags` | string[] | | e.g. `family-friendly`, `budget` |
| `verifiedAt` | ISO date | ✓ | Shown on page as "Last verified on …" |
| `verificationMethod` | enum `phone \| visit \| owner-submitted` | ✓ | |
| `ownerConsent` | boolean | ✓ for owner-submitted | Consent to publish details/photos |
| `status` | enum `published \| draft \| hidden` | ✓ | Only `published` is built |
| `featured` | boolean | | Unused in Phase 1 (default `false`); for paid listings later |
| `createdAt` / `updatedAt` | ISO date | ✓ | `updatedAt` → sitemap `lastmod` |

### 4.2 Type-specific fields

**Hotel**
| Field | Type | Notes |
|---|---|---|
| `category` | enum `hotel \| guest-house \| homestay \| dharamshala \| hostel` | |
| `priceMin` / `priceMax` | number (INR/night) | Shown as range; "approx." label |
| `starRating` | number? | Only if officially classified |
| `amenities` | enum[] | `ac, wifi, parking, restaurant, lift, ganga-view, 24h-checkin, airport-pickup…` |
| `acceptsForeigners` | boolean | (Form C registered) |
| `checkIn` / `checkOut` | string | `"12:00"` |
| `distances` | computed at build | To stadium, Kashi Vishwanath, Cantt station, airport, BHU (Haversine; label "approx. straight-line") |

**Hospital**
| Field | Type | Notes |
|---|---|---|
| `ownership` | enum `government \| private \| trust` | |
| `specialties` | string[] | |
| `emergency24x7` | boolean | |
| `opdTimings` | `{ days: string, hours: string }[]` | |
| `ayushmanBharat` | boolean? | Only if verified |
| `opdRegistrationNotes` | markdown | How to get an OPD card, etc. |

**Temple**
| Field | Type | Notes |
|---|---|---|
| `deity` | string | |
| `openingHours` | `{ open: string, close: string, note?: string }[]` | |
| `aartiTimings` | `{ name: string, time: string }[]` | |
| `dressCode` | string | |
| `photographyAllowed` | boolean | |
| `specialDarshanInfo` | markdown | Link to official booking only |

**Ghat**
| Field | Type | Notes |
|---|---|---|
| `aarti` | `{ name: string, time: string, season?: string }[]` | |
| `activities` | enum[] | `boat-ride, aarti, photography, cremation-site (respectful note)` |
| `boatsAvailable` | boolean | |
| `approxBoatFare` | string | "approx." label + date |

**Transport**
| Field | Type | Notes |
|---|---|---|
| `mode` | enum `cab-stand \| auto-stand \| e-rickshaw \| ropeway \| railway \| airport \| bus` | |
| `operatingHours` | string | |
| `fareInfo` | markdown | Approx. + date checked |
| `routesToStadium` | `{ from: string, distanceKm: number, timeMin: string, fareApprox: string, steps: string[] }[]` | Used on `/stadium/how-to-reach/` |

### 4.3 Photo
| Field | Type | Notes |
|---|---|---|
| `src` | string | Local path under `/public/images` |
| `alt` | string | Descriptive, includes name + area |
| `credit` | string | Photographer / owner |
| `license` | enum `own \| owner-permission \| cc-by \| cc-by-sa \| cc0 \| unsplash` | **Build fails if missing** |
| `sourceUrl` | url | Required for CC images |
| `width` / `height` | number | Prevent layout shift |

### 4.4 Other content types
- **Area**: `slug, name, nameHi, summary, description, geo, highlights[]`.
- **Match**: `id, slug, title, competition, teams?, date?, status: announced | tentative | completed, officialSourceUrl (required), ticketUrl? (official only)`. Only `announced` matches with an official source appear on the site; never publish rumours as fact.
- **Guide / Blog (MDX frontmatter)**: `title, slug, summary, author, publishedAt, updatedAt, coverImage (Photo), tags, sources[] (urls cited for facts)`.

---

## 5. Pages — Content & Components

### 5.1 Home `/`
- Hero: one-line value prop ("Your match-day + Kashi guide") + **Get match alerts** CTA.
- Stadium status card (construction %, next official match or "No match announced yet").
- Category tiles (only categories that are live).
- "Getting to the stadium" quick card → `/stadium/how-to-reach/`.
- Latest 3 blog posts, 6 featured listings (editor-picked, not paid in Phase 1).
- FAQ snippet, disclaimer line.

### 5.2 Stadium pillar `/stadium/`
- Facts table (capacity, location, area, cost — each with a cited source link).
- Design section described in **our own words** with **our own photos/illustrations**.
- Sections linking to how-to-reach, matches, tickets, FAQ, construction updates, nearby hotels.
- Map (OpenStreetMap embed with attribution).

### 5.3 How to reach `/stadium/how-to-reach/`
- One block per origin (Cantt, Airport, Godowlia/Ghats, BHU, Bus stand, Prayagraj side): distance, time, approx. fare, step list, "last checked on" date.
- Match-day tips (leave early, parking, what to carry).

### 5.4 Tickets `/stadium/tickets/`
- Status: "Not on sale" / "On sale at <official seller>".
- **Scam warning** + "We never sell tickets."
- Alert sign-up.

### 5.5 Listing index pages (`/hotels/`, `/hospitals/`, …)
- H1 with intent ("Hotels near Varanasi Cricket Stadium & Kashi").
- 150–300 words of original intro text.
- **Client-side filters** (area, price, amenities, distance) on top of a fully server-rendered list (all listings present in HTML for crawlers).
- Each card: name, area, key facts, distance chips, "Last verified" date, link to detail page.
- Pagination as real URLs if >30 items (`/hotels/page/2/`), not infinite scroll only.

### 5.6 Listing detail pages (`/hotels/<slug>/` etc.)
- Breadcrumbs: Home › Hotels › Area › Name.
- H1 = name + area ("Hotel X, Assi Ghat — Varanasi").
- Photos gallery (with credit), key facts table, distances table, original description.
- Call / WhatsApp / Directions buttons (tracked as events).
- "Last verified on <date>" + "Report incorrect info" link (form).
- **Nearby** section: 4–6 closest listings of other types (temples, hospitals, transport) — internal linking.
- "Is this your business? Claim / update it" → `/list-your-business/`.

### 5.7 Area pages `/areas/<slug>/`
- Original intro to the locality + all listings in it grouped by type + map.

### 5.8 Guides & Blog
- Guides = evergreen ("Kashi in 2 days with a match", "BHU hospital OPD guide").
- Blog = dated news (construction updates, official match announcements). Varanasi-focused only.

### 5.9 Trust pages
- About (who runs it, why), Contact (email + form), **Disclaimer** (unofficial; not affiliated with BCCI/UPCA/IPL/WPL/any government body), Privacy Policy (covers form data; aligned with India's DPDP Act 2023), Terms, **Editorial Policy** (how we verify listings, how often, how to request corrections/removal).

---

## 6. SEO Specification

### 6.1 On-page (every page)
- Unique `<title>` (≤60 chars) and meta description (≤160 chars), generated from data:
  - Hotel: `{name}, {areaName} – Price, Distance to Stadium | {Brand}`
  - Temple: `{name} Varanasi – Timings, Aarti, Dress Code | {Brand}`
  - Hospital: `{name} Varanasi – OPD Timings, Specialties, Contact | {Brand}`
- Exactly one H1; logical H2/H3.
- Self-referencing `<link rel="canonical">`.
- Open Graph + Twitter tags; OG image auto-generated per page (`next/og`, our own template).
- `hreflang` pairs for English/Hindi (`en-IN`, `hi-IN`, `x-default`).
- Visible "Last updated/verified" date.

### 6.2 Structured data (JSON-LD)
| Page | schema.org type |
|---|---|
| Site-wide | `Organization`, `WebSite` (+ `SearchAction` once search exists) |
| Stadium | `StadiumOrArena` |
| Hotel | `Hotel` / `LodgingBusiness` (with `address`, `geo`, `telephone`, `priceRange`, `amenityFeature`) |
| Hospital | `Hospital` |
| Temple | `HinduTemple` |
| Ghat | `TouristAttraction` (+ `Place`) |
| Transport | `TrainStation`, `Airport`, `BusStation`, or `Place` |
| Area | `Place` + `ItemList` of listings |
| Index/collection pages | `ItemList` |
| All nested pages | `BreadcrumbList` |
| Match (official only) | `SportsEvent` |
| Blog/Guide | `Article` / `BlogPosting` |
| FAQ | `FAQPage` (helps understanding; rich results now limited, so don't depend on them) |

**Never** add fake `aggregateRating` / reviews — Google penalises self-made ratings.

### 6.3 Technical
- `sitemap.xml` split by type (`sitemap-hotels.xml`, …) with real `lastmod` from `updatedAt`.
- `robots.txt` allowing all, pointing to sitemaps.
- Clean 404 page (real 404 status), no soft-404s.
- Trailing-slash policy fixed (pick one, redirect the other).
- `www` vs non-`www` and `http` → `https` redirects.
- Core Web Vitals targets: LCP < 2.5s, CLS < 0.1, INP < 200ms on mid-range Android over 4G. Lighthouse ≥ 90 for Performance, SEO, Accessibility, Best Practices.
- Images: explicit width/height, lazy below the fold, descriptive filenames (`hotel-ganga-view-assi-ghat-1.webp`).
- No content hidden behind JS; filters enhance, never replace, server HTML.

### 6.4 Content quality rules (what makes listing SEO actually work)
- **Every listing description is original**, ≥150 words, written from our own verification (call/visit), covering what a visitor really needs (distance to stadium/temple, who it suits, practical tips).
- No templated "spun" text across listings; collection pages only when ≥5 listings.
- NAP (Name, Address, Phone) exactly consistent with the business's Google Business Profile.
- Internal links: every detail page links to its area, its category, and ≥4 nearby listings; every guide links to ≥5 listings.
- Cite sources for facts (stadium capacity, cost, timelines) — link to the original news/official page.

### 6.5 Launch-day SEO checklist
- [ ] Domain verified in **Google Search Console** + **Bing Webmaster Tools**
- [ ] Sitemaps submitted
- [ ] Request indexing for Home, Stadium, How-to-reach, Hotels index
- [ ] Rich Results Test passes for one page of each type
- [ ] Brand's own Google Business Profile is **not** needed (we're a website, not a local business) — skip
- [ ] Share to WhatsApp channel / Instagram / local Facebook groups for first visits and links

---

## 7. Hindi / English

- English at root, Hindi under `/hi/` with **identical slugs** (e.g. `/hi/hotels/<slug>/`).
- Phase 1 scope: Hindi versions of **Home, Stadium pillar, How to reach, Tickets, Temples, Ghats**. Listings show `nameHi`/`descriptionHi` when present; Hindi listing pages ship only when `descriptionHi` exists (avoid half-translated pages).
- Proper human-written Hindi (no raw machine translation published unreviewed).
- Language switcher links to the equivalent page, not the home page.

---

## 8. Folder Structure

```
varanasi-stadium-guide/
├─ app/
│  ├─ (en)/...                 route segments per §3
│  ├─ hi/...                   Hindi routes
│  ├─ sitemap-*.xml/route.ts
│  └─ robots.ts
├─ components/                 UI (ListingCard, FactsTable, Breadcrumbs, JsonLd, Map, AlertCTA…)
├─ content/
│  ├─ hotels/<slug>.json
│  ├─ hospitals/<slug>.json
│  ├─ temples/<slug>.json
│  ├─ ghats/<slug>.json
│  ├─ transport/<slug>.json
│  ├─ areas/<slug>.json
│  ├─ matches/<slug>.json
│  ├─ guides/<slug>.mdx
│  └─ blog/<slug>.mdx
├─ lib/
│  ├─ schema/                  Zod schemas (reused by backend in Phase 3)
│  ├─ data/                    data access layer (JSON now → DB later)
│  ├─ seo/                     title/description builders, JSON-LD builders
│  └─ geo.ts                   Haversine distances to landmarks
├─ public/images/<type>/<slug>/
└─ docs/PHASE1_SPEC.md
```

---

## 9. Launch Content Quota (minimum before going live)

| Content | Minimum |
|---|---|
| Hotels (verified by phone/visit) | **30** (≥10 near stadium/Rajatalab route, ≥10 ghat area, ≥5 near BHU) |
| Hospitals | **10** (BHU Sir Sundarlal, Mahamana cancer centre, major private & govt) |
| Temples | **10** |
| Ghats | **10** |
| Transport | **8** (Cantt, Banaras station, airport, bus stand, ropeway, key auto/cab stands) |
| Areas | **6** |
| Guides | **3** (Stadium how-to-reach, 2-day Kashi + match, BHU hospital OPD guide) |
| Blog posts | **5** (construction update w/ own photos, ropeway, Ranji/WPL official news, etc.) |
| Trust pages | All 6 |

After launch: **2–3 posts/guides per week**, re-verify every listing every **90 days** (`verifiedAt`).

---

## 10. Copyright, Trademark & Legal Rules (non-negotiable)

1. **Text:** all text written by us. Facts (timings, capacity, addresses) are not copyrightable, but **wording is** — never copy sentences from news sites, Justdial, TripAdvisor, Google Maps, Wikipedia, or competitor sites (e.g. varanasistadium.com). Cite sources for facts with a link.
2. **Data sources:** do **not** scrape Google Maps / Justdial / TripAdvisor / MakeMyTrip (their terms forbid it). Allowed: our own calls/visits, owner submissions, official government pages (facts), **OpenStreetMap** (ODbL — show "© OpenStreetMap contributors" attribution).
3. **Images:** only (a) our own photos, (b) photos owners send with written permission (consent checkbox on the form), (c) CC0 / Unsplash / Wikimedia Commons CC-BY/CC-BY-SA **with attribution and license link**. **Never** use news-agency photos, Google images, or official stadium renders without written permission. Respect no-photography rules inside temples (e.g. Kashi Vishwanath sanctum).
4. **Trademarks:** BCCI, UPCA, IPL, WPL, TATA, BookMyShow etc. may be **mentioned in text** only to describe facts (nominative use). **No logos**, no colours/designs imitating official sites, no domain or brand name implying officialness.
5. **Disclaimer** in footer of every page: *"Independent, unofficial guide. Not affiliated with BCCI, UPCA, IPL, WPL or any government body. We do not sell tickets."*
6. **Personal data:** forms collect only name, phone, email, business details; privacy policy explains purpose, retention and deletion request process (DPDP Act 2023).
7. **Fonts/icons/libraries:** only permissively licensed (OFL, MIT, ISC, Apache-2.0). Keep a `CREDITS.md` listing image credits and third-party licenses.
8. **Fees / prices** shown as "approx., checked on <date>" to avoid misrepresentation.

---

## 11. Analytics & Events

- Search Console: impressions, queries, indexing coverage (primary Phase 1 KPI).
- Events: `click_call`, `click_whatsapp`, `click_directions`, `click_website`, `alert_signup`, `list_business_click` — each with `listingId` + `type`. These numbers become the sales pitch for paid listings in Phase 4.

### Phase 1 success metrics (first 8–12 weeks)
| Metric | Target |
|---|---|
| Pages indexed (Search Console) | ≥ 80% of submitted |
| Impressions / month | ≥ 10,000 |
| WhatsApp channel followers | ≥ 500 |
| Business sign-ups via form | ≥ 20 |

---

## 12. Timeline (≈3 weeks)

| Week | Work |
|---|---|
| 1 | Domain + brand, repo setup, Zod schemas, data layer, layout, design system, Home + Stadium pages. **In parallel:** start collecting/verifying listing data and photos. |
| 2 | Listing index + detail pages for all types, area pages, JSON-LD, sitemaps, robots, OG images, filters. |
| 3 | Guides + blog, Hindi pages, trust pages, Lighthouse/Rich Results pass, content quota filled → **Go live**, Search Console submission. |

---

## 13. Hand-off to Phase 3 (Backend)

- Zod schemas in `/lib/schema` → DB tables (same field names).
- `/lib/data/*` swapped from JSON reads to DB queries; switch pages from pure SSG to **ISR** (incremental static regeneration) so new/edited listings appear without full rebuilds.
- `id` and `slug` values carried over unchanged → **no URL changes, no ranking loss**.
- Google Form submissions → imported as `owner-submitted` listings in the portal.

---

## 14. Open Decisions

1. Brand name + domain.
2. GA4 vs Plausible (privacy-friendly, paid).
3. Vercel vs Cloudflare Pages.
4. Who writes Hindi content (self / freelancer).
