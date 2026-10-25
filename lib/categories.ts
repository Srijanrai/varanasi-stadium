import type { ListingType } from "./schema/listing";

export type CategoryConfig = {
  type: ListingType;
  path: string; // URL segment, never change once live
  label: string;
  labelHi: string;
  shortLabel: string;
  tagline: string;
  singular: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
};

/**
 * Categories switched off site-wide (nav, Explore, search, nearby, areas, sitemap).
 * Their content files stay in /content; remove a type from this list to bring the section back.
 */
export const HIDDEN_TYPES: ListingType[] = ["hospital"];

export const CATEGORIES: CategoryConfig[] = [
  {
    type: "hotel",
    path: "hotels",
    label: "Stay",
    labelHi: "ठहरें",
    shortLabel: "Stay",
    tagline: "Hotels & guest houses",
    singular: "Hotel",
    h1: "Places to stay near the stadium and the ghats",
    metaTitle: "Hotels near Varanasi Cricket Stadium & Kashi",
    metaDescription:
      "Hotels, guest houses and homestays in Varanasi with real distances to the Ganjari stadium, Kashi Vishwanath and Cantt station. Checked by phone, dated.",
    intro:
      "Where you stay decides how your match day goes. Cantt and Lanka make the drive to Ganjari easier; the ghats are better if the match is one part of a longer Kashi trip. Every place here shows how far it really is from the stadium, the temple and the station, and when we last checked it.",
  },
  {
    type: "hospital",
    path: "hospitals",
    label: "Hospitals",
    labelHi: "अस्पताल",
    shortLabel: "Hospitals",
    tagline: "Medical facilities",
    singular: "Hospital",
    h1: "Hospitals in Varanasi",
    metaTitle: "Hospitals in Varanasi – OPD timings, emergency, contact",
    metaDescription:
      "Government and private hospitals in Varanasi with OPD days, emergency availability and how to get there. Practical notes for patients and attendants.",
    intro:
      "Varanasi is where much of eastern UP and Bihar comes for treatment. These pages focus on what families actually need on the day: when the OPD opens, how registration works, whether there's 24-hour emergency care, and how to get there.",
  },
  {
    type: "temple",
    path: "temples",
    label: "Temples",
    labelHi: "मंदिर",
    shortLabel: "Temples",
    tagline: "Darshan & aarti",
    singular: "Temple",
    h1: "Temples to visit in Varanasi",
    metaTitle: "Varanasi temples – timings, aarti and darshan tips",
    metaDescription:
      "Opening hours, aarti timings, dress code and practical darshan tips for Kashi Vishwanath and other major temples in Varanasi.",
    intro:
      "If you have a few hours before or after a match, these are the temples most people try to fit in. Timings change on festival days, so each page shows when we last checked.",
  },
  {
    type: "ghat",
    path: "ghats",
    label: "Ghats",
    labelHi: "घाट",
    shortLabel: "Ghats",
    tagline: "Boats & evening aarti",
    singular: "Ghat",
    h1: "Ghats of Varanasi",
    metaTitle: "Varanasi ghats – aarti timings, boat rides, what to know",
    metaDescription:
      "Ganga aarti timings, boat rides and what to expect at Dashashwamedh, Assi, Manikarnika and other ghats in Varanasi.",
    intro:
      "The ghats are what most visitors picture when they think of Banaras. Here's what happens at each one, when the aarti starts, and how to get a boat without haggling for twenty minutes.",
  },
  {
    type: "transport",
    path: "transport",
    label: "Getting around",
    labelHi: "आवागमन",
    shortLabel: "Transport",
    tagline: "Stations, airport, transport",
    singular: "Transport",
    h1: "Getting around Varanasi",
    metaTitle: "Varanasi transport – stations, airport, ropeway, cabs",
    metaDescription:
      "Railway stations, the airport, the Kashi ropeway and cab and auto stands in Varanasi, with distances to the stadium and fares we last checked.",
    intro:
      "Stations, the airport, the new ropeway and the auto and cab stands you'll actually use, with distances to the stadium and the old city.",
  },
];

export function getCategoryByPath(path: string) {
  return CATEGORIES.find((c) => c.path === path);
}

export function getCategoryByType(type: ListingType) {
  return CATEGORIES.find((c) => c.type === type)!;
}

// A category or collection only gets a public page once it has this many listings.
export const MIN_LISTINGS_TO_PUBLISH = 5;
