"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  Loader2,
  ShieldCheck,
  MessageSquare,
  FileText,
  User,
  Phone,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string | null;
}

export default function LoginModal({
  isOpen,
  onClose,
  redirectUrl,
}: LoginModalProps) {
  const {
    signInWithGoogle,
    signInWithPhoneOrEmail,
    authError,
    clearAuthError,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<"google" | "quick">("google");
  const [submitting, setSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Reset inputs when opened
  useEffect(() => {
    if (isOpen) {
      clearAuthError();
      setLocalError(null);
      setSuccess(false);
    }
  }, [isOpen, clearAuthError]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Lock background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const targetRedirect = redirectUrl || "/patient/profile";

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setLocalError(null);
    clearAuthError();
    try {
      const ok = await signInWithGoogle(targetRedirect);
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err) {
      console.error("Google sign in failed:", err);
      setLocalError("Google sign-in was not completed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setLocalError("Please enter your name.");
      return;
    }
    if (!phone.trim() || phone.replace(/\D/g, "").length < 10) {
      setLocalError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setSubmitting(true);
    setLocalError(null);
    clearAuthError();

    try {
      const ok = await signInWithPhoneOrEmail(
        {
          fullName: fullName.trim(),
          phone: phone.trim(),
        },
        targetRedirect
      );

      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err) {
      console.error("Quick sign in failed:", err);
      setLocalError("Unable to sign in. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 select-none">
      {/* Frosted Glass Backdrop */}
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[4px] transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-md rounded-[28px] sm:rounded-[32px] bg-white dark:bg-[#14231b] border border-sage-200/80 dark:border-emerald-900/60 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label="Patient Portal Login"
      >
        {/* Top Header Wave Accent */}
        <div className="relative bg-gradient-to-r from-[#103a2b] to-[#19513d] text-white p-6 pb-7 select-none overflow-hidden">
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Clinic Branding */}
          <div className="flex items-center gap-3.5 pr-8">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/60 bg-white p-1 shadow-md shrink-0">
              <Image
                src="/logo.png"
                alt="Dr. Pratima Agale Clinic"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div>
              <span className="font-serif font-bold text-lg sm:text-xl text-white tracking-wide block leading-tight">
                Dr. Pratima Agale
              </span>
              <span className="text-[11px] uppercase tracking-wider text-emerald-200 font-medium block mt-0.5">
                Patient Portal Sign In
              </span>
            </div>
          </div>

          <p className="text-xs text-white/85 leading-relaxed mt-3">
            Access your personalized medical profile, prescriptions, and direct consultation records.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-5 bg-white dark:bg-[#14231b]">
          {/* Tab Selection */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-sage-50 dark:bg-zinc-800/80 border border-sage-200/70 dark:border-zinc-700/60 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setActiveTab("google");
                setLocalError(null);
              }}
              className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "google"
                  ? "bg-white dark:bg-zinc-700 text-emerald-950 dark:text-emerald-200 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <span>Google Sign-In</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("quick");
                setLocalError(null);
              }}
              className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === "quick"
                  ? "bg-white dark:bg-zinc-700 text-emerald-950 dark:text-emerald-200 shadow-xs"
                  : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Quick Access</span>
            </button>
          </div>

          {/* Success Notification */}
          {success && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-medium flex items-center gap-2">
              <span className="text-base">🎉</span>
              <span>Signed in successfully! Redirecting to your profile...</span>
            </div>
          )}

          {/* Error Banner */}
          {(localError || authError) && !success && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs">
              <p className="font-semibold mb-0.5">Notice</p>
              <p>{localError || authError}</p>
            </div>
          )}

          {/* Tab 1: Google Sign-In */}
          {activeTab === "google" && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-100 font-semibold text-sm transition-all shadow-xs hover:shadow active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-700" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17Z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                    />
                  </svg>
                )}
                <span>
                  {submitting ? "Signing you in..." : "Continue with Google"}
                </span>
              </button>

              <p className="text-[11px] text-center text-zinc-500 dark:text-zinc-400">
                1-click instant login. No password required.
              </p>
            </div>
          )}

          {/* Tab 2: Quick Patient Access */}
          {activeTab === "quick" && (
            <form onSubmit={handleQuickSignIn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your name"
                    disabled={submitting}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    maxLength={13}
                    disabled={submitting}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !fullName.trim() || !phone.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-[#184433] hover:bg-[#123628] active:scale-[0.99] text-white font-semibold text-sm transition shadow-sm disabled:opacity-50 cursor-pointer mt-1"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <span>Enter Patient Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Privacy & Security Highlights */}
          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2 select-none">
            <div className="flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Encrypted medical records & data privacy</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-400">
              <MessageSquare className="w-3.5 h-3.5 text-sage-600 dark:text-sage-400 shrink-0" />
              <span>Direct 1-on-1 consultation & chat with doctor</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-400">
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Digital prescriptions & report uploads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

