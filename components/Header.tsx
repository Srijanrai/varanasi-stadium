"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { IconClose, IconMenu, IconSearch } from "./icons";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = { href: string; label: string };

const STADIUM_LINKS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/stadium/", label: "Stadium" },
  { href: "/stadium/how-to-reach/", label: "How to reach" },
];

// Pages that have a Hindi version. Keep in sync with app/hi/.
const HINDI_PAIRS: Record<string, string> = { "/stadium/": "/hi/stadium/" };
const HINDI_HUB = "/hi/stadium/";

export function Header({ categories }: { categories: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const items = [...STADIUM_LINKS, ...categories];
  const isHindi = pathname.startsWith("/hi/");
  const englishHref = Object.entries(HINDI_PAIRS).find(([, hi]) => hi === pathname)?.[0] ?? "/";
  const hindiHref = HINDI_PAIRS[pathname] ?? HINDI_HUB;

  return (
    <header className="sticky top-0 z-40 bg-navy text-on-navy shadow-[0_1px_0_rgba(255,255,255,0.06)]">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:h-[72px] sm:px-6">
        <Logo />

        <nav aria-label="Main" className="ml-auto hidden xl:block">
          <ul className="flex items-center">
            {items.map((it) => {
              const active = pathname === it.href;
              return (
                <li key={it.href}>
                  <Link
                    href={it.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative block px-3 py-2 text-[0.85rem] transition-colors ${active ? "text-gold" : "text-white/80 hover:text-white"}`}
                  >
                    {it.label}
                    {active && <span aria-hidden className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-gold" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 xl:ml-3">
          <Link href="/search/" aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full text-white/90 hover:bg-white/10">
            <IconSearch />
          </Link>
          <div className="flex items-center px-2 text-[0.8rem] font-semibold">
            <Link href={englishHref} hrefLang="en" aria-current={!isHindi ? "true" : undefined} className={!isHindi ? "text-gold" : "text-white/70 hover:text-white"}>
              EN
            </Link>
            <span aria-hidden className="px-1.5 text-white/40">
              |
            </span>
            <Link href={hindiHref} hrefLang="hi" lang="hi" aria-current={isHindi ? "true" : undefined} className={isHindi ? "text-gold" : "text-white/70 hover:text-white"}>
              हिन्दी
            </Link>
          </div>
          <span className="hidden sm:block">
            <ThemeToggle />
          </span>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full text-white/90 hover:bg-white/10 xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <IconClose /> : <IconMenu />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Main" className="border-t border-white/10 bg-navy xl:hidden">
          <ul className="mx-auto grid max-w-6xl px-4 py-2 sm:grid-cols-2 sm:gap-x-8 sm:px-6">
            {items.map((it) => (
              <li key={it.href} className="border-b border-white/10">
                <Link
                  href={it.href}
                  aria-current={pathname === it.href ? "page" : undefined}
                  className="flex min-h-13 items-center text-[1.05rem] text-white/90 aria-[current=page]:text-gold"
                >
                  {it.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 text-sm text-white/70 sm:hidden">
            Theme <ThemeToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
