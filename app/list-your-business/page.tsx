import { pageMeta } from "@/lib/seo/meta";
import { SITE } from "@/lib/site";
import { TrackedLink } from "@/components/TrackedLink";
import { Breadcrumbs, Container, PageIntro, SectionHeading } from "@/components/ui";

export const metadata = pageMeta({
  title: "List your business for free",
  description:
    "Hotels, guest houses, cab operators and other Varanasi businesses can be listed for free. Reach visitors coming for the stadium and Kashi.",
  path: "/list-your-business/",
});

export default function Page() {
  return (
    <Container>
      <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "List your business", path: "/list-your-business/" }]} />
      <PageIntro
        title="Get your business in front of match-day visitors"
        lead="When the stadium opens, thousands of people will be looking for somewhere to stay, eat and get around. Listing is free."
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <SectionHeading>How it works</SectionHeading>
          <ol className="list-decimal space-y-3 pl-5">
            <li>Fill in a short form with your details and a few photos you own.</li>
            <li>We call you to confirm, and visit if we can.</li>
            <li>We write your page and send you the link before it goes live.</li>
            <li>Visitors call or WhatsApp you directly. We don&apos;t take a booking fee.</li>
          </ol>
          <TrackedLink
            href={SITE.forms.listBusiness}
            target="_blank"
            rel="noopener"
            event="list_business_click"
            className="mt-6 btn btn-primary"
          >
            Fill in the form
          </TrackedLink>
        </section>
        <section className="bg-soft p-6">
          <SectionHeading>Who can be listed</SectionHeading>
          <ul className="list-disc space-y-2 pl-5">
            <li>Hotels, guest houses, homestays and dharamshalas</li>
            <li>Cab and auto operators</li>
          </ul>
          <p className="mt-4 text-muted">
            We don&apos;t list ticket sellers or agents offering &quot;special darshan&quot;. By submitting, you confirm you have
            the right to share the details and photos.
          </p>
        </section>
      </div>
    </Container>
  );
}
