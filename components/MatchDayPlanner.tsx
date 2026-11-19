"use client";

import { useMemo, useState } from "react";
import { track } from "@/lib/track";
import { whatsappShareHref } from "@/lib/format";
import { WhatsAppIcon } from "./ShareWhatsApp";

export type PlannerOrigin = {
  id: string;
  name: string;
  roadKm: number; // measured, or straight-line × road factor
  measured: boolean;
  normalMinutes: [number, number] | null;
  bestOption: string;
  steps: string[];
};

// Assumptions, shown to the user so the estimate is honest.
const AVG_SPEED_KMH = 24; // mixed city + highway traffic
const MATCH_DAY_EXTRA_MIN = 40; // queues near Rajatalab on match days
const GATE_BUFFER_MIN = 75; // security, finding your stand, getting settled

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatClock(mins: number) {
  const m = ((mins % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, "0");
  const h12 = h24 % 12 || 12;
  return `${h12}:${mm} ${h24 < 12 ? "am" : "pm"}`;
}

function roundDownTo5(n: number) {
  return Math.floor(n / 5) * 5;
}

const TEXT = {
  en: {
    eyebrow: "MATCH-DAY PLANNER",
    title: "When should I leave?",
    intro: "Pick where you're starting from and when the match begins.",
    from: "Starting from",
    startsAt: "Match starts at",
    extra: "Add extra time for match-day traffic",
    leaveBy: (t: string) => `Leave by ${t}`,
    arrive: (t: string) => `Reach the gates around ${t}`,
    distance: "Distance",
    distanceEst: "Distance (est.)",
    drive: "Drive time",
    traffic: "Match-day traffic",
    gates: "Gates & security",
    bestWay: "Best way:",
    share: "Send this plan to your group",
    shareText: (origin: string, leave: string, start: string) =>
      `Match day plan: leave ${origin} by ${leave} for a ${start} start at Varanasi stadium (Ganjari).`,
    note: (kmh: number) =>
      `This is an estimate. Until we've timed each route ourselves, it assumes an average of ${kmh} km/h. Official match-day traffic plans haven't been published yet.`,
  },
  hi: {
    eyebrow: "मैच-डे प्लानर",
    title: "कब निकलें?",
    intro: "बताइए कहाँ से चल रहे हैं और मैच कब शुरू होगा।",
    from: "कहाँ से",
    startsAt: "मैच शुरू होगा",
    extra: "मैच वाले दिन के ट्रैफ़िक का अतिरिक्त समय जोड़ें",
    leaveBy: (t: string) => `${t} तक निकलें`,
    arrive: (t: string) => `गेट पर लगभग ${t} पहुँचेंगे`,
    distance: "दूरी",
    distanceEst: "दूरी (अनुमान)",
    drive: "सफ़र का समय",
    traffic: "मैच-डे ट्रैफ़िक",
    gates: "गेट और सुरक्षा जाँच",
    bestWay: "सबसे अच्छा तरीका:",
    share: "यह प्लान अपने ग्रुप को भेजें",
    shareText: (origin: string, leave: string, start: string) =>
      `मैच-डे प्लान: ${origin} से ${leave} तक निकलें, वाराणसी स्टेडियम (गंजारी) में ${start} बजे शुरू होने वाले मैच के लिए।`,
    note: (kmh: number) =>
      `यह एक अनुमान है। जब तक हम हर रास्ते का समय ख़ुद नहीं नाप लेते, यह औसतन ${kmh} किमी/घंटा मानकर चलता है। मैच वाले दिन का आधिकारिक ट्रैफ़िक प्लान अभी जारी नहीं हुआ है।`,
  },
};

export function MatchDayPlanner({
  origins,
  siteUrl,
  lang = "en",
  sharePath = "/stadium/how-to-reach/",
}: {
  origins: PlannerOrigin[];
  siteUrl: string;
  lang?: "en" | "hi";
  sharePath?: string;
}) {
  const t = TEXT[lang];
  const [originId, setOriginId] = useState(origins[0]?.id ?? "");
  const [start, setStart] = useState("19:30");
  const [matchDay, setMatchDay] = useState(true);

  const origin = origins.find((o) => o.id === originId) ?? origins[0];

  const plan = useMemo(() => {
    if (!origin || !start) return null;
    const drive = origin.normalMinutes
      ? Math.round((origin.normalMinutes[0] + origin.normalMinutes[1]) / 2)
      : Math.round((origin.roadKm / AVG_SPEED_KMH) * 60);
    const extra = matchDay ? MATCH_DAY_EXTRA_MIN : 0;
    const leave = roundDownTo5(toMinutes(start) - GATE_BUFFER_MIN - drive - extra);
    return { drive, extra, leave, arrive: toMinutes(start) - GATE_BUFFER_MIN };
  }, [origin, start, matchDay]);

  if (!origin || !plan) return null;

  const shareText = t.shareText(origin.name, formatClock(plan.leave), formatClock(toMinutes(start)));

  return (
    <section aria-labelledby="planner-title" className="overflow-hidden rounded-[14px] bg-cream shadow-[var(--shadow)]">
      <div className="p-5 pb-0 sm:p-7 sm:pb-0">
        <p className="text-xs font-semibold tracking-[0.12em] text-gold-ink">{t.eyebrow}</p>
        <h2 id="planner-title" className="mt-1 text-[clamp(1.6rem,5vw,2.1rem)]">
          {t.title}
        </h2>
        <p className="mt-2 text-muted">{t.intro}</p>

        <form className="mt-5 grid gap-4 sm:grid-cols-[2fr_1fr]" onSubmit={(e) => e.preventDefault()}>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            {t.from}
            <select
              value={originId}
              onChange={(e) => {
                setOriginId(e.target.value);
                track("planner_used", { origin: e.target.value });
              }}
              className="field font-normal"
            >
              {origins.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            {t.startsAt}
            <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className="field font-normal" />
          </label>
          <label className="flex min-h-11 items-center gap-3 sm:col-span-2">
            <input
              type="checkbox"
              checked={matchDay}
              onChange={(e) => setMatchDay(e.target.checked)}
              className="h-5 w-5 accent-[var(--gold)]"
            />
            {t.extra}
          </label>
        </form>
      </div>

      <div className="p-5 sm:p-7">
        <div aria-live="polite" className="rounded-xl bg-cream-strong px-5 py-6 text-center">
          <p className="font-serif text-[clamp(1.9rem,7vw,2.6rem)] font-bold leading-none">{t.leaveBy(formatClock(plan.leave).toUpperCase())}</p>
          <p className="mt-2 text-sm text-muted">{t.arrive(formatClock(plan.arrive).toUpperCase())}</p>
        </div>

        <dl className="mt-5 grid grid-cols-4 divide-x divide-border text-center">
          {[
            [`${Math.round(origin.roadKm)} km`, origin.measured ? t.distance : t.distanceEst],
            [`${plan.drive} min`, t.drive],
            [matchDay ? `+ ${plan.extra} min` : "—", t.traffic],
            [`${GATE_BUFFER_MIN} min`, t.gates],
          ].map(([v, k]) => (
            <div key={k} className="px-1">
              <dd className="font-serif text-[1rem] font-bold whitespace-nowrap sm:text-[1.4rem]">{v}</dd>
              <dt className="mt-0.5 text-[0.7rem] leading-tight text-muted sm:text-xs">{k}</dt>
            </div>
          ))}
        </dl>

        <div className="mt-6 rounded-xl bg-card/70 p-4 sm:p-5">
          <p className="text-sm font-semibold">{t.bestWay} <span className="font-normal">{origin.bestOption}</span></p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
            {origin.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
        </div>

        <a
          href={whatsappShareHref(`${shareText}\n${siteUrl}${sharePath}`)}
          target="_blank"
          rel="noopener"
          onClick={() => track("share_whatsapp", { from: "planner", origin: origin.id })}
          className="btn btn-wa mt-5 w-full !rounded-xl"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {t.share}
        </a>
      </div>
      <p className="px-5 pb-5 text-xs text-muted sm:px-7">
        {t.note(AVG_SPEED_KMH)}
      </p>
    </section>
  );
}
