import { getFaqs, getStadium } from "@/lib/data/content";
import { pageMeta } from "@/lib/seo/meta";
import { formatDate } from "@/lib/format";
import { AlertCta } from "@/components/AlertCta";
import { ShareWhatsApp } from "@/components/ShareWhatsApp";
import { Breadcrumbs, Container, FaqList, PageIntro, SectionHeading } from "@/components/ui";

export const metadata = pageMeta({
  title: "Varanasi Stadium tickets – are they on sale? How to avoid scams",
  description:
    "Are tickets for the Varanasi (Ganjari) cricket stadium on sale? What we know right now, where official tickets will be sold, and how to avoid fake sellers.",
  path: "/stadium/tickets/",
});

export default function TicketsPage() {
  const s = getStadium();
  const onSale = s.ticketStatus === "on-sale" && s.ticketSeller;

  return (
    <Container>
      <Breadcrumbs
        items={[
          { name: "Home", path: "/" },
          { name: "Stadium", path: "/stadium/" },
          { name: "Tickets", path: "/stadium/tickets/" },
        ]}
      />
      <PageIntro title="Varanasi stadium tickets — what we know right now" />

      <div
        role="status"
        className={` p-5 sm:p-6 ${onSale ? "border-4 border-ok" : "border-4 border-danger"}`}
      >
        <p className={`font-bold text-[clamp(2rem,7vw,2.8rem)] ${onSale ? "text-ok" : "text-danger"}`}>
          {onSale ? `On sale at ${s.ticketSeller!.name}` : "Not on sale"}
        </p>
        <p className="mt-1">
          {onSale
            ? "Buy only from the official link below."
            : "No match at the Ganjari stadium has been officially announced, so no tickets exist yet."}
        </p>
        {onSale && (
          <a
            href={s.ticketSeller!.url}
            target="_blank"
            rel="noopener nofollow"
            className="mt-4 btn btn-primary"
          >
            Go to {s.ticketSeller!.name}
          </a>
        )}
        <p className="mt-3 text-sm text-muted">Last checked {formatDate(s.lastChecked)}</p>
      </div>

      <div className="prose-local mt-10">
        <p>
          We get this question more than any other, so here&apos;s the straight answer: there are no tickets to buy yet.
          Nobody — no agent, no Instagram page, no &quot;insider&quot; — has them.
        </p>
        <p>
          When a match is officially announced, tickets will be sold only through the platform BCCI or UPCA chooses. The
          moment that happens, we&apos;ll put the link at the top of this page and send it out on our WhatsApp channel.
        </p>
        <p>
          <strong>We never sell tickets</strong>, and we never will.
        </p>
      </div>

      <section className="mt-12">
        <SectionHeading>How not to get cheated</SectionHeading>
        <ol className="max-w-[68ch] list-decimal space-y-3 pl-5">
          <li>Never pay anyone on UPI for &quot;early&quot; or &quot;VIP&quot; tickets to this stadium.</li>
          <li>Buy only from the official link. Check the website address letter by letter before you pay.</li>
          <li>
            If you&apos;ve been cheated, report it at{" "}
            <a href="https://cybercrime.gov.in" target="_blank" rel="noopener" className="link">
              cybercrime.gov.in
            </a>{" "}
            or call 1930.
          </li>
        </ol>
      </section>

      <section className="mt-12" aria-labelledby="faq">
        <SectionHeading id="faq">Ticket questions</SectionHeading>
        <FaqList faqs={getFaqs("tickets.en")} checked={s.lastChecked} />
      </section>

      <div className="mt-8">
        <ShareWhatsApp text="Heads up: no tickets are on sale yet for the Varanasi stadium. Anyone selling them now is a scam." label="Warn your friends on WhatsApp" />
      </div>

      <div className="mt-14">
        <AlertCta from="tickets" />
      </div>
    </Container>
  );
}
