import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Patient Case Studies | Homeopathy Success Stories | Kalyan Mumbai",
  description:
    "Real homeopathy success stories from Dr. Pratima Agale's patients in Kalyan, Mumbai. PCOD reversal, child immunity, thyroid healing, migraine relief — anonymized case studies.",
  keywords: [
    "homeopathy case studies",
    "PCOD homeopathy success story",
    "thyroid cure homeopathy",
    "child immunity case study",
    "homeopathy results kalyan",
  ],
};

const cases = [
  {
    id: "CS-001",
    title: "PCOS Reversed Naturally",
    patient: "Female, 28 years",
    location: "Kalyan",
    condition: "PCOD / PCOS",
    duration: "8 months",
    color: "#fdf4f7",
    tag: "🌸 Women's Health",
    story:
      "This patient had been struggling with PCOS for 5 years — irregular periods (sometimes 90-day gaps), facial hair, weight gain, and failed IVF attempts. Conventional doctors had prescribed metformin and oral contraceptives, providing temporary relief only. After a detailed constitutional assessment, Dr. Agale prescribed Pulsatilla 200C followed by Sepia 1M over 8 months, alongside dietary guidance. By month 4, cycles regularized to 32 days. By month 8, ultrasound showed significant reduction in cyst count. The patient conceived naturally 3 months after completing treatment.",
    outcome: "Periods regularized, cyst count reduced, natural conception achieved",
    stars: 5,
  },
  {
    id: "CS-002",
    title: "A Child's Immunity Transformed",
    patient: "Male, 6 years",
    location: "Andheri",
    condition: "Recurrent Infections",
    duration: "6 months",
    color: "#f0fdf4",
    tag: "🌱 Pediatric Care",
    story:
      "A 6-year-old boy was falling sick almost every 3 weeks — tonsillitis, ear infections, and chest colds. His parents had been through multiple antibiotic courses. The child was tired, irritable, and falling behind in school. Dr. Agale took a detailed constitutional history and prescribed Calcarea Carb 200C, followed by Tuberculinum as intercurrent. Within 3 months, the frequency of infections dropped to once every 2 months. By 6 months, the child had gone 10 weeks without any infection — the longest stretch in 2 years.",
    outcome: "Infections reduced from monthly to once in 10+ weeks. Energy and school performance improved.",
    stars: 5,
  },
  {
    id: "CS-003",
    title: "Thyroid Levels Normalized",
    patient: "Female, 42 years",
    location: "Mumbai",
    condition: "Hypothyroidism",
    duration: "10 months",
    color: "#fdf8f0",
    tag: "🦋 Thyroid",
    story:
      "This patient had been on Thyroxine (50mcg) for 8 years. She felt permanently fatigued, gained 15kg, suffered hair thinning, and had brain fog. She approached Dr. Agale with a wish to reduce her synthetic hormone dependence. A complete case-taking revealed deep-seated grief and a sedentary constitution. Remedies Natrum Mur 1M and Thyroidinum were prescribed in graduated potencies. After 10 months, her TSH normalized from 7.2 to 2.8 mIU/L. Her endocrinologist reduced her Thyroxine to 25mcg. Energy returned, weight reduced by 8kg, hair recovered significantly.",
    outcome: "TSH normalized, Thyroxine dose halved, significant symptom improvement.",
    stars: 5,
  },
  {
    id: "CS-004",
    title: "Chronic Migraines — From Weekly to Gone",
    patient: "Male, 35 years",
    location: "Kalyan",
    condition: "Chronic Migraines",
    duration: "7 months",
    color: "#f5f0fd",
    tag: "💆 Chronic Disease",
    story:
      "This patient had suffered from migraines 2–3 times weekly for 7 years. He was using Sumatriptan regularly, which was affecting his liver enzymes. Triggers included stress, screen time, and barometric pressure changes. Dr. Agale prescribed Iris Versicolor 30C for acute attacks and Natrum Mur 200C constitutionally. By month 3, attacks reduced to once weekly. By month 7, he was migraine-free for 6 consecutive weeks — something he hadn't experienced in years.",
    outcome: "Migraine frequency reduced from 3/week to zero over 7 months.",
    stars: 5,
  },
  {
    id: "CS-005",
    title: "Childhood Eczema Cleared",
    patient: "Female, 4 years",
    location: "Kalyan",
    condition: "Atopic Eczema",
    duration: "5 months",
    color: "#fdf0f5",
    tag: "✨ Skin",
    story:
      "A 4-year-old girl had severe atopic eczema on her arms and face since infancy. Steroid creams gave temporary relief but the eczema kept returning, progressively worsening. The child scratched until she bled at night. Dr. Agale took careful constitutional history and prescribed Sulphur 200C followed by Graphites 1M. The initial weeks showed a brief aggravation (healing crisis) before dramatic clearing began. By month 5, the skin was clear. No steroids needed in the following year.",
    outcome: "Eczema cleared completely, steroid-free, no relapse in 12 months.",
    stars: 5,
  },
  {
    id: "CS-006",
    title: "ADHD Support Without Medication",
    patient: "Male, 9 years",
    location: "Andheri",
    condition: "ADHD",
    duration: "9 months",
    color: "#f0f5ff",
    tag: "🧠 Pediatric / ADHD",
    story:
      "Parents of a 9-year-old boy sought an alternative after their child's school recommended psychiatric evaluation and stimulant medication. The child was restless, easily distracted, emotionally explosive, and had poor concentration. Dr. Agale's constitutional assessment pointed to Stramonium and later Tuberculinum. Alongside the remedies, dietary modifications and screen time reduction were guided. Within 6 months, teachers noticed marked improvement in classroom focus. The child completed tasks independently — a first in years. No psychiatric medication was ever started.",
    outcome: "Significant focus and behavioral improvement. Drug-free management achieved.",
    stars: 5,
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="pt-24">
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #f4f7f4, #faf3e6)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6">
            Real Stories, Real Healing
          </div>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "#1e2820" }}
          >
            Patient Case Studies
          </h1>
          <p className="text-sage-700 text-lg leading-relaxed">
            Anonymized success stories from Dr. Pratima Agale's patients in Kalyan, Andheri, and Mumbai.
            These cases illustrate the power of individualized homeopathic treatment.
          </p>
          <p className="text-xs text-sage-400 mt-4">
            * All cases are anonymized. Names, identifying details, and photos are not shared to protect patient privacy.
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-10">
          {cases.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-sage-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
            >
              <div className="px-7 py-4 flex items-center justify-between border-b border-sage-50"
                style={{ backgroundColor: c.color }}>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-medium text-sage-500 bg-white/70 px-3 py-1 rounded-full">{c.id}</span>
                  <span className="text-sm font-medium text-sage-700">{c.tag}</span>
                </div>
                <div className="flex">
                  {[...Array(c.stars)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>

              <div className="p-7">
                <div className="flex flex-wrap gap-4 items-start justify-between mb-5">
                  <div>
                    <h2
                      className="font-serif text-2xl mb-1"
                      style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
                    >
                      {c.title}
                    </h2>
                    <div className="flex gap-3 text-xs text-sage-500">
                      <span>{c.patient}</span>
                      <span>·</span>
                      <span>{c.location}</span>
                      <span>·</span>
                      <span>Treatment: {c.duration}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sage-700 text-sm leading-relaxed mb-5">{c.story}</p>

                <div className="bg-sage-50 rounded-xl p-4 flex items-start gap-3">
                  <span className="text-sage-500 font-semibold text-sm whitespace-nowrap">✅ Outcome:</span>
                  <span className="text-sage-700 text-sm">{c.outcome}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Could Your Story Be Next?
          </h2>
          <p className="text-sage-100 mb-6">
            Book a consultation and let Dr. Pratima Agale create your personalized healing plan.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all"
          >
            Start Your Healing Journey <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
