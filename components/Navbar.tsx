"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import DoctorLoginButton from "@/components/DoctorLoginButton";
import { useAppointment } from "@/lib/appointment-context";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { Locale } from "@/lib/translations";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  hi: "हिं",
  mr: "मर",
};

export default function Navbar() {
  const { openAppointment } = useAppointment();
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  // Close menus on navigation
  useEffect(() => {
    setOpenMenu(null);
    setMenuOpen(false);
  }, [pathname]);

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
          <div
            className="relative w-12 h-12 rounded-full overflow-hidden border shadow-sm"
            style={{
              backgroundColor: theme === "dark" ? "rgba(255,255,255,0.92)" : "var(--bg-surface)",
              borderColor: "var(--border-color)",
              boxShadow:
                theme === "dark"
                  ? "0 10px 24px rgba(0,0,0,0.35)"
                  : "0 6px 16px rgba(10,16,10,0.08)",
            }}
          >
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
          >
            <button 
              onClick={() => setOpenMenu(openMenu === "services" ? null : "services")}
              className="flex items-center gap-1 text-sage-800 hover:text-sage-500 transition-colors"
            >
              {t.nav.services}
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform ${
                  openMenu === "services" ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenu === "services" && (
              <div
                ref={dropdownRef}
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
                              onClick={() => setOpenMenu(null)}
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

          <DoctorLoginButton />

          <button
            type="button"
            onClick={() => openAppointment()}
            className="flex items-center gap-2 bg-sage-500 text-white text-sm px-5 py-2.5 rounded-full hover:bg-sage-600 transition-colors"
          >
            {t.hero.cta}
          </button>
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
              <DoctorLoginButton />
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openAppointment();
                }}
                className="flex items-center justify-center gap-2 w-full bg-sage-500 text-white py-3 rounded-full font-medium text-sm"
              >
                {t.hero.cta}
              </button>
            </div>


          </div>
        </div>
      )}
    </header>
  );
}