import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Child Homeopathy Doctor Kalyan | Immunity, ADHD, Allergies – Dr. Pratima Agale MD",
  description:
    "Dr. Pratima Agale (BHMS, MD Homeopathy) — trusted pediatric homeopathy doctor in Kalyan. Safe, gentle treatment for child immunity, ADHD, recurrent infections, allergies, asthma & behavioral issues. No side effects. Serving Kalyan, Dombivli, Thane & Mumbai.",
  keywords: [
    // Pediatric + location
    "child homeopathy doctor kalyan",
    "pediatric homeopathy kalyan",
    "children homeopathy doctor kalyan",
    "homeopathy for kids kalyan",
    "baby homeopathy doctor kalyan",
    "child homeopathy specialist mumbai",
    "best pediatric homeopathy kalyan",

    // Immunity — most searched
    "homeopathy for child immunity kalyan",
    "recurrent fever child homeopathy kalyan",
    "recurrent tonsils homeopathy kalyan",
    "frequent cold child homeopathy",
    "homeopathy to boost immunity children",
    "child antibiotic alternative homeopathy",

    // ADHD & behavioral
    "ADHD homeopathy treatment kalyan",
    "ADHD child doctor kalyan",
    "hyperactive child homeopathy kalyan",
    "behavioral issues child homeopathy",
    "attention problem child homeopathy kalyan",
    "autism support homeopathy kalyan",

    // Allergies & asthma
    "child allergy homeopathy kalyan",
    "asthma child homeopathy kalyan",
    "dust allergy child homeopathy",
    "food allergy homeopathy kalyan",

    // Other pediatric
    "bedwetting homeopathy kalyan",
    "speech delay homeopathy kalyan",
    "stammering homeopathy child kalyan",
    "child anxiety homeopathy kalyan",
    "skin allergy child homeopathy kalyan",
    "newborn homeopathy doctor kalyan",

    // Marathi / Hindi
    "मुलांची होमिओपॅथी कल्याण",
    "बालकांसाठी होमिओपॅथी कल्याण",
    "बच्चों की होम्योपैथी कल्याण",
    "मुलांची प्रतिकारशक्ती होमिओपॅथी",
  ],
  openGraph: {
    title: "Pediatric Homeopathy Doctor Kalyan | Child Immunity, ADHD – Dr. Pratima Agale MD",
    description:
      "Safe, gentle homeopathic treatment for children in Kalyan. Expert in immunity, ADHD, allergies & recurrent infections. MD-qualified doctor.",
    url: "https://www.pratimaagale.in/services/pediatric",
  },
  alternates: { canonical: "https://www.pratimaagale.in/services/pediatric" },
};

// ─── JSON-LD: Pediatric Service ───────────────────────────────────────────────
const pediatricSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Pediatric Homeopathy Treatment – Dr. Pratima Agale Kalyan",
  description:
    "Safe, gentle homeopathic treatment for children in Kalyan — immunity building, ADHD, allergies, recurrent infections, behavioral issues and developmental support.",
  url: "https://www.pratimaagale.in/services/pediatric",
  about: [
    { "@type": "MedicalCondition", name: "Recurrent Infections in Children" },
    { "@type": "MedicalCondition", name: "ADHD" },
    { "@type": "MedicalCondition", name: "Childhood Allergies" },
    { "@type": "MedicalCondition", name: "Asthma in Children" },
    { "@type": "MedicalCondition", name: "Bedwetting" },
    { "@type": "MedicalCondition", name: "Autism Spectrum Support" },
  ],
  author: {
    "@type": "Physician",
    name: "Dr. Pratima Agale",
    hasCredential: ["BHMS", "MD Homeopathy"],
  },
};

