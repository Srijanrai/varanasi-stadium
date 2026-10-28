import { pageMeta } from "@/lib/seo/meta";
import { SITE, formOrEmail } from "@/lib/site";
import { TextPage } from "@/components/TextPage";

export const metadata = pageMeta({
  title: "Contact",
  description: "Get in touch to report wrong information, suggest a place, or ask about listing your business.",
  path: "/contact/",
});

export default function Page() {
  return (
    <TextPage title="Contact us" path="/contact/">
      <p>
        Email us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We usually reply within two working days.
      </p>
      <ul>
        <li>
          Found something wrong? <a href={formOrEmail(SITE.forms.reportWrongInfo, "Correction")}>Report it here</a> — it&apos;s the fastest way to get it
          fixed.
        </li>
        <li>
          Want your business listed? <a href={formOrEmail(SITE.forms.listBusiness, "List my business")}>
            {SITE.forms.listBusiness ? "Fill in this short form" : "Email us your details"}
          </a>.
        </li>
        {SITE.whatsappChannelUrl && (
          <li>
            For match announcements, <a href={SITE.whatsappChannelUrl}>follow our WhatsApp channel</a>.
          </li>
        )}
      </ul>
      <p>We can&apos;t help with ticket bookings — we don&apos;t sell tickets.</p>
    </TextPage>
  );
}
