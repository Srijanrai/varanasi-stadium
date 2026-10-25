import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets a second build (e.g. a production audit) run without touching the dev server's .next folder.
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  trailingSlash: true,
  // Always render <title>, description and share tags in <head> (no metadata streaming),
  // so every crawler and link-preview bot (WhatsApp, Facebook, SEO tools) sees them.
  htmlLimitedBots: /.*/,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // All photos are self-hosted in /public/images (CC-licensed ones are credited on /credits/).
  },
};

export default nextConfig;
