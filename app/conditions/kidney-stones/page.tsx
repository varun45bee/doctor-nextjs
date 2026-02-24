import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Kidney Stones Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Homeopathic treatment for kidney stones (renal calculi) in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — dissolve small stones naturally and prevent recurrence.",
  keywords: ["kidney stones homeopathy kalyan","renal calculi homeopathy mumbai","kidney stone natural treatment","pathri ka ilaj homeopathy"],
};

const data = {
  slug: "kidney-stones",
  title: "Kidney Stones",
  hindiTitle: "गुर्दे की पथरी (Kidney Stones)",
  marathiTitle: "मूत्रपिंडाचे खडे (Kidney Stones)",
  emoji: "🫘",
  category: "General Health",
  categoryColor: "#5a7f5a",
  heroColor: "#f0f8ff",
  accentColor: "#5a7f5a",
  tagline: "Dissolve stones naturally and prevent them from returning.",
  overview: "Kidney stones (renal calculi) are hard deposits of minerals and salts that form inside the kidneys. They are extremely painful and highly recurrent. Homeopathy can help dissolve small stones, relieve severe colic pain, and — most importantly — change the body's tendency to form stones, reducing recurrence significantly.",
  whatIsIt: "Kidney stones form when urine contains more crystal-forming substances (calcium, oxalate, uric acid) than the fluid can dilute. Stones smaller than 5mm often pass on their own; larger ones may need intervention. Homeopathy is most effective for stones under 8mm and for preventing recurrence of all sizes.",
  causes: [
    "Dehydration — concentrated urine",
    "High-oxalate diet (spinach, nuts, chocolate)",
    "High sodium or protein diet",
    "Hyperparathyroidism (elevated calcium)",
    "Repeated urinary tract infections (struvite stones)",
    "Gout — elevated uric acid (uric acid stones)",
    "Family history of stone formation"
  ],
  symptoms: [
    "Severe, cramping flank pain radiating to groin (renal colic)",
    "Blood in urine (hematuria) — pink or red urine",
    "Nausea and vomiting during acute attack",
    "Frequent, painful urination",
    "Burning sensation during urination",
    "Cloudy or foul-smelling urine",
    "Fever and chills (if infection present)"
  ],
  homeopathyExplanation: "Homeopathy works on three levels for kidney stones: acute treatment during colic (fast pain relief), litholytic action (helping small stones dissolve or pass), and constitutional treatment to correct the metabolic tendency that forms stones. This three-pronged approach is unique to homeopathy.",
  treatmentPoints: [
    "Relieves acute renal colic pain",
    "Promotes passage of small stones (under 8mm)",
    "Corrects uric acid, calcium, and oxalate metabolism",
    "Reduces recurrence dramatically",
    "Improves kidney function and urine composition",
    "Safe for long-term preventive use"
  ],
  keyRemedies: [
    { name: "Berberis Vulgaris", indication: "Most common kidney stone remedy — radiating pain from left kidney to groin, blood in urine" },
    { name: "Cantharis", indication: "Intense burning in urine, urging to urinate, blood in urine; cystitis alongside stones" },
    { name: "Lycopodium", indication: "Right-sided kidney stones, red sediment in urine, backache before urination" },
    { name: "Sarsaparilla", indication: "Severe pain at end of urination; white sandy sediment in urine" },
    { name: "Calcarea Carb", indication: "Tendency to form calcium stones; obese, chilly, anxious constitution" }
  ],
  treatmentDuration: "3–6 months for prevention; acute treatment immediate",
  successRate: "75% improvement in recurrence prevention",
  faqs: [
    { q: "Can homeopathy dissolve large kidney stones?", a: "Homeopathy is most effective for stones under 8mm. Larger stones may require urological intervention. However, homeopathy can be used alongside to reduce pain and prevent new stone formation." },
    { q: "How quickly does homeopathy work for acute renal colic?", a: "Acute remedies like Berberis Vulgaris can provide significant pain relief within 30–60 minutes of administration during a colic episode." },
    { q: "Will the stones come back after homeopathic treatment?", a: "Constitutional treatment significantly reduces the metabolic tendency to form stones. Most patients see dramatically reduced recurrence with 3–6 months of treatment." }
  ],
  related: [
    { title: "Obesity", href: "/conditions/obesity" },
    { title: "Hypertension", href: "/conditions/hypertension" },
    { title: "Digestive Disorders", href: "/conditions/ibs-digestive" }
  ],
  seoKeywords: ["kidney stones homeopathy kalyan","renal calculi homeopathy mumbai","kidney stone natural treatment"]
};

export default function Page() { return <DiseasePage data={data} />; }
