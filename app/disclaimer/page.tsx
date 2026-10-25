import { pageMeta } from "@/lib/seo/meta";
import { SITE } from "@/lib/site";
import { TextPage } from "@/components/TextPage";

export const metadata = pageMeta({
  title: "Disclaimer",
  description: `${SITE.name} is an independent, unofficial guide. Read what that means.`,
  path: "/disclaimer/",
});

// [REVIEW] Have a lawyer review this page before launch.
export default function Page() {
  return (
    <TextPage title="Disclaimer" path="/disclaimer/" updated="25 Oct 2026">
      <p>
        {SITE.name} is an independent guide. We are not affiliated with, endorsed by, or connected to the Board of
        Control for Cricket in India (BCCI), the Uttar Pradesh Cricket Association (UPCA), the Indian Premier League (IPL),
        the Women&apos;s Premier League (WPL), any team, any ticketing platform, or any government body. Their names are used
        only to describe facts.
      </p>
      <p>
        <strong>We do not sell tickets.</strong> For official schedules and tickets, use only the official websites of the
        organisers.
      </p>
      <p>
        We check information carefully and show when each page was last checked, but timings, fares, prices and plans
        change. Please confirm anything important — especially temple timings and travel plans — directly before you
        rely on it. Distances are approximate.
      </p>
      <p>
        Listings are not endorsements. Links to other websites are provided for convenience; we aren&apos;t responsible for
        their content.
      </p>
    </TextPage>
  );
}
