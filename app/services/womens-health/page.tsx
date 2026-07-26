import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Women's Homeopathy Doctor Kalyan | PCOS, Thyroid, Fertility – Dr. Pratima Agale MD",
  description:
    "Dr. Pratima Agale (BHMS, MD Homeopathy) — Kalyan's trusted lady homeopathy doctor for women's health. Expert treatment for PCOS, PCOD, thyroid, irregular periods, hormonal imbalance, fertility & menopause. Female homeopathy specialist serving Kalyan, Dombivli, Thane & Mumbai.",
  keywords: [
    // Primary — women + location
    "women homeopathy doctor kalyan",
    "lady homeopathy doctor kalyan",
    "female homeopathy doctor kalyan",
    "women homeopathy specialist kalyan",
    "lady doctor for PCOS kalyan",
    "female homeopathy specialist thane",
    "women homeopathy doctor near me",
    "best lady homeopathy doctor kalyan",
    "MD homeopathy doctor for women kalyan",

    // PCOS / PCOD — most searched
    "PCOS homeopathy treatment kalyan",
    "PCOD homeopathy kalyan",
    "PCOD natural treatment kalyan",
    "homeopathy for irregular periods kalyan",
    "PCOS treatment without hormones kalyan",
    "PCOS homeopathy doctor near me",
    "best homeopathy for PCOD mumbai",
    "lady doctor PCOD kalyan",

    // Thyroid
    "thyroid homeopathy doctor kalyan",
    "hypothyroidism homeopathy kalyan",
    "thyroid homeopathy treatment mumbai",
    "homeopathy for thyroid without medicine kalyan",
    "weight gain thyroid homeopathy",

    // Fertility & hormones
    "fertility homeopathy treatment kalyan",
    "homeopathy for getting pregnant kalyan",
    "hormonal imbalance homeopathy kalyan",
    "homeopathy for delayed periods kalyan",
    "PMS homeopathy treatment kalyan",

    // Menopause
    "menopause homeopathy treatment kalyan",
    "menopause doctor kalyan",
    "hot flashes homeopathy treatment",

    // Hair & skin (women)
    "hair fall after delivery homeopathy kalyan",
    "hair loss homeopathy doctor kalyan",
    "acne PCOS homeopathy kalyan",

    // Marathi / Hindi
    "महिला होम्योपैथी डॉक्टर कल्याण",
    "PCOD साठी होमिओपॅथी कल्याण",
    "थायरॉईड होमिओपॅथी कल्याण",
    "महिला होमिओपॅथ कल्याण",
  ],
  openGraph: {
    title: "Women's Homeopathy Doctor in Kalyan | PCOS, Thyroid, Fertility – Dr. Pratima Agale MD",
    description:
      "MD-qualified lady homeopathy doctor in Kalyan. Expert in PCOS, thyroid, hormonal imbalance, fertility & menopause. Book consultation today.",
    url: "https://pratimaagale.in/services/womens-health",
  },
  alternates: { canonical: "https://pratimaagale.in/services/womens-health" },
};

// ─── JSON-LD: Women's Health Service ─────────────────────────────────────────
const womensHealthSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Women's Homeopathy Treatment – Dr. Pratima Agale Kalyan",
  description:
    "Homeopathic treatment for PCOS, thyroid disorders, hormonal imbalance, infertility, and menopause by MD-qualified lady homeopathy doctor in Kalyan.",
  url: "https://pratimaagale.in/services/womens-health",
  about: [
    { "@type": "MedicalCondition", name: "PCOS" },
    { "@type": "MedicalCondition", name: "PCOD" },
    { "@type": "MedicalCondition", name: "Hypothyroidism" },
    { "@type": "MedicalCondition", name: "Hormonal Imbalance" },
    { "@type": "MedicalCondition", name: "Infertility" },
    { "@type": "MedicalCondition", name: "Menopause" },
  ],
  author: {
    "@type": "Physician",
    name: "Dr. Pratima Agale",
    hasCredential: ["BHMS", "MD Homeopathy"],
  },
};

