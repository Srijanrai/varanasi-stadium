import type { ListingWithDistances } from "../data/listings";
import type { Match } from "../schema/listing";
import { SITE, absoluteUrl } from "../site";
import { getCategoryByType } from "../categories";

type Json = Record<string, unknown>;

export function listingUrl(l: { type: ListingWithDistances["type"]; slug: string }) {
  return `/${getCategoryByType(l.type).path}/${l.slug}/`;
}

const SCHEMA_TYPE: Record<ListingWithDistances["type"], string> = {
  hotel: "Hotel",
  hospital: "Hospital",
  temple: "HinduTemple",
  ghat: "TouristAttraction",
  transport: "Place",
};

const TRANSPORT_TYPE: Record<string, string> = {
  railway: "TrainStation",
  airport: "Airport",
  bus: "BusStation",
};

export function organizationJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
  };
}

export function websiteJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    inLanguage: ["en-IN", "hi-IN"],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function listingJsonLd(l: ListingWithDistances): Json {
  const type = l.type === "transport" ? (TRANSPORT_TYPE[l.mode] ?? "Place") : SCHEMA_TYPE[l.type];
  const base: Json = {
    "@context": "https://schema.org",
    "@type": type,
    name: l.name,
    ...(l.nameHi ? { alternateName: l.nameHi } : {}),
    description: l.summary,
    url: absoluteUrl(listingUrl(l)),
    address: {
      "@type": "PostalAddress",
      streetAddress: l.address,
      addressLocality: "Varanasi",
      addressRegion: "Uttar Pradesh",
      postalCode: l.pincode,
      addressCountry: "IN",
    },
    geo: { "@type": "GeoCoordinates", latitude: l.geo.lat, longitude: l.geo.lng },
    ...(l.phone.length ? { telephone: l.phone[0] } : {}),
    ...(l.website ? { sameAs: [l.website] } : {}),
    ...(l.photos.length ? { image: l.photos.map((p) => absoluteUrl(p.src)) } : {}),
  };
  // Never add aggregateRating/review here — self-made ratings get penalised.
  if (l.type === "hotel") {
    if (l.priceMin && l.priceMax) base.priceRange = `₹${l.priceMin}–₹${l.priceMax}`;
    if (l.amenities.length)
      base.amenityFeature = l.amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a, value: true }));
    if (l.checkIn) base.checkinTime = l.checkIn;
    if (l.checkOut) base.checkoutTime = l.checkOut;
  }
  if (l.type === "hospital" && l.specialties.length) base.medicalSpecialty = l.specialties;
  return base;
}

export function itemListJsonLd(name: string, items: ListingWithDistances[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: items.map((l, i) => ({ "@type": "ListItem", position: i + 1, url: absoluteUrl(listingUrl(l)) })),
  };
}

export function stadiumJsonLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "StadiumOrArena",
    name: "Varanasi International Cricket Stadium",
    alternateName: "Ganjari Cricket Stadium",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ganjari, Rajatalab, Varanasi",
      addressRegion: "Uttar Pradesh",
      addressCountry: "IN",
    },
    maximumAttendeeCapacity: 30000,
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function sportsEventJsonLd(m: Match): Json {
  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: m.title,
    startDate: m.date,
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "StadiumOrArena", name: "Varanasi International Cricket Stadium" },
    ...(m.teams.length ? { competitor: m.teams.map((t) => ({ "@type": "SportsTeam", name: t })) } : {}),
  };
}

export function articleJsonLd(p: { title: string; summary: string; publishedAt: string; updatedAt: string; author: string }, path: string): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.summary,
    datePublished: p.publishedAt,
    dateModified: p.updatedAt,
    author: { "@type": "Person", name: p.author },
    publisher: { "@type": "Organization", name: SITE.name },
    mainEntityOfPage: absoluteUrl(path),
  };
}
