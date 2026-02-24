import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Obesity & Weight Management Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Obesity & Weight Management in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. obesity homeopathy kalyan, weight loss homeopathy treatment.",
  keywords: ["obesity homeopathy kalyan","weight loss homeopathy treatment","motapa homeopathy","weight management mumbai"],
  openGraph: {
    title: "Obesity & Weight Management Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Obesity & Weight Management. Address the root cause of weight gain — not just calories.",
  },
};

const data = {
  "slug": "obesity",
  "title": "Obesity & Weight Management",
  "hindiTitle": "मोटापा",
  "marathiTitle": "लठ्ठपणा",
  "emoji": "⚖️",
  "category": "Metabolic Health",
  "categoryColor": "#6a994e",
  "heroColor": "#f5fff8",
  "accentColor": "#5a7f5a",
  "tagline": "Address the root cause of weight gain — not just calories.",
  "overview": "Obesity in India has reached epidemic proportions. Beyond aesthetics, excess weight drives diabetes, heart disease, PCOD, sleep apnea, and joint problems. Homeopathy addresses the constitutional, hormonal, and emotional factors driving weight gain — making weight loss more achievable and sustainable.",
  "whatIsIt": "Obesity is rarely about willpower alone. It involves hormonal imbalances (thyroid, insulin resistance, cortisol), constitutional metabolic tendencies, emotional eating patterns, and gut health. Homeopathic treatment identifies and corrects these underlying factors, supporting healthy weight regulation from within.",
  "causes": [
    "Hypothyroidism slowing metabolism",
    "Insulin resistance (pre-diabetes, PCOD)",
    "Excess cortisol from chronic stress",
    "Constitutional sluggish metabolism",
    "Emotional eating and food addiction patterns",
    "Sedentary lifestyle and poor sleep",
    "Certain medications (steroids, antidepressants)"
  ],
  "symptoms": [
    "BMI over 25 (overweight) or 30 (obese)",
    "Fatigue and low energy",
    "Joint pains from excess weight",
    "Breathing difficulties",
    "Associated conditions: diabetes, PCOD, hypertension",
    "Emotional distress, low self-esteem"
  ],
  "homeopathyExplanation": "Homeopathy for weight management works by correcting the constitutional and hormonal factors driving weight accumulation. For thyroid-related obesity, thyroid function is supported. For stress-eating, the anxiety-eating cycle is addressed. For PCOD-related weight gain, hormonal balance is restored. The result is that diet and exercise become more effective.",
  "treatmentPoints": [
    "Corrects thyroid and hormonal causes of weight gain",
    "Reduces emotional and stress-triggered eating",
    "Improves metabolism constitutionally",
    "Addresses PCOD-related weight gain",
    "Supports gut health for better nutrient absorption",
    "Boosts energy enabling more physical activity"
  ],
  "keyRemedies": [
    {
      "name": "Calcarea Carbonica",
      "indication": "Obese, cold, sweaty; craves eggs and indigestible things; easily tired; anxious"
    },
    {
      "name": "Phytolacca",
      "indication": "Obesity with thyroid involvement; desire to lose weight but slow results"
    },
    {
      "name": "Antimonium Crudum",
      "indication": "Obesity in those who overeat; thick white tongue; sentimental, emotional"
    },
    {
      "name": "Graphites",
      "indication": "Obesity with sluggish digestion and constipation; cold, unhappy; skin problems"
    },
    {
      "name": "Lycopodium",
      "indication": "Abdominal bloating and weight; craves sweets; worse 4–8 PM; liver involvement"
    }
  ],
  "treatmentDuration": "9–18 months",
  "successRate": "Steady, sustainable weight reduction alongside lifestyle changes",
  "faqs": [
    {
      "q": "Will homeopathy alone help me lose weight?",
      "a": "Homeopathy is a powerful adjunct, not a standalone weight-loss tool. It works best combined with dietary improvements and moderate activity. The key difference is that constitutional treatment makes weight loss significantly easier by addressing the root hormonal and emotional barriers."
    }
  ],
  "related": [
    {
      "title": "Thyroid Disorders",
      "href": "/conditions/thyroid"
    },
    {
      "title": "PCOD / PCOS",
      "href": "/conditions/pcod-pcos"
    },
    {
      "title": "Diabetes Support",
      "href": "/conditions/diabetes-support"
    }
  ],
  "seoKeywords": [
    "obesity homeopathy kalyan",
    "weight loss homeopathy treatment",
    "motapa homeopathy",
    "weight management mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
