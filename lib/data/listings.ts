import "server-only";
import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import { ListingSchema, type Listing, type ListingType } from "../schema/listing";
import { LANDMARKS, haversineKm, type LandmarkKey } from "../geo";
import { CATEGORIES, HIDDEN_TYPES, MIN_LISTINGS_TO_INDEX_AREA, MIN_LISTINGS_TO_PUBLISH, type CategoryConfig } from "../categories";
import { showDrafts } from "../site";

// Phase 1 reads JSON files. Phase 3 swaps this module's internals for DB queries;
// the exported functions and their return shapes must stay the same.

const CONTENT_DIR = path.join(process.cwd(), "content");

export type Distances = Record<LandmarkKey, number>;
export type ListingWithDistances = Listing & { distances: Distances };

function readJsonDir(dir: string): unknown[] {
  const full = path.join(CONTENT_DIR, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = JSON.parse(fs.readFileSync(path.join(full, f), "utf8"));
      return { ...raw, __file: `${dir}/${f}` };
    });
}

function withDistances(l: Listing): ListingWithDistances {
  const distances = Object.fromEntries(
    (Object.keys(LANDMARKS) as LandmarkKey[]).map((k) => [k, haversineKm(l.geo, LANDMARKS[k].geo)]),
  ) as Distances;
  return { ...l, distances };
}

const loadAll = cache((): ListingWithDistances[] => {
  const out: ListingWithDistances[] = [];
  const errors: string[] = [];
  for (const c of CATEGORIES) {
    for (const raw of readJsonDir(c.path) as Array<Record<string, unknown>>) {
      const { __file, ...rest } = raw;
      const parsed = ListingSchema.safeParse(rest);
      if (!parsed.success) {
        errors.push(`${__file}:\n  ${parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("\n  ")}`);
        continue;
      }
      out.push(withDistances(parsed.data));
    }
  }
  // Fail the build loudly instead of shipping a broken or unverified listing.
  if (errors.length) throw new Error(`Invalid listing data:\n${errors.join("\n")}`);
  const slugs = new Set<string>();
  for (const l of out) {
    const key = `${l.type}/${l.slug}`;
    if (slugs.has(key)) throw new Error(`Duplicate slug: ${key}`);
    slugs.add(key);
  }
  return out;
});

function isVisible(l: Listing) {
  if (HIDDEN_TYPES.includes(l.type)) return false;
  return l.status === "published" || (showDrafts && l.status === "draft");
}

export function getListings(type?: ListingType): ListingWithDistances[] {
  return loadAll()
    .filter(isVisible)
    .filter((l) => !type || l.type === type)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.name.localeCompare(b.name));
}

export function getListing(type: ListingType, slug: string) {
  return getListings(type).find((l) => l.slug === slug);
}

export function getListingsInArea(area: string) {
  return getListings().filter((l) => l.area === area);
}

export function isAreaIndexable(area: string) {
  return getListingsInArea(area).length >= MIN_LISTINGS_TO_INDEX_AREA;
}

export function getNearby(l: ListingWithDistances, limit = 6) {
  return getListings()
    .filter((o) => o.id !== l.id)
    .map((o) => ({ listing: o, km: haversineKm(l.geo, o.geo) }))
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}

export function isCategoryLive(c: CategoryConfig) {
  return getListings(c.type).length >= (showDrafts ? 1 : MIN_LISTINGS_TO_PUBLISH);
}

export function getLiveCategories() {
  return CATEGORIES.filter(isCategoryLive);
}
