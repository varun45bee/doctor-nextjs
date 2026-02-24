import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Hypertension (High Blood Pressure) Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Hypertension (High Blood Pressure) in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. hypertension homeopathy kalyan, high blood pressure homeopathy.",
  keywords: ["hypertension homeopathy kalyan","high blood pressure homeopathy","bp treatment homeopathy mumbai","blood pressure natural treatment"],
  openGraph: {
    title: "Hypertension (High Blood Pressure) Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Hypertension (High Blood Pressure). Support healthy blood pressure — address stress and constitution.",
  },
};

const data = {
  "slug": "hypertension",
  "title": "Hypertension (High Blood Pressure)",
  "hindiTitle": "उच्च रक्तचाप",
  "marathiTitle": "उच्च रक्तदाब",
  "emoji": "❤️",
  "category": "Cardiovascular Health",
  "categoryColor": "#6a994e",
  "heroColor": "#f5fff8",
  "accentColor": "#5a7f5a",
  "tagline": "Support healthy blood pressure — address stress and constitution.",
  "overview": "Hypertension affects 200 million Indians and is a leading cause of stroke and heart disease. While antihypertensive medications are essential for control, homeopathy can play a supportive role — reducing stress-driven pressure spikes, addressing constitutional factors, and improving overall cardiovascular wellness.",
  "whatIsIt": "Hypertension involves persistently elevated blood pressure in the arteries. Essential hypertension (no identifiable cause) accounts for 90% of cases and is strongly influenced by stress, genetics, diet, and lifestyle. Homeopathy addresses the constitutional and emotional factors that contribute to blood pressure dysregulation.",
  "causes": [
    "Chronic stress and anxiety (most significant modifiable cause)",
    "High-sodium diet and obesity",
    "Genetic predisposition",
    "Sedentary lifestyle",
    "Kidney disease (secondary hypertension)",
    "Sleep apnea",
    "Certain medications (NSAIDs, OCP)"
  ],
  "symptoms": [
    "Often asymptomatic (silent killer)",
    "Headaches — especially early morning occipital",
    "Dizziness or lightheadedness",
    "Blurred or double vision",
    "Nosebleeds (epistaxis)",
    "Shortness of breath on exertion",
    "Palpitations"
  ],
  "homeopathyExplanation": "Homeopathic supportive care for hypertension focuses on reducing the stress-cardiovascular connection, addressing the constitutional personality type that drives hypertension (suppressed anger, work overload, perfectionism), and supporting overall vascular health. It does not replace antihypertensive medications — never stop or reduce them without medical supervision.",
  "treatmentPoints": [
    "Reduces stress-driven blood pressure elevation",
    "Addresses constitutional anger, suppression, and anxiety",
    "Supports heart and kidney function",
    "Helps manage associated conditions: obesity, diabetes",
    "Improves sleep quality (important for BP control)",
    "Used alongside antihypertensives safely"
  ],
  "keyRemedies": [
    {
      "name": "Rauwolfia Serpentina",
      "indication": "Mother tincture commonly used in homeopathic practice for blood pressure support"
    },
    {
      "name": "Natrum Muriaticum",
      "indication": "Hypertension in suppressed, grief-holding, salt-craving personalities"
    },
    {
      "name": "Lachesis",
      "indication": "Hypertension in talkative, suspicious, left-sided, menopausal women"
    },
    {
      "name": "Nux Vomica",
      "indication": "Stress-driven hypertension in driven, irritable, coffee-and-alcohol using executives"
    },
    {
      "name": "Glonoinum",
      "indication": "Congestive headache with pounding pulse; worse from heat; hypertensive headaches"
    }
  ],
  "treatmentDuration": "6–18 months supportive care",
  "successRate": "Improved BP stability alongside lifestyle modification",
  "faqs": [
    {
      "q": "Can I stop my BP medication if I start homeopathy?",
      "a": "Absolutely not without medical supervision. Homeopathy supports better BP control alongside medication. As your BP stabilizes consistently, your cardiologist may reduce medication. Never stop antihypertensives abruptly."
    }
  ],
  "related": [
    {
      "title": "Anxiety & Stress",
      "href": "/conditions/anxiety-stress"
    },
    {
      "title": "Diabetes Support",
      "href": "/conditions/diabetes-support"
    },
    {
      "title": "Obesity",
      "href": "/conditions/obesity"
    }
  ],
  "seoKeywords": [
    "hypertension homeopathy kalyan",
    "high blood pressure homeopathy",
    "bp treatment homeopathy mumbai",
    "blood pressure natural treatment"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