const conditions = [
  {
    title: "PCOD / PCOS",
    desc: "Polycystic Ovarian Disease/Syndrome is among the most common hormonal disorders in women aged 15–45. Conventional medicine often offers hormonal pills that suppress symptoms without addressing the root cause. Homeopathy works to restore ovarian function, regulate the menstrual cycle, and balance hormones naturally.",
    symptoms: ["Irregular periods", "Weight gain", "Facial hair / acne", "Mood swings", "Fertility issues"],
    remedy: "Constitutional remedies like Pulsatilla, Sepia, and Natrum Mur are commonly used — always individualized.",
    emoji: "🌸",
  },
  {
    title: "Thyroid Disorders",
    desc: "Both hypothyroidism and hyperthyroidism respond beautifully to homeopathic treatment. Rather than suppressing thyroid function with synthetic hormones, homeopathy stimulates the body to self-regulate thyroid activity.",
    symptoms: ["Unexplained weight changes", "Fatigue or hyperactivity", "Hair thinning", "Mood changes", "Temperature sensitivity"],
    remedy: "Remedies are chosen based on your complete symptom picture, not just TSH levels.",
    emoji: "🦋",
  },
  {
    title: "Menopause",
    desc: "The transition through menopause need not be a time of suffering. Homeopathy offers safe, hormone-free relief from hot flashes, mood swings, sleep disruption, and joint pain that accompany this life phase.",
    symptoms: ["Hot flashes", "Night sweats", "Mood instability", "Joint pains", "Sleep issues"],
    remedy: "Lachesis, Graphites, and Sepia are commonly helpful — each case is uniquely assessed.",
    emoji: "🌙",
  },
  {
    title: "Hormonal Imbalance",
    desc: "Hormones govern nearly every aspect of female health. When imbalanced, they cause a cascade of symptoms across body systems. Homeopathy supports the endocrine system holistically to restore natural hormonal rhythm.",
    symptoms: ["Irregular cycles", "PMS", "Acne flares", "Anxiety", "Libido changes"],
    remedy: "Pulsatilla, Calcarea Carb, Ignatia — carefully matched to your individual presentation.",
    emoji: "⚖️",
  },
  {
    title: "Infertility Support",
    desc: "Homeopathy can play a supportive role in couples trying to conceive, particularly when the cause is related to hormonal imbalance, irregular ovulation, or unexplained infertility. It is also used alongside IVF to improve outcomes.",
    symptoms: ["Difficulty conceiving", "Irregular ovulation", "Hormonal causes", "Stress & anxiety around conception"],
    remedy: "Remedies work to optimize reproductive health holistically.",
    emoji: "✨",
  },
];

export default function WomensHealthPage() {
  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(womensHealthSchema) }}
      />

      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-4xl mb-4">🌸</div>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}
          >
            Women's Homeopathy Doctor in Kalyan
            <span className="block italic text-sage-500">MD-Qualified Lady Homeopathy Specialist</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Dr. Pratima Agale (BHMS, MD Homeopathy) — Kalyan's trusted female homeopathy doctor for
            PCOS, thyroid, hormonal imbalance, fertility and every stage of a woman's health journey.
            Serving women across Kalyan, Dombivli, Thane and Mumbai.
          </p>
        </div>
      </section>

      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto space-y-16">
          {conditions.map((cond, i) => (
            <div
              key={cond.title}
              className={`grid md:grid-cols-2 gap-10 items-start ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div>
                <div className="text-5xl mb-4">{cond.emoji}</div>
                <h2
                  className="font-serif text-3xl mb-4"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
                >
                  {cond.title}
                </h2>
                <p className="leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>{cond.desc}</p>
                <div className="rounded-xl p-4 text-sm italic border-l-4" style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)", borderColor: "var(--border-color)" }}>
                  <strong className="not-italic" style={{ color: "var(--text-primary)" }}>Note on remedies:</strong> {cond.remedy}
                </div>
              </div>

              <div className="rounded-2xl border shadow-sm p-7" style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}>
                <h3 className="font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Common Symptoms Addressed</h3>
                <ul className="space-y-3">
                  {cond.symptoms.map((s) => (
                    <li key={s} className="flex items-center gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <CheckCircle className="w-4 h-4 text-sage-500 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-6 flex items-center gap-2 text-sage-600 hover:text-sage-800 font-medium text-sm transition-colors"
                >
                  Book Consultation <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Consult Kalyan's Trusted Lady Homeopathy Doctor
          </h2>
          <p className="text-sage-100 mb-6">
            Dr. Pratima Agale (MD Homeopathy) brings deep expertise and a woman-first approach to every consultation.
            Serving Kalyan, Dombivli, Thane & Mumbai.
          </p>
          <a
            href="https://wa.me/917045532232?text=Hello%2C%20I%20would%20like%20to%20book%20my%20consultation%20with%20Dr.%20Pratima%20Agale."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Book Your Consultation
          </a>
        </div>
      </section>
    </div>
  );
}