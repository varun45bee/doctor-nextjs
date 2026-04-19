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
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-5"
            style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
          >
            40+ Conditions Treated
          </div>
          <h1
            className="font-serif mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.5rem, 5vw, 3.8rem)",
              color: "var(--text-primary)",
            }}
          >
            All Conditions We Treat
            <span className="block italic text-sage-500 text-2xl mt-2">
              होम्योपैथी से इलाज · होमिओपॅथीने उपचार
            </span>
          </h1>
          <p className="leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
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
              className="w-full pl-11 pr-4 py-3 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-sage-100"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
            />
          </div>
        </div>
      </section>

      {/* Search results */}
      {filtered && (
        <section className="py-10 px-6 border-b" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}>
          <div className="max-w-5xl mx-auto">
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"</p>
            <div className="flex flex-wrap gap-3">
              {filtered.map((c) => (
                <Link
                  key={c.href}
                  href={c.href}
                  className="flex items-center gap-2 border px-5 py-2.5 rounded-full text-sm hover:opacity-80 transition-all"
                  style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)", color: "var(--text-primary)" }}
                >
                  {c.name} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>No conditions found. Try a different search.</p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Category groups */}
      {!filtered && (
        <section className="py-16 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
          <div className="max-w-6xl mx-auto space-y-14">
            {conditionGroups.map((group) => (
              <div key={group.categoryKey}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{group.emoji}</span>
                  <h2
                    className="font-serif text-2xl"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      color: "var(--text-primary)",
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
                      className="group flex items-center justify-between p-4 rounded-xl border hover:shadow-md transition-all hover:-translate-y-0.5"
                      style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
                    >
                      <div>
                        <div className="font-medium text-sm transition-colors" style={{ color: "var(--text-primary)" }}>
                          {cond.name}
                        </div>
                        <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
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
      <section className="py-12 px-6" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h3
            className="font-serif text-2xl mb-3"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            Don't see your condition listed?
          </h3>
          <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
            Homeopathy treats over 100 conditions. If you don't see yours above,
            contact Dr. Pratima Agale — she'll let you know if homeopathy can help.
          </p>
       <a
  href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20consult%20Dr.%20Pratima%20Agale."
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 bg-sage-500 text-white px-7 py-3 rounded-full font-medium hover:bg-sage-600 transition-all hover:shadow-md hover:-translate-y-0.5"
>
  {/* WhatsApp Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.67 4.77 1.84 6.76L2 30l7.44-1.8A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.6l-.42-.25-4.42 1.07 1.1-4.3-.28-.44A11.47 11.47 0 0 1 4.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.3-8.57c-.34-.17-2.02-1-2.34-1.11-.32-.11-.55-.17-.78.17-.23.34-.9 1.11-1.1 1.34-.2.23-.40.25-.74.08-.34-.17-1.44-.53-2.74-1.69-1.01-.90-1.7-2.02-1.9-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.40.51-.60.17-.20.23-.34.34-.57.11-.23.06-.43-.03-.60-.08-.17-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.59h-.66c-.23 0-.60.08-.91.40-.32.32-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.10 2.02-.82 2.31-1.62.28-.80.28-1.48.20-1.62-.08-.14-.30-.22-.64-.39z" />
  </svg>

  Ask Dr. Pratima
</a>
        </div>
      </section>
    </div>
  );
}
