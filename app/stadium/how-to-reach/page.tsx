import { getFaqs, getRoutes, getStadium } from "@/lib/data/content";
import { LANDMARKS, roadKmEstimate } from "@/lib/geo";
import { pageMeta } from "@/lib/seo/meta";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { MatchDayPlanner, type PlannerOrigin } from "@/components/MatchDayPlanner";
import { AlertCta } from "@/components/AlertCta";
import { ShareWhatsApp } from "@/components/ShareWhatsApp";
import { Breadcrumbs, Container, FaqList, PageIntro, SectionHeading } from "@/components/ui";
import { IconBus, IconPin, IconPlane, IconRoute } from "@/components/icons";

export const metadata = pageMeta({
  title: "How to reach Varanasi Cricket Stadium (Ganjari) – routes & timings",
  description:
    "Routes to the Ganjari stadium from Cantt station, the ghats, Assi, BHU and the airport, with distances, when to leave on match day, and local tips.",
  path: "/stadium/how-to-reach/",
});

export default function HowToReachPage() {
  const routes = getRoutes();
  const faqs = getFaqs("how-to-reach.en");
  const origins: PlannerOrigin[] = routes.map((r) => ({
    id: r.id,
    name: r.name,
    roadKm: r.roadKm ?? roadKmEstimate(r.geo, LANDMARKS.stadium.geo),
    measured: r.roadKm !== null,
    normalMinutes: r.normalMinutes,
    bestOption: r.bestOption,
    steps: r.steps,
  }));

  return (
    <Container>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Stadium", path: "/stadium/" },
          { name: "How to reach", path: "/stadium/how-to-reach/" },
        ]}
      />
      <PageIntro
        title="How to reach Varanasi cricket stadium"
        lead="The stadium isn't in the part of Varanasi most visitors know. It's out at Ganjari, on the Rajatalab side, so getting there takes a bit of planning — especially on a match day when thousands of people are heading the same way."
      />
      <ul className="card grid grid-cols-2 gap-y-4 p-4 sm:grid-cols-4 sm:p-5">
        {[
          { Icon: IconPin, title: "Ganjari, near Rajatalab", sub: "Outside the old city" },
          { Icon: IconBus, title: "15–18 km from Cantt", sub: "By road" },
          { Icon: IconPlane, title: "~20–25 km from airport", sub: "By road" },
          { Icon: IconRoute, title: "Ropeway doesn't go here", sub: "Cantt–Godowlia only" },
        ].map(({ Icon, title, sub }) => (
          <li key={title} className="flex items-start gap-3 sm:border-r sm:border-border sm:pr-3 sm:last:border-0">
            <span className="icon-tile h-10 w-10 shrink-0">
              <Icon className="h-5 w-5" />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold">{title}</span>
              <span className="mt-0.5 block text-xs text-muted">{sub}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-10">
        <MatchDayPlanner origins={origins} siteUrl={SITE.url} />
      </div>

      <section className="mt-14">
        <SectionHeading>Route by route</SectionHeading>
        <div className="grid gap-3">
          {routes.map((r, i) => (
            <article key={r.id} className="card grid gap-3 p-5 md:grid-cols-[14rem_1fr] md:gap-6">
              <h3 className="text-[1.15rem]">From {r.name}</h3>
              <div>
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.98rem]">
                  <dt className="text-muted">Distance</dt>
                  <dd>
                    {r.roadKm ? `${r.roadKm} km by road` : `~${Math.round(origins[i].roadKm)} km (estimate)`}
                  </dd>
                  <dt className="text-muted">Time</dt>
                  <dd>
                    {r.normalMinutes
                      ? `${r.normalMinutes[0]}–${r.normalMinutes[1]} min on a normal day`
                      : "We haven't timed this one yet"}
                  </dd>
                  {r.fare && (
                    <>
                      <dt className="text-muted">Fare</dt>
                      <dd>{r.fare}</dd>
                    </>
                  )}
                  <dt className="text-muted">Best way</dt>
                  <dd>{r.bestOption}</dd>
                </dl>
                <ol className="mt-3 list-decimal space-y-1 pl-5">
                  {r.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                {r.tip && <p className="mt-3 rounded-xl bg-brand-tint px-4 py-3">Local tip: {r.tip}</p>}
                <p className="mt-3 text-sm text-muted">
                  {r.lastChecked ? `Last checked ${formatDate(r.lastChecked)}` : "Not yet checked in person"}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <SectionHeading>On match day</SectionHeading>
        <ul className="max-w-[68ch] list-disc space-y-2 pl-5">
          <li>Leave earlier than your maps app says. The last few kilometres near Rajatalab will be the slowest.</li>
          <li>Book or agree your ride back before the match. Finding a cab right after a big game is hard.</li>
          <li>Carry water, a charged phone and some cash. UPI networks can get patchy in a crowd of thousands.</li>
          <li>Check the stadium&apos;s official list of what you can and can&apos;t carry in, once it&apos;s published.</li>
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="faq">
        <SectionHeading id="faq">Questions about getting there</SectionHeading>
        <FaqList faqs={faqs} checked={getStadium().lastChecked} />
      </section>

      <div className="mt-8">
        <ShareWhatsApp text="How to get to the new Varanasi cricket stadium at Ganjari:" />
      </div>

      <div className="mt-14">
        <AlertCta from="how-to-reach" />
      </div>
    </Container>
  );
}
