"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ChevronDown,
  Globe,
  LayoutDashboard,
  User,
  LogOut,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useAppointment } from "@/lib/appointment-context";
import { useLanguage } from "@/lib/language-context";
import { useTheme } from "@/lib/theme-context";
import { Locale } from "@/lib/translations";

const localeLabels: Record<Locale, string> = {
  en: "EN",
  hi: "हिं",
  mr: "मर",
};

function getInitials(name?: string | null): string {
  if (!name || !name.trim()) return "P";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Navbar() {
  const { openAppointment } = useAppointment();
  const { t, locale, setLocale } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, userProfile, isDoctor, loading, openLoginModal, signOut } =
    useAuth();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  const profilePhoto = userProfile?.photoURL || user?.photoURL || null;
  const profileName =
    userProfile?.fullName || user?.displayName || "Patient";
  const initials = getInitials(profileName);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setOpenMenu(null);
    setMenuOpen(false);
    setProfileDropdownOpen(false);
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
              backgroundColor:
                theme === "dark"
                  ? "rgba(255,255,255,0.92)"
                  : "var(--bg-surface)",
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
          <Link
            href="/"
            className="text-sage-800 hover:text-sage-500 transition-colors"
          >
            {t.nav.home}
          </Link>

          <Link
            href="/about"
            className="text-sage-800 hover:text-sage-500 transition-colors"
          >
            {t.nav.about}
          </Link>

          {/* SERVICES MENU */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() =>
                setOpenMenu(openMenu === "services" ? null : "services")
              }
              className="flex items-center gap-1 text-sage-800 hover:text-sage-500 transition-colors cursor-pointer"
            >
              <span>{t.nav.services}</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  openMenu === "services" ? "rotate-180 text-sage-500" : ""
                }`}
              />
            </button>

            {/* Mega Dropdown Menu */}
            {openMenu === "services" && (
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-[850px] p-6 rounded-2xl border shadow-2xl transition-all duration-300 z-50 animate-in fade-in slide-in-from-top-2"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-color)",
                }}
              >
                <div className="grid grid-cols-4 gap-6">
                  {menuSections.map((sec, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-center gap-2 pb-2 border-b border-sage-100 dark:border-sage-800">
                        <span className="text-base">{sec.emoji}</span>
                        <h4 className="font-serif font-bold text-sm text-sage-800 tracking-wide">
                          {sec.title}
                        </h4>
                      </div>
                      <ul className="space-y-1.5">
                        {sec.items.map((item, i) => (
                          <li key={i}>
                            <Link
                              href={item.href}
                              onClick={() => setOpenMenu(null)}
                              className="text-xs text-sage-600 dark:text-sage-400 hover:text-sage-800 dark:hover:text-sage-200 hover:translate-x-1 transition-all block py-1 font-medium"
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

          <Link
            href="/why-homeopathy"
            className="text-sage-800 hover:text-sage-500 transition-colors"
          >
            {t.nav.whyHomeopathy}
          </Link>

          <Link
            href="/case-studies"
            className="text-sage-800 hover:text-sage-500 transition-colors"
          >
            {t.nav.caseStudies}
          </Link>

          <Link
            href="/blog"
            className="text-sage-800 dark:text-sage-300 hover:text-sage-500 transition-colors"
          >
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

          {/* Language Switcher */}
          <div
            className="flex items-center rounded-full px-2 py-1 border"
            style={{
              backgroundColor: "var(--bg-subtle)",
              borderColor: "var(--border-color)",
            }}
          >
            <Globe
              className="w-3.5 h-3.5 mr-1"
              style={{ color: "var(--text-muted)" }}
            />
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

          {/* Doctor Dashboard Link */}
          {!loading && user && isDoctor && (
            <Link
              href="/doctor"
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border border-sage-400 text-sage-600 hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors font-medium"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Doctor Portal</span>
            </Link>
          )}

          {/* Patient Logged In: Round Profile Icon at Top Right */}
          {!loading && user && !isDoctor && (
            <div className="relative" ref={profileDropdownRef}>
              <Link
                href="/patient/profile"
                className="relative block rounded-full transition-all hover:scale-105 active:scale-95 group focus:outline-none"
                title={`Logged in as ${profileName}. Click to view Profile.`}
                aria-label="View Patient Profile"
                onMouseEnter={() => setProfileDropdownOpen(true)}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-500/80 hover:border-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 shadow-sm flex items-center justify-center cursor-pointer">
                  {profilePhoto ? (
                    <Image
                      src={profilePhoto}
                      alt={profileName}
                      fill
                      unoptimized
                      referrerPolicy="no-referrer"
                      className="object-cover"
                      sizes="40px"
                    />
                  ) : (
                    <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200 select-none uppercase">
                      {initials}
                    </span>
                  )}
                  {/* Active online green dot */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
                </div>
              </Link>

              {/* Hover Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  onMouseLeave={() => setProfileDropdownOpen(false)}
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xl p-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-700/60 mb-1">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate text-sm">
                      {profileName}
                    </p>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                      {userProfile?.phone || user?.email || "Patient"}
                    </p>
                  </div>

                  <Link
                    href="/patient/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-zinc-700 text-emerald-950 dark:text-emerald-200 font-semibold transition"
                  >
                    <User className="w-4 h-4 text-emerald-600" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    href="/patient/dashboard"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition"
                  >
                    <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                    <span>Patient Dashboard</span>
                  </Link>

                  <Link
                    href="/patient/medical-history"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition"
                  >
                    <FileText className="w-4 h-4 text-zinc-400" />
                    <span>Medical Records</span>
                  </Link>

                  <Link
                    href="/patient/chat"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-medium transition"
                  >
                    <MessageSquare className="w-4 h-4 text-zinc-400" />
                    <span>Doctor Chat</span>
                  </Link>

                  <div className="border-t border-zinc-100 dark:border-zinc-700/60 mt-1 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        signOut();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-medium transition text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Patient Not Logged In: Login button that opens Modal Popup without redirecting */}
          {!loading && !user && (
            <button
              type="button"
              onClick={() => openLoginModal("/patient/profile")}
              className="flex items-center gap-1.5 text-sm px-3.5 py-2 rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] hover:text-sage-600 hover:bg-sage-50 dark:hover:bg-sage-950/40 transition-colors font-medium cursor-pointer"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}

          {/* Book Appointment CTA */}
          <button
            type="button"
            onClick={() => openAppointment()}
            className="flex items-center gap-2 bg-sage-500 text-white text-sm px-5 py-2.5 rounded-full hover:bg-sage-600 transition-colors cursor-pointer shadow-xs"
          >
            {t.hero.cta}
          </button>
        </div>

        {/* MOBILE HEADER CONTROLS */}
        <div className="lg:hidden flex items-center gap-2">
          {/* Round Profile Icon on Mobile Top Right */}
          {!loading && user && !isDoctor && (
            <Link
              href="/patient/profile"
              className="relative p-0.5 rounded-full ring-2 ring-emerald-500/80 active:scale-95 transition-transform"
              aria-label="My Profile"
              title="My Profile"
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-emerald-500 bg-emerald-50 dark:bg-emerald-950/70 flex items-center justify-center">
                {profilePhoto ? (
                  <Image
                    src={profilePhoto}
                    alt={profileName}
                    fill
                    unoptimized
                    referrerPolicy="no-referrer"
                    className="object-cover"
                    sizes="32px"
                  />
                ) : (
                  <span className="font-bold text-[11px] text-emerald-900 dark:text-emerald-200 uppercase">
                    {initials}
                  </span>
                )}
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white dark:ring-zinc-900" />
              </div>
            </Link>
          )}

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
            className="p-2 cursor-pointer"
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
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="px-6 py-4 space-y-3">
            <Link
              href="/"
              className="block py-1 text-sage-800 dark:text-sage-200"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/about"
              className="block py-1 text-sage-800 dark:text-sage-200"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/why-homeopathy"
              className="block py-1 text-sage-800 dark:text-sage-200"
              onClick={() => setMenuOpen(false)}
            >
              Why Homeopathy
            </Link>
            <Link
              href="/case-studies"
              className="block py-1 text-sage-800 dark:text-sage-200"
              onClick={() => setMenuOpen(false)}
            >
              Case Studies
            </Link>
            <Link
              href="/blog"
              className="block py-1 text-sage-800 dark:text-sage-200"
              onClick={() => setMenuOpen(false)}
            >
              Blog
            </Link>

            {!loading && user && isDoctor && (
              <Link
                href="/doctor"
                className="block py-1 text-sage-800 dark:text-sage-200 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                Doctor Dashboard
              </Link>
            )}

            {/* Mobile Logged-in Patient Card */}
            {!loading && user && !isDoctor && (
              <div className="pt-2 pb-1 border-t border-zinc-200 dark:border-zinc-700/60 space-y-2">
                <Link
                  href="/patient/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800"
                >
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-emerald-500 bg-white shrink-0 flex items-center justify-center">
                    {profilePhoto ? (
                      <Image
                        src={profilePhoto}
                        alt={profileName}
                        fill
                        unoptimized
                        referrerPolicy="no-referrer"
                        className="object-cover"
                        sizes="36px"
                      />
                    ) : (
                      <span className="font-bold text-xs text-emerald-900 uppercase">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-emerald-950 dark:text-emerald-200 truncate">
                      {profileName}
                    </p>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                      View & Edit Profile →
                    </p>
                  </div>
                </Link>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/patient/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-center font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/patient/medical-history"
                    onClick={() => setMenuOpen(false)}
                    className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-center font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Records
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="w-full text-left py-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            )}

            {/* Mobile Not Logged In: Open Login Modal */}
            {!loading && !user && (
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  openLoginModal("/patient/profile");
                }}
                className="block w-full text-left py-2 text-sage-800 dark:text-sage-200 font-medium cursor-pointer"
              >
                Patient Login
              </button>
            )}

            <div className="pt-3 flex flex-col gap-2.5">
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
