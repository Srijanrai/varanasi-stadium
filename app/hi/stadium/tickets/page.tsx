import Link from "next/link";
import { getFaqs, getStadium } from "@/lib/data/content";
import { pageMeta } from "@/lib/seo/meta";
import { JsonLd } from "@/components/JsonLd";
import { webPageJsonLd } from "@/lib/seo/jsonld";
import { formatDate } from "@/lib/format";
import { AlertCta } from "@/components/AlertCta";
import { ShareWhatsApp } from "@/components/ShareWhatsApp";
import { Breadcrumbs, Container, FaqList, PageIntro, SectionHeading } from "@/components/ui";

export const metadata = pageMeta({
  title: "वाराणसी स्टेडियम टिकट – कब मिलेंगे, कीमत, कहाँ से ख़रीदें",
  description:
    "क्या वाराणसी (गंजारी) क्रिकेट स्टेडियम के टिकट बिक रहे हैं? टिकट की कीमत, बिक्री कब शुरू होगी, आधिकारिक विक्रेता कौन होगा, और नकली टिकट वालों से कैसे बचें।",
  path: "/hi/stadium/tickets/",
  englishPath: "/stadium/tickets/",
});

// Hindi twin of /stadium/tickets/. Ticket status comes from the same content/stadium.json.
export default function HindiTicketsPage() {
  const s = getStadium();
  const onSale = s.ticketStatus === "on-sale" && s.ticketSeller;

  return (
    <div lang="hi">
      <Container>
        <Breadcrumbs
          items={[
            { name: "होम", path: "/" },
            { name: "स्टेडियम", path: "/hi/stadium/" },
            { name: "टिकट", path: "/hi/stadium/tickets/" },
          ]}
        />
        <PageIntro title="वाराणसी स्टेडियम के टिकट — अभी क्या पता है" />

        <div role="status" className={`p-5 sm:p-6 ${onSale ? "border-4 border-ok" : "border-4 border-danger"}`}>
          <p className={`font-bold text-[clamp(2rem,7vw,2.8rem)] leading-tight ${onSale ? "text-ok" : "text-danger"}`}>
            {onSale ? `${s.ticketSeller!.name} पर बिक्री जारी` : "बिक्री शुरू नहीं"}
          </p>
          <p className="mt-2 leading-relaxed">
            {onSale
              ? "सिर्फ़ नीचे दिए आधिकारिक लिंक से ख़रीदें।"
              : "गंजारी स्टेडियम में अभी कोई मैच आधिकारिक रूप से घोषित नहीं हुआ है, इसलिए टिकट हैं ही नहीं।"}
          </p>
          {onSale && (
            <a href={s.ticketSeller!.url} target="_blank" rel="noopener nofollow" className="mt-4 btn btn-primary">
              {s.ticketSeller!.name} पर जाएँ
            </a>
          )}
          <p className="mt-3 text-sm text-muted">आख़िरी जाँच: {formatDate(s.lastChecked, "hi-IN")}</p>
        </div>

        <div className="prose-local mt-10 leading-relaxed">
          {!onSale && (
            <>
              <p>
                यह सवाल हमसे सबसे ज़्यादा पूछा जाता है, तो सीधा जवाब: अभी टिकट ख़रीदने को हैं ही नहीं। किसी के पास नहीं — न
                किसी एजेंट के पास, न किसी Instagram पेज के पास, न किसी &quot;अंदर के आदमी&quot; के पास।
              </p>
              <p>
                जब मैच का आधिकारिक ऐलान होगा, टिकट सिर्फ़ उसी प्लेटफ़ॉर्म पर बिकेंगे जो BCCI या UPCA तय करेंगे। जैसे ही ऐसा
                होगा, हम लिंक इस पेज पर सबसे ऊपर लगा देंगे।
              </p>
            </>
          )}
          <p>
            <strong>हम टिकट नहीं बेचते</strong>, और कभी नहीं बेचेंगे।
          </p>
        </div>

        {!onSale && (
          <section className="mt-12">
            <SectionHeading>वाराणसी क्रिकेट स्टेडियम टिकट की कीमत</SectionHeading>
            <div className="prose-local max-w-[68ch] leading-relaxed">
              <p>
                अभी टिकट की कोई कीमत नहीं है, क्योंकि अभी कोई मैच ही नहीं है। कीमत हर मैच के आयोजक तय करते हैं, इसलिए रणजी
                ट्रॉफी, IPL और WPL के मैच की कीमतें अलग-अलग होंगी।
              </p>
              <p>
                मैच का ऐलान होते ही हम आधिकारिक कीमतें, स्टैंड के हिसाब से, जारी होने वाले दिन ही यहाँ लिख देंगे, आधिकारिक
                लिंक के साथ। आज की तारीख़ में इस स्टेडियम के लिए बताई गई कोई भी कीमत मनगढ़ंत है।
              </p>
            </div>
          </section>
        )}

        <section className="mt-12">
          <SectionHeading>धोखे से कैसे बचें</SectionHeading>
          <ol className="max-w-[68ch] list-decimal space-y-3 pl-5 leading-relaxed">
            <li>इस स्टेडियम के &quot;जल्दी&quot; या &quot;VIP&quot; टिकट के लिए किसी को भी UPI पर पैसे न दें।</li>
            <li>सिर्फ़ आधिकारिक लिंक से ख़रीदें। पैसे देने से पहले वेबसाइट का पता अक्षर-अक्षर जाँच लें।</li>
            <li>
              अगर धोखा हो गया है, तो{" "}
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener" className="link">
                cybercrime.gov.in
              </a>{" "}
              पर शिकायत करें या 1930 पर कॉल करें।
            </li>
          </ol>
        </section>

        <section className="mt-12 max-w-3xl" aria-labelledby="faq">
          <SectionHeading id="faq">टिकट के सवाल</SectionHeading>
          <FaqList faqs={getFaqs("tickets.hi")} />
          <p className="mt-2 text-xs text-muted">जवाबों की आख़िरी जाँच: {formatDate(s.lastChecked, "hi-IN")}</p>
        </section>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <ShareWhatsApp
            text="ध्यान दें: वाराणसी स्टेडियम के टिकट अभी बिक ही नहीं रहे। जो भी अभी बेच रहा है, वह धोखा है।"
            label="दोस्तों को WhatsApp पर बताएँ"
          />
          <Link href="/stadium/tickets/" hrefLang="en" className="link text-sm">
            Read this page in English
          </Link>
        </div>

        <div className="mt-12">
          <AlertCta from="hi-tickets" lang="hi" />
        </div>
        <JsonLd data={webPageJsonLd("/hi/stadium/tickets/", s.lastChecked, "hi-IN")} />
      </Container>
    </div>
  );
}
