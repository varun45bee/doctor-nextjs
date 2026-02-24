import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Child Immunity & Recurrent Infections Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Child Immunity & Recurrent Infections in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. child immunity homeopathy kalyan, recurrent infection child homeopathy.",
  keywords: ["child immunity homeopathy kalyan","recurrent infection child homeopathy","kids tonsillitis homeopathy","pediatric immunity mumbai"],
  openGraph: {
    title: "Child Immunity & Recurrent Infections Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Child Immunity & Recurrent Infections. Build your child's immune strength from within — naturally.",
  },
};

const data = {
  "slug": "child-immunity",
  "title": "Child Immunity & Recurrent Infections",
  "hindiTitle": "बच्चों की रोग प्रतिरोधक क्षमता",
  "marathiTitle": "मुलांची रोगप्रतिकारशक्ती",
  "emoji": "🌱",
  "category": "Pediatric Care",
  "categoryColor": "#457b9d",
  "heroColor": "#f0f8ff",
  "accentColor": "#2d6a8f",
  "tagline": "Build your child's immune strength from within — naturally.",
  "overview": "Children who fall sick repeatedly — every 2–4 weeks with throat infections, ear infections, coughs, or fevers — are not simply 'unlucky.' They have a constitutional immune weakness that can be corrected with homeopathy. Many parents reduce their child's antibiotic use by 80% or more after constitutional treatment.",
  "whatIsIt": "Recurrent infections in children reflect an immune system that hasn't learned to respond adequately to common pathogens. Each antibiotic course temporarily clears the infection but weakens gut immunity and allows resistant organisms to develop. Constitutional homeopathy strengthens the child's innate immune intelligence — reducing infection frequency without antibiotics.",
  "causes": [
    "Constitutional immune weakness",
    "Nutritional deficiencies: vitamin D, zinc, iron",
    "Daycare or school exposure to pathogens",
    "History of multiple antibiotic courses weakening gut immunity",
    "Suppressed skin conditions (eczema treated with steroids) driving respiratory symptoms",
    "Formula feeding (reduced maternal antibody transfer)"
  ],
  "symptoms": [
    "Falling sick every 2–4 weeks",
    "Recurrent tonsillitis or pharyngitis",
    "Frequent ear infections (otitis media)",
    "Recurrent chest colds or bronchitis",
    "Febrile fits in susceptible children",
    "Pale, tired appearance with poor appetite",
    "Delayed recovery from illness"
  ],
  "homeopathyExplanation": "Constitutional homeopathic treatment selects a remedy that matches the child's complete picture — not just the current illness but their personality, thermal sensitivity, food preferences, sleep patterns, and emotional responses. The remedy stimulates and educates the immune system, gradually reducing the frequency of infections.",
  "treatmentPoints": [
    "Reduces infection frequency within 2–3 months",
    "Eliminates need for repeated antibiotic courses",
    "Strengthens gut immunity (microbiome support)",
    "Improves appetite, energy, and growth",
    "Prevents otitis media complications (glue ear)",
    "Safe for newborns — no age restriction"
  ],
  "keyRemedies": [
    {
      "name": "Calcarea Carbonica",
      "indication": "Fat, sweaty children prone to cold, coughs; slow development; fear of dark"
    },
    {
      "name": "Tuberculinum",
      "indication": "Intercurrent remedy for recurrent respiratory infections; restless, dissatisfied children"
    },
    {
      "name": "Pulsatilla",
      "indication": "Gentle, weepy children with thick yellow-green discharges; worse in warm rooms"
    },
    {
      "name": "Silica",
      "indication": "Thin, weak children with low stamina; slow to heal; very sweaty head"
    },
    {
      "name": "Baryta Carbonica",
      "indication": "Recurrent tonsillitis with glandular swellings; shy, slow-developing children"
    }
  ],
  "treatmentDuration": "3–9 months",
  "successRate": "90%+ reduction in infection frequency",
  "faqs": [
    {
      "q": "Is it safe to vaccinate a child receiving homeopathy?",
      "a": "Yes. Homeopathic treatment does not interfere with vaccinations. Dr. Agale recommends following the standard vaccination schedule."
    },
    {
      "q": "What if my child gets sick during homeopathic treatment?",
      "a": "Intercurrent illnesses during treatment are expected and managed with acute homeopathic remedies. Antibiotics are used only when genuinely necessary (bacterial infections with specific criteria)."
    }
  ],
  "related": [
    {
      "title": "ADHD",
      "href": "/conditions/adhd"
    },
    {
      "title": "Allergies & Asthma",
      "href": "/conditions/allergies-asthma"
    },
    {
      "title": "Tonsillitis",
      "href": "/conditions/tonsillitis"
    }
  ],
  "seoKeywords": [
    "child immunity homeopathy kalyan",
    "recurrent infection child homeopathy",
    "kids tonsillitis homeopathy",
    "pediatric immunity mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
