import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "PCOS Treatment Kalyan | Natural Homeopathy – Dr. Pratima Agale MD",
  description: "Dr. Pratima Agale (BHMS, MD Homeopathy) — expert PCOS treatment in Kalyan. Natural homeopathic remedies for irregular periods, hormonal imbalance, weight gain & fertility. Lady homeopathy specialist serving Kalyan, Dombivli, Thane & Mumbai.",
  keywords: [
    "PCOS treatment kalyan",
    "PCOD treatment kalyan",
    "homeopathy for PCOS kalyan",
    "PCOS homeopathy doctor kalyan",
    "irregular periods treatment kalyan",
    "hormonal imbalance homeopathy kalyan",
    "PCOS weight loss homeopathy",
    "PCOS fertility treatment kalyan",
    "lady doctor PCOS kalyan",
    "female homeopathy doctor PCOS",
    "PCOD natural treatment kalyan",
    "PCOS without hormones kalyan",
    "PCOS homeopathy specialist mumbai",
    "PCOD साठी होमिओपॅथी कल्याण",
  ],
  alternates: { canonical: "https://www.pratimaagale.in/pcos-treatment-kalyan" },
  openGraph: {
    title: "PCOS Treatment Kalyan | Natural Homeopathy – Dr. Pratima Agale MD",
    description: "Natural homeopathic treatment for PCOS, PCOD, irregular periods and hormonal imbalance by MD-qualified lady homeopathy doctor in Kalyan.",
    url: "https://www.pratimaagale.in/pcos-treatment-kalyan",
  },
};

// ─── JSON-LD: MedicalCondition ───────────────────────────────────────────────
const pcosConditionSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalCondition",
  name: "Polycystic Ovary Syndrome (PCOS)",
  description: "A hormonal disorder causing enlarged ovaries with small cysts on the outer edges, leading to irregular periods, excess androgen levels, and polycystic ovaries.",
  alternateName: "PCOD",
  typicalTest: {
    "@type": "MedicalTest",
    name: "Pelvic ultrasound, hormone blood tests",
  },
  riskFactor: [
    "Insulin resistance",
    "Obesity",
    "Family history",
    "Sedentary lifestyle",
  ],
  signOrSymptom: [
    "Irregular periods",
    "Excess hair growth",
    "Acne",
    "Weight gain",
    "Difficulty conceiving",
  ],
};

// ─── JSON-LD: MedicalTherapy ───────────────────────────────────────────────────
const pcosTherapySchema = {
  "@context": "https://schema.org",
  "@type": "MedicalTherapy",
  name: "Homeopathic Treatment for PCOS",
  description: "Individualized homeopathic remedies to restore hormonal balance, regulate menstrual cycles, and address root causes of PCOS without side effects.",
  howItWorks: "Homeopathy works by stimulating the body's self-healing mechanisms to restore hormonal balance and regulate ovarian function naturally.",
  indication: [
    {
      "@type": "MedicalIndication",
      name: "PCOS with irregular periods",
    },
    {
      "@type": "MedicalIndication",
      name: "PCOS with hormonal imbalance",
    },
    {
      "@type": "MedicalIndication",
      name: "PCOS with weight gain",
    },
  ],
};

// ─── JSON-LD: FAQPage ───────────────────────────────────────────────────────
const pcosFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can homeopathy cure PCOS permanently?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Homeopathy can help manage PCOS effectively by addressing the root cause — hormonal imbalance. While individual results vary, many patients experience significant improvement in cycle regularity and symptoms with consistent treatment.",
      },
    },
    {
      "@type": "Question",
      name: "How long does PCOS homeopathy treatment take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PCOS treatment typically requires 6-18 months of consistent homeopathic care. The duration depends on severity, duration of the condition, and individual response to treatment.",
      },
    },
    {
      "@type": "Question",
      name: "Is homeopathy safe for PCOS during pregnancy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Homeopathic remedies are safe during pregnancy and can be used to manage PCOS symptoms under the guidance of a qualified homeopath like Dr. Pratima Agale.",
      },
    },
    {
      "@type": "Question",
      name: "Can homeopathy help with PCOS weight gain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Homeopathy addresses the metabolic and hormonal aspects of PCOS that contribute to weight gain, helping restore natural metabolic function alongside lifestyle guidance.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best homeopathic remedy for PCOS?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "There is no single 'best' remedy for PCOS. Homeopathy is individualized — remedies like Pulsatilla, Sepia, Natrum Mur, and Lachesis are commonly used based on your unique symptom picture and constitution.",
      },
    },
  ],
};

