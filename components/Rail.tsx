"use client";

import { useRef } from "react";
import { IconChevron } from "./icons";

/** Horizontal carousel with a "next" arrow on larger screens; swipe on phones. */
export function Rail({ children, label }: { children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  return (
    <div className="relative">
      <div ref={ref} className="rail -mx-4 px-4 sm:mx-0 sm:px-0" role="region" aria-label={label} tabIndex={0}>
        {children}
      </div>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label={`Scroll ${label} forward`}
        className="absolute top-[38%] -right-4 hidden h-10 w-10 place-items-center rounded-full bg-card text-ink shadow-[var(--shadow)] ring-1 ring-border hover:ring-ink sm:grid"
      >
        <IconChevron className="h-5 w-5" />
      </button>
    </div>
  );
}
