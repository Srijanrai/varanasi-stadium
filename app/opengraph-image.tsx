import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} – your match-day guide to Varanasi's new cricket stadium`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Default share card (WhatsApp, Facebook, X) for every page that doesn't set its own.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #021e3a 0%, #0b2c52 60%, #7a4a12 130%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="70" viewBox="0 0 40 44" fill="none" stroke="#f6c35f" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
            <path d="M20 2v4M20 6c-2.5 5-6 8-6 14h12c0-6-3.5-9-6-14Z" />
            <path d="M10 42V27c0-3.5 2.5-6 5-7h10c2.5 1 5 3.5 5 7v15" />
            <path d="M4 42V32c0-2.5 2-4 3.5-4.5M36 42V32c0-2.5-2-4-3.5-4.5" />
            <path d="M17 42v-7a3 3 0 0 1 6 0v7M1 42h38" />
          </svg>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: 3 }}>VARANASI</div>
            <div style={{ fontSize: 24, opacity: 0.85 }}>Stadium Guide</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 24, color: "#f6c35f", letterSpacing: 4 }}>GANJARI, VARANASI</div>
          <div style={{ display: "flex", fontSize: 76, fontWeight: 700, lineHeight: 1.05, marginTop: 12 }}>
            The new home of cricket in&nbsp;<span style={{ color: "#f6c35f" }}>Kashi</span>
          </div>
          <div style={{ fontSize: 30, opacity: 0.85, marginTop: 20 }}>How to get there · Where to stay · Match news · Kashi tips</div>
        </div>
      </div>
    ),
    size,
  );
}
