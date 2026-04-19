import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, MessageCircle, Leaf, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Patient Journey | What to Expect at Dr. Pratima Agale's Clinic Kalyan",
  description:
    "Understand your complete homeopathic healing journey with Dr. Pratima Agale in Kalyan, Mumbai — from first consultation to lasting wellness. What to expect, how long treatment takes, and FAQs.",
};

const steps = [
  {
    icon: MessageCircle,
    step: "Step 1",
    title: "Initial Consultation (45–60 min)",
    desc: "Your first visit is a deep conversation. Dr. Agale listens — not just to your chief complaint, but to your complete story. Physical symptoms, emotional state, sleep patterns, food preferences, life history, stress triggers. Everything matters in homeopathy.",
    details: ["Detailed health history review", "Physical and mental symptom mapping", "Lifestyle and diet discussion", "Previous medical records review (if any)", "No judgment — every detail helps"],
    color: "var(--bg-surface-alt)",
  },
  {
    icon: Leaf,
    step: "Step 2",
    title: "Case Analysis & Remedy Selection",
    desc: "After your consultation, Dr. Agale carefully analyzes your case using classical homeopathic methodology — finding the remedy that best matches your complete 'symptom picture.' This is individualized medicine at its finest.",
    details: ["Constitutional remedy identification", "Potency selection based on sensitivity", "Treatment plan design", "Dietary & lifestyle recommendations", "Timeline estimation"],
    color: "var(--bg-base)",
  },
  {
    icon: Clock,
    step: "Step 3",
    title: "Beginning Treatment",
    desc: "You receive your personalized remedy along with clear instructions. Homeopathic remedies are gentle, pleasant to take, and safe for all ages. You begin at your own pace, in the comfort of your home.",
    details: ["Remedy dispensed (pills, drops, or powder)", "Dosage and frequency guidance", "What to expect — including initial aggravation", "Foods and substances to temporarily avoid", "Emergency contact access"],
    color: "var(--bg-surface-alt)",
  },
  {
    icon: TrendingUp,
    step: "Step 4",
    title: "Follow-up & Monitoring",
    desc: "Regular follow-ups (typically every 4–6 weeks) allow Dr. Agale to track your progress, adjust remedies, and ensure the healing is on track. Homeopathy is dynamic — your remedy may change as you improve.",
    details: ["Progress evaluation", "Remedy adjustment if needed", "Continuing lifestyle guidance", "Lab result review (if applicable)", "Celebrating milestones together"],
    color: "var(--bg-base)",
  },
];

const faqs = [
  { q: "How long does homeopathic treatment take?", a: "Acute conditions (cold, fever, minor infection) often respond within hours to days. Chronic conditions that developed over years typically need 6–18 months of consistent treatment. Results vary by individual." },
  { q: "Will I feel worse before I get better?", a: "Some patients experience a brief 'healing aggravation' — a temporary, mild intensification of symptoms. This is actually a positive sign that the remedy is working. It typically lasts a few days and is followed by significant improvement." },
  { q: "Do I have to stop my conventional medication?", a: "Never stop prescription medication without consulting your doctor. Homeopathy works alongside allopathic treatment. As you improve, your doctor may reduce medication — but this decision is always made with your conventional physician." },
  { q: "Is homeopathy safe during pregnancy?", a: "Yes — homeopathic remedies are among the safest options during pregnancy. They are used worldwide to address morning sickness, fatigue, emotional changes, and preparation for labor. Always inform Dr. Agale of your pregnancy." },
  { q: "Can children take homeopathic remedies?", a: "Absolutely. Homeopathy is ideal for children — the remedies are sweet, easy to take, and completely non-toxic. They are safe from birth." },
  { q: "What should I avoid during treatment?", a: "Coffee, strong mint (toothpaste, chewing gum), camphor, and some essential oils can antidote remedies. Dr. Agale will provide specific guidance based on your prescribed remedy." },
];

export default function PatientJourneyPage() {
  return (
    <div className="pt-24">
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}
          >
            Your Healing Journey
            <span className="block italic text-sage-500">Step by Step</span>
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Starting homeopathic treatment is an act of trust in your body's own healing power.
            Here's exactly what to expect when you begin care with Dr. Pratima Agale in Kalyan.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto">
          {steps.map((step, i) => (
            <div
              key={step.step}
              className={`flex flex-col md:flex-row gap-10 items-start mb-16 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div
                className="md:w-1/2 rounded-2xl p-8 min-h-48"
                style={{ backgroundColor: step.color }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-sage-500 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sage-500 text-sm font-medium tracking-widest uppercase">{step.step}</span>
                </div>
                <h2
                  className="font-serif text-2xl mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
                >
                  {step.title}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{step.desc}</p>
              </div>

              <div className="md:w-1/2">
                <ul className="space-y-4">
                  {step.details.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
                        <div className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                      </div>
                      {d}
                    </li>
                  ))}
                </ul>

                {i < steps.length - 1 && (
                  <div className="mt-8 flex items-center gap-2 text-sage-400">
                    <div className="flex-1 h-px bg-sage-100" />
                    <ArrowRight className="w-4 h-4" />
                    <span className="text-xs">then</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline expectations */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-serif text-4xl text-center mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            Typical Treatment Timelines
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { type: "Acute Conditions", time: "Days to 2 weeks", examples: "Cold, Fever, Injury, Acute infection, Stomach upset", color: "var(--bg-surface-alt)" },
              { type: "Sub-acute Conditions", time: "1–3 months", examples: "Allergies, Skin flares, Anxiety episodes, Menstrual irregularities", color: "var(--bg-surface)" },
              { type: "Chronic Conditions", time: "6–18 months", examples: "PCOD, Thyroid, Arthritis, ADHD, Eczema, Autoimmune", color: "var(--bg-surface-alt)" },
            ].map((t) => (
              <div key={t.type} className="rounded-2xl p-6 border" style={{ backgroundColor: t.color, borderColor: "var(--border-color)" }}>
                <div
                  className="font-serif text-xl mb-2"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
                >
                  {t.type}
                </div>
                <div className="text-sage-500 font-semibold text-sm mb-3">⏱ {t.time}</div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{t.examples}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-3xl mx-auto">
          <h2
            className="font-serif text-4xl text-center mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-5">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border overflow-hidden"
                style={{ borderColor: "var(--border-color)" }}
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold transition-colors list-none" style={{ color: "var(--text-primary)" }}>
                  {faq.q}
                  <span className="text-sage-400 group-open:rotate-180 transition-transform text-lg">↓</span>
                </summary>
                <div className="px-6 pb-6 text-sm leading-relaxed border-t pt-4" style={{ color: "var(--text-secondary)", borderColor: "var(--border-color)" }}>
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-3xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Ready to Begin?
          </h2>
          <p className="text-sage-100 mb-6">Take the first step toward natural, lasting health.</p>
          <a
  href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20my%20first%20consultation%20with%20Dr.%20Pratima%20Agale."
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
>
   

  Book Your First Consultation
</a>
        </div>
      </section>
    </div>
  );
}
