"use client";

import { useEffect, useState } from "react";
import { track } from "@/lib/track";

export type StayPreset = {
  /** A landmark Booking.com recognises (tested): "Assi Ghat", "Varanasi Junction", "Banaras Hindu University",
   *  "Kashi Vishwanath Temple". Neighbourhood names like "Bhullanpur" return an empty search, so use geo for those. */
  query?: string;
  /** Search around a map point instead; Booking.com lists the nearest hotels first. */
  geo?: { lat: number; lng: number };
  /** Short reason this area suits the reader. Our own words. */
  note: string;
};

type Props = {
  id: string; // analytics label, e.g. "stadium"
  title: string;
  intro: string;
  presets: (StayPreset & { label: string })[];
  bookingAid: string | null;
  agodaCid: string | null;
  preview: boolean; // true when partner IDs aren't set yet (local preview only)
};

// Link formats tested in a browser on 21 Nov 2026. Once approved, compare with each partner dashboard's format.
function bookingUrl(preset: StayPreset, inDate: string, outDate: string, adults: number, aid: string | null) {
  const p = new URLSearchParams({ ss: preset.query ?? "Varanasi", group_adults: String(adults), no_rooms: "1" });
  if (preset.geo) {
    p.set("latitude", String(preset.geo.lat));
    p.set("longitude", String(preset.geo.lng));
    p.set("dest_type", "latlong");
  }
  if (inDate) p.set("checkin", inDate);
  if (outDate) p.set("checkout", outDate);
  if (aid) p.set("aid", aid);
  return `https://www.booking.com/searchresults.html?${p}`;
}
// Agoda's free-text search link redirects to its homepage, so we open its Varanasi city page,
// which works reliably. It ignores dates in the link, so the visitor picks them there.
function agodaUrl(cid: string | null) {
  return `https://www.agoda.com/city/varanasi-in.html${cid ? `?cid=${encodeURIComponent(cid)}` : ""}`;
}

export function StayBox({ id, title, intro, presets, bookingAid, agodaCid, preview }: Props) {
  const [area, setArea] = useState(0);
  const [inDate, setIn] = useState("");
  const [outDate, setOut] = useState("");
  const [adults, setAdults] = useState(2);
  const p = presets[area] ?? presets[0];
  // Set after mount: the page is pre-rendered at build time, so "today" must come from the visitor's clock.
  const [today, setToday] = useState("");
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);

  const partners = [
    { key: "booking", name: "Booking.com", label: "See prices on Booking.com", href: bookingUrl(p, inDate, outDate, adults, bookingAid) },
    { key: "agoda", name: "Agoda", label: "Compare on Agoda", href: agodaUrl(agodaCid) },
  ];

  return (
    <section aria-labelledby={`stay-${id}`} className="overflow-hidden rounded-[14px] bg-cream shadow-[var(--shadow)]">
      <div className="p-5 sm:p-7">
        <p className="text-xs font-semibold tracking-[0.12em] text-gold-ink">WHERE TO STAY</p>
        <h2 id={`stay-${id}`} className="mt-1 text-[clamp(1.5rem,5vw,2rem)]">
          {title}
        </h2>
        <p className="mt-2 max-w-[60ch] text-muted">{intro}</p>

        {presets.length > 1 && (
          <div role="tablist" aria-label="Area" className="mt-5 flex flex-wrap gap-2">
            {presets.map((x, i) => (
              <button
                key={x.label}
                type="button"
                role="tab"
                aria-selected={i === area}
                onClick={() => setArea(i)}
                className={`min-h-10 rounded-full px-4 text-sm font-semibold transition-colors ${
                  i === area ? "bg-navy text-on-navy" : "bg-card text-ink hover:bg-gold-tint"
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>
        )}
        <p className="mt-3 text-sm">{p.note}</p>

        <form className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-[1fr_1fr_8rem]" onSubmit={(e) => e.preventDefault()}>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Check-in
            <input type="date" min={today || undefined} value={inDate} onChange={(e) => setIn(e.target.value)} className="field font-normal" />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Check-out
            <input type="date" min={inDate || today} value={outDate} onChange={(e) => setOut(e.target.value)} className="field font-normal" />
          </label>
          <label className="col-span-2 flex flex-col gap-1 text-sm font-semibold sm:col-span-1">
            Guests
            <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="field font-normal">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "adult" : "adults"}
                </option>
              ))}
            </select>
          </label>
        </form>

        <p className="mt-5 text-xs font-semibold tracking-[0.08em] text-muted">PRICES ON OUR PARTNER SITES</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {partners.map((x) => (
            <a
              key={x.key}
              href={x.href}
              target="_blank"
              rel="sponsored nofollow noopener"
              onClick={() => track("affiliate_click", { partner: x.key, from: id, area: p.label })}
              className="btn btn-primary w-full !rounded-xl"
            >
              {x.label}
            </a>
          ))}
        </div>
      </div>
      <p className="border-t border-border px-5 py-3 text-xs text-muted sm:px-7">
        Booking through these links supports this free guide. You pay the same price.
        {preview && <strong className="ml-1 text-danger">Preview: partner IDs not set, so these links earn nothing yet.</strong>}
      </p>
    </section>
  );
}
