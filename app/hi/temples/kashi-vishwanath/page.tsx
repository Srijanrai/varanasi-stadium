import Link from "next/link";
import { notFound } from "next/navigation";
import { getListing } from "@/lib/data/listings";
import { getFaqs } from "@/lib/data/content";
import { pageMeta } from "@/lib/seo/meta";
import { formatDate } from "@/lib/format";
import { ShareWhatsApp } from "@/components/ShareWhatsApp";
import { Breadcrumbs, Container, FaqList, PageIntro, SectionHeading, Sources } from "@/components/ui";

const EN_PATH = "/temples/kashi-vishwanath/";
const HI_PATH = "/hi/temples/kashi-vishwanath/";

export const metadata = pageMeta({
  title: "काशी विश्वनाथ मंदिर खुलने और बंद होने का समय, आरती, सुगम दर्शन",
  description:
    "काशी विश्वनाथ मंदिर कब खुलता और बंद होता है, दर्शन और आरती का समय, सुगम (VIP) दर्शन का टिकट, मोबाइल और लॉकर के नियम। मंदिर न्यास की आधिकारिक जानकारी के आधार पर।",
  path: HI_PATH,
  englishPath: EN_PATH,
});

// Hindi twin of /temples/kashi-vishwanath/. Every time and price is read from the same listing file,
// so the two languages can never disagree. Text here is our own wording; facts come from the temple trust.
export default function HindiKashiVishwanathPage() {
  const l = getListing("temple", "kashi-vishwanath");
  if (!l || l.type !== "temple") notFound();
  const checked = l.verifiedAt ? formatDate(l.verifiedAt, "hi-IN") : null;

  const rows = (slots: typeof l.openingHours) =>
    slots.map((s) => (
      <div key={s.name} className="grid gap-1 px-4 py-3 sm:grid-cols-[15rem_1fr]">
        <dt className="text-sm text-muted">{s.nameHi ?? s.name}</dt>
        <dd className="font-semibold">
          {s.time}
          {(s.noteHi ?? s.note) && <span className="block text-sm font-normal text-muted">{s.noteHi ?? s.note}</span>}
        </dd>
      </div>
    ));

  return (
    <div lang="hi">
      <Container>
        <Breadcrumbs
          items={[
            { name: "होम", path: "/" },
            { name: "काशी विश्वनाथ मंदिर", path: HI_PATH },
          ]}
        />
        <PageIntro
          title="काशी विश्वनाथ मंदिर: खुलने-बंद होने का समय और दर्शन"
          lead="बारह ज्योतिर्लिंगों में से एक, काशी का सबसे महत्वपूर्ण शिव मंदिर। यहाँ मंदिर के खुलने और बंद होने का समय, आरतियाँ, सुगम दर्शन और अंदर जाने के नियम एक जगह हैं।"
        >
          {checked && <p className="mt-3 text-sm text-ok">मंदिर न्यास की आधिकारिक जानकारी से जाँचा गया: {checked}</p>}
        </PageIntro>

        <div className="grid gap-10 lg:grid-cols-2">
          <section>
            <SectionHeading>मंदिर और दर्शन का समय</SectionHeading>
            <dl className="card divide-y divide-border">{rows(l.openingHours)}</dl>
          </section>
          <section>
            <SectionHeading>आरती का समय</SectionHeading>
            <dl className="card divide-y divide-border">{rows(l.aartiTimings)}</dl>
          </section>
        </div>
        <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-muted">
          त्योहारों, सावन और ख़ास मौक़ों पर समय बदल जाता है। ऐसे दिन जाने से पहले मंदिर न्यास की आधिकारिक वेबसाइट ज़रूर देखें।
        </p>

        <section className="mt-12">
          <SectionHeading>सुगम दर्शन (VIP दर्शन)</SectionHeading>
          <div className="prose-local max-w-[68ch] leading-relaxed">
            <p>
              आम दर्शन मुफ़्त है। जिसे लोग VIP दर्शन कहते हैं, वह आधिकारिक रूप से <strong>सुगम दर्शन</strong> है: ₹300
              प्रति व्यक्ति, जिसमें लाइन के बिना शास्त्री जी के साथ दर्शन, प्रसाद का डिब्बा और लॉकर की सुविधा मिलती है।
            </p>
            <p>
              सुगम दर्शन और आरती की बुकिंग सिर्फ़ मंदिर न्यास की आधिकारिक वेबसाइट या ऐप से करें। मंदिर के बाहर &quot;स्पेशल
              दर्शन&quot; का वादा करने वाले एजेंट आधिकारिक व्यवस्था का हिस्सा नहीं हैं।
            </p>
            {l.website && (
              <p>
                <a href={l.website} target="_blank" rel="noopener nofollow" className="link">
                  मंदिर न्यास की आधिकारिक वेबसाइट
                </a>
              </p>
            )}
          </div>
        </section>

        <section className="mt-12">
          <SectionHeading>अंदर जाने से पहले</SectionHeading>
          <ul className="max-w-[68ch] list-disc space-y-2 pl-5 leading-relaxed">
            <li>मोबाइल, कैमरा, कोई भी इलेक्ट्रॉनिक सामान, बैग और पेन तक अंदर नहीं जा सकते।</li>
            <li>मंदिर चौक, हेल्पडेस्क और YSK सेंटर पर मुफ़्त लॉकर हैं। लाइन में लगने से पहले सामान वहीं रख दें।</li>
            <li>कोई तय ड्रेस कोड नहीं है, लेकिन शालीन कपड़े पहनकर आएँ।</li>
            <li>कॉरिडोर बनने के बाद मंदिर सीधे गंगा से जुड़ गया है, इसलिए घाट की तरफ़ से गेट 1 से भी आ सकते हैं।</li>
          </ul>
        </section>

        <section className="mt-12 max-w-3xl" aria-labelledby="faq">
          <SectionHeading id="faq">लोग क्या पूछते हैं</SectionHeading>
          <FaqList faqs={getFaqs("kashi-vishwanath.hi")} />
          {checked && <p className="mt-2 text-xs text-muted">जवाबों की आख़िरी जाँच: {checked}</p>}
        </section>

        {l.sources.length > 0 && (
          <div className="mt-8">
            <Sources sources={l.sources} label="स्रोत:" />
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <ShareWhatsApp text="काशी विश्वनाथ मंदिर का समय, आरती और सुगम दर्शन की पूरी जानकारी:" label="WhatsApp पर भेजें" />
          <Link href={EN_PATH} hrefLang="en" className="link text-sm">
            Read this page in English
          </Link>
        </div>
      </Container>
    </div>
  );
}
