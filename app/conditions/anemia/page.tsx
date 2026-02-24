import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Anemia Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Natural homeopathic treatment for anemia, iron deficiency, and fatigue in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — boost iron absorption and energy naturally.",
  keywords: ["anemia homeopathy kalyan","iron deficiency homeopathy","fatigue treatment homeopathy mumbai","weakness homeopathy"],
};

const data = {
  slug: "anemia",
  title: "Anemia",
  hindiTitle: "एनीमिया (रक्त की कमी)",
  marathiTitle: "ॲनिमिया (रक्ताची कमतरता)",
  emoji: "🩸",
  category: "General Health",
  categoryColor: "#5a7f5a",
  heroColor: "#fff5f5",
  accentColor: "#5a7f5a",
  tagline: "Restore vitality from within — naturally and gently.",
  overview: "Anemia — a deficiency of red blood cells or hemoglobin — is extremely common in India, especially among women, children, and the elderly. While iron supplements are often prescribed, they don't address why the body isn't absorbing or utilizing iron. Homeopathy corrects absorption, digestion, and constitutional weakness.",
  whatIsIt: "Anemia occurs when blood lacks enough healthy red blood cells to carry adequate oxygen to tissues. Causes range from iron or B12 deficiency to chronic disease, heavy menstrual bleeding, or poor absorption. Homeopathy addresses not just the deficiency, but the constitutional reason behind it.",
  causes: [
    "Iron, B12, or folic acid deficiency",
    "Heavy menstrual bleeding (menorrhagia)",
    "Poor nutritional absorption (digestive issues)",
    "Chronic diseases (kidney disease, autoimmune conditions)",
    "Pregnancy — increased iron demand",
    "Parasitic infections (hookworm — common in India)",
    "Genetic (sickle cell, thalassemia)"
  ],
  symptoms: [
    "Extreme fatigue and weakness",
    "Pale or yellowish skin",
    "Shortness of breath on exertion",
    "Dizziness or lightheadedness",
    "Cold hands and feet",
    "Brittle nails, hair thinning",
    "Unusual cravings (pica) — chalk, mud, ice"
  ],
  homeopathyExplanation: "Homeopathy treats anemia by addressing both the deficiency and its root cause. For iron-deficiency anemia, remedies improve iron absorption from food. For anemia due to heavy periods, constitutional treatment regulates menstrual flow. The holistic approach ensures lasting improvement, not just temporary hemoglobin boost.",
  treatmentPoints: [
    "Improves absorption of iron and B12 from diet",
    "Addresses menstrual causes in women",
    "Boosts energy and vitality constitutionally",
    "Helps in cases where iron supplements cause side effects",
    "Safe for pregnant women and children",
    "Works alongside dietary improvements"
  ],
  keyRemedies: [
    { name: "Ferrum Metallicum", indication: "Classic iron-deficiency anemia, pale face, weakness, breathlessness on exertion" },
    { name: "China (Cinchona)", indication: "Anemia from blood loss, weakness from heavy periods or chronic illness" },
    { name: "Natrum Mur", indication: "Anemia with grief or emotional component, craving salt, pale and thin constitution" },
    { name: "Calcarea Carb", indication: "Anemia in chilly, overweight, or anxious patients with poor digestion" },
    { name: "Phosphorus", indication: "Anemia with tendency to bleed easily, weakness with burning sensations" }
  ],
  treatmentDuration: "3–8 months",
  successRate: "Significant improvement in 85%+ cases",
  faqs: [
    { q: "Can I take homeopathy alongside iron tablets?", a: "Yes. Homeopathy can be taken alongside conventional supplements. As your absorption improves, your doctor may reduce the supplement dose." },
    { q: "How long before I notice energy improvement?", a: "Many patients report improved energy within 4–8 weeks of starting treatment, before hemoglobin numbers significantly change." },
    { q: "Is homeopathy for anemia safe during pregnancy?", a: "Yes — homeopathic remedies for anemia are completely safe during pregnancy and are frequently used to support iron levels naturally." }
  ],
  related: [
    { title: "Hair Loss", href: "/conditions/hair-loss" },
    { title: "PCOD / PCOS", href: "/conditions/pcod-pcos" },
    { title: "Digestive Disorders", href: "/conditions/ibs-digestive" }
  ],
  seoKeywords: ["anemia homeopathy kalyan","iron deficiency homeopathy","fatigue treatment homeopathy mumbai"]
};

export default function Page() { return <DiseasePage data={data} />; }
