import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Hormonal Imbalance Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Homeopathic treatment for hormonal imbalance in women — PMS, irregular periods, mood swings, in Kalyan, Andheri, Mumbai. Dr. Pratima Agale BHMS MD.",
  keywords: ["hormonal imbalance homeopathy kalyan","PMS homeopathy","irregular periods homeopathy","hormonal balance natural treatment mumbai"],
};

const data = {
  slug: "hormonal-imbalance",
  title: "Hormonal Imbalance",
  hindiTitle: "हार्मोनल असंतुलन",
  marathiTitle: "हार्मोनल असंतुलन",
  emoji: "⚖️",
  category: "Women's Health",
  categoryColor: "#5a7f5a",
  heroColor: "#fdf4f7",
  accentColor: "#5a7f5a",
  tagline: "Restore your hormonal harmony — naturally, gently, lastingly.",
  overview: "Hormonal imbalance is one of the most common yet underdiagnosed health issues in women today. It affects everything from mood and energy to skin, weight, fertility, and menstrual health. Homeopathy restores hormonal equilibrium by working with the body's endocrine system — not overriding it with synthetic hormones.",
  whatIsIt: "Hormones — estrogen, progesterone, thyroid, insulin, cortisol — are the body's chemical messengers governing nearly every function. When even one is out of balance, a cascade of symptoms follows. Conventional medicine often prescribes hormonal pills that mask symptoms without correcting the underlying imbalance. Homeopathy addresses the root dysregulation.",
  causes: [
    "Chronic stress elevating cortisol",
    "Poor diet, processed foods, and sugar",
    "Environmental toxins (xenoestrogens in plastics)",
    "Thyroid dysfunction",
    "PCOD / PCOS",
    "Birth control pills — disrupting natural cycles",
    "Perimenopause or menopause transition",
    "Insulin resistance / pre-diabetes"
  ],
  symptoms: [
    "Irregular, painful, or heavy periods",
    "PMS — mood swings, bloating, breast tenderness",
    "Unexplained weight gain or difficulty losing weight",
    "Acne, especially along jawline and chin",
    "Hair thinning or excess facial hair",
    "Fatigue and brain fog",
    "Low libido",
    "Anxiety, irritability, or depression"
  ],
  homeopathyExplanation: "Constitutional homeopathic treatment regulates the endocrine system by treating the whole woman — her symptoms, emotional state, stress response, and menstrual pattern. Remedies stimulate the hypothalamic-pituitary-ovarian axis to self-regulate, restoring natural hormonal rhythm without synthetic hormones.",
  treatmentPoints: [
    "Regulates menstrual cycle naturally",
    "Reduces PMS symptoms dramatically",
    "Supports thyroid-ovarian-adrenal axis",
    "Safe — no hormonal side effects",
    "Effective for PCOD, thyroid, and perimenopausal hormonal shifts",
    "Improves mood, energy, and skin alongside hormonal regulation"
  ],
  keyRemedies: [
    { name: "Pulsatilla", indication: "Irregular, changeable periods; weepy, clingy personality; symptoms better in open air" },
    { name: "Sepia", indication: "Hormonal exhaustion, indifference, irritability; irregular cycles; bearing-down sensation" },
    { name: "Lachesis", indication: "Premenstrual aggravation, jealous constitution, hot flushes, left-sided complaints" },
    { name: "Natrum Mur", indication: "Hormonal issues from grief or emotional suppression; irregular menses; headaches" },
    { name: "Calcarea Carb", indication: "Heavy periods, weight gain, chilly constitution, anxiety about health" }
  ],
  treatmentDuration: "4–12 months",
  successRate: "85% show significant hormonal improvement",
  faqs: [
    { q: "Can I stop birth control pills and use homeopathy instead?", a: "Always consult your gynecologist before stopping oral contraceptives. Homeopathy can support hormonal rebalancing during and after transition off the pill." },
    { q: "Does homeopathy work for PMS?", a: "Yes — PMS is one of the conditions that responds most dramatically to individualized homeopathic treatment. Many patients see improvement within 1–2 menstrual cycles." },
    { q: "Will treatment affect my fertility?", a: "Positively. Hormonal rebalancing through homeopathy improves ovulation regularity and uterine environment, supporting fertility naturally." }
  ],
  related: [
    { title: "PCOD / PCOS", href: "/conditions/pcod-pcos" },
    { title: "Thyroid Disorders", href: "/conditions/thyroid" },
    { title: "Menopause", href: "/conditions/menopause" }
  ],
  seoKeywords: ["hormonal imbalance homeopathy kalyan","PMS homeopathy","irregular periods homeopathy"]
};

export default function Page() { return <DiseasePage data={data} />; }
