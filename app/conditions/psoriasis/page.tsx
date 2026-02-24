import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Psoriasis Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Psoriasis in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. psoriasis homeopathy kalyan, psoriasis treatment mumbai.",
  keywords: ["psoriasis homeopathy kalyan","psoriasis treatment mumbai","homeopathy for psoriasis","skin psoriasis natural treatment"],
  openGraph: {
    title: "Psoriasis Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Psoriasis. Heal the skin from within — naturally and permanently.",
  },
};

const data = {
  "slug": "psoriasis",
  "title": "Psoriasis",
  "hindiTitle": "सोरायसिस",
  "marathiTitle": "सोरायसिस",
  "emoji": "🔴",
  "category": "Skin & Dermatology",
  "categoryColor": "#f4a261",
  "heroColor": "#fff8f5",
  "accentColor": "#6b9e8a",
  "tagline": "Heal the skin from within — naturally and permanently.",
  "overview": "Psoriasis is a chronic autoimmune skin condition causing rapid skin cell turnover, resulting in thick, scaly, inflamed plaques on the skin surface. In India, it affects approximately 2–3% of the population and can significantly impact quality of life.",
  "whatIsIt": "The immune system mistakenly attacks healthy skin cells, triggering an accelerated cell growth cycle. New skin cells form in days rather than weeks, accumulating on the surface as thick scales. While conventional medicine offers topical steroids and biologics that suppress symptoms, homeopathy aims to correct the underlying immune dysregulation for long-term remission.",
  "causes": [
    "Autoimmune dysfunction — immune system attacking healthy skin",
    "Genetic predisposition (family history of psoriasis)",
    "Stress and emotional trauma as major triggers",
    "Infections (streptococcal throat infection)",
    "Certain medications (beta-blockers, lithium)",
    "Alcohol consumption and smoking",
    "Skin injury (Koebner phenomenon)"
  ],
  "symptoms": [
    "Red, raised patches covered with silvery-white scales",
    "Dry, cracked skin that may bleed",
    "Itching, burning or soreness",
    "Thickened, pitted or ridged nails",
    "Swollen and stiff joints (psoriatic arthritis)",
    "Plaques on scalp, elbows, knees, or lower back"
  ],
  "homeopathyExplanation": "Homeopathy treats psoriasis as a constitutional disease — a manifestation of deep internal imbalance. Rather than suppressing the skin lesions with steroids (which drives the disease inward), constitutional homeopathic remedies stimulate the immune system to self-correct. Treatment is individualized based on the location, appearance, and modalities of your psoriasis, plus your mental-emotional state.",
  "treatmentPoints": [
    "Corrects immune hypersensitivity at the root level",
    "Reduces plaque formation and skin inflammation",
    "Addresses the stress and emotional triggers",
    "Safe for long-term use — no liver or kidney toxicity",
    "Can be used alongside conventional medication during transition",
    "Prevents frequent relapses seen with steroid-only treatment"
  ],
  "keyRemedies": [
    {
      "name": "Arsenicum Album",
      "indication": "Silvery scales, burning pains better with warmth, anxious constitution"
    },
    {
      "name": "Graphites",
      "indication": "Thick crusty plaques with sticky honey-like discharge, especially behind ears"
    },
    {
      "name": "Sulphur",
      "indication": "Intensely itching, burning plaques worse from heat and washing"
    },
    {
      "name": "Petroleum",
      "indication": "Dry, rough, cracked skin worsening in winter, fissures in skin"
    },
    {
      "name": "Mezereum",
      "indication": "Scalp psoriasis with thick crusts, burning and violent itching"
    }
  ],
  "treatmentDuration": "6–18 months",
  "successRate": "80%+ improvement",
  "faqs": [
    {
      "q": "Can homeopathy completely cure psoriasis?",
      "a": "Homeopathy can bring psoriasis into long-term remission in many cases. 'Complete cure' depends on the chronicity, extent, and individual response. Most patients see significant reduction in plaque area, frequency of flare-ups, and severity within 6–12 months."
    },
    {
      "q": "Should I stop my steroid cream during homeopathic treatment?",
      "a": "Do not stop steroids abruptly. Dr. Agale will guide you on gradually tapering as your skin improves. Sudden steroid withdrawal can cause a rebound flare."
    },
    {
      "q": "Is psoriatic arthritis also treatable with homeopathy?",
      "a": "Yes. Constitutional homeopathic remedies address both the skin and joint components of psoriatic disease simultaneously."
    }
  ],
  "related": [
    {
      "title": "Eczema",
      "href": "/conditions/eczema"
    },
    {
      "title": "Urticaria",
      "href": "/conditions/urticaria"
    },
    {
      "title": "Skin Pigmentation",
      "href": "/conditions/skin-pigmentation"
    }
  ],
  "seoKeywords": [
    "psoriasis homeopathy kalyan",
    "psoriasis treatment mumbai",
    "homeopathy for psoriasis",
    "skin psoriasis natural treatment"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
