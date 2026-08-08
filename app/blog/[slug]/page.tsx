import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2 } from "lucide-react";
import { getBlogBySlug } from "@/lib/firestore/blogs";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate FAQPage Schema
function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  if (!faqs || faqs.length === 0) return null;
  
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

// Dynamic metadata generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const blog = await getBlogBySlug(params.slug);
  
  if (!blog) {
    return {
      title: "Blog Post Not Found",
    };
  }

  const title = blog.metaTitle || `${blog.title} | Dr. Pratima Agale Homeopathy Kalyan`;
  const description = blog.metaDescription || blog.excerpt;
  const keywords = blog.keywords?.join(", ") || "";

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `https://www.pratimaagale.in/blog/${blog.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      url: `https://www.pratimaagale.in/blog/${blog.slug}`,
      images: blog.coverImage ? [{ url: blog.coverImage, width: 1200, height: 630 }] : [],
      authors: ["Dr. Pratima Agale"],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const blog = await getBlogBySlug(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <article className="pt-24 pb-16 overflow-hidden">
      <BreadcrumbSchema
        items={[
          { name: "Home", item: "https://www.pratimaagale.in" },
          { name: "Knowledge Hub", item: "https://www.pratimaagale.in/blog" },
          { name: blog.title, item: `https://www.pratimaagale.in/blog/${blog.slug}` },
        ]}
      />
      
      {/* FAQ Schema */}
      {blog.faqs && blog.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateFAQSchema(blog.faqs)) }}
        />
      )}
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sage-50 px-6 py-3 dark:bg-zinc-950 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-sage-400">
          <Link href="/" className="hover:text-sage-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-sage-600 transition-colors">Knowledge Hub</Link>
          <span>/</span>
          <span className="text-sage-700 font-medium line-clamp-1 dark:text-zinc-300">{blog.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div
        className="py-14 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          {blog.coverImage && (
            <img
              src={blog.coverImage}
              alt={blog.title}
              className="w-full h-64 object-cover rounded-2xl mb-6"
            />
          )}

          <div className="flex items-center justify-center gap-3 mb-5">
            {blog.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: "var(--sage-500, #5a7f5a)" }}
              >
                {tag}
              </span>
            ))}
            <span className="flex items-center gap-1 text-xs text-sage-500">
              <Calendar className="w-3 h-3" />
              {blog.createdAt?.toLocaleDateString() || "Recently"}
            </span>
          </div>

          <h1
            className="font-serif mb-5 leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "var(--text-primary)",
            }}
          >
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-sage-600 text-lg mb-6 dark:text-zinc-400">{blog.excerpt}</p>
          )}

          <div className="flex items-center justify-center gap-6 text-sm text-sage-500">
            <span>
              By{" "}
              <span className="font-medium text-sage-700 dark:text-zinc-300">
                {blog.author}
              </span>
            </span>
          </div>

          {/* Tags */}
          <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-sage-400" />
            {blog.tags.map((tag: string) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs bg-white border border-sage-100 text-sage-600 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div
              className="prose prose-sage max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* FAQ Section */}
            <FAQSection faqs={blog.faqs || []} />

            {/* Share */}
            <div className="flex items-center gap-3 py-6 border-t border-sage-100 dark:border-zinc-800">
              <Share2 className="w-4 h-4 text-sage-500" />
              <span className="text-sm text-sage-500 font-medium">Share this article:</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(blog.title + " — Read at www.pratimaagale.in")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-full text-white text-xs font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: "#25D366" }}
              >
                WhatsApp
              </a>
            </div>

            {/* Author box */}
            <div
              className="rounded-2xl p-6 flex gap-5 items-start"
              style={{ backgroundColor: "var(--bg-surface-alt)" }}
            >
              <div className="w-16 h-16 rounded-full bg-sage-200 flex items-center justify-center flex-shrink-0 text-3xl dark:bg-zinc-800">
                👩‍⚕️
              </div>
              <div>
                <div className="font-semibold text-sage-900 mb-1 dark:text-zinc-100">
                  {blog.author}
                </div>
                <p className="text-sage-600 text-sm leading-relaxed dark:text-zinc-400">
                  Dr. Pratima Agale is a qualified homeopathic physician with over 10 years of experience
                  treating patients in Kalyan, Andheri, and Mumbai. She specializes in women's health,
                  pediatric care, skin disorders, and chronic disease management.
                </p>
                <Link
                  href="/about"
                  className="text-sage-500 text-sm hover:text-sage-700 font-medium mt-2 inline-flex items-center gap-1 transition-colors"
                >
                  Learn more about Dr. Agale <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            {/* CTA */}
            <div className="rounded-2xl p-6 bg-sage-500 text-white sticky top-28">
              <div className="text-2xl mb-3">🌿</div>
              <h3 className="font-semibold mb-2">Ready to Start Healing?</h3>
              <p className="text-sage-100 text-sm mb-4">
                Book a consultation with Dr. Pratima Agale in Kalyan.
              </p>
              <a
                href="https://wa.me/917045532232?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Pratima%20Agale."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 text-center bg-white text-sage-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-cream-50 transition-all hover:shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  fill="#25D366"
                  className="w-4 h-4"
                >
                  <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.67 4.77 1.84 6.76L2 30l7.44-1.8A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.6l-.42-.25-4.42 1.07 1.1-4.3-.28-.44A11.47 11.47 0 0 1 4.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.3-8.57c-.34-.17-2.02-1-2.34-1.11-.32-.11-.55-.17-.78.17-.23.34-.9 1.11-1.1 1.34-.2.23-.40.25-.74.08-.34-.17-1.44-.53-2.74-1.69-1.01-.90-1.7-2.02-1.9-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.40.51-.60.17-.20.23-.34.34-.57.11-.23.06-.43-.03-.60-.08-.17-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.59h-.66c-.23 0-.60.08-.91.40-.32.32-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.10 2.02-.82 2.31-1.62.28-.80.28-1.48.20-1.62-.08-.14-.30-.22-.64-.39z" />
                </svg>
                Book Appointment
              </a>
              <a
                href="tel:+919359875511"
                className="block text-center border border-white/30 text-white py-2.5 rounded-xl font-medium text-sm mt-2 hover:bg-white/10 transition-all"
              >
                Call +91 93598 75511
              </a>
            </div>
          </aside>
        </div>

        {/* Back navigation */}
        <div className="border-t border-sage-100 mt-12 pt-8 dark:border-zinc-800">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sage-500 hover:text-sage-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Knowledge Hub
          </Link>
        </div>
      </div>
    </article>
  );
}
