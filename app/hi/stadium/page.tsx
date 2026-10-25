import Link from "next/link";
import { getFaqs, getNextMatch, getSiteImages, getStadium } from "@/lib/data/content";
import { pageMeta } from "@/lib/seo/meta";
import { stadiumJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/format";
import { JsonLd } from "@/components/JsonLd";
import { StatusBoard } from "@/components/StatusBoard";
import { AlertCta } from "@/components/AlertCta";
import { ShareWhatsApp } from "@/components/ShareWhatsApp";
import { StadiumImage } from "@/components/StadiumImage";
import { IconCalendar, IconCrane, IconRoute, IconTicket } from "@/components/icons";
import { Breadcrumbs, Container, FaqList, SectionHeading } from "@/components/ui";

export const metadata = pageMeta({
  title: "वाराणसी क्रिकेट स्टेडियम (गंजारी) – कब खुलेगा, मैच, टिकट, कैसे पहुँचें",
  description:
    "गंजारी में बन रहे वाराणसी अंतरराष्ट्रीय क्रिकेट स्टेडियम की पूरी जानकारी: निर्माण की स्थिति, पहला मैच, टिकट और वहाँ तक कैसे पहुँचें।",
  path: "/hi/stadium/",
  englishPath: "/stadium/",
});

// Mirrors the English /stadium/ page; the linked sub-pages are English-only for now.
const PLAN = [
  { href: "/stadium/how-to-reach/", title: "कैसे पहुँचें", body: "रास्ते, समय और निकलने का प्लानर", Icon: IconRoute },
  { href: "/stadium/tickets/", title: "टिकट", body: "क्या पता है, और धोखे से कैसे बचें", Icon: IconTicket },
  { href: "/stadium/matches/", title: "मैच", body: "सिर्फ़ आधिकारिक रूप से घोषित मैच", Icon: IconCalendar },
  { href: "/stadium/construction-updates/", title: "निर्माण", body: "तारीख़ के साथ प्रगति और स्रोत", Icon: IconCrane },
];

const FACTS = [
  ["जगह", "गंजारी, राजातालाब के पास, वाराणसी"],
  ["सीटें", "लगभग 30,000"],
  ["बताया गया ख़र्च", "₹330–450 करोड़ (ख़बरों में अलग-अलग)"],
  ["कब तैयार होगा", "IPL 2027 से पहले (पक्का नहीं)"],
  ["कैंट से दूरी", "सड़क से लगभग 15–18 किमी"],
];

export default function HindiStadiumPage() {
  const s = getStadium();
  const images = getSiteImages();
  const faqs = getFaqs("stadium.hi");

  return (
    <div lang="hi">
      <Container>
        <Breadcrumbs items={[{ name: "होम", path: "/" }, { name: "स्टेडियम", path: "/hi/stadium/" }]} />

        <div className="mt-4">
          <StadiumImage desktop={images.stadium ?? images.hero} mobile={images.stadiumMobile} label="प्रस्तावित डिज़ाइन" priority className="rounded-[20px]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#021e3a]/90 via-[#021e3a]/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-8">
              <span className="text-xs font-semibold text-gold">गंजारी, राजातालाब · लगभग 30,000 सीटें</span>
              <h1 className="mt-2 text-[clamp(1.7rem,6vw,2.9rem)] leading-[1.25]">वाराणसी अंतरराष्ट्रीय क्रिकेट स्टेडियम</h1>
            </div>
          </StadiumImage>
        </div>

        <p className="mt-6 max-w-[62ch] text-[1.05rem] leading-relaxed text-muted">
          गंजारी का नया स्टेडियम लगभग बन चुका है, लेकिन अभी खुला नहीं है और कोई मैच आधिकारिक रूप से तय नहीं हुआ है। यहाँ जानिए
          क्या पक्का है, क्या सिर्फ़ चर्चा है, और पहले मैच की तैयारी कैसे करें।
        </p>

        <div className="mt-6">
          <StatusBoard stadium={s} nextMatch={getNextMatch()} lang="hi" />
        </div>

        <section className="mt-12">
          <SectionHeading sub="ये पन्ने अभी अंग्रेज़ी में हैं">मैच के दिन की तैयारी</SectionHeading>
          <ul className="grid grid-cols-4 gap-2 sm:gap-4">
            {PLAN.map(({ href, title, body, Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  hrefLang="en"
                  className="card group flex h-full flex-col items-center gap-2 p-3 text-center transition-transform hover:-translate-y-0.5 sm:p-5"
                >
                  <span className="icon-tile h-11 w-11 sm:h-14 sm:w-14">
                    <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </span>
                  <span className="text-[0.78rem] font-semibold leading-snug sm:text-base">{title}</span>
                  <span className="hidden text-xs text-muted sm:block sm:text-sm">{body}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 max-w-3xl">
          <SectionHeading>मुख्य बातें</SectionHeading>
          <dl className="card divide-y divide-border px-5">
            {FACTS.map(([k, v]) => (
              <div key={k} className="flex items-baseline justify-between gap-4 py-3.5">
                <dt className="text-sm text-muted">{k}</dt>
                <dd className="text-right font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-muted">आख़िरी जाँच: {formatDate(s.lastChecked, "hi-IN")}</p>
        </section>

        <section className="mt-12 max-w-3xl" aria-labelledby="faq">
          <SectionHeading id="faq">लोग क्या पूछते हैं</SectionHeading>
          <FaqList faqs={faqs} />
          <p className="mt-2 text-xs text-muted">जवाबों की आख़िरी जाँच: {formatDate(s.lastChecked, "hi-IN")}</p>
        </section>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <ShareWhatsApp text="वाराणसी के नए क्रिकेट स्टेडियम के बारे में अब तक की पूरी जानकारी:" label="WhatsApp पर भेजें" />
          <Link href="/stadium/" hrefLang="en" className="link text-sm">
            Read this page in English
          </Link>
        </div>

        <div className="mt-12">
          <AlertCta from="hi-stadium" lang="hi" />
        </div>
      </Container>
      <JsonLd data={stadiumJsonLd()} />
    </div>
  );
}
