import Link from "next/link";
import { getListings } from "@/lib/data/listings";
import { getSiteImages } from "@/lib/data/content";
import { listingUrl } from "@/lib/seo/jsonld";
import { pageMeta } from "@/lib/seo/meta";
import { TextPage } from "@/components/TextPage";
import type { Photo } from "@/lib/schema/listing";

export const metadata = pageMeta({
  title: "Photo credits",
  description: "Who took the photos on this site, and the licences they're shared under.",
  path: "/credits/",
});

type Row = { photo: Photo; usedOn: { label: string; href: string } };

export default function CreditsPage() {
  const site = getSiteImages();
  const rows: Row[] = [
    { photo: site.hero, usedOn: { label: "Home page", href: "/" } },
    ...(site.aarti ? [{ photo: site.aarti, usedOn: { label: "Home page (Ganga aarti)", href: "/" } }] : []),
    ...(site.stadium ? [{ photo: site.stadium, usedOn: { label: "Stadium guide and home page (desktop)", href: "/stadium/" } }] : []),
    ...(site.stadiumMobile ? [{ photo: site.stadiumMobile, usedOn: { label: "Stadium guide and home page (phones)", href: "/stadium/" } }] : []),
    ...getListings().flatMap((l) => l.photos.map((photo) => ({ photo, usedOn: { label: l.name, href: listingUrl(l) } }))),
  ];
  // Only third-party photos need listing here; our own photos don't.
  const credited = rows.filter((r) => r.photo.license !== "own");

  return (
    <TextPage
      title="Photo credits"
      path="/credits/"
      lead="Some photos on this site were taken by other photographers and shared under Creative Commons licences. Thank you to each of them."
    >
      <p>
        Photos may be cropped to fit the page layout. Where we've changed a photo in any other way, it says so below. Each
        photo is shared under the same licence as the original.
      </p>
      <ul className="!mt-6 grid gap-3 !pl-0 [list-style:none]">
        {credited.map(({ photo, usedOn }) => (
          <li key={photo.src + usedOn.href} className="card !mt-0 p-4">
            <p className="font-semibold">
              <Link href={usedOn.href} className="no-underline hover:underline">
                {usedOn.label}
              </Link>
            </p>
            <p className="mt-1 text-sm text-muted">
              {photo.sourceUrl ? (
                <a href={photo.sourceUrl} target="_blank" rel="noopener nofollow">
                  {photo.credit}
                </a>
              ) : (
                photo.credit
              )}
              {photo.licenseName && (
                <>
                  {" · "}
                  {photo.licenseUrl ? (
                    <a href={photo.licenseUrl} target="_blank" rel="noopener nofollow license">
                      {photo.licenseName}
                    </a>
                  ) : (
                    photo.licenseName
                  )}
                </>
              )}
              {photo.edited && <> · {photo.edited}</>}
            </p>
          </li>
        ))}
      </ul>
      <h2>Fonts and software</h2>
      <p>
        Text is set in Figtree and Hind, both under the SIL Open Font License. The site is built with open-source software
        including Next.js and React (MIT licence).
      </p>
      <p>
        Spot a photo or image of yours that isn&apos;t credited correctly, or that you&apos;d like removed?{" "}
        <Link href="/contact/">Tell us</Link> and we&apos;ll fix it or take it down straight away.
      </p>
    </TextPage>
  );
}
