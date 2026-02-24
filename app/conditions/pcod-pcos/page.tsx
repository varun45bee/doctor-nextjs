import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "PCOD / PCOS Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for PCOD / PCOS in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. PCOD homeopathy kalyan, PCOS treatment homeopathy mumbai.",
  keywords: ["PCOD homeopathy kalyan","PCOS treatment homeopathy mumbai","PCOD natural treatment","pcos homeopathy doctor kalyan"],
  openGraph: {
    title: "PCOD / PCOS Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for PCOD / PCOS. Balance your hormones naturally — without lifelong medication.",
  },
};

const data = {
  "slug": "pcod-pcos",
  "title": "PCOD / PCOS",
  "hindiTitle": "पीसीओडी / पीसीओएस",
  "marathiTitle": "पीसीओडी / पीसीओएस",
  "emoji": "🌸",
  "category": "Women's Health",
  "categoryColor": "#e76f51",
  "heroColor": "#fff5f7",
  "accentColor": "#9e5e7f",
  "tagline": "Balance your hormones naturally — without lifelong medication.",
  "overview": "Polycystic Ovarian Disease (PCOD) affects 1 in 5 Indian women, making it the most common hormonal disorder of the reproductive age. PCOD causes cysts on the ovaries, menstrual irregularities, hormonal imbalance, and a cascade of symptoms affecting fertility, metabolism, skin, and mental health.",
  "whatIsIt": "In PCOD, the ovaries produce excess androgens (male hormones), disrupting the normal menstrual cycle and causing multiple small cysts to form. Conventional treatment — metformin, oral contraceptives, and clomiphene — manages symptoms without addressing the hormonal root. Homeopathy works to restore ovarian function, regulate hormonal balance, and normalize the menstrual cycle from within.",
  "causes": [
    "Insulin resistance — driving excess androgen production",
    "Hormonal imbalance: elevated LH, testosterone, and insulin",
    "Genetic predisposition (family history of PCOD/diabetes)",
    "Sedentary lifestyle and high-sugar diet",
    "Chronic stress elevating cortisol",
    "Thyroid dysfunction (frequently associated)",
    "Environmental endocrine disruptors"
  ],
  "symptoms": [
    "Irregular, missed, or very heavy periods",
    "Weight gain — especially around the abdomen",
    "Excess facial or body hair (hirsutism)",
    "Acne and oily skin",
    "Hair thinning on the scalp",
    "Difficulty conceiving",
    "Mood swings, anxiety, or depression"
  ],
  "homeopathyExplanation": "Homeopathy treats PCOD constitutionally — addressing the specific hormonal, metabolic, and emotional pattern unique to each woman. Rather than suppressing the cycle with synthetic hormones, homeopathic remedies stimulate the body's own hormonal intelligence to restore ovarian function. Treatment is combined with lifestyle and dietary guidance for optimal results.",
  "treatmentPoints": [
    "Regulates menstrual cycles naturally without OCP",
    "Reduces cyst count confirmed on ultrasound",
    "Improves insulin sensitivity and metabolic markers",
    "Addresses associated thyroid dysfunction",
    "Reduces acne, facial hair, and hair fall",
    "Supports fertility — many patients conceive naturally"
  ],
  "keyRemedies": [
    {
      "name": "Pulsatilla",
      "indication": "Irregular or suppressed periods; emotional, gentle constitution; worse from rich foods; weepy"
    },
    {
      "name": "Sepia",
      "indication": "Indifferent, worn-out women; irregular periods with dragging sensation; irritability"
    },
    {
      "name": "Calcarea Carbonica",
      "indication": "Overweight women with delayed periods; sweating on exertion; anxious, chilly"
    },
    {
      "name": "Lachesis",
      "indication": "PCOD with left-sided ovarian cysts; worse from sleep; talkative, jealous constitution"
    },
    {
      "name": "Thuja",
      "indication": "Fixed ideas, oily skin, multiple cysts; associated with vaccination history"
    }
  ],
  "treatmentDuration": "6–12 months",
  "successRate": "85%+ menstrual regulation",
  "faqs": [
    {
      "q": "Can PCOD be permanently cured with homeopathy?",
      "a": "Many women achieve complete hormonal regulation and remain symptom-free after completing treatment. PCOD has a constitutional component, so lifestyle maintenance is important. But yes, lasting remission is achievable."
    },
    {
      "q": "Can I conceive while on homeopathic treatment for PCOD?",
      "a": "Yes. Dr. Agale has helped many PCOD patients conceive naturally. The remedies are safe during pregnancy and are actually continued to support the pregnancy if needed."
    },
    {
      "q": "Do I need to stop the OCP to start homeopathy?",
      "a": "Not immediately. Treatment can begin alongside OCP. As your cycle normalizes, you can gradually taper the OCP under your gynecologist's guidance."
    }
  ],
  "related": [
    {
      "title": "Thyroid Disorders",
      "href": "/conditions/thyroid"
    },
    {
      "title": "Hormonal Imbalance",
      "href": "/conditions/hormonal-imbalance"
    },
    {
      "title": "Acne",
      "href": "/conditions/acne"
    }
  ],
  "seoKeywords": [
    "PCOD homeopathy kalyan",
    "PCOS treatment homeopathy mumbai",
    "PCOD natural treatment",
    "pcos homeopathy doctor kalyan"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
