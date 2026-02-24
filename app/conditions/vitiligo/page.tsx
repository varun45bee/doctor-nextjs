import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Vitiligo (Leucoderma) Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Vitiligo (Leucoderma) in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. vitiligo homeopathy kalyan, leucoderma homeopathy treatment.",
  keywords: ["vitiligo homeopathy kalyan","leucoderma homeopathy treatment","safed daag homeopathy","vitiligo treatment mumbai"],
  openGraph: {
    title: "Vitiligo (Leucoderma) Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Vitiligo (Leucoderma). Restore your skin's colour naturally with homeopathic healing.",
  },
};

const data = {
  "slug": "vitiligo",
  "title": "Vitiligo (Leucoderma)",
  "hindiTitle": "सफेद दाग (विटिलिगो)",
  "marathiTitle": "पांढरे डाग",
  "emoji": "🤍",
  "category": "Skin & Dermatology",
  "categoryColor": "#f4a261",
  "heroColor": "#fff8f5",
  "accentColor": "#6b9e8a",
  "tagline": "Restore your skin's colour naturally with homeopathic healing.",
  "overview": "Vitiligo (leucoderma) is an autoimmune condition causing loss of skin pigmentation in patches. It affects approximately 1–2% of India's population and can appear on any body part. While conventional treatment options are limited, homeopathy has shown meaningful results in stabilizing the condition and promoting repigmentation.",
  "whatIsIt": "In vitiligo, the immune system mistakenly destroys melanocytes — the cells that produce skin pigment (melanin). This causes white patches that are distinctly lighter than surrounding skin. The condition may be triggered by genetic factors, stress, thyroid disease, or autoimmune conditions. Homeopathy addresses the autoimmune dysregulation that drives melanocyte destruction.",
  "causes": [
    "Autoimmune destruction of melanocytes",
    "Genetic predisposition",
    "Thyroid disease (associated with vitiligo)",
    "Emotional stress or trauma as a trigger",
    "Other autoimmune diseases (type 1 diabetes, Addison's disease)",
    "Chemical exposure (certain industrial chemicals)"
  ],
  "symptoms": [
    "Flat, white patches on skin — commonly face, hands, feet, genitals",
    "White or premature greying of scalp hair, eyebrows, or eyelashes",
    "Loss of colour inside the mouth and nose",
    "Patches may spread slowly, rapidly, or remain stable",
    "Sunburn susceptibility in affected areas"
  ],
  "homeopathyExplanation": "Homeopathic treatment for vitiligo works on multiple levels: correcting the autoimmune response, addressing the emotional trigger, supporting thyroid function if affected, and stimulating residual melanocyte activity. Results are gradual — the first sign of improvement is usually arrest of spread, followed by pigment dots appearing at the edge of patches, which then fill in over time.",
  "treatmentPoints": [
    "Arrests the spread of new white patches",
    "Stimulates melanocyte regeneration from patch borders",
    "Addresses associated thyroid or autoimmune conditions",
    "Manages emotional triggers safely",
    "Safe for children, teenagers, and adults",
    "Can be used alongside UV phototherapy (PUVA/NB-UVB)"
  ],
  "keyRemedies": [
    {
      "name": "Arsenicum Sulphuratum Flavum",
      "indication": "Specific for vitiligo with spreading white patches; combined with constitutional remedy"
    },
    {
      "name": "Silicea",
      "indication": "Vitiligo in people with low immunity and nervous constitution; slow-healing skin"
    },
    {
      "name": "Phosphorus",
      "indication": "Vitiligo in sensitive, fair-skinned individuals; associated with anxiety"
    },
    {
      "name": "Natrum Muriaticum",
      "indication": "Vitiligo after grief, loss, or prolonged stress; associated with thyroid issues"
    },
    {
      "name": "Thyroidinum",
      "indication": "Vitiligo strongly associated with thyroid dysfunction"
    }
  ],
  "treatmentDuration": "12–24 months",
  "successRate": "60–70% arrest or repigmentation",
  "faqs": [
    {
      "q": "Can vitiligo be completely cured with homeopathy?",
      "a": "Complete repigmentation depends on the extent, duration, and individual response. Homeopathy reliably arrests the spread in most cases. Partial to significant repigmentation is achieved in many patients, especially when treatment begins early."
    },
    {
      "q": "How long before I see repigmentation?",
      "a": "Arrest of spread typically occurs within 3–6 months. Visible repigmentation usually begins after 6–12 months, starting as small pigment dots at the edge of patches."
    }
  ],
  "related": [
    {
      "title": "Psoriasis",
      "href": "/conditions/psoriasis"
    },
    {
      "title": "Thyroid Disorders",
      "href": "/conditions/thyroid"
    },
    {
      "title": "Skin Pigmentation",
      "href": "/conditions/skin-pigmentation"
    }
  ],
  "seoKeywords": [
    "vitiligo homeopathy kalyan",
    "leucoderma homeopathy treatment",
    "safed daag homeopathy",
    "vitiligo treatment mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
