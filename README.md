# Varanasi Stadium Guide — Phase 1 (static frontend)

Independent guide to the Varanasi (Ganjari) cricket stadium and Kashi. See `docs/PHASE1_SPEC.md` and
`docs/CONTENT_AND_ENGAGEMENT_GUIDE.md`.

## Run it

```bash
# install (keeps npm's cache inside the project)
npm install --cache ./.npm-cache

# development — shows draft listings, marked "draft"
npm run dev

# production build exactly as it will go live — drafts hidden
SHOW_DRAFTS=0 NEXT_PUBLIC_SITE_URL=https://your-domain.in npm run build && npm start
```

`.env.local` sets `SHOW_DRAFTS=1` and `NEXT_TELEMETRY_DISABLED=1` for local work. **Never set `SHOW_DRAFTS` on the
production deployment.** Draft pages always carry a `noindex` tag. On preview/staging deployments also set
`PREVIEW_DEPLOYMENT=1`, which makes `robots.txt` block all crawlers.

## Checking SEO with Lighthouse

Lighthouse is installed in the project. Audit the **production** build (drafts hidden), in a separate folder so a
running `npm run dev` isn't disturbed:

```bash
NEXT_DIST_DIR=.next-audit NEXT_PUBLIC_SITE_URL=http://localhost:3077 SHOW_DRAFTS=0 npx next build
NEXT_DIST_DIR=.next-audit NEXT_PUBLIC_SITE_URL=http://localhost:3077 SHOW_DRAFTS=0 npx next start -p 3077
npx lighthouse http://localhost:3077/stadium/ --only-categories=seo,accessibility,best-practices --view
```

Last run (25 Oct 2026): SEO 100, Accessibility 100, Best Practices 100 on all audited pages. Draft listing pages
are expected to fail "Page is blocked from indexing" — that's the safety net working.

## Where content lives

| What | Where |
|---|---|
| Stadium status board, facts, construction updates | `content/stadium.json` |
| Routes to the stadium + match-day planner | `content/routes.json` |
| Listings | `content/{hotels,hospitals,temples,ghats,transport}/<slug>.json` (template: `content/hotels/_TEMPLATE.json.example`) |
| Areas | `content/areas/<slug>.json` |
| Official matches | `content/matches/<slug>.json` (`status: announced` + `officialSourceUrl` required) |
| FAQs | `content/faqs/*.json` |
| News / guides | `content/blog/*.md`, `content/guides/*.md` |
| Brand, URLs, form + WhatsApp links | `lib/site.ts` (all `REPLACE_ME` values) |
| Landmark coordinates (distance chips) | `lib/geo.ts` |

## Publishing rules the build enforces

A listing with `"status": "published"` **fails the build** unless it has: a 150+ word description, `verifiedAt`,
`verificationMethod`, at least one photo (with license), owner consent for owner-submitted entries, no `[VERIFY]` /
`[ADD FIRST-HAND]` tags, and isn't tagged `sample`.

A category page (e.g. `/hotels/`) or collection (e.g. `/hotels/near-stadium/`) only exists once it has **5 published
listings**. Empty hubs (`/blog/`, `/guides/`, `/areas/`) are `noindex` and left out of the sitemap and footer.

## Before launch

- [ ] Delete the four `content/hotels/sample-*.json` files.
- [x] Wikimedia Commons photos are self-hosted in `public/images/` and credited on each page and on `/credits/`. Over time replace them with your own photos, and add stadium + hospital photos (set `license: "own"` for yours).
- [ ] Replace every `REPLACE_ME` / `[DECIDE]` in `lib/site.ts`.
- [ ] Verify the stadium pin and other coordinates in `lib/geo.ts`; drive the routes and fill `roadKm`,
      `normalMinutes`, `fare`, `tip`, `lastChecked` in `content/routes.json`.
- [ ] Verify and complete the draft listings, add photos, then switch them to `published`.
- [ ] Replace the About page text with your own story; have a lawyer review Disclaimer, Privacy and Terms.
- [ ] Deploy (Vercel / Cloudflare Pages), set `NEXT_PUBLIC_SITE_URL`, add Search Console + Bing, submit `/sitemap.xml`.
- [ ] Run Lighthouse on a mid-range Android and the Rich Results Test on one page of each type.

## Phase 3 hand-off

Pages read data only through `lib/data/*`. Swap those functions to database queries (same return shapes), reuse the
Zod schemas in `lib/schema/` for the DB, keep every `id` and `slug` — no URL changes, no ranking lost. Sanitize
owner-submitted descriptions before rendering them as HTML.
