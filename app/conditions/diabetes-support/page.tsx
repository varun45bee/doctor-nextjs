import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Diabetes (Supportive Homeopathic Care) Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Diabetes (Supportive Homeopathic Care) in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. diabetes homeopathy kalyan, sugar homeopathy treatment.",
  keywords: ["diabetes homeopathy kalyan","sugar homeopathy treatment","diabetic neuropathy homeopathy","diabetes support homeopathy mumbai"],
  openGraph: {
    title: "Diabetes (Supportive Homeopathic Care) Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Diabetes (Supportive Homeopathic Care). Support your diabetes management holistically and naturally.",
  },
};

const data = {
  "slug": "diabetes-support",
  "title": "Diabetes (Supportive Homeopathic Care)",
  "hindiTitle": "मधुमेह सहायक उपचार",
  "marathiTitle": "मधुमेह सहायक उपचार",
  "emoji": "🩸",
  "category": "Metabolic Health",
  "categoryColor": "#6a994e",
  "heroColor": "#f5fff8",
  "accentColor": "#5a7f5a",
  "tagline": "Support your diabetes management holistically and naturally.",
  "overview": "India is the diabetes capital of the world with 77 million diabetics. While homeopathy does not replace insulin or diabetes medication, it plays a powerful supportive role — improving insulin sensitivity, managing diabetic complications, and addressing the constitutional factors driving metabolic syndrome.",
  "whatIsIt": "Homeopathic supportive care for diabetes focuses on: improving cellular insulin sensitivity, managing associated conditions (neuropathy, nephropathy, retinopathy), addressing the metabolic constitution, and reducing diabetes-related stress and anxiety. It works alongside conventional anti-diabetic medication.",
  "causes": [
    "Genetic predisposition (family history)",
    "Insulin resistance from obesity and sedentary lifestyle",
    "Pancreatic beta-cell dysfunction",
    "Autoimmune beta-cell destruction (Type 1)",
    "Chronic stress and cortisol elevation",
    "High-glycemic diet",
    "PCOD-related metabolic syndrome"
  ],
  "symptoms": [
    "High fasting or post-meal blood sugar",
    "Increased thirst and urination",
    "Fatigue and weakness",
    "Blurred vision",
    "Slow wound healing",
    "Tingling or numbness in hands/feet (neuropathy)",
    "Recurrent infections (skin, urinary)"
  ],
  "homeopathyExplanation": "As a supportive therapy, homeopathy helps control blood sugar fluctuations, improves energy and wellbeing, addresses diabetic neuropathy pain, supports kidney function, and helps manage the emotional burden of living with a chronic disease. It also treats associated conditions like obesity, hypertension, and PCOD that drive metabolic syndrome.",
  "treatmentPoints": [
    "Supports better blood sugar control alongside medication",
    "Reduces diabetic neuropathy symptoms (tingling, numbness)",
    "Improves energy and reduces fatigue",
    "Supports kidney protection in early diabetic nephropathy",
    "Manages associated hypertension and obesity",
    "Reduces anxiety and stress worsening blood sugar control"
  ],
  "keyRemedies": [
    {
      "name": "Uranium Nitricum",
      "indication": "Diabetes with great thirst, large quantities of urine, weakness, and emaciation"
    },
    {
      "name": "Syzygium Jambolanum",
      "indication": "Supportive remedy for diabetes; reduces blood sugar; specific for diabetic ulcers"
    },
    {
      "name": "Phosphoric Acid",
      "indication": "Diabetes with extreme debility, weakness, and emotional exhaustion; grief-related"
    },
    {
      "name": "Plumbum Metallicum",
      "indication": "Diabetic neuropathy with paralytic weakness and numbness in extremities"
    },
    {
      "name": "Helonias",
      "indication": "Diabetes in women; associated with prolapse and uterine weakness; profound weakness"
    }
  ],
  "treatmentDuration": "Ongoing supportive care",
  "successRate": "Significant improvement in quality of life and complication management",
  "faqs": [
    {
      "q": "Can homeopathy cure Type 2 diabetes?",
      "a": "Homeopathy supports diabetes management rather than claiming cure. Many Type 2 patients achieve better blood sugar control with reduced medication alongside homeopathic treatment and lifestyle changes. Type 1 diabetes requires insulin — homeopathy supports but does not replace it."
    }
  ],
  "related": [
    {
      "title": "Obesity",
      "href": "/conditions/obesity"
    },
    {
      "title": "Hypertension",
      "href": "/conditions/hypertension"
    },
    {
      "title": "PCOD / PCOS",
      "href": "/conditions/pcod-pcos"
    }
  ],
  "seoKeywords": [
    "diabetes homeopathy kalyan",
    "sugar homeopathy treatment",
    "diabetic neuropathy homeopathy",
    "diabetes support homeopathy mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
