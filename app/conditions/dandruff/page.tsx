import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Dandruff & Scalp Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Homeopathic treatment for chronic dandruff, seborrhoeic scalp, and scalp itching in Kalyan, Mumbai. Dr. Pratima Agale (BHMS MD) — clear scalp, healthy hair, naturally.",
  keywords: ["dandruff homeopathy kalyan","scalp treatment homeopathy mumbai","chronic dandruff natural treatment","seborrhoeic dermatitis scalp homeopathy"],
};

const data = {
  slug: "dandruff",
  title: "Chronic Dandruff",
  hindiTitle: "रूसी (Dandruff)",
  marathiTitle: "कोंडा (Dandruff)",
  emoji: "🌿",
  category: "Skin, Hair & Dermatology",
  categoryColor: "#5a7f5a",
  heroColor: "#f4f7f4",
  accentColor: "#5a7f5a",
  tagline: "A clear scalp is a healthy scalp — heal from within.",
  overview: "Dandruff affects up to 50% of adults at some point, but chronic, severe dandruff — with thick crusts, intense itching, and associated hair loss — requires constitutional treatment. Homeopathy addresses the scalp's immune environment, sebaceous gland function, and fungal susceptibility for lasting relief.",
  whatIsIt: "Dandruff (seborrhoeic dermatitis of the scalp) involves accelerated shedding of scalp skin cells, often triggered by the yeast Malassezia. Oily scalps provide fertile ground. Conventional anti-dandruff shampoos provide temporary relief but don't address why the scalp is producing excess oil or why the immune system isn't controlling Malassezia.",
  causes: [
    "Malassezia yeast overgrowth on oily scalps",
    "Sebaceous gland overactivity",
    "Stress and hormonal changes",
    "Nutritional deficiencies (zinc, B vitamins, omega-3)",
    "Harsh shampoos and chemical hair products",
    "Cold and dry weather",
    "Immune susceptibility (associated with psoriasis, eczema)"
  ],
  symptoms: [
    "White or yellowish flakes on scalp and shoulders",
    "Scalp itching — often intense",
    "Oily, red scalp between flakes",
    "Crusty patches in severe cases",
    "Associated hair thinning or hair fall",
    "Flaking in eyebrows and around nose (seborrhoeic)"
  ],
  homeopathyExplanation: "Constitutional homeopathic treatment addresses sebaceous overactivity, scalp immune environment, and any associated stress or nutritional factors. Specific scalp remedies reduce Malassezia overgrowth and normalize cell turnover. The result is a scalp that is genuinely healthy, not just chemically suppressed.",
  treatmentPoints: [
    "Normalizes sebaceous gland activity",
    "Reduces Malassezia overgrowth",
    "Decreases itching and flaking",
    "Addresses associated hair loss",
    "Improves scalp skin health constitutionally",
    "Safe for long-term use — no steroid scalp damage"
  ],
  keyRemedies: [
    { name: "Sulphur", indication: "Intense scalp itching, burning, dirty-looking dry scalp, worse from washing and heat" },
    { name: "Natrum Mur", indication: "Oily scalp with dandruff, hair loss at forehead, associated with grief or emotional stress" },
    { name: "Phosphorus", indication: "Profuse hair loss with dandruff, dandruff falling out in handfuls with hair" },
    { name: "Graphites", indication: "Sticky, thick crusts on scalp, yellow honey-like discharge, behind ears too" },
    { name: "Kali Sulphuricum", indication: "Yellow, sticky dandruff, scalp burning, worse in warm rooms" }
  ],
  treatmentDuration: "3–8 months",
  successRate: "80% achieve clear scalp",
  faqs: [
    { q: "Can I continue using anti-dandruff shampoo while taking homeopathy?", a: "Yes. Continue your shampoo while beginning treatment. As the scalp improves, you'll naturally need it less frequently." },
    { q: "Is dandruff always fungal?", a: "Not always — some dandruff is purely seborrhoeic or related to stress and diet. Homeopathic treatment addresses all causes." },
    { q: "My dandruff causes hair loss. Can homeopathy help both?", a: "Yes — constitutional remedies simultaneously address scalp health and follicle strength, helping both dandruff and associated hair fall." }
  ],
  related: [
    { title: "Hair Loss / Alopecia", href: "/conditions/alopecia" },
    { title: "Psoriasis", href: "/conditions/psoriasis" },
    { title: "Seborrhoeic Dermatitis", href: "/conditions/seborrhoeic-dermatitis" }
  ],
  seoKeywords: ["dandruff homeopathy kalyan","scalp treatment homeopathy mumbai","chronic dandruff natural treatment"]
};

export default function Page() { return <DiseasePage data={data} />; }
