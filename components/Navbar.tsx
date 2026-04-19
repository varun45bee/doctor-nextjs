"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { Locale } from "@/lib/translations";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  hi: "हिं",
  mr: "मर",
};

export default function Navbar() {
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
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
        backgroundColor: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        boxShadow: scrolled ? "var(--nav-shadow)" : "none",
        borderBottom: scrolled ? "1px solid var(--nav-border)" : "none",
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
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[760px] rounded-2xl shadow-2xl border"
                style={{ backgroundColor: "var(--dropdown-bg)", borderColor: "var(--border-color)" }}
              >
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

          <Link href="/blog" className="text-sage-800 dark:text-sage-300 hover:text-sage-500 transition-colors">
            {t.nav.blog}
          </Link>

      
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            id="theme-toggle-desktop"
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle dark mode"
          >
            <span className="theme-toggle-thumb">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </button>

          <div
            className="flex items-center rounded-full px-2 py-1 border"
            style={{ backgroundColor: "var(--bg-subtle)", borderColor: "var(--border-color)" }}
          >
            <Globe className="w-3.5 h-3.5 mr-1" style={{ color: "var(--text-muted)" }} />
            {(["en", "hi", "mr"] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => setLocale(l)}
                className={`px-2.5 py-0.5 text-xs rounded-full font-medium ${
                  locale === l
                    ? "bg-sage-500 text-white"
                    : "hover:bg-sage-50 dark:hover:bg-sage-800"
                }`}
                style={locale !== l ? { color: "var(--text-secondary)" } : {}}
              >
                {localeLabels[l]}
              </button>
            ))}
          </div>

          {/* WhatsApp Icon Button */}
          

     <a
  href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Pratima%20Agale."
  target="_blank"
  rel="noopener noreferrer"
  className="flex items-center gap-2 bg-sage-500 text-white text-sm px-5 py-2.5 rounded-full hover:bg-sage-600 transition-colors"
>
  {/* WhatsApp Icon */}
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="white"
    className="w-4 h-4"
  >
    <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.67 4.77 1.84 6.76L2 30l7.44-1.8A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.6l-.42-.25-4.42 1.07 1.1-4.3-.28-.44A11.47 11.47 0 0 1 4.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.3-8.57c-.34-.17-2.02-1-2.34-1.11-.32-.11-.55-.17-.78.17-.23.34-.9 1.11-1.1 1.34-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.02-1.9-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.08-.17-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.59h-.66c-.23 0-.6.08-.91.4-.32.32-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.02-.82 2.31-1.62.28-.8.28-1.48.2-1.62-.08-.14-.3-.22-.64-.39z" />
  </svg>

  {t.hero.cta}
</a>
        </div>

        {/* MOBILE TOGGLE */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            id="theme-toggle-mobile"
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle dark mode"
          >
            <span className="theme-toggle-thumb">
              {theme === "dark" ? "🌙" : "☀️"}
            </span>
          </button>
          <button
            className="p-2"
            style={{ color: "var(--text-secondary)" }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          className="lg:hidden border-t"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
        >
          <div className="px-6 py-4 space-y-3">

            <Link href="/" className="block py-1 text-sage-800" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href="/about" className="block py-1 text-sage-800" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/why-homeopathy" className="block py-1 text-sage-800" onClick={() => setMenuOpen(false)}>Why Homeopathy</Link>
            <Link href="/case-studies" className="block py-1 text-sage-800" onClick={() => setMenuOpen(false)}>Case Studies</Link>
            <Link href="/blog" className="block py-1 text-sage-800" onClick={() => setMenuOpen(false)}>Blog</Link>

            <div className="pt-3 flex flex-col gap-3">
             
           <a
  href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20book%20a%20consultation%20with%20Dr.%20Pratima%20Agale."
  target="_blank"
  rel="noopener noreferrer"
  onClick={() => setMenuOpen(false)}
  className="flex items-center justify-center gap-2 w-full bg-sage-500 text-white py-3 rounded-full font-medium text-sm"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    fill="white"
    className="w-5 h-5"
  >
    <path d="M16 2C8.28 2 2 8.28 2 16c0 2.46.67 4.77 1.84 6.76L2 30l7.44-1.8A13.93 13.93 0 0 0 16 30c7.72 0 14-6.28 14-14S23.72 2 16 2zm0 25.5a11.44 11.44 0 0 1-5.83-1.6l-.42-.25-4.42 1.07 1.1-4.3-.28-.44A11.47 11.47 0 0 1 4.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.3-8.57c-.34-.17-2.02-1-2.34-1.11-.32-.11-.55-.17-.78.17-.23.34-.9 1.11-1.1 1.34-.2.23-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.02-1.9-2.36-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.08-.17-.78-1.88-1.07-2.57-.28-.68-.57-.58-.78-.59h-.66c-.23 0-.6.08-.91.4-.32.32-1.2 1.17-1.2 2.86s1.23 3.32 1.4 3.55c.17.23 2.42 3.7 5.87 5.19.82.35 1.46.56 1.96.72.82.26 1.57.22 2.16.13.66-.1 2.02-.82 2.31-1.62.28-.8.28-1.48.2-1.62-.08-.14-.3-.22-.64-.39z" />
  </svg>

  {t.hero.cta}
</a>
            </div>


          </div>
        </div>
      )}
    </header>
  );
}