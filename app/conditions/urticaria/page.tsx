import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Urticaria (Hives / Allergy Rash) Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Urticaria (Hives / Allergy Rash) in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. urticaria homeopathy kalyan, hives homeopathy treatment.",
  keywords: ["urticaria homeopathy kalyan","hives homeopathy treatment","pitti homeopathy","chronic urticaria treatment mumbai"],
  openGraph: {
    title: "Urticaria (Hives / Allergy Rash) Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Urticaria (Hives / Allergy Rash). Stop the itch. End the cycle. Heal the allergy.",
  },
};

const data = {
  "slug": "urticaria",
  "title": "Urticaria (Hives / Allergy Rash)",
  "hindiTitle": "पित्ती / शीतपित्त",
  "marathiTitle": "अंगावर उठणाऱ्या गाठी",
  "emoji": "🌊",
  "category": "Skin & Allergy",
  "categoryColor": "#f4a261",
  "heroColor": "#fff8f5",
  "accentColor": "#6b9e8a",
  "tagline": "Stop the itch. End the cycle. Heal the allergy.",
  "overview": "Urticaria (hives) is an allergic skin reaction causing sudden onset of raised, itchy welts (wheals) on the skin. Chronic urticaria — lasting more than 6 weeks — affects millions of Indians and is notoriously difficult to treat with antihistamines alone, as it tends to recur once medication stops.",
  "whatIsIt": "Urticaria occurs when immune cells release histamine and other chemicals, causing blood vessels to leak fluid into the skin and form wheals. Triggers include foods, medications, infections, temperature changes, stress, or autoimmune factors. Homeopathy identifies and desensitizes the body's allergic reactivity, reducing the frequency and severity of episodes.",
  "causes": [
    "Food allergens: shellfish, nuts, eggs, dairy, artificial additives",
    "Medications: aspirin, NSAIDs, penicillin",
    "Infections: viral or bacterial",
    "Physical triggers: heat, cold, pressure, exercise",
    "Stress and emotional upset",
    "Autoimmune urticaria (immune system attacking mast cells)",
    "Insect stings or bites"
  ],
  "symptoms": [
    "Raised, itchy welts of varying size and shape",
    "Welts that appear red, pink, or skin-coloured",
    "Welts that move location — appearing and disappearing within hours",
    "Burning or stinging sensation",
    "Angioedema — swelling of deeper skin layers (face, lips, throat)",
    "In chronic urticaria: episodes recurring for weeks, months, or years"
  ],
  "homeopathyExplanation": "Homeopathy is highly effective for chronic urticaria because it treats the allergic constitution — not just the histamine response. Treatment identifies what makes your particular urticaria worse (heat, cold, stress, certain foods), your general constitutional type, and any emotional triggers. The remedy gradually reduces the body's hypersensitivity so that triggers stop causing reactions.",
  "treatmentPoints": [
    "Reduces the frequency and intensity of urticaria episodes",
    "Desensitizes the body to known triggers",
    "Eliminates dependence on daily antihistamines",
    "Addresses stress-triggered urticaria through constitutional treatment",
    "Prevents angioedema (dangerous throat swelling)",
    "Safe, non-sedating — unlike antihistamines"
  ],
  "keyRemedies": [
    {
      "name": "Apis Mellifica",
      "indication": "Burning, stinging urticaria better from cold; associated with swelling (angioedema)"
    },
    {
      "name": "Rhus Toxicodendron",
      "indication": "Urticaria worse from cold, better from warmth; associated with joint pains"
    },
    {
      "name": "Urtica Urens",
      "indication": "Urticaria from shellfish; intensely itching; associated with gout"
    },
    {
      "name": "Natrum Muriaticum",
      "indication": "Urticaria from heat and sun; white wheals; associated with emotional grief"
    },
    {
      "name": "Dulcamara",
      "indication": "Urticaria worse in cold, damp weather; associated with seasonal changes"
    }
  ],
  "treatmentDuration": "3–9 months",
  "successRate": "85%+ resolution of chronic urticaria",
  "faqs": [
    {
      "q": "Can homeopathy permanently stop chronic urticaria?",
      "a": "Yes. Chronic urticaria, which often persists for years on antihistamines alone, responds very well to constitutional homeopathic treatment. Most patients achieve lasting freedom from episodes within 6–9 months."
    }
  ],
  "related": [
    {
      "title": "Allergies & Asthma",
      "href": "/conditions/allergies-asthma"
    },
    {
      "title": "Eczema",
      "href": "/conditions/eczema"
    },
    {
      "title": "Psoriasis",
      "href": "/conditions/psoriasis"
    }
  ],
  "seoKeywords": [
    "urticaria homeopathy kalyan",
    "hives homeopathy treatment",
    "pitti homeopathy",
    "chronic urticaria treatment mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
