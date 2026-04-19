"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import {
  ArrowRight, Star, Heart, Shield, Clock, Users, Award, Leaf,
  ChevronRight, Quote
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import Image from "next/image";

const conditions = [
  { icon: "🌸", title: "PCOD / PCOS", href: "/services/womens-health" },
  { icon: "🦋", title: "Thyroid Disorders", href: "/services/womens-health" },
  { icon: "🌿", title: "Child Immunity", href: "/services/pediatric" },
  { icon: "🧠", title: "ADHD in Children", href: "/services/pediatric" },
  { icon: "💆", title: "Migraines", href: "/services/chronic-disease" },
  { icon: "🫁", title: "Respiratory Issues", href: "/services/chronic-disease" },
  { icon: "🦴", title: "Arthritis", href: "/services/chronic-disease" },
  { icon: "✨", title: "Skin Disorders", href: "/services/womens-health" },
];

const testimonials = [
  {
    name: "Priya M.",
    location: "Kalyan",
    text: "After 3 years of PCOD struggle, Dr. Pratima's treatment brought me real relief. My cycles are regular for the first time. Highly recommend her gentle approach.",
    rating: 5,
    condition: "PCOD",
  },
  {
    name: "Rahul S.",
    location: "Andheri",
    text: "My son's frequent infections reduced dramatically after 6 months of constitutional treatment. He's healthier and happier now.",
    rating: 5,
    condition: "Child Immunity",
  },
  {
    name: "Sunita K.",
    location: "Mumbai",
    text: "My thyroid levels are now completely normal without allopathy dependency. The holistic approach here is life-changing.",
    rating: 5,
    condition: "Thyroid",
  },
];

const whyUs = [
  {
    icon: Heart,
    title: "Individualized Treatment",
    desc: "Every prescription is uniquely crafted for you — your symptoms, lifestyle, and constitution.",
  },
  {
    icon: Shield,
    title: "Zero Side Effects",
    desc: "100% natural remedies that work with your body, not against it.",
  },
  {
    icon: Users,
    title: "All Ages Welcome",
    desc: "From newborns to seniors — safe, effective healing for every stage of life.",
  },
  {
    icon: Award,
    title: "MD-Qualified Expert",
    desc: "Dr. Pratima holds BHMS and MD in Homeopathy — combining tradition with modern medicine knowledge.",
  },
  {
    icon: Clock,
    title: "Root Cause Healing",
    desc: "We don't suppress symptoms. We resolve the underlying imbalance for lasting wellness.",
  },
  {
    icon: Leaf,
    title: "Holistic Approach",
    desc: "Mind, body, and spirit — addressed together for complete health transformation.",
  },
];

