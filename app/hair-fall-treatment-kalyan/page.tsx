import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Hair Fall Treatment Kalyan | Natural Homeopathy – Dr. Pratima Agale MD",
  description: "Dr. Pratima Agale (BHMS, MD Homeopathy) — expert hair fall treatment in Kalyan. Natural homeopathic remedies for hair loss, alopecia, dandruff & scalp health. Lady homeopathy specialist serving Kalyan, Dombivli, Thane & Mumbai.",
  keywords: [
    "hair fall treatment kalyan",
    "hair loss homeopathy kalyan",
    "alopecia homeopathy kalyan",
    "hair fall homeopathy doctor kalyan",
    "dandruff treatment homeopathy",
    "hair thinning homeopathy",
    "hair growth homeopathy",
    "hair fall after delivery homeopathy",
    "PCOS hair loss homeopathy",
    "thyroid hair loss homeopathy",
    "female hair loss treatment kalyan",
    "male pattern baldness homeopathy",
    "hair fall natural treatment kalyan",
    "hair fall homeopathy specialist thane",
  ],
  alternates: { canonical: "https://www.pratimaagale.in/hair-fall-treatment-kalyan" },
  openGraph: {
    title: "Hair Fall Treatment Kalyan | Natural Homeopathy – Dr. Pratima Agale MD",
    description: "Natural homeopathic treatment for hair loss, alopecia, dandruff and scalp conditions by MD-qualified lady homeopathy doctor in Kalyan.",
    url: "https://www.pratimaagale.in/hair-fall-treatment-kalyan",
  },
};

// ─── JSON-LD: MedicalCondition ───────────────────────────────────────────────
const hairFallConditionSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalCondition",
  name: "Hair Loss (Alopecia)",
  description: "A condition characterized by excessive hair loss from the scalp or body, which can be caused by genetics, hormonal changes, medical conditions, or medications.",
  alternateName: ["Alopecia", "Hair Thinning", "Baldness"],
  typicalTest: {
    "@type": "MedicalTest",
    name: "Scalp examination, blood tests for iron, thyroid, hormones",
  },
  riskFactor: [
    "Genetics",
    "Hormonal changes",
    "Stress",
    "Nutritional deficiencies",
    "Medical conditions",
  ],
  signOrSymptom: [
    "Gradual thinning on top of head",
    "Circular bald patches",
    "Sudden loosening of hair",
    "Full-body hair loss",
    "Scaling patches on scalp",
  ],
};

// ─── JSON-LD: MedicalTherapy ───────────────────────────────────────────────────
const hairFallTherapySchema = {
  "@context": "https://schema.org",
  "@type": "MedicalTherapy",
  name: "Homeopathic Treatment for Hair Loss",
  description: "Individualized homeopathic remedies to address root causes of hair loss, strengthen hair follicles, and promote natural hair regrowth without side effects.",
  howItWorks: "Homeopathy addresses underlying causes like hormonal imbalance, stress, nutritional deficiencies, and genetic predisposition to stimulate natural hair growth.",
  indication: [
    {
      "@type": "MedicalIndication",
      name: "Androgenetic alopecia",
    },
    {
      "@type": "MedicalIndication",
      name: "Alopecia areata",
    },
    {
      "@type": "MedicalIndication",
      name: "Telogen effluvium",
    },
  ],
};

// ─── JSON-LD: FAQPage ───────────────────────────────────────────────────────
const hairFallFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can homeopathy regrow hair?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Homeopathy can help stimulate hair regrowth by addressing underlying causes like hormonal imbalance, stress, and nutritional deficiencies. Results vary by individual and depend on the type and duration of hair loss.",
      },
    },
    {
      "@type": "Question",
      name: "How long does hair fall homeopathy treatment take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Hair fall treatment typically requires 3-12 months of consistent homeopathic care. The duration depends on the type of hair loss, underlying causes, and individual response to treatment.",
      },
    },
    {
      "@type": "Question",
      name: "Can homeopathy treat PCOS-related hair loss?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Homeopathy addresses the hormonal imbalances associated with PCOS that cause hair loss, helping restore natural hair growth alongside PCOS treatment.",
      },
    },
    {
      "@type": "Question",
      name: "What homeopathic remedies are used for hair fall?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common remedies include Acid Phos, Silicea, Natrum Mur, Lycopodium, and Thuja — selected based on your unique symptom picture, constitution, and underlying causes of hair loss.",
      },
    },
    {
      "@type": "Question",
      name: "Is homeopathy effective for male pattern baldness?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Homeopathy can help slow down male pattern baldness and improve hair quality, especially when started early. While complete reversal may not always be possible, significant improvement is often achievable.",
      },
    },
  ],
};

const causes = [
  "Hormonal imbalance (PCOS, thyroid)",
  "Stress and anxiety",
  "Nutritional deficiencies",
  "Genetic predisposition",
  "Post-pregnancy hair loss",
  "Dandruff and scalp infections",
  "Medication side effects",
  "Aging",
];

const benefits = [
  "Strengthens hair follicles",
  "Reduces hair fall naturally",
  "Promotes new hair growth",
  "Improves scalp health",
  "Addresses root causes",
  "No side effects",
  "Safe for long-term use",
  "Improves hair texture",
];

export default function HairFallTreatmentPage() {
  return (
    <div className="pt-24">
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://www.pratimaagale.in" },
          { name: "Hair Fall Treatment Kalyan", item: "https://www.pratimaagale.in/hair-fall-treatment-kalyan" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hairFallConditionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hairFallTherapySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hairFallFaqSchema) }}
      />

      {/* Hero Section */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">💇</div>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}
          >
            Hair Fall Treatment in Kalyan
            <span className="block italic text-sage-500">Natural Hair Regrowth</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Dr. Pratima Agale (BHMS, MD Homeopathy) offers individualized homeopathic treatment for hair loss,
            alopecia, dandruff, and scalp conditions. Natural remedies without side effects.
            Serving Kalyan, Dombivli, Thane & Mumbai.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2 rounded-full text-sm font-medium border border-green-200 mt-6">
            <Shield className="w-4 h-4" />
            100% Natural & Side-Effect Free
          </div>
        </div>
      </section>

      {/* Causes Section */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-serif text-3xl mb-8 text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            Common Causes of Hair Fall
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {causes.map((cause) => (
              <div
                key={cause}
                className="rounded-xl p-4 text-center border"
                style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
              >
                <CheckCircle className="w-5 h-5 text-sage-500 mx-auto mb-2" />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{cause}</span>
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
            Benefits of Homeopathic Hair Treatment
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
            {hairFallFaqSchema.mainEntity.map((faq: any, index: number) => (
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
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified healthcare provider with any questions you may have regarding hair loss or any medical condition.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Restore Your Hair Naturally
          </h2>
          <p className="text-sage-100 mb-6">
            Book a consultation with Dr. Pratima Agale for personalized homeopathic hair fall treatment.
          </p>
          <a
            href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20a%20hair%20fall%20consultation%20with%20Dr.%20Pratima%20Agale."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Book Hair Fall Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
