import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Fungal Skin Infections Homeopathy | Ringworm, Tinea | Kalyan Mumbai",
  description: "Homeopathic treatment for ringworm, tinea, athlete's foot, and fungal skin infections in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — clear skin naturally.",
  keywords: ["fungal infection homeopathy kalyan","ringworm homeopathy","tinea treatment homeopathy","fungal skin treatment mumbai"],
};

const data = {
  slug: "fungal-skin",
  title: "Fungal Skin Infections",
  hindiTitle: "फंगल त्वचा संक्रमण (दाद, खुजली)",
  marathiTitle: "बुरशीजन्य त्वचा संसर्ग (गजकर्ण)",
  emoji: "🌿",
  category: "Skin & Dermatology",
  categoryColor: "#5a7f5a",
  heroColor: "#f4faf4",
  accentColor: "#5a7f5a",
  tagline: "Clear skin from within — not just on the surface.",
  overview: "Fungal skin infections — including ringworm (tinea), athlete's foot, jock itch, and nail fungus — are extremely common in India's humid climate. They are notoriously recurrent when treated only topically. Homeopathy corrects the immune susceptibility that makes the body prone to fungal overgrowth, breaking the cycle of recurrence.",
  whatIsIt: "Fungal infections are caused by dermatophytes, yeasts (like Candida), and molds. They thrive in warm, moist environments. The real question homeopathy asks is: why does this person keep getting fungal infections? The answer lies in immunity, diet, stress, and constitutional weakness — all of which homeopathy addresses.",
  causes: [
    "Lowered immunity",
    "Diabetes (high blood sugar encourages fungal growth)",
    "Excessive sweating and humidity (Mumbai, Kalyan climate)",
    "Prolonged antibiotic or steroid use",
    "Tight or synthetic clothing",
    "Shared towels, gym equipment",
    "Poor nutrition and gut imbalance"
  ],
  symptoms: [
    "Circular, ring-shaped red scaly patches on skin",
    "Intense itching — worse at night or after sweating",
    "Cracked, peeling skin between toes (athlete's foot)",
    "Thickened, discolored, brittle nails (onychomycosis)",
    "White patches in mouth or genital area (candida)",
    "Groin rash with sharp borders (tinea cruris)"
  ],
  homeopathyExplanation: "Homeopathy treats fungal infections by strengthening the immune system to resist fungal overgrowth, while specific remedies target the fungal susceptibility. For recurrent infections, constitutional treatment identifies the underlying weakness — whether digestive, hormonal, or immunity-related — and corrects it for lasting clearance.",
  treatmentPoints: [
    "Breaks the cycle of recurrent fungal infections",
    "Addresses underlying immune weakness",
    "Corrects gut flora imbalance contributing to candida",
    "Effective for nail fungus where topical antifungals fail",
    "No liver toxicity unlike oral antifungals",
    "Works for tinea, ringworm, candida, and onychomycosis"
  ],
  keyRemedies: [
    { name: "Tellurium", indication: "Ringworm in intersecting circles; offensive discharge; especially on back or ears" },
    { name: "Sepia", indication: "Ringworm appearing every spring; circular isolated spots; worse in cold" },
    { name: "Graphites", indication: "Skin cracks with sticky exudate; fungal infection behind ears or in skin folds" },
    { name: "Sulphur", indication: "Intensely itching, burning fungal patches; worse from heat and bathing" },
    { name: "Silicea", indication: "Nail fungus with brittle, discolored nails; recurring infections in chilly patients" }
  ],
  treatmentDuration: "3–9 months",
  successRate: "80% clearance and non-recurrence",
  faqs: [
    { q: "Can homeopathy clear nail fungus (onychomycosis)?", a: "Yes — nail fungus responds well to constitutional homeopathic treatment, especially when oral antifungals are not tolerated. Treatment takes longer (6–12 months) due to slow nail growth." },
    { q: "Should I continue antifungal cream during homeopathic treatment?", a: "You can continue topical antifungals while starting homeopathy. As internal immunity improves, the recurrence rate drops significantly." },
    { q: "Why do I keep getting ringworm repeatedly?", a: "Recurrent fungal infections indicate susceptibility — usually related to immunity, gut health, or diabetes. Constitutional homeopathic treatment addresses this susceptibility." }
  ],
  related: [
    { title: "Psoriasis", href: "/conditions/psoriasis" },
    { title: "Eczema", href: "/conditions/eczema" },
    { title: "Skin Pigmentation", href: "/conditions/skin-pigmentation" }
  ],
  seoKeywords: ["fungal infection homeopathy kalyan","ringworm homeopathy","tinea treatment homeopathy"]
};

export default function Page() { return <DiseasePage data={data} />; }
