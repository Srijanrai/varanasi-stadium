import Link from "next/link";
import { CATEGORY_ICONS, IconStadium } from "./icons";
import type { CategoryConfig } from "@/lib/categories";

/** Category shortcuts: gold icon in a soft circle, name, and a one-line description (desktop). */
export function CategoryTabs({ categories, active }: { categories: CategoryConfig[]; active?: string }) {
  const tabs = [
    { href: "/stadium/", label: "Stadium", long: "Stadium Guide", tagline: "Status, matches, tickets", Icon: IconStadium, key: "stadium" },
    ...categories.map((c) => ({ href: `/${c.path}/`, label: c.shortLabel, long: c.label, tagline: c.tagline, Icon: CATEGORY_ICONS[c.type], key: c.path })),
  ];
  return (
    <nav aria-label="Categories" className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
      <ul className="flex justify-between gap-1 sm:gap-4">
        {tabs.map(({ href, label, long, tagline, Icon, key }) => {
          const on = active === key;
          return (
            <li key={key} className="min-w-[3.4rem] flex-1">
              <Link href={href} aria-current={on ? "page" : undefined} className="group flex flex-col items-center gap-2 text-center">
                <span
                  className={`icon-tile h-11 w-11 transition-colors sm:h-16 sm:w-16 ${on ? "!bg-gold !text-on-gold" : "group-hover:!bg-gold group-hover:!text-on-gold"}`}
                >
                  <Icon className="h-[22px] w-[22px] text-gold-deep [stroke-width:1.9] sm:h-8 sm:w-8" />
                </span>
                <span className="text-[0.68rem] font-semibold leading-tight text-ink sm:text-[0.92rem]">
                  <span className="sm:hidden">{label}</span>
                  <span className="hidden sm:inline">{long}</span>
                </span>
                <span className="hidden text-xs leading-tight text-muted sm:block">{tagline}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
