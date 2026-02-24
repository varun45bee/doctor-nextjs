"use client";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useState } from "react";

const conditionGroups = [
  {
    categoryKey: "skinTitle",
    emoji: "✨",
    color: "#fff8f5",
    borderColor: "#5a7f5a",
    conditions: [
      { name: "Psoriasis", href: "/conditions/psoriasis", hindi: "सोरायसिस", marathi: "सोरायसिस" },
      { name: "Eczema / Atopic Dermatitis", href: "/conditions/eczema", hindi: "एक्जिमा", marathi: "एक्झिमा" },
      { name: "Acne & Pimples", href: "/conditions/acne", hindi: "मुहांसे", marathi: "पुरळ / मुरुम" },
      { name: "Hair Loss & Alopecia", href: "/conditions/hair-loss", hindi: "बाल झड़ना", marathi: "केस गळणे" },
      { name: "Vitiligo (Leucoderma)", href: "/conditions/vitiligo", hindi: "सफेद दाग", marathi: "पांढरे डाग" },
      { name: "Urticaria (Hives)", href: "/conditions/urticaria", hindi: "पित्ती", marathi: "अंगावर उठणाऱ्या गाठी" },
      { name: "Skin Pigmentation & Melasma", href: "/conditions/skin-pigmentation", hindi: "त्वचा का कालापन", marathi: "काळे डाग" },
      { name: "Fungal Skin Infections", href: "/conditions/fungal-skin", hindi: "फंगल संक्रमण", marathi: "बुरशीजन्य संसर्ग" },
      { name: "Warts & Corns", href: "/conditions/warts", hindi: "मस्से", marathi: "मस्से" },
      { name: "Alopecia Areata (Bald Patches)", href: "/conditions/alopecia", hindi: "एलोपेसिया / गंजापन", marathi: "एलोपेसिया" },
      { name: "Melasma / Chloasma", href: "/conditions/melasma", hindi: "मेलाज़्मा", marathi: "मेलास्मा" },
      { name: "Rosacea (Facial Redness)", href: "/conditions/rosacea", hindi: "रोसेशिया", marathi: "रोसेशिया" },
      { name: "Chronic Dandruff", href: "/conditions/dandruff", hindi: "रूसी", marathi: "कोंडा" },
    ],
  },
  {
    categoryKey: "womensTitle",
    emoji: "🌸",
    color: "#fff5f7",
    borderColor: "#5a7f5a",
    conditions: [
      { name: "PCOD / PCOS", href: "/conditions/pcod-pcos", hindi: "पीसीओडी", marathi: "पीसीओडी" },
      { name: "Thyroid Disorders", href: "/conditions/thyroid", hindi: "थायराइड", marathi: "थायरॉईड" },
      { name: "Menopause", href: "/conditions/menopause", hindi: "मेनोपॉज़", marathi: "रजोनिवृत्ती" },
      { name: "Hormonal Imbalance", href: "/conditions/hormonal-imbalance", hindi: "हार्मोनल असंतुलन", marathi: "हार्मोनल असंतुलन" },
      { name: "Infertility Support", href: "/conditions/infertility", hindi: "बांझपन", marathi: "वंध्यत्व" },
    ],
  },
  {
    categoryKey: "pediatricTitle",
    emoji: "🌱",
    color: "#f0f8ff",
    borderColor: "#5a7f5a",
    conditions: [
      { name: "Child Immunity & Infections", href: "/conditions/child-immunity", hindi: "बच्चों की रोग प्रतिरोधक क्षमता", marathi: "मुलांची प्रतिकारशक्ती" },
      { name: "ADHD & Behavioral Issues", href: "/conditions/adhd", hindi: "ADHD", marathi: "ADHD" },
      { name: "Allergies & Asthma in Children", href: "/conditions/allergies-asthma", hindi: "एलर्जी", marathi: "ऍलर्जी" },
      { name: "Recurrent Tonsillitis", href: "/conditions/tonsillitis", hindi: "टॉन्सिल्स", marathi: "टॉन्सिलायटिस" },
      { name: "Autism Support", href: "/conditions/autism-support", hindi: "ऑटिज्म", marathi: "ऑटिझम" },
      { name: "Bedwetting (Enuresis)", href: "/conditions/bedwetting", hindi: "बिस्तर में पेशाब", marathi: "अंथरुणात लघवी" },
      { name: "Stammering", href: "/conditions/stammering", hindi: "हकलाना", marathi: "तोतरेपणा" },
    ],
  },
  {
    categoryKey: "chronicTitle",
    emoji: "💚",
    color: "#f5fff8",
    borderColor: "#5a7f5a",
    conditions: [
      { name: "Arthritis & Joint Pain", href: "/conditions/arthritis", hindi: "गठिया", marathi: "संधिवात" },
      { name: "Migraines & Headaches", href: "/conditions/migraines", hindi: "माइग्रेन", marathi: "मायग्रेन" },
      { name: "IBS & Digestive Disorders", href: "/conditions/ibs-digestive", hindi: "IBS / पाचन", marathi: "IBS / पाचन" },
      { name: "Sinusitis", href: "/conditions/sinusitis", hindi: "साइनसाइटिस", marathi: "सायनुसायटिस" },
      { name: "Anxiety & Stress", href: "/conditions/anxiety-stress", hindi: "चिंता और तनाव", marathi: "चिंता आणि ताण" },
      { name: "Allergies & Asthma (Adult)", href: "/conditions/allergies-asthma", hindi: "एलर्जी", marathi: "ऍलर्जी" },
      { name: "Piles / Hemorrhoids & Fissures", href: "/conditions/piles-fissures", hindi: "बवासीर", marathi: "मूळव्याध" },
      { name: "Kidney Stones", href: "/conditions/kidney-stones", hindi: "पथरी", marathi: "मूतखडा" },
      { name: "Varicose Veins", href: "/conditions/varicose-veins", hindi: "वैरिकाज़ नसें", marathi: "वैरिकोज नसा" },
      { name: "Anemia", href: "/conditions/anemia", hindi: "एनीमिया", marathi: "अशक्तपणा" },
    ],
  },
  {
    categoryKey: "generalTitle",
    emoji: "🌿",
    color: "#f8fdf8",
    borderColor: "#5a7f5a",
    conditions: [
      { name: "Obesity & Weight Management", href: "/conditions/obesity", hindi: "मोटापा", marathi: "लठ्ठपणा" },
      { name: "Diabetes (Supportive)", href: "/conditions/diabetes-support", hindi: "मधुमेह", marathi: "मधुमेह" },
      { name: "Hypertension", href: "/conditions/hypertension", hindi: "उच्च रक्तचाप", marathi: "उच्च रक्तदाब" },
      { name: "Respiratory (Asthma/Bronchitis)", href: "/conditions/allergies-asthma", hindi: "श्वास संबंधी", marathi: "श्वासविकार" },
    ],
  },
];

