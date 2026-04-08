import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Pediatric Homeopathy | Child Immunity, ADHD, Allergies | Kalyan Mumbai",
  description:
    "Safe, gentle homeopathic treatment for children in Kalyan, Mumbai. Dr. Pratima Agale specializes in pediatric immunity, ADHD, allergies, recurrent infections, and developmental support.",
  keywords: [
    "pediatric homeopathy kalyan",
    "child homeopathy mumbai",
    "ADHD homeopathy treatment",
    "child immunity homeopathy",
    "kids allergies homeopathy",
    "children homeopathy doctor kalyan",
  ],
};

const childConditions = [
  { emoji: "🛡️", title: "Low Immunity / Recurrent Infections", desc: "Children prone to frequent colds, throat infections, ear infections, and fevers benefit enormously from constitutional homeopathic treatment. Rather than suppressing each infection with antibiotics, we strengthen the child's own immune defenses for lasting protection.", benefits: ["Fewer sick days", "Stronger natural immunity", "Reduced need for antibiotics", "Better growth and energy"] },
  { emoji: "🧠", title: "ADHD & Behavioral Support", desc: "Homeopathy offers a side-effect-free approach to supporting children with attention difficulties, hyperactivity, and behavioral challenges. Treatment is individualized to the child's unique personality, not just their diagnosis.", benefits: ["Improved focus & attention", "Better emotional regulation", "Calmer behavior at home/school", "No sedation or side effects"] },
  { emoji: "🤧", title: "Allergies & Asthma", desc: "Allergic rhinitis, dust allergies, food sensitivities, and childhood asthma respond well to homeopathic desensitization. We address the immune hypersensitivity at its root.", benefits: ["Reduced allergic reactions", "Less dependence on antihistamines", "Better sleep quality", "Improved lung function"] },
  { emoji: "🌱", title: "Growth & Development", desc: "Homeopathy supports healthy physical and mental development. Children with delayed milestones, speech delays, or nutritional absorption issues benefit from carefully chosen constitutional remedies.", benefits: ["Improved appetite", "Better sleep", "Milestone support", "Emotional security"] },
  { emoji: "🎭", title: "Anxiety & Emotional Health", desc: "Separation anxiety, school phobia, bedwetting, nightmares, and childhood stress — homeopathy addresses the emotional roots of these common childhood challenges gently and effectively.", benefits: ["Reduced anxiety", "Better school performance", "Dry nights (bedwetting)", "Improved social confidence"] },
];

export default function PediatricPage() {
  return (
    <div className="pt-24">
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #f0fdf4, #faf3e6)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">🌱</div>
          <h1
            className="font-serif mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "#1e2820" }}
          >
            Pediatric Homeopathy
            <span className="block italic text-sage-500">Gentle Healing for Growing Bodies</span>
          </h1>
          <p className="text-sage-700 text-lg leading-relaxed mb-8">
            Children's bodies are sensitive and responsive — making them ideal candidates for
            homeopathic treatment. Dr. Pratima Agale has helped hundreds of children in Kalyan
            and Mumbai grow stronger, healthier, and happier.
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-5 py-2 rounded-full text-sm font-medium border border-green-200">
            <Shield className="w-4 h-4" />
            100% Safe for Newborns & Children of All Ages
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          {childConditions.map((cond) => (
            <div key={cond.title} className="bg-white rounded-2xl border border-sage-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="grid md:grid-cols-3">
                <div className="md:col-span-2 p-8">
                  <div className="text-4xl mb-4">{cond.emoji}</div>
                  <h2
                    className="font-serif text-2xl mb-3"
                    style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
                  >
                    {cond.title}
                  </h2>
                  <p className="text-sage-700 text-sm leading-relaxed">{cond.desc}</p>
                </div>
                <div className="bg-sage-50 p-8">
                  <h3 className="font-semibold text-sage-900 text-sm mb-4">Benefits</h3>
                  <ul className="space-y-3">
                    {cond.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sage-700 text-sm">
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
            for pediatric homeopathy in Kalyan and Mumbai.
          </p>
          <a
            href="https://wa.me/919087234577?text=Hello%2C%20I%20would%20like%20to%20book%20a%20children%27s%20consultation%20with%20Dr.%20Pratima%20Agale."
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
