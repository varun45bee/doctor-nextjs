import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Anxiety & Stress Disorders Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Anxiety & Stress Disorders in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. anxiety homeopathy kalyan, stress homeopathy treatment.",
  keywords: ["anxiety homeopathy kalyan","stress homeopathy treatment","panic attack homeopathy","insomnia homeopathy mumbai"],
  openGraph: {
    title: "Anxiety & Stress Disorders Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Anxiety & Stress Disorders. Find calm from within — gentle healing for the anxious mind.",
  },
};

const data = {
  "slug": "anxiety-stress",
  "title": "Anxiety & Stress Disorders",
  "hindiTitle": "चिंता और तनाव",
  "marathiTitle": "चिंता आणि ताण",
  "emoji": "🧘",
  "category": "Mental & Emotional Health",
  "categoryColor": "#6a994e",
  "heroColor": "#f5fff8",
  "accentColor": "#5a7f5a",
  "tagline": "Find calm from within — gentle healing for the anxious mind.",
  "overview": "Anxiety disorders are the most common mental health conditions worldwide, affecting approximately 40 million Indians. Whether generalized anxiety, panic disorder, social anxiety, or stress-related insomnia — homeopathy offers a non-habit-forming, non-sedating approach to emotional healing.",
  "whatIsIt": "Anxiety involves the nervous system's inappropriate activation of the fight-or-flight response in the absence of real danger. It manifests physically (racing heart, tightness, sweating) and mentally (worry, fear, overthinking). Homeopathy addresses the constitutional sensitivity of the nervous system — why your particular nervous system overreacts — rather than just sedating the symptom.",
  "causes": [
    "Chronic stress and burnout",
    "Traumatic experiences or grief",
    "Constitutional nervous hypersensitivity",
    "Hormonal imbalances (thyroid, PCOD, menopause)",
    "Genetic predisposition to anxiety",
    "Poor sleep (anxiety-insomnia cycle)",
    "Certain medications or caffeine excess"
  ],
  "symptoms": [
    "Persistent worry or fear that's difficult to control",
    "Racing heart, chest tightness, or palpitations",
    "Sweating, trembling, or shaking",
    "Shortness of breath or feeling of choking",
    "Insomnia — difficulty falling or staying asleep",
    "Irritability and difficulty concentrating",
    "Physical symptoms: headaches, IBS, neck tension"
  ],
  "homeopathyExplanation": "Homeopathy is uniquely suited to anxiety because it is fundamentally a mind-body medicine. The remedy is chosen based on the exact nature of your anxiety — what you fear, when it's worst, what triggers it, your constitutional personality, and any physical symptoms accompanying the anxiety. Treatment gradually reduces nervous hypersensitivity without sedation or dependency.",
  "treatmentPoints": [
    "Reduces anxiety intensity and frequency without habit formation",
    "Improves sleep quality naturally",
    "Addresses panic attacks constitutionally",
    "Treats grief, trauma, and emotional loss",
    "Safe to use alongside therapy (CBT/counselling)",
    "No withdrawal effects — unlike benzodiazepines"
  ],
  "keyRemedies": [
    {
      "name": "Aconitum Napellus",
      "indication": "Sudden, intense fear and anxiety; panic attacks with fear of death; palpitations"
    },
    {
      "name": "Argentum Nitricum",
      "indication": "Anticipatory anxiety before events; phobias; impulsive, hurried; craving sweets"
    },
    {
      "name": "Arsenicum Album",
      "indication": "Anxiety with restlessness; fear of being alone; health anxiety; perfectionist constitution"
    },
    {
      "name": "Ignatia",
      "indication": "Anxiety and grief after loss or shock; sighing; mood swings; suppressed emotions"
    },
    {
      "name": "Phosphorus",
      "indication": "Anxiety in sensitive, empathetic people; fear of dark, thunder; need for company"
    }
  ],
  "treatmentDuration": "4–12 months",
  "successRate": "85%+ significant anxiety reduction",
  "faqs": [
    {
      "q": "Can homeopathy replace anti-anxiety medications?",
      "a": "Homeopathy can complement and, over time, reduce the need for anti-anxiety medications in many patients. Never stop prescribed medication abruptly. Work with Dr. Agale and your psychiatrist to taper gradually as you improve."
    },
    {
      "q": "Does homeopathy treat insomnia?",
      "a": "Yes. Insomnia responds very well to constitutional homeopathic treatment, especially when related to anxiety, stress, or hormonal changes. Remedies like Coffea Cruda, Passiflora, and Nux Vomica are commonly used."
    }
  ],
  "related": [
    {
      "title": "IBS & Digestive Disorders",
      "href": "/conditions/ibs-digestive"
    },
    {
      "title": "Migraines",
      "href": "/conditions/migraines"
    },
    {
      "title": "Child Immunity",
      "href": "/conditions/child-immunity"
    }
  ],
  "seoKeywords": [
    "anxiety homeopathy kalyan",
    "stress homeopathy treatment",
    "panic attack homeopathy",
    "insomnia homeopathy mumbai"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
