import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Rosacea Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Homeopathic treatment for rosacea, facial redness, and rosacea acne in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — calm reactive skin naturally.",
  keywords: ["rosacea homeopathy kalyan","facial redness treatment homeopathy","rosacea natural treatment mumbai","red face homeopathy"],
};

const data = {
  slug: "rosacea",
  title: "Rosacea",
  hindiTitle: "रोसेशिया (चेहरे की लालिमा)",
  marathiTitle: "रोसेशिया (चेहऱ्याची लालसरपणा)",
  emoji: "🌹",
  category: "Skin & Dermatology",
  categoryColor: "#5a7f5a",
  heroColor: "#fff5f5",
  accentColor: "#5a7f5a",
  tagline: "Calm, clear skin — by restoring inner balance.",
  overview: "Rosacea is a chronic skin condition causing facial redness, visible blood vessels, and acne-like bumps — primarily on cheeks, nose, and forehead. Triggers include heat, spicy food, sun, and stress. Homeopathy reduces vascular reactivity, controls inflammation, and addresses the constitutional causes behind this sensitive skin condition.",
  whatIsIt: "Rosacea is an inflammatory skin disorder with neurovascular dysfunction — the facial blood vessels react excessively to triggers. It progresses through stages from flushing to persistent redness to papules and pustules. Unlike acne, rosacea has no comedones. Homeopathy reduces the underlying vascular and immune reactivity.",
  causes: [
    "Genetic predisposition (fair-skinned more susceptible)",
    "Vascular reactivity — blood vessels over-responding to triggers",
    "Sun and UV exposure",
    "Heat — hot beverages, spicy food, hot weather",
    "Emotional stress and anxiety",
    "Demodex mite overgrowth on facial skin",
    "Digestive issues — H. pylori association"
  ],
  symptoms: [
    "Persistent facial redness — especially cheeks and nose",
    "Flushing and blushing easily",
    "Visible dilated blood vessels (telangiectasia)",
    "Acne-like bumps (papules, pustules) — no blackheads",
    "Eye irritation (ocular rosacea)",
    "Burning, stinging, or sensitive skin",
    "Thickened skin on nose (rhinophyma — advanced)"
  ],
  homeopathyExplanation: "Constitutional homeopathic treatment for rosacea addresses the vascular hypersensitivity, emotional triggers, and digestive connections. Remedies reduce flushing frequency, calm persistent redness, and improve the skin's tolerance to triggers. Treatment is individualized based on which triggers dominate and the patient's constitution.",
  treatmentPoints: [
    "Reduces flushing frequency and intensity",
    "Calms persistent facial redness",
    "Addresses emotional triggers (blushing from embarrassment)",
    "Reduces papules and pustules",
    "Improves digestive health linked to rosacea",
    "Safe for sensitive, reactive skin types"
  ],
  keyRemedies: [
    { name: "Lachesis", indication: "Rosacea worse after sleep, hot flushes, purple-red complexion; jealous, talkative nature" },
    { name: "Sanguinaria", indication: "Facial flushing, burning redness, especially right-sided; hot palms and cheeks" },
    { name: "Belladonna", indication: "Sudden intense redness and heat, throbbing, worse from sun and heat" },
    { name: "Pulsatilla", indication: "Rosacea from hormonal causes, worse in warm rooms, weepy personality" },
    { name: "Carbo Veg", indication: "Bluish-red skin with venous congestion, cold but wants to be fanned" }
  ],
  treatmentDuration: "6–15 months",
  successRate: "75% experience significant reduction in redness and flares",
  faqs: [
    { q: "Does homeopathy work for persistent facial redness?", a: "Yes — constitutional remedies specifically reduce vascular reactivity. Patients report fewer and less intense flushing episodes within 2–3 months." },
    { q: "Can homeopathy help rosacea that's been present for years?", a: "Yes, though chronic rosacea takes longer (9–18 months) to respond. Significant improvement is still achievable." },
    { q: "Should I avoid any foods during treatment?", a: "Identifying and avoiding personal triggers (spicy food, alcohol, hot drinks) is helpful alongside treatment. Dr. Agale provides dietary guidance." }
  ],
  related: [
    { title: "Acne", href: "/conditions/acne" },
    { title: "Skin Pigmentation", href: "/conditions/skin-pigmentation" },
    { title: "Eczema", href: "/conditions/eczema" }
  ],
  seoKeywords: ["rosacea homeopathy kalyan","facial redness treatment homeopathy","rosacea natural treatment mumbai"]
};

export default function Page() { return <DiseasePage data={data} />; }
