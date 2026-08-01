import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Eczema Homeopathy Kalyan | Natural Treatment – Dr. Pratima Agale MD",
  description: "Dr. Pratima Agale (BHMS, MD Homeopathy) — expert eczema homeopathy treatment in Kalyan. Natural remedies for eczema, psoriasis, skin allergies & itching. Lady homeopathy specialist serving Kalyan, Dombivli, Thane & Mumbai.",
  keywords: [
    "eczema homeopathy kalyan",
    "eczema treatment homeopathy",
    "skin allergy homeopathy kalyan",
    "eczema homeopathy doctor kalyan",
    "psoriasis homeopathy kalyan",
    "atopic dermatitis homeopathy",
    "skin itching homeopathy",
    "eczema natural treatment kalyan",
    "child eczema homeopathy",
    "chronic eczema homeopathy",
    "female skin doctor kalyan",
    "lady doctor eczema kalyan",
    "eczema homeopathy specialist thane",
  ],
  alternates: { canonical: "https://pratimaagale.in/eczema-homeopathy-kalyan" },
  openGraph: {
    title: "Eczema Homeopathy Kalyan | Natural Treatment – Dr. Pratima Agale MD",
    description: "Natural homeopathic treatment for eczema, psoriasis, skin allergies and itching by MD-qualified lady homeopathy doctor in Kalyan.",
    url: "https://pratimaagale.in/eczema-homeopathy-kalyan",
  },
};

// ─── JSON-LD: MedicalCondition ───────────────────────────────────────────────
const eczemaConditionSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalCondition",
  name: "Eczema (Atopic Dermatitis)",
  description: "A condition that causes the skin to become itchy, red, dry, and cracked. It's a long-term (chronic) condition that can be triggered by various factors.",
  alternateName: ["Atopic Dermatitis", "Dermatitis"],
  typicalTest: {
    "@type": "MedicalTest",
    name: "Skin examination, allergy testing",
  },
  riskFactor: [
    "Family history",
    "Allergies",
    "Asthma",
    "Environmental factors",
    "Stress",
  ],
  signOrSymptom: [
    "Itchy skin",
    "Red or brownish patches",
    "Small raised bumps",
    "Cracked and dry skin",
    "Skin inflammation",
  ],
};

// ─── JSON-LD: MedicalTherapy ───────────────────────────────────────────────────
const eczemaTherapySchema = {
  "@context": "https://schema.org",
  "@type": "MedicalTherapy",
  name: "Homeopathic Treatment for Eczema",
  description: "Individualized homeopathic remedies to address the root causes of eczema, reduce inflammation, and promote natural skin healing without side effects.",
  howItWorks: "Homeopathy addresses the underlying immune system sensitivity, genetic predisposition, and environmental triggers that cause eczema to promote lasting skin health.",
  indication: [
    {
      "@type": "MedicalIndication",
      name: "Atopic dermatitis",
    },
    {
      "@type": "MedicalIndication",
      name: "Contact dermatitis",
    },
    {
      "@type": "MedicalIndication",
      name: "Chronic eczema",
    },
  ],
};

// ─── JSON-LD: FAQPage ───────────────────────────────────────────────────────
const eczemaFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can homeopathy cure eczema permanently?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Homeopathy can provide significant relief from eczema symptoms and reduce flare-ups by addressing underlying causes. While individual results vary, many patients experience long-term improvement with consistent treatment.",
      },
    },
    {
      "@type": "Question",
      name: "How long does eczema homeopathy treatment take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Eczema treatment typically requires 6-18 months of consistent homeopathic care. The duration depends on severity, chronicity, and individual response to treatment.",
      },
    },
    {
      "@type": "Question",
      name: "Can homeopathy treat eczema in children?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Homeopathy is particularly effective for childhood eczema as it addresses the underlying immune sensitivity and is completely safe for children of all ages.",
      },
    },
    {
      "@type": "Question",
      name: "What homeopathic remedies are used for eczema?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common remedies include Sulphur, Graphites, Arsenicum Album, Rhus Tox, and Petroleum — selected based on your unique symptom picture, skin type, and underlying causes.",
      },
    },
    {
      "@type": "Question",
      name: "Does homeopathy help with eczema itching?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Homeopathy addresses the underlying inflammation and immune sensitivity that causes itching, providing relief without the side effects of topical steroids.",
      },
    },
  ],
};

const symptoms = [
  "Intense itching",
  "Red or brownish patches",
  "Dry, cracked skin",
  "Small raised bumps",
  "Skin inflammation",
  "Thickened skin",
  "Sensitive skin",
  "Recurring flare-ups",
];

const benefits = [
  "Reduces itching naturally",
  "Heals skin inflammation",
  "Prevents flare-ups",
  "Strengthens skin barrier",
  "Addresses root causes",
  "Safe for all ages",
  "No steroid side effects",
  "Improves skin texture",
];

export default function EczemaHomeopathyPage() {
  return (
    <div className="pt-24">
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pratimaagale.in" },
          { name: "Eczema Homeopathy Kalyan", item: "https://pratimaagale.in/eczema-homeopathy-kalyan" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eczemaConditionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eczemaTherapySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eczemaFaqSchema) }}
      />

      {/* Hero Section */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">✨</div>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}
          >
            Eczema Homeopathy in Kalyan
            <span className="block italic text-sage-500">Natural Skin Healing</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Dr. Pratima Agale (BHMS, MD Homeopathy) offers individualized homeopathic treatment for eczema,
            atopic dermatitis, skin allergies, and itching. Natural remedies without side effects.
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
            Common Eczema Symptoms
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
            Benefits of Homeopathic Eczema Treatment
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
            {eczemaFaqSchema.mainEntity.map((faq: any, index: number) => (
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
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified healthcare provider with any questions you may have regarding eczema or any medical condition.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Heal Your Skin Naturally
          </h2>
          <p className="text-sage-100 mb-6">
            Book a consultation with Dr. Pratima Agale for personalized homeopathic eczema treatment.
          </p>
          <a
            href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20an%20eczema%20consultation%20with%20Dr.%20Pratima%20Agale."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Book Eczema Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
