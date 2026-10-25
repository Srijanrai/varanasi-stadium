"use client";

import Image from "next/image";
import { useState } from "react";
import type { Photo as PhotoT } from "@/lib/schema/listing";
import { CATEGORY_ICONS, IconStadium } from "./icons";

export type PhotoKind = keyof typeof CATEGORY_ICONS | "stadium";

/**
 * A photo at a fixed aspect ratio. Falls back to a designed placeholder when there's
 * no photo yet, or when the image fails to load.
 */
export function Photo({
  photo,
  aspect = "aspect-[4/3]",
  sizes,
  priority,
  className = "",
  kind = "stadium",
  label,
  imgClassName = "",
  children,
}: {
  photo?: PhotoT;
  aspect?: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  kind?: PhotoKind;
  /** Shown on the placeholder, e.g. the place name */
  label?: string;
  /** Extra classes for the <img>, e.g. a colour-grade filter */
  imgClassName?: string;
  children?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const Icon = kind === "stadium" ? IconStadium : CATEGORY_ICONS[kind];
  const showImage = photo && !failed;

  return (
    <div className={`relative overflow-hidden ${aspect} ${className}`}>
      {showImage ? (
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          priority={priority}
          className={`object-cover ${imgClassName}`}
          // SVG illustrations are served as-is (the optimizer only handles raster images)
          unoptimized={photo.src.endsWith(".svg")}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="photo-placeholder flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center" role="img" aria-label={label ? `${label}, photo coming soon` : "Photo coming soon"}>
          <Icon className="h-8 w-8 opacity-80" />
          {label && <span className="max-w-[18ch] font-serif text-lg leading-tight text-[#f4eef0]">{label}</span>}
          {label && <span className="text-[0.7rem] tracking-wide text-[#ecd9a6]/70">Photo coming soon</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export function PhotoCredit({ photo, className = "" }: { photo?: PhotoT; className?: string }) {
  if (!photo) return null;
  return (
    <p className={`z-10 text-[0.7rem] ${/\btext-(white|ink|muted)/.test(className) ? "" : "text-muted"} ${className}`}>
      {(photo.license === "own" || photo.license === "official-render") && !photo.sourceUrl ? (
        photo.credit
      ) : (
        <>
      Photo:{" "}
      {photo.sourceUrl ? (
        <a href={photo.sourceUrl} target="_blank" rel="noopener nofollow" className="underline underline-offset-2">
          {photo.credit}
        </a>
      ) : (
        photo.credit
      )}
      {photo.edited && <>, {photo.edited.toLowerCase()}</>}
      {photo.licenseName && (
        <>
          {", "}
          {photo.licenseUrl ? (
            <a href={photo.licenseUrl} target="_blank" rel="noopener nofollow license" className="underline underline-offset-2">
              {photo.licenseName}
            </a>
          ) : (
            photo.licenseName
          )}
        </>
      )}
        </>
      )}
    </p>
  );
}
