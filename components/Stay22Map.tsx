import { SITE, showDrafts } from "@/lib/site";

type Props = {
  name: string; // place the map is centred on, e.g. "Kedar Ghat"
  geo: { lat: number; lng: number };
  campaign: string; // tells us in the Stay22 dashboard which page a booking came from
};

/**
 * Live hotels near a point, from Stay22 (Booking.com, Expedia and others).
 * Hidden on the live site until SITE.affiliates.stay22Aid is set; local preview (SHOW_DRAFTS=1)
 * uses Stay22's placeholder ID, which earns nothing.
 * Params: https://dev.stay22.com/docs/maps/parameters
 */
export function Stay22Map({ name, geo, campaign }: Props) {
  const aid = SITE.affiliates.stay22Aid;
  if (!aid && !showDrafts) return null;

  const p = new URLSearchParams({
    aid: aid ?? "demo_affiliate_id",
    lat: String(geo.lat),
    lng: String(geo.lng),
    campaign,
    zoom: "14",
    viewmode: "listview", // hotel cards with prices; visitors can still open the map inside the box
    listviewexpand: "true",
    showhotels: "true",
    limit: "6",
    currency: "INR",
    ljs: "en",
    maincolor: "021e3a",
    unitsystem: "metric",
  });

  return (
    <section className="mt-10" aria-labelledby="stays-nearby">
      <h2 id="stays-nearby" className="text-lg font-semibold">
        Stays near {name}
      </h2>
      <p className="mt-1 text-sm text-muted">
        Nearby hotels with live prices from booking sites. Pick your dates for exact rates.
      </p>
      {!aid && (
        <p className="mt-2 rounded bg-[var(--orange-tint)] px-3 py-2 text-xs">
          Preview only: placeholder partner ID. Not shown on the live site.
        </p>
      )}
      <iframe
        title={`Hotels near ${name}`}
        src={`https://www.stay22.com/embed/gm?${p}`}
        loading="lazy"
        className="mt-3 h-[460px] w-full rounded-xl border border-[var(--border)]"
      />
      <p className="mt-2 text-xs text-muted">
        Booking happens on the partner&apos;s site. We may earn a small fee, at no extra cost to you.
      </p>
    </section>
  );
}
