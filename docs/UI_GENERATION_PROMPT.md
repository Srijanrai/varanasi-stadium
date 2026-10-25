# UI generation prompt — Varanasi Stadium Guide

Copy everything between the two lines below into ChatGPT / Claude / v0 / Lovable / Bolt.

---

## Role

You are a senior product designer and front-end engineer. Design and build the **UI** for a mobile-first website. The functionality and content are fixed (listed below). Your job is to make it **simple, appealing and elegant**, the kind of site people come back to.

## The product

**Varanasi Stadium Guide**: an independent, unofficial local guide to the new international cricket stadium being built at **Ganjari, near Rajatalab, Varanasi (Uttar Pradesh, India)**, and to everything a visitor needs around a match: how to get there, where to stay, temples, ghats, hospitals and transport.

- **Audience:** cricket fans from Varanasi, eastern UP and Bihar; pilgrims and tourists combining a match with a Kashi trip; families of patients coming to Varanasi hospitals. Mostly on **mid-range Android phones over 4G**. Bilingual: English and Hindi.
- **Tone:** local, honest, calm, trustworthy. Never hype. Clearly says what is confirmed and what isn't.
- **Business model (later):** featured hotel listings, local sponsors, affiliate links. Not visible in this phase.
- **Important honesty rules shown in the UI:** the site is unofficial (not affiliated with BCCI, UPCA, IPL, WPL or any government body); **we never sell tickets**; every listing shows when it was last checked.

## Design brief

- Simple, appealing, elegant. Generous whitespace, clear hierarchy, few colours, beautiful photography.
- Photo-led like modern travel/event apps (Airbnb, District by Zomato), but with a refined, Indian, Banaras-specific character. Avoid a generic "AI template" look: no gradient blobs, no rows of identical icon-in-a-coloured-square cards, no emoji, no all-caps labels everywhere.
- One brand colour for actions, one fine accent for details, neutral background. Propose your own palette; it should feel rooted in Banaras (silk, ghats, river, evening aarti) without being kitschy.
- Typography must support **Devanagari (Hindi) and English** equally well. Suggest a display + body pairing from Google Fonts.
- Light and dark mode.
- **Mobile-first** (360–430px), then tablet and desktop. Thumb-friendly targets (≥44px). No horizontal page scroll.
- Accessibility: WCAG AA contrast, visible focus states, semantic HTML, alt text, respects reduced motion.
- Performance: fast on cheap phones. Minimal JS, lazy-loaded images, no heavy animation. One subtle motion moment at most.
- **Every image needs a designed placeholder** (used when there is no photo or the image fails to load): on-brand pattern/colour, a thin category icon, the place name, and "Photo coming soon".
- No popups or interstitials (bad for mobile SEO). Sign-up prompts are inline.

## Tech output

- Next.js (App Router) + TypeScript + Tailwind CSS. Reusable components. Use the sample data below as typed mock data.
- Keep pages server-rendered and crawlable; only interactive parts (search, filters, planner, menus) are client components.
- Deliver: design tokens (colours, type scale, spacing, radius), the component library, and all pages listed below.

## Global layout

1. **Header (sticky):** logo + site name with a short tagline ("Ganjari stadium & Kashi"); desktop nav links (Stadium, How to reach, Tickets, Stay, Hospitals, Temples, Ghats, Getting around); search icon; language switch (हिन्दी / EN) only on pages that have a Hindi version; menu button on mobile.
2. **Bottom navigation (phones only):** Home, Stadium, Plan trip, Explore. Hidden on listing detail pages (they have their own action bar).
3. **Footer:** site name + one-line promise ("Written and checked by people who live in Banaras"), link groups (The stadium / Explore Kashi / About), and the disclaimer line: *"Independent, unofficial guide. Not affiliated with BCCI, UPCA, IPL, WPL or any government body. We do not sell tickets."* plus "Photos credited on each page. Map data © OpenStreetMap contributors."
4. **Breadcrumbs** on every inner page.
5. **Photo credit** line under/over every photo: "Photo: {author} / Wikimedia Commons, {licence}" with links.

## Reusable components

