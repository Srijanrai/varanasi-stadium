"use client";

import { track, type TrackEvent } from "@/lib/track";
import { directionsHref, telHref, whatsappHref } from "@/lib/format";
import { WhatsAppIcon } from "./ShareWhatsApp";
import { IconDirections, IconPhone } from "./icons";

type Props = {
  listingId: string;
  type: string;
  name: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  geo: { lat: number; lng: number };
};

/** Call / WhatsApp / Directions. Inline on desktop, sticky bottom bar on phones. */
export function ActionBar({ listingId, type, name, phone, whatsapp, website, geo }: Props) {
  const params = { listingId, type };
  const actions: { key: string; label: string; href: string; event: TrackEvent; primary?: boolean; external?: boolean }[] = [];
  if (phone) actions.push({ key: "call", label: "Call", href: telHref(phone), event: "click_call", primary: !whatsapp });
  if (whatsapp)
    actions.push({
      key: "wa",
      label: "WhatsApp",
      href: whatsappHref(whatsapp, `Hi, I found ${name} on the Varanasi Stadium Guide.`),
      event: "click_whatsapp",
      primary: true,
      external: true,
    });
  actions.push({ key: "dir", label: "Directions", href: directionsHref(geo), event: "click_directions", external: true });
  if (website && actions.length < 3)
    actions.push({ key: "web", label: "Website", href: website, event: "click_website", external: true });

  const btn = (a: (typeof actions)[number], extra = "") => (
    <a
      key={a.key}
      href={a.href}
      {...(a.external ? { target: "_blank", rel: "noopener nofollow" } : {})}
      onClick={() => track(a.event, params)}
      className={`btn flex-1 !rounded-xl ${a.key === "call" ? "btn-wa" : a.key === "wa" ? (actions.some((x) => x.key === "call") ? "btn-wa-outline" : "btn-wa") : "btn-outline"} ${extra}`}
    >
      {a.key === "wa" && <WhatsAppIcon />}
      {a.key === "call" && <IconPhone className="h-4 w-4" />}
      {a.key === "dir" && <IconDirections className="h-4 w-4" />}
      {a.label}
    </a>
  );

  return (
    <>
      <div className="hidden flex-wrap gap-2.5 sm:flex sm:max-w-xl">{actions.map((a) => btn(a))}</div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-card px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_-12px_rgba(24,33,61,0.25)] sm:hidden">
        <div className="flex gap-2">{actions.slice(0, 3).map((a) => btn(a, "px-3"))}</div>
      </div>
    </>
  );
}
