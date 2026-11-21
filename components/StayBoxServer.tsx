import { SITE, showDrafts } from "@/lib/site";
import { StayBox, type StayPreset } from "./StayBox";

type Props = { id: string; title: string; intro: string; presets: (StayPreset & { label: string })[] };

/** Renders the booking box only once a partner ID is set, or in local preview. */
export function StayBoxSection(props: Props) {
  const { bookingAid, agodaCid } = SITE.affiliates;
  const live = Boolean(bookingAid || agodaCid);
  if (!live && !showDrafts) return null;
  return <StayBox {...props} bookingAid={bookingAid} agodaCid={agodaCid} preview={!live} />;
}

// Area presets shared across pages. Notes are our own words, based on distances already on the site.
export const STAY_PRESETS = {
  stadiumSide: { label: "Stadium side", geo: { lat: 25.2958, lng: 82.8549 }, note: "Places nearest the ground at Ganjari come first. Shortest match-day drive." },
  lanka: { label: "Lanka / BHU", query: "Banaras Hindu University", note: "South Varanasi near BHU. A straight run to the Ring Road and Rajatalab." },
  cantt: { label: "Cantt station", query: "Varanasi Junction", note: "Easiest if you arrive by train. About 15–18 km from the stadium." },
  assi: { label: "Assi Ghat", query: "Assi Ghat", note: "Calmer southern ghats, good for a match plus a Kashi trip." },
  dashashwamedh: { label: "Dashashwamedh", query: "Kashi Vishwanath Temple", note: "Next to the evening aarti and Kashi Vishwanath. Allow extra time to reach the stadium." },
} satisfies Record<string, StayPreset & { label: string }>;