| Component | What it shows / does |
|---|---|
| **Search box** | Instant client-side search over listings + key pages; results show icon, title, "Category • Area". Empty state: "No matches for "x". Try a temple, ghat or area name." |
| **Category tabs** | Horizontally scrollable: Stadium, Stay, Hospitals, Temples, Ghats, Getting around. Icon + label, active state. |
| **Stadium status** | Three tappable stats: Construction (~90%, with progress), First match (Not announced / date), Tickets (Not on sale / On sale; warning colour when not on sale). "Last checked {date}". |
| **Photo card** (carousels) | Photo (4:5), badge "{x} km from stadium", optional "Draft" badge, name, kind, price per night for hotels. |
| **Listing row** (lists) | Thumbnail, kind, name, price (hotels), 2-line summary, distance chips (stadium highlighted, Kashi Vishwanath, Cantt), "Verified" chip if checked. |
| **Carousel / rail** | Horizontal scroll-snap row with the next card peeking on phones; 4 columns on desktop; "See all" link. |
| **Distance chips** | "1.3 km to stadium", "2 km to Kashi Vishwanath", "3 km to Cantt". |
| **Quick answers box** | 3–4 short facts at the top of a page + "Last checked {date}". |
| **FAQ accordion** | Question/answer list (also outputs FAQPage structured data). |
| **Action bar** | Call · WhatsApp · Directions (+ Website). Inline on desktop, sticky at the bottom on phones. |
| **WhatsApp alert band** | "Be the first to know when a match is confirmed", short body, "Join on WhatsApp" button, "Free. Leave anytime." Inline, never a popup. |
| **Share on WhatsApp** button | Pre-filled message + page URL. |
| **Draft notice** | Visible only in development: "Draft, visible only in development…" |
| **Match-day planner** | See How to reach page. |
| **Status / info notes** | Short title + body + link, used for "Before you set out". |
| **Photo with placeholder** | See design brief. |

## Pages and their content

### 1. Home `/`
1. **Hero:** full-width photo of boats on the Ganga at the ghats. Small location line "Ganjari, Varanasi". Headline: **"The new home of cricket in Kashi"**. Sub-line: "Getting to the stadium, where to stay, and how to spend the hours around the match in the world's oldest living city." Buttons: **Plan your match day** (→ How to reach), **Get match alerts** (WhatsApp).
2. **Search box** (prominent, near the hero).
3. **Category tabs.**
4. **"Where things stand"**: stadium status component. Sub: "We update this the day anything official changes." Link: Stadium guide.
5. **"Before you set out"**: three notes:
   - *It's outside the city*: "Ganjari is roughly 20 km from Cantt station. Plan on a cab rather than a walk from the ghats." → See the routes
   - *No tickets exist yet*: "No match has been officially announced. Anyone selling tickets for this stadium today is running a scam." → How tickets will work
   - *The ropeway won't take you there*: "It links Cantt and Godowlia inside the city. Lovely for the ghats, no use for the stadium." → About the ropeway
6. **Carousels** (each with "See all"):
   - Stays near the stadium (closest to Ganjari first)
   - Temples to visit after the match
   - Evenings on the ghats (Ganga aarti, boats and the river)
   - Arriving in Varanasi (stations, airport, ropeway)
7. **Feature banner:** evening Ganga aarti photo. "After the match / The evening Ganga aarti / Lamps, conch shells and chanting on the river steps every evening. Here's where to stand and when to arrive. / Plan your evening →"
8. **From the ground:** latest 3 news posts (date, title, summary).
9. **WhatsApp alert band.**

### 2. Stadium guide `/stadium/` (also Hindi version `/hi/stadium/`)
- Hero photo + title "Varanasi International Cricket Stadium", chip "Ganjari, Rajatalab • ~30,000 seats".
- Intro: "The new stadium at Ganjari is nearly built, but it isn't open and no match has been officially fixed. Here's what's confirmed, what's only talk, and how to plan for the first game."
- Stadium status component.
- **Plan your match day**: 4 links: How to reach (routes, timings and a leave-by planner), Tickets (what we know, and the scams to avoid), Matches (only officially announced fixtures), Construction (dated progress notes with sources).
- **The basics** (facts table with source links): Location: Ganjari, near Rajatalab · Seating: about 30,000 · Reported cost: ₹330–450 crore (reports differ) · Expected ready: before IPL 2027 (not confirmed) · Distance from Cantt: roughly 16–20 km by road.
- **What it looks like**: trishul-shaped floodlight towers, crescent-moon-inspired roof, floodlights visible from the highway near Rajatalab.
- Closest places to stay (carousel).
- **FAQ** (10 questions, see sample data).
- Share on WhatsApp, WhatsApp alert band.

