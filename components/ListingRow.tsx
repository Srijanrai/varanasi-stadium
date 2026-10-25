import Link from "next/link";
import type { ListingWithDistances } from "@/lib/data/listings";
import { listingUrl } from "@/lib/seo/jsonld";
import { formatKm } from "@/lib/geo";
import { formatPriceRange } from "@/lib/format";
import { DistanceChips } from "./ui";
import { Photo } from "./Photo";
import { IconCheck, IconPin } from "./icons";
import { Rail } from "./Rail";
import type { LandmarkKey } from "@/lib/geo";

const CATEGORY_LABEL: Record<string, string> = {
  hotel: "Hotel",
  "guest-house": "Guest house",
  homestay: "Homestay",
  dharamshala: "Dharamshala",
  hostel: "Hostel",
};

export function listingKind(l: ListingWithDistances) {
  switch (l.type) {
    case "hotel":
      return CATEGORY_LABEL[l.category];
    case "hospital":
      return `${l.ownership[0].toUpperCase()}${l.ownership.slice(1)} hospital`;
    case "temple":
      return l.deity;
    case "ghat":
      return "Ghat";
    case "transport":
      return { railway: "Railway station", airport: "Airport", ropeway: "Ropeway", bus: "Bus stand", "cab-stand": "Cab stand", "auto-stand": "Auto stand", "e-rickshaw": "E-rickshaw stand" }[l.mode];
  }
}

function DraftTag({ className = "" }: { className?: string }) {
  return <span className={`chip bg-white/95 text-[0.7rem] font-semibold text-[#d0352a] ${className}`}>Draft</span>;
}

/** Image-first card for carousels and grids. */
export function PhotoCard({ listing: l, priority }: { listing: ListingWithDistances; priority?: boolean }) {
  const price = l.type === "hotel" ? formatPriceRange(l.priceMin, l.priceMax) : null;
  return (
    <article className="card group relative flex h-full flex-col overflow-hidden">
      <Photo
        photo={l.photos[0]}
        aspect="aspect-[4/3]"
        sizes="(min-width:1024px) 270px, (min-width:640px) 45vw, 78vw"
        priority={priority}
        kind={l.type}
        label={l.photos[0] ? undefined : l.name}
      >
        <span className="chip absolute bottom-2.5 left-2.5 bg-white/95 text-[#18213d] shadow-sm">
          <IconPin className="h-3.5 w-3.5 text-[#a26f0c]" />
          {formatKm(l.distances.stadium)} from stadium
        </span>
        {l.status === "draft" && <DraftTag className="absolute top-2.5 right-2.5" />}
      </Photo>
      <div className="flex flex-1 flex-col p-3.5">
        <h3 className="text-[0.95rem] leading-snug">
          <Link href={listingUrl(l)} className="after:absolute after:inset-0 group-hover:text-gold-ink">
            {l.name}
          </Link>
        </h3>
        <p className="mt-0.5 text-xs text-muted">{listingKind(l)}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          {price ? (
            <p className="leading-tight">
              <span className="font-bold">{price}</span>
              <span className="block text-xs text-muted">per night</span>
            </p>
          ) : (
            <span />
          )}
          {l.verifiedAt && (
            <span className="chip text-ok">
              <IconCheck className="h-3.5 w-3.5" /> Verified
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

/** Horizontal row: thumbnail + details. Used in long lists. */
export function ListingRow({ listing: l, chips }: { listing: ListingWithDistances; chips?: LandmarkKey[] }) {
  const price = l.type === "hotel" ? formatPriceRange(l.priceMin, l.priceMax) : null;
  return (
    <li className="card group relative flex gap-4 p-3 transition-transform hover:-translate-y-0.5 sm:p-4">
      <Photo photo={l.photos[0]} aspect="aspect-square" sizes="144px" className="w-24 shrink-0 rounded-xl sm:w-36" kind={l.type} />
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted">
          {listingKind(l)}
          {l.status === "draft" && <span className="ml-2 font-semibold text-danger">Draft</span>}
        </p>
        <h3 className="mt-0.5 text-[1.1rem] font-bold leading-tight sm:text-[1.2rem]">
          <Link href={listingUrl(l)} className="after:absolute after:inset-0 group-hover:text-gold-ink">
            {l.name}
          </Link>
        </h3>
        {price && (
          <p className="mt-1 text-sm font-bold">
            {price} <span className="font-normal text-muted">per night</span>
          </p>
        )}
        <p className="mt-1 line-clamp-2 text-sm text-muted">{l.summary}</p>
        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <DistanceChips distances={l.distances} show={chips} />
          {l.verifiedAt && (
            <span className="chip text-ok">
              <IconCheck className="h-3.5 w-3.5" /> Verified
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

export function ListingList({ listings, chips }: { listings: ListingWithDistances[]; chips?: LandmarkKey[] }) {
  return (
    <ul className="grid gap-3">
      {listings.map((l) => (
        <ListingRow key={l.id} listing={l} chips={chips} />
      ))}
    </ul>
  );
}

export function ListingRail({ listings, label = "Places" }: { listings: ListingWithDistances[]; label?: string }) {
  return (
    <Rail label={label}>
      {listings.map((l, i) => (
        <PhotoCard key={l.id} listing={l} priority={i < 2} />
      ))}
    </Rail>
  );
}
