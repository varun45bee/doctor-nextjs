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
        style={{ background: "linear-gradient(135deg, #f4f7f4, #faf3e6)" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1
            className="font-serif mb-6"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.6rem, 5vw, 4rem)",
              color: "#1e2820",
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

          <p className="text-sage-700 text-lg leading-relaxed">
            {locale === "hi"
              ? "होम्योपैथी उपचार का उद्देश्य शरीर की प्राकृतिक संतुलन क्षमता को समर्थन देना है।"
              : locale === "mr"
              ? "होमिओपॅथीचा उद्देश शरीराची नैसर्गिक संतुलन क्षमता समर्थित करणे आहे."
              : "Homeopathy supports the body’s natural ability to regain balance and improve overall health."}
          </p>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2
            className="font-serif text-4xl text-center mb-14"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
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
                className="relative p-8 rounded-2xl border border-sage-100 hover:shadow-lg transition-all"
              >
                <div className="text-4xl mb-4">{p.emoji}</div>
                <h3 className="font-semibold text-sage-900 text-lg mb-3">
                  {locale === "hi"
                    ? p.titleHi
                    : locale === "mr"
                    ? p.titleMr
                    : p.titleEn}
                </h3>
                <p className="text-sage-600 text-sm leading-relaxed">
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
      <section className="py-20 px-6" style={{ backgroundColor: "#faf3e6" }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-serif text-4xl text-center mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
          >
            {locale === "hi"
              ? "होम्योपैथी और अन्य उपचारों की तुलना"
              : locale === "mr"
              ? "होमिओपॅथी आणि इतर उपचार"
              : "Homeopathy Compared"}
          </h2>

          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sage-100">
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
                className={`grid grid-cols-3 border-t border-sage-50 ${
                  i % 2 === 0 ? "bg-white" : "bg-sage-50/30"
                }`}
              >
                <div className="p-4 font-medium text-sage-900 text-sm border-r border-sage-50">
                  {locale === "hi"
                    ? row.topicHi
                    : locale === "mr"
                    ? row.topicMr
                    : row.topicEn}
                </div>
                <div className="p-4 text-sage-700 text-sm border-r border-sage-50 flex gap-2">
                  <CheckCircle className="w-4 h-4 text-sage-500 mt-0.5" />
                  {row.homeopathy}
                </div>
                <div className="p-4 text-sage-500 text-sm">
                  {row.conventional}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MYTHS */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-serif text-4xl text-center mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
          >
            {locale === "hi"
              ? "कुछ आम गलतफहमियां"
              : locale === "mr"
              ? "सामान्य गैरसमज"
              : "Common Misunderstandings"}
          </h2>

          <div className="space-y-6">
            {myths.map((m, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-sage-100">
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
      <section className="py-16 px-6 text-center" style={{ backgroundColor: "#faf3e6" }}>
        <div className="max-w-xl mx-auto">
          <h2
            className="font-serif text-3xl mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
          >
            {locale === "hi"
              ? "और जानना चाहते हैं?"
              : locale === "mr"
              ? "अधिक जाणून घ्यायचे आहे?"
              : "Would You Like to Know More?"}
          </h2>
          <p className="text-sage-600 mb-6">
            {locale === "hi"
              ? "डॉ. प्रतिमा आगले से व्यक्तिगत परामर्श के लिए संपर्क करें।"
              : locale === "mr"
              ? "डॉ. प्रतिमा आगले यांच्याशी वैयक्तिक सल्ल्यासाठी संपर्क करा."
              : "Speak with Dr. Pratima Agale to understand if homeopathy is right for you."}
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-sage-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-sage-600 transition-all"
          >
            {t.common.bookConsultation}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}