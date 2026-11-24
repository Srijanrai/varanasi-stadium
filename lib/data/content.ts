import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { Marked } from "marked";
import { z } from "zod";
import { AreaSchema, MatchSchema, PhotoSchema, type Area, type Match } from "../schema/listing";
import { showDrafts } from "../site";

const CONTENT_DIR = path.join(process.cwd(), "content");

function readJson<S extends z.ZodTypeAny>(file: string, schema: S): z.infer<S> {
  const raw = JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"));
  const parsed = schema.safeParse(raw);
  if (!parsed.success) throw new Error(`Invalid ${file}: ${parsed.error.message}`);
  return parsed.data;
}

function readJsonDir<S extends z.ZodTypeAny>(dir: string, schema: S): z.infer<S>[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .map((f) => readJson(`${dir}/${f}`, schema));
}

/* ---------- Stadium status ---------- */

const SourceSchema = z.object({ label: z.string(), url: z.string().url() });

export const StadiumSchema = z.object({
  lastChecked: z.string(),
  progressPercent: z.number().min(0).max(100),
  progressNote: z.string(),
  firstMatchNote: z.string(),
  ticketStatus: z.enum(["not-on-sale", "on-sale", "sold-out"]),
  ticketSeller: z.object({ name: z.string(), url: z.string().url() }).nullable(),
  facts: z.array(z.object({ label: z.string(), value: z.string(), source: SourceSchema.optional() })),
  updates: z.array(
    z.object({ date: z.string(), title: z.string(), body: z.string(), sources: z.array(SourceSchema).default([]) }),
  ),
});
export type Stadium = z.infer<typeof StadiumSchema>;

export const getStadium = cache(() => readJson("stadium.json", StadiumSchema));

/* ---------- Routes to the stadium ---------- */

export const RouteOriginSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameHi: z.string().optional(),
  geo: z.object({ lat: z.number(), lng: z.number() }),
  roadKm: z.number().nullable(), // measured; null = use estimate
  normalMinutes: z.tuple([z.number(), z.number()]).nullable(),
  fare: z.string().nullable(),
  bestOption: z.string(),
  bestOptionHi: z.string().optional(),
  steps: z.array(z.string()),
  stepsHi: z.array(z.string()).optional(),
  tip: z.string().nullable(),
  tipHi: z.string().nullable().optional(),
  lastChecked: z.string().nullable(),
});
export type RouteOrigin = z.infer<typeof RouteOriginSchema>;

export const getRoutes = cache(() => readJson("routes.json", z.array(RouteOriginSchema)));

/* ---------- Areas & matches ---------- */

export const getAreas = cache((): Area[] => readJsonDir("areas", AreaSchema));
export const getArea = (slug: string) => getAreas().find((a) => a.slug === slug);

export const getMatches = cache((): Match[] =>
  readJsonDir("matches", MatchSchema)
    // Rumours never reach the page: only matches with an official source and status.
    .filter((m) => m.status !== "tentative")
    .sort((a, b) => (a.date ?? "9999").localeCompare(b.date ?? "9999")),
);

export function getNextMatch(now = new Date()) {
  return getMatches().find((m) => m.status === "announced" && m.date && new Date(m.date) > now);
}

/* ---------- Guides & blog (Markdown) ---------- */

const PostFrontmatter = z.object({
  title: z.string(),
  summary: z.string().max(170),
  author: z.string(),
  publishedAt: z.string(),
  updatedAt: z.string(),
  status: z.enum(["published", "draft"]),
  tags: z.array(z.string()).default([]),
  sources: z.array(SourceSchema).default([]),
  /** Questions answered at the end of the post (rendered with FAQPage markup). */
  faqs: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  /** The place this post is about, as "<category path>/<slug>", e.g. "ghats/dashashwamedh-ghat". */
  place: z.string().regex(/^[a-z-]+\/[a-z0-9-]+$/).optional(),
  /** Photos used in the post. The first is the cover; the rest are placed in the text with ![alt](src). */
  photos: z.array(PhotoSchema).default([]),
  /** Festival pages only: when it next happens. One fixed URL per festival; update these dates each year. */
  event: z
    .object({
      name: z.string(),
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      /** Shown under the date, e.g. which calendar it comes from or why some calendars differ. */
      dateNote: z.string().optional(),
    })
    .optional(),
});

export type TocItem = { id: string; text: string };
export type Post = z.infer<typeof PostFrontmatter> & { slug: string; html: string; readingMinutes: number; toc: TocItem[] };

