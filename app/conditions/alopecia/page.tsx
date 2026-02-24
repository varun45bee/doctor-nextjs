import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Alopecia / Hair Loss Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Homeopathic treatment for alopecia areata and hair loss in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — natural hair regrowth without side effects.",
  keywords: ["alopecia homeopathy kalyan","hair loss treatment homeopathy mumbai","alopecia areata natural treatment","bald patches homeopathy"],
};

const data = {
  slug: "alopecia",
  title: "Alopecia Areata",
  hindiTitle: "एलोपेसिया (गंजापन)",
  marathiTitle: "केस गळणे (एलोपेसिया)",
  emoji: "💇",
  category: "Skin, Hair & Dermatology",
  categoryColor: "#5a7f5a",
  heroColor: "#f4f7f4",
  accentColor: "#5a7f5a",
  tagline: "Restore your hair naturally — by healing from the root.",
  overview: "Alopecia areata is an autoimmune condition causing patchy hair loss on the scalp and body. It affects people of all ages, including children. Homeopathy treats the immune dysregulation that drives follicle damage — supporting natural, sustainable hair regrowth.",
  whatIsIt: "In alopecia areata, the immune system mistakenly attacks hair follicles, causing them to shrink and dramatically slow hair production. Patches can be small or extensive. Conventional treatment offers steroids and minoxidil — temporary solutions that don't address the root cause. Homeopathy works constitutionally to correct the immune error.",
  causes: [
    "Autoimmune attack on hair follicles",
    "Severe or prolonged emotional stress",
    "Genetic predisposition",
    "Nutritional deficiencies (iron, B12, zinc, Vitamin D)",
    "Hormonal imbalances (thyroid, PCOS)",
    "Post-illness (especially after high fever or infection)",
    "Scalp infections or dandruff"
  ],
  symptoms: [
    "Sudden patchy hair loss on scalp",
    "Round or oval smooth bald patches",
    "Hair loss from beard, eyebrows, or eyelashes",
    "Nail pitting or ridging (associated sign)",
    "Scalp tingling or burning before loss",
    "In severe cases, total scalp (alopecia totalis) or body hair loss"
  ],
  homeopathyExplanation: "Homeopathy addresses alopecia at the immune and constitutional level. The prescribed remedy is selected based on your hair loss pattern, emotional state, hormonal history, and overall constitution — not just the scalp. Constitutional treatment stimulates follicle recovery and prevents further immune attacks.",
  treatmentPoints: [
    "Corrects immune dysfunction targeting hair follicles",
    "Stimulates dormant follicles for regrowth",
    "Addresses underlying hormonal causes (thyroid, PCOS)",
    "Manages stress and anxiety that trigger or worsen loss",
    "Safe for children, women, and the elderly",
    "No hormonal side effects unlike allopathic treatments"
  ],
  keyRemedies: [
    { name: "Phosphorus", indication: "Rapid hair fall in large handfuls, dandruff, sensitive scalp" },
    { name: "Natrum Mur", indication: "Hair fall from grief or emotional shock, oily scalp, especially post-partum" },
    { name: "Lycopodium", indication: "Premature baldness, hair loss with digestive or liver complaints" },
    { name: "Silicea", indication: "Weak, brittle hair, profuse scalp sweating, constitutionally chilly patients" },
    { name: "Fluoricum Acidum", indication: "Alopecia areata with circular bald patches, hair falls and is replaced by new" }
  ],
  treatmentDuration: "4–12 months",
  successRate: "75–85% show regrowth",
  faqs: [
    { q: "Can homeopathy regrow hair in bald patches?", a: "Yes — many patients see new hair growth in patches within 3–6 months of constitutional treatment, especially in early-stage or recent-onset alopecia areata." },
    { q: "Will hair fall again after stopping treatment?", a: "Constitutional homeopathic treatment aims for lasting correction of the immune response. Relapses are less frequent than with steroid treatment, though triggers like extreme stress can cause recurrence." },
    { q: "Is the treatment safe for children?", a: "Absolutely. Homeopathic remedies are gentle and completely safe for children of all ages." }
  ],
  related: [
    { title: "Hair Loss (Diffuse)", href: "/conditions/hair-loss" },
    { title: "Thyroid Disorders", href: "/conditions/thyroid" },
    { title: "Skin Pigmentation", href: "/conditions/skin-pigmentation" }
  ],
  seoKeywords: ["alopecia homeopathy kalyan","hair loss treatment homeopathy mumbai","alopecia areata natural treatment"]
};

export default function Page() { return <DiseasePage data={data} />; }
