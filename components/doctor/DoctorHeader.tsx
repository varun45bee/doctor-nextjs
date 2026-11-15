"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LogOut,
  Stethoscope,
  Clock,
  ShieldCheck,
  Activity,
  Globe,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function DoctorHeader() {
  const { user, signOut } = useAuth();
  const [timeStr, setTimeStr] = useState("");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now)
      );
      setDateStr(
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        }).format(now)
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-md px-4 sm:px-6 py-3.5 transition-colors"
      style={{
        backgroundColor: "var(--bg-surface)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand & Clinic Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/doctor"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-sage-700 dark:bg-sage-600 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="font-serif text-lg sm:text-xl font-bold tracking-tight"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "var(--text-primary)",
                  }}
                >
                  Dr. Pratima Agale
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sage-100 text-sage-800 dark:bg-sage-900/60 dark:text-sage-300 border border-sage-200 dark:border-sage-800">
                  <ShieldCheck className="w-3 h-3 text-sage-600" />
                  Clinical Portal
                </span>
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-medium">
                Homeopathy Medical Practice · BHMS
              </p>
            </div>
          </Link>
        </div>

        {/* Live IST Clock & Practice Status */}
        <div className="hidden lg:flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
            <Clock className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400" />
            <span className="font-mono font-semibold text-[var(--text-primary)]">
              {timeStr || "Loading..."}
            </span>
            <span className="text-[var(--text-muted)] text-[11px]">
              (IST) · {dateStr}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Online Teleconsultation Active</span>
          </div>
        </div>

        {/* Doctor Identity & Controls */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)]">
              <div className="w-6 h-6 rounded-full bg-sage-200 dark:bg-sage-800 text-sage-800 dark:text-sage-200 flex items-center justify-center font-bold text-xs">
                {user.email ? user.email.charAt(0).toUpperCase() : "D"}
              </div>
              <div className="text-left text-xs leading-tight">
                <p className="font-semibold text-[var(--text-primary)] truncate max-w-[150px]">
                  {user.displayName || "Doctor"}
                </p>
                <p className="text-[10px] text-[var(--text-muted)] truncate max-w-[150px]">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Sign Out Button */}
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to sign out of the Doctor Portal?")) {
                signOut();
              }
            }}
            className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border border-[var(--border-color)] hover:border-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 text-[var(--text-secondary)] transition-all shadow-2xs"
            aria-label="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
