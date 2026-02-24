"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Globe, Leaf } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { Locale } from "@/lib/translations";

const localeLabels: Record<Locale, string> = { en: "EN", hi: "हिं", mr: "मर" };

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
      className={`fixed top-0 w-full z-50 transition-all duration-500`}
      style={{
        backgroundColor: scrolled ? "rgba(253,250,245,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "0 1px 20px rgba(0,0,0,0.05)" : "none",
        borderBottom: scrolled ? "1px solid #e6ede6" : "none",
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-sage-500 flex items-center justify-center group-hover:bg-sage-600 transition-colors">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:block">
            <div
              className="font-serif text-lg leading-none"
              style={{ color: "#263727", fontFamily: "'Cormorant Garamond', serif" }}
            >
              Dr. Pratima Agale
            </div>
            <div className="text-xs tracking-widest text-sage-500 uppercase">BHMS, MD · Homeopathy</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-5 text-sm font-sans">
          <Link href="/" className="text-sage-800 hover:text-sage-500 transition-colors font-medium">
            {t.nav.home}
          </Link>
          <Link href="/about" className="text-sage-800 hover:text-sage-500 transition-colors font-medium">
            {t.nav.about}
          </Link>

          {/* Services mega menu */}
          <div
            className="relative"
            onMouseEnter={() => setOpenMenu("services")}
            onMouseLeave={() => setOpenMenu(null)}
          >
            <button className="flex items-center gap-1 text-sage-800 hover:text-sage-500 transition-colors font-medium">
              {t.nav.services}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openMenu === "services" ? "rotate-180" : ""}`} />
            </button>

            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[760px] bg-white rounded-2xl shadow-2xl border border-sage-100 transition-all duration-200 ${
                openMenu === "services" ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <div className="grid grid-cols-4 p-5 gap-4">
                {menuSections.map((section) => (
                  <div key={section.title}>
                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-sage-50">
                      <span>{section.emoji}</span>
                      <span className="text-xs font-semibold text-sage-700">{section.title}</span>
                    </div>
                    <ul className="space-y-2">
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setOpenMenu(null)}
                            className="text-xs text-sage-600 hover:text-sage-900 transition-colors block py-0.5"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="bg-sage-50 px-6 py-3 flex items-center justify-between border-t border-sage-100 rounded-b-2xl">
                <span className="text-xs text-sage-500">View all 40+ conditions treated by Dr. Pratima Agale</span>
                <Link
                  href="/conditions"
                  onClick={() => setOpenMenu(null)}
                  className="text-xs font-semibold text-sage-600 hover:text-sage-900 transition-colors"
                >
                  {t.nav.conditions} →
                </Link>
              </div>
            </div>
          </div>

          <Link href="/why-homeopathy" className="text-sage-800 hover:text-sage-500 transition-colors font-medium">
            {t.nav.whyHomeopathy}
          </Link>
          <Link href="/case-studies" className="text-sage-800 hover:text-sage-500 transition-colors font-medium">
            {t.nav.caseStudies}
          </Link>
          <Link href="/blog" className="text-sage-800 hover:text-sage-500 transition-colors font-medium">
            {t.nav.blog}
          </Link>
        </div>

        {/* Right: language + CTA */}
        <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-0.5 border border-sage-200 rounded-full px-2 py-1 bg-white/80">
            <Globe className="w-3.5 h-3.5 text-sage-400 mr-1" />
            {(["en", "hi", "mr"] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2.5 py-0.5 text-xs rounded-full transition-all font-medium ${
                  locale === l ? "bg-sage-500 text-white" : "text-sage-600 hover:bg-sage-50"
                }`}
              >
                {localeLabels[l]}
              </button>
            ))}
          </div>
          <Link
            href="/contact"
            className="bg-sage-500 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-sage-600 transition-all hover:shadow-md"
          >
            {t.hero.cta}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button className="lg:hidden p-2 text-sage-700" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-sage-100 shadow-xl overflow-y-auto max-h-[85vh]">
          <div className="px-6 py-5 flex flex-col gap-0.5">
            {/* Language */}
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-sage-50">
              <Globe className="w-4 h-4 text-sage-400" />
              {(["en", "hi", "mr"] as Locale[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-3 py-1.5 text-sm rounded-full border font-medium transition-colors ${
                    locale === l ? "bg-sage-500 text-white border-sage-500" : "border-sage-200 text-sage-600 hover:bg-sage-50"
                  }`}
                >
                  {l === "en" ? "English" : l === "hi" ? "हिंदी" : "मराठी"}
                </button>
              ))}
            </div>

            {/* All nav links flat for mobile */}
            {[
              { href: "/", label: t.nav.home },
              { href: "/about", label: t.nav.about },
              { href: "/conditions", label: "✨ " + t.nav.conditions },
              { href: "/conditions/psoriasis", label: "  › Psoriasis" },
              { href: "/conditions/eczema", label: "  › Eczema" },
              { href: "/conditions/acne", label: "  › Acne" },
              { href: "/conditions/hair-loss", label: "  › Hair Loss" },
              { href: "/conditions/vitiligo", label: "  › Vitiligo" },
              { href: "/services/womens-health", label: "🌸 " + t.nav.womensHealth },
              { href: "/conditions/pcod-pcos", label: "  › PCOD / PCOS" },
              { href: "/conditions/thyroid", label: "  › Thyroid" },
              { href: "/services/pediatric", label: "🌱 " + t.nav.pediatric },
              { href: "/conditions/child-immunity", label: "  › Child Immunity" },
              { href: "/conditions/adhd", label: "  › ADHD" },
              { href: "/services/chronic-disease", label: "💚 " + t.nav.chronic },
              { href: "/conditions/arthritis", label: "  › Arthritis" },
              { href: "/conditions/migraines", label: "  › Migraines" },
              { href: "/why-homeopathy", label: t.nav.whyHomeopathy },
              { href: "/case-studies", label: t.nav.caseStudies },
              { href: "/patient-journey", label: t.nav.journey },
              { href: "/blog", label: t.nav.blog },
              { href: "/contact", label: t.nav.contact },
            ].map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`py-2 text-sm border-b border-sage-50 transition-colors ${
                  item.label.startsWith("  ›")
                    ? "pl-6 text-sage-500 hover:text-sage-700"
                    : "text-sage-800 font-medium hover:text-sage-500"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="bg-sage-500 text-white text-center py-3.5 rounded-full font-medium mt-4 hover:bg-sage-600 transition-colors"
            >
              {t.hero.cta}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
