import type { Metadata } from "next";
import DiseasePage from "@/components/DiseasePage";

export const metadata: Metadata = {
  title: "Thyroid Disorders Homeopathy Treatment | Kalyan Mumbai | Dr. Pratima Agale",
  description: "Expert homeopathic treatment for Thyroid Disorders in Kalyan, Andheri & Mumbai. Dr. Pratima Agale (BHMS, MD) — natural, safe, individualized treatment. thyroid homeopathy kalyan, hypothyroidism homeopathy treatment.",
  keywords: ["thyroid homeopathy kalyan","hypothyroidism homeopathy treatment","thyroid natural treatment mumbai","hashimoto homeopathy"],
  openGraph: {
    title: "Thyroid Disorders Treatment in Kalyan | Dr. Pratima Agale Homeopathy",
    description: "Homeopathic treatment for Thyroid Disorders. Normalize your thyroid — reduce medication dependence naturally.",
  },
};

const data = {
  "slug": "thyroid",
  "title": "Thyroid Disorders",
  "hindiTitle": "थायराइड रोग",
  "marathiTitle": "थायरॉईड विकार",
  "emoji": "🦋",
  "category": "Women's Health",
  "categoryColor": "#e76f51",
  "heroColor": "#fff5f7",
  "accentColor": "#9e5e7f",
  "tagline": "Normalize your thyroid — reduce medication dependence naturally.",
  "overview": "Thyroid disorders — both hypothyroidism (underactive) and hyperthyroidism (overactive) — affect approximately 42 million Indians, with women disproportionately affected. Homeopathy offers a complementary approach to normalizing thyroid function and potentially reducing dependence on synthetic hormones.",
  "whatIsIt": "The thyroid gland regulates metabolism, energy, temperature, weight, mood, and reproductive function. When it underperforms (hypothyroidism), everything slows down. When overactive (hyperthyroidism), everything speeds up. Autoimmune thyroid conditions — Hashimoto's and Graves' disease — are the most common causes. Homeopathy addresses the autoimmune component and constitutional imbalance driving thyroid dysfunction.",
  "causes": [
    "Autoimmune: Hashimoto's thyroiditis (most common) or Graves' disease",
    "Iodine deficiency or excess",
    "Genetic predisposition",
    "Post-pregnancy thyroid changes (postpartum thyroiditis)",
    "Stress and adrenal-thyroid axis dysregulation",
    "Certain medications (lithium, amiodarone)",
    "Radiation to the neck area"
  ],
  "symptoms": [
    "Hypothyroidism: fatigue, weight gain, cold intolerance, constipation, depression, hair loss",
    "Hyperthyroidism: weight loss, palpitations, heat intolerance, anxiety, tremors, diarrhea",
    "Both: menstrual irregularities, mood changes, brain fog",
    "Hashimoto's: alternating hypo/hyper symptoms; goiter",
    "Graves': protruding eyes (exophthalmos), goiter, restlessness"
  ],
  "homeopathyExplanation": "Homeopathy treats the patient, not the TSH number. Constitutional remedies selected based on your complete symptom picture — physical, mental, and emotional — stimulate the thyroid to self-regulate. In autoimmune thyroid disease, remedies address the immune dysregulation at its root. Many patients see TSH normalization and are able to reduce their Thyroxine dose under their endocrinologist's supervision.",
  "treatmentPoints": [
    "Stimulates thyroid self-regulation rather than replacing it",
    "Corrects the autoimmune component in Hashimoto's/Graves'",
    "Reduces dependency on synthetic thyroid hormones over time",
    "Addresses hair loss, fatigue, and weight changes associated with thyroid",
    "Regulates menstrual cycles affected by thyroid dysfunction",
    "Improves mood, energy, and cognitive function"
  ],
  "keyRemedies": [
    {
      "name": "Calcarea Carbonica",
      "indication": "Hypothyroidism with obesity, cold sensitivity, sweating on exertion, anxious constitution"
    },
    {
      "name": "Iodum",
      "indication": "Hyperthyroidism with extreme hunger despite weight loss; restless, hot constitution"
    },
    {
      "name": "Lycopus Virginicus",
      "indication": "Hyperthyroidism with heart palpitations; exophthalmos; trembling"
    },
    {
      "name": "Natrum Muriaticum",
      "indication": "Thyroid with grief history; emaciated despite eating; hormonal dysregulation"
    },
    {
      "name": "Thyroidinum",
      "indication": "Specific organ support remedy for thyroid used in conjunction with constitutional remedy"
    }
  ],
  "treatmentDuration": "8–18 months",
  "successRate": "70%+ TSH normalization or dose reduction",
  "faqs": [
    {
      "q": "Should I stop Thyroxine when starting homeopathy?",
      "a": "Never stop Thyroxine without your endocrinologist's guidance. Homeopathy is started alongside Thyroxine. As TSH normalizes, your doctor will reduce the dose. This is a gradual process — never abrupt."
    },
    {
      "q": "Can homeopathy help Hashimoto's thyroiditis?",
      "a": "Yes. Hashimoto's is an autoimmune condition, and homeopathy is particularly well-suited to address autoimmune states. Constitutional treatment reduces antibody levels and stabilizes thyroid function over time."
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
      "title": "Hormonal Imbalance",
      "href": "/conditions/hormonal-imbalance"
    }
  ],
  "seoKeywords": [
    "thyroid homeopathy kalyan",
    "hypothyroidism homeopathy treatment",
    "thyroid natural treatment mumbai",
    "hashimoto homeopathy"
  ]
};

export default function Page() {
  return <DiseasePage data={data} />;
}