const plain = (md: string) => md.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*_`]/g, "").trim();
const slugify = (s: string) =>
  plain(s).toLowerCase().normalize("NFKC").replace(/[^\p{L}\p{M}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "") || "section";

/** Markdown to HTML with stable ids on h2/h3, so the table of contents can link to them. */
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Caption crediting a third-party photo, matching the wording of <PhotoCredit>. */
function creditHtml(p: z.infer<typeof PhotoSchema>) {
  if (p.license === "own" && !p.sourceUrl) return esc(p.credit);
  const who = p.sourceUrl ? `<a href="${esc(p.sourceUrl)}" target="_blank" rel="noopener nofollow">${esc(p.credit)}</a>` : esc(p.credit);
  const licence = p.licenseName
    ? p.licenseUrl
      ? `, <a href="${esc(p.licenseUrl)}" target="_blank" rel="noopener nofollow license">${esc(p.licenseName)}</a>`
      : `, ${esc(p.licenseName)}`
    : "";
  return `Photo: ${who}${p.edited ? `, ${esc(p.edited.toLowerCase())}` : ""}${licence}`;
}

function renderPost(content: string, photos: z.infer<typeof PhotoSchema>[] = [], file = "") {
  const used = new Map<string, number>();
  const idFor = (text: string) => {
    const base = slugify(text);
    const n = used.get(base) ?? 0;
    used.set(base, n + 1);
    return n ? `${base}-${n + 1}` : base;
  };
  const md = new Marked({ gfm: true });
  const toc: TocItem[] = [];
  md.use({
    renderer: {
      heading({ tokens, depth, text }) {
        const inner = this.parser.parseInline(tokens);
        if (depth !== 2 && depth !== 3) return `<h${depth}>${inner}</h${depth}>\n`;
        const id = idFor(text);
        if (depth === 2) toc.push({ id, text: plain(text) });
        return `<h${depth} id="${id}">${inner}</h${depth}>\n`;
      },
      // Every image in a post must be declared in the frontmatter, so it always carries its credit.
      image({ href, text }) {
        const p = photos.find((x) => x.src === href);
        if (!p) throw new Error(`${file}: image ${href} isn't listed under photos in the frontmatter`);
        return `<figure class="post-figure"><img src="${esc(p.src)}" alt="${esc(text || p.alt)}" width="${p.width}" height="${p.height}" loading="lazy" decoding="async" /><figcaption>${creditHtml(p)}</figcaption></figure>`;
      },
    },
  });
  const html = md.parse(content, { async: false }) as string;
  return { html, toc };
}

// A published post must be finished: no editing markers, a real author and at least one source.
function assertPublishable(file: string, data: z.infer<typeof PostFrontmatter>, content: string) {
  if (data.status !== "published") return;
  const problems: string[] = [];
  const all = `${content}\n${JSON.stringify(data.faqs)}`;
  if (/\[(VERIFY|ADD FIRST-HAND)/.test(all)) problems.push("remove [VERIFY]/[ADD FIRST-HAND] markers");
  if (/^\s*\[|YOUR NAME/i.test(data.author)) problems.push("set a real author");
  if (!data.sources.length) problems.push("add at least one source");
  if (file.startsWith("festivals/") && !data.event) problems.push("add the event dates");
  if (problems.length) throw new Error(`Can't publish ${file}: ${problems.join("; ")}`);
}
export type PostKind = "guides" | "blog" | "festivals";

export const getPosts = cache((kind: PostKind): Post[] => {
  const dir = path.join(CONTENT_DIR, kind);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, content } = matter(fs.readFileSync(path.join(dir, f), "utf8"));
      const fm = PostFrontmatter.safeParse(data);
      if (!fm.success) throw new Error(`Invalid frontmatter in ${kind}/${f}: ${fm.error.message}`);
      assertPublishable(`${kind}/${f}`, fm.data, content);
      const words = content.trim().split(/\s+/).length;
      return {
        ...fm.data,
        slug: f.replace(/\.md$/, ""),
        ...renderPost(content, fm.data.photos, `${kind}/${f}`),
        readingMinutes: Math.max(1, Math.round(words / 200)),
      };
    })
    .filter((p) => p.status === "published" || showDrafts)
    .sort((a, b) =>
      // Festivals: soonest first. Everything else: newest first.
      a.event && b.event ? a.event.startDate.localeCompare(b.event.startDate) : b.publishedAt.localeCompare(a.publishedAt),
    );
});

export const getPost = (kind: PostKind, slug: string) => getPosts(kind).find((p) => p.slug === slug);

/* ---------- FAQs ---------- */

const FaqSchema = z.array(z.object({ q: z.string(), a: z.string() }));
export type Faq = z.infer<typeof FaqSchema>[number];

export const getFaqs = cache((name: string): Faq[] => {
  const file = path.join(CONTENT_DIR, "faqs", `${name}.json`);
  return fs.existsSync(file) ? readJson(`faqs/${name}.json`, FaqSchema) : [];
});

/* ---------- Site-wide photos (hero etc.) ---------- */

export const getSiteImages = cache(() =>
  readJson("site-images.json", z.object({ hero: PhotoSchema, aarti: PhotoSchema.optional(), stadium: PhotoSchema.optional(), stadiumMobile: PhotoSchema.optional() })),
);
