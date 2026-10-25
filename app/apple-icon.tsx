import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Home-screen icon for iPhone/iPad: gold temple mark on navy.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#021e3a" }}>
        <svg width="120" height="120" viewBox="0 0 40 44" fill="none" stroke="#f6c35f" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
          <path d="M20 2v4M20 6c-2.5 5-6 8-6 14h12c0-6-3.5-9-6-14Z" />
          <path d="M10 42V27c0-3.5 2.5-6 5-7h10c2.5 1 5 3.5 5 7v15" />
          <path d="M4 42V32c0-2.5 2-4 3.5-4.5M36 42V32c0-2.5-2-4-3.5-4.5" />
          <path d="M17 42v-7a3 3 0 0 1 6 0v7M1 42h38" />
        </svg>
      </div>
    ),
    size,
  );
}
