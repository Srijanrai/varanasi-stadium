import Link from "next/link";
import { getFaqs, getRoutes, getStadium } from "@/lib/data/content";
import { LANDMARKS, roadKmEstimate } from "@/lib/geo";
import { pageMeta } from "@/lib/seo/meta";
import { JsonLd } from "@/components/JsonLd";
import { webPageJsonLd } from "@/lib/seo/jsonld";
import { SITE } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { MatchDayPlanner, type PlannerOrigin } from "@/components/MatchDayPlanner";
import { AlertCta } from "@/components/AlertCta";
import { ShareWhatsApp } from "@/components/ShareWhatsApp";
import { Breadcrumbs, Container, FaqList, PageIntro, SectionHeading } from "@/components/ui";
import { IconBus, IconPin, IconPlane, IconRoute } from "@/components/icons";

export const metadata = pageMeta({
  title: "गंजारी स्टेडियम कैसे पहुँचें – कैंट, घाट और एयरपोर्ट से रास्ते और दूरी",
  description:
    "वाराणसी क्रिकेट स्टेडियम (गंजारी) तक कैंट स्टेशन, घाटों, अस्सी, BHU और एयरपोर्ट से रास्ते, दूरी, मैच वाले दिन कब निकलें, और लोकल टिप्स।",
  path: "/hi/stadium/how-to-reach/",
  englishPath: "/stadium/how-to-reach/",
});

