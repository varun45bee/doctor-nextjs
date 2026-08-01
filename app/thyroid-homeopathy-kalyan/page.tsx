import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Thyroid Homeopathy Kalyan | Natural Treatment – Dr. Pratima Agale MD",
  description: "Dr. Pratima Agale (BHMS, MD Homeopathy) — expert thyroid homeopathy treatment in Kalyan. Natural remedies for hypothyroidism, hyperthyroidism, weight gain & fatigue. Lady homeopathy specialist serving Kalyan, Dombivli, Thane & Mumbai.",
  keywords: [
    "thyroid homeopathy kalyan",
    "hypothyroidism homeopathy kalyan",
    "hyperthyroidism homeopathy kalyan",
    "thyroid treatment homeopathy mumbai",
    "thyroid weight loss homeopathy",
    "thyroid fatigue treatment",
    "homeopathy for thyroid without medicine",
    "thyroid homeopathy doctor kalyan",
    "lady doctor thyroid kalyan",
    "female homeopathy doctor thyroid",
    "thyroid natural treatment kalyan",
    "thyroid homeopathy specialist thane",
    "थायरॉईड होमिओपॅथी कल्याण",
  ],
  alternates: { canonical: "https://www.pratimaagale.in/thyroid-homeopathy-kalyan" },
  openGraph: {
    title: "Thyroid Homeopathy Kalyan | Natural Treatment – Dr. Pratima Agale MD",
    description: "Natural homeopathic treatment for thyroid disorders, hypothyroidism, hyperthyroidism and related symptoms by MD-qualified lady homeopathy doctor in Kalyan.",
    url: "https://www.pratimaagale.in/thyroid-homeopathy-kalyan",
  },
};

// ─── JSON-LD: MedicalCondition ───────────────────────────────────────────────
const thyroidConditionSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalCondition",
  name: "Thyroid Disorder",
  description: "A condition affecting the thyroid gland, which regulates metabolism, energy, and hormonal balance. Includes hypothyroidism (underactive) and hyperthyroidism (overactive).",
  alternateName: ["Hypothyroidism", "Hyperthyroidism"],
  typicalTest: {
    "@type": "MedicalTest",
    name: "TSH, T3, T4 blood tests",
  },
  riskFactor: [
    "Family history",
    "Autoimmune conditions",
    "Gender (more common in women)",
    "Age",
  ],
  signOrSymptom: [
    "Fatigue",
    "Weight changes",
    "Hair thinning",
    "Temperature sensitivity",
    "Mood changes",
  ],
};

// ─── JSON-LD: MedicalTherapy ───────────────────────────────────────────────────
const thyroidTherapySchema = {
  "@context": "https://schema.org",
  "@type": "MedicalTherapy",
  name: "Homeopathic Treatment for Thyroid Disorders",
  description: "Individualized homeopathic remedies to restore thyroid function naturally, balance hormones, and address underlying causes without side effects.",
  howItWorks: "Homeopathy stimulates the body's self-regulatory mechanisms to restore normal thyroid function and hormonal balance.",
  indication: [
    {
      "@type": "MedicalIndication",
      name: "Hypothyroidism",
    },
    {
      "@type": "MedicalIndication",
      name: "Hyperthyroidism",
    },
    {
      "@type": "MedicalIndication",
      name: "Thyroid nodules",
    },
  ],
};

// ─── JSON-LD: FAQPage ───────────────────────────────────────────────────────
const thyroidFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can homeopathy cure thyroid problems permanently?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Homeopathy can help manage thyroid disorders effectively by addressing the root cause. Many patients experience significant improvement in symptoms and thyroid function with consistent treatment. Results vary by individual.",
      },
    },
    {
      "@type": "Question",
      name: "How long does thyroid homeopathy treatment take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Thyroid treatment typically requires 6-18 months of consistent homeopathic care. The duration depends on severity, duration of the condition, and individual response to treatment.",
      },
    },
    {
      "@type": "Question",
      name: "Can I take homeopathy with thyroid medication?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Homeopathy can be taken alongside conventional thyroid medication. As your condition improves, your doctor may adjust medication dosage under medical supervision.",
      },
    },
    {
      "@type": "Question",
      name: "What homeopathic remedies are used for thyroid?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common remedies include Thyroidinum, Iodum, Natrum Mur, Calcarea Carb, and Lycopodium — selected based on your unique symptom picture, constitution, and thyroid test results.",
      },
    },
    {
      "@type": "Question",
      name: "Does homeopathy help with thyroid weight gain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Homeopathy addresses the metabolic and hormonal aspects of thyroid dysfunction that contribute to weight changes, helping restore natural metabolic function.",
      },
    },
  ],
};

const symptoms = [
  "Unexplained weight gain or loss",
  "Fatigue and low energy",
  "Hair thinning or hair loss",
  "Temperature sensitivity",
  "Mood swings and depression",
  "Dry skin and brittle nails",
  "Irregular menstrual cycles",
  "Muscle weakness and aches",
];

const benefits = [
  "Restores natural thyroid function",
  "Balances TSH, T3, T4 levels",
  "Improves energy and vitality",
  "Regulates weight naturally",
  "Reduces hair loss",
  "Improves mood and mental clarity",
  "Supports hormonal balance",
  "Safe for long-term use",
];

export default function ThyroidHomeopathyPage() {
  return (
    <div className="pt-24">
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://www.pratimaagale.in" },
          { name: "Thyroid Homeopathy Kalyan", item: "https://www.pratimaagale.in/thyroid-homeopathy-kalyan" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(thyroidConditionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(thyroidTherapySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(thyroidFaqSchema) }}
      />

      {/* Hero Section */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🦋</div>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}
          >
            Thyroid Homeopathy in Kalyan
            <span className="block italic text-sage-500">Natural Thyroid Balance</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Dr. Pratima Agale (BHMS, MD Homeopathy) offers individualized homeopathic treatment for thyroid
            disorders, hypothyroidism, hyperthyroidism, and related symptoms. Natural remedies without side effects.
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
            Common Thyroid Symptoms
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
            Benefits of Homeopathic Thyroid Treatment
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
            {thyroidFaqSchema.mainEntity.map((faq: any, index: number) => (
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
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified healthcare provider with any questions you may have regarding thyroid disorders or any medical condition.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Restore Your Thyroid Balance Naturally
          </h2>
          <p className="text-sage-100 mb-6">
            Book a consultation with Dr. Pratima Agale for personalized homeopathic thyroid treatment.
          </p>
          <a
            href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20a%20thyroid%20consultation%20with%20Dr.%20Pratima%20Agale."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Book Thyroid Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
