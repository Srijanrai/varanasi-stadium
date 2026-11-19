import { getFaqs, getMatches, getStadium } from "@/lib/data/content";
import { pageMeta } from "@/lib/seo/meta";
import { sportsEventJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/format";
import { JsonLd } from "@/components/JsonLd";
import { AlertCta } from "@/components/AlertCta";
import { Breadcrumbs, Container, FaqList, PageIntro, SectionHeading } from "@/components/ui";

export const metadata = pageMeta({
  title: "Varanasi Cricket Stadium match schedule – announced fixtures",
  description:
    "Varanasi cricket stadium match schedule: officially announced fixtures only, when the first match is, and how to tell a real schedule from a rumour.",
  path: "/stadium/matches/",
  hindiPath: "/hi/stadium/matches/",
});

export default function MatchesPage() {
  const matches = getMatches();
  const upcoming = matches.filter((m) => m.status === "announced");
  const past = matches.filter((m) => m.status === "completed");
  // Questions that stop being true the day a fixture is announced live in matches-none.en.json.
  const faqs = [...(upcoming.length ? [] : getFaqs("matches-none.en")), ...getFaqs("matches.en")];

  return (
    <Container>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Stadium", path: "/stadium/" },
          { name: "Matches", path: "/stadium/matches/" },
        ]}
      />
      <PageIntro
        title="Varanasi cricket stadium match schedule"
        lead="We only list a match here once BCCI or UPCA has officially announced it. News reports and rumours stay off this page."
      />

      {upcoming.length === 0 ? (
        <div className="bg-soft p-6">
          <p className="font-bold text-[1.75rem]">No match announced yet</p>
          <p className="mt-2 max-w-[60ch] text-muted">
            News reports mention a possible Ranji Trophy game and WPL 2027 matches, but neither has been officially
            confirmed for this ground. We&apos;ll add it here the day one is.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border border-y border-border">
          {upcoming.map((m) => (
            <li key={m.id} className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]">
              <p className="font-bold text-[1.75rem]">{m.date ? formatDate(m.date) : "Date TBC"}</p>
              <div>
                <h2 className="text-[1.55rem]">{m.title}</h2>
                <p className="text-muted">{m.competition}</p>
                <a href={m.officialSourceUrl} target="_blank" rel="noopener nofollow" className="text-sm underline">
                  Official announcement
                </a>
              </div>
              <JsonLd data={sportsEventJsonLd(m)} />
            </li>
          ))}
        </ul>
      )}

      {past.length > 0 && (
        <section className="mt-12">
          <h2 className="text-[1.75rem]">Played here</h2>
          <ul className="mt-4 space-y-2">
            {past.map((m) => (
              <li key={m.id}>
                {m.date && formatDate(m.date)} — {m.title}
              </li>
            ))}
          </ul>
        </section>
      )}

      {faqs.length > 0 && (
        <section className="mt-12" aria-labelledby="faq">
          <SectionHeading id="faq">Match schedule questions</SectionHeading>
          <FaqList faqs={faqs} checked={getStadium().lastChecked} />
        </section>
      )}

      <div className="mt-14">
        <AlertCta from="matches" />
      </div>
    </Container>
  );
}
