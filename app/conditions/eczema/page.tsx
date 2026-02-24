import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Eczema / Atopic Dermatitis Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Eczema / Atopic Dermatitis in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. eczema homeopathy kalyan, atopic dermatitis homeopathy.",
  keywords: ["eczema homeopathy kalyan","atopic dermatitis homeopathy","child eczema treatment mumbai","baby eczema homeopathy"],
  openGraph: {
    title: "Eczema / Atopic Dermatitis Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Eczema / Atopic Dermatitis. Soothe inflamed skin without steroids — heal from the inside.",
  },
};

const data = {
  "slug": "eczema",
  "title": "Eczema / Atopic Dermatitis",
  "hindiTitle": "एक्जिमा",
  "marathiTitle": "एक्झिमा",
  "emoji": "🌸",
  "category": "Skin & Dermatology",
  "categoryColor": "#f4a261",
  "heroColor": "#fff8f5",
  "accentColor": "#6b9e8a",
  "tagline": "Soothe inflamed skin without steroids — heal from the inside.",
  "overview": "Eczema (atopic dermatitis) is a chronic inflammatory skin condition causing intense itching, redness, and weeping skin. It is extremely common in India, affecting 15–20% of children and 3–5% of adults, and frequently runs in families alongside asthma and allergic rhinitis.",
  "whatIsIt": "Eczema represents a disruption in the skin barrier combined with an overactive immune response. The skin fails to retain moisture properly, making it vulnerable to environmental triggers. While antihistamines and topical steroids provide temporary relief, they do not correct the underlying immune imbalance. Homeopathy addresses the constitutional predisposition — the allergic tendency itself.",
  "causes": [
    "Genetic atopic tendency (family history of eczema, asthma, or hayfever)",
    "Overactive immune response to environmental allergens",
    "Skin barrier deficiency (filaggrin gene mutation)",
    "Food sensitivities (dairy, gluten, eggs, nuts)",
    "Stress and emotional factors",
    "Environmental triggers: dust mites, pollen, animal dander",
    "Harsh soaps, detergents, synthetic fabrics"
  ],
  "symptoms": [
    "Intense, relentless itching — especially at night",
    "Red to brownish-grey patches",
    "Small, raised bumps that may weep fluid when scratched",
    "Thickened, cracked, or scaly skin",
    "Raw, swollen skin from scratching",
    "Common locations: hands, feet, ankles, wrists, neck, chest, face (in infants)"
  ],
  "homeopathyExplanation": "Homeopathy treats eczema by identifying and correcting the allergic constitution. This means the remedy is chosen based on the complete picture — where on the body the eczema appears, what makes it better or worse, your child's personality, sleep patterns, food preferences, and emotional responses. Treatment reverses the internal immune overreaction rather than suppressing skin symptoms.",
  "treatmentPoints": [
    "Reduces allergic hypersensitivity at the immune system level",
    "Eliminates need for steroid creams over time",
    "Addresses the gut-skin axis (food sensitivity component)",
    "Prevents the 'atopic march' — eczema progressing to asthma",
    "Safe for infants, babies, and pregnant mothers",
    "Results are lasting, not temporary suppression"
  ],
  "keyRemedies": [
    {
      "name": "Graphites",
      "indication": "Thick, golden, honey-like discharge from eczema patches; worse behind ears and in skin folds"
    },
    {
      "name": "Sulphur",
      "indication": "Intensely burning and itching eczema worse from warmth and bathing; dry rough skin"
    },
    {
      "name": "Mezereum",
      "indication": "Thick crusts forming over weeping eczema; violent itching; often used in scalp eczema"
    },
    {
      "name": "Natrum Muriaticum",
      "indication": "Dry eczema at hairline and bends of joints; grief or emotional suppression in history"
    },
    {
      "name": "Calcarea Carbonica",
      "indication": "Fatty, sweaty children with eczema; slow metabolism; cradle cap and infantile eczema"
    }
  ],
  "treatmentDuration": "4–12 months",
  "successRate": "85%+ significant improvement",
  "faqs": [
    {
      "q": "Can a baby's eczema be treated with homeopathy?",
      "a": "Absolutely. Homeopathy is among the safest treatments for infant eczema. The remedies are sweet, easy to administer, and non-toxic. Many babies see remarkable improvement within 2–3 months."
    },
    {
      "q": "Will homeopathy make my child's eczema worse before better?",
      "a": "A brief initial aggravation (mild worsening) can occur in some cases — this is the body's healing response and usually resolves within 1–2 weeks, followed by significant improvement."
    },
    {
      "q": "Can I continue antihistamines during homeopathic treatment?",
      "a": "Yes, you can continue conventional medications while starting homeopathy. As the skin heals, you'll naturally need them less. Never abruptly stop prescribed medications without your doctor's guidance."
    }
  ],
  "related": [
    {
      "title": "Psoriasis",
      "href": "/conditions/psoriasis"
    },
    {
      "title": "Allergies & Asthma",
      "href": "/conditions/allergies-asthma"
    },
    {
      "title": "Child Immunity",
      "href": "/conditions/child-immunity"
    }
  ],
  "seoKeywords": [
    "eczema homeopathy kalyan",
    "atopic dermatitis homeopathy",
    "child eczema treatment mumbai",
    "baby eczema homeopathy"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
