import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Arthritis & Joint Pain Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Arthritis & Joint Pain in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. arthritis homeopathy kalyan, joint pain homeopathy treatment.",
  keywords: ["arthritis homeopathy kalyan","joint pain homeopathy treatment","rheumatoid arthritis homeopathy","gout homeopathy mumbai"],
  openGraph: {
    title: "Arthritis & Joint Pain Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Arthritis & Joint Pain. Move freely again — homeopathy for joints that actually works.",
  },
};

const data = {
  "slug": "arthritis",
  "title": "Arthritis & Joint Pain",
  "hindiTitle": "गठिया / जोड़ों का दर्द",
  "marathiTitle": "संधिवात",
  "emoji": "🦴",
  "category": "Chronic Disease",
  "categoryColor": "#6a994e",
  "heroColor": "#f5fff8",
  "accentColor": "#5a7f5a",
  "tagline": "Move freely again — homeopathy for joints that actually works.",
  "overview": "Arthritis — whether rheumatoid (autoimmune) or osteoarthritis (degenerative) — is among the most common chronic conditions in India, affecting 180 million people. Long-term NSAID use for arthritis carries serious GI and cardiovascular risks. Homeopathy offers effective pain relief and disease modification without these risks.",
  "whatIsIt": "Rheumatoid arthritis (RA) is an autoimmune disease causing joint inflammation, swelling, and destruction. Osteoarthritis (OA) involves cartilage breakdown from aging and wear. Gout causes uric acid crystal deposits in joints. Homeopathy treats each type differently — addressing the autoimmune component in RA, improving joint nutrition in OA, and correcting uric acid metabolism in gout.",
  "causes": [
    "Autoimmune dysfunction (rheumatoid arthritis)",
    "Cartilage degeneration with aging (osteoarthritis)",
    "Excess uric acid production or retention (gout)",
    "Genetic predisposition",
    "Obesity (increases joint load)",
    "Previous joint injuries",
    "Certain infections triggering reactive arthritis"
  ],
  "symptoms": [
    "Joint pain — can be constant or intermittent",
    "Morning stiffness lasting more than an hour (RA)",
    "Swollen, tender, warm joints",
    "Reduced range of motion",
    "Fatigue and malaise in rheumatoid arthritis",
    "Nodules under the skin (RA)",
    "Deformity in long-standing cases"
  ],
  "homeopathyExplanation": "Homeopathy treats arthritis at the constitutional level — addressing the immune dysregulation in RA, improving metabolic functioning in gout, and supporting joint tissue repair in OA. Remedies are chosen based on the modalities of your joint pain: what makes it better or worse, which joints are affected, your constitution, and associated features.",
  "treatmentPoints": [
    "Reduces joint inflammation without GI side effects",
    "Slows disease progression in rheumatoid arthritis",
    "Reduces uric acid levels in gout naturally",
    "Improves mobility and reduces morning stiffness",
    "Can be used alongside DMARDs or allows gradual tapering",
    "Addresses systemic features: fatigue, mood, sleep in RA"
  ],
  "keyRemedies": [
    {
      "name": "Rhus Toxicodendron",
      "indication": "Arthritis worse on first motion, better after continued movement; worse in cold, damp weather"
    },
    {
      "name": "Bryonia",
      "indication": "Arthritis worse from any motion; better from rest and firm pressure; dry, hot joints"
    },
    {
      "name": "Colchicum",
      "indication": "Gout with intensely sensitive joints; worse from touch and motion; nausea"
    },
    {
      "name": "Calcarea Fluorica",
      "indication": "Joints with bone spurs and hardening; stiffness with cracking; degenerative changes"
    },
    {
      "name": "Benzoic Acid",
      "indication": "Gout with highly offensive urine; joints with grinding and cracking"
    }
  ],
  "treatmentDuration": "6–18 months",
  "successRate": "80%+ pain and stiffness reduction",
  "faqs": [
    {
      "q": "Can homeopathy be taken with methotrexate or other DMARDs?",
      "a": "Yes. Homeopathy is safe alongside DMARDs and biologics. As your condition improves, your rheumatologist may be able to reduce the conventional medication dose. Never stop DMARDs without specialist guidance."
    }
  ],
  "related": [
    {
      "title": "Gout (Uric Acid)",
      "href": "/conditions/arthritis"
    },
    {
      "title": "Migraines",
      "href": "/conditions/migraines"
    },
    {
      "title": "Anxiety & Stress",
      "href": "/conditions/anxiety-stress"
    }
  ],
  "seoKeywords": [
    "arthritis homeopathy kalyan",
    "joint pain homeopathy treatment",
    "rheumatoid arthritis homeopathy",
    "gout homeopathy mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
