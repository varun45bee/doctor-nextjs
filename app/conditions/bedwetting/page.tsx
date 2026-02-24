import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Bedwetting (Enuresis) Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Natural homeopathic treatment for bedwetting (nocturnal enuresis) in children in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — gentle, effective, side-effect free.",
  keywords: ["bedwetting homeopathy kalyan","enuresis treatment homeopathy","child bedwetting natural cure","nocturnal enuresis homeopathy mumbai"],
};

const data = {
  slug: "bedwetting",
  title: "Bedwetting (Enuresis)",
  hindiTitle: "बिस्तर गीला करना (एन्यूरेसिस)",
  marathiTitle: "अंथरूणावर लघवी (एन्युरेसिस)",
  emoji: "💧",
  category: "Pediatric & Children",
  categoryColor: "#5a7f5a",
  heroColor: "#f0f8ff",
  accentColor: "#5a7f5a",
  tagline: "Dry nights — through gentle healing, not harsh intervention.",
  overview: "Bedwetting (nocturnal enuresis) affects up to 15% of 5-year-olds and many older children. It causes significant emotional distress, shame, and affects school and social life. Homeopathy addresses the physical and emotional root causes gently, without medications that have side effects or alarms that disturb sleep.",
  whatIsIt: "Nocturnal enuresis is involuntary urination during sleep, typically in children over age 5. Primary enuresis means the child never achieved dryness; secondary means it started after a dry period. Homeopathic treatment is individualized based on the time of wetting, emotional triggers, sleep depth, and associated anxiety.",
  causes: [
    "Deep sleep — inability to respond to bladder signals",
    "Small functional bladder capacity",
    "Stress, anxiety, fear, or emotional change (new school, new sibling)",
    "Family history (strong genetic component)",
    "Hormonal: insufficient ADH (antidiuretic hormone) production",
    "Constipation putting pressure on bladder",
    "Urinary tract infection (especially if sudden onset)"
  ],
  symptoms: [
    "Wetting bed once or multiple times per night",
    "Wetting at same time each night (often first hours of sleep)",
    "Deep sleep, difficult to wake",
    "Child embarrassed, anxious, or withdrawn about it",
    "Sometimes associated with urgency during day"
  ],
  homeopathyExplanation: "Homeopathic treatment for bedwetting is chosen based on the child's specific pattern — when they wet, how deeply they sleep, their emotional state, and any associated fears or anxieties. Remedies work both on the nervous system's bladder control and on stress-related triggers. Treatment is gentle, pleasant-tasting, and produces no side effects.",
  treatmentPoints: [
    "Improves nervous system control of bladder",
    "Addresses emotional/anxiety triggers",
    "Works for both primary and secondary enuresis",
    "No alarming side effects unlike conventional medications",
    "Improves child's confidence and emotional wellbeing",
    "Often results in dryness within 4–8 weeks"
  ],
  keyRemedies: [
    { name: "Equisetum", indication: "Bedwetting with vivid dreams or nightmares; wets during dreams" },
    { name: "Causticum", indication: "Wets in first sleep, also daytime dribbling on coughing or laughing; timid child" },
    { name: "Kreosotum", indication: "Wets in heavy sleep, very difficult to wake; dreams of urinating" },
    { name: "Belladonna", indication: "Sudden urge, wets involuntarily; associated with overexcitement" },
    { name: "Pulsatilla", indication: "Gentle, emotional child; wets from sadness or missing parent; craves affection" }
  ],
  treatmentDuration: "2–6 months",
  successRate: "85%+ achieve sustained dryness",
  faqs: [
    { q: "At what age should I seek treatment?", a: "Bedwetting is considered within normal range up to age 5–6. If it continues beyond 6 or causes emotional distress, homeopathic treatment is very beneficial." },
    { q: "Is it the child's fault or laziness?", a: "No — never. Bedwetting is involuntary. The child is often in deep sleep and genuinely cannot respond to bladder signals. Shame or punishment worsens it." },
    { q: "How quickly does homeopathy work for bedwetting?", a: "Many parents report improvement within 4–6 weeks. Complete resolution typically takes 2–4 months." }
  ],
  related: [
    { title: "ADHD", href: "/conditions/adhd" },
    { title: "Anxiety & Stress", href: "/conditions/anxiety-stress" },
    { title: "Child Immunity", href: "/conditions/child-immunity" }
  ],
  seoKeywords: ["bedwetting homeopathy kalyan","enuresis treatment homeopathy","child bedwetting natural cure"]
};

export default function Page() { return <DiseasePage data={data} />; }
