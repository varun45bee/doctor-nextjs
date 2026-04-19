"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function WhyHomeopathyPage() {
  const { t, locale } = useLanguage();

  const comparisons = [
    {
      topicEn: "Approach",
      topicHi: "दृष्टिकोण",
      topicMr: "दृष्टिकोन",
      homeopathy:
        locale === "hi"
          ? "पूरे व्यक्ति को ध्यान में रखकर उपचार"
          : locale === "mr"
          ? "संपूर्ण व्यक्तीचा विचार करून उपचार"
          : "Considers the person as a whole — physical and emotional health together",
      conventional:
        locale === "hi"
          ? "मुख्यतः लक्षणों पर ध्यान"
          : locale === "mr"
          ? "मुख्यतः लक्षणांवर लक्ष"
          : "Focuses mainly on controlling symptoms",
    },
    {
      topicEn: "Side Effects",
      topicHi: "दुष्प्रभाव",
      topicMr: "दुष्परिणाम",
      homeopathy:
        locale === "hi"
          ? "आमतौर पर नहीं होते"
          : locale === "mr"
          ? "सहसा नसतात"
          : "Generally safe when prescribed correctly",
      conventional:
        locale === "hi"
          ? "कुछ मामलों में हो सकते हैं"
          : locale === "mr"
          ? "काही प्रकरणांत असू शकतात"
          : "May occur depending on medication and duration",
    },
    {
      topicEn: "Long-term Use",
      topicHi: "दीर्घकालिक उपयोग",
      topicMr: "दीर्घकालीन वापर",
      homeopathy:
        locale === "hi"
          ? "लंबे समय तक सुरक्षित"
          : locale === "mr"
          ? "दीर्घकाळ सुरक्षित"
          : "Can be used safely over longer periods",
      conventional:
        locale === "hi"
          ? "निगरानी आवश्यक"
          : locale === "mr"
          ? "नियंत्रण आवश्यक"
          : "Often requires regular monitoring",
    },
    {
      topicEn: "Treatment Goal",
      topicHi: "उपचार का उद्देश्य",
      topicMr: "उपचाराचा उद्देश",
      homeopathy:
        locale === "hi"
          ? "समस्या की जड़ को समझना"
          : locale === "mr"
          ? "समस्येचे मूळ समजून घेणे"
          : "Aims to understand and correct the underlying imbalance",
      conventional:
        locale === "hi"
          ? "लक्षणों को नियंत्रित करना"
          : locale === "mr"
          ? "लक्षणे नियंत्रित करणे"
          : "Primarily symptom control",
    },
    {
      topicEn: "Suitable For",
      topicHi: "किनके लिए उपयुक्त",
      topicMr: "कोणासाठी योग्य",
      homeopathy:
        locale === "hi"
          ? "बच्चे, महिलाएं, बुजुर्ग"
          : locale === "mr"
          ? "मुले, महिला, वृद्ध"
          : "Children, adults, and elderly patients",
      conventional:
        locale === "hi"
          ? "कुछ समूहों में सीमाएं"
          : locale === "mr"
          ? "काही गटांसाठी मर्यादा"
          : "Certain restrictions for specific age groups",
    },
    {
      topicEn: "Cost Over Time",
      topicHi: "दीर्घकालिक लागत",
      topicMr: "दीर्घकालीन खर्च",
      homeopathy:
        locale === "hi"
          ? "अक्सर किफायती"
          : locale === "mr"
          ? "बहुतेक वेळा परवडणारा"
          : "Often cost-effective for long-term care",
      conventional:
        locale === "hi"
          ? "समय के साथ बढ़ सकता है"
          : locale === "mr"
          ? "कालांतराने वाढू शकतो"
          : "May increase with prolonged treatment",
    },
  ];

  const myths = [
    {
      myth:
        locale === "hi"
          ? "होम्योपैथी सिर्फ विश्वास पर आधारित है"
          : locale === "mr"
          ? "होमिओपॅथी फक्त विश्वासावर आहे"
          : "Homeopathy works only on belief",
      truth:
        locale === "hi"
          ? "कई मरीजों में स्पष्ट सुधार देखा गया है, खासकर एलर्जी, संक्रमण और हार्मोनल समस्याओं में।"
          : locale === "mr"
          ? "अनेक रुग्णांमध्ये, विशेषतः ऍलर्जी, संसर्ग व हार्मोनल समस्यांमध्ये सुधार दिसून येतो."
          : "Clinical experience shows consistent improvement in conditions like allergies, infections, and hormonal imbalance.",
    },
    {
      myth:
        locale === "hi"
          ? "इसका असर बहुत देर से दिखता है"
          : locale === "mr"
          ? "याचा परिणाम खूप उशिरा दिसतो"
          : "It always works very slowly",
      truth:
        locale === "hi"
          ? "तीव्र स्थितियों में सुधार जल्दी हो सकता है, जबकि पुराने रोगों में समय लगता है।"
          : locale === "mr"
          ? "तीव्र स्थितीत सुधार लवकर होऊ शकतो, तर जुनाट आजारांना वेळ लागतो."
          : "Acute conditions often respond quickly. Chronic conditions improve gradually and steadily.",
    },
    {
      myth:
        locale === "hi"
          ? "यह गंभीर समस्याओं में उपयोगी नहीं"
          : locale === "mr"
          ? "हे गंभीर आजारांसाठी उपयोगी नाही"
          : "It is not useful for chronic problems",
      truth:
        locale === "hi"
          ? "कई पुराने रोगों में होम्योपैथी सहायक उपचार के रूप में उपयोगी होती है।"
          : locale === "mr"
          ? "अनेक जुनाट आजारांमध्ये होमिओपॅथी उपयुक्त ठरते."
          : "Homeopathy is commonly used to manage long-standing conditions alongside careful medical supervision.",
    },
    {
      myth:
        locale === "hi"
          ? "होम्योपैथी सभी के लिए समान होती है"
          : locale === "mr"
          ? "होमिओपॅथी सर्वांसाठी सारखीच असते"
          : "The same medicine works for everyone",
      truth:
        locale === "hi"
          ? "इलाज व्यक्ति, लक्षण और जीवनशैली के अनुसार चुना जाता है।"
          : locale === "mr"
          ? "उपचार व्यक्ती, लक्षणे आणि जीवनशैलीनुसार ठरतो."
          : "Medicines are selected individually, based on the person’s overall health picture.",
    },
  ];

  const treats = [
    "PCOD / PCOS",
    "Thyroid Disorders",
    locale === "hi" ? "हार्मोनल असंतुलन" : locale === "mr" ? "हार्मोनल असंतुलन" : "Hormonal Imbalance",
    locale === "hi" ? "मेनोपॉज" : locale === "mr" ? "रजोनिवृत्ती" : "Menopause",
    locale === "hi" ? "बच्चों की एलर्जी" : locale === "mr" ? "मुलांची ऍलर्जी" : "Child Allergies",
    locale === "hi" ? "बार-बार संक्रमण" : locale === "mr" ? "वारंवार संसर्ग" : "Recurrent Infections",
    "ADHD",
    locale === "hi" ? "त्वचा समस्याएं" : locale === "mr" ? "त्वचा समस्या" : "Skin Conditions",
    locale === "hi" ? "माइग्रेन" : locale === "mr" ? "मायग्रेन" : "Migraines",
    locale === "hi" ? "गठिया" : locale === "mr" ? "संधिवात" : "Arthritis",
    "IBS",
    locale === "hi" ? "चिंता व तनाव" : locale === "mr" ? "चिंता व ताण" : "Stress & Anxiety",
    locale === "hi" ? "बाल झड़ना" : locale === "mr" ? "केस गळणे" : "Hair Fall",
    locale === "hi" ? "दमा" : locale === "mr" ? "दमा" : "Asthma",
    locale === "hi" ? "साइनस" : locale === "mr" ? "सायनस" : "Sinus Issues",
    locale === "hi" ? "वजन बढ़ना" : locale === "mr" ? "वजन वाढ" : "Weight Concerns",
  ];

  return (
    <div className="pt-24 overflow-hidden">
      {/* HERO */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1
            className="font-serif mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.6rem, 5vw, 4rem)",
              color: "var(--text-primary)",
              lineHeight: 1.2,
            }}
          >
            {locale === "hi"
              ? "होम्योपैथी क्यों चुनें?"
              : locale === "mr"
              ? "होमिओपॅथी का निवडावी?"
              : "Why Choose Homeopathy?"}
            <span className="block italic text-sage-500">
              {locale === "hi"
                ? "एक सौम्य और व्यक्तिगत उपचार पद्धति"
                : locale === "mr"
                ? "सौम्य व वैयक्तिक उपचार पद्धत"
                : "A gentle and personalized approach to healing"}
            </span>
          </h1>

          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {locale === "hi"
              ? "होम्योपैथी उपचार का उद्देश्य शरीर की प्राकृतिक संतुलन क्षमता को समर्थन देना है।"
              : locale === "mr"
              ? "होमिओपॅथीचा उद्देश शरीराची नैसर्गिक संतुलन क्षमता समर्थित करणे आहे."
              : "Homeopathy supports the body’s natural ability to regain balance and improve overall health."}
          </p>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-serif text-4xl text-center mb-14"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            {locale === "hi"
              ? "होम्योपैथी के मूल सिद्धांत"
              : locale === "mr"
              ? "होमिओपॅथीची मूलतत्त्वे"
              : "Core Principles of Homeopathy"}
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                emoji: "⚗️",
                titleEn: "Like Treats Like",
                titleHi: "समान से समान का उपचार",
                titleMr: "सदृशाने सदृश उपचार",
                descEn:
                  "A substance that causes symptoms in a healthy person may help relieve similar symptoms in illness.",
                descHi:
                  "जो पदार्थ स्वस्थ व्यक्ति में लक्षण उत्पन्न करता है, वही समान लक्षणों में राहत दे सकता है।",
                descMr:
                  "जो पदार्थ निरोगी व्यक्तीत लक्षणे निर्माण करतो, तोच आजारात उपयोगी ठरू शकतो.",
              },
              {
                num: "02",
                emoji: "💊",
                titleEn: "Minimum Dose",
                titleHi: "न्यूनतम मात्रा",
                titleMr: "किमान मात्रा",
                descEn:
                  "Medicines are given in very small doses to gently stimulate healing.",
                descHi:
                  "दवाएं बहुत कम मात्रा में दी जाती हैं ताकि शरीर को धीरे से सहायता मिले।",
                descMr:
                  "औषधे अत्यल्प प्रमाणात दिली जातात जेणेकरून शरीराला सौम्य आधार मिळतो.",
              },
              {
                num: "03",
                emoji: "🎯",
                titleEn: "Individualized Treatment",
                titleHi: "व्यक्तिगत उपचार",
                titleMr: "वैयक्तिक उपचार",
                descEn:
                  "Treatment is chosen based on the individual, not just the diagnosis.",
                descHi:
                  "इलाज व्यक्ति के अनुसार होता है, केवल बीमारी के नाम से नहीं।",
                descMr:
                  "उपचार रुग्णानुसार ठरतो, केवळ आजाराच्या नावावर नाही.",
              },
            ].map((p) => (
              <div
                key={p.num}
                className="relative p-8 rounded-2xl border hover:shadow-lg transition-all"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="font-semibold text-lg mb-3" style={{ color: "var(--text-primary)" }}>
                  {locale === "hi"
                    ? p.titleHi
                    : locale === "mr"
                    ? p.titleMr
                    : p.titleEn}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {locale === "hi"
                    ? p.descHi
                    : locale === "mr"
                    ? p.descMr
                    : p.descEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-serif text-4xl text-center mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            {locale === "hi"
              ? "होम्योपैथी और अन्य उपचारों की तुलना"
              : locale === "mr"
              ? "होमिओपॅथी आणि इतर उपचार"
              : "Homeopathy Compared"}
          </h2>

          <div
            className="rounded-2xl overflow-hidden shadow-sm border"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
          >
            <div className="grid grid-cols-3 bg-sage-500 text-white text-sm font-medium">
              <div className="p-4">
                {locale === "hi" ? "पहलू" : locale === "mr" ? "घटक" : "Aspect"}
              </div>
              <div className="p-4">🌿 Homeopathy</div>
              <div className="p-4">💊 Conventional</div>
            </div>

            {comparisons.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-3 border-t ${
                  i % 2 === 0 ? "" : "bg-sage-50/30 dark:bg-sage-900/30"
                }`}
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="p-4 font-medium text-sm border-r" style={{ color: "var(--text-primary)", borderColor: "var(--border-color)" }}>
                  {locale === "hi"
                    ? row.topicHi
                    : locale === "mr"
                    ? row.topicMr
                    : row.topicEn}
                </div>
                <div className="p-4 text-sm border-r flex gap-2" style={{ color: "var(--text-secondary)", borderColor: "var(--border-color)" }}>
                  <CheckCircle className="w-4 h-4 text-sage-500 mt-0.5" />
                  {row.homeopathy}
                </div>
                <div className="p-4 text-sm" style={{ color: "var(--text-muted)" }}>
                  {row.conventional}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MYTHS */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-serif text-4xl text-center mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            {locale === "hi"
              ? "कुछ आम गलतफहमियां"
              : locale === "mr"
              ? "सामान्य गैरसमज"
              : "Common Misunderstandings"}
          </h2>

          <div className="space-y-6">
            {myths.map((m, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border" style={{ borderColor: "var(--border-color)" }}>
                <div className="bg-red-50 p-5 flex gap-3">
                  <XCircle className="w-5 h-5 text-red-400 mt-0.5" />
                  <div className="font-medium text-red-800">{m.myth}</div>
                </div>
                <div className="bg-green-50 p-5 flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div className="text-green-800 text-sm leading-relaxed">
                    {m.truth}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TREATS */}
      <section
        className="py-20 px-6"
        style={{ background: "linear-gradient(135deg, #263727, #3a5a3a)" }}
      >
        <div className="max-w-5xl mx-auto text-center">
          <h2
            className="font-serif text-4xl text-white mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {locale === "hi"
              ? "किन समस्याओं में मदद मिलती है"
              : locale === "mr"
              ? "कोणत्या समस्यांमध्ये मदत होते"
              : "Conditions Commonly Addressed"}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {treats.map((cond) => (
              <div
                key={cond}
                className="bg-white/10 rounded-xl px-4 py-3 text-sage-200 text-sm"
              >
                {cond}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 text-center" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="max-w-xl mx-auto">
          <h2
            className="font-serif text-3xl mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            {locale === "hi"
              ? "और जानना चाहते हैं?"
              : locale === "mr"
              ? "अधिक जाणून घ्यायचे आहे?"
              : "Would You Like to Know More?"}
          </h2>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            {locale === "hi"
              ? "डॉ. प्रतिमा आगले से व्यक्तिगत परामर्श के लिए संपर्क करें।"
              : locale === "mr"
              ? "डॉ. प्रतिमा आगले यांच्याशी वैयक्तिक सल्ल्यासाठी संपर्क करा."
              : "Speak with Dr. Pratima Agale to understand if homeopathy is right for you."}
          </p>

          <a
            href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Pratima%20Agale."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-sage-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-sage-600 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 32 32"
              fill="white"
              className="w-5 h-5"
            >
              <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.67 4.77 1.84 6.76L2 30l7.44-1.8A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.6l-.42-.25-4.42 1.07 1.1-4.3-.28-.44A11.47 11.47 0 0 1 4.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.3-8.57c-.34-.17-2.02-1-2.34-1.11-.32-.11-.55-.17-.78.17-.23.34-.9 1.11-1.1 1.34-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.02-1.9-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.08-.17-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.59h-.66c-.23 0-.6.08-.91.4-.32.32-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.02-.82 2.31-1.62.28-.8.28-1.48.2-1.62-.08-.14-.3-.22-.64-.39z" />
            </svg>
            {t.common.bookConsultation}
          </a>
        </div>
      </section>
    </div>
  );
}