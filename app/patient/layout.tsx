"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import PatientGuard from "@/components/patient/PatientGuard";
import PatientAvatar from "@/components/patient/PatientAvatar";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, userProfile, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    {
      label: "Dashboard",
      href: "/patient/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "My Profile",
      href: "/patient/profile",
      icon: User,
    },
    {
      label: "Medical Records",
      href: "/patient/medical-history",
      icon: FileText,
    },
    {
      label: "Doctor Chat",
      href: "/patient/chat",
      icon: MessageSquare,
    },
  ];

  return (
    <PatientGuard>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        {/* Top Patient Portal Header */}
        <header
          className="sticky top-0 z-40 border-b backdrop-blur-md"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            {/* Left: Brand & Home Link */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-full overflow-hidden relative border border-sage-200 dark:border-sage-800 bg-white shadow-xs p-1">
                  <Image
                    src="/logo.png"
                    alt="Dr. Pratima Agale Clinic"
                    fill
                    className="object-contain p-0.5"
                    priority
                  />
                </div>
                <div>
                  <span
                    className="font-serif font-medium text-lg leading-tight block text-[var(--text-primary)]"
                    style={{ fontFamily: "'Cormorant Garamond', serif" }}
                  >
                    Dr. Pratima Agale
                  </span>
                  <span className="text-[10px] tracking-wide text-sage-600 dark:text-sage-400 font-semibold uppercase block">
                    Patient Portal
                  </span>
                </div>
              </Link>
            </div>

            {/* Middle: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                      isActive
                        ? "bg-sage-600 text-white shadow-sm"
                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-sage-50 dark:hover:bg-sage-950/40"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: User Menu & Actions */}
            <div className="flex items-center gap-2.5">
              {/* Back to main website */}
              <Link
                href="/"
                className="hidden lg:inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[var(--border-color)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-subtle)] transition-colors"
                title="Return to Clinic Website"
              >
                <span>Clinic Website</span>
                <ExternalLink className="w-3 h-3 text-[var(--text-muted)]" />
              </Link>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 flex items-center justify-center rounded-full border border-[var(--border-color)] text-xs hover:bg-[var(--bg-subtle)] transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? "🌙" : "☀️"}
              </button>

              {/* Profile Avatar / Name */}
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-[var(--border-color)]">
                <PatientAvatar
                  src={userProfile?.photoURL || user?.photoURL}
                  name={userProfile?.fullName || user?.displayName}
                  size="sm"
                />
                <span className="text-xs font-medium text-[var(--text-primary)] max-w-[120px] truncate">
                  {userProfile?.fullName || user?.displayName || "Patient"}
                </span>
              </div>

              {/* Sign Out Button */}
              <button
                onClick={() => signOut()}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border-color)] text-xs font-medium text-[var(--text-secondary)] hover:text-rose-600 hover:border-rose-300 dark:hover:border-rose-900 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                aria-label="Toggle Navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {mobileMenuOpen && (
            <div
              className="md:hidden border-t px-4 pt-3 pb-4 space-y-1"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-color)",
              }}
            >
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive
                        ? "bg-sage-600 text-white"
                        : "text-[var(--text-secondary)] hover:bg-sage-50 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="pt-2 border-t border-[var(--border-color)] flex items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] py-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Main Website</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 text-xs text-rose-600 py-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>
      </div>
    </PatientGuard>
  );
}

