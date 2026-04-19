/**
 * ─────────────────────────────────────────────────────────
 *  BLOG POST TEMPLATE — Dr. Pratima Agale Homeopathy
 * ─────────────────────────────────────────────────────────
 *
 * HOW TO CREATE A NEW BLOG POST:
 *
 * 1. Copy this folder (app/blog/_template) to a new folder:
 *    e.g., app/blog/pcod-homeopathy-guide/
 *
 * 2. Rename the copy to your article's URL slug:
 *    ✅ app/blog/monsoon-allergy-homeopathy-tips/
 *    ✅ app/blog/thyroid-homeopathy-kalyan/
 *    ❌ Don't use spaces or uppercase in folder names
 *
 * 3. Edit the "blogData" object below with your content.
 *
 * 4. Run `npm run dev` to preview at:
 *    http://localhost:3000/blog/your-slug
 *
 * ─────────────────────────────────────────────────────────
 *  SEO TIPS FOR BLOG POSTS:
 *
 *  - Title: Include your main keyword + "Kalyan" or "Mumbai"
 *    e.g., "PCOD Homeopathy Treatment Kalyan: Complete Guide"
 *
 *  - Description: 150–160 chars. Include condition + location + Dr. name.
 *
 *  - Keywords: 5–8 long-tail keywords patients actually search for.
 *
 *  - Content: Aim for 800–2000 words per article.
 *
 *  - Internal links: Always link to related condition pages!
 *
 * ─────────────────────────────────────────────────────────
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag, Share2 } from "lucide-react";

// ═══════════════════════════════════════════════
// STEP 1: UPDATE SEO METADATA
// ═══════════════════════════════════════════════
export const metadata: Metadata = {
  title: "[YOUR ARTICLE TITLE] | Dr. Pratima Agale Homeopathy Kalyan",
  description: "[150–160 character description. Include: condition + treatment approach + location. E.g.: 'Discover how homeopathy treats PCOD naturally in Kalyan. Dr. Pratima Agale explains causes, remedies, and what to expect.']",
  keywords: [
    "[keyword 1 - main condition + homeopathy]",
    "[keyword 2 - condition + kalyan or mumbai]",
    "[keyword 3 - natural treatment for condition]",
    "[keyword 4 - Hindi keyword if applicable]",
    "[keyword 5 - question-based keyword]",
  ],
  openGraph: {
    title: "[YOUR ARTICLE TITLE] | Dr. Pratima Agale",
    description: "[Short 1–2 sentence description for social sharing]",
    type: "article",
    authors: ["Dr. Pratima Agale"],
    // publishedTime: "2025-01-15T00:00:00Z",  // Update with publish date
  },
};

// ═══════════════════════════════════════════════
// STEP 2: FILL IN BLOG POST DATA
// ═══════════════════════════════════════════════
const blogData = {
  // Basic info
  title: "Your Article Headline Here — Make It Compelling",
  subtitle: "Optional subtitle or tagline for the article",
  category: "Women's Health", // Options: Women's Health | Pediatric Care | Chronic Disease | Skin & Hair | Seasonal Health | Homeopathy Education | Case Studies
  publishDate: "January 15, 2025",
  readTime: "7 min",
  author: "Dr. Pratima Agale",
  authorCredentials: "BHMS, MD (Homeopathy)",
  emoji: "🌸", // Emoji representing the topic

  // Featured image (add to public/blog-images/ folder)
  // image: "/blog-images/your-article-image.jpg",
  // imageAlt: "Descriptive alt text for SEO",

  // Tags for filtering
  tags: ["PCOD", "Women's Health", "Homeopathy", "Kalyan"],

  // INTRODUCTION (2–3 paragraphs)
  intro: `
    [Write 2–3 engaging opening paragraphs here. Hook the reader immediately with a relatable statement or surprising fact. Example:]

    Every month, thousands of women in Kalyan and Mumbai visit doctors for the same complaint — irregular periods, weight gain, facial hair, and the diagnosis that follows: PCOD. Polycystic Ovarian Disease affects 1 in 5 Indian women, yet most receive the same prescription: oral contraceptive pills.

    But what if there was a way to address PCOD without suppressing your natural hormones? A way that worked with your body's intelligence rather than overriding it? That's what homeopathic constitutional treatment offers — and in this guide, Dr. Pratima Agale explains exactly how it works.
  `,

  // MAIN SECTIONS — add as many as needed
  sections: [
    {
      heading: "What Exactly Is PCOD / PCOS?",
      content: `
        [Write detailed, informative content for each section. Aim for 150–300 words per section. 
        Include facts, statistics, and practical information that educates the reader.]

        PCOD (Polycystic Ovarian Disease) involves the development of multiple small cysts on the ovaries, leading to hormonal imbalance. The ovaries produce excess androgens (male hormones), disrupting ovulation and causing the characteristic symptoms of irregular periods, acne, and excess facial hair.

        PCOS (Polycystic Ovarian Syndrome) is the broader syndrome including metabolic dysfunction — insulin resistance, weight gain, and increased diabetes risk. Understanding which aspect dominates guides the homeopathic prescription.
      `,
    },
    {
      heading: "Why Does Conventional Treatment Often Fall Short?",
      content: `
        [Add your section content here. Always be balanced — don't dismiss allopathy, 
        but explain homeopathy's unique advantages.]
      `,
    },
    {
      heading: "How Homeopathy Treats PCOD Differently",
      content: `
        [Explain the homeopathic approach. Mention constitutional treatment, individualization, and the remedies used (with explanation, not medical advice).]
      `,
    },
    {
      heading: "What to Expect During Treatment",
      content: `
        [Set realistic expectations. Timeline, what improvement looks like, follow-up process.]
      `,
    },
  ],

  // KEY TAKEAWAYS / BULLET POINTS (shown as a highlight box)
  keyPoints: [
    "PCOD affects 1 in 5 Indian women and is a leading cause of infertility",
    "Homeopathy addresses hormonal imbalance at the root — not just symptoms",
    "Constitutional treatment regulates menstrual cycles naturally",
    "Treatment duration: typically 6–12 months for significant improvement",
    "Safe to use alongside conventional medical monitoring",
  ],

  // CLOSING / CONCLUSION
  conclusion: `
    [Write a 1–2 paragraph conclusion that summarizes the key message and ends with a clear call-to-action. Example:]

    PCOD is a complex condition, but it doesn't have to be a lifelong struggle managed only with hormonal pills. Homeopathy offers a genuine path to hormonal balance — working with your body, not against it. With patience, individualized treatment, and the right constitutional remedy, many of Dr. Agale's patients have achieved regular cycles, cleared skin, and even natural conception.

    If you're tired of the PCOD cycle and ready to explore a natural approach, book a consultation with Dr. Pratima Agale at her Kalyan clinic today.
  `,

  // FAQS (optional but great for SEO — people also ask)
  faqs: [
    {
      q: "Can homeopathy cure PCOD permanently?",
      a: "Homeopathy can bring PCOD into long-term remission for many women. 'Permanent' depends on the individual — but sustained hormonal balance without medications is the goal, and many patients achieve this.",
    },
    {
      q: "How long does homeopathic treatment for PCOD take?",
      a: "Most patients see initial improvement (more regular cycles, reduced symptoms) within 3–4 months. Full hormonal rebalancing typically takes 8–18 months.",
    },
    {
      q: "Is homeopathy safe if I'm trying to conceive with PCOD?",
      a: "Yes — homeopathy is completely safe during the preconception period and often improves fertility outcomes by restoring ovulation.",
    },
  ],

  // RELATED CONTENT (internal links — important for SEO)
  relatedConditions: [
    { title: "PCOD / PCOS Treatment", href: "/conditions/pcod-pcos" },
    { title: "Hormonal Imbalance", href: "/conditions/hormonal-imbalance" },
    { title: "Thyroid Disorders", href: "/conditions/thyroid" },
  ],
  relatedArticles: [
    { title: "How Homeopathy Works: The Science Explained", href: "/why-homeopathy" },
    { title: "Patient Journey: What to Expect", href: "/patient-journey" },
  ],
};

// ═══════════════════════════════════════════════
// STEP 3: DON'T EDIT BELOW — This is the layout
// ═══════════════════════════════════════════════
export default function BlogPostPage() {
  return (
    <article className="pt-24 pb-16 overflow-hidden">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sage-50 px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-sage-400">
          <Link href="/" className="hover:text-sage-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-sage-600 transition-colors">Knowledge Hub</Link>
          <span>/</span>
          <span className="text-sage-700 font-medium line-clamp-1">{blogData.title}</span>
        </div>
      </div>

      {/* Hero */}
      <div
        className="py-14 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #f4f7f4, #faf3e6)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-5">{blogData.emoji}</div>

          <div className="flex items-center justify-center gap-3 mb-5">
            <span
              className="px-3 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: "#5a7f5a" }}
            >
              {blogData.category}
            </span>
            <span className="flex items-center gap-1 text-xs text-sage-500">
              <Clock className="w-3 h-3" />
              {blogData.readTime} read
            </span>
          </div>

          <h1
            className="font-serif mb-5 leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "#1e2820",
            }}
          >
            {blogData.title}
          </h1>

          {blogData.subtitle && (
            <p className="text-sage-600 text-lg mb-6">{blogData.subtitle}</p>
          )}

          <div className="flex items-center justify-center gap-6 text-sm text-sage-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {blogData.publishDate}
            </span>
            <span>
              By{" "}
              <Link href="/about" className="font-medium text-sage-700 hover:text-sage-500 transition-colors">
                {blogData.author}, {blogData.authorCredentials}
              </Link>
            </span>
          </div>

          {/* Tags */}
          <div className="flex items-center justify-center gap-2 mt-5 flex-wrap">
            <Tag className="w-3.5 h-3.5 text-sage-400" />
            {blogData.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs bg-white border border-sage-100 text-sage-600"
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
              className="prose prose-sage max-w-none mb-10"
              style={{ color: "#395139" }}
              dangerouslySetInnerHTML={{ __html: blogData.intro.replace(/\n/g, "<br/>") }}
            />

            {/* Key Points Highlight Box */}
            {blogData.keyPoints.length > 0 && (
              <div
                className="rounded-2xl p-6 mb-10 border border-sage-100"
                style={{ backgroundColor: "#f4f7f4" }}
              >
                <h3 className="font-semibold text-sage-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                  Key Takeaways
                </h3>
                <ul className="space-y-2">
                  {blogData.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sage-700 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-sage-400 flex-shrink-0 mt-1.5" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sections */}
            {blogData.sections.map((section, i) => (
              <div key={i} className="mb-10">
                <h2
                  className="font-serif text-2xl md:text-3xl mb-4"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "#1e2820",
                  }}
                >
                  {section.heading}
                </h2>
                <div
                  className="text-sage-700 leading-relaxed text-[0.97rem]"
                  dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, "<br/>") }}
                />
              </div>
            ))}

            {/* Conclusion */}
            <div className="border-t border-sage-100 pt-8 mb-10">
              <h2
                className="font-serif text-2xl mb-4"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
              >
                In Conclusion
              </h2>
              <div
                className="text-sage-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: blogData.conclusion.replace(/\n/g, "<br/>") }}
              />
            </div>

            {/* FAQs */}
            {blogData.faqs.length > 0 && (
              <div className="mb-10">
                <h2
                  className="font-serif text-2xl mb-6"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
                >
                  Frequently Asked Questions
                </h2>
                <div className="space-y-4">
                  {blogData.faqs.map((faq, i) => (
                    <details
                      key={i}
                      className="group rounded-xl border border-sage-100 overflow-hidden"
                    >
                      <summary className="flex items-center justify-between p-5 cursor-pointer font-medium text-sage-900 hover:bg-sage-50 transition-colors list-none">
                        {faq.q}
                        <span className="text-sage-400 group-open:rotate-180 transition-transform ml-4 flex-shrink-0">↓</span>
                      </summary>
                      <div className="px-5 pb-5 pt-3 text-sage-600 text-sm leading-relaxed border-t border-sage-50">
                        {faq.a}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="flex items-center gap-3 py-6 border-t border-sage-100">
              <Share2 className="w-4 h-4 text-sage-500" />
              <span className="text-sm text-sage-500 font-medium">Share this article:</span>
              {[
                { label: "WhatsApp", color: "#25D366", href: `https://wa.me/?text=${encodeURIComponent(blogData.title + " — Read at pratimaagale.in")}` },
               
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
              style={{ backgroundColor: "#f4f7f4" }}
            >
              <div className="w-16 h-16 rounded-full bg-sage-200 flex items-center justify-center flex-shrink-0 text-3xl">
                👩‍⚕️
              </div>
              <div>
                <div className="font-semibold text-sage-900 mb-1">
                  {blogData.author}, {blogData.authorCredentials}
                </div>
                <p className="text-sage-600 text-sm leading-relaxed">
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
  href="https://wa.me/919087234577?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Pratima%20Agale."
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center justify-center gap-2 text-center bg-white text-sage-700 py-2.5 rounded-xl font-semibold text-sm hover:bg-cream-50 transition-all hover:shadow-md"
>
  {/* WhatsApp Icon */}
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
                href="tel:+91XXXXXXXXXX"
                className="block text-center border border-white/30 text-white py-2.5 rounded-xl font-medium text-sm mt-2 hover:bg-white/10 transition-all"
              >
                Call Now
              </a>
            </div>

            {/* Related Conditions */}
            {blogData.relatedConditions.length > 0 && (
              <div className="rounded-2xl p-6 border border-sage-100">
                <h3 className="font-semibold text-sage-900 mb-4">Related Conditions</h3>
                <ul className="space-y-2">
                  {blogData.relatedConditions.map((c) => (
                    <li key={c.href}>
                      <Link
                        href={c.href}
                        className="text-sage-600 hover:text-sage-800 text-sm flex items-center gap-2 transition-colors"
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
            {blogData.relatedArticles.length > 0 && (
              <div className="rounded-2xl p-6 border border-sage-100">
                <h3 className="font-semibold text-sage-900 mb-4">Read Next</h3>
                <ul className="space-y-2">
                  {blogData.relatedArticles.map((a) => (
                    <li key={a.href}>
                      <Link
                        href={a.href}
                        className="text-sage-600 hover:text-sage-800 text-sm flex items-center gap-2 transition-colors"
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
        <div className="border-t border-sage-100 mt-12 pt-8">
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
