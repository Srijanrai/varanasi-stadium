export function formatDate(iso: string, locale: "en-IN" | "hi-IN" = "en-IN") {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00+05:30`);
  return d.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
}

export function formatPriceRange(min?: number, max?: number) {
  if (!min && !max) return null;
  const f = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  if (min && max) return `${f(min)}–${f(max)}`;
  return min ? `from ${f(min)}` : `up to ${f(max!)}`;
}

export function telHref(phone: string) {
  return `tel:${phone}`;
}

export function whatsappHref(phone: string, text?: string) {
  const n = phone.replace(/\D/g, "");
  return `https://wa.me/${n}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

export function directionsHref(geo: { lat: number; lng: number }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${geo.lat},${geo.lng}`;
}

export function whatsappShareHref(text: string) {
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}
