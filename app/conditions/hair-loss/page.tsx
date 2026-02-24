import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Hair Loss & Alopecia Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Hair Loss & Alopecia in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. hair loss homeopathy kalyan, alopecia areata homeopathy.",
  keywords: ["hair loss homeopathy kalyan","alopecia areata homeopathy","hair fall treatment mumbai","baal jhadna homeopathy"],
  openGraph: {
    title: "Hair Loss & Alopecia Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Hair Loss & Alopecia. Restore your hair by healing what causes the loss.",
  },
};

const data = {
  "slug": "hair-loss",
  "title": "Hair Loss & Alopecia",
  "hindiTitle": "बाल झड़ना",
  "marathiTitle": "केस गळणे",
  "emoji": "🌿",
  "category": "Skin & Hair",
  "categoryColor": "#f4a261",
  "heroColor": "#fff8f5",
  "accentColor": "#6b9e8a",
  "tagline": "Restore your hair by healing what causes the loss.",
  "overview": "Hair loss (alopecia) is one of the most distressing dermatological conditions, affecting millions of Indians across all age groups. Whether it's diffuse thinning, patchy bald spots, or receding hairlines, homeopathy offers a gentle, hormone-friendly approach to restoring hair health.",
  "whatIsIt": "Hair loss can be triggered by hormonal imbalances (especially thyroid and androgen excess in PCOD), nutritional deficiencies, autoimmune factors (alopecia areata), stress, postpartum changes, or scalp infections. Homeopathy identifies the specific underlying cause and treats it, rather than merely stimulating hair growth topically.",
  "causes": [
    "Hormonal: thyroid disorders, PCOD, postpartum changes",
    "Nutritional deficiencies: iron, zinc, biotin, vitamin D",
    "Alopecia areata — autoimmune hair loss in patches",
    "Androgenetic alopecia (genetic pattern hair loss)",
    "Chronic stress (telogen effluvium)",
    "Scalp infections: dandruff, fungal",
    "Side effects of medications (chemotherapy, antidepressants)"
  ],
  "symptoms": [
    "Gradual thinning on top of head",
    "Circular or patchy bald spots",
    "Sudden loosening of hair",
    "Full-body hair loss (in medical treatments)",
    "Patches of scaling on the scalp",
    "Hair loss on eyebrows or eyelashes (alopecia areata)"
  ],
  "homeopathyExplanation": "Homeopathy treats hair loss constitutionally — addressing the hormonal, nutritional, and emotional root. For alopecia areata (patchy loss), remedies work on the autoimmune component. For hormonal hair loss (PCOD/thyroid-related), treatment corrects the underlying endocrine imbalance. For stress-related telogen effluvium, constitutional remedies calm the nervous system and restore normal hair cycling.",
  "treatmentPoints": [
    "Corrects hormonal imbalance driving hair loss (PCOD, thyroid)",
    "Addresses autoimmune component in alopecia areata",
    "Reduces stress-triggered telogen effluvium",
    "Improves scalp circulation and follicle nourishment",
    "Safe during pregnancy and breastfeeding",
    "No hormonal side effects unlike DHT-blocking medications"
  ],
  "keyRemedies": [
    {
      "name": "Phosphorus",
      "indication": "Hair falling out in large bunches; sensitive, fine-haired constitution; after grief or stress"
    },
    {
      "name": "Natrum Muriaticum",
      "indication": "Hair loss after emotional grief; hair falls from roots; associated with hormonal issues"
    },
    {
      "name": "Lycopodium",
      "indication": "Premature baldness or greying; digestive issues accompanying hair loss; liver-related"
    },
    {
      "name": "Silicea",
      "indication": "Weak, brittle hair with scalp sweat; slow-growing, falling hair; low vitality"
    },
    {
      "name": "Fluoricum Acidum",
      "indication": "Alopecia areata with spots; hair grows slowly after falling; associated with syphilitic history"
    }
  ],
  "treatmentDuration": "6–12 months",
  "successRate": "75%+ significant regrowth",
  "faqs": [
    {
      "q": "Can homeopathy regrow hair in alopecia areata?",
      "a": "Yes, alopecia areata responds remarkably well to homeopathy. The autoimmune trigger that causes patchy hair loss is addressed constitutionally. Many patients see new hair growth within 3–6 months of treatment."
    },
    {
      "q": "Can I use homeopathy with minoxidil?",
      "a": "Yes. Homeopathy and minoxidil can be used together. As your hair strengthens over time, you can gradually reduce minoxidil dependence."
    },
    {
      "q": "Does postpartum hair loss need treatment?",
      "a": "Postpartum hair loss is often hormonal and self-limiting, but homeopathy can significantly speed recovery and prevent excessive loss. Remedies also support overall postpartum recovery."
    }
  ],
  "related": [
    {
      "title": "Thyroid Disorders",
      "href": "/conditions/thyroid"
    },
    {
      "title": "PCOD / PCOS",
      "href": "/conditions/pcod-pcos"
    },
    {
      "title": "Alopecia Areata",
      "href": "/conditions/alopecia"
    }
  ],
  "seoKeywords": [
    "hair loss homeopathy kalyan",
    "alopecia areata homeopathy",
    "hair fall treatment mumbai",
    "baal jhadna homeopathy"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