// Hindi twin of /stadium/how-to-reach/. Routes come from the same content/routes.json (Hindi fields: nameHi, bestOptionHi, stepsHi).
export default function HindiHowToReachPage() {
  const routes = getRoutes();
  const faqs = getFaqs("how-to-reach.hi");
  const origins: PlannerOrigin[] = routes.map((r) => ({
    id: r.id,
    name: r.nameHi ?? r.name,
    roadKm: r.roadKm ?? roadKmEstimate(r.geo, LANDMARKS.stadium.geo),
    measured: r.roadKm !== null,
    normalMinutes: r.normalMinutes,
    bestOption: r.bestOptionHi ?? r.bestOption,
    steps: r.stepsHi ?? r.steps,
  }));
  const cantt = origins.find((o) => o.id === "cantt");
  const anyTimed = origins.some((o) => o.normalMinutes);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Varanasi International Cricket Stadium, Ganjari, Rajatalab, Varanasi")}`;

  return (
    <div lang="hi">
      <Container>
        <Breadcrumbs
          items={[
            { name: "होम", path: "/" },
            { name: "स्टेडियम", path: "/hi/stadium/" },
            { name: "कैसे पहुँचें", path: "/hi/stadium/how-to-reach/" },
          ]}
        />
        <PageIntro
          title="वाराणसी क्रिकेट स्टेडियम (गंजारी) कैसे पहुँचें"
          lead="स्टेडियम गंजारी में है — राजातालाब के पास, वाराणसी के प्रयागराज वाली तरफ़, कैंट स्टेशन से सड़क के रास्ते लगभग 15–18 किमी। यह शहर के उस हिस्से से बाहर है जिसे ज़्यादातर लोग जानते हैं, इसलिए पहले से योजना बनाइए — ख़ासकर मैच वाले दिन, जब हज़ारों लोग एक ही रास्ते पर होंगे।"
        />
        <ul className="card grid grid-cols-2 gap-y-4 p-4 sm:grid-cols-4 sm:p-5">
          {[
            { Icon: IconPin, title: "गंजारी, राजातालाब के पास", sub: "पुराने शहर से बाहर" },
            { Icon: IconBus, title: "कैंट से 15–18 किमी", sub: "सड़क से" },
            { Icon: IconPlane, title: "एयरपोर्ट से ~20–25 किमी", sub: "सड़क से" },
            { Icon: IconRoute, title: "रोपवे यहाँ नहीं आता", sub: "सिर्फ़ कैंट–गोदौलिया" },
          ].map(({ Icon, title, sub }) => (
            <li key={title} className="flex items-start gap-3 sm:border-r sm:border-border sm:pr-3 sm:last:border-0">
              <span className="icon-tile h-10 w-10 shrink-0">
                <Icon className="h-5 w-5" />
              </span>
              <span className="leading-tight">
                <span className="block text-sm font-semibold">{title}</span>
                <span className="mt-0.5 block text-xs text-muted">{sub}</span>
              </span>
            </li>
          ))}
        </ul>

        <section className="mt-12" aria-labelledby="location">
          <SectionHeading id="location">गंजारी स्टेडियम कहाँ है? लोकेशन और मैप</SectionHeading>
          <div className="prose-local max-w-[68ch] leading-relaxed">
            <p>
              वाराणसी अंतरराष्ट्रीय क्रिकेट स्टेडियम गंजारी में है — राजातालाब के पास हाईवे के किनारे का एक गाँव, वाराणसी के
              प्रयागराज वाली तरफ़। यह पुराने शहर से बाहर है: वाराणसी जंक्शन (कैंट) से स्टेडियम सड़क के रास्ते लगभग{" "}
              {cantt ? Math.round(cantt.roadKm) : 16} किमी है,{" "}
              {cantt?.normalMinutes
                ? `आम दिन ${cantt.normalMinutes[0]}–${cantt.normalMinutes[1]} मिनट`
                : "हमारे अनुमान से आम दिन 40–60 मिनट"}
              । राजातालाब के पास हाईवे से फ़्लडलाइट के टावर दिख जाते हैं।
            </p>
            <p>
              <a href={mapsUrl} target="_blank" rel="noopener" className="link">
                Google Maps में स्टेडियम की लोकेशन खोलें
              </a>
            </p>
          </div>
          <table className="mt-5 w-full text-[0.95rem]">
            <caption className="sr-only">आम शुरुआती जगहों से स्टेडियम की दूरी</caption>
            <thead>
              <tr className="text-left text-sm text-muted">
                <th scope="col" className="py-2 pr-4 font-medium">कहाँ से</th>
                <th scope="col" className="py-2 pr-4 font-medium">सड़क से दूरी</th>
                {anyTimed && <th scope="col" className="py-2 font-medium">आम दिन</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border border-y border-border">
              {origins.map((o) => (
                <tr key={o.id}>
                  <th scope="row" className="py-2.5 pr-4 text-left font-semibold">{o.name}</th>
                  <td className="py-2.5 pr-4">{o.measured ? `${o.roadKm} किमी` : `~${Math.round(o.roadKm)} किमी (अनुमान)`}</td>
                  {anyTimed && <td className="py-2.5">{o.normalMinutes ? `${o.normalMinutes[0]}–${o.normalMinutes[1]} मिनट` : "अभी नापा नहीं"}</td>}
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-sm text-muted">
            अनुमान सीधी दूरी में सड़क के लिए 15% जोड़कर निकाले गए हैं। हर रास्ता ख़ुद चलकर देखने के बाद हम इन्हें नापे हुए
            आँकड़ों से बदल देंगे।
          </p>
        </section>

        <div className="mt-10">
          <MatchDayPlanner origins={origins} siteUrl={SITE.url} lang="hi" sharePath="/hi/stadium/how-to-reach/" />
        </div>

        <section className="mt-14">
          <SectionHeading>रास्ता-दर-रास्ता</SectionHeading>
          <div className="grid gap-3">
            {routes.map((r, i) => (
              <article key={r.id} className="card grid gap-3 p-5 md:grid-cols-[14rem_1fr] md:gap-6">
                <h3 className="text-[1.15rem]">{r.nameHi ?? r.name} से</h3>
                <div>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.98rem]">
                    <dt className="text-muted">दूरी</dt>
                    <dd>{r.roadKm ? `सड़क से ${r.roadKm} किमी` : `~${Math.round(origins[i].roadKm)} किमी (अनुमान)`}</dd>
                    <dt className="text-muted">समय</dt>
                    <dd>{r.normalMinutes ? `आम दिन ${r.normalMinutes[0]}–${r.normalMinutes[1]} मिनट` : "यह रास्ता अभी नापा नहीं है"}</dd>
                    {r.fare && (
                      <>
                        <dt className="text-muted">किराया</dt>
                        <dd>{r.fare}</dd>
                      </>
                    )}
                    <dt className="text-muted">सबसे अच्छा तरीका</dt>
                    <dd>{r.bestOptionHi ?? r.bestOption}</dd>
                  </dl>
                  <ol className="mt-3 list-decimal space-y-1 pl-5 leading-relaxed">
                    {(r.stepsHi ?? r.steps).map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ol>
                  {(r.tipHi ?? r.tip) && <p className="mt-3 rounded-xl bg-brand-tint px-4 py-3">लोकल टिप: {r.tipHi ?? r.tip}</p>}
                  <p className="mt-3 text-sm text-muted">
                    {r.lastChecked ? `आख़िरी जाँच ${formatDate(r.lastChecked, "hi-IN")}` : "अभी ख़ुद जाकर नहीं जाँचा"}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <SectionHeading>मैच वाले दिन</SectionHeading>
          <ul className="max-w-[68ch] list-disc space-y-2 pl-5 leading-relaxed">
            <li>मैप ऐप जितना समय बताए, उससे पहले निकलें। राजातालाब के पास के आख़िरी कुछ किलोमीटर सबसे धीमे होंगे।</li>
            <li>वापसी की सवारी मैच से पहले ही बुक या तय कर लें। बड़े मैच के तुरंत बाद टैक्सी मिलना मुश्किल होता है।</li>
            <li>पानी, चार्ज किया हुआ फ़ोन और थोड़ा कैश साथ रखें। हज़ारों की भीड़ में UPI नेटवर्क अटक सकता है।</li>
            <li>स्टेडियम की आधिकारिक सूची जारी होने पर देख लें कि अंदर क्या ले जा सकते हैं और क्या नहीं।</li>
          </ul>
        </section>

        <section className="mt-14 max-w-3xl" aria-labelledby="faq">
          <SectionHeading id="faq">पहुँचने से जुड़े सवाल</SectionHeading>
          <FaqList faqs={faqs} />
          <p className="mt-2 text-xs text-muted">जवाबों की आख़िरी जाँच: {formatDate(getStadium().lastChecked, "hi-IN")}</p>
        </section>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ShareWhatsApp text="गंजारी के नए वाराणसी क्रिकेट स्टेडियम तक कैसे पहुँचें:" label="WhatsApp पर भेजें" />
          <Link href="/stadium/how-to-reach/" hrefLang="en" className="link text-sm">
            Read this page in English
          </Link>
        </div>

        <div className="mt-14">
          <AlertCta from="hi-how-to-reach" lang="hi" />
        </div>
        <JsonLd data={webPageJsonLd("/hi/stadium/how-to-reach/", getStadium().lastChecked, "hi-IN")} />
      </Container>
    </div>
  );
}
