import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Acne & Pimples Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Acne & Pimples in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. acne homeopathy kalyan, pimple treatment homeopathy mumbai.",
  keywords: ["acne homeopathy kalyan","pimple treatment homeopathy mumbai","hormonal acne homeopathy","cystic acne natural treatment"],
  openGraph: {
    title: "Acne & Pimples Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Acne & Pimples. Clear skin starts from within — not from creams.",
  },
};

const data = {
  "slug": "acne",
  "title": "Acne & Pimples",
  "hindiTitle": "मुहांसे",
  "marathiTitle": "पुरळ / मुरुम",
  "emoji": "✨",
  "category": "Skin & Dermatology",
  "categoryColor": "#f4a261",
  "heroColor": "#fff8f5",
  "accentColor": "#6b9e8a",
  "tagline": "Clear skin starts from within — not from creams.",
  "overview": "Acne vulgaris is the most common skin condition in India, affecting 85% of teenagers and a significant number of adults. Beyond cosmetic concerns, acne causes emotional distress, reduced self-esteem, and can leave permanent scarring if not treated at the root.",
  "whatIsIt": "Acne develops when hair follicles become clogged with oil (sebum) and dead skin cells. Bacteria (C. acnes) multiply in these blocked pores, causing inflammation, pus formation, and nodules. In women, acne is frequently linked to hormonal fluctuations — PCOD, menstrual irregularities, and thyroid disorders are common underlying causes. Homeopathy addresses both the local skin condition AND the hormonal or constitutional factor driving it.",
  "causes": [
    "Hormonal fluctuations — puberty, menstrual cycle, PCOD",
    "Excess sebum (oil) production",
    "Bacterial proliferation (Cutibacterium acnes)",
    "Clogged hair follicles with dead skin cells",
    "Dietary factors: dairy, high-glycemic foods",
    "Stress elevating cortisol and sebum production",
    "Certain medications (steroids, contraceptive pills)",
    "Genetic predisposition"
  ],
  "symptoms": [
    "Whiteheads (closed clogged pores)",
    "Blackheads (open clogged pores)",
    "Painful papules (small red tender bumps)",
    "Pimples (pustules) — papules with pus at tips",
    "Nodules — large, painful, deep solid lumps",
    "Cystic lesions — painful, pus-filled lumps causing scars",
    "Post-acne pigmentation and scars"
  ],
  "homeopathyExplanation": "Homeopathy treats acne by addressing the internal factors — hormonal imbalance, sluggish liver function, digestive issues, and emotional stress — that manifest as acne on the skin. Each patient's acne is different: some have cystic nodules, others have hormonal breakouts around the chin, others have blackhead-dominant acne. The remedy is chosen based on your specific type, and constitutional factors.",
  "treatmentPoints": [
    "Regulates sebum production by correcting hormonal imbalance",
    "Reduces bacterial overgrowth naturally without antibiotics",
    "Addresses the gut-skin connection (digestive detoxification)",
    "Prevents scar formation by reducing deep nodular acne",
    "Treats hormonal acne alongside PCOD or thyroid issues",
    "No risk of antibiotic resistance or retinoid side effects"
  ],
  "keyRemedies": [
    {
      "name": "Pulsatilla",
      "indication": "Hormonal acne in young girls; worse before periods; rich food aggravates; emotional, weepy constitution"
    },
    {
      "name": "Silicea",
      "indication": "Suppurating, pus-forming acne; scars and keloids; timid constitution"
    },
    {
      "name": "Berberis Aquifolium",
      "indication": "Post-acne pigmentation and blotchy skin; clears skin complexion"
    },
    {
      "name": "Kali Bromatum",
      "indication": "Severe cystic acne on face, chest, shoulders; worse from grief or stress"
    },
    {
      "name": "Sulphur",
      "indication": "Oily, dirty-looking skin; very itching pimples; worse from heat; unhealthy skin that doesn't heal"
    }
  ],
  "treatmentDuration": "3–9 months",
  "successRate": "90%+ significant improvement",
  "faqs": [
    {
      "q": "Can homeopathy remove acne scars?",
      "a": "Homeopathy can prevent new scars by treating deep cystic acne before it scars. Remedies like Berberis Aquifolium, Silicea, and Thiosinaminum can gradually fade existing post-acne marks and improve skin texture over time."
    },
    {
      "q": "Will I need to change my diet during treatment?",
      "a": "Dietary guidance is part of Dr. Agale's holistic approach. Reducing dairy, sugar, and processed foods significantly supports homeopathic treatment for acne."
    },
    {
      "q": "How is homeopathic acne treatment different from antibiotics?",
      "a": "Antibiotics kill bacteria temporarily but don't address the underlying hormonal or digestive cause. Acne often returns after antibiotics, and long-term use leads to antibiotic resistance and gut dysbiosis. Homeopathy resolves the root cause for lasting clearance."
    }
  ],
  "related": [
    {
      "title": "PCOD / PCOS",
      "href": "/conditions/pcod-pcos"
    },
    {
      "title": "Hair Loss",
      "href": "/conditions/hair-loss"
    },
    {
      "title": "Skin Pigmentation",
      "href": "/conditions/skin-pigmentation"
    }
  ],
  "seoKeywords": [
    "acne homeopathy kalyan",
    "pimple treatment homeopathy mumbai",
    "hormonal acne homeopathy",
    "cystic acne natural treatment"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
