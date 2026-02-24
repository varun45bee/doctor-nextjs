import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Calendar, Clock, User, Tag, Share2, BookOpen } from "lucide-react";

// ============================================================================
// 📝 BLOG POST BLUEPRINT — HOW TO USE THIS TEMPLATE
// ============================================================================
// 1. Copy this file to: app/blog/[your-slug]/page.tsx
// 2. Fill in the POST_DATA object below with your article content
// 3. Add the post to BLOG_POSTS_INDEX in app/blog/page.tsx
// 4. Deploy — Google will index it within days!
//
// SEO TIPS:
// - Title should contain your target keyword (e.g. "PCOD homeopathy Kalyan")
// - Description should be 150–160 characters
// - Use H2 and H3 headings throughout the article
// - Aim for 800–1500 words per article
// - Link to related conditions pages and other blog posts
// ============================================================================

// ─── FILL THIS IN ────────────────────────────────────────────────────────────
const POST_DATA = {
  // SEO metadata
  title: "YOUR ARTICLE TITLE HERE",
  description: "A 150-160 character description of your article for Google search results. Include your main keyword naturally.",
  keywords: ["keyword 1", "keyword 2", "homeopathy kalyan", "your condition"],
  slug: "your-article-slug",

  // Article metadata
  date: "January 1, 2025",        // Publication date
  readTime: "6",                   // Estimated reading time in minutes
  category: "Women's Health",      // Category (matches blog filter)
  emoji: "🌸",                     // Visual emoji for the article
  heroColor: "#fff5f7",            // Hero background color (hex)
  accentColor: "#9e5e7f",          // Accent color for headers

  // Optional: Add a key takeaway or summary
  keyTakeaway: "One sentence summary of the most important insight from this article.",

  // Related posts (link to other blog articles or condition pages)
  relatedLinks: [
    { title: "Related Condition Page", href: "/conditions/pcod-pcos" },
    { title: "Another Blog Post", href: "/blog/another-post" },
  ],
};

// ─── SEO METADATA (auto-generated from POST_DATA) ────────────────────────────
export const metadata: Metadata = {
  title: `${POST_DATA.title} | Dr. Pratima Agale Homeopathy Kalyan`,
  description: POST_DATA.description,
  keywords: POST_DATA.keywords,
  openGraph: {
    title: POST_DATA.title,
    description: POST_DATA.description,
    type: "article",
    publishedTime: POST_DATA.date,
    authors: ["Dr. Pratima Agale"],
  },
};

// ─── THE ARTICLE CONTENT ─────────────────────────────────────────────────────
// Write your article below using standard JSX.
// Use the components provided (Section, H2, H3, Para, Bullet, Callout, etc.)
// ─────────────────────────────────────────────────────────────────────────────

