import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Allergies & Asthma Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Allergies & Asthma in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. allergy homeopathy kalyan, asthma homeopathy treatment.",
  keywords: ["allergy homeopathy kalyan","asthma homeopathy treatment","dust allergy homeopathy","hay fever homeopathy mumbai"],
  openGraph: {
    title: "Allergies & Asthma Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Allergies & Asthma. Breathe freely — reduce allergic reactivity for good.",
  },
};

const data = {
  "slug": "allergies-asthma",
  "title": "Allergies & Asthma",
  "hindiTitle": "एलर्जी और अस्थमा",
  "marathiTitle": "ऍलर्जी आणि दमा",
  "emoji": "🌬️",
  "category": "Respiratory & Allergy",
  "categoryColor": "#6a994e",
  "heroColor": "#f5fff8",
  "accentColor": "#5a7f5a",
  "tagline": "Breathe freely — reduce allergic reactivity for good.",
  "overview": "Allergic rhinitis, seasonal allergies, and asthma are interconnected conditions affecting millions in India's polluted urban environment. Antihistamines and inhalers manage symptoms but don't change the underlying allergic sensitivity. Homeopathy systematically reduces immune hypersensitivity — with lasting results.",
  "whatIsIt": "Allergy and asthma represent an overactive immune response to harmless substances (allergens). The immune system misidentifies pollen, dust, pet dander, or foods as threats and triggers an inflammatory cascade. Constitutional homeopathic treatment addresses why your immune system overreacts — reducing allergic reactivity at its source.",
  "causes": [
    "Genetic atopic tendency",
    "Dust mites, pollen, pet dander, mold exposure",
    "Air pollution and chemical sensitivity",
    "Food allergens (dairy, nuts, shellfish)",
    "Cold or dry air triggering asthma",
    "Respiratory infections triggering exacerbations",
    "Emotional stress worsening allergic response"
  ],
  "symptoms": [
    "Sneezing fits, runny or blocked nose",
    "Itchy, watery eyes (allergic conjunctivitis)",
    "Skin reactions: urticaria, eczema flares",
    "Asthma: wheezing, chest tightness, breathlessness",
    "Coughing — especially at night or with exercise",
    "Post-nasal drip causing chronic throat clearing",
    "Fatigue from disturbed sleep due to nasal congestion"
  ],
  "homeopathyExplanation": "Homeopathy treats the allergic constitution — the immune system's tendency to overreact. Treatment is individualized to your specific pattern: which allergens trigger you, what makes your symptoms better or worse, your constitution, and any emotional factors. Over time, the body becomes less reactive to the same allergens.",
  "treatmentPoints": [
    "Reduces allergic hypersensitivity to dust, pollen, pet dander",
    "Decreases asthma attack frequency and severity",
    "Reduces dependence on antihistamines and inhalers",
    "Safe for children — prevents the 'atopic march'",
    "Seasonal allergy prevention with constitutional treatment",
    "Addresses sinusitis frequently accompanying allergies"
  ],
  "keyRemedies": [
    {
      "name": "Allium Cepa",
      "indication": "Watery, acrid nasal discharge; bland eye watering; worse in warm rooms"
    },
    {
      "name": "Arsenicum Album",
      "indication": "Thin, watery, burning nasal discharge; worse after midnight; anxious constitution"
    },
    {
      "name": "Natrum Muriaticum",
      "indication": "Allergic rhinitis with clear watery discharge like egg white; worse morning; sun-triggered"
    },
    {
      "name": "Sabadilla",
      "indication": "Violent, spasmodic sneezing; extreme nasal itch; hay fever"
    },
    {
      "name": "Blatta Orientalis",
      "indication": "Asthma with rattling mucus; worse from dust exposure; obesity associated"
    }
  ],
  "treatmentDuration": "6–18 months",
  "successRate": "80%+ significant allergy improvement",
  "faqs": [
    {
      "q": "Is homeopathy safe for children with asthma?",
      "a": "Yes — homeopathic remedies are ideal for children. They're safe even for infants and can be used alongside inhalers. As the child improves, inhaler use can be reduced under their pediatrician's guidance."
    }
  ],
  "related": [
    {
      "title": "Child Immunity",
      "href": "/conditions/child-immunity"
    },
    {
      "title": "Eczema",
      "href": "/conditions/eczema"
    },
    {
      "title": "Sinusitis",
      "href": "/conditions/sinusitis"
    }
  ],
  "seoKeywords": [
    "allergy homeopathy kalyan",
    "asthma homeopathy treatment",
    "dust allergy homeopathy",
    "hay fever homeopathy mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
