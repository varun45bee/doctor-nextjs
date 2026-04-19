"use client";
import Link from "next/link";
import { ArrowRight, CheckCircle, TrendingUp, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export interface DiseasePageData {
  slug: string;
  title: string;
  hindiTitle: string;
  marathiTitle: string;
  emoji: string;
  tagline: string;
  category: string;
  categoryColor: string;
  heroColor: string;
  accentColor: string;
  overview: string;
  whatIsIt: string;
  causes: string[];
  symptoms: string[];
  homeopathyExplanation: string;
  treatmentPoints: string[];
  keyRemedies: { name: string; indication: string }[];
  treatmentDuration: string;
  successRate: string;
  faqs: { q: string; a: string }[];
  related: { title: string; href: string }[];
  seoKeywords: string[];
}

export default function DiseasePage({ data }: { data: DiseasePageData }) {
  const { t, locale } = useLanguage();

  const titleInLocale =
    locale === "hi"
      ? data.hindiTitle
      : locale === "mr"
      ? data.marathiTitle
      : data.title;

  return (
    <div className="pt-24 overflow-hidden">
      {/* Breadcrumb */}
      <div
        className="border-b px-6 py-3"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-sage-600 transition-colors">
            {locale === "hi" ? "होम" : locale === "mr" ? "मुखपृष्ठ" : "Home"}
          </Link>
          <span>/</span>
          <Link href="/conditions" className="hover:text-sage-600 transition-colors">
            {t.conditions.pageTitle}
          </Link>
          <span>/</span>
          <span className="font-medium" style={{ color: "var(--text-secondary)" }}>
            {titleInLocale}
          </span>
        </div>
      </div>

      {/* Hero */}
      <section
        className="py-16 px-6"
        style={{
          background: `linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))`,
        }}
      >
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-5"
              style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--sage-mid)" }}
            >
              {data.category}
            </div>
            <div className="text-5xl mb-4" role="img" aria-label="Condition Icon">{data.emoji}</div>
            <h1
              className="font-serif mb-3"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.2rem, 4.5vw, 3.2rem)",
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              {titleInLocale}
              {locale !== "en" && (
                <span
                  className="block text-xl font-sans font-normal mt-1"
                  style={{ color: "var(--sage-mid)" }}
                >
                  {data.title}
                </span>
              )}
            </h1>
            <p className="text-lg italic mb-6" style={{ color: "var(--text-secondary)" }}>
              {data.tagline}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Pratima%20Agale."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white px-6 py-3 rounded-full font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 bg-sage-500 hover:bg-sage-600"
              >
                {t.common.bookConsultation}
              </a>
              <a
                href="tel:+919359875511"
                className="flex items-center gap-2 border-2 border-sage-400 px-6 py-3 rounded-full font-medium transition-all hover:bg-sage-50 dark:hover:bg-sage-900"
                style={{ color: "var(--text-secondary)" }}
              >
                {t.common.callNow}
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: t.common.duration, value: data.treatmentDuration, emoji: "⏱" },
              { label: t.common.successRate, value: data.successRate, emoji: "✅" },
              {
                label:
                  locale === "hi"
                    ? "कोई साइड इफेक्ट नहीं"
                    : locale === "mr"
                    ? "कोणते दुष्परिणाम नाहीत"
                    : "Zero Side Effects",
                value:
                  locale === "hi"
                    ? "100% प्राकृतिक"
                    : locale === "mr"
                    ? "100% नैसर्गिक"
                    : "100% Natural",
                emoji: "🌿",
              },
              {
                label:
                  locale === "hi"
                    ? "सभी उम्र के लिए"
                    : locale === "mr"
                    ? "सर्व वयांसाठी"
                    : "All Ages Safe",
                value:
                  locale === "hi"
                    ? "नवजात से बुजुर्ग"
                    : locale === "mr"
                    ? "नवजात ते वृद्ध"
                    : "Infants to Elderly",
                emoji: "👨‍👩‍👧‍👦",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="backdrop-blur rounded-2xl p-5 border shadow-sm"
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="text-2xl mb-2">{stat.emoji}</div>
                <div className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {stat.value}
                </div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-14 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-serif text-3xl mb-4"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: "var(--text-primary)",
            }}
          >
            {locale === "hi"
              ? `${titleInLocale} क्या है?`
              : locale === "mr"
              ? `${titleInLocale} म्हणजे काय?`
              : `What is ${data.title}?`}
          </h2>
          <p className="leading-relaxed text-lg mb-6" style={{ color: "var(--text-secondary)" }}>
            {data.overview}
          </p>
          <p className="leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {data.whatIsIt}
          </p>
        </div>
      </section>

      {/* Causes & Symptoms */}
      <section className="py-14 px-6" style={{ backgroundColor: "var(--bg-surface-alt)" }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          <div
            className="rounded-2xl p-7 border shadow-sm"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
          >
            <h2
              className="font-serif text-2xl mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "var(--text-primary)",
              }}
            >
              {locale === "hi"
                ? "कारण और जोखिम कारक"
                : locale === "mr"
                ? "कारणे आणि जोखीम घटक"
                : "Causes & Risk Factors"}
            </h2>
            <ul className="space-y-3">
              {data.causes.map((c) => (
                <li key={c} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "var(--bg-surface-alt)" }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-sage-500" />
                  </div>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="rounded-2xl p-7 border shadow-sm"
            style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
          >
            <h2
              className="font-serif text-2xl mb-5"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: "var(--text-primary)",
              }}
            >
              {t.common.symptoms}
            </h2>
            <ul className="space-y-3">
              {data.symptoms.map((s) => (
                <li key={s} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                  <CheckCircle className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Homeopathy Treatment */}
      <section className="py-14 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <div
                className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase px-4 py-1.5 rounded-full mb-4"
                style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--sage-mid)" }}
              >
                🌿 {t.common.treatment}
              </div>
              <h2
                className="font-serif text-3xl mb-4"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: "var(--text-primary)",
                }}
              >
                {t.common.whyHomeopathy}
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                {data.homeopathyExplanation}
              </p>
              <ul className="space-y-3">
                {data.treatmentPoints.map((p) => (
                  <li key={p} className="flex items-start gap-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                    <TrendingUp className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-2xl p-7 border"
              style={{ backgroundColor: "var(--bg-surface-alt)", borderColor: "var(--border-color)" }}
            >
              <h3
                className="font-semibold mb-4 flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                <span>⚗️</span>{" "}
                {locale === "hi"
                  ? "सामान्यतः उपयोग किए जाने वाले रेमेडी"
                  : locale === "mr"
                  ? "सामान्यतः वापरले जाणारे रेमेडी"
                  : "Commonly Used Remedies"}
              </h3>
              <p className="text-xs mb-4 italic" style={{ color: "var(--text-muted)" }}>
                {locale === "hi"
                  ? "नोट: रेमेडी हमेशा व्यक्तिगत आधार पर चुने जाते हैं।"
                  : locale === "mr"
                  ? "नोंद: रेमेडी नेहमी वैयक्तिक आधारावर निवडले जातात."
                  : "Note: Remedies are always chosen individually after a full case-taking."}
              </p>
              <ul className="space-y-4">
                {data.keyRemedies.map((r) => (
                  <li
                    key={r.name}
                    className="rounded-xl p-4 border"
                    style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
                  >
                    <div className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                      {r.name}
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {r.indication}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 px-6" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="max-w-3xl mx-auto">
          <h2
            className="font-serif text-3xl text-center mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
          >
            {t.common.faq}
          </h2>
          <div className="space-y-4">
            {data.faqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border overflow-hidden"
                style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
              >
                <summary
                  className="flex items-center justify-between p-6 cursor-pointer font-medium transition-colors list-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  {faq.q}
                  <span className="text-sage-400 group-open:rotate-180 transition-transform ml-4 flex-shrink-0">
                    ↓
                  </span>
                </summary>
                <div
                  className="px-6 pb-6 text-sm leading-relaxed pt-4"
                  style={{
                    color: "var(--text-secondary)",
                    borderTop: "1px solid var(--border-color)",
                  }}
                >
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Related conditions */}
      {data.related.length > 0 && (
        <section
          className="py-10 px-6 border-t"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
        >
          <div className="max-w-5xl mx-auto">
            <h3 className="text-sm font-medium mb-4" style={{ color: "var(--text-muted)" }}>
              {t.common.relatedConditions}
            </h3>
            <div className="flex flex-wrap gap-3">
              {data.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="flex items-center gap-2 border px-4 py-2 rounded-full text-sm transition-all hover:bg-sage-50 dark:hover:bg-sage-900"
                  style={{
                    borderColor: "var(--border-mid)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {r.title} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="font-serif text-3xl text-white mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {locale === "hi"
              ? `${titleInLocale} के लिए प्राकृतिक उपचार शुरू करें`
              : locale === "mr"
              ? `${titleInLocale} साठी नैसर्गिक उपचार सुरू करा`
              : `Start Natural Treatment for ${data.title}`}
          </h2>
          <p className="text-sage-100 mb-6">{t.common.servedAreas}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Pratima%20Agale."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              {t.common.bookNow}
            </a>
            <a
              href="tel:+919359875511"
              className="border-2 border-white/40 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-all"
            >
              {t.common.callNow}
            </a>
          </div>
        </div>
      </section>

      {/* Back nav */}
      <div
        className="px-6 py-6 border-t"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
      >
        <div className="max-w-5xl mx-auto">
          <Link
            href="/conditions"
            className="inline-flex items-center gap-2 text-sage-500 hover:text-sage-700 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {locale === "hi"
              ? "सभी बीमारियां देखें"
              : locale === "mr"
              ? "सर्व आजार पहा"
              : "View All Conditions"}
          </Link>
        </div>
      </div>
    </div>
  );
}
