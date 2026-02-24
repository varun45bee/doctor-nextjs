import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Menopause Homeopathy Treatment | Hot Flashes, Mood Swings | Kalyan Mumbai",
  description: "Natural homeopathic relief for menopause symptoms — hot flashes, mood swings, sleep issues, joint pain in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD). No hormones needed.",
  keywords: ["menopause homeopathy kalyan","hot flashes treatment homeopathy","menopause natural treatment mumbai","perimenopause homeopathy"],
};

const data = {
  slug: "menopause",
  title: "Menopause",
  hindiTitle: "रजोनिवृत्ति (Menopause)",
  marathiTitle: "रजोनिवृत्ती (Menopause)",
  emoji: "🌙",
  category: "Women's Health",
  categoryColor: "#5a7f5a",
  heroColor: "#fdf4f7",
  accentColor: "#5a7f5a",
  tagline: "Navigate this transition with grace, strength, and natural support.",
  overview: "Menopause — the natural end of menstruation — is accompanied by hormonal shifts that can cause significant symptoms affecting quality of life. Conventional HRT carries risks. Homeopathy offers a safe, effective, hormone-free way to manage menopause symptoms and support this beautiful life transition.",
  whatIsIt: "Menopause is defined as 12 consecutive months without a menstrual period. The preceding perimenopause phase (2–10 years) often involves the most challenging symptoms. Falling estrogen and progesterone levels drive hot flashes, mood changes, sleep disruption, and joint pain. Homeopathy works with these changes rather than artificially replacing hormones.",
  causes: [
    "Natural decline in estrogen and progesterone production",
    "Perimenopause transition (typically ages 45–55 in India)",
    "Surgical menopause (after oophorectomy)",
    "Premature ovarian insufficiency (before age 40)",
    "Stress and lifestyle factors accelerating transition"
  ],
  symptoms: [
    "Hot flashes — sudden waves of heat and sweating",
    "Night sweats disrupting sleep",
    "Mood swings, irritability, anxiety",
    "Brain fog and memory difficulties",
    "Joint and muscle aches",
    "Vaginal dryness and low libido",
    "Weight gain, especially around abdomen",
    "Heart palpitations"
  ],
  homeopathyExplanation: "Homeopathy for menopause is deeply individualized. The remedy is chosen based on your dominant symptoms — whether you're primarily suffering hot flashes, mood changes, joint pain, or sleep issues — alongside your personality and constitutional type. This makes the treatment uniquely effective where one-size-fits-all HRT fails.",
  treatmentPoints: [
    "Reduces frequency and intensity of hot flashes",
    "Improves sleep quality significantly",
    "Stabilizes mood and reduces anxiety",
    "Relieves joint and muscle pains",
    "No breast cancer or clotting risk unlike HRT",
    "Supports bone health during transition",
    "Improves energy and sense of wellbeing"
  ],
  keyRemedies: [
    { name: "Lachesis", indication: "Intense hot flashes, worse after sleep, left-sided, talkative and jealous nature; cannot tolerate tight clothing" },
    { name: "Sepia", indication: "Hormonal exhaustion, hot flashes with sweating, indifference to loved ones, bearing-down sensation" },
    { name: "Graphites", indication: "Hot flashes with profuse sweating, weight gain, skin issues, constipation" },
    { name: "Sulphur", indication: "Intense heat throughout body, burning feet at night, hot flashes with perspiration" },
    { name: "Sanguinaria", indication: "Right-sided hot flashes, headaches at menopause, burning in palms and soles" }
  ],
  treatmentDuration: "6–18 months (through transition)",
  successRate: "90% experience significant symptom relief",
  faqs: [
    { q: "Is homeopathy as effective as HRT for hot flashes?", a: "Many women experience dramatic reduction in hot flash frequency and intensity with constitutional homeopathy. It's not identical to HRT but provides significant relief without the cancer and clotting risks." },
    { q: "Can homeopathy help premature menopause?", a: "Yes. Constitutional treatment supports ovarian function and hormone regulation in premature ovarian insufficiency, often delaying or reducing the severity of early menopause." },
    { q: "I'm already on HRT. Can I take homeopathy?", a: "Yes — homeopathy is safe alongside HRT. Many women use homeopathy to gradually reduce their HRT dose under their gynecologist's guidance." }
  ],
  related: [
    { title: "Hormonal Imbalance", href: "/conditions/hormonal-imbalance" },
    { title: "PCOD / PCOS", href: "/conditions/pcod-pcos" },
    { title: "Anxiety & Stress", href: "/conditions/anxiety-stress" }
  ],
  seoKeywords: ["menopause homeopathy kalyan","hot flashes treatment homeopathy","menopause natural treatment mumbai"]
};

export default function Page() { return <DiseasePage data={data} />; }