export default function BlogPost() {
  return (
    <div className="pt-24">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-sage-50 px-6 py-3">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-xs text-sage-400">
          <Link href="/" className="hover:text-sage-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-sage-600 transition-colors">Knowledge Hub</Link>
          <span>/</span>
          <span className="text-sage-700 font-medium">{POST_DATA.title}</span>
        </div>
      </div>

      {/* Article Hero */}
      <section className="py-14 px-6" style={{ backgroundColor: POST_DATA.heroColor }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-5xl mb-4">{POST_DATA.emoji}</div>
          <div
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-4"
            style={{ backgroundColor: POST_DATA.accentColor + "20", color: POST_DATA.accentColor }}
          >
            <Tag className="w-3 h-3" />{POST_DATA.category}
          </div>
          <h1
            className="font-serif mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "#1e2820",
              lineHeight: 1.25,
            }}
          >
            {POST_DATA.title}
          </h1>
          <p className="text-sage-700 text-lg leading-relaxed mb-6">{POST_DATA.description}</p>

          {/* Article meta */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-sage-500">
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Dr. Pratima Agale, BHMS, MD
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {POST_DATA.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {POST_DATA.readTime} min read
            </span>
          </div>
        </div>
      </section>

      {/* Key Takeaway Box */}
      {POST_DATA.keyTakeaway && (
        <div className="px-6 py-4 bg-sage-50 border-y border-sage-100">
          <div className="max-w-3xl mx-auto flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-sage-900 text-sm">Key Takeaway: </span>
              <span className="text-sage-700 text-sm">{POST_DATA.keyTakeaway}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── ARTICLE BODY ──────────────────────────────────────────────────────── */}
      <article className="py-12 px-6">
        <div className="max-w-3xl mx-auto prose prose-sage prose-lg max-w-none">

          {/*
          =====================================================================
          ✍️ WRITE YOUR ARTICLE CONTENT BELOW
          =====================================================================

          STRUCTURE GUIDE:
          - Start with an engaging intro paragraph (no heading needed)
          - Use H2 for main sections (3-5 per article)
          - Use H3 for sub-sections within H2
          - Use bullet lists for symptoms, causes, tips
          - Use the green callout box for important warnings or key facts
          - End with a clear CTA to book consultation

          CONTENT EXAMPLES:
          */}

          {/* ── INTRO PARAGRAPH ── */}
          <p className="text-sage-700 text-lg leading-relaxed mb-8">
            <strong>Replace this with your opening paragraph.</strong> Start with a relatable
            scenario or a surprising statistic that grabs your reader's attention.
            Example: "If your period has been irregular for months, and you've been told
            you have PCOD — you're not alone. 1 in 5 Indian women of reproductive age
            have this condition. But here's what most doctors don't tell you..."
          </p>

          {/* ── SECTION 1 ── */}
          <h2
            className="font-serif text-3xl mt-10 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
          >
            Replace With Your First Main Heading
          </h2>
          <p className="text-sage-700 leading-relaxed mb-6">
            Write your first section content here. Explain the topic in simple, accessible
            language. Imagine you're explaining it to a concerned mother or a young woman
            in Kalyan who just got her diagnosis. Use empathy and clarity.
          </p>

          {/* ── BULLET LIST ── */}
          <ul className="space-y-3 mb-8">
            {[
              "First key point — keep each point to 1-2 sentences",
              "Second key point — make it specific and useful",
              "Third key point — include a relatable example if possible",
              "Fourth key point — end with a positive or actionable note",
            ].map((point) => (
              <li key={point} className="flex items-start gap-3 text-sage-700">
                <div className="w-5 h-5 rounded-full bg-sage-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                </div>
                {point}
              </li>
            ))}
          </ul>

          {/* ── SECTION 2 ── */}
          <h2
            className="font-serif text-3xl mt-10 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
          >
            Replace With Your Second Main Heading
          </h2>
          <p className="text-sage-700 leading-relaxed mb-6">
            Continue your article here. This is typically where you explain the homeopathic
            perspective — how your condition is viewed differently in homeopathy, what
            the constitutional approach means, why individualized treatment matters.
          </p>

          {/* ── CALLOUT BOX — use for important warnings, facts, or tips ── */}
          <div
            className="rounded-2xl p-6 mb-8 border-l-4"
            style={{ backgroundColor: "#f4f7f4", borderColor: "#5a7f5a" }}
          >
            <div className="font-semibold text-sage-900 mb-2">💡 Important Note from Dr. Pratima:</div>
            <p className="text-sage-700 text-sm leading-relaxed">
              Replace this with a key clinical insight, patient tip, or important safety note.
              Example: "Never stop your thyroid medication abruptly when starting homeopathic
              treatment. We work together with your endocrinologist to taper medication
              only as your TSH levels normalize."
            </p>
          </div>

          {/* ── SECTION 3 ── */}
          <h2
            className="font-serif text-3xl mt-10 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
          >
            What to Expect From Treatment
          </h2>
          <p className="text-sage-700 leading-relaxed mb-6">
            Give readers realistic expectations — timeline, process, what improvement looks
            like, what lifestyle changes help. Be honest and empowering.
          </p>

          {/* ── NUMBERED LIST ── */}
          <div className="space-y-4 mb-8">
            {[
              { n: "01", title: "First step", desc: "Describe what happens in the first 1-2 months" },
              { n: "02", title: "Middle phase", desc: "Describe what progress looks like at 3-6 months" },
              { n: "03", title: "Long-term", desc: "Describe lasting results and maintenance" },
            ].map((item) => (
              <div key={item.n} className="flex gap-4 items-start">
                <div
                  className="font-serif text-2xl font-light flex-shrink-0 mt-0.5"
                  style={{ color: "#5a7f5a", fontFamily: "'Cormorant Garamond', serif", minWidth: "2rem" }}
                >
                  {item.n}
                </div>
                <div>
                  <div className="font-semibold text-sage-900 text-sm mb-1">{item.title}</div>
                  <div className="text-sage-600 text-sm leading-relaxed">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* ── CONCLUSION ── */}
          <h2
            className="font-serif text-3xl mt-10 mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
          >
            Conclusion
          </h2>
          <p className="text-sage-700 leading-relaxed mb-4">
            Write a warm, empowering conclusion. Summarize the key message.
            Emphasize that healing is possible and that the reader is not alone.
          </p>
          <p className="text-sage-700 leading-relaxed mb-8">
            End with a gentle call to action. Example: "If you're struggling with [condition]
            and looking for a natural approach, I'd love to help. Every patient receives
            a completely individualized treatment plan — because your body is unique."
          </p>

        </div>
      </article>

      {/* Author box */}
      <div className="px-6 pb-10">
        <div className="max-w-3xl mx-auto bg-sage-50 rounded-2xl p-6 border border-sage-100 flex items-start gap-5">
          <div className="w-16 h-16 rounded-full bg-sage-200 flex items-center justify-center flex-shrink-0 text-2xl">
            👩‍⚕️
          </div>
          <div>
            <div className="font-semibold text-sage-900">Dr. Pratima Agale</div>
            <div className="text-sage-500 text-sm mb-2">BHMS, MD (Homeopathy) · Kalyan, Maharashtra</div>
            <p className="text-sage-600 text-sm leading-relaxed">
              Dr. Pratima Agale is an experienced homeopathic physician specializing in women's health,
              pediatric care, skin disorders, and chronic diseases. She practices in Kalyan, serving
              patients across Mumbai and Maharashtra.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <section className="py-12 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="font-serif text-2xl text-white mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Ready to Start Your Healing Journey?
          </h2>
          <p className="text-sage-100 mb-5 text-sm">
            Book a consultation with Dr. Pratima Agale in Kalyan.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-sage-700 px-7 py-3 rounded-full font-semibold hover:bg-cream-50 transition-all"
          >
            Book Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Related links */}
      {POST_DATA.relatedLinks.length > 0 && (
        <div className="px-6 py-8 bg-white border-t border-sage-50">
          <div className="max-w-3xl mx-auto">
            <p className="text-sage-500 text-xs font-medium tracking-widest uppercase mb-4">Related Reading</p>
            <div className="flex flex-wrap gap-3">
              {POST_DATA.relatedLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2 bg-sage-50 border border-sage-100 text-sage-700 px-4 py-2 rounded-full text-sm hover:bg-sage-100 transition-all"
                >
                  {l.title} <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Back to blog */}
      <div className="px-6 py-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sage-500 hover:text-sage-700 text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Knowledge Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
