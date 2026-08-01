import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";

export const metadata: Metadata = {
  title: "Arthritis Homeopathy Kalyan | Natural Treatment – Dr. Pratima Agale MD",
  description: "Dr. Pratima Agale (BHMS, MD Homeopathy) — expert arthritis homeopathy treatment in Kalyan. Natural remedies for joint pain, osteoarthritis, rheumatoid arthritis & inflammation. Lady homeopathy specialist serving Kalyan, Dombivli, Thane & Mumbai.",
  keywords: [
    "arthritis homeopathy kalyan",
    "joint pain homeopathy kalyan",
    "osteoarthritis homeopathy",
    "rheumatoid arthritis homeopathy",
    "arthritis treatment homeopathy mumbai",
    "knee pain homeopathy kalyan",
    "joint inflammation homeopathy",
    "arthritis homeopathy doctor kalyan",
    "lady doctor arthritis kalyan",
    "female homeopathy doctor arthritis",
    "arthritis natural treatment kalyan",
    "arthritis homeopathy specialist thane",
    "गठिया होमिओपॅथी कल्याण",
  ],
  alternates: { canonical: "https://www.pratimaagale.in/arthritis-homeopathy-kalyan" },
  openGraph: {
    title: "Arthritis Homeopathy Kalyan | Natural Treatment – Dr. Pratima Agale MD",
    description: "Natural homeopathic treatment for arthritis, joint pain, osteoarthritis and rheumatoid arthritis by MD-qualified lady homeopathy doctor in Kalyan.",
    url: "https://www.pratimaagale.in/arthritis-homeopathy-kalyan",
  },
};

// ─── JSON-LD: MedicalCondition ───────────────────────────────────────────────
const arthritisConditionSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalCondition",
  name: "Arthritis",
  description: "A condition characterized by inflammation of one or more joints, causing pain, stiffness, and reduced mobility. Common types include osteoarthritis and rheumatoid arthritis.",
  alternateName: ["Joint Pain", "Osteoarthritis", "Rheumatoid Arthritis"],
  typicalTest: {
    "@type": "MedicalTest",
    name: "X-ray, MRI, blood tests (RF, ESR)",
  },
  riskFactor: [
    "Age",
    "Family history",
    "Obesity",
    "Joint injuries",
    "Autoimmune conditions",
  ],
  signOrSymptom: [
    "Joint pain",
    "Stiffness",
    "Swelling",
    "Reduced mobility",
    "Redness and warmth",
  ],
};

// ─── JSON-LD: MedicalTherapy ───────────────────────────────────────────────────
const arthritisTherapySchema = {
  "@context": "https://schema.org",
  "@type": "MedicalTherapy",
  name: "Homeopathic Treatment for Arthritis",
  description: "Individualized homeopathic remedies to reduce joint inflammation, alleviate pain, and improve mobility by addressing underlying causes without side effects.",
  howItWorks: "Homeopathy addresses the underlying inflammatory processes, genetic predisposition, and constitutional factors that contribute to arthritis to promote joint health naturally.",
  indication: [
    {
      "@type": "MedicalIndication",
      name: "Osteoarthritis",
    },
    {
      "@type": "MedicalIndication",
      name: "Rheumatoid arthritis",
    },
    {
      "@type": "MedicalIndication",
      name: "Gouty arthritis",
    },
  ],
};

// ─── JSON-LD: FAQPage ───────────────────────────────────────────────────────
const arthritisFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Can homeopathy cure arthritis permanently?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Homeopathy can significantly reduce arthritis symptoms, improve joint mobility, and slow disease progression by addressing underlying causes. While individual results vary, many patients experience long-term relief with consistent treatment.",
      },
    },
    {
      "@type": "Question",
      name: "How long does arthritis homeopathy treatment take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Arthritis treatment typically requires 6-18 months of consistent homeopathic care. The duration depends on type, severity, and individual response to treatment.",
      },
    },
    {
      "@type": "Question",
      name: "Can homeopathy be taken with arthritis medication?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Homeopathy can be taken alongside conventional arthritis medication. As your condition improves, you may reduce dependency on pain medication under medical supervision.",
      },
    },
    {
      "@type": "Question",
      name: "What homeopathic remedies are used for arthritis?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Common remedies include Rhus Tox, Bryonia, Calcarea Carb, Arnica, and Ledum Pal — selected based on your unique symptom picture, joint affected, and underlying causes.",
      },
    },
    {
      "@type": "Question",
      name: "Does homeopathy help with knee pain?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Homeopathy addresses the underlying inflammation, cartilage degeneration, and constitutional factors that cause knee pain, providing relief and improving joint function.",
      },
    },
  ],
};

const symptoms = [
  "Joint pain and stiffness",
  "Swelling and inflammation",
  "Reduced range of motion",
  "Redness and warmth",
  "Morning stiffness",
  "Fatigue",
  "Weakness in joints",
  "Difficulty walking",
];

const benefits = [
  "Reduces joint inflammation",
  "Alleviates pain naturally",
  "Improves joint mobility",
  "Strengthens cartilage",
  "Addresses root causes",
  "No side effects",
  "Reduces medication dependency",
  "Improves quality of life",
];

export default function ArthritisHomeopathyPage() {
  return (
    <div className="pt-24">
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://www.pratimaagale.in" },
          { name: "Arthritis Homeopathy Kalyan", item: "https://www.pratimaagale.in/arthritis-homeopathy-kalyan" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(arthritisConditionSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(arthritisTherapySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(arthritisFaqSchema) }}
      />

      {/* Hero Section */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🦴</div>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}
          >
            Arthritis Homeopathy in Kalyan
            <span className="block italic text-sage-500">Natural Joint Relief</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Dr. Pratima Agale (BHMS, MD Homeopathy) offers individualized homeopathic treatment for arthritis,
            joint pain, osteoarthritis, and rheumatoid arthritis. Natural remedies without side effects.
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
            Common Arthritis Symptoms
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
            Benefits of Homeopathic Arthritis Treatment
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
            {arthritisFaqSchema.mainEntity.map((faq: any, index: number) => (
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
            <strong>Medical Disclaimer:</strong> This information is for educational purposes only and is not intended to replace professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or qualified healthcare provider with any questions you may have regarding arthritis or any medical condition.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Relieve Joint Pain Naturally
          </h2>
          <p className="text-sage-100 mb-6">
            Book a consultation with Dr. Pratima Agale for personalized homeopathic arthritis treatment.
          </p>
          <a
            href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20an%20arthritis%20consultation%20with%20Dr.%20Pratima%20Agale."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Book Arthritis Consultation
          </a>
        </div>
      </section>
    </div>
  );
}
