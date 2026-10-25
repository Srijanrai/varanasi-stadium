"use client";

import { useRef, useState } from "react";
import type { Photo as PhotoT } from "@/lib/schema/listing";
import { Photo, PhotoCredit, type PhotoKind } from "./Photo";

/** Swipeable photo gallery with dots and a "1/6" counter. Falls back to the placeholder. */
export function Gallery({ photos, kind, name }: { photos: PhotoT[]; kind: PhotoKind; name: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const count = Math.max(photos.length, 1);

  const onScroll = () => {
    const el = ref.current;
    if (el) setIndex(Math.round(el.scrollLeft / el.clientWidth));
  };

  return (
    <figure>
      <div className="relative overflow-hidden rounded-[20px]">
        <div ref={ref} onScroll={onScroll} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]" aria-label={`${name} photos`}>
          {(photos.length ? photos : [undefined]).map((p, i) => (
            <div key={p?.src ?? i} className="w-full shrink-0 snap-start">
              <Photo photo={p} aspect="aspect-[4/3] sm:aspect-[21/9]" sizes="(min-width:1152px) 1104px, 100vw" priority={i === 0} kind={kind} label={p ? undefined : name} />
            </div>
          ))}
        </div>
        {count > 1 && (
          <>
            <span className="chip absolute right-3 bottom-3 bg-black/60 text-white">
              {index + 1}/{count}
            </span>
            <div className="absolute inset-x-0 bottom-3.5 flex justify-center gap-1.5" aria-hidden>
              {photos.map((p, i) => (
                <span key={p.src} className={`h-1.5 rounded-full transition-all ${i === index ? "w-4 bg-white" : "w-1.5 bg-white/60"}`} />
              ))}
            </div>
          </>
        )}
      </div>
      <PhotoCredit photo={photos[index]} className="mt-1.5 text-right" />
    </figure>
  );
}
