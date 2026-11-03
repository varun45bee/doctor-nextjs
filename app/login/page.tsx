"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { ShieldCheck, MessageSquare, FileText, ArrowLeft, Loader2 } from "lucide-react";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect");
  const { user, isDoctor, signInWithGoogle, authError, clearAuthError, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (isDoctor) {
        router.replace("/doctor");
      } else {
        router.replace(redirectUrl || "/patient/dashboard");
      }
    }
  }, [user, isDoctor, loading, redirectUrl, router]);

  const handleSignIn = async () => {
    setSubmitting(true);
    clearAuthError();
    try {
      await signInWithGoogle(redirectUrl || undefined);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg-base)" }}
    >
      {/* Top Bar with Back Button */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-sage-700 dark:text-sage-300 hover:text-sage-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clinic Home
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden relative border border-sage-200 bg-white shadow-xs">
            <Image src="/logo.png" alt="Dr. Pratima Agale" fill className="object-contain p-0.5" priority />
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-900/50 text-sage-800 dark:text-sage-200 border border-sage-200 dark:border-sage-800 font-medium">
            Dr. Pratima Agale Clinic
          </span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto my-auto py-8">
        <div
          className="rounded-3xl border p-8 sm:p-10 shadow-xl transition-all"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
          }}
        >
          {/* Clinic Branding Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 relative rounded-full overflow-hidden shadow-md border-2 border-sage-300 dark:border-sage-700 bg-white p-2">
              <Image
                src="/logo.png"
                alt="Dr. Pratima Agale Clinic"
                fill
                className="object-contain p-1"
                priority
              />
            </div>
            <h1
              className="text-2xl sm:text-3xl font-serif text-[var(--text-primary)] mb-2"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Patient Portal Sign In
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Securely access your medical profile, consultation records, and real-time messaging with Dr. Pratima Agale.
            </p>
          </div>

          {/* Auth Error Banner */}
          {authError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs sm:text-sm">
              <p className="font-semibold mb-1">Sign-in Notice</p>
              <p>{authError}</p>
            </div>
          )}

          {/* Google Sign-In Button */}
          <button
            type="button"
            onClick={handleSignIn}
            disabled={submitting || loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 text-zinc-800 dark:text-zinc-100 font-medium text-sm transition-all shadow-sm hover:shadow active:scale-[0.99] disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin text-sage-600" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            <span>{submitting ? "Signing you in..." : "Continue with Google"}</span>
          </button>

          {/* Privacy & Medical Protection Note */}
          <div className="mt-8 pt-6 border-t border-[var(--border-color)] space-y-3">
            <div className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Encrypted medical records & data privacy</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
              <MessageSquare className="w-4 h-4 text-sage-600 dark:text-sage-400 shrink-0" />
              <span>Direct 1-on-1 real-time chat with the doctor</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[var(--text-secondary)]">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Digital prescriptions & document uploads</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-6xl w-full mx-auto text-center text-xs text-[var(--text-muted)] py-4">
        © {new Date().getFullYear()} Dr. Pratima Agale Homeopathic Clinic. All patient data is confidential and protected.
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
          <Loader2 className="w-8 h-8 animate-spin text-sage-600" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
