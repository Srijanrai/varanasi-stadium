// Brand, URLs and external links. Replace the placeholders before launch.
export const SITE = {
  name: "Varanasi Stadium Guide", // [DECIDE] final brand name
  shortName: "Stadium Guide",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com").replace(/\/$/, ""),
  description:
    "Independent local guide to Varanasi's new cricket stadium at Ganjari — how to get there, where to stay, match news, and what to do in Kashi before and after the game.",
  email: "hello@example.com", // [DECIDE]
  whatsappChannelUrl: "https://whatsapp.com/channel/REPLACE_ME", // [DECIDE]
  forms: {
    matchAlerts: "https://forms.gle/REPLACE_ME", // [DECIDE] Google Form / Tally
    listBusiness: "https://forms.gle/REPLACE_ME",
    reportWrongInfo: "https://forms.gle/REPLACE_ME",
  },
  disclaimer:
    "Independent, unofficial guide. Not affiliated with BCCI, UPCA, IPL, WPL or any government body. We do not sell tickets.",
  locale: "en_IN",
} as const;

export const showDrafts = process.env.SHOW_DRAFTS === "1";
// Set only on preview/staging deployments: blocks all crawling so a preview never gets indexed.
// Local dev with drafts stays crawlable for Lighthouse; draft pages carry their own noindex.
export const isPreviewDeployment = process.env.PREVIEW_DEPLOYMENT === "1";

export function absoluteUrl(path: string) {
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}
