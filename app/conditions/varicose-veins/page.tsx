import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Varicose Veins Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Homeopathic treatment for varicose veins in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — reduce swelling, pain, and improve vein health naturally without surgery.",
  keywords: ["varicose veins homeopathy kalyan","vein treatment homeopathy mumbai","varicose veins natural treatment","spider veins homeopathy"],
};

const data = {
  slug: "varicose-veins",
  title: "Varicose Veins",
  hindiTitle: "वैरिकोज वेन्स (नसों की सूजन)",
  marathiTitle: "वैरिकोज व्हेन्स (शिरांची सूज)",
  emoji: "🦵",
  category: "General Health",
  categoryColor: "#5a7f5a",
  heroColor: "#f4f7f4",
  accentColor: "#5a7f5a",
  tagline: "Restore healthy circulation — from the inside out.",
  overview: "Varicose veins are enlarged, twisted veins visible under the skin — most commonly in legs. They cause pain, heaviness, swelling, and cosmetic concern. Beyond aesthetics, untreated varicose veins can progress to skin ulcers and deep vein complications. Homeopathy improves venous tone, reduces inflammation, and addresses the constitutional tendency.",
  whatIsIt: "Veins contain one-way valves that push blood upward toward the heart. When these valves weaken, blood pools and the vein enlarges and twists — becoming varicose. Factors include prolonged standing, pregnancy, obesity, and heredity. Homeopathy strengthens vascular walls and improves venous return.",
  causes: [
    "Prolonged standing (teachers, healthcare workers, vendors)",
    "Pregnancy — increased venous pressure",
    "Obesity — excess weight on leg veins",
    "Genetic predisposition",
    "Hormonal factors (estrogen relaxes vein walls)",
    "Sedentary lifestyle",
    "Age — valve weakening over time"
  ],
  symptoms: [
    "Visible twisted, bulging dark veins on legs",
    "Aching, heaviness, or throbbing in legs",
    "Swelling in lower legs and ankles",
    "Burning or itching over affected veins",
    "Muscle cramps at night",
    "Skin discoloration around veins",
    "Spider veins (smaller, web-like)"
  ],
  homeopathyExplanation: "Homeopathy treats varicose veins by strengthening venous walls, improving venous valvular function, and reducing inflammatory congestion in affected vessels. Constitutional treatment also addresses the predisposing factors — obesity, hormonal weakness, and circulation. Remedies are safe for use during pregnancy when other treatments are contraindicated.",
  treatmentPoints: [
    "Strengthens vein walls and valve function",
    "Reduces pain, heaviness, and swelling",
    "Prevents progression to skin ulcers",
    "Safe for use during pregnancy",
    "Addresses associated cramps and restless legs",
    "Reduces spider vein visibility",
    "No invasive procedure required for mild-moderate cases"
  ],
  keyRemedies: [
    { name: "Hamamelis", indication: "Varicose veins with bruised soreness, bleeding tendency; venous congestion" },
    { name: "Pulsatilla", indication: "Varicose veins worse in heat and hanging limbs down; wandering pains; pregnancy-related" },
    { name: "Carbo Veg", indication: "Varicose veins with bluish discoloration, coldness, stagnant circulation" },
    { name: "Vipera", indication: "Intense pain and heaviness in varicose veins; worse hanging limbs down" },
    { name: "Calcarea Fluor", indication: "Hard varicose veins, venous elasticity loss; prevents deterioration" }
  ],
  treatmentDuration: "6–12 months",
  successRate: "70–80% report significant symptom improvement",
  faqs: [
    { q: "Can homeopathy eliminate varicose veins completely?", a: "Very prominent, large varicose veins may need surgical or laser treatment. Homeopathy is best for mild-moderate cases and is excellent for preventing progression and managing symptoms in advanced cases." },
    { q: "Is homeopathy safe for varicose veins during pregnancy?", a: "Yes — it's one of the safest options for managing pregnancy-related varicose veins, unlike compression stockings worn alone or surgical options." },
    { q: "How long until I see improvement?", a: "Many patients notice reduced aching and heaviness within 4–8 weeks. Visible improvement in vein appearance takes 3–6 months." }
  ],
  related: [
    { title: "Obesity", href: "/conditions/obesity" },
    { title: "Arthritis", href: "/conditions/arthritis" },
    { title: "Piles & Fissures", href: "/conditions/piles-fissures" }
  ],
  seoKeywords: ["varicose veins homeopathy kalyan","vein treatment homeopathy mumbai","varicose veins natural treatment"]
};

export default function Page() { return <DiseasePage data={data} />; }
