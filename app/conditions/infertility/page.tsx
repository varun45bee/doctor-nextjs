import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Infertility Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Natural homeopathic support for infertility in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — supports ovulation, hormonal balance, and fertility naturally. Safe alongside IVF.",
  keywords: ["infertility homeopathy kalyan","fertility treatment homeopathy mumbai","PCOS infertility homeopathy","natural fertility support india"],
};

const data = {
  slug: "infertility",
  title: "Infertility Support",
  hindiTitle: "बांझपन (इन्फर्टिलिटी) सहायता",
  marathiTitle: "वंध्यत्व (इन्फर्टिलिटी) सहाय्य",
  emoji: "✨",
  category: "Women's Health",
  categoryColor: "#5a7f5a",
  heroColor: "#fdf4f7",
  accentColor: "#5a7f5a",
  tagline: "Supporting your journey to parenthood — naturally and holistically.",
  overview: "Infertility affects 1 in 6 couples in India. While IVF and ART procedures are available, homeopathy offers gentle, natural support for couples trying to conceive — improving hormonal balance, ovulation, sperm health, and reducing the stress that impacts fertility.",
  whatIsIt: "Infertility is defined as inability to conceive after 12 months of unprotected intercourse (or 6 months for women over 35). Causes may be female (ovulation disorders, blocked tubes, PCOS, endometriosis), male (sperm issues), or unexplained. Homeopathy addresses multiple root causes simultaneously and improves overall reproductive health.",
  causes: [
    "PCOS / PCOD — anovulation",
    "Thyroid disorders affecting ovulation",
    "Blocked fallopian tubes",
    "Endometriosis",
    "Male factor — low sperm count, poor motility",
    "Unexplained infertility (hormonal microimbalances)",
    "Stress and anxiety (affects cortisol, disrupting ovulation)"
  ],
  symptoms: [
    "Inability to conceive after trying for 1+ year",
    "Irregular or absent ovulation",
    "Irregular menstrual cycles",
    "History of PCOS, thyroid, or endometriosis",
    "Recurrent miscarriages (habitual abortion)",
    "Male partner with low sperm count or poor motility"
  ],
  homeopathyExplanation: "Homeopathy supports fertility by restoring hormonal balance, improving ovulation regularity, and reducing stress hormones that suppress fertility. For PCOS-related infertility, constitutional remedies regulate the ovarian-pituitary axis. For unexplained infertility, the individualized constitutional approach often reveals and corrects subtle imbalances that lab tests miss.",
  treatmentPoints: [
    "Regulates ovulation in PCOS and hormonal infertility",
    "Improves uterine lining quality",
    "Reduces stress that suppresses reproductive hormones",
    "Supports male factor — improves sperm parameters",
    "Safe to use alongside IVF protocols",
    "Addresses habitual miscarriage constitutionally"
  ],
  keyRemedies: [
    { name: "Sepia", indication: "Hormonal exhaustion, irregular or absent cycles, bearing-down sensation, indifference" },
    { name: "Pulsatilla", indication: "Irregular ovulation, weepy temperament, late or suppressed periods" },
    { name: "Natrum Mur", indication: "Infertility after grief or emotional suppression, irregular cycles" },
    { name: "Agnus Castus", indication: "Loss of sexual desire, weakness, low libido (male and female)" },
    { name: "Calcarea Carb", indication: "PCOS-type infertility, overweight, anxious, heavy periods" }
  ],
  treatmentDuration: "6–18 months",
  successRate: "65–75% of couples with hormonal infertility achieve conception",
  faqs: [
    { q: "Can homeopathy increase chances of IVF success?", a: "Many couples use homeopathy alongside IVF to reduce stress, improve hormonal environment, and improve uterine receptivity. There is anecdotal and growing clinical evidence supporting this approach." },
    { q: "Can homeopathy help with male infertility?", a: "Yes. Constitutional remedies improve sperm count, motility, and morphology, especially when no anatomical cause is found." },
    { q: "How long should I try homeopathy before IVF?", a: "For women under 35 with hormonal causes, 6–12 months of homeopathic treatment is reasonable before IVF. For women over 38, we typically pursue parallel approaches." }
  ],
  related: [
    { title: "PCOD / PCOS", href: "/conditions/pcod-pcos" },
    { title: "Hormonal Imbalance", href: "/conditions/hormonal-imbalance" },
    { title: "Thyroid Disorders", href: "/conditions/thyroid" }
  ],
  seoKeywords: ["infertility homeopathy kalyan","fertility treatment homeopathy mumbai","PCOS infertility homeopathy"]
};

export default function Page() { return <DiseasePage data={data} />; }
