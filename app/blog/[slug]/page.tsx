import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2 } from "lucide-react";
import { blogPosts, BlogPost } from "../blog-data";

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static paths for all blog posts
export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug: slug,
  }));
}

// Dynamic metadata generation
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = blogPosts[params.slug];
  
  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: `${post.title} | Dr. Pratima Agale Homeopathy Kalyan`,
    description: post.subtitle,
    openGraph: {
      title: post.title,
      description: post.subtitle,
      type: "article",
      authors: ["Dr. Pratima Agale"],
    },
  };
}

export default function BlogPostPage({ params }: PageProps) {
  const post = blogPosts[params.slug];

  if (!post) {
    notFound();
  }

  return (
    <article className="pt-24 pb-16 overflow-hidden">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sage-50 px-6 py-3 dark:bg-zinc-950 dark:border-zinc-800">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-sage-400">
          <Link href="/" className="hover:text-sage-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-sage-600 transition-colors">Knowledge Hub</Link>
          <span>/</span>
          <span className="text-sage-700 font-medium line-clamp-1 dark:text-zinc-300">{post.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div
        className="py-14 px-6 text-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-5">{post.emoji}</div>

          <div className="flex items-center justify-center gap-3 mb-5">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: "var(--sage-500, #5a7f5a)" }}
            >
              {post.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-sage-500">
              <Clock className="w-3 h-3" />
              {post.readTime} min read
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
            {post.title}
          </h1>

          {post.subtitle && (
            <p className="text-sage-600 text-lg mb-6 dark:text-zinc-400">{post.subtitle}</p>
          )}

          <div className="flex items-center justify-center gap-6 text-sm text-sage-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {post.publishDate}
            </span>
            <span>
              By{" "}
              <Link href="/about" className="font-medium text-sage-700 hover:text-sage-500 transition-colors dark:text-zinc-300">
                {post.author}, {post.authorCredentials}
              </Link>
            </span>
          </div>

          {/* Tags */}
          <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-sage-400" />
            {post.tags.map((tag) => (
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
            {/* Intro */}
            <div
              className="prose prose-sage max-w-none mb-10 dark:prose-invert"
              style={{ color: "var(--text-secondary)" }}
              dangerouslySetInnerHTML={{ __html: post.intro }}
            />

            {/* Key Points Highlight Box */}
            {post.keyPoints.length > 0 && (
              <div
                className="rounded-2xl p-6 mb-10 border border-sage-100 dark:border-zinc-800"
                style={{ backgroundColor: "var(--bg-surface-alt)" }}
              >
                <h3 className="font-semibold text-sage-900 mb-4 flex items-center gap-2 dark:text-zinc-100">
                  <span className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {post.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sage-700 text-sm dark:text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage-400 flex-shrink-0 mt-1.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sections */}
            {post.sections.map((section, i) => (
              <div key={i} className="mb-10">
                <h2
                  className="font-serif text-2xl md:text-3xl mb-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "var(--text-primary)",
                  }}
                >
                  {section.heading}
                </h2>
                <div
                  className="text-sage-700 leading-relaxed text-[0.97rem] dark:text-zinc-400"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}

            {/* Conclusion */}
            <div className="border-t border-sage-100 pt-8 mb-10 dark:border-zinc-800">
              <h2
                className="font-serif text-2xl mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
              >
                In Conclusion
              </h2>
              <div
                className="text-sage-700 leading-relaxed dark:text-zinc-400"
                dangerouslySetInnerHTML={{ __html: post.conclusion }}
              />
            </div>

            {/* FAQs */}
            {post.faqs.length > 0 && (
              <div className="mb-10">
                <h2
                  className="font-serif text-2xl mb-6"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
                >
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {post.faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group rounded-xl border border-sage-100 overflow-hidden dark:border-zinc-800"
                    >
                      <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-sage-900 hover:bg-sage-50 transition-colors list-none dark:text-zinc-200 dark:hover:bg-zinc-900">
                        {faq.q}
                        <span className="text-sage-400 group-open:rotate-180 transition-transform ml-4 flex-shrink-0">↓</span>
                      </summary>
                      <div className="px-5 pb-5 pt-3 text-sage-600 text-sm leading-relaxed border-t border-sage-50 dark:text-zinc-400 dark:border-zinc-800">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-3 py-6 border-t border-sage-100 dark:border-zinc-800">
              <Share2 className="w-4 h-4 text-sage-500" />
              <span className="text-sm text-sage-500 font-medium">Share this article:</span>
              {[
                { label: "WhatsApp", color: "#25D366", href: `https://wa.me/?text=${encodeURIComponent(post.title + " — Read at pratimaagale.in")}` },
                { label: "Facebook", color: "#1877F2", href: "#" },
                { label: "Twitter", color: "#1DA1F2", href: "#" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-full text-white text-xs font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: s.color }}
                >
                  {s.label}
                </a>
              ))}
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
                  {post.author}, {post.authorCredentials}
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
                href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Pratima%20Agale."
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

            {/* Related Conditions */}
            {post.relatedConditions.length > 0 && (
              <div className="rounded-2xl p-6 border border-sage-100 dark:border-zinc-800">
                <h3 className="font-semibold text-sage-900 mb-4 dark:text-zinc-100">Related Conditions</h3>
                <ul className="space-y-2">
                  {post.relatedConditions.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        className="text-sage-600 hover:text-sage-800 text-sm flex items-center gap-2 transition-colors dark:text-zinc-400 dark:hover:text-zinc-200"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-sage-300" />
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Articles */}
            {post.relatedArticles.length > 0 && (
              <div className="rounded-2xl p-6 border border-sage-100 dark:border-zinc-800">
                <h3 className="font-semibold text-sage-900 mb-4 dark:text-zinc-100">Read Next</h3>
                <ul className="space-y-2">
                  {post.relatedArticles.map((a) => (
                    <li key={a.href}>
                      <Link
                        href={a.href}
                        className="text-sage-600 hover:text-sage-800 text-sm flex items-center gap-2 transition-colors dark:text-zinc-400 dark:hover:text-zinc-200"
                      >
                        <ArrowRight className="w-3.5 h-3.5 text-sage-300" />
                        {a.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
