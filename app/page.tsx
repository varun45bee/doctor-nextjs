"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Star,
  Heart,
  Shield,
  Clock,
  Users,
  Award,
  Leaf,
  ChevronRight,
  Quote,
} from "lucide-react";
import { useAppointment } from "@/lib/appointment-context";
import { useLanguage } from "@/lib/language-context";
import {
  drawLineVariants,
  flipRevealVariants,
  gentleScaleInVariants,
  iconBounceVariants,
  quoteMarkVariants,
  softRiseVariants,
  softSlideLeftVariants,
  softSlideRightVariants,
  splitCharVariants,
  splitTextContainerVariants,
  splitWordVariants,
  staggerContainerVariants,
} from "@/lib/animations";
import AnimatedCounter from "@/components/animations/AnimatedCounter";
import FloatingBlobs from "@/components/animations/FloatingBlobs";
import RippleButton from "@/components/animations/RippleButton";

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

const whyUs = [
  {
    icon: Heart,
    title: "Individualized Treatment",
    desc: "Every prescription is uniquely crafted for you, your rhythms, and your constitution.",
  },
  {
    icon: Shield,
    title: "Zero Side Effects",
    desc: "Natural remedies designed to support healing gently and sustainably.",
  },
  {
    icon: Users,
    title: "All Ages Welcome",
    desc: "From infants to elders, care remains calm, safe, and personalized.",
  },
  {
    icon: Award,
    title: "MD-Qualified Expert",
    desc: "Clinical depth shaped by BHMS and MD training in homeopathy.",
  },
  {
    icon: Clock,
    title: "Root Cause Healing",
    desc: "Treatment focuses beyond symptoms to restore deeper balance.",
  },
  {
    icon: Leaf,
    title: "Holistic Approach",
    desc: "Mind, body, and lifestyle are treated as one healing system.",
  },
];

const featureCards = [
  { emoji: "🌱", title: "100% Natural", desc: "Plant, mineral, and nature-led remedies." },
  { emoji: "⚡", title: "Boosts Immunity", desc: "Supports your body's own healing intelligence." },
  { emoji: "🎯", title: "Root Cause", desc: "Treats the source, not just the surface." },
  { emoji: "👶", title: "Safe for All Ages", desc: "Gentle enough from newborn to senior years." },
  { emoji: "🧬", title: "Personalized", desc: "Your symptoms, history, and constitution matter." },
  { emoji: "♾️", title: "Long-lasting", desc: "Aims for steadier wellness, not temporary suppression." },
];

const steps = [
  { step: "01", title: "Consultation", desc: "An in-depth session to understand your complete health story." },
  { step: "02", title: "Analysis", desc: "A root-cause reading of symptoms, patterns, and constitution." },
  { step: "03", title: "Treatment", desc: "Personalized remedies and gentle lifestyle guidance." },
  { step: "04", title: "Follow-up", desc: "Thoughtful tracking and adjustment as healing unfolds." },
];

const testimonials = [
  {
    text: "After years of PCOD imbalance, I finally felt my body settle into a natural rhythm again. The care felt patient, precise, and deeply reassuring.",
    name: "Priya M.",
    location: "Kalyan",
    condition: "PCOD",
  },
  {
    text: "My son's recurrent infections reduced dramatically. What stood out most was how calmly every follow-up was handled, with real attention to the whole child.",
    name: "Rahul S.",
    location: "Andheri",
    condition: "Child Immunity",
  },
  {
    text: "The treatment for thyroid support felt holistic rather than mechanical. I wasn't just given medicine, I was genuinely guided through recovery.",
    name: "Sunita K.",
    location: "Mumbai",
    condition: "Thyroid",
  },
];

function splitWords(text: string) {
  return text.split(" ").filter(Boolean);
}

function splitChars(text: string) {
  return text.split("");
}

function useSectionInView() {
  const ref = useRef<HTMLElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-12% 0px" });
  return { ref, isInView };
}

