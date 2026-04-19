"use client";
import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

const posts = [
  { slug: "pcod-pcos-homeopathy-guide", titleEn: "Complete Guide to Treating PCOD/PCOS with Homeopathy", titleHi: "PCOD/PCOS होम्योपैथी उपचार की संपूर्ण गाइड", titleMr: "PCOD/PCOS होमिओपॅथी उपचाराची संपूर्ण मार्गदर्शिका", excerptEn: "PCOS affects 1 in 5 Indian women. Learn how individualized homeopathic treatment can regulate your cycle, reduce cysts, and restore hormonal balance — without synthetic hormones.", excerptHi: "PCOD 5 में से 1 भारतीय महिला को प्रभावित करता है। सीखें कैसे होम्योपैथी से प्राकृतिक रूप से हार्मोन संतुलित हो सकते हैं।", excerptMr: "PCOD 5 पैकी 1 भारतीय महिलेला प्रभावित करते. होमिओपॅथीने नैसर्गिकरित्या हार्मोन कसे संतुलित करावे ते जाणून घ्या.", categoryEn: "Women's Health", categoryHi: "महिला स्वास्थ्य", categoryMr: "महिला आरोग्य", readTime: "8", date: "Jan 15, 2025", emoji: "🌸", color: "#fdf4f7" },
  { slug: "monsoon-allergies-homeopathy", titleEn: "Top 5 Homeopathic Remedies for Monsoon Allergies", titleHi: "मानसून एलर्जी के लिए 5 बेस्ट होम्योपैथिक रेमेडी", titleMr: "मान्सून ऍलर्जीसाठी 5 सर्वोत्तम होमिओपॅथिक रेमेडी", excerptEn: "Monsoon brings welcome rain — and unwelcome allergies. Dust mites, mold spores, and humidity spikes trigger rhinitis, asthma, and skin flares. Prepare naturally.", excerptHi: "मानसून बारिश के साथ एलर्जी भी लाता है। धूल, फफूंद और नमी से राइनाइटिस, अस्थमा और त्वचा की समस्याएं होती हैं। प्राकृतिक तैयारी करें।", excerptMr: "पावसाळा पाऊस आणतो — आणि ऍलर्जी देखील. धूळ, बुरशी आणि आर्द्रतेमुळे ऍलर्जी होते. नैसर्गिकरित्या तयार राहा.", categoryEn: "Seasonal Health", categoryHi: "मौसमी स्वास्थ्य", categoryMr: "हंगामी आरोग्य", readTime: "5", date: "Jun 10, 2025", emoji: "🌧️", color: "#f0f8ff" },
  { slug: "child-immunity-homeopathy", titleEn: "Building Your Child's Immunity Naturally", titleHi: "बच्चे की रोग प्रतिरोधक क्षमता बढ़ाएं प्राकृतिक रूप से", titleMr: "मुलांची प्रतिकारशक्ती नैसर्गिकरित्या वाढवा", excerptEn: "Is your child sick every 3–4 weeks? Constitutional homeopathy can transform a child's immune resilience in just a few months.", excerptHi: "क्या बच्चा हर 3-4 हफ्ते बीमार पड़ता है? होम्योपैथी बच्चे की प्रतिरोधक क्षमता कुछ महीनों में बदल सकती है।", excerptMr: "तुमचे मूल दर 3-4 आठवड्यांनी आजारी पडते का? होमिओपॅथी काही महिन्यांत मुलाची प्रतिकारशक्ती बदलू शकते.", categoryEn: "Pediatric Care", categoryHi: "बाल चिकित्सा", categoryMr: "बालरोग", readTime: "6", date: "Mar 5, 2025", emoji: "🌱", color: "#f0fdf4" },
  { slug: "homeopathy-vs-allopathy", titleEn: "Homeopathy vs. Conventional Medicine: When to Use Which?", titleHi: "होम्योपैथी बनाम एलोपैथी: कब क्या उपयोग करें?", titleMr: "होमिओपॅथी विरुद्ध एलोपॅथी: कधी काय वापरावे?", excerptEn: "A balanced, evidence-based guide to understanding when homeopathy excels, when conventional medicine is essential, and how they complement each other.", excerptHi: "होम्योपैथी कब बेहतर है, एलोपैथी कब जरूरी है — एक संतुलित, साक्ष्य-आधारित मार्गदर्शिका।", excerptMr: "होमिओपॅथी कधी चांगली, एलोपॅथी कधी आवश्यक — एक संतुलित मार्गदर्शिका.", categoryEn: "Education", categoryHi: "शिक्षा", categoryMr: "शिक्षण", readTime: "10", date: "Feb 20, 2025", emoji: "⚖️", color: "#fdf8f0" },
  { slug: "skin-homeopathy-kalyan", titleEn: "How Homeopathy Heals Chronic Skin Conditions", titleHi: "होम्योपैथी से जीर्ण त्वचा रोगों का उपचार", titleMr: "होमिओपॅथीने जुनाट त्वचा विकारांवर उपचार", excerptEn: "Psoriasis, eczema, vitiligo, acne — why do skin conditions keep coming back with conventional treatment? Homeopathy's root-cause approach changes everything.", excerptHi: "सोरायसिस, एक्जिमा, विटिलिगो — त्वचा रोग बार-बार क्यों आते हैं? होम्योपैथी का मूल कारण उपचार सब बदल देता है।", excerptMr: "सोरायसिस, एक्झिमा, विटिलिगो — त्वचा रोग वारंवार का येतात? होमिओपॅथीचा मूळ कारण उपचार सर्व बदलतो.", categoryEn: "Skin & Hair", categoryHi: "त्वचा और बाल", categoryMr: "त्वचा आणि केस", readTime: "7", date: "Apr 12, 2025", emoji: "✨", color: "#fff8f5" },
  { slug: "homeopathy-pregnancy-safe", titleEn: "Homeopathy During Pregnancy — Is It Safe?", titleHi: "गर्भावस्था में होम्योपैथी — क्या यह सुरक्षित है?", titleMr: "गर्भधारणेदरम्यान होमिओपॅथी — हे सुरक्षित आहे का?", excerptEn: "Pregnancy limits most medications — but not homeopathy. Discover how gentle remedies address morning sickness, anxiety, and fatigue safely.", excerptHi: "गर्भावस्था में अधिकतर दवाएं सीमित हैं — लेकिन होम्योपैथी नहीं। मॉर्निंग सिकनेस, थकान और चिंता का प्राकृतिक समाधान।", excerptMr: "गर्भधारणेत बहुतेक औषधे मर्यादित आहेत — होमिओपॅथी नाही. मॉर्निंग सिकनेस, थकवा आणि चिंतेवर नैसर्गिक उपाय.", categoryEn: "Women's Health", categoryHi: "महिला स्वास्थ्य", categoryMr: "महिला आरोग्य", readTime: "6", date: "May 8, 2025", emoji: "🤱", color: "#fdf0f5" },
];

