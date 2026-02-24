import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://pratimaagale.in";
  const now = new Date();

  const mainPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/about`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/services/womens-health`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/services/pediatric`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/services/chronic-disease`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/why-homeopathy`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/case-studies`, priority: 0.8, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/patient-journey`, priority: 0.7, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/contact`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/conditions`, priority: 0.9, changeFrequency: "monthly" as const },
  ];

  const conditionSlugs = [
    "pcod-pcos","thyroid","menopause","hormonal-imbalance","infertility",
    "adhd","child-immunity","autism-support","bedwetting","stammering",
    "arthritis","migraines","ibs-digestive","hypertension","obesity",
    "diabetes-support","anxiety-stress","piles-fissures","kidney-stones",
    "respiratory","sinusitis","tonsillitis","allergies-asthma","varicose-veins",
    "eczema","psoriasis","acne","urticaria","vitiligo","skin-pigmentation",
    "hair-loss","alopecia","warts","fungal-skin","rosacea","melasma",
    "dandruff","anemia",
  ];

  const conditionPages = conditionSlugs.map((slug) => ({
    url: `${baseUrl}/conditions/${slug}`,
    priority: 0.8 as const,
    changeFrequency: "monthly" as const,
  }));

  return [...mainPages, ...conditionPages].map((page) => ({
    ...page,
    lastModified: now,
  }));
}
