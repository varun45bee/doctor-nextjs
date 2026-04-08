"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, GraduationCap, Heart, Award } from "lucide-react";
import { useLanguage } from "@/lib/language-context";

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <div className="pt-24 overflow-hidden">
      {/* HERO */}
      <section
        className="py-20 px-6"
        style={{ background: "linear-gradient(135deg, #f4f7f4, #faf3e6)" }}
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div>
            <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              {t.about.tagline}
            </div>

            <h1
              className="font-serif mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.6rem, 4vw, 3.6rem)",
                color: "#1e2820",
                lineHeight: 1.2,
              }}
            >
              {t.about.title}
              <span className="block italic text-sage-500">
                {t.about.subtitle}
              </span>
            </h1>

            <p className="text-sage-700 text-lg leading-relaxed mb-6">
              {t.about.intro} <em>{t.about.introItalic}</em>
            </p>

            <a
              href="https://wa.me/919087234577?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Pratima%20Agale."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-sage-500 text-white px-6 py-3 rounded-full font-medium hover:bg-sage-600 transition-all hover:shadow-md hover:-translate-y-0.5"
            >


              {t.common.bookConsultation}
                <ArrowRight className="w-4 h-4" />

            </a>
          </div>

          {/* RIGHT IMAGE GRID */}
          <div className="grid grid-cols-2 gap-5">
            {/* BIG IMAGE */}
            <div className="relative row-span-2 rounded-2xl overflow-hidden min-h-[360px] bg-sage-100 shadow-sm">
              <Image
                src="/desk.jpeg"
                alt="Dr. Pratima Agale consulting a patient"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* SMALL IMAGE 1 */}
            <div className="relative rounded-2xl overflow-hidden min-h-[170px] bg-sage-100 shadow-sm">
              <Image
                src="/patient.png"
                alt="Patient consultation moment"
                fill
                className="object-cover"
              />
            </div>

            {/* SMALL IMAGE 2 */}
            <div className="relative rounded-2xl overflow-hidden min-h-[170px] bg-sage-100 shadow-sm">
              <Image
                src="/wide.png"
                alt="Homeopathy consultation session"
                fill
                className="object-cover"
              />
            </div>

            {/* SMALL IMAGE 3 */}
            <div className="relative rounded-2xl overflow-hidden min-h-[170px] bg-sage-100 shadow-sm">
              <Image
                src="/out.jpeg"
                alt="Doctor reviewing cases"
                fill
                className="object-cover"
              />
            </div>

            {/* SMALL IMAGE 4 */}

          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: GraduationCap,
              title: "BHMS",
              desc: "Bachelor of Homeopathic Medicine & Surgery",
            },
            {
              icon: Award,
              title: "MD (Homeopathy)",
              desc: "Post-Graduate Specialization",
            },
            {
              icon: Heart,
              title: "4+ Years Experience",
              desc: "Compassionate patient-focused care",
            },
          ].map((c, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl text-center border border-sage-50 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-sage-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <c.icon className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="font-semibold text-sage-900 mb-1">
                {c.title}
              </h3>
              <p className="text-sage-600 text-sm">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section
        className="py-20 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #263727, #3a5a3a)" }}
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-sage-300 text-sm tracking-widest uppercase mb-6">
            {t.about.philosophyTitle}
          </div>
          <blockquote
            className="font-serif text-2xl md:text-3xl text-white italic leading-relaxed mb-8"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            “{t.about.philosophy}”
          </blockquote>
          <cite className="text-sage-300 text-sm">
            — {t.about.title}, {t.about.subtitle}
          </cite>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-sage-500 text-center">
        <div className="max-w-xl mx-auto">
          <h2
            className="font-serif text-3xl text-white mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {t.about.ctaTitle}
          </h2>
          <p className="text-sage-100 mb-6">{t.about.ctaDesc}</p>
         <a
  href="https://wa.me/919087234577?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Pratima%20Agale."
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
>
  {/* WhatsApp Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="#25D366"
    className="w-5 h-5"
  >
    <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.67 4.77 1.84 6.76L2 30l7.44-1.8A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.6l-.42-.25-4.42 1.07 1.1-4.3-.28-.44A11.47 11.47 0 0 1 4.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.3-8.57c-.34-.17-2.02-1-2.34-1.11-.32-.11-.55-.17-.78.17-.23.34-.9 1.11-1.1 1.34-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.02-1.9-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.08-.17-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.59h-.66c-.23 0-.6.08-.91.4-.32.32-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.02-.82 2.31-1.62.28-.8.28-1.48.2-1.62-.08-.14-.3-.22-.64-.39z" />
  </svg>

  {t.common.bookConsultation}
</a>
        </div>
      </section>
    </div>
  );
}