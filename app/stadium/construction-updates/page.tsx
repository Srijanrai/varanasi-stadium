import { getStadium } from "@/lib/data/content";
import { pageMeta } from "@/lib/seo/meta";
import { formatDate } from "@/lib/format";
import { AlertCta } from "@/components/AlertCta";
import { Breadcrumbs, Container, PageIntro, Sources } from "@/components/ui";

export const metadata = pageMeta({
  title: "Varanasi Stadium construction updates – latest progress",
  description:
    "Dated progress notes on the Varanasi (Ganjari) cricket stadium construction, with a source for every update.",
  path: "/stadium/construction-updates/",
});

export default function ConstructionUpdatesPage() {
  const s = getStadium();
  const updates = [...s.updates].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <Container>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Stadium", path: "/stadium/" },
          { name: "Construction updates", path: "/stadium/construction-updates/" },
        ]}
      />
      <PageIntro title="Construction updates" lead={s.progressNote} />

      <div className="mb-10 max-w-xl">
        <div className="flex items-baseline justify-between">
          <span className="text-muted">Reported progress</span>
          <span className="font-bold text-[1.75rem]">~{s.progressPercent}%</span>
        </div>
        <div
          className="mt-2 h-3 overflow-hidden bg-soft"
          role="progressbar"
          aria-valuenow={s.progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Reported construction progress"
        >
          <div className="h-full bg-ink" style={{ width: `${s.progressPercent}%` }} />
        </div>
      </div>

      <ol className="relative max-w-[70ch] border-l-2 border-border pl-6">
        {updates.map((u) => (
          <li key={u.date + u.title} className="relative pb-10 last:pb-0">
            <span aria-hidden className="absolute -left-[33px] top-1.5 h-4 w-4 border-2 border-bg bg-ink" />
            <time dateTime={u.date} className="text-sm text-muted">
              {formatDate(u.date)}
            </time>
            <h2 className="mt-1 text-[1.15rem]">{u.title}</h2>
            <p className="mt-1">{u.body}</p>
            <div className="mt-2">
              <Sources sources={u.sources} />
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-14">
        <AlertCta from="construction" />
      </div>
    </Container>
  );
}
