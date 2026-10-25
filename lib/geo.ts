export type Geo = { lat: number; lng: number };

// Reference points used for distance chips and the match-day planner.
// Stadium pin: Wikipedia's coordinates for the stadium (25.2958, 82.8549), which OpenStreetMap places
// in Rajatalab, PIN 221311 — the stadium's published postal area. Checked 25 Oct 2026; confirm on Google Maps.
export const LANDMARKS = {
  stadium: { label: "Stadium", geo: { lat: 25.2958, lng: 82.8549 } },
  kashiVishwanath: { label: "Kashi Vishwanath", geo: { lat: 25.3109, lng: 83.0107 } },
  cantt: { label: "Cantt station", geo: { lat: 25.327, lng: 82.987 } },
  airport: { label: "Airport", geo: { lat: 25.4524, lng: 82.8593 } },
  bhu: { label: "BHU", geo: { lat: 25.2677, lng: 82.9913 } },
} as const;

export type LandmarkKey = keyof typeof LANDMARKS;

// Straight-line distance in km.
export function haversineKm(a: Geo, b: Geo) {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Most of the trip to Ganjari is on the Ring Road/highway, so road distance is only a
// little longer than straight-line. [VERIFY] by driving the routes and recording roadKm in routes.json.
export const ROAD_FACTOR = 1.15;

export function roadKmEstimate(a: Geo, b: Geo) {
  return haversineKm(a, b) * ROAD_FACTOR;
}

export function formatKm(km: number) {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km < 10 ? km.toFixed(1) : Math.round(km)} km`;
}
