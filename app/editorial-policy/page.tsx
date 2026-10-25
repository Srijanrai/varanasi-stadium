import { pageMeta } from "@/lib/seo/meta";
import { SITE } from "@/lib/site";
import { TextPage } from "@/components/TextPage";

export const metadata = pageMeta({
  title: "How we check listings",
  description: "How we verify every place, timing and route on this site, and how often we re-check.",
  path: "/editorial-policy/",
});

export default function Page() {
  return (
    <TextPage
      title="How we check listings"
      path="/editorial-policy/"
      lead="Every place on this site is checked by a person, and every page tells you when."
    >
      <h2>Before a listing goes live</h2>
      <ul>
        <li>We confirm the address and phone number by calling or visiting.</li>
        <li>We write the description ourselves, from what we saw or were told — never copied from another site.</li>
        <li>Photos are our own, or sent by the owner with permission, and credited.</li>
        <li>Timings and fares are marked with the date we checked them.</li>
      </ul>
      <h2>Keeping it current</h2>
      <p>
        We re-check every listing at least every 90 days, and sooner around festivals and match days. Each page shows
        &quot;Checked&quot; with a date and how we checked it.
      </p>
      <h2>News and match information</h2>
      <p>
        A match appears on our matches page only after an official announcement. We link to the source for facts like
        capacity, cost and timelines.
      </p>
      <h2>Paid listings</h2>
      <p>
        In future, businesses may pay to be featured. Featured places will always be labelled, and paying never changes
        what we write.
      </p>
      <h2>Corrections</h2>
      <p>
        Spotted a mistake? <a href={SITE.forms.reportWrongInfo}>Tell us</a> and we&apos;ll fix it, usually within two days.
      </p>
    </TextPage>
  );
}
