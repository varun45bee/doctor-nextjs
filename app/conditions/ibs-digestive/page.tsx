import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "IBS & Digestive Disorders Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for IBS & Digestive Disorders in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. IBS homeopathy kalyan, digestive disorder homeopathy.",
  keywords: ["IBS homeopathy kalyan","digestive disorder homeopathy","irritable bowel syndrome treatment mumbai","acidity homeopathy"],
  openGraph: {
    title: "IBS & Digestive Disorders Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for IBS & Digestive Disorders. Heal your gut — the foundation of total health.",
  },
};

const data = {
  "slug": "ibs-digestive",
  "title": "IBS & Digestive Disorders",
  "hindiTitle": "IBS / पाचन विकार",
  "marathiTitle": "IBS / पाचन विकार",
  "emoji": "🫃",
  "category": "Chronic Disease",
  "categoryColor": "#6a994e",
  "heroColor": "#f5fff8",
  "accentColor": "#5a7f5a",
  "tagline": "Heal your gut — the foundation of total health.",
  "overview": "Irritable Bowel Syndrome (IBS) and chronic digestive disorders affect approximately 20% of India's population. IBS — with its alternating constipation, diarrhea, bloating, and abdominal pain — significantly impairs quality of life. Homeopathy addresses the gut-mind connection that drives IBS more effectively than symptom-only treatments.",
  "whatIsIt": "IBS is a functional bowel disorder — the digestive system is structurally normal but functions incorrectly. It's driven by gut-brain axis dysregulation, visceral hypersensitivity, altered gut microbiome, and stress. Homeopathy treats the constitutional and emotional factors that perpetuate the gut-mind cycle in IBS.",
  "causes": [
    "Gut-brain axis dysregulation — stress signals affecting bowel function",
    "Visceral hypersensitivity — increased pain sensitivity in the gut",
    "Post-infectious IBS (after gastroenteritis)",
    "Food intolerances (gluten, dairy, FODMAPs)",
    "Altered gut microbiome",
    "Anxiety and depression (extremely common in IBS)",
    "Small intestinal bacterial overgrowth (SIBO)"
  ],
  "symptoms": [
    "Abdominal pain or cramping relieved by bowel movement",
    "Bloating and excess gas",
    "Diarrhea, constipation, or alternating between both",
    "Mucus in stool",
    "Urgency — sudden, intense need to defecate",
    "Incomplete evacuation feeling",
    "Symptoms triggered or worsened by stress"
  ],
  "homeopathyExplanation": "Homeopathy is ideal for IBS because it treats the whole person — including the anxiety, stress sensitivity, food responses, and emotional patterns that are inseparable from IBS. The remedy is chosen based on your specific bowel pattern, what triggers your symptoms, your constitutional type, and your emotional landscape. Treatment heals the gut-mind connection rather than just managing symptoms.",
  "treatmentPoints": [
    "Normalizes gut motility — whether IBS-D, IBS-C, or mixed",
    "Reduces visceral pain sensitivity",
    "Addresses the anxiety-IBS cycle holistically",
    "Improves gut microbiome balance",
    "Eliminates mucus and urgency",
    "Food tolerance improves with treatment"
  ],
  "keyRemedies": [
    {
      "name": "Nux Vomica",
      "indication": "IBS with urgency, ineffectual urging; worse in the morning; associated with stress, coffee, alcohol"
    },
    {
      "name": "Sulphur",
      "indication": "Diarrhea worse in morning driving patient out of bed; burning in rectum; hot constitution"
    },
    {
      "name": "Lycopodium",
      "indication": "Bloating after eating even small amounts; worse 4–8 PM; right-sided; anxious about health"
    },
    {
      "name": "Argentum Nitricum",
      "indication": "Diarrhea from anticipatory anxiety; craving sweet aggravates; impulsive constitution"
    },
    {
      "name": "Phosphorus",
      "indication": "Painless, profuse watery diarrhea; craving cold drinks; sensitive, empathetic constitution"
    }
  ],
  "treatmentDuration": "4–10 months",
  "successRate": "85%+ significant IBS improvement",
  "faqs": [
    {
      "q": "Does homeopathy help acid reflux (GERD)?",
      "a": "Yes. GERD, gastritis, and acid reflux respond well to homeopathic treatment. Remedies address acid hypersecretion, lower esophageal sphincter dysfunction, and dietary triggers. Most patients reduce antacid dependence significantly."
    }
  ],
  "related": [
    {
      "title": "Anxiety & Stress",
      "href": "/conditions/anxiety-stress"
    },
    {
      "title": "Obesity",
      "href": "/conditions/obesity"
    },
    {
      "title": "Piles / Fissures",
      "href": "/conditions/piles-fissures"
    }
  ],
  "seoKeywords": [
    "IBS homeopathy kalyan",
    "digestive disorder homeopathy",
    "irritable bowel syndrome treatment mumbai",
    "acidity homeopathy"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
