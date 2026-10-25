// Analytics events. Works with GA4 (gtag) or anything reading window.dataLayer.
export type TrackEvent =
  | "click_call"
  | "click_whatsapp"
  | "click_directions"
  | "click_website"
  | "alert_signup"
  | "list_business_click"
  | "share_whatsapp"
  | "planner_used";

type Params = Record<string, string | number | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function track(event: TrackEvent, params: Params = {}) {
  if (typeof window === "undefined") return;
  if (window.gtag) window.gtag("event", event, params);
  else (window.dataLayer ??= []).push({ event, ...params });
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, params);
}