export default function HomePage() {
  const { t } = useLanguage();
  const revealRefs = useRef<HTMLElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt) 0%, var(--bg-base) 40%, var(--bg-surface-alt) 100%)" }}
      >
        {/* Background botanical decorations */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10 animate-blob"
          style={{ background: "radial-gradient(circle, #5a7f5a 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-8 animate-blob"
          style={{ background: "radial-gradient(circle, #6b9e8a 0%, transparent 70%)", animationDelay: "2s" }}
        />

        {/* Floating leaves decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {["top-20 right-20", "top-40 left-10", "bottom-32 right-40", "bottom-10 left-1/3"].map(
            (pos, i) => (
              <div
                key={i}
                className={`absolute text-4xl opacity-20 animate-float`}
                style={{
                  top: `${[80, 160, "auto", "auto"][i]}px`,
                  bottom: i >= 2 ? `${[128, 40][i - 2]}px` : "auto",
                  right: i === 0 ? 80 : i === 2 ? 160 : "auto",
                  left: i === 1 ? 40 : i === 3 ? "33%" : "auto",
                  animationDelay: `${i * 1.5}s`,
                }}
              >
                🌿
              </div>
            )
          )}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-28 pb-16 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <div className="page-enter">
            <div
              className="inline-flex items-center gap-2 text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
            >
              <Leaf className="w-3.5 h-3.5" />
              Homeopathy Clinic · Kalyan, Maharashtra
            </div>

            <h1
              className="font-serif mb-6 leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
                color: "var(--text-primary)",
                lineHeight: 1.15,
              }}
            >
              {t.hero.tagline}
              <span
                className="block italic"
                style={{ color: "var(--sage-mid)" }}
              >
                {t.hero.subtitle}
              </span>
            </h1>

            <p style={{ color: "var(--text-secondary)" }} className="text-lg leading-relaxed mb-8 max-w-xl">
              {t.hero.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Pratima%20Agale."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-sage-500 text-white px-7 py-3.5 rounded-full font-medium hover:bg-sage-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="white" className="w-5 h-5">
                  <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.67 4.77 1.84 6.76L2 30l7.44-1.8A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.6l-.42-.25-4.42 1.07 1.1-4.3-.28-.44A11.47 11.47 0 0 1 4.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.3-8.57c-.34-.17-2.02-1-2.34-1.11-.32-.11-.55-.17-.78.17-.23.34-.9 1.11-1.1 1.34-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.02-1.9-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.08-.17-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.59h-.66c-.23 0-.6.08-.91.4-.32.32-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.02-.82 2.31-1.62.28-.8.28-1.48.2-1.62-.08-.14-.3-.22-.64-.39z" />
                </svg>
                {t.hero.cta}
              </a>
              <Link
                href="/why-homeopathy"
                className="flex items-center gap-2 border-2 border-sage-300 px-7 py-3.5 rounded-full font-medium hover:bg-sage-50 dark:hover:bg-sage-900 transition-all"
                style={{ color: "var(--text-secondary)" }}
              >
                {t.hero.ctaLearn}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mini trust badges */}
            <div className="flex flex-wrap gap-6 mt-10">
              {[
                { n: "4+", l: t.home.statsYears },
                { n: "500+", l: t.home.statsPatients },
                { n: "50+", l: t.home.statsConditions },
                { n: "97%", l: t.home.statsSuccess },
              ].map((s) => (
                <div key={s.l} className="text-center">
                  <div
                    className="font-serif text-2xl font-semibold"
                    style={{ color: "var(--sage-mid)", fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {s.n}
                  </div>
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — doctor card */}
          <div
            className="relative flex justify-center items-center page-enter"
            style={{ animationDelay: "0.2s" }}
          >
            <div
              className="relative w-[340px] h-[420px] rounded-[2rem] overflow-hidden shadow-2xl"
              style={{ background: "linear-gradient(160deg, #e6ede6, #cddccd)" }}
            >
              <Image src="/desk.jpeg" alt="Dr. Pratima Agale" fill className="object-cover w-full h-full scale-110" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-20 left-0 right-0 px-6 text-center">
                <h2 className="font-serif text-2xl text-white mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Dr. Pratima Agale
                </h2>
                <p className="text-white/80 text-sm font-medium">BHMS, MD (Homeopathy)</p>
                <p className="text-white/60 text-xs mt-2">
                  With 4 years of dedicated experience in Homeopathy, I provide
                  compassionate, individualized care for patients of all ages.
                </p>
              </div>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-xl px-4 py-2 shadow-lg flex items-center gap-2 whitespace-nowrap">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-700">500+ Patients Healed</span>
              </div>
            </div>
            <div
              className="absolute -z-10 w-[380px] h-[380px] rounded-full border-2 border-dashed border-sage-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ animation: "spin 30s linear infinite" }}
            />
          </div>
        </div>
      </section>

      {/* ── CONDITIONS GRID ── */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 reveal">
            <div className="leaf-divider mb-4">
              <span className="text-sage-500 text-sm tracking-widest uppercase font-medium">
                Conditions We Treat
              </span>
            </div>
            <h2
              className="font-serif text-4xl md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
            >
              {t.home.conditionsTitle}
            </h2>
            <p className="mt-4 max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Comprehensive homeopathic solutions for 50+ health conditions — all natural, all safe.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {conditions.map((c, i) => (
              <Link
                key={c.title}
                href={c.href}
                aria-label={`Learn about homeopathic treatment for ${c.title}`}
                className="reveal group p-6 rounded-2xl text-center hover:shadow-md transition-all hover:-translate-y-1 border border-transparent hover:border-sage-100 dark:hover:border-sage-800"
                style={{
                  backgroundColor: "var(--bg-surface-alt)",
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div className="text-4xl mb-3">{c.icon}</div>
                <div className="font-medium text-sm transition-colors" style={{ color: "var(--text-primary)" }}>
                  {c.title}
                </div>
                <div className="mt-2 text-xs flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-muted)" }}>
                  Learn more <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/services/chronic-disease"
              className="inline-flex items-center gap-2 font-medium text-sm transition-colors hover:text-sage-800 dark:hover:text-sage-300"
              style={{ color: "var(--text-secondary)" }}
            >
              View all conditions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY HOMEOPATHY TEASER ── */}
      <section
        className="py-20 px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal">
              <div className="leaf-divider justify-start mb-4">
                <span className="text-sage-500 text-sm tracking-widest uppercase font-medium">
                  The Science of Natural Healing
                </span>
              </div>
              <h2
                className="font-serif text-4xl md:text-5xl mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
              >
                Why Homeopathy
                <span className="block italic text-sage-500">Works Differently</span>
              </h2>
              <p className="leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
                Unlike conventional medicine that targets symptoms, homeopathy treats the
                whole person — physical, mental, and emotional. It stimulates your body's
                own healing intelligence to resolve disease at its root.
              </p>
              <p className="leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                Over 200 years of practice, validated by millions worldwide, proven safe
                for infants, pregnant women, and the elderly. No dependency. No side effects.
              </p>
              <Link
                href="/why-homeopathy"
                className="inline-flex items-center gap-2 bg-sage-500 text-white px-6 py-3 rounded-full font-medium hover:bg-sage-600 transition-all"
              >
                Discover the Science <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4 reveal" style={{ animationDelay: "0.2s" }}>
              {[
                { emoji: "🌱", title: "100% Natural", desc: "Plant, mineral & animal-based medicines" },
                { emoji: "⚡", title: "Boosts Immunity", desc: "Strengthens your natural defense systems" },
                { emoji: "🎯", title: "Root Cause", desc: "Resolves disease, not just symptoms" },
                { emoji: "👶", title: "Safe for All Ages", desc: "Newborns to elders, all welcome" },
                { emoji: "🧬", title: "Personalized", desc: "Unique to your constitution & symptoms" },
                { emoji: "♾️", title: "Long-lasting", desc: "Results that endure beyond treatment" },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border"
                  style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
                >
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <div className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>{item.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="leaf-divider mb-4">
              <span className="text-sage-500 text-sm tracking-widest uppercase font-medium">
                Our Promise
              </span>
            </div>
            <h2
              className="font-serif text-4xl md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
            >
              {t.home.whyTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUs.map((item, i) => (
              <div
                key={item.title}
                className="reveal group p-7 rounded-2xl border hover:shadow-lg transition-all hover:-translate-y-1"
                style={{ borderColor: "var(--border-color)", animationDelay: `${i * 0.1}s` }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                  style={{ backgroundColor: "var(--bg-surface-alt)" }}
                >
                  <item.icon className="w-6 h-6 text-sage-600" />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PATIENT JOURNEY TEASER ── */}
      <section
        className="py-20 px-6"
        style={{ background: "linear-gradient(135deg, #263727, #3a5a3a)" }}
      >
        <div className="max-w-4xl mx-auto text-center reveal">
          <div className="text-sage-300 text-sm tracking-widest uppercase mb-4">Your Healing Path</div>
          <h2
            className="font-serif text-4xl md:text-5xl text-white mb-6"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            How Your Journey
            <span className="block italic text-sage-300">Begins With Us</span>
          </h2>
          <p className="text-sage-300 mb-10 max-w-xl mx-auto">
            From your first consultation to lasting wellness — a gentle, step-by-step
            healing experience designed around you.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { step: "01", title: "Consultation", desc: "In-depth 45-min session covering your complete health history" },
              { step: "02", title: "Analysis", desc: "Dr. Agale studies your case holistically to find root causes" },
              { step: "03", title: "Treatment", desc: "Personalized remedy prescription with lifestyle guidance" },
              { step: "04", title: "Follow-up", desc: "Regular monitoring and remedy adjustments as you heal" },
            ].map((s) => (
              <div key={s.step} className="relative">
                <div className="text-sage-600 text-5xl font-serif font-light mb-3"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  {s.step}
                </div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-sage-400 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>

          <Link
            href="/patient-journey"
            className="inline-flex items-center gap-2 border-2 border-sage-400 text-sage-200 px-7 py-3 rounded-full font-medium hover:bg-sage-700 transition-all"
          >
            Learn More About Your Journey <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="leaf-divider mb-4">
              <span className="text-sage-500 text-sm tracking-widest uppercase font-medium">
                Real Stories
              </span>
            </div>
            <h2
              className="font-serif text-4xl md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
            >
              {t.home.testimonialTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t2, i) => (
              <div
                key={i}
                className="reveal rounded-2xl p-7 shadow-sm hover:shadow-md transition-all border"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-color)",
                  animationDelay: `${i * 0.15}s`,
                }}
              >
                <Quote className="w-8 h-8 mb-4" style={{ color: "var(--border-mid)" }} />
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: "var(--text-secondary)" }}>{`"${t2.text}"`}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>{t2.name}</div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t2.location} · {t2.condition}</div>
                  </div>
                  <div className="flex">
                    {[...Array(t2.rating)].map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 font-medium transition-colors hover:text-sage-800 dark:hover:text-sage-300"
              style={{ color: "var(--text-secondary)" }}
            >
              Read all patient stories <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6 relative overflow-hidden" style={{ backgroundColor: "var(--bg-muted)" }}>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16 reveal">
            <h2
              className="font-serif text-3xl md:text-5xl mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
            >
              Patient Stories
              <span className="block italic text-sage-500 text-2xl mt-2">Real Healing, Real Results</span>
            </h2>
            <div className="w-20 h-1 bg-sage-200 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "I was struggling with chronic PCOD and severe hormonal acne for 3 years. After 6 months of treatment with Dr. Pratima, my cycles are regular and my skin has cleared completely. The best part is it's all natural!",
                name: "Anjali S.",
                location: "Kalyan West",
                condition: "PCOD & Skin Care"
              },
              {
                text: "My son's recurrent tonsillitis was taking a toll on his studies. Homeopathy worked wonders for his immunity. He hasn't needed an antibiotic in over a year now. Truly grateful to Dr. Agale.",
                name: "Rajesh K.",
                location: "Andheri East",
                condition: "Pediatric Immunity"
              },
              {
                text: "Dealing with chronic psoriasis was emotionally draining. Dr. Pratima's approach wasn't just about the skin, but my overall well-being. The patches have reduced by 90% and I feel like myself again.",
                name: "Meera D.",
                location: "Dombivli",
                condition: "Psoriasis Treatment"
              }
            ].map((t, i) => (
              <div 
                key={i} 
                className="reveal bg-white p-8 rounded-3xl shadow-sm border border-sage-50 relative dark:bg-zinc-900 dark:border-zinc-800"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-sage-300 text-5xl font-serif absolute top-4 left-6 opacity-20">"</div>
                <p className="text-sage-700 leading-relaxed mb-6 italic relative z-10 dark:text-zinc-400">
                  {t.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 font-bold dark:bg-zinc-800">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sage-900 dark:text-zinc-100">{t.name}</div>
                    <div className="text-xs text-sage-400 uppercase tracking-widest">{t.condition} · {t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA STRIP ── */}
      <section
        className="py-16 px-6 text-center"
        style={{ background: "linear-gradient(135deg, #5a7f5a, #466546)" }}
      >
        <div className="max-w-2xl mx-auto reveal">
          <h2
            className="font-serif text-3xl md:text-4xl text-white mb-4"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Ready to Begin Your Healing Journey?
          </h2>
          <p className="text-sage-200 mb-8">
            Book a consultation with Dr. Pratima Agale today.
            Serving patients in Kalyan, Andheri, and across Mumbai.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20an%20appointment%20with%20Dr.%20Pratima%20Agale."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-lg hover:-translate-y-0.5"
            >
              Book Appointment
            </a>
            <a
              href="tel:+919359875511"
              className="border-2 border-white/40 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-all"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
      `}</style>
    </div>
  );
}
