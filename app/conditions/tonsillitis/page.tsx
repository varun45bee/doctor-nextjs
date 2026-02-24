import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Recurrent Tonsillitis Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Recurrent Tonsillitis in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. tonsillitis homeopathy kalyan, recurrent tonsils homeopathy.",
  keywords: ["tonsillitis homeopathy kalyan","recurrent tonsils homeopathy","tonsil surgery alternative homeopathy","tonsillitis child treatment mumbai"],
  openGraph: {
    title: "Recurrent Tonsillitis Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Recurrent Tonsillitis. Keep your tonsils. Heal them instead.",
  },
};

const data = {
  "slug": "tonsillitis",
  "title": "Recurrent Tonsillitis",
  "hindiTitle": "बार-बार टॉन्सिल्स",
  "marathiTitle": "वारंवार होणारी टॉन्सिलायटिस",
  "emoji": "🔴",
  "category": "ENT & Pediatric",
  "categoryColor": "#457b9d",
  "heroColor": "#f0f8ff",
  "accentColor": "#2d6a8f",
  "tagline": "Keep your tonsils. Heal them instead.",
  "overview": "Recurrent tonsillitis — particularly in children — leads many families to consider surgical removal (tonsillectomy). Homeopathy offers a compelling alternative: strengthening tonsillar immunity so infections stop recurring, eliminating the need for surgery in most cases.",
  "whatIsIt": "Tonsils are immune organs — the first line of defense against pathogens entering through the mouth and nose. When the immune system is weak, tonsils repeatedly become infected. Rather than removing these important immune organs, homeopathy strengthens the body's immunity so tonsils can perform their protective role without becoming infected.",
  "causes": [
    "Constitutional immune weakness",
    "Repeated exposure to Streptococcal bacteria",
    "Repeated antibiotic use weakening overall immunity",
    "Chronic mouth breathing from nasal congestion",
    "Adenoid hypertrophy compounding tonsil problems",
    "Dairy and cold food overconsumption (in susceptible children)"
  ],
  "symptoms": [
    "Sore, swollen tonsils — recurring every few weeks",
    "Difficulty swallowing due to enlarged tonsils",
    "Fever accompanying each episode",
    "White or yellow patches of pus on tonsils",
    "Tender lymph nodes in the neck",
    "Bad breath from tonsillar crypts",
    "Snoring or sleep apnea from chronically enlarged tonsils"
  ],
  "homeopathyExplanation": "Constitutional homeopathy addresses why the child's immune system repeatedly fails at the tonsil level. The remedy strengthens mucosal immunity in the throat, reducing bacterial adhesion and inflammatory response. Many children treated constitutionally go 6–12 months without a single episode — the tonsil surgery discussion then becomes unnecessary.",
  "treatmentPoints": [
    "Reduces tonsil infection frequency within 3 months",
    "Reduces tonsil size in chronically enlarged cases",
    "Eliminates need for tonsillectomy in most cases",
    "Improves sleep quality disrupted by enlarged tonsils",
    "Reduces associated adenoid issues",
    "Strengthens overall mucosal immunity"
  ],
  "keyRemedies": [
    {
      "name": "Baryta Carbonica",
      "indication": "Recurrent tonsillitis in shy, slow children; glandular swellings; worse from cold"
    },
    {
      "name": "Calcarea Carbonica",
      "indication": "Frequent tonsillitis in chubby, sweaty, anxious children; worse from cold"
    },
    {
      "name": "Lycopodium",
      "indication": "Recurrent tonsillitis worse on right side; associated with digestive issues"
    },
    {
      "name": "Belladonna",
      "indication": "Acute tonsillitis with sudden onset, high fever, red, swollen tonsils"
    },
    {
      "name": "Phytolacca",
      "indication": "Tonsillitis with dark-red, painful throat; pain radiating to ears; difficulty swallowing"
    }
  ],
  "treatmentDuration": "6–12 months",
  "successRate": "85%+ avoiding tonsillectomy",
  "faqs": [
    {
      "q": "Can homeopathy help during an acute tonsil attack?",
      "a": "Yes. Acute remedies like Belladonna, Hepar Sulph, or Phytolacca can provide significant relief during an acute episode and may reduce the severity and duration, sometimes avoiding antibiotics."
    },
    {
      "q": "At what age can children start homeopathic treatment?",
      "a": "Any age — including infants. Homeopathic remedies are completely safe from birth."
    }
  ],
  "related": [
    {
      "title": "Child Immunity",
      "href": "/conditions/child-immunity"
    },
    {
      "title": "Sinusitis",
      "href": "/conditions/sinusitis"
    },
    {
      "title": "Allergies & Asthma",
      "href": "/conditions/allergies-asthma"
    }
  ],
  "seoKeywords": [
    "tonsillitis homeopathy kalyan",
    "recurrent tonsils homeopathy",
    "tonsil surgery alternative homeopathy",
    "tonsillitis child treatment mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
