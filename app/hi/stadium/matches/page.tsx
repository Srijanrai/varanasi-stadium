import Link from "next/link";
import { getFaqs, getMatches, getStadium } from "@/lib/data/content";
import { pageMeta } from "@/lib/seo/meta";
import { sportsEventJsonLd , webPageJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/format";
import { JsonLd } from "@/components/JsonLd";
import { AlertCta } from "@/components/AlertCta";
import { ShareWhatsApp } from "@/components/ShareWhatsApp";
import { Breadcrumbs, Container, FaqList, PageIntro, SectionHeading } from "@/components/ui";

export const metadata = pageMeta({
  title: "वाराणसी स्टेडियम में मैच कब है? – घोषित मैच और शेड्यूल",
  description:
    "वाराणसी (गंजारी) क्रिकेट स्टेडियम का मैच शेड्यूल: सिर्फ़ BCCI या UPCA द्वारा घोषित मैच, पहला मैच कब होगा, और असली शेड्यूल को अफ़वाह से कैसे अलग करें।",
  path: "/hi/stadium/matches/",
  englishPath: "/stadium/matches/",
});

// Hindi twin of /stadium/matches/. Fixtures come from the same content/matches files, so there is one place to update.
export default function HindiMatchesPage() {
  const matches = getMatches();
  const upcoming = matches.filter((m) => m.status === "announced");
  const past = matches.filter((m) => m.status === "completed");
  const faqs = [...(upcoming.length ? [] : getFaqs("matches-none.hi")), ...getFaqs("matches.hi")];

  return (
    <div lang="hi">
      <Container>
        <Breadcrumbs
          items={[
            { name: "होम", path: "/" },
            { name: "स्टेडियम", path: "/hi/stadium/" },
            { name: "मैच", path: "/hi/stadium/matches/" },
          ]}
        />
        <PageIntro
          title="वाराणसी स्टेडियम में मैच कब है?"
          lead={
            upcoming.length
              ? "ये वे मैच हैं जिनका ऐलान BCCI या UPCA ने वाराणसी स्टेडियम के लिए आधिकारिक रूप से किया है। ख़बरों की अटकलें और अफ़वाहें इस पेज पर नहीं आतीं।"
              : "वाराणसी स्टेडियम में अभी कोई मैच आधिकारिक रूप से घोषित नहीं हुआ है। हम कोई मैच तभी जोड़ते हैं जब BCCI या UPCA उसकी पुष्टि करें; ख़बरों की अटकलें और अफ़वाहें यहाँ नहीं आतीं।"
          }
        />

        {upcoming.length === 0 ? (
          <div className="bg-soft p-6">
            <p className="font-bold text-[1.75rem]">अभी कोई मैच घोषित नहीं</p>
            <p className="mt-2 max-w-[60ch] leading-relaxed text-muted">
              ख़बरों में रणजी ट्रॉफी के एक मैच और WPL 2027 के मैचों की चर्चा है, लेकिन इस मैदान के लिए कोई भी आधिकारिक रूप से तय
              नहीं हुआ है। जिस दिन होगा, उसी दिन यहाँ जोड़ देंगे।
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {upcoming.map((m) => (
              <li key={m.id} className="grid gap-2 py-5 sm:grid-cols-[10rem_1fr]">
                <p className="font-bold text-[1.75rem]">{m.date ? formatDate(m.date, "hi-IN") : "तारीख़ तय नहीं"}</p>
                <div>
                  <h2 className="text-[1.55rem]">{m.title}</h2>
                  <p className="text-muted">{m.competition}</p>
                  <a href={m.officialSourceUrl} target="_blank" rel="noopener nofollow" className="text-sm underline">
                    आधिकारिक घोषणा
                  </a>
                </div>
                <JsonLd data={sportsEventJsonLd(m)} />
              </li>
            ))}
          </ul>
        )}

        {past.length > 0 && (
          <section className="mt-12">
            <h2 className="text-[1.75rem]">यहाँ खेले गए मैच</h2>
            <ul className="mt-4 space-y-2">
              {past.map((m) => (
                <li key={m.id}>
                  {m.date && formatDate(m.date, "hi-IN")} — {m.title}
                </li>
              ))}
            </ul>
          </section>
        )}

        {faqs.length > 0 && (
          <section className="mt-12 max-w-3xl" aria-labelledby="faq">
            <SectionHeading id="faq">मैच शेड्यूल के सवाल</SectionHeading>
            <FaqList faqs={faqs} />
            <p className="mt-2 text-xs text-muted">जवाबों की आख़िरी जाँच: {formatDate(getStadium().lastChecked, "hi-IN")}</p>
          </section>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <ShareWhatsApp text="वाराणसी स्टेडियम में मैच कब है? आधिकारिक रूप से घोषित मैच यहाँ देखें:" label="WhatsApp पर भेजें" />
          <Link href="/stadium/matches/" hrefLang="en" className="link text-sm">
            Read this page in English
          </Link>
        </div>

        <div className="mt-12">
          <AlertCta from="hi-matches" lang="hi" />
        </div>
        <JsonLd data={webPageJsonLd("/hi/stadium/matches/", getStadium().lastChecked, "hi-IN")} />
      </Container>
    </div>
  );
}
