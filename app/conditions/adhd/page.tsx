import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "ADHD & Behavioral Issues in Children Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for ADHD & Behavioral Issues in Children in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. ADHD homeopathy kalyan, child behavior homeopathy.",
  keywords: ["ADHD homeopathy kalyan","child behavior homeopathy","hyperactivity treatment homeopathy","ADHD natural treatment mumbai"],
  openGraph: {
    title: "ADHD & Behavioral Issues in Children Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for ADHD & Behavioral Issues in Children. Help your child focus and flourish — drug-free.",
  },
};

const data = {
  "slug": "adhd",
  "title": "ADHD & Behavioral Issues in Children",
  "hindiTitle": "ADHD / बच्चों में व्यवहार संबंधी समस्याएं",
  "marathiTitle": "ADHD / मुलांमधील वर्तणुकीच्या समस्या",
  "emoji": "🧠",
  "category": "Pediatric Care",
  "categoryColor": "#457b9d",
  "heroColor": "#f0f8ff",
  "accentColor": "#2d6a8f",
  "tagline": "Help your child focus and flourish — drug-free.",
  "overview": "ADHD (Attention Deficit Hyperactivity Disorder) is diagnosed in 5–10% of school-age children in India. Parents increasingly seek alternatives to stimulant medications — which cause appetite suppression, sleep difficulties, and growth concerns. Homeopathy offers a safe, individualized approach to supporting children with ADHD.",
  "whatIsIt": "ADHD is a neurodevelopmental condition characterized by inattention, hyperactivity, and impulsivity. It exists on a spectrum and manifests differently in each child. Rather than a single 'ADHD diagnosis,' homeopathy identifies the unique constitutional picture of the child — their specific fears, sensitivities, strengths, and weaknesses — and selects a remedy accordingly.",
  "causes": [
    "Neurological: differences in dopamine and norepinephrine regulation",
    "Genetic predisposition (family history)",
    "Prenatal factors: alcohol, tobacco exposure",
    "Premature birth or low birth weight",
    "Environmental toxins: lead exposure",
    "Excessive screen time in early development",
    "Food sensitivities (artificial colors, preservatives)"
  ],
  "symptoms": [
    "Difficulty sustaining attention on tasks or play",
    "Easily distracted by external stimuli",
    "Forgetfulness in daily activities",
    "Fidgeting, squirming, or inability to sit still",
    "Excessive talking and interrupting",
    "Difficulty waiting for their turn",
    "Impulsive decisions without thinking",
    "Emotional dysregulation — meltdowns"
  ],
  "homeopathyExplanation": "Homeopathic treatment for ADHD is profoundly individualized. The same 'ADHD' diagnosis in different children may need completely different remedies — because the nervous system constitution differs. Dr. Agale takes 90+ minutes for the first consultation with children, understanding their learning style, emotional triggers, sleep, diet, and family dynamics.",
  "treatmentPoints": [
    "Improves focus and attention span without stimulants",
    "Reduces hyperactivity and impulsive behavior",
    "Improves emotional regulation and meltdown frequency",
    "Enhances sleep quality in ADHD children",
    "Addresses anxiety and sensory sensitivity often co-existing",
    "No appetite suppression or growth effects"
  ],
  "keyRemedies": [
    {
      "name": "Tuberculinum",
      "indication": "Restless, destructive, defiant children; frequent colds; love of animals and outdoors"
    },
    {
      "name": "Stramonium",
      "indication": "Violent, fearful children; night terrors; may be seen in ADHD with trauma history"
    },
    {
      "name": "Hyoscyamus",
      "indication": "Silly, uninhibited behavior; jealousy; constant activity; talking nonsense"
    },
    {
      "name": "Medorrhinum",
      "indication": "Hyperactive, impulsive children; hurried; better at seaside; family history"
    },
    {
      "name": "Veratrum Album",
      "indication": "Extremely hyperactive; rapid speech; precocious behavior; cold perspiration"
    }
  ],
  "treatmentDuration": "9–18 months",
  "successRate": "75%+ significant behavioral improvement",
  "faqs": [
    {
      "q": "Should we stop Ritalin / Concerta before starting homeopathy?",
      "a": "No. Do not stop prescribed medication without your child's psychiatrist's guidance. Homeopathy begins alongside medication. As the child improves, the psychiatrist may reduce the stimulant dose."
    },
    {
      "q": "Does homeopathy help autism spectrum disorders too?",
      "a": "Homeopathy is used as a complementary approach for autism — addressing specific behavioral, sensory, and communication challenges. Results vary and are best combined with ABA therapy and educational support."
    }
  ],
  "related": [
    {
      "title": "Autism Support",
      "href": "/conditions/autism-support"
    },
    {
      "title": "Child Immunity",
      "href": "/conditions/child-immunity"
    },
    {
      "title": "Anxiety & Stress",
      "href": "/conditions/anxiety-stress"
    }
  ],
  "seoKeywords": [
    "ADHD homeopathy kalyan",
    "child behavior homeopathy",
    "hyperactivity treatment homeopathy",
    "ADHD natural treatment mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
