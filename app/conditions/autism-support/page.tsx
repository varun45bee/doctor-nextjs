import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Autism Spectrum Support | Homeopathy Kalyan Mumbai | Dr. Pratima Agale",
  description: "Complementary homeopathic support for autism spectrum disorder in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — improve communication, behavior, and sensory sensitivity naturally.",
  keywords: ["autism homeopathy kalyan","ASD homeopathy mumbai","autism natural treatment india","autism support homeopathy"],
};

const data = {
  slug: "autism-support",
  title: "Autism Spectrum Disorder",
  hindiTitle: "ऑटिज्म (ASD) सहायता",
  marathiTitle: "ऑटिझम (ASD) सहाय्य",
  emoji: "🌟",
  category: "Pediatric & Neurodevelopmental",
  categoryColor: "#5a7f5a",
  heroColor: "#f5f0ff",
  accentColor: "#5a7f5a",
  tagline: "Gentle support for every unique mind.",
  overview: "Autism Spectrum Disorder (ASD) is a neurodevelopmental condition affecting communication, social interaction, and behavior. Homeopathy offers safe, individualized complementary support — improving sensory regulation, speech, and emotional well-being without side effects. It works alongside therapy, not instead of it.",
  whatIsIt: "ASD is not a disease to be cured but a spectrum to be supported. Homeopathy does not claim to 'cure' autism, but it can significantly improve specific symptoms — including speech delay, hyperactivity, sensitivity, sleep disturbances, and emotional meltdowns — when treatment is individualized to the child's unique symptom picture.",
  causes: [
    "Genetic and neurological factors (primary)",
    "Immune and gut-brain axis dysregulation",
    "Environmental factors during early development",
    "Mitochondrial dysfunction in some cases",
    "Regression after vaccination in some cases (reported by parents)"
  ],
  symptoms: [
    "Delayed speech or language regression",
    "Limited eye contact and social interaction",
    "Repetitive behaviors (stimming)",
    "Sensory hypersensitivity (sound, light, touch, texture)",
    "Emotional meltdowns and rigidity",
    "Gastrointestinal issues (very common in ASD)",
    "Sleep disturbances"
  ],
  homeopathyExplanation: "Homeopathic treatment for ASD focuses on the individual child — their specific sensory sensitivities, behavioral patterns, digestive symptoms, sleep, and emotional responses. Constitutional remedies are chosen to improve overall nervous system regulation, reduce sensory overwhelm, and support communication. Treatment is gentle, safe, and can be used alongside ABA therapy, speech therapy, and other interventions.",
  treatmentPoints: [
    "Improves speech initiation and communication attempts",
    "Reduces sensory hypersensitivity and overwhelm",
    "Improves gut symptoms common in ASD children",
    "Reduces frequency and intensity of meltdowns",
    "Improves sleep quality",
    "Safe — no drug interactions with other therapies",
    "Works best when started early (ages 2–7)"
  ],
  keyRemedies: [
    { name: "Carcinosin", indication: "Obsessive behaviors, highly sensitive, family history of cancer; perfectionist traits" },
    { name: "Stramonium", indication: "Intense fear, violent outbursts, night terrors, speech difficulties" },
    { name: "Belladonna", indication: "Sudden aggressive episodes, hyperactivity, flushed face, sensitivity to light and noise" },
    { name: "Tuberculinum", indication: "Restless, destructive, desire to travel or change, recurrent respiratory infections alongside ASD" },
    { name: "Baryta Carb", indication: "Severe developmental delay, shy, dependent, speech very slow or absent" }
  ],
  treatmentDuration: "12–24 months (long-term support)",
  successRate: "70–80% of families report meaningful improvement in key symptoms",
  faqs: [
    { q: "Can homeopathy cure autism?", a: "Homeopathy does not claim to cure ASD. It is complementary support that helps manage specific symptoms — improving quality of life, communication, and sensory comfort. Best outcomes occur when used alongside speech, OT, and behavioral therapies." },
    { q: "At what age should we start?", a: "Earlier is better. Many parents see the best responses in children ages 2–7, though older children and teens also benefit." },
    { q: "Will homeopathic remedies interact with other medications?", a: "No. Homeopathic remedies are safe alongside any medications or therapies your child is receiving." }
  ],
  related: [
    { title: "ADHD", href: "/conditions/adhd" },
    { title: "Child Immunity", href: "/conditions/child-immunity" },
    { title: "Anxiety & Stress", href: "/conditions/anxiety-stress" }
  ],
  seoKeywords: ["autism homeopathy kalyan","ASD homeopathy mumbai","autism natural treatment india"]
};

export default function Page() { return <DiseasePage data={data} />; }
