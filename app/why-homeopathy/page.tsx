"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function WhyHomeopathyPage() {
  const { t, locale } = useLanguage();

  const comparisons = [
    { topicEn: "Approach", topicHi: "दृष्टिकोण", topicMr: "दृष्टिकोन", homeopathy: locale === "hi" ? "पूरे व्यक्ति का उपचार" : locale === "mr" ? "संपूर्ण व्यक्तीवर उपचार" : "Treats the whole person — mind, body & spirit", conventional: locale === "hi" ? "लक्षणों को दबाता है" : locale === "mr" ? "लक्षणे दडपतो" : "Targets specific organs or symptoms" },
    { topicEn: "Side Effects", topicHi: "दुष्प्रभाव", topicMr: "दुष्परिणाम", homeopathy: locale === "hi" ? "कोई नहीं — 100% प्राकृतिक" : locale === "mr" ? "कोणते नाहीत — 100% नैसर्गिक" : "None — 100% natural remedies", conventional: locale === "hi" ? "अक्सर होते हैं" : locale === "mr" ? "अनेकदा असतात" : "Often present, sometimes significant" },
    { topicEn: "Dependency", topicHi: "निर्भरता", topicMr: "अवलंबन", homeopathy: locale === "hi" ? "कोई लत नहीं" : locale === "mr" ? "कोणती सवय नाही" : "No addiction or dependency", conventional: locale === "hi" ? "कुछ दवाएं लत लगाती हैं" : locale === "mr" ? "काही औषधे सवय लावतात" : "Some medications cause dependency" },
    { topicEn: "Goal", topicHi: "लक्ष्य", topicMr: "ध्येय", homeopathy: locale === "hi" ? "मूल कारण का उपचार" : locale === "mr" ? "मूळ कारणावर उपचार" : "Resolve root cause for permanent cure", conventional: locale === "hi" ? "लक्षणों का प्रबंधन" : locale === "mr" ? "लक्षणे नियंत्रित करणे" : "Manage and suppress symptoms" },
    { topicEn: "Safe for", topicHi: "सुरक्षित है", topicMr: "सुरक्षित आहे", homeopathy: locale === "hi" ? "नवजात, गर्भवती, बुजुर्ग" : locale === "mr" ? "नवजात, गर्भवती, वृद्ध" : "Infants, pregnant women, elderly", conventional: locale === "hi" ? "कई दवाएं इन समूहों के लिए नहीं" : locale === "mr" ? "अनेक औषधे या गटांसाठी नाहीत" : "Many drugs restricted for these groups" },
    { topicEn: "Cost", topicHi: "लागत", topicMr: "खर्च", homeopathy: locale === "hi" ? "बहुत किफायती" : locale === "mr" ? "अत्यंत परवडणारी" : "Very affordable, long-term savings", conventional: locale === "hi" ? "महंगा, खासकर जीर्ण रोगों में" : locale === "mr" ? "महाग, विशेषतः जुनाट रोगांत" : "Costly, especially for chronic conditions" },
  ];

  const myths = [
    { myth: locale === "hi" ? "होम्योपैथी सिर्फ प्लेसबो है" : locale === "mr" ? "होमिओपॅथी केवळ प्लेसबो आहे" : "Homeopathy is just placebo", truth: locale === "hi" ? "नैदानिक परीक्षणों ने एलर्जी, श्वसन संक्रमण और हार्मोनल असंतुलन में सांख्यिकीय रूप से महत्वपूर्ण परिणाम दिखाए हैं।" : locale === "mr" ? "नैदानिक चाचण्यांनी ऍलर्जी, श्वसन संसर्ग आणि हार्मोनल असंतुलनात सांख्यिकीयदृष्ट्या महत्त्वपूर्ण परिणाम दाखवले आहेत." : "Clinical trials have shown statistically significant results beyond placebo, especially in allergies, respiratory infections, and hormonal imbalances." },
    { myth: locale === "hi" ? "यह बहुत धीरे काम करता है" : locale === "mr" ? "हे खूप हळू काम करते" : "It works too slowly", truth: locale === "hi" ? "तीव्र रोग घंटों में ठीक हो सकते हैं। जीर्ण रोगों को समय लगता है लेकिन परिणाम स्थायी होते हैं।" : locale === "mr" ? "तीव्र स्थिती काही तासांत सुधारू शकतात. जुनाट रोगांना वेळ लागतो परंतु परिणाम टिकाऊ असतात." : "Acute conditions can respond in hours or days. Chronic conditions need more time — but results are lasting, not temporary." },
    { myth: locale === "hi" ? "इसका वैज्ञानिक प्रमाण नहीं" : locale === "mr" ? "याला वैज्ञानिक पुरावा नाही" : "It's not scientifically validated", truth: locale === "hi" ? "1000 से अधिक नैदानिक परीक्षण हुए हैं। WHO ने इसे विश्व की दूसरी सबसे बड़ी चिकित्सा प्रणाली मान्यता दी है।" : locale === "mr" ? "1000 पेक्षा जास्त नैदानिक चाचण्या झाल्या आहेत. WHO ने याला जगातील दुसरी सर्वात मोठी वैद्यकीय प्रणाली म्हणून मान्यता दिली आहे." : "Over 1000 clinical trials have studied homeopathy. The WHO recognizes it as the world's second-largest system of medicine." },
    { myth: locale === "hi" ? "यह गंभीर बीमारियों का इलाज नहीं कर सकता" : locale === "mr" ? "हे गंभीर आजारांवर उपचार करू शकत नाही" : "It can't treat serious diseases", truth: locale === "hi" ? "होम्योपैथी गठिया, थायराइड, PCOD और त्वचा रोगों को प्रभावी ढंग से प्रबंधित करती है।" : locale === "mr" ? "होमिओपॅथी संधिवात, थायरॉईड, PCOD आणि त्वचा रोग प्रभावीपणे व्यवस्थापित करते." : "Homeopathy manages chronic conditions like arthritis, thyroid, PCOD, and skin disorders effectively — often where conventional medicine offers only lifetime medication." },
  ];

  const treats = ["PCOD / PCOS", "Thyroid Disorders", locale === "hi" ? "हार्मोनल असंतुलन" : locale === "mr" ? "हार्मोनल असंतुलन" : "Hormonal Imbalance", locale === "hi" ? "मेनोपॉज" : locale === "mr" ? "रजोनिवृत्ती" : "Menopause", locale === "hi" ? "बच्चों की एलर्जी" : locale === "mr" ? "मुलांची ऍलर्जी" : "Child Allergies", locale === "hi" ? "बार-बार संक्रमण" : locale === "mr" ? "वारंवार संसर्ग" : "Recurrent Infections", "ADHD", locale === "hi" ? "त्वचा रोग" : locale === "mr" ? "त्वचा विकार" : "Skin Disorders", locale === "hi" ? "माइग्रेन" : locale === "mr" ? "मायग्रेन" : "Migraines", locale === "hi" ? "गठिया" : locale === "mr" ? "संधिवात" : "Arthritis", "IBS", locale === "hi" ? "चिंता और तनाव" : locale === "mr" ? "चिंता आणि ताण" : "Anxiety & Stress", locale === "hi" ? "बाल झड़ना" : locale === "mr" ? "केस गळणे" : "Hair Loss", locale === "hi" ? "दमा" : locale === "mr" ? "दमा" : "Asthma", locale === "hi" ? "साइनसाइटिस" : locale === "mr" ? "सायनुसायटिस" : "Sinusitis", locale === "hi" ? "मोटापा" : locale === "mr" ? "लठ्ठपणा" : "Obesity"];

  const principleTitle = locale === "hi" ? "मूलभूत सिद्धांत" : locale === "mr" ? "मूलभूत तत्त्वे" : "The Founding Principles";
  const compTitle = locale === "hi" ? "होम्योपैथी बनाम पारंपरिक चिकित्सा" : locale === "mr" ? "होमिओपॅथी विरुद्ध पारंपरिक वैद्यक" : "Homeopathy vs. Conventional Medicine";
  const mythTitle = locale === "hi" ? "सामान्य भ्रांतियां — दूर करें" : locale === "mr" ? "सामान्य गैरसमज — दूर करा" : "Common Myths — Busted";
  const treatsTitle = locale === "hi" ? "होम्योपैथी किन बीमारियों में सबसे अच्छी है" : locale === "mr" ? "होमिओपॅथी कोणत्या आजारांत सर्वोत्तम आहे" : "What Homeopathy Treats Best";

  return (
    <div className="pt-24 overflow-hidden">
      <section className="py-20 px-6 text-center" style={{ background: "linear-gradient(135deg, #f4f7f4, #faf3e6)" }}>
        <div className="max-w-3xl mx-auto">
          <h1 className="font-serif mb-6" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.8rem, 5vw, 4rem)", color: "#1e2820", lineHeight: 1.2 }}>
            {locale === "hi" ? "होम्योपैथी क्यों?" : locale === "mr" ? "होमिओपॅथी का?" : "Why Choose Homeopathy?"}
            <span className="block italic text-sage-500">{locale === "hi" ? "प्राकृतिक उपचार का विज्ञान" : locale === "mr" ? "नैसर्गिक उपचाराचे विज्ञान" : "The Science of Natural Healing"}</span>
          </h1>
          <p className="text-sage-700 text-lg leading-relaxed">
            {locale === "hi" ? "होम्योपैथी एक विकल्प नहीं — यह 200 वर्षों से प्रचलित, 500 मिलियन लोगों द्वारा उपयोग की जाने वाली एक गहन उपचार प्रणाली है।" : locale === "mr" ? "होमिओपॅथी पर्याय नाही — ती 200 वर्षांपासून प्रचलित, 500 दशलक्ष लोकांनी वापरलेली एक सखोल उपचार प्रणाली आहे." : "Homeopathy is not an alternative — it is a profound system of healing practiced by over 500 million people worldwide."}
          </p>
        </div>
      </section>

      {/* Principles */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-4xl text-center mb-14" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}>{principleTitle}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: "01", titleEn: "Like Cures Like", titleHi: "समान समान को ठीक करता है", titleMr: "सदृश सदृशाला बरे करतो", descEn: "A substance that causes symptoms in a healthy person can cure similar symptoms in a sick person.", descHi: "जो पदार्थ स्वस्थ व्यक्ति में लक्षण उत्पन्न करता है, वह बीमार व्यक्ति में समान लक्षणों को ठीक कर सकता है।", descMr: "जे पदार्थ निरोगी व्यक्तीत लक्षणे निर्माण करतात, ते आजारी व्यक्तीत तसेच लक्षणे बरे करू शकतात.", emoji: "⚗️" },
              { num: "02", titleEn: "Minimum Dose", titleHi: "न्यूनतम खुराक", titleMr: "किमान मात्रा", descEn: "Remedies are prepared through serial dilution, activating healing potential while eliminating toxicity.", descHi: "रेमेडी क्रमिक तनुकरण से तैयार होती हैं — उपचार शक्ति सक्रिय होती है, विषाक्तता समाप्त।", descMr: "रेमेडी क्रमिक तनुकरणाने तयार होतात — उपचार शक्ती सक्रिय होते, विषारीपणा नाहीसा होतो.", emoji: "💊" },
              { num: "03", titleEn: "Single Remedy", titleHi: "एकल रेमेडी", titleMr: "एकल रेमेडी", descEn: "One precisely chosen remedy matching the totality of your physical, mental and emotional symptoms.", descHi: "एक सटीक रेमेडी जो आपके शारीरिक, मानसिक और भावनात्मक लक्षणों की समग्रता से मेल खाती है।", descMr: "एक अचूक रेमेडी जी तुमच्या शारीरिक, मानसिक आणि भावनिक लक्षणांच्या संपूर्णतेशी जुळते.", emoji: "🎯" },
            ].map((p) => (
              <div key={p.num} className="relative p-8 rounded-2xl border border-sage-100 hover:shadow-lg transition-all group">
                <div className="absolute -top-4 left-8 font-serif text-6xl font-light text-sage-100 group-hover:text-sage-200 transition-colors select-none" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{p.num}</div>
                <div className="text-4xl mb-4 mt-4">{p.emoji}</div>
                <h3 className="font-semibold text-sage-900 text-lg mb-3">{locale === "hi" ? p.titleHi : locale === "mr" ? p.titleMr : p.titleEn}</h3>
                <p className="text-sage-600 text-sm leading-relaxed">{locale === "hi" ? p.descHi : locale === "mr" ? p.descMr : p.descEn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-6" style={{ backgroundColor: "#faf3e6" }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-center mb-12" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}>{compTitle}</h2>
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-sage-100">
            <div className="grid grid-cols-3 bg-sage-500 text-white text-sm font-medium">
              <div className="p-4">{locale === "hi" ? "पहलू" : locale === "mr" ? "पैलू" : "Aspect"}</div>
              <div className="p-4">🌿 {locale === "hi" ? "होम्योपैथी" : locale === "mr" ? "होमिओपॅथी" : "Homeopathy"}</div>
              <div className="p-4">💊 {locale === "hi" ? "पारंपरिक" : locale === "mr" ? "पारंपरिक" : "Conventional"}</div>
            </div>
            {comparisons.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 border-t border-sage-50 ${i % 2 === 0 ? "bg-white" : "bg-sage-50/30"}`}>
                <div className="p-4 font-medium text-sage-900 text-sm border-r border-sage-50">{locale === "hi" ? row.topicHi : locale === "mr" ? row.topicMr : row.topicEn}</div>
                <div className="p-4 text-sage-700 text-sm border-r border-sage-50 flex items-start gap-2"><CheckCircle className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />{row.homeopathy}</div>
                <div className="p-4 text-sage-500 text-sm">{row.conventional}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Myths */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-4xl text-center mb-12" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}>{mythTitle}</h2>
          <div className="space-y-6">
            {myths.map((m, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-sage-100">
                <div className="bg-red-50 p-5 flex items-start gap-3"><XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" /><div className="font-medium text-red-800">{locale === "hi" ? "भ्रांति" : locale === "mr" ? "गैरसमज" : "Myth"}: {m.myth}</div></div>
                <div className="bg-green-50 p-5 flex items-start gap-3"><CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /><div className="text-green-800 text-sm leading-relaxed"><strong>{locale === "hi" ? "सत्य" : locale === "mr" ? "सत्य" : "Truth"}:</strong> {m.truth}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What it treats */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, #263727, #3a5a3a)" }}>
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-serif text-4xl text-white mb-12" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{treatsTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {treats.map((cond) => (<div key={cond} className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-sage-200 text-sm hover:bg-white/20 transition-all">{cond}</div>))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 text-center" style={{ backgroundColor: "#faf3e6" }}>
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}>
            {locale === "hi" ? "खुद अनुभव करें" : locale === "mr" ? "स्वतः अनुभव करा" : "Experience It For Yourself"}
          </h2>
          <p className="text-sage-600 mb-6">
            {locale === "hi" ? "कल्याण में डॉ. प्रतिमा आगले के साथ परामर्श बुक करें।" : locale === "mr" ? "कल्याणमध्ये डॉ. प्रतिमा आगले यांच्यासोबत सल्ला घ्या." : "Book a consultation with Dr. Pratima Agale in Kalyan."}
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 bg-sage-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-sage-600 transition-all">
            {t.common.bookConsultation} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
