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
  { icon: "🌸", title: "PCOD / PCOS", href: "/services/womens-health", color: "#fdf0f5" },
  { icon: "🦋", title: "Thyroid Disorders", href: "/services/womens-health", color: "#f0f5fd" },
  { icon: "🌿", title: "Child Immunity", href: "/services/pediatric", color: "#f0fdf4" },
  { icon: "🧠", title: "ADHD in Children", href: "/services/pediatric", color: "#fdf8f0" },
  { icon: "💆", title: "Migraines", href: "/services/chronic-disease", color: "#fdf0f0" },
  { icon: "🫁", title: "Respiratory Issues", href: "/services/chronic-disease", color: "#f0fdf4" },
  { icon: "🦴", title: "Arthritis", href: "/services/chronic-disease", color: "#fdf5f0" },
  { icon: "✨", title: "Skin Disorders", href: "/services/womens-health", color: "#fdf0fb" },
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
        style={{
          background:
            "linear-gradient(135deg, #f4f7f4 0%, #faf3e6 40%, #f0f5f0 100%)",
        }}
      >
        {/* Background botanical decorations */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] opacity-10"
          style={{
            background:
              "radial-gradient(circle, #5a7f5a 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] opacity-8"
          style={{
            background:
              "radial-gradient(circle, #6b9e8a 0%, transparent 70%)",
          }}
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
            <div className="inline-flex items-center gap-2 bg-sage-100 text-sage-700 text-xs font-medium tracking-widest uppercase px-4 py-2 rounded-full mb-6">
              <Leaf className="w-3.5 h-3.5" />
              Homeopathy Clinic · Kalyan, Maharashtra
            </div>

            <h1
              className="font-serif mb-6 leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
                color: "#1e2820",
                lineHeight: 1.15,
              }}
            >
              {t.hero.tagline}
              <span
                className="block italic"
                style={{ color: "#5a7f5a" }}
              >
                {t.hero.subtitle}
              </span>
            </h1>

            <p className="text-sage-700 text-lg leading-relaxed mb-8 max-w-xl">
              {t.hero.description}
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="flex items-center gap-2 bg-sage-500 text-white px-7 py-3.5 rounded-full font-medium hover:bg-sage-600 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                {t.hero.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/why-homeopathy"
                className="flex items-center gap-2 border-2 border-sage-300 text-sage-700 px-7 py-3.5 rounded-full font-medium hover:bg-sage-50 transition-all"
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
                    style={{ color: "#5a7f5a", fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    {s.n}
                  </div>
                  <div className="text-xs text-sage-600 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — doctor card */}
          <div
            className="relative flex justify-center items-center page-enter"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Doctor image placeholder */}
            <div
              className="relative w-[340px] h-[420px] rounded-[2rem] overflow-hidden shadow-2xl"
              style={{ background: "linear-gradient(160deg, #e6ede6, #cddccd)" }}
            >
              {/* Placeholder — replace with actual image */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
  
  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-sage-300 mb-4">
    <Image
      src="/desk.jpeg"   // your image path
      alt="Dr. Pratima Agale"
      width={96}
      height={96}
className="object-cover w-full h-full scale-110"    />
  </div>

  <h2
    className="font-serif text-2xl text-sage-900 mb-1"
    style={{ fontFamily: "'Cormorant Garamond', serif" }}
  >
    Dr. Pratima Agale
  </h2>

  <p className="text-sage-600 text-sm font-medium">
    BHMS, MD (Homeopathy)
  </p>

  <p className="text-sage-500 text-xs mt-2">
    With 4 years of dedicated experience in Homeopathy, I provide compassionate,
    individualized care for patients of all ages.
  </p>

</div>

              {/* Floating badge */}
              <div
                className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-xl px-4 py-2 shadow-lg flex items-center gap-2"
              >
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-medium text-gray-700">500+ Patients Healed</span>
              </div>
            </div>

            {/* Decorative ring */}
            <div
              className="absolute -z-10 w-[380px] h-[380px] rounded-full border-2 border-dashed border-sage-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ animation: "spin 30s linear infinite" }}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-sage-400">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-sage-300 to-transparent" />
        </div>
      </section>

      {/* ── CONDITIONS GRID ── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#fff" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 reveal">
            <div className="leaf-divider mb-4">
              <span className="text-sage-500 text-sm tracking-widest uppercase font-medium">
                Conditions We Treat
              </span>
            </div>
            <h2
              className="font-serif text-4xl md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
            >
              {t.home.conditionsTitle}
            </h2>
            <p className="text-sage-600 mt-4 max-w-xl mx-auto">
              Comprehensive homeopathic solutions for 50+ health conditions — all natural, all safe.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {conditions.map((c, i) => (
              <Link
                key={c.title}
                href={c.href}
                className="reveal group p-6 rounded-2xl text-center hover:shadow-md transition-all hover:-translate-y-1 border border-transparent hover:border-sage-100"
                style={{
                  backgroundColor: c.color,
                  animationDelay: `${i * 0.08}s`,
                }}
              >
                <div className="text-4xl mb-3">{c.icon}</div>
                <div className="font-medium text-sage-900 text-sm group-hover:text-sage-600 transition-colors">
                  {c.title}
                </div>
                <div className="mt-2 text-xs text-sage-400 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn more <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/services/chronic-disease"
              className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-800 font-medium text-sm transition-colors"
            >
              View all conditions <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY HOMEOPATHY TEASER ── */}
      <section
        className="py-20 px-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f4f7f4, #faf3e6)",
        }}
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
                style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
              >
                Why Homeopathy
                <span className="block italic text-sage-500">Works Differently</span>
              </h2>
              <p className="text-sage-700 leading-relaxed mb-6">
                Unlike conventional medicine that targets symptoms, homeopathy treats the
                whole person — physical, mental, and emotional. It stimulates your body's
                own healing intelligence to resolve disease at its root.
              </p>
              <p className="text-sage-700 leading-relaxed mb-8">
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
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-sage-50 hover:shadow-md transition-all"
                >
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <div className="font-semibold text-sage-900 text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-sage-500 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="py-20 px-6" style={{ backgroundColor: "#fff" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="leaf-divider mb-4">
              <span className="text-sage-500 text-sm tracking-widest uppercase font-medium">
                Our Promise
              </span>
            </div>
            <h2
              className="font-serif text-4xl md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
            >
              {t.home.whyTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUs.map((item, i) => (
              <div
                key={item.title}
                className="reveal group p-7 rounded-2xl border border-sage-100 hover:border-sage-200 hover:shadow-lg transition-all hover:-translate-y-1"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-sage-50 flex items-center justify-center mb-4 group-hover:bg-sage-100 transition-colors">
                  <item.icon className="w-6 h-6 text-sage-600" />
                </div>
                <h3 className="font-semibold text-sage-900 mb-2">{item.title}</h3>
                <p className="text-sage-600 text-sm leading-relaxed">{item.desc}</p>
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
      <section className="py-20 px-6" style={{ backgroundColor: "#faf3e6" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14 reveal">
            <div className="leaf-divider mb-4">
              <span className="text-sage-500 text-sm tracking-widest uppercase font-medium">
                Real Stories
              </span>
            </div>
            <h2
              className="font-serif text-4xl md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "#1e2820" }}
            >
              {t.home.testimonialTitle}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t2, i) => (
              <div
                key={i}
                className="reveal bg-white rounded-2xl p-7 shadow-sm border border-cream-200 hover:shadow-md transition-all"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                <Quote className="w-8 h-8 text-sage-200 mb-4" />
                <p className="text-sage-700 text-sm leading-relaxed mb-6 italic">{`"${t2.text}"`}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sage-900">{t2.name}</div>
                    <div className="text-xs text-sage-500">{t2.location} · {t2.condition}</div>
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
              className="inline-flex items-center gap-2 text-sage-600 hover:text-sage-800 font-medium transition-colors"
            >
              Read all patient stories <ArrowRight className="w-4 h-4" />
            </Link>
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
            <Link
              href="/contact"
              className="bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-lg"
            >
              Book Appointment
            </Link>
            <a
              href="tel:+91XXXXXXXXXX"
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
