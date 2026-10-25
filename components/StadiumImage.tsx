import { Photo, PhotoCredit } from "./Photo";
import type { Photo as PhotoT } from "@/lib/schema/listing";

/**
 * Stadium design renders: the exterior on desktop, the interior on phones.
 * Always labelled as the planned design, because the finished stadium in the images doesn't exist yet.
 */
export function StadiumImage({
  desktop,
  mobile,
  label = "Planned design",
  priority,
  className = "",
  children,
}: {
  desktop: PhotoT;
  mobile?: PhotoT;
  label?: string;
  priority?: boolean;
  className?: string;
  children?: React.ReactNode;
}) {
  const tag = <span className="chip absolute top-3 right-3 z-10 bg-black/55 text-white">{label}</span>;
  return (
    <>
      <div className={`relative overflow-hidden ${className}`}>
        <Photo photo={mobile ?? desktop} aspect="aspect-[16/10]" sizes="100vw" priority={priority} className="sm:hidden">
          {tag}
          {children}
        </Photo>
        <Photo photo={desktop} aspect="aspect-[3/1]" sizes="(min-width:1152px) 1104px, 100vw" priority={priority} className="hidden sm:block">
          {tag}
          {children}
        </Photo>
      </div>
      <PhotoCredit photo={desktop} className="mt-1.5 text-right" />
    </>
  );
}
