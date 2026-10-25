import { pageMeta } from "@/lib/seo/meta";
import { SITE } from "@/lib/site";
import { TextPage } from "@/components/TextPage";

export const metadata = pageMeta({
  title: "Terms of use",
  description: `The terms for using ${SITE.name}.`,
  path: "/terms/",
});

// [REVIEW] Have a lawyer review before launch.
export default function Page() {
  return (
    <TextPage title="Terms of use" path="/terms/" updated="25 Oct 2026">
      <p>By using this website you agree to these terms.</p>
      <h2>Using our content</h2>
      <p>
        The text, photos and design on this site are ours or used with permission. You&apos;re welcome to share links. Please
        don&apos;t copy our pages or photos to other websites without asking.
      </p>
      <h2>Accuracy</h2>
      <p>
        We work hard to keep things accurate and show when each page was last checked, but we can&apos;t guarantee that
        every detail is current. See our <a href="/disclaimer/">disclaimer</a>.
      </p>
      <h2>Business listings</h2>
      <p>
        If you submit a business, you confirm that you have the right to share its details and photos, and you allow us
        to publish and edit them for clarity. We may decline or remove any listing.
      </p>
      <h2>Contact</h2>
      <p>
        Questions: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
      </p>
    </TextPage>
  );
}
