import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { marked } from "marked";
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
  steps: z.array(z.string()),
  tip: z.string().nullable(),
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
});

export type Post = z.infer<typeof PostFrontmatter> & { slug: string; html: string; readingMinutes: number };
export type PostKind = "guides" | "blog";

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
      const words = content.trim().split(/\s+/).length;
      return {
        ...fm.data,
        slug: f.replace(/\.md$/, ""),
        html: marked.parse(content, { async: false }) as string,
        readingMinutes: Math.max(1, Math.round(words / 200)),
      };
    })
    .filter((p) => p.status === "published" || showDrafts)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
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