const symptoms = [
  "Irregular or absent periods",
  "Excess facial and body hair",
  "Acne and oily skin",
  "Unexplained weight gain",
  "Difficulty conceiving",
  "Mood swings and anxiety",
  "Fatigue and low energy",
  "Hair thinning or hair loss",
];

const benefits = [
  "Regulates menstrual cycles naturally",
  "Balances hormones without side effects",
  "Improves fertility chances",
  "Reduces excess hair growth",
  "Clears acne and skin issues",
  "Supports healthy weight management",
  "Addresses emotional symptoms",
  "Strengthens overall vitality",
];

export default function PCOSTreatmentPage() {
  return (
    <div className="pt-24">
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://www.pratimaagale.in" },
          { name: "PCOS Treatment Kalyan", item: "https://www.pratimaagale.in/pcos-treatment-kalyan" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pcosConditionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pcosTherapySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pcosFaqSchema) }}
      />

      {/* Hero Section */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🌸</div>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}
          >
            PCOS Treatment in Kalyan
            <span className="block italic text-sage-500">Natural Homeopathic Healing</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Dr. Pratima Agale (BHMS, MD Homeopathy) offers individualized homeopathic treatment for PCOS,
            PCOD, irregular periods, and hormonal imbalance. Natural remedies without side effects.
            Serving Kalyan, Dombivli, Thane & Mumbai.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2 rounded-full text-sm font-medium border border-green-200 mt-6">
            <Shield className="w-4 h-4" />
            100% Natural & Side-Effect Free
          </div>
        </div>
      </section>

      {/* Symptoms Section */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-serif text-3xl mb-8 text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            Common PCOS Symptoms
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {symptoms.map((symptom) => (
              <div
                key={symptom}
                className="rounded-xl p-4 text-center border"
                style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
              >
                <CheckCircle className="w-5 h-5 text-sage-500 mx-auto mb-2" />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{symptom}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-serif text-3xl mb-8 text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            Benefits of Homeopathic PCOS Treatment
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-3xl mx-auto">
          <h2
            className="font-serif text-3xl mb-8 text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {pcosFaqSchema.mainEntity.map((faq: any, index: number) => (
              <details
                key={index}
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: "var(--border-color)" }}
              >
                <summary className="flex items-center justify-between gap-3 p-5 cursor-pointer font-semibold" style={{ color: "var(--text-primary)" }}>
                  {faq.name}
                  <span className="text-sage-400">↓</span>
                </summary>
                <div className="p-5 pt-0 text-sm leading-relaxed border-t" style={{ color: "var(--text-secondary)", borderColor: "var(--border-color)" }}>
                  {faq.acceptedAnswer.text}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Disclaimer */}
      <section className="py-8 px-6 bg-sage-50">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-sage-700 text-center leading-relaxed">
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified healthcare provider with any questions you may have regarding PCOS or any medical condition.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Start Your PCOS Healing Journey
          </h2>
          <p className="text-sage-100 mb-6">
            Book a consultation with Dr. Pratima Agale for personalized homeopathic PCOS treatment.
          </p>
          <a
            href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20a%20PCOS%20consultation%20with%20Dr.%20Pratima%20Agale."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Book PCOS Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
