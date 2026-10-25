import Link from "next/link";
import { pageMeta } from "@/lib/seo/meta";
import { SITE } from "@/lib/site";
import { TextPage } from "@/components/TextPage";

export const metadata = pageMeta({
  title: "About us",
  description: `Who runs ${SITE.name}, why we started it, and how we keep it accurate.`,
  path: "/about/",
});

export default function Page() {
  return (
    <TextPage title="About us" path="/about/">
      {/* [ADD FIRST-HAND] Replace with your own story: who you are, your connection to Banaras, why you started this. */}
      <p>
        We live in Banaras. When work started on the cricket stadium at Ganjari, we kept getting the same questions from
        friends and family outside the city: when&apos;s the first match, how do you even get there, where should we stay?
        The answers were scattered across news reports, rumours and WhatsApp forwards.
      </p>
      <p>
        So we started putting what we know in one place — checked, dated, and honest about what isn&apos;t confirmed yet.
      </p>
      <h2>What we promise</h2>
      <ul>
        <li>We say when something is a rumour, and we never present it as fact.</li>
        <li>Every listing shows when we last checked it.</li>
        <li>We never sell tickets.</li>
        <li>
          If a business pays to be featured, we&apos;ll label it clearly. Paying never changes what we write about a place.
        </li>
      </ul>
      <p>
        We&apos;re independent and not connected to BCCI, UPCA, IPL, WPL or any government body. Read{" "}
        <Link href="/editorial-policy/">how we check listings</Link>, or <Link href="/contact/">get in touch</Link>.
      </p>
    </TextPage>
  );
}
