import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Stammering / Stuttering Homeopathy | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Homeopathic treatment for stammering and stuttering in children and adults in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — improve fluency naturally.",
  keywords: ["stammering homeopathy kalyan","stuttering treatment homeopathy","speech disorder homeopathy mumbai","stammering natural treatment"],
};

const data = {
  slug: "stammering",
  title: "Stammering / Stuttering",
  hindiTitle: "हकलाना / तुतलाना",
  marathiTitle: "तोतरेपणा",
  emoji: "🗣️",
  category: "Pediatric & General",
  categoryColor: "#5a7f5a",
  heroColor: "#f0f5ff",
  accentColor: "#5a7f5a",
  tagline: "Find your voice — naturally and confidently.",
  overview: "Stammering (stuttering) is a speech disorder characterized by repetitions, prolongations, or blocks in the flow of speech. It affects approximately 1% of the population and can significantly impact confidence, social life, and career. Homeopathy addresses both the neurological and psychological components of stammering.",
  whatIsIt: "Stammering involves disruptions in speech fluency — repeating sounds or words, prolonging sounds, or blocks where no sound comes out despite trying. It commonly develops in children ages 2–5, during rapid language development. Persistence into adulthood is associated with anxiety, low self-esteem, and neurological factors. Homeopathy works on all these levels.",
  causes: [
    "Neurological — differences in speech motor control",
    "Genetic factors (family history)",
    "Emotional trauma, shock, or fright in childhood",
    "Anxiety and fear (especially in new situations)",
    "Imitation of a stammering family member",
    "Pressure from parents or teachers about speaking",
    "Rapid language development outpacing motor coordination"
  ],
  symptoms: [
    "Repetition of words, syllables, or sounds ('b-b-b-but')",
    "Prolongation of sounds ('sssso')",
    "Blocks — silent pauses before words",
    "Eye blinks, facial tension during speech",
    "Avoidance of words or situations requiring speech",
    "Anxiety about speaking in public or on phone",
    "Worse under stress, excitement, or fatigue"
  ],
  homeopathyExplanation: "Homeopathy treats stammering constitutionally — addressing the underlying anxiety, emotional history, and neurological tendency. For children, the remedy is chosen based on the type of stammer, personality, and any triggering trauma. For adults, constitutional remedies often release deep-seated emotional blocks alongside improving speech fluency.",
  treatmentPoints: [
    "Reduces anxiety that triggers stammering",
    "Improves speech fluency and confidence",
    "Addresses emotional trauma at the root",
    "Works alongside speech therapy for best results",
    "Especially effective in children under 10",
    "No sedation or side effects unlike anxiety medications"
  ],
  keyRemedies: [
    { name: "Stramonium", indication: "Stammering from fright or trauma; violent, intense behavior; fear of dark" },
    { name: "Lachesis", indication: "Difficulty beginning speech, jumps from topic to topic; talkative personality stammering under pressure" },
    { name: "Hyoscyamus", indication: "Stammering with foolish behavior, laughing, and jealousy; worse from excitement" },
    { name: "Lycopodium", indication: "Stammering from anticipatory anxiety; fear of public speaking; good intellect, poor confidence" },
    { name: "Causticum", indication: "Stammering especially in children; associated with nervous system weakness; worse in excitement" }
  ],
  treatmentDuration: "6–18 months",
  successRate: "65–75% show significant improvement in fluency",
  faqs: [
    { q: "Can homeopathy cure stammering completely?", a: "For children treated early, significant improvement and sometimes complete resolution is possible. Adults typically experience improved fluency and greatly reduced anxiety around speaking, even if some stammer remains." },
    { q: "Should my child also see a speech therapist?", a: "Yes — homeopathy and speech therapy work synergistically. Homeopathy reduces anxiety and neurological tension, making speech therapy more effective." },
    { q: "My child stammers only when anxious. Is homeopathy useful?", a: "Absolutely. Anxiety-triggered stammering is one of the most responsive types to constitutional homeopathic treatment." }
  ],
  related: [
    { title: "ADHD", href: "/conditions/adhd" },
    { title: "Autism Spectrum Support", href: "/conditions/autism-support" },
    { title: "Anxiety & Stress", href: "/conditions/anxiety-stress" }
  ],
  seoKeywords: ["stammering homeopathy kalyan","stuttering treatment homeopathy","speech disorder homeopathy mumbai"]
};

export default function Page() { return <DiseasePage data={data} />; }
