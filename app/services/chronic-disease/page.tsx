import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Chronic Disease Management | Arthritis, Migraines, Digestive Homeopathy Kalyan",
  description:
    "Homeopathic management of chronic diseases — arthritis, migraines, IBS, skin disorders, anxiety in Kalyan, Andheri, Mumbai. Dr. Pratima Agale BHMS MD. Natural, safe, long-lasting relief.",
  keywords: [
    "arthritis homeopathy kalyan",
    "migraine homeopathy mumbai",
    "IBS homeopathy treatment",
    "chronic disease homeopathy",
    "skin disorder homeopathy",
    "anxiety homeopathy kalyan",
  ],
};

const diseases = [
  { emoji: "🦴", title: "Arthritis & Joint Disorders", types: ["Rheumatoid Arthritis", "Osteoarthritis", "Gout"], desc: "Homeopathy reduces joint inflammation, improves mobility, and addresses the autoimmune component of rheumatoid arthritis without the side effects of NSAIDs or steroids." },
  { emoji: "🧠", title: "Chronic Migraines & Headaches", types: ["Migraine with aura", "Tension headaches", "Cluster headaches"], desc: "Constitutional treatment identifies your unique migraine triggers and addresses the underlying nervous system sensitivity. Many patients see dramatic reduction in frequency and severity." },
  { emoji: "🫃", title: "Digestive Disorders", types: ["IBS", "Acid Reflux / GERD", "Colitis", "Food sensitivities"], desc: "The gut-mind connection is central to homeopathy. We address stress responses, food intolerances, and bowel dysfunction through remedies that work on the whole digestive system." },
  { emoji: "✨", title: "Chronic Skin Conditions", types: ["Psoriasis", "Eczema / Dermatitis", "Chronic urticaria", "Acne"], desc: "Skin conditions often reflect internal imbalances. Homeopathy addresses the root hormonal, immune, or stress-related causes rather than applying topical suppression." },
  { emoji: "🫁", title: "Respiratory Conditions", types: ["Chronic asthma", "Sinusitis", "Allergic rhinitis", "Frequent bronchitis"], desc: "Build your respiratory immunity from within. Homeopathy reduces bronchial hypersensitivity, reduces mucus overproduction, and strengthens lung defenses." },
  { emoji: "💆", title: "Anxiety & Stress-Related Disorders", types: ["Generalized anxiety", "Panic attacks", "Insomnia", "Depression support"], desc: "Mental health responds profoundly to individualized homeopathic treatment. We treat the whole mental-emotional picture safely, without habit-forming medications." },
];

export default function ChronicDiseasePage() {
  return (
    <div className="pt-24">
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
            Chronic Disease Management
            <span className="block italic text-sage-500">Natural, Lasting Relief</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Chronic conditions don't have to mean lifetime medication. Homeopathy works at the
            root level to resolve the imbalances driving your disease — giving you genuine,
            lasting improvement without side effects.
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
  href={`https://wa.me/919359875511?text=${encodeURIComponent(
    `Hello, I would like to consult for ${d.title} with Dr. Pratima Agale.`
  )}`}
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
            Reclaim Your Health from Chronic Disease
          </h2>
          <p className="text-sage-100 mb-6">
            Dr. Pratima Agale has helped hundreds of patients in Kalyan and Mumbai break free from
            chronic illness through personalized homeopathic treatment.
          </p>
          <a
            href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Pratima%20Agale."
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
