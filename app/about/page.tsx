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
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT CONTENT */}
          <div>
            <div
              className="inline-flex items-center gap-2 text-xs tracking-widest uppercase px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
            >
              {t.about.tagline}
            </div>

            <h1
              className="font-serif mb-6"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.6rem, 4vw, 3.6rem)",
                color: "var(--text-primary)",
                lineHeight: 1.2,
              }}
            >
              {t.about.title}
              <span className="block italic text-sage-500">
                {t.about.subtitle}
              </span>
            </h1>

            <p className="text-lg leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
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
            <div className="relative row-span-2 rounded-2xl overflow-hidden min-h-[360px] bg-sage-100 shadow-sm">
              <Image src="/desk.jpeg" alt="Dr. Pratima Agale consulting a patient" fill className="object-cover" priority />
            </div>
            <div className="relative rounded-2xl overflow-hidden min-h-[170px] bg-sage-100 shadow-sm">
              <Image src="/patient.png" alt="Patient consultation moment" fill className="object-cover" />
            </div>
            <div className="relative rounded-2xl overflow-hidden min-h-[170px] bg-sage-100 shadow-sm">
              <Image src="/wide.png" alt="Homeopathy consultation session" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* CREDENTIALS */}
      <section className="py-16 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { icon: GraduationCap, title: "BHMS", desc: "Bachelor of Homeopathic Medicine & Surgery" },
            { icon: Award, title: "MD (Homeopathy)", desc: "Post-Graduate Specialization" },
            { icon: Heart, title: "4+ Years Experience", desc: "Compassionate patient-focused care" },
          ].map((c, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl text-center border hover:shadow-md transition-all"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "var(--bg-surface-alt)" }}
              >
                <c.icon className="w-6 h-6 text-sage-600" />
              </div>
              <h3 className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>
                {c.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {c.desc}
              </p>
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
            "{t.about.philosophy}"
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
            {t.common.bookConsultation}
          </a>
        </div>
      </section>
    </div>
  );
}