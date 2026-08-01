import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Chronic Disease Homeopathy Kalyan | Arthritis, Migraine, Skin, IBS – Dr. Pratima Agale MD",
  description:
    "Dr. Pratima Agale (BHMS, MD Homeopathy) — expert homeopathic treatment for chronic diseases in Kalyan. Arthritis, migraines, IBS, psoriasis, eczema, anxiety, asthma, sinusitis & more. Natural, lasting relief without side effects. Serving Kalyan, Thane & Mumbai.",
  keywords: [
    // Arthritis & joint
    "arthritis homeopathy kalyan",
    "joint pain homeopathy kalyan",
    "rheumatoid arthritis homeopathy kalyan",
    "knee pain homeopathy kalyan",
    "gout homeopathy treatment kalyan",

    // Migraine & headache
    "migraine homeopathy kalyan",
    "chronic headache homeopathy kalyan",
    "migraine doctor homeopathy mumbai",
    "migraine without tablets homeopathy",

    // Digestive
    "IBS homeopathy kalyan",
    "irritable bowel homeopathy kalyan",
    "acidity homeopathy kalyan",
    "colitis homeopathy treatment",
    "digestive problem homeopathy kalyan",
    "constipation homeopathy kalyan",

    // Skin
    "psoriasis homeopathy kalyan",
    "eczema homeopathy kalyan",
    "skin disease homeopathy kalyan",
    "chronic urticaria homeopathy",
    "vitiligo homeopathy kalyan",
    "acne homeopathy treatment kalyan",

    // Respiratory
    "asthma homeopathy kalyan",
    "sinusitis homeopathy kalyan",
    "chronic cough homeopathy kalyan",
    "allergic rhinitis homeopathy kalyan",
    "breathing problem homeopathy kalyan",

    // Mental health
    "anxiety homeopathy kalyan",
    "stress homeopathy kalyan",
    "insomnia homeopathy kalyan",
    "depression support homeopathy kalyan",
    "panic attack homeopathy treatment",

    // Diabetes & general
    "diabetes homeopathy support kalyan",
    "kidney stone homeopathy kalyan",
    "piles homeopathy kalyan",
    "varicose veins homeopathy",
    "weight loss homeopathy kalyan",

    // General location
    "chronic disease homeopathy doctor kalyan",
    "homeopathy doctor for chronic illness kalyan",
    "best homeopathy for chronic disease mumbai",

    // Marathi / Hindi
    "संधिवात होमिओपॅथी कल्याण",
    "मायग्रेन होमिओपॅथी कल्याण",
    "त्वचा रोग होमिओपॅथी कल्याण",
    "गठिया होम्योपैथी कल्याण",
  ],
  openGraph: {
    title: "Chronic Disease Homeopathy in Kalyan | Arthritis, Migraine, Skin – Dr. Pratima Agale MD",
    description:
      "Natural homeopathic treatment for chronic diseases in Kalyan. Arthritis, migraine, IBS, psoriasis, anxiety & more. MD-qualified doctor.",
    url: "https://www.pratimaagale.in/services/chronic-disease",
  },
  alternates: { canonical: "https://www.pratimaagale.in/services/chronic-disease" },
};

// ─── JSON-LD: Chronic Disease Service ────────────────────────────────────────
const chronicSchema = {
  "@context": "https://schema.org",
  "@type": "MedicalWebPage",
  name: "Chronic Disease Homeopathy Treatment – Dr. Pratima Agale Kalyan",
  description:
    "Homeopathic treatment for arthritis, migraines, IBS, psoriasis, eczema, anxiety, asthma, and other chronic conditions in Kalyan, Thane and Mumbai.",
  url: "https://www.pratimaagale.in/services/chronic-disease",
  about: [
    { "@type": "MedicalCondition", name: "Rheumatoid Arthritis" },
    { "@type": "MedicalCondition", name: "Migraine" },
    { "@type": "MedicalCondition", name: "Irritable Bowel Syndrome" },
    { "@type": "MedicalCondition", name: "Psoriasis" },
    { "@type": "MedicalCondition", name: "Eczema" },
    { "@type": "MedicalCondition", name: "Anxiety Disorder" },
    { "@type": "MedicalCondition", name: "Asthma" },
    { "@type": "MedicalCondition", name: "Sinusitis" },
  ],
  author: {
    "@type": "Physician",
    name: "Dr. Pratima Agale",
    hasCredential: ["BHMS", "MD Homeopathy"],
  },
};