const categoryLabels: Record<string, Record<string, string>> = {
  skinTitle: { en: "Skin, Hair & Dermatology", hi: "त्वचा, बाल और त्वचाविज्ञान", mr: "त्वचा, केस आणि त्वचारोगशास्त्र" },
  womensTitle: { en: "Women's Health", hi: "महिला स्वास्थ्य", mr: "महिला आरोग्य" },
  pediatricTitle: { en: "Pediatric & Children", hi: "बाल और बच्चे", mr: "बाल आणि मुले" },
  chronicTitle: { en: "Chronic & Lifestyle Diseases", hi: "जीर्ण और जीवनशैली रोग", mr: "जुनाट आणि जीवनशैली रोग" },
  generalTitle: { en: "General Health", hi: "सामान्य स्वास्थ्य", mr: "सामान्य आरोग्य" },
};

export default function ConditionsPage() {
  const { locale } = useLanguage();
  const [search, setSearch] = useState("");

  const allConditions = conditionGroups.flatMap((g) => g.conditions);
  const filtered = search
    ? allConditions.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.hindi.includes(search) ||
        c.marathi.includes(search)
      )
    : null;

  return (
    <div className="pt-24 overflow-hidden">
      {/* Hero */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #f4f7f4, #faf3e6)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-5">
            40+ Conditions Treated
          </div>
          <h1
            className="font-serif mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
              color: "#1e2820",
            }}
          >
            All Conditions We Treat
            <span className="block italic text-sage-500 text-2xl mt-2">
              होम्योपैथी से इलाज · होमिओपॅथीने उपचार
            </span>
          </h1>
          <p className="text-sage-700 leading-relaxed mb-8">
            Click any condition to learn what it is, how homeopathy treats it,
            and how Dr. Pratima Agale can help you in Kalyan, Mumbai.
          </p>

          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
            <input
              type="text"
              placeholder="Search condition (English, हिंदी, मराठी)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-sage-200 text-sm focus:outline-none focus:border-sage-400 focus:ring-2 focus:ring-sage-100 bg-white"
            />
          </div>
        </div>
      </section>

      {/* Search results */}
      {filtered && (
        <section className="py-10 px-6 bg-white border-b border-sage-50">
          <div className="max-w-5xl mx-auto">
            <p className="text-sage-500 text-sm mb-4">{filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"</p>
            <div className="flex flex-wrap gap-3">
              {filtered.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="flex items-center gap-2 bg-sage-50 border border-sage-100 text-sage-800 px-5 py-2.5 rounded-full text-sm hover:bg-sage-100 hover:border-sage-200 transition-all"
                >
                  {c.name} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
              {filtered.length === 0 && (
                <p className="text-sage-400 text-sm">No conditions found. Try a different search.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Category groups */}
      {!filtered && (
        <section className="py-16 px-6 bg-white">
          <div className="max-w-6xl mx-auto space-y-14">
            {conditionGroups.map((group) => (
              <div key={group.categoryKey}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{group.emoji}</span>
                  <h2
                    className="font-serif text-2xl"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "#1e2820",
                      borderLeft: `4px solid ${group.borderColor}`,
                      paddingLeft: "0.75rem",
                    }}
                  >
                    {categoryLabels[group.categoryKey][locale]}
                  </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {group.conditions.map((cond) => (
                    <Link
                      key={cond.href}
                      href={cond.href}
                      className="group flex items-center justify-between p-4 rounded-xl border border-sage-100 hover:border-sage-200 hover:shadow-md transition-all hover:-translate-y-0.5"
                      style={{ backgroundColor: group.color }}
                    >
                      <div>
                        <div className="font-medium text-sage-900 text-sm group-hover:text-sage-700 transition-colors">
                          {cond.name}
                        </div>
                        <div className="text-xs text-sage-400 mt-0.5">
                          {locale === "hi" ? cond.hindi : locale === "mr" ? cond.marathi : ""}
                          {locale === "en" && `${cond.hindi} · ${cond.marathi}`}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-sage-300 group-hover:text-sage-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Not listed CTA */}
      <section className="py-12 px-6" style={{ backgroundColor: "#f4f7f4" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h3
            className="font-serif text-2xl mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
          >
            Don't see your condition listed?
          </h3>
          <p className="text-sage-600 text-sm mb-5">
            Homeopathy treats over 100 conditions. If you don't see yours above,
            contact Dr. Pratima Agale — she'll let you know if homeopathy can help.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-sage-500 text-white px-7 py-3 rounded-full font-medium hover:bg-sage-600 transition-all"
          >
            Ask Dr. Pratima <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
