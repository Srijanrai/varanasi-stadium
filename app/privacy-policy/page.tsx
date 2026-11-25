import { pageMeta } from "@/lib/seo/meta";
import { SITE } from "@/lib/site";
import { TextPage } from "@/components/TextPage";

export const metadata = pageMeta({
  title: "Privacy policy",
  description: "What information we collect, why, and how to ask us to delete it.",
  path: "/privacy-policy/",
});

// [REVIEW] Have a lawyer check this against the Digital Personal Data Protection Act, 2023 before launch.
export default function Page() {
  return (
    <TextPage title="Privacy policy" path="/privacy-policy/" updated="25 Nov 2026">
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Visiting the site:</strong> anonymous usage statistics (pages viewed, rough location by country, device
          type, and which buttons are used, such as &quot;Call&quot; or &quot;Directions&quot;) through Cloudflare Web
          Analytics and PostHog (servers in the USA). Neither uses cookies or stores anything on your device, and neither
          tracks you across other sites. We don&apos;t record your screen and don&apos;t use this to identify you.
        </li>
        <li>
          <strong>Forms:</strong> if you fill in our business listing or correction forms, we collect what you enter — such
          as your name, phone number, email and business details.
        </li>
        <li>
          <strong>WhatsApp channel:</strong> followers of a WhatsApp channel are not visible to us as phone numbers.
        </li>
      </ul>
      <h2>Why we use it</h2>
      <p>
        To publish and update listings you&apos;ve asked us to publish, to reply to you, and to understand which pages are
        useful. We don&apos;t sell your personal data.
      </p>
      <h2>How long we keep it</h2>
      <p>Form submissions are kept while your listing is active, or for up to 12 months otherwise.</p>
      <h2>Your rights</h2>
      <p>
        You can ask us to show, correct or delete the personal data we hold about you. Email{" "}
        <a href={`mailto:${SITE.email}`}>{SITE.email}</a> and we&apos;ll respond within 30 days.
      </p>
    </TextPage>
  );
}