function MotionSection({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { ref, isInView } = useSectionInView();

  return (
    <motion.section
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={softRiseVariants}
    >
      {children}
    </motion.section>
  );
}

export default function HomePage() {
  const { openAppointment } = useAppointment();
  const { t } = useLanguage();
  const reduceMotion = useReducedMotion();
  const [hydrated, setHydrated] = useState(false);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const conditionHeadingWords = useMemo(() => splitWords(t.home.conditionsTitle), [t.home.conditionsTitle]);
  const heroTitleWords = useMemo(() => splitWords(t.hero.tagline), [t.hero.tagline]);
  const heroSubtitleWords = useMemo(() => splitWords(t.hero.subtitle), [t.hero.subtitle]);

  const updateActiveTestimonial = () => {
    if (!testimonialRef.current) {
      return;
    }

    const container = testimonialRef.current;
    const cards = Array.from(container.querySelectorAll<HTMLElement>("[data-testimonial-card]"));
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let nextActive = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nextActive = index;
      }
    });

    setActiveTestimonial(nextActive);
  };

  const journeyLineVariants: Variants = reduceMotion
    ? { hidden: { pathLength: 1 }, visible: { pathLength: 1 } }
    : drawLineVariants;

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className="overflow-hidden">
      <section
        className="relative min-h-screen flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, var(--bg-surface-alt) 0%, var(--bg-base) 46%, var(--bg-surface-alt) 100%)",
        }}
      >
        <FloatingBlobs />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 pb-14 sm:pb-16 grid lg:grid-cols-2 gap-10 sm:gap-12 items-center">
          <motion.div initial={false} animate="visible" variants={staggerContainerVariants} className="text-center lg:text-left">
            <motion.div
              className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-medium tracking-[0.22em] sm:tracking-[0.25em] uppercase px-3.5 sm:px-4 py-2 rounded-full mb-6"
              style={{ backgroundColor: "var(--bg-surface-alt)", color: "var(--text-secondary)" }}
              variants={softRiseVariants}
            >
              <Leaf className="w-3.5 h-3.5" />
              Homeopathy Clinic · Kalyan, Maharashtra
            </motion.div>

            <motion.h1
              className="font-serif mb-6 leading-tight"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.9rem, 5vw, 4.5rem)",
                color: "var(--text-primary)",
                lineHeight: 1.08,
              }}
              variants={splitTextContainerVariants(0.1)}
            >
              <span className="flex flex-wrap justify-center lg:justify-start gap-x-2 sm:gap-x-3">
                {heroTitleWords.map((word) => (
                  <motion.span key={word} variants={splitWordVariants} className="inline-block">
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="mt-2 flex flex-wrap justify-center lg:justify-start gap-x-2 sm:gap-x-3 italic" style={{ color: "var(--sage-mid)" }}>
                {heroSubtitleWords.map((word) => (
                  <motion.span key={word} variants={splitWordVariants} className="inline-block">
                    {word}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            <motion.p
              style={{ color: "var(--text-secondary)" }}
              className="text-base sm:text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
              variants={softRiseVariants}
              transition={{ delay: 0.4 }}
            >
              {t.hero.description}
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 items-stretch sm:items-center justify-center lg:justify-start" variants={staggerContainerVariants}>
              <motion.button
                type="button"
                onClick={() => openAppointment()}
                className="flex w-full sm:w-auto justify-center items-center gap-2 bg-sage-500 text-white px-6 sm:px-7 py-3.5 rounded-full font-medium hover:bg-sage-600 transition-all hover:shadow-lg"
                variants={gentleScaleInVariants}
              >
                {t.hero.cta}
              </motion.button>

              <motion.div variants={gentleScaleInVariants}>
                <Link
                  href="/why-homeopathy"
                  className="flex w-full sm:w-auto justify-center items-center gap-2 border-2 border-sage-300 px-6 sm:px-7 py-3.5 rounded-full font-medium transition-all hover:bg-sage-50 dark:hover:bg-sage-900"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t.hero.ctaLearn}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </motion.div>

            <motion.div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:flex sm:flex-wrap sm:gap-6 mt-10 max-w-md mx-auto lg:max-w-none lg:mx-0" variants={staggerContainerVariants}>
              {[
                { n: 4, suffix: "+", l: t.home.statsYears },
                { n: 500, suffix: "+", l: t.home.statsPatients },
                { n: 50, suffix: "+", l: t.home.statsConditions },
                { n: 97, suffix: "%", l: t.home.statsSuccess },
              ].map((stat) => (
                <motion.div key={stat.l} className="text-center" variants={softRiseVariants}>
                  <AnimatedCounter
                    value={stat.n}
                    suffix={stat.suffix}
                    className="font-serif text-2xl font-semibold"
                  />
                  <div
                    className="font-serif text-2xl font-semibold hidden"
                    style={{ color: "var(--sage-mid)", fontFamily: "'Cormorant Garamond', serif" }}
                  />
                  <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {stat.l}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={false}
            animate={
              reduceMotion || !hydrated
                ? undefined
                : { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
            }
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="relative flex justify-center items-center mt-2 sm:mt-4 lg:mt-0"
          >
            <div
              className="relative w-[min(100%,280px)] min-[420px]:w-[min(100%,300px)] sm:w-[min(100%,340px)] h-[340px] min-[420px]:h-[360px] sm:h-[420px] rounded-[1.6rem] sm:rounded-[2rem] overflow-hidden shadow-2xl"
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
                  Compassionate, individualized care shaped by calm observation and clinical depth.
                </p>
              </div>
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white rounded-xl px-3 sm:px-4 py-2 shadow-lg flex items-center gap-2 whitespace-nowrap max-w-[90%]">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] sm:text-xs font-medium text-gray-700 truncate">500+ Patients Healed</span>
              </div>
            </div>

            <motion.div
              className="absolute -z-10 w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] rounded-full border-2 border-dashed border-sage-200 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={reduceMotion ? undefined : { rotate: 360 }}
              transition={reduceMotion ? undefined : { duration: 28, repeat: Infinity, ease: "linear" }}
            />
          </motion.div>
        </div>
      </section>

      <MotionSection
        className="conditions-glow py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="leaf-divider mb-4">
              <span className="text-sage-500 text-sm tracking-widest uppercase font-medium">Conditions We Treat</span>
            </div>

            <motion.h2
              className="font-serif text-4xl md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
              variants={splitTextContainerVariants(0.03)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-20% 0px" }}
            >
              {conditionHeadingWords.map((word, index) => (
                <motion.span key={`${word}-${index}`} variants={splitWordVariants} className="inline-block">
                  {word}
                  {index < conditionHeadingWords.length - 1 ? "\u00A0" : ""}
                </motion.span>
              ))}
            </motion.h2>

            <p className="mt-4 max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
              Comprehensive homeopathic solutions for 50+ health conditions, all natural and intentionally gentle.
            </p>
          </div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-12% 0px" }}
          >
            {conditions.map((condition) => (
              <motion.div key={condition.title} variants={softRiseVariants}>
                <motion.div whileHover={reduceMotion ? undefined : { y: -8 }}>
                  <Link
                    href={condition.href}
                    className="condition-card group block w-full h-full p-5 sm:p-6 rounded-2xl text-center border"
                  >
                    <motion.div
                      className="text-4xl mb-3 inline-block"
                      whileHover={reduceMotion ? undefined : { rotate: 360 }}
                      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {condition.icon}
                    </motion.div>
                    <div className="font-medium text-sm transition-colors" style={{ color: "var(--text-primary)" }}>
                      {condition.title}
                    </div>
                    <motion.div
                      className="mt-2 text-xs flex items-center justify-center gap-1"
                      style={{ color: "var(--text-muted)" }}
                      whileHover={reduceMotion ? undefined : { x: 6 }}
                    >
                      Learn more <ChevronRight className="w-3 h-3" />
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          <div className="text-center mt-8">
            <Link
              href="/conditions"
              className="inline-flex items-center gap-2 font-medium text-sm transition-colors hover:text-sage-800 dark:hover:text-sage-300"
              style={{ color: "var(--text-secondary)" }}
            >
              View all conditions <ArrowRight className="learn-arrow w-4 h-4" />
            </Link>
          </div>
        </div>
      </MotionSection>

      <MotionSection
        className="why-homeopathy-glow py-20 px-4 sm:px-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, var(--bg-surface-alt), var(--bg-base))" }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div
              variants={softSlideLeftVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-12% 0px" }}
            >
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
                Homeopathy treats the whole person, physical, mental, and emotional, with remedies chosen to support the body&apos;s own self-correcting intelligence.
              </p>
              <p className="leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
                The result is a pace of healing that feels steady, observant, and deeply individualized rather than forceful.
              </p>
              <Link
                href="/why-homeopathy"
                className="inline-flex items-center gap-2 bg-sage-500 text-white px-6 py-3 rounded-full font-medium hover:bg-sage-600 transition-all"
              >
                Discover the Science <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              className="grid grid-cols-2 gap-4"
              variants={staggerContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
            >
              {featureCards.map((item) => (
                <motion.div
                  key={item.title}
                  className="rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border"
                  style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
                  variants={softRiseVariants}
                >
                  <div className="text-2xl mb-2">{item.emoji}</div>
                  <div className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                    {item.title}
                  </div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {item.desc}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="py-20 px-4 sm:px-6" style={{ backgroundColor: "var(--bg-surface)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="leaf-divider mb-4">
              <span className="text-sage-500 text-sm tracking-widest uppercase font-medium">Our Promise</span>
            </div>
            <h2
              className="font-serif text-4xl md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
            >
              {t.home.whyTitle}
            </h2>
          </div>

          <motion.div
            className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
            variants={staggerContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-12% 0px" }}
          >
            {whyUs.map((item) => (
              <motion.div
                key={item.title}
                className="group p-7 rounded-2xl border hover:shadow-lg transition-all hover:-translate-y-1"
                style={{ borderColor: "var(--border-color)", transformStyle: "preserve-3d" }}
                variants={flipRevealVariants}
              >
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "var(--bg-surface-alt)" }}
                  variants={iconBounceVariants}
                >
                  <item.icon className="w-6 h-6 text-sage-600" />
                </motion.div>
                <h3 className="font-semibold mb-2" style={{ color: "var(--text-primary)" }}>
                  {item.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </MotionSection>

      <MotionSection
        className="py-20 px-4 sm:px-6"
        style={{ background: "linear-gradient(135deg, #263727, #3a5a3a)" }}
      >
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="text-sage-300 text-sm tracking-widest uppercase mb-4">Your Healing Path</div>
          <h2 className="font-serif text-4xl md:text-5xl text-white mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            How Your Journey
            <span className="block italic text-sage-300">Begins With Us</span>
          </h2>
          <p className="text-sage-300 mb-12 max-w-xl mx-auto text-sm sm:text-base">
            From first consultation to sustained follow-up, every step is paced to feel grounded and clear.
          </p>

          <div className="relative">
            <svg
              className="journey-line hidden md:block absolute left-1/2 top-6 -translate-x-1/2 h-[78%] w-20"
              viewBox="0 0 80 420"
              fill="none"
              aria-hidden="true"
            >
              <motion.path
                d="M40 0C40 80 40 120 40 200C40 280 40 320 40 420"
                stroke="rgba(190, 219, 190, 0.5)"
                strokeWidth="2.5"
                strokeLinecap="round"
                variants={journeyLineVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10% 0px" }}
              />
            </svg>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 md:gap-y-10 mb-12">
              {steps.map((step, index) => (
                <motion.div
                  key={step.step}
                  className={`relative ${index % 2 === 0 ? "md:pr-16" : "md:pl-16 md:mt-20"}`}
                  variants={index % 2 === 0 ? softSlideLeftVariants : softSlideRightVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10% 0px" }}
                >
                  <div className="journey-step-card rounded-[1.5rem] sm:rounded-[1.75rem] border border-white/10 bg-white/5 backdrop-blur-sm p-5 sm:p-6 text-left">
                    <div className="text-sage-600 text-5xl font-serif font-light mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      <AnimatedCounter value={Number(step.step)} prefix="" suffix="" />
                    </div>
                    <h3 className="text-white font-semibold mb-2">{step.title}</h3>
                    <p className="text-sage-300 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <Link
            href="/patient-journey"
            className="inline-flex items-center gap-2 border-2 border-sage-400 text-sage-200 px-7 py-3 rounded-full font-medium hover:bg-sage-700 transition-all"
          >
            Learn More About Your Journey <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </MotionSection>

      <MotionSection className="py-20 px-4 sm:px-6" style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="leaf-divider mb-4">
              <span className="text-sage-500 text-sm tracking-widest uppercase font-medium">Real Stories</span>
            </div>
            <h2
              className="font-serif text-4xl md:text-5xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)" }}
            >
              {t.home.testimonialTitle}
            </h2>
          </div>

          <div
            ref={testimonialRef}
            className="testimonial-track flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory"
            onScroll={updateActiveTestimonial}
          >
            {testimonials.map((testimonial, index) => (
              <motion.article
                key={testimonial.name}
                data-testimonial-card
                className="testimonial-card snap-center min-w-[92%] sm:min-w-[78%] md:min-w-[48%] lg:min-w-[32%] rounded-2xl p-5 sm:p-7 shadow-sm border"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-color)",
                }}
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        scale: activeTestimonial === index ? 1.03 : 0.98,
                        opacity: activeTestimonial === index ? 1 : 0.6,
                      }
                }
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div variants={quoteMarkVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Quote className="w-8 h-8 mb-4" style={{ color: "var(--border-mid)" }} />
                </motion.div>
                <p className="text-sm leading-relaxed mb-6 italic" style={{ color: "var(--text-secondary)" }}>
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
                      {testimonial.name}
                    </div>
                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {testimonial.location} · {testimonial.condition}
                    </div>
                  </div>
                  <div className="flex">
                    {[...Array(5)].map((_, starIndex) => (
                      <Star key={starIndex} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 font-medium transition-colors hover:text-sage-800 dark:hover:text-sage-300"
              style={{ color: "var(--text-secondary)" }}
            >
              Read all patient stories <ArrowRight className="learn-arrow w-4 h-4" />
            </Link>
          </div>
        </div>
      </MotionSection>

      <MotionSection className="cta-mesh py-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <h2 className="cta-shimmer font-serif text-3xl md:text-4xl text-white mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Ready to Begin Your Healing Journey?
          </h2>
          <p className="text-sage-200 mb-8">
            Book a consultation with Dr. Pratima Agale today. Serving patients in Kalyan, Andheri, and across Mumbai.
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <RippleButton
              onClick={() => openAppointment()}
              className="w-full sm:w-auto bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-lg"
            >
              Book Appointment
            </RippleButton>
            <RippleButton
              href="tel:+919359875511"
              className="w-full sm:w-auto border-2 border-white/40 text-white px-8 py-3.5 rounded-full font-medium hover:bg-white/10 transition-all"
            >
              Call Now
            </RippleButton>
          </div>
        </div>
      </MotionSection>
    </div>
  );
}
