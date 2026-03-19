"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Locale } from "@/lib/translations";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  hi: "हिं",
  mr: "मर",
};

export default function Navbar() {
  const { t, locale, setLocale } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const menuSections = [
    {
      title: t.nav.skin,
      emoji: "✨",
      items: [
        { label: "Psoriasis", href: "/conditions/psoriasis" },
        { label: "Eczema", href: "/conditions/eczema" },
        { label: "Acne & Pimples", href: "/conditions/acne" },
        { label: "Hair Loss", href: "/conditions/hair-loss" },
        { label: "Vitiligo", href: "/conditions/vitiligo" },
      ],
    },
    {
      title: t.nav.womensHealth,
      emoji: "🌸",
      items: [
        { label: "PCOD / PCOS", href: "/conditions/pcod-pcos" },
        { label: "Thyroid Disorders", href: "/conditions/thyroid" },
        { label: "Menopause", href: "/conditions/menopause" },
        { label: "Hormonal Imbalance", href: "/conditions/hormonal-imbalance" },
        { label: "Infertility", href: "/conditions/infertility" },
      ],
    },
    {
      title: t.nav.pediatric,
      emoji: "🌱",
      items: [
        { label: "Child Immunity", href: "/conditions/child-immunity" },
        { label: "ADHD", href: "/conditions/adhd" },
        { label: "Allergies & Asthma", href: "/conditions/allergies-asthma" },
        { label: "Tonsillitis", href: "/conditions/tonsillitis" },
        { label: "Autism Support", href: "/conditions/autism-support" },
      ],
    },
    {
      title: t.nav.chronic,
      emoji: "💚",
      items: [
        { label: "Arthritis", href: "/conditions/arthritis" },
        { label: "Migraines", href: "/conditions/migraines" },
        { label: "IBS / Digestive", href: "/conditions/ibs-digestive" },
        { label: "Anxiety & Stress", href: "/conditions/anxiety-stress" },
        { label: "Sinusitis", href: "/conditions/sinusitis" },
      ],
    },
  ];

  return (
    <header
      className="fixed top-0 w-full z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(253,250,245,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.05)" : "none",
        borderBottom: scrolled ? "1px solid #e6ede6" : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-[19px] py-4 flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="relative w-12 h-12 rounded-full overflow-hidden bg-transparent">
            <Image
              src="/logo.png"
              alt="Dr. Pratima Agale"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-5 text-sm font-medium">
          <Link href="/" className="text-sage-800 hover:text-sage-500 transition-colors">
            {t.nav.home}
          </Link>

          <Link href="/about" className="text-sage-800 hover:text-sage-500 transition-colors">
            {t.nav.about}
          </Link>

          {/* SERVICES MENU */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("services")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex items-center gap-1 text-sage-800 hover:text-sage-500 transition-colors">
              {t.nav.services}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  openMenu === "services" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "services" && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[760px] bg-white rounded-2xl shadow-2xl border border-sage-100">
                <div className="grid grid-cols-4 p-5 gap-4">
                  {menuSections.map((section) => (
                    <div key={section.title}>
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-sage-50">
                        <span>{section.emoji}</span>
                        <span className="text-xs font-semibold text-sage-700 uppercase tracking-wide">
                          {section.title}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {section.items.map((item) => (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className="text-xs text-sage-600 hover:text-sage-900 transition-colors"
                            >
                              {item.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/why-homeopathy" className="text-sage-800 hover:text-sage-500 transition-colors">
            {t.nav.whyHomeopathy}
          </Link>

          <Link href="/case-studies" className="text-sage-800 hover:text-sage-500 transition-colors">
            {t.nav.caseStudies}
          </Link>

          <Link href="/blog" className="text-sage-800 hover:text-sage-500 transition-colors">
            {t.nav.blog}
          </Link>

      
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-3">
          <div className="flex items-center border border-sage-200 rounded-full px-2 py-1 bg-white/80">
            <Globe className="w-3.5 h-3.5 text-sage-400 mr-1" />
            {(["en", "hi", "mr"] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${
                  locale === l
                    ? "bg-sage-500 text-white"
                    : "text-sage-600 hover:bg-sage-50"
                }`}
              >
                {localeLabels[l]}
              </button>
            ))}
          </div>

          <Link
            href="/contact"
            className="bg-sage-500 text-white text-sm px-5 py-2.5 rounded-full hover:bg-sage-600 transition-colors"
          >
            {t.hero.cta}
          </Link>
        </div>

        {/* MOBILE TOGGLE */}
        <button
          className="lg:hidden p-2 text-sage-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-sage-100">
          <div className="px-6 py-4 space-y-3">

            <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/about" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/why-homeopathy" onClick={() => setMenuOpen(false)}>Why Homeopathy</Link>
            <Link href="/case-studies" onClick={() => setMenuOpen(false)}>Case Studies</Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)}>Blog</Link>

             

          </div>
        </div>
      )}
    </header>
  );
}