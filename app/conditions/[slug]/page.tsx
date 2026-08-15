import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DiseasePage from "@/components/DiseasePage";
import { getConditionBySlug } from "@/lib/sanity/queries";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const condition = await getConditionBySlug(params.slug);

  if (!condition) {
    return {
      title: "Condition Not Found",
    };
  }

  const title = condition.metaTitle || `${condition.name} | Dr. Pratima Agale Homeopathy Kalyan`;
  const description = condition.metaDescription || condition.description;
  const keywords = condition.keywords?.join(", ") || "";

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `https://www.pratimaagale.in/conditions/${condition.slug.current}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://www.pratimaagale.in/conditions/${condition.slug.current}`,
    },
  };
}

export default async function ConditionPage({ params }: PageProps) {
  const condition = await getConditionBySlug(params.slug);

  if (!condition) {
    notFound();
  }

  // Transform Sanity data to match DiseasePage interface
  const data = {
    slug: condition.slug.current,
    title: condition.name,
    hindiTitle: condition.name, // Will need localization fields in schema
    marathiTitle: condition.name, // Will need localization fields in schema
    emoji: condition.icon || "🌿",
    tagline: condition.hero?.subtitle || "",
    category: "Health Condition",
    categoryColor: "#5a7f5a",
    heroColor: "#f5f5f5",
    accentColor: "#5a7f5a",
    overview: condition.description || "",
    whatIsIt: condition.description || "",
    causes: condition.symptoms || [],
    symptoms: condition.symptoms || [],
    homeopathyExplanation: condition.treatmentApproach 
      ? Array.isArray(condition.treatmentApproach) 
        ? condition.treatmentApproach.map((block: any) => block.children?.map((c: any) => c.text).join("")).join(" ")
        : String(condition.treatmentApproach)
      : "",
    treatmentPoints: condition.symptoms || [],
    keyRemedies: [],
    treatmentDuration: "6-12 months",
    successRate: "85%+",
    faqs: condition.faqs?.map((faq: any) => ({ q: faq.question, a: faq.answer })) || [],
    related: condition.relatedConditions?.map((rel: any) => ({ title: rel.title, href: rel.href })) || [],
    seoKeywords: condition.keywords || [],
  };

  return <DiseasePage data={data} />;
}
