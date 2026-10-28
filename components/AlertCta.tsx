import { SITE } from "@/lib/site";
import { TrackedLink } from "./TrackedLink";
import { WhatsAppIcon } from "./ShareWhatsApp";

/** Inline sign-up band. Never a popup — intrusive interstitials hurt mobile ranking. */
export function AlertCta({ from, lang = "en" }: { from: string; lang?: "en" | "hi" }) {
  if (!SITE.whatsappChannelUrl) return null;
  const t =
    lang === "hi"
      ? {
          title: "मैच पक्का होते ही, सबसे पहले आपको ख़बर",
          body: "मैच का ऐलान, टिकट खुलने की तारीख़ और रास्ते के अपडेट — सीधे WhatsApp पर।",
          cta: "WhatsApp पर जुड़ें",
          note: "मुफ़्त, कभी भी छोड़ सकते हैं",
        }
      : {
          title: "Be the first to know when a match is confirmed",
          body: "Official announcements, the day tickets open, and route updates, sent straight to WhatsApp.",
          cta: "Join on WhatsApp",
          note: "Free. Leave anytime.",
        };
  return (
    <section className="relative overflow-hidden rounded-[24px] bg-navy px-6 py-10 text-on-navy sm:px-12 sm:py-12">
      <div aria-hidden className="photo-placeholder absolute inset-0 opacity-60" />
      <div className="relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end md:gap-12">
        <div>
          <div className="zari-rule mb-5 w-12" />
          <h2 className="max-w-[22ch] text-[clamp(1.7rem,5vw,2.6rem)]">{t.title}</h2>
          <p className="mt-3 max-w-[50ch] text-white/75">{t.body}</p>
        </div>
        <div className="md:text-right">
          <TrackedLink
            href={SITE.whatsappChannelUrl}
            target="_blank"
            rel="noopener"
            event="alert_signup"
            params={{ from }}
            className="btn btn-wa w-full md:w-auto"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t.cta}
          </TrackedLink>
          <p className="mt-2 text-xs text-white/60">{t.note}</p>
        </div>
      </div>
    </section>
  );
}