export default function BlogPage() {
  const { t, locale } = useLanguage();

  const getTitle = (p: typeof posts[0]) => locale === "hi" ? p.titleHi : locale === "mr" ? p.titleMr : p.titleEn;
  const getExcerpt = (p: typeof posts[0]) => locale === "hi" ? p.excerptHi : locale === "mr" ? p.excerptMr : p.excerptEn;
  const getCategory = (p: typeof posts[0]) => locale === "hi" ? p.categoryHi : locale === "mr" ? p.categoryMr : p.categoryEn;

  const readTimeLabel = locale === "hi" ? "मिनट पढ़ें" : locale === "mr" ? "मिनिट वाचा" : "min read";

  return (
    <div className="pt-24 overflow-hidden">
      <section className="py-20 px-6 text-center" style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}>
        <div className="max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6"
            style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
          >
            {locale === "hi" ? "ज्ञान है शक्ति" : locale === "mr" ? "ज्ञान हीच शक्ती" : "Knowledge Is Healing"}
          </div>
          <h1 className="font-serif mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 3.8rem)", color: "var(--text-primary)" }}>
            {t.blog.title}
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--text-secondary)" }}>{t.blog.subtitle}</p>
        </div>
      </section>

      <section className="py-16 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-7xl mx-auto">
          {/* Featured */}
          <div
            className="rounded-2xl p-8 md:p-12 mb-10 hover:shadow-md transition-all"
            style={{ backgroundColor: "var(--bg-surface-alt)" }}
          >
            <span className="inline-block bg-sage-500 text-white text-xs px-3 py-1 rounded-full mb-4">{t.blog.featured}</span>
            <div className="text-5xl mb-4">🌸</div>
            <h2 className="font-serif text-3xl md:text-4xl mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}>
              {getTitle(posts[0])}
            </h2>
            <p className="leading-relaxed mb-6 max-w-2xl" style={{ color: "var(--text-secondary)" }}>{getExcerpt(posts[0])}</p>
            <div className="flex items-center gap-6 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
              <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{posts[0].date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{posts[0].readTime} {readTimeLabel}</span>
              <span
                className="px-3 py-0.5 rounded-full text-xs"
                style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-secondary)" }}
              >{getCategory(posts[0])}</span>
            </div>
            <Link href={`/blog/${posts[0].slug}`} className="inline-flex items-center gap-2 bg-sage-500 text-white px-6 py-3 rounded-full font-medium hover:bg-sage-600 transition-all">
              {t.blog.allArticles} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(1).map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group rounded-2xl overflow-hidden border hover:shadow-md transition-all hover:-translate-y-1" style={{ borderColor: "var(--border-color)" }}>
                <div className="p-6" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
                  <div className="text-4xl mb-3">{post.emoji}</div>
                </div>
                <div className="p-6" style={{ backgroundColor: "var(--bg-surface)" }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-muted)" }}>{getCategory(post)}</span>
                    <span className="text-xs flex items-center gap-1" style={{ color: "var(--text-muted)" }}><Clock className="w-3 h-3" />{post.readTime} {readTimeLabel}</span>
                  </div>
                  <h3 className="font-serif text-xl mb-3 group-hover:text-sage-600 transition-colors" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}>
                    {getTitle(post)}
                  </h3>
                  <p className="text-sm leading-relaxed line-clamp-3 mb-4" style={{ color: "var(--text-secondary)" }}>{getExcerpt(post)}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>{post.date}</span>
                    <span className="text-sage-500 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                      {t.common.readMore} <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center py-12 border-2 border-dashed border-sage-100 rounded-2xl">
            <div className="text-4xl mb-3">✍️</div>
            <h3 className="font-semibold text-sage-700 mb-2">{t.blog.noArticles}</h3>
            <p className="text-sage-500 text-sm max-w-md mx-auto">
              {locale === "hi" ? "नए लेख जोड़ने के लिए app/blog/[slug]/page.tsx में फाइल बनाएं" : locale === "mr" ? "नवीन लेख जोडण्यासाठी app/blog/[slug]/page.tsx मध्ये फाइल तयार करा" : "Add new articles by creating files in app/blog/[slug]/page.tsx — use the _template folder as a guide."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
