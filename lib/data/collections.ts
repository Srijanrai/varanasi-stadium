import "server-only";
import type { ListingType } from "../schema/listing";
import { getListings, type ListingWithDistances } from "./listings";
import { MIN_LISTINGS_TO_PUBLISH } from "../categories";
import { showDrafts } from "../site";

// Curated sub-pages like /hotels/near-stadium/. They share the URL space with
// listing slugs, so a listing must never use one of these slugs.
export type Collection = {
  type: ListingType;
  slug: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  filter: (l: ListingWithDistances) => boolean;
  sort: (a: ListingWithDistances, b: ListingWithDistances) => number;
};

export const COLLECTIONS: Collection[] = [
  {
    type: "hotel",
    slug: "near-stadium",
    h1: "Hotels near Varanasi cricket stadium",
    metaTitle: "Hotels near Varanasi Cricket Stadium (Ganjari)",
    metaDescription:
      "Places to stay closest to the Ganjari stadium and on the Cantt–Rajatalab route, with distances and prices we checked ourselves.",
    intro:
      "There aren't many hotels right next to Ganjari yet, so most people will stay on the city side and drive out. These are the closest options, sorted by distance to the stadium.",
    filter: (l) => l.distances.stadium <= 15,
    sort: (a, b) => a.distances.stadium - b.distances.stadium,
  },
  {
    type: "hotel",
    slug: "near-kashi-vishwanath",
    h1: "Hotels near Kashi Vishwanath temple",
    metaTitle: "Hotels near Kashi Vishwanath Temple, Varanasi",
    metaDescription:
      "Hotels and guest houses within walking distance of Kashi Vishwanath and Dashashwamedh Ghat, with distance to the cricket stadium too.",
    intro:
      "Stay here if darshan and the evening aarti matter more to you than a short drive to the match. Sorted by walking distance to the temple.",
    filter: (l) => l.distances.kashiVishwanath <= 2,
    sort: (a, b) => a.distances.kashiVishwanath - b.distances.kashiVishwanath,
  },
  {
    type: "hotel",
    slug: "near-bhu",
    h1: "Hotels near BHU and the BHU hospital",
    metaTitle: "Hotels near BHU & Sir Sundarlal Hospital, Varanasi",
    metaDescription:
      "Budget stays near Banaras Hindu University and its hospital — useful for patients' families, students and visitors.",
    intro:
      "Close to the university gate and the hospital. Many families coming for treatment stay here, so we note which places are used to long stays.",
    filter: (l) => l.distances.bhu <= 3,
    sort: (a, b) => a.distances.bhu - b.distances.bhu,
  },
];

export function getCollection(type: ListingType, slug: string) {
  return COLLECTIONS.find((c) => c.type === type && c.slug === slug);
}

export function getCollectionListings(c: Collection) {
  return getListings(c.type).filter(c.filter).sort(c.sort);
}

export function isCollectionLive(c: Collection) {
  return getCollectionListings(c).length >= (showDrafts ? 1 : MIN_LISTINGS_TO_PUBLISH);
}

export function getLiveCollections(type?: ListingType) {
  return COLLECTIONS.filter((c) => (!type || c.type === type) && isCollectionLive(c));
}
