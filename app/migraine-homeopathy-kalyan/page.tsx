import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Migraine Homeopathy Kalyan | Natural Treatment – Dr. Pratima Agale MD",
  description: "Dr. Pratima Agale (BHMS, MD Homeopathy) — expert migraine homeopathy treatment in Kalyan. Natural remedies for chronic headaches, migraine triggers & pain relief. Lady homeopathy specialist serving Kalyan, Dombivli, Thane & Mumbai.",
  keywords: [
    "migraine homeopathy kalyan",
    "migraine treatment homeopathy",
    "chronic headache homeopathy kalyan",
    "migraine doctor homeopathy mumbai",
    "migraine without tablets homeopathy",
    "cluster headache homeopathy",
    "migraine pain relief homeopathy",
    "migraine homeopathy doctor kalyan",
    "lady doctor migraine kalyan",
    "female homeopathy doctor migraine",
    "migraine natural treatment kalyan",
    "migraine homeopathy specialist thane",
    "मायग्रेन होमिओपॅथी कल्याण",
  ],
  alternates: { canonical: "https://pratimaagale.in/migraine-homeopathy-kalyan" },
  openGraph: {
    title: "Migraine Homeopathy Kalyan | Natural Treatment – Dr. Pratima Agale MD",
    description: "Natural homeopathic treatment for migraines, chronic headaches and pain relief by MD-qualified lady homeopathy doctor in Kalyan.",
    url: "https://pratimaagale.in/migraine-homeopathy-kalyan",
  },
};

// ─── JSON-LD: MedicalCondition ───────────────────────────────────────────────
const migraineConditionSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalCondition",
  name: "Migraine",
  description: "A neurological condition characterized by intense, debilitating headaches often accompanied by nausea, vomiting, and sensitivity to light and sound.",
  alternateName: ["Chronic Migraine", "Migraine Headache"],
  typicalTest: {
    "@type": "MedicalTest",
    name: "Neurological examination, MRI, CT scan",
  },
  riskFactor: [
    "Family history",
    "Stress",
    "Hormonal changes",
    "Sensory stimuli",
    "Sleep changes",
  ],
  signOrSymptom: [
    "Severe headache",
    "Nausea and vomiting",
    "Light sensitivity",
    "Sound sensitivity",
    "Visual disturbances",
  ],
};

// ─── JSON-LD: MedicalTherapy ───────────────────────────────────────────────────
const migraineTherapySchema = {
  "@context": "https://schema.org",
  "@type": "MedicalTherapy",
  name: "Homeopathic Treatment for Migraine",
  description: "Individualized homeopathic remedies to reduce migraine frequency, intensity, and duration by addressing underlying triggers and nervous system sensitivity.",
  howItWorks: "Homeopathy works by addressing the individual's unique migraine triggers, constitutional predisposition, and nervous system sensitivity to prevent and reduce migraine attacks.",
  indication: [
    {
      "@type": "MedicalIndication",
      name: "Migraine with aura",
    },
    {
      "@type": "MedicalIndication",
      name: "Chronic migraine",
    },
    {
      "@type": "MedicalIndication",
      name: "Tension headache",
    },
  ],
};

// ─── JSON-LD: FAQPage ───────────────────────────────────────────────────────
const migraineFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can homeopathy cure migraines permanently?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Homeopathy can significantly reduce migraine frequency, intensity, and duration by addressing underlying triggers and constitutional predisposition. While individual results vary, many patients experience long-term relief with consistent treatment.",
      },
    },
    {
      "@type": "Question",
      name: "How long does migraine homeopathy treatment take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Migraine treatment typically requires 6-12 months of consistent homeopathic care. The duration depends on chronicity, frequency of attacks, and individual response to treatment.",
      },
    },
    {
      "@type": "Question",
      name: "Can homeopathy be taken with migraine medication?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Homeopathy can be taken alongside conventional migraine medication. As your condition improves, you may reduce dependency on pain medication under medical supervision.",
      },
    },
    {
      "@type": "Question",
      name: "What homeopathic remedies are used for migraines?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common remedies include Belladonna, Sanguinaria, Spigelia, Natrum Mur, and Iris Versicolor — selected based on your unique migraine triggers, symptoms, and constitution.",
      },
    },
    {
      "@type": "Question",
      name: "Does homeopathy help with migraine triggers?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Homeopathy addresses the underlying sensitivity to migraine triggers like stress, hormonal changes, and environmental factors, helping reduce overall migraine susceptibility.",
      },
    },
  ],
};

const triggers = [
  "Stress and anxiety",
  "Hormonal changes",
  "Sleep disturbances",
  "Food sensitivities",
  "Environmental factors",
  "Weather changes",
  "Physical exertion",
  "Sensory stimuli",
];

const benefits = [
  "Reduces migraine frequency",
  "Decreases pain intensity",
  "Shortens attack duration",
  "Addresses root triggers",
  "No side effects",
  "Reduces medication dependency",
  "Improves quality of life",
  "Prevents recurrence",
];

export default function MigraineHomeopathyPage() {
  return (
    <div className="pt-24">
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://pratimaagale.in" },
          { name: "Migraine Homeopathy Kalyan", item: "https://pratimaagale.in/migraine-homeopathy-kalyan" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migraineConditionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migraineTherapySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(migraineFaqSchema) }}
      />

      {/* Hero Section */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🧠</div>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}
          >
            Migraine Homeopathy in Kalyan
            <span className="block italic text-sage-500">Natural Pain Relief</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Dr. Pratima Agale (BHMS, MD Homeopathy) offers individualized homeopathic treatment for migraines,
            chronic headaches, and pain relief. Natural remedies without side effects.
            Serving Kalyan, Dombivli, Thane & Mumbai.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2 rounded-full text-sm font-medium border border-green-200 mt-6">
            <Shield className="w-4 h-4" />
            100% Natural & Side-Effect Free
          </div>
        </div>
      </section>

      {/* Triggers Section */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="font-serif text-3xl mb-8 text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            Common Migraine Triggers
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {triggers.map((trigger) => (
              <div
                key={trigger}
                className="rounded-xl p-4 text-center border"
                style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
              >
                <CheckCircle className="w-5 h-5 text-sage-500 mx-auto mb-2" />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{trigger}</span>
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
            Benefits of Homeopathic Migraine Treatment
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
            {migraineFaqSchema.mainEntity.map((faq: any, index: number) => (
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
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified healthcare provider with any questions you may have regarding migraines or any medical condition.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Find Relief from Migraines Naturally
          </h2>
          <p className="text-sage-100 mb-6">
            Book a consultation with Dr. Pratima Agale for personalized homeopathic migraine treatment.
          </p>
          <a
            href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20a%20migraine%20consultation%20with%20Dr.%20Pratima%20Agale."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Book Migraine Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
