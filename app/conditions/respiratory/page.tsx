import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Asthma & Respiratory Homeopathy | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Homeopathic treatment for asthma, chronic cough, bronchitis and respiratory issues in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — breathe freely and naturally.",
  keywords: ["asthma homeopathy kalyan","respiratory homeopathy mumbai","chronic cough homeopathy","bronchitis natural treatment kalyan"],
};

const data = {
  slug: "respiratory",
  title: "Asthma & Respiratory Conditions",
  hindiTitle: "दमा और श्वसन रोग",
  marathiTitle: "दमा आणि श्वसन विकार",
  emoji: "🫁",
  category: "Chronic & Lifestyle Diseases",
  categoryColor: "#5a7f5a",
  heroColor: "#f0f8ff",
  accentColor: "#5a7f5a",
  tagline: "Breathe freely — heal the lungs from the inside out.",
  overview: "Asthma, chronic bronchitis, and recurrent respiratory infections affect millions in India, worsened by pollution, humidity, and allergens in cities like Mumbai and Kalyan. Homeopathy reduces bronchial hypersensitivity, strengthens lung immunity, and decreases dependence on inhalers and steroids.",
  whatIsIt: "Asthma is a chronic inflammatory disease of the airways characterized by bronchospasm, wheezing, and breathlessness. Triggers include allergens, cold air, exercise, stress, and pollution. Conventional treatment suppresses inflammation with corticosteroids. Homeopathy reduces the immune hypersensitivity that makes airways react in the first place.",
  causes: [
    "Allergen sensitization (dust mites, pollen, pet dander, mold)",
    "Air pollution — worsened in Mumbai, Kalyan urban areas",
    "Recurrent respiratory infections in childhood",
    "Genetic predisposition (atopic family history)",
    "GERD (acid reflux) triggering airway inflammation",
    "Emotional stress and anxiety",
    "Occupational exposures (chemicals, dust)"
  ],
  symptoms: [
    "Wheezing — whistling sound when breathing",
    "Shortness of breath, especially at night or early morning",
    "Chest tightness and pressure",
    "Chronic cough — dry or productive",
    "Breathlessness on exertion",
    "Frequent respiratory infections",
    "Reduced exercise tolerance"
  ],
  homeopathyExplanation: "Homeopathic treatment for asthma addresses the bronchial hypersensitivity, allergic tendency, and emotional stressors simultaneously. Constitutional remedies work to desensitize the immune system to triggers and reduce airway inflammation. Patients typically experience fewer and milder attacks, better sleep, and reduced inhaler use over time.",
  treatmentPoints: [
    "Reduces frequency and severity of asthma attacks",
    "Decreases sensitivity to dust, pollen, and other triggers",
    "Reduces dependence on rescue inhalers",
    "Improves lung function and exercise capacity",
    "Addresses emotional triggers (anxiety-triggered asthma)",
    "Safe for children — unlike long-term steroid inhalers",
    "Works well for exercise-induced and seasonal asthma"
  ],
  keyRemedies: [
    { name: "Arsenicum Album", indication: "Asthma attacks midnight–2am, anxiety, restlessness, better sitting upright; worse cold" },
    { name: "Natrum Sulphur", indication: "Asthma worse in damp weather, associated with liver issues; worse 4–5am" },
    { name: "Ipecac", indication: "Asthma with intense nausea, loose rattling mucus, suffocating cough" },
    { name: "Antimonium Tart", indication: "Rattling bronchitis in elderly or children, inability to expectorate mucus" },
    { name: "Spongia", indication: "Dry barking cough, worse cold air, croup in children — cough sounds like a saw" }
  ],
  treatmentDuration: "8–18 months",
  successRate: "80% reduce inhaler use significantly",
  faqs: [
    { q: "Should I stop my inhaler during homeopathic treatment?", a: "Never stop your inhaler without medical advice. Homeopathy works alongside your inhaler. As lung function improves, your pulmonologist may reduce the dose. Never self-discontinue emergency medication." },
    { q: "Can children's asthma be cured with homeopathy?", a: "Many children treated constitutionally in childhood achieve long-term remission that extends into adulthood. Early treatment gives the best outcomes." },
    { q: "Does homeopathy work for exercise-induced asthma?", a: "Yes — constitutional treatment reduces bronchial sensitivity so that triggers like exercise, cold air, and emotions produce less or no reaction." }
  ],
  related: [
    { title: "Allergies", href: "/conditions/allergies-asthma" },
    { title: "Sinusitis", href: "/conditions/sinusitis" },
    { title: "Child Immunity", href: "/conditions/child-immunity" }
  ],
  seoKeywords: ["asthma homeopathy kalyan","respiratory homeopathy mumbai","chronic cough homeopathy"]
};

export default function Page() { return <DiseasePage data={data} />; }