const childConditions = [
  {
    emoji: "🛡️",
    title: "Low Immunity / Recurrent Infections",
    desc: "Children prone to frequent colds, throat infections, ear infections, and fevers benefit enormously from constitutional homeopathic treatment. Rather than suppressing each infection with antibiotics, we strengthen the child's own immune defenses for lasting protection.",
    benefits: ["Fewer sick days", "Stronger natural immunity", "Reduced need for antibiotics", "Better growth and energy"],
  },
  {
    emoji: "🧠",
    title: "ADHD & Behavioral Support",
    desc: "Homeopathy offers a side-effect-free approach to supporting children with attention difficulties, hyperactivity, and behavioral challenges. Treatment is individualized to the child's unique personality, not just their diagnosis.",
    benefits: ["Improved focus & attention", "Better emotional regulation", "Calmer behavior at home/school", "No sedation or side effects"],
  },
  {
    emoji: "🤧",
    title: "Allergies & Asthma",
    desc: "Allergic rhinitis, dust allergies, food sensitivities, and childhood asthma respond well to homeopathic desensitization. We address the immune hypersensitivity at its root.",
    benefits: ["Reduced allergic reactions", "Less dependence on antihistamines", "Better sleep quality", "Improved lung function"],
  },
  {
    emoji: "🌱",
    title: "Growth & Development",
    desc: "Homeopathy supports healthy physical and mental development. Children with delayed milestones, speech delays, or nutritional absorption issues benefit from carefully chosen constitutional remedies.",
    benefits: ["Improved appetite", "Better sleep", "Milestone support", "Emotional security"],
  },
  {
    emoji: "🎭",
    title: "Anxiety & Emotional Health",
    desc: "Separation anxiety, school phobia, bedwetting, nightmares, and childhood stress — homeopathy addresses the emotional roots of these common childhood challenges gently and effectively.",
    benefits: ["Reduced anxiety", "Better school performance", "Dry nights (bedwetting)", "Improved social confidence"],
  },
];

export default function PediatricPage() {
  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pediatricSchema) }}
      />

      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🌱</div>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}
          >
            Child Homeopathy Doctor in Kalyan
            <span className="block italic text-sage-500">Gentle, Safe Healing for Growing Bodies</span>
          </h1>
          <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
            Dr. Pratima Agale (BHMS, MD Homeopathy) is a trusted pediatric homeopathy doctor in Kalyan.
            Children's bodies are sensitive and responsive — making them ideal candidates for
            homeopathic treatment. Hundreds of children across Kalyan, Dombivli and Mumbai have
            grown stronger and healthier with her care.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2 rounded-full text-sm font-medium border border-green-200">
            <Shield className="w-4 h-4" />
            100% Safe for Newborns & Children of All Ages
          </div>
        </div>
      </section>

      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto space-y-12">
          {childConditions.map((cond) => (
            <div
              key={cond.title}
              className="rounded-2xl border shadow-sm hover:shadow-md transition-all overflow-hidden"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
            >
              <div className="grid md:grid-cols-3">
                <div className="md:col-span-2 p-8">
                  <div className="text-4xl mb-4">{cond.emoji}</div>
                  <h2
                    className="font-serif text-2xl mb-3"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
                  >
                    {cond.title}
                  </h2>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{cond.desc}</p>
                </div>
                <div className="p-8" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
                  <h3 className="font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Benefits</h3>
                  <ul className="space-y-3">
                    {cond.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                        <CheckCircle className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section
        className="py-16 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #263727, #3a5a3a)" }}
      >
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Give Your Child the Gift of Natural Health
          </h2>
          <p className="text-sage-300 mb-6">
            Dr. Pratima Agale's gentle, child-friendly approach has made her a trusted name
            for pediatric homeopathy in Kalyan, Dombivli and Mumbai.
          </p>
          <a
            href="https://wa.me/917045532232?text=Hello%2C%20I%20would%20like%20to%20book%20a%20children%27s%20consultation%20with%20Dr.%20Pratima%20Agale."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Book Children's Consultation
          </a>
        </div>
      </section>
    </div>
  );
}