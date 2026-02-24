import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Migraines & Chronic Headaches Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Migraines & Chronic Headaches in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. migraine homeopathy kalyan, headache homeopathy treatment.",
  keywords: ["migraine homeopathy kalyan","headache homeopathy treatment","migraine relief natural mumbai","chronic migraine homeopathy"],
  openGraph: {
    title: "Migraines & Chronic Headaches Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Migraines & Chronic Headaches. End the cycle of migraines — address the root, not just the pain.",
  },
};

const data = {
  "slug": "migraines",
  "title": "Migraines & Chronic Headaches",
  "hindiTitle": "माइग्रेन",
  "marathiTitle": "मायग्रेन",
  "emoji": "💆",
  "category": "Chronic Disease",
  "categoryColor": "#6a994e",
  "heroColor": "#f5fff8",
  "accentColor": "#5a7f5a",
  "tagline": "End the cycle of migraines — address the root, not just the pain.",
  "overview": "Migraines are debilitating neurological events affecting over 150 million Indians. Beyond the severe head pain, they cause nausea, vomiting, visual disturbances (aura), and can last 4–72 hours. Conventional pain medications provide temporary relief but don't reduce migraine frequency — and long-term NSAID or triptan use causes medication overuse headache.",
  "whatIsIt": "Migraines involve abnormal electrical activity in the brain followed by inflammatory changes in blood vessels. Triggers vary by individual: hormonal changes, specific foods, weather, stress, sleep disruption, or sensory stimuli. Homeopathy identifies your specific trigger pattern and constitutional type, selecting a remedy that desensitizes the nervous system to these triggers.",
  "causes": [
    "Hormonal fluctuations — common in women around menstruation",
    "Stress and emotional tension",
    "Sleep disruption (too much or too little)",
    "Food triggers: cheese, chocolate, caffeine, alcohol, MSG",
    "Sensory stimuli: bright lights, loud sounds, strong smells",
    "Weather changes — barometric pressure drops",
    "Dehydration and skipped meals"
  ],
  "symptoms": [
    "Moderate to severe throbbing or pulsating headache",
    "Usually on one side of the head",
    "Nausea and vomiting",
    "Extreme sensitivity to light (photophobia) and sound (phonophobia)",
    "Visual aura: zigzag lines, blind spots, or flashes",
    "Pain worsening with physical activity",
    "Postdrome: exhaustion, 'brain fog' for 24 hours after"
  ],
  "homeopathyExplanation": "Homeopathy treats migraines constitutionally — selecting a remedy that matches your specific migraine characteristics: which side, what triggers, what relieves, your constitution and stress patterns. Constitutional treatment gradually reduces the frequency, severity, and duration of migraines. Many patients go from 3/week to near-zero within 6 months.",
  "treatmentPoints": [
    "Reduces migraine frequency — not just acute pain relief",
    "Eliminates dependency on NSAIDs and triptans",
    "Prevents medication overuse headache",
    "Addresses the stress-neurological component",
    "Treats hormonal migraines (menstrual, perimenopausal)",
    "Safe for long-term preventive use"
  ],
  "keyRemedies": [
    {
      "name": "Iris Versicolor",
      "indication": "Migraines with visual aura; begins with blurring; associated with nausea and vomiting"
    },
    {
      "name": "Natrum Muriaticum",
      "indication": "Migraines from sun exposure or grief; hammering, throbbing; better lying in dark"
    },
    {
      "name": "Sanguinaria Canadensis",
      "indication": "Right-sided migraines starting from the neck; periodic; associated with flushing"
    },
    {
      "name": "Spigelia",
      "indication": "Left-sided migraines; stitching, neuralgic pain; worsened by touch and motion"
    },
    {
      "name": "Glonoinum",
      "indication": "Congestive headaches from heat or sun; throbbing, bursting sensation; can't bear heat to head"
    }
  ],
  "treatmentDuration": "4–10 months",
  "successRate": "85%+ significant frequency reduction",
  "faqs": [
    {
      "q": "Can homeopathy prevent migraines entirely?",
      "a": "Many patients achieve migraine-free periods of weeks to months with constitutional homeopathic treatment. Complete prevention depends on consistent treatment and trigger management. Frequency reduction of 70–90% is commonly achieved."
    },
    {
      "q": "What do I take during an acute migraine attack?",
      "a": "Dr. Agale prescribes both a constitutional remedy (daily/weekly) and an acute remedy for attacks. The acute remedy — like Iris Versicolor or Belladonna — can be taken at onset for significant relief."
    }
  ],
  "related": [
    {
      "title": "Anxiety & Stress",
      "href": "/conditions/anxiety-stress"
    },
    {
      "title": "Sinusitis",
      "href": "/conditions/sinusitis"
    },
    {
      "title": "Hormonal Imbalance",
      "href": "/conditions/hormonal-imbalance"
    }
  ],
  "seoKeywords": [
    "migraine homeopathy kalyan",
    "headache homeopathy treatment",
    "migraine relief natural mumbai",
    "chronic migraine homeopathy"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
