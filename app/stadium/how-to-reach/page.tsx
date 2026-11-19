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
  hindiPath: "/hi/stadium/how-to-reach/",
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
  const cantt = origins.find((o) => o.id === "cantt");
  // The timing column only appears once at least one route has been driven and timed.
  const anyTimed = origins.some((o) => o.normalMinutes);
  // Search by name rather than our stored pin: the pin comes from Wikipedia and hasn't been checked on the ground (see lib/geo.ts).
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Varanasi International Cricket Stadium, Ganjari, Rajatalab, Varanasi")}`;

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

      <section className="mt-12" aria-labelledby="location">
        <SectionHeading id="location">Where is Ganjari stadium? Location and map</SectionHeading>
        <div className="prose-local max-w-[68ch]">
          <p>
            The Varanasi International Cricket Stadium is at Ganjari, a village beside the highway at Rajatalab on the
            Prayagraj side of Varanasi. It&apos;s outside the old city: Varanasi Junction (Cantt) to the stadium is about{" "}
            {cantt ? Math.round(cantt.roadKm) : 16} km by road,{" "}
            {cantt?.normalMinutes
              ? `${cantt.normalMinutes[0]}–${cantt.normalMinutes[1]} minutes on a normal day`
              : "which we estimate at 40–60 minutes on a normal day"}
            . You can see the floodlight towers from the highway near Rajatalab.
          </p>
          <p>
            <a href={mapsUrl} target="_blank" rel="noopener" className="link">
              Open the stadium location in Google Maps
            </a>
          </p>
        </div>
        <table className="mt-5 w-full text-[0.95rem]">
          <caption className="sr-only">Distance to the stadium from common starting points</caption>
          <thead>
            <tr className="text-left text-sm text-muted">
              <th scope="col" className="py-2 pr-4 font-medium">From</th>
              <th scope="col" className="py-2 pr-4 font-medium">Distance by road</th>
              {anyTimed && <th scope="col" className="py-2 font-medium">Normal day</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border border-y border-border">
            {origins.map((o) => (
              <tr key={o.id}>
                <th scope="row" className="py-2.5 pr-4 text-left font-semibold">{o.name}</th>
                <td className="py-2.5 pr-4">{o.measured ? `${o.roadKm} km` : `~${Math.round(o.roadKm)} km (estimate)`}</td>
                {anyTimed && <td className="py-2.5">{o.normalMinutes ? `${o.normalMinutes[0]}–${o.normalMinutes[1]} min` : "Not timed yet"}</td>}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-sm text-muted">
          Estimates are straight-line distance plus 15% for the road. We&apos;ll replace them with measured figures as we
          drive each route.
        </p>
      </section>

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
