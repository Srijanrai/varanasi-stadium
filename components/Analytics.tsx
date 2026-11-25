"use client";

import { useEffect } from "react";
import { SITE } from "@/lib/site";

/**
 * PostHog product analytics. Cookie-free: nothing is stored on the visitor's device (persistence "memory"),
 * so a visitor counts as new on each full page load. No session replay.
 * Runs only on the real domain in a production build, so local previews and netlify.app visits never count.
 * Loaded after the page is interactive, so it never slows the first paint.
 */
export function Analytics() {
  useEffect(() => {
    if (!SITE.posthogKey) return;
    if (window.location.hostname !== new URL(SITE.url).hostname) return;
    import("posthog-js").then(({ default: posthog }) => {
      if (posthog.__loaded) return;
      posthog.init(SITE.posthogKey!, {
        api_host: "/ingest", // proxied to PostHog by netlify.toml, so ad blockers drop fewer events
        ui_host: "https://us.posthog.com",
        persistence: "memory",
        capture_pageview: "history_change", // also counts in-app page changes
        capture_pageleave: true,
        disable_session_recording: true,
        person_profiles: "identified_only",
      });
    });
  }, []);
  return null;
}