const diseases = [
  {
    emoji: "🦴",
    title: "Arthritis & Joint Disorders",
    types: ["Rheumatoid Arthritis", "Osteoarthritis", "Gout"],
    desc: "Homeopathy reduces joint inflammation, improves mobility, and addresses the autoimmune component of rheumatoid arthritis without the side effects of NSAIDs or steroids.",
  },
  {
    emoji: "🧠",
    title: "Chronic Migraines & Headaches",
    types: ["Migraine with aura", "Tension headaches", "Cluster headaches"],
    desc: "Constitutional treatment identifies your unique migraine triggers and addresses the underlying nervous system sensitivity. Many patients see dramatic reduction in frequency and severity.",
  },
  {
    emoji: "🫃",
    title: "Digestive Disorders",
    types: ["IBS", "Acid Reflux / GERD", "Colitis", "Food sensitivities"],
    desc: "The gut-mind connection is central to homeopathy. We address stress responses, food intolerances, and bowel dysfunction through remedies that work on the whole digestive system.",
  },
  {
    emoji: "✨",
    title: "Chronic Skin Conditions",
    types: ["Psoriasis", "Eczema / Dermatitis", "Chronic urticaria", "Acne"],
    desc: "Skin conditions often reflect internal imbalances. Homeopathy addresses the root hormonal, immune, or stress-related causes rather than applying topical suppression.",
  },
  {
    emoji: "🫁",
    title: "Respiratory Conditions",
    types: ["Chronic asthma", "Sinusitis", "Allergic rhinitis", "Frequent bronchitis"],
    desc: "Build your respiratory immunity from within. Homeopathy reduces bronchial hypersensitivity, reduces mucus overproduction, and strengthens lung defenses.",
  },
  {
    emoji: "💆",
    title: "Anxiety & Stress-Related Disorders",
    types: ["Generalized anxiety", "Panic attacks", "Insomnia", "Depression support"],
    desc: "Mental health responds profoundly to individualized homeopathic treatment. We treat the whole mental-emotional picture safely, without habit-forming medications.",
  },
];

export default function ChronicDiseasePage() {
  return (
    <div className="pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chronicSchema) }}
      />

      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">💚</div>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}
          >
            Chronic Disease Homeopathy in Kalyan
            <span className="block italic text-sage-500">Natural, Lasting Relief — No Side Effects</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Dr. Pratima Agale (BHMS, MD Homeopathy) treats chronic conditions at their root cause —
            arthritis, migraines, IBS, skin disorders, anxiety, asthma and more. Serving patients
            across Kalyan, Thane and Mumbai.
          </p>
        </div>
      </section>

      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {diseases.map((d) => (
            <div
              key={d.title}
              className="rounded-2xl border shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 overflow-hidden"
              style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
            >
              <div className="p-7">
                <div className="text-4xl mb-4">{d.emoji}</div>
                <h2
                  className="font-serif text-xl mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
                >
                  {d.title}
                </h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)" }}>{d.desc}</p>
                <div className="space-y-2">
                  {d.types.map((t) => (
                    <div key={t} className="flex items-center gap-2 text-xs rounded-lg px-3 py-1.5" style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}>
                      <CheckCircle className="w-3.5 h-3.5 text-sage-400" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-7 pb-7">
                <a
                  href={`https://wa.me/917045532232?text=${encodeURIComponent(`Hello, I would like to consult for ${d.title} with Dr. Pratima Agale.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sage-600 hover:text-sage-800 font-medium text-sm transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                  Consult for {d.title.split(" ")[0]}
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Break Free from Chronic Disease — Naturally
          </h2>
          <p className="text-sage-100 mb-6">
            Dr. Pratima Agale (MD Homeopathy) has helped hundreds of patients in Kalyan and Mumbai
            achieve lasting relief from chronic illness through personalized homeopathic treatment.
          </p>
          <a
            href="https://wa.me/917045532232?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Pratima%20Agale."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
          >
            Book Consultation
          </a>
        </div>
      </section>
    </div>
  );
}