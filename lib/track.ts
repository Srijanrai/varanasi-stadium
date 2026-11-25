// Analytics events. Sent to PostHog (when it has loaded, see components/Analytics.tsx), and to GA4/dataLayer if present.
export type TrackEvent =
  | "click_call"
  | "click_whatsapp"
  | "click_directions"
  | "click_website"
  | "alert_signup"
  | "list_business_click"
  | "share_whatsapp"
  | "planner_used"
  | "affiliate_click";

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
  // Same module PostHog was loaded from, so this is a cached import; does nothing if PostHog never started.
  import("posthog-js")
    .then(({ default: posthog }) => {
      if (posthog.__loaded) posthog.capture(event, params);
    })
    .catch(() => {});
  if (process.env.NODE_ENV === "development") console.debug("[track]", event, params);
}
