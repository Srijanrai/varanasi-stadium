"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCompass, IconHome, IconRoute, IconStadium } from "./icons";

const ITEMS = [
  { href: "/", label: "Home", Icon: IconHome, match: (p: string) => p === "/" },
  { href: "/stadium/", label: "Stadium", Icon: IconStadium, match: (p: string) => p === "/stadium/" || /^\/stadium\/(tickets|matches|construction)/.test(p) || p.startsWith("/hi/") },
  { href: "/stadium/how-to-reach/", label: "Plan trip", Icon: IconRoute, match: (p: string) => p.startsWith("/stadium/how-to-reach") },
  { href: "/explore/", label: "Explore", Icon: IconCompass, match: (p: string) => p.startsWith("/explore") || /^\/(hotels|temples|ghats|hospitals|transport|areas)\//.test(p) },
];

// Listing detail pages have their own sticky Call/WhatsApp bar instead.
const isListingDetail = (p: string) => /^\/(hotels|temples|ghats|hospitals|transport)\/[^/]+\/$/.test(p);

/** App-style bottom navigation on phones. */
export function BottomNav() {
  const pathname = usePathname();
  if (isListingDetail(pathname)) return null;
  return (
    <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-30 bg-navy-2 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-4">
        {ITEMS.map(({ href, label, Icon, match }) => {
          const active = match(pathname);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[0.7rem] ${active ? "font-semibold text-gold" : "text-white/75"}`}
              >
                <Icon className="h-[22px] w-[22px]" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
