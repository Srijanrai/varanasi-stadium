import Link from "next/link";

/** Temple-shikhara mark in gold + "VARANASI / Stadium Guide" wordmark. */
export function Logo({ tagline = true }: { tagline?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2.5 text-white" aria-label="Varanasi Stadium Guide, home">
      <svg viewBox="0 0 40 40" className="h-10 w-10 shrink-0 text-gold sm:h-11 sm:w-11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" aria-hidden>
        <path d="M20 3v3M20 6c-2 4-5 7-5 12h10c0-5-3-8-5-12Z" />
        <path d="M11 37V24c0-3 2-5 4-6h10c2 1 4 3 4 6v13" />
        <path d="M7 37V28c0-2 1.5-3.5 3-4M33 37V28c0-2-1.5-3.5-3-4" />
        <path d="M17 37v-6a3 3 0 0 1 6 0v6M4 37h32" />
      </svg>
      <span className="leading-none">
        <span className="block font-serif text-[1.2rem] font-bold tracking-[0.05em] sm:text-[1.35rem]">VARANASI</span>
        <span className="mt-0.5 block text-[0.8rem] text-white/90 sm:text-[0.9rem]">Stadium Guide</span>
        {tagline && <span className="mt-0.5 hidden text-[0.62rem] text-white/60 sm:block">Ganjari stadium &amp; Kashi</span>}
      </span>
    </Link>
  );
}
