import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Warts Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Homeopathic treatment for warts — common, plantar, flat, and genital warts in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — remove warts naturally without burning or freezing.",
  keywords: ["warts homeopathy kalyan","wart removal homeopathy mumbai","plantar wart homeopathy","warts natural treatment india"],
};

const data = {
  slug: "warts",
  title: "Warts",
  hindiTitle: "मस्से (Warts)",
  marathiTitle: "मस्से / चामखीळ (Warts)",
  emoji: "🦠",
  category: "Skin & Dermatology",
  categoryColor: "#5a7f5a",
  heroColor: "#f4faf4",
  accentColor: "#5a7f5a",
  tagline: "Eliminate warts from within — no burning, no freezing.",
  overview: "Warts are benign skin growths caused by the Human Papillomavirus (HPV). They are common in children and young adults, and can appear on hands, feet (plantar warts), face, and genitals. Conventional treatments (cryotherapy, acids) destroy the wart externally — but recurrence is high. Homeopathy boosts immunity against HPV for lasting resolution.",
  whatIsIt: "Warts occur when HPV infects the top layer of skin through cuts or breaks. Not everyone exposed to HPV develops warts — immune strength determines susceptibility. This is why homeopathy is uniquely effective: it strengthens the immune response to HPV so the body can eliminate warts naturally and prevent recurrence.",
  causes: [
    "Human Papillomavirus (HPV) — multiple strains",
    "Lowered immunity (weakened immune system)",
    "Direct contact with wart or contaminated surface",
    "Walking barefoot on public floors (plantar warts)",
    "Nail biting (peri-ungual warts)",
    "Skin cuts or abrasions allowing virus entry"
  ],
  symptoms: [
    "Rough, grainy skin growths — usually flesh-colored",
    "Plantar warts on soles — painful, pushed inward",
    "Flat warts — smooth, flat-topped, multiple",
    "Cauliflower-shaped clusters (condylomata)",
    "Warts appearing in multiples or clusters",
    "Warts under nails or around nail beds"
  ],
  homeopathyExplanation: "Homeopathy treats warts constitutionally by stimulating the immune system to recognize and eliminate HPV naturally. Specific wart remedies are known to cause remarkable disappearance of warts, especially in clusters. Treatment also prevents new warts from forming in susceptible individuals.",
  treatmentPoints: [
    "Eliminates warts without painful procedures",
    "Boosts anti-HPV immunity for non-recurrence",
    "Treats multiple warts simultaneously",
    "Effective for plantar, common, flat, and peri-ungual warts",
    "No scarring — warts fade naturally",
    "Safe for children and all ages"
  ],
  keyRemedies: [
    { name: "Thuja", indication: "Most important wart remedy — seedy, cauliflower, and large warts; multiple in clusters; genital warts" },
    { name: "Causticum", indication: "Warts on fingers and hands; large old warts on face; warts that bleed easily" },
    { name: "Nitric Acid", indication: "Warts with splinter-like pain, soft, bleeding warts on mucous membranes and skin edges" },
    { name: "Dulcamara", indication: "Flat, smooth warts appearing after cold and damp exposure; backs of hands" },
    { name: "Antimonium Crudum", indication: "Multiple small warts on hands and feet; horny growths; plantar warts" }
  ],
  treatmentDuration: "2–6 months",
  successRate: "85% complete resolution without recurrence",
  faqs: [
    { q: "Will the warts come back after homeopathic treatment?", a: "Because homeopathy works by boosting anti-HPV immunity, recurrence is much rarer than after cryotherapy or acid treatments. The immune improvement is lasting." },
    { q: "Can homeopathy treat genital warts (condylomata)?", a: "Yes — constitutional remedies, particularly Thuja, are effective for genital warts (condylomata acuminata). Treatment is confidential and gentle." },
    { q: "How long before warts start to disappear?", a: "Many patients notice warts becoming softer and smaller within 4–8 weeks. Complete disappearance typically takes 2–4 months." }
  ],
  related: [
    { title: "Psoriasis", href: "/conditions/psoriasis" },
    { title: "Eczema", href: "/conditions/eczema" },
    { title: "Fungal Skin Infections", href: "/conditions/fungal-skin" }
  ],
  seoKeywords: ["warts homeopathy kalyan","wart removal homeopathy mumbai","plantar wart homeopathy"]
};

export default function Page() { return <DiseasePage data={data} />; }
