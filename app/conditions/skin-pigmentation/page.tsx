import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Skin Pigmentation & Dark Spots Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Skin Pigmentation & Dark Spots in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. pigmentation homeopathy kalyan, melasma homeopathy treatment.",
  keywords: ["pigmentation homeopathy kalyan","melasma homeopathy treatment","dark spots homeopathy","skin brightening homeopathy mumbai"],
  openGraph: {
    title: "Skin Pigmentation & Dark Spots Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Skin Pigmentation & Dark Spots. Brighten skin from the inside — no harsh chemicals needed.",
  },
};

const data = {
  "slug": "skin-pigmentation",
  "title": "Skin Pigmentation & Dark Spots",
  "hindiTitle": "त्वचा का कालापन",
  "marathiTitle": "त्वचेचे काळे डाग",
  "emoji": "🌟",
  "category": "Skin & Dermatology",
  "categoryColor": "#f4a261",
  "heroColor": "#fff8f5",
  "accentColor": "#6b9e8a",
  "tagline": "Brighten skin from the inside — no harsh chemicals needed.",
  "overview": "Skin pigmentation disorders — melasma, post-inflammatory hyperpigmentation, and dark spots — are extremely common in India's sun-intensive climate. Homeopathy offers a safe, chemical-free approach to correcting uneven skin tone by addressing the internal hormonal, hepatic, and constitutional factors.",
  "whatIsIt": "Pigmentation occurs when melanin (skin pigment) is produced in excess in certain areas. Melasma is particularly common in Indian women — linked to sun exposure, hormonal changes (pregnancy, oral contraceptives, PCOD), and thyroid disease. Post-inflammatory hyperpigmentation follows acne, eczema, or any skin injury. Homeopathy reduces melanin overproduction by treating the root cause.",
  "causes": [
    "Sun exposure — main trigger for melasma in India",
    "Hormonal: pregnancy (chloasma), PCOD, thyroid, OCP use",
    "Post-inflammatory: acne scars, eczema, insect bites",
    "Nutritional deficiencies: vitamin C, B12",
    "Liver dysfunction (poor toxin clearance shows in skin)",
    "Chemical exposure from cosmetics"
  ],
  "symptoms": [
    "Brown or grey-brown patches — usually on face (cheeks, forehead, upper lip)",
    "Darkening of existing acne scars",
    "Uneven skin tone with patchy coloration",
    "Melasma — bilateral symmetrical patches on sun-exposed areas",
    "Dark circles under eyes",
    "Generalized dull, uneven complexion"
  ],
  "homeopathyExplanation": "Homeopathy treats pigmentation by addressing the internal cause — hormonal regulation, liver detoxification, and the constitutional tendency. Remedies like Berberis Aquifolium are known skin brighteners. Combined with constitutional treatment for the underlying cause (PCOD, thyroid, post-acne), results are natural and lasting — without the skin thinning seen from bleaching creams.",
  "treatmentPoints": [
    "Reduces melanin overproduction from within",
    "Addresses hormonal cause (PCOD, thyroid-linked melasma)",
    "Improves liver detoxification for clearer skin",
    "Fades post-acne dark marks safely",
    "Safe during pregnancy (melasma treatment)",
    "No steroid or hydroquinone side effects"
  ],
  "keyRemedies": [
    {
      "name": "Berberis Aquifolium",
      "indication": "Premier skin brightener in homeopathy; fades pigmentation and improves complexion"
    },
    {
      "name": "Sepia",
      "indication": "Melasma across the nose and cheeks; hormonal pigmentation; worn-out, sallow complexion"
    },
    {
      "name": "Thuja",
      "indication": "Brown spots and blotches; skin that feels unhealthy; associated with oily skin"
    },
    {
      "name": "Lycopodium",
      "indication": "Yellowish complexion with brown spots; linked to liver or digestive sluggishness"
    },
    {
      "name": "Natrum Muriaticum",
      "indication": "Greasy skin with pigmentation around hairline; associated with grief or hormonal issues"
    }
  ],
  "treatmentDuration": "4–10 months",
  "successRate": "80%+ improvement in pigmentation",
  "faqs": [
    {
      "q": "Is homeopathy safe to use during pregnancy for melasma?",
      "a": "Yes — homeopathic remedies are among the safest options for pregnant women. They can effectively reduce melasma during pregnancy without any risk to the baby."
    }
  ],
  "related": [
    {
      "title": "Acne",
      "href": "/conditions/acne"
    },
    {
      "title": "Vitiligo",
      "href": "/conditions/vitiligo"
    },
    {
      "title": "PCOD",
      "href": "/conditions/pcod-pcos"
    }
  ],
  "seoKeywords": [
    "pigmentation homeopathy kalyan",
    "melasma homeopathy treatment",
    "dark spots homeopathy",
    "skin brightening homeopathy mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