### 3. How to reach `/stadium/how-to-reach/`
- Title "How to reach Varanasi cricket stadium" + intro.
- Quick answers: Ganjari, near Rajatalab, outside the old city · From Cantt: roughly 16–20 km by road · From the airport: roughly 30 km · The ropeway doesn't go here; take a cab or auto.
- **Match-day planner ("When should I leave?")**: inputs: *Starting from* (Varanasi Cantt station / Godowlia–Dashashwamedh / Assi Ghat / BHU–Lanka / Airport), *Match starts at* (time, default 19:30), checkbox *Add extra time for match-day traffic*. Output: big **"Leave by 4:45 pm"**, "Reach the gates around 6:15 pm", breakdown (distance, drive time, match-day traffic +40 min, gates and security 75 min before start, best way), numbered route steps, button **Send this plan to your group** (WhatsApp). Footnote that it's an estimate.
- **Route by route**: one card per origin: distance, time, fare, best way, steps, local tip, "Last checked / Not yet checked in person".
- **On match day** tips list. FAQ (4 questions). Share. Alert band.

### 4. Tickets `/stadium/tickets/`
- Big status block: **Not on sale** (warning style) / or **On sale at {seller}** with button (success style). "Last checked {date}".
- Text: no tickets exist yet; will be sold only through the platform BCCI/UPCA names; **we never sell tickets**.
- "How not to get cheated": never pay on UPI for "early/VIP" tickets; buy only from the official link; report at cybercrime.gov.in or call 1930.
- Button "Warn your friends on WhatsApp". Alert band.

### 5. Matches `/stadium/matches/`
- Only officially announced matches (date, title, competition, link to official announcement). Empty state: "No match announced yet" + explanation + alert band. Section "Played here" for past matches.

### 6. Construction updates `/stadium/construction-updates/`
- Progress figure + progress bar, then a dated timeline (date, title, body, sources).

### 7. Category list pages `/hotels/`, `/hospitals/`, `/temples/`, `/ghats/`, `/transport/`
- Category tabs (active), H1 + intro paragraph, "popular lists" chips (e.g. Hotels near the stadium, near Kashi Vishwanath, near BHU), **area filter chips** (All areas, Assi, Cantt, Lanka & BHU, …), **Sort by** (closest to stadium / Kashi Vishwanath / Cantt / BHU / name), **Budget per night** (hotels only), "Showing x of y", list of listing rows, empty state with "Clear filters", "Run a hotel in Varanasi that should be here? Add it for free".

### 8. Collection pages `/hotels/near-stadium/` etc.
- H1, intro, list sorted by the relevant distance, link back to the full category.

### 9. Listing detail `/{category}/{slug}/`
- Large photo (or placeholder) + credit.
- Chips: kind, area, "Verified {date}". H1 name, Hindi name, price (hotels), summary.
- **Action bar** (Call, WhatsApp, Directions, Website).
- **Distance stats**: to stadium (highlighted), Kashi Vishwanath, Cantt station, airport. "Straight-line distance. The drive is usually a bit longer."
- Quick answers, **Good to know** table (type-specific: hotel → check-in/out, foreign guests, amenities; hospital → type, 24×7 emergency, OPD timings, specialties, Ayushman Bharat; temple → deity, opening hours, aarti timings, dress code, photography; ghat → aarti, boats, activities; transport → hours, fares).
- About (long description), Share.
- Sidebar: Address + phone + official website; "Checked {date} by phone / Not yet verified", "Something wrong? Tell us", "Is this your business? Update it".
- **Nearby** carousel (closest places of every kind).

### 10. Areas `/areas/` and `/areas/{slug}/`
- Index: area name + Hindi name, summary, distance to stadium, number of places.
- Detail: quick answers (distances), listings grouped by category.

### 11. Explore `/explore/`
- Search box, photo tiles per category (name, Hindi name, number of places), a carousel per category, link "Browse by area".

### 12. Search `/search/`
- Full-page search box (autofocus) with instant results.

### 13. News `/blog/` + post, Guides `/guides/` + post
- Index: date, title, summary. Post: title, summary, "By {author} | Published | Updated | x min read", Markdown body, sources, share, alert band.

### 14. Trust and utility pages
- **List your business**: "Get your business in front of match-day visitors", how it works (4 steps), who can be listed, button to the form.
- **About us**, **How we check listings** (editorial policy), **Contact**, **Disclaimer**, **Privacy policy**, **Terms**, **404** ("This page isn't here", buttons to Stadium guide and Home).

## Sample data (use as mock data)

**Stadium**
```json
{ "lastChecked": "2026-10-25", "progressPercent": 90, "firstMatch": null, "ticketStatus": "not-on-sale",
  "facts": [["Location","Ganjari, near Rajatalab, Varanasi"],["Seating","About 30,000"],["Reported cost","₹330–450 crore (reports differ)"],["Expected ready","Before IPL 2027 (not confirmed)"],["Distance from Cantt","Roughly 16–20 km by road"]] }
```

