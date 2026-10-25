import Link from "next/link";
import { SITE } from "@/lib/site";
import { Logo } from "./Logo";

type NavItem = { href: string; label: string };

export function Footer({ categories }: { categories: NavItem[] }) {
  return (
    <footer className="mt-20 bg-navy pb-24 text-on-navy lg:pb-0">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-white/65">
            Written and checked by people who live in Banaras. Spot something wrong? Tell us and we&apos;ll fix it.
          </p>
        </div>
        <FooterList
          title="The stadium"
          items={[
            { href: "/stadium/", label: "Stadium guide" },
            { href: "/stadium/how-to-reach/", label: "How to reach" },
            { href: "/stadium/tickets/", label: "Tickets" },
            { href: "/stadium/matches/", label: "Matches" },
            { href: "/stadium/construction-updates/", label: "Construction updates" },
          ]}
        />
        {categories.length > 0 && <FooterList title="Explore Kashi" items={categories} />}
        <FooterList
          title="About"
          items={[
            { href: "/about/", label: "About us" },
            { href: "/editorial-policy/", label: "How we check listings" },
            { href: "/list-your-business/", label: "List your business" },
            { href: "/contact/", label: "Contact" },
            { href: "/disclaimer/", label: "Disclaimer" },
            { href: "/privacy-policy/", label: "Privacy" },
            { href: "/terms/", label: "Terms" },
            { href: "/credits/", label: "Photo credits" },
          ]}
        />
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-white/55 sm:px-6">
          {SITE.disclaimer} Photos are credited on each page and on our{" "}
          <Link href="/credits/" className="underline underline-offset-2 hover:text-white">
            photo credits
          </Link>{" "}
          page.
        </p>
      </div>
    </footer>
  );
}

function FooterList({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div>
      <h2 className="font-sans text-sm font-semibold text-gold">{title}</h2>
      <ul className="mt-3 space-y-1">
        {items.map((it) => (
          <li key={it.href}>
            <Link href={it.href} className="inline-block py-1 text-sm text-white/75 hover:text-white">
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
