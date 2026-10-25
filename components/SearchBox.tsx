"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SearchItem } from "@/lib/data/search";
import { CATEGORY_ICONS, IconSearch, IconStadium } from "./icons";

function score(item: SearchItem, q: string) {
  const t = item.title.toLowerCase();
  if (t.startsWith(q)) return 3;
  if (t.includes(q)) return 2;
  if (`${item.sub} ${item.keywords}`.toLowerCase().includes(q)) return 1;
  return 0;
}

/** Instant search over listings and key pages. Everything runs in the browser. */
export function SearchBox({
  index,
  autoFocus,
  popular,
  placeholder = "Search temples, ghats, stations, areas…",
}: {
  index: SearchItem[];
  autoFocus?: boolean;
  /** Quick links shown under the field ("Popular: …") */
  popular?: { label: string; href: string }[];
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    return index
      .map((it) => ({ it, s: score(it, term) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((r) => r.it);
  }, [q, index]);

  return (
    <div className="relative lg:flex lg:items-center lg:gap-6">
      <form role="search" onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2 lg:w-[46%] lg:shrink-0">
        <label className="flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-border bg-card px-4 focus-within:border-gold focus-within:shadow-[0_0_0_3px_var(--gold-tint)]">
          <IconSearch className="h-5 w-5 shrink-0 text-muted" />
          <span className="sr-only">Search</span>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="h-12 w-full min-w-0 bg-transparent text-[0.95rem] outline-none placeholder:text-muted"
            aria-controls={q.trim().length >= 2 ? "search-results" : undefined}
            autoComplete="off"
          />
        </label>
        <button type="submit" aria-label="Search" className="btn-search grid h-12 w-12 shrink-0 place-items-center rounded-xl hover:brightness-105">
          <IconSearch className="h-5 w-5" />
        </button>
      </form>

      {popular && popular.length > 0 && (
        <div className="mt-3 hidden flex-wrap items-center gap-2 text-xs sm:flex lg:mt-0">
          <span className="text-muted">Popular:</span>
          {popular.map((p) => (
            <Link key={p.href} href={p.href} className="chip bg-soft text-ink hover:bg-gold-tint">
              {p.label}
            </Link>
          ))}
        </div>
      )}

      {q.trim().length >= 2 && (
        <ul id="search-results" role="listbox" className="card absolute inset-x-0 top-14 z-20 lg:right-auto lg:w-[46%] max-h-[60vh] overflow-auto p-1.5">
          {results.length ? (
            results.map((r) => {
              const Icon = r.kind in CATEGORY_ICONS ? CATEGORY_ICONS[r.kind as keyof typeof CATEGORY_ICONS] : IconStadium;
              return (
                <li key={r.href} role="option" aria-selected={false}>
                  <Link href={r.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-soft">
                    <span className="icon-tile h-9 w-9 shrink-0">
                      <Icon className="h-[18px] w-[18px]" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">{r.title}</span>
                      <span className="block truncate text-sm text-muted">{r.sub}</span>
                    </span>
                  </Link>
                </li>
              );
            })
          ) : (
            <li className="px-3 py-3 text-sm text-muted">No matches for “{q.trim()}”. Try a temple, ghat or area name.</li>
          )}
        </ul>
      )}
    </div>
  );
}