**Listing (shape)**
```json
{ "type": "temple", "slug": "kashi-vishwanath", "name": "Shri Kashi Vishwanath Temple", "nameHi": "श्री काशी विश्वनाथ मंदिर",
  "area": "Dashashwamedh", "summary": "The most visited temple in Varanasi. Timings, aarti, lockers and how to book darshan only on the official site.",
  "photo": { "src": "https://…", "alt": "…", "credit": "Gannu03 / Wikimedia Commons", "licenseName": "CC BY-SA 4.0" },
  "distancesKm": { "stadium": 18, "kashiVishwanath": 0, "cantt": 3.0, "airport": 22 },
  "verifiedAt": null, "status": "draft", "phone": [], "whatsapp": null }
```
Hotel extras: `category` (hotel / guest house / homestay / dharamshala), `priceMin`, `priceMax`, `amenities`, `acceptsForeigners`, `checkIn`, `checkOut`.
Hospital extras: `ownership`, `emergency24x7`, `opdTimings`, `specialties`. Temple extras: `deity`, `openingHours`, `aartiTimings`, `dressCode`. Ghat extras: `aarti`, `activities`, `boatsAvailable`. Transport extras: `mode`, `operatingHours`, `fareInfo`.

**Places to use in mock data**
- Temples: Kashi Vishwanath, Sankat Mochan Hanuman, Durga Kund, Kaal Bhairav
- Ghats: Dashashwamedh, Assi, Manikarnika
- Hospitals: Sir Sundarlal Hospital (BHU), Mahamana Pandit Madan Mohan Malaviya Cancer Centre, SSPG Divisional Hospital (Kabir Chaura)
- Transport: Varanasi Junction (Cantt), Banaras station (Manduadih), Lal Bahadur Shastri International Airport, Kashi Ropeway (Cantt–Godowlia)
- Hotels: 4 clearly fictional samples, e.g. "Sample – Rajatalab Highway Inn" (₹1,500–3,000), "Sample – Cantt Business Hotel", "Sample – Ganga View Guest House" (Assi), "Sample – Lanka Patients & Family Stay" (dharamshala, ₹400–900)
- Areas: Assi, Dashashwamedh, Godowlia, Lanka & BHU, Cantt, Rajatalab & Ganjari, Kabir Chaura, Lahartara, Babatpur, Kotwali & Maidagin, Durgakund

**Stadium FAQs (English)**
1. Where exactly is the Varanasi cricket stadium? → At Ganjari, near Rajatalab, on the Prayagraj side, not in the old city. Roughly 16–20 km from Cantt by road.
2. Is the stadium open now? → Not yet; about 90% built per mid-2026 reports; May 2026 deadline slipped.
3. When is the first match? → No officially confirmed date. Ranji/WPL 2027 are talk, not plans.
4. How do I buy tickets? → You can't yet. Only through the platform BCCI/UPCA names. We never sell tickets.
5. How many people can it hold? → About 30,000.
6. How do I get there from Cantt or the airport? → By road; roughly 16–20 km / 30 km; leave early on match days.
7. Can I take the ropeway? → No, it runs Cantt–Godowlia inside the city.
8. Is there parking? → Not published yet; plan on a cab or shared transport.
9. Where should I stay? → Cantt/Lanka for an easier drive; ghats if combining with a Kashi trip.
10. Is this the official website? → No, an independent local guide.

(Hindi versions of these FAQs exist for `/hi/stadium/`.)

## Interactions to implement

- Instant search (min 2 characters, top 8 results).
- Area filter chips, sort and budget filters on list pages (list is server-rendered; filters enhance it).
- Match-day planner calculation: drive minutes = known average or (road km ÷ 24 km/h × 60); leave time = match start − 75 min (gates) − drive − 40 min (if match-day traffic), rounded down to 5 minutes.
- WhatsApp share links (`https://wa.me/?text=…`), WhatsApp contact (`https://wa.me/91XXXXXXXXXX`), call (`tel:`), directions (Google Maps directions URL).
- Accordion FAQs, mobile menu, bottom nav active state, horizontal carousels with scroll-snap.
- Image fallback to the placeholder on load error.

## Deliverables

1. Short design rationale (palette with hex values, fonts, spacing/radius scale, and why it fits Varanasi).
2. Design tokens + Tailwind config.
3. All components above.
4. All pages above, populated with the sample data.
5. Screens for 390px mobile and 1366px desktop, light and dark.

---
