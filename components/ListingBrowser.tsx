"use client";

import { useMemo, useState } from "react";
import type { ListingWithDistances } from "@/lib/data/listings";
import type { LandmarkKey } from "@/lib/geo";
import { ListingRow } from "./ListingRow";

type SortKey = "stadium" | "kashiVishwanath" | "cantt" | "bhu" | "name";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "stadium", label: "Closest to stadium" },
  { key: "kashiVishwanath", label: "Closest to Kashi Vishwanath" },
  { key: "cantt", label: "Closest to Cantt station" },
  { key: "bhu", label: "Closest to BHU" },
  { key: "name", label: "Name (A–Z)" },
];

/**
 * Filters enhance a list that is already fully server-rendered, so crawlers and
 * no-JS visitors see every listing.
 */
export function ListingBrowser({
  listings,
  areas,
  chips,
  showPrice = false,
}: {
  listings: ListingWithDistances[];
  areas: { slug: string; name: string }[];
  chips?: LandmarkKey[];
  showPrice?: boolean;
}) {
  const [area, setArea] = useState("");
  const [sort, setSort] = useState<SortKey>("stadium");
  const [maxPrice, setMaxPrice] = useState(0);

  const shown = useMemo(() => {
    const out = listings.filter(
      (l) =>
        (!area || l.area === area) &&
        (!maxPrice || (l.type === "hotel" && (l.priceMin ?? Infinity) <= maxPrice)),
    );
    return out.sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : a.distances[sort] - b.distances[sort]));
  }, [listings, area, sort, maxPrice]);

  const usedAreas = areas.filter((a) => listings.some((l) => l.area === a.slug));

  return (
    <div>
      <div className="mb-4 -mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0" role="group" aria-label="Filter by area">
        <div className="flex gap-2">
          {[{ slug: "", name: "All areas" }, ...usedAreas].map((a) => (
            <button
              key={a.slug || "all"}
              type="button"
              aria-pressed={area === a.slug}
              onClick={() => setArea(a.slug)}
              className={`chip min-h-10 border px-4 text-sm ${
                area === a.slug ? "border-ink bg-ink text-bg" : "border-border bg-card text-ink hover:border-ink"
              }`}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>
      <form className="mb-4 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-end" onSubmit={(e) => e.preventDefault()} aria-label="Sort list">
        <Field label="Sort by">
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className={inputCls}>
            {SORTS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>
        {showPrice && (
          <Field label="Budget per night">
            <select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className={inputCls}>
              <option value={0}>Any budget</option>
              <option value={1000}>Under ₹1,000</option>
              <option value={2000}>Under ₹2,000</option>
              <option value={4000}>Under ₹4,000</option>
            </select>
          </Field>
        )}
      </form>
      <p className="mb-3 text-sm text-muted" aria-live="polite">
        Showing {shown.length} of {listings.length}
      </p>
      {shown.length ? (
        <ul className="grid gap-3">
          {shown.map((l) => (
            <ListingRow key={l.id} listing={l} chips={chips} />
          ))}
        </ul>
      ) : (
        <p className="card p-5">
          Nothing matches those filters. Try another area or a higher budget.{" "}
          <button
            type="button"
            className="link"
            onClick={() => {
              setArea("");
              setMaxPrice(0);
            }}
          >
            Clear filters
          </button>
        </p>
      )}
    </div>
  );
}

const inputCls = "field sm:w-auto sm:min-w-56";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm font-semibold">
      {label}
      {children}
    </label>
  );
}
