"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  Loader2,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string | null;
  initialMode?: "signin" | "signup";
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function LoginModal({
  isOpen,
  onClose,
  redirectUrl,
  initialMode = "signin",
}: LoginModalProps) {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    sendPasswordReset,
    authError,
    clearAuthError,
  } = useAuth();

  // Mode: "signin" | "signup" | "forgot"
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(initialMode);

  // Sign In State
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up State
  const [fullName, setFullName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Reset inputs when opened
  useEffect(() => {
    if (isOpen) {
      if (initialMode) setMode(initialMode);
      clearAuthError();
      setLocalError(null);
      setSuccessMessage(null);
      setResetSent(false);
    }
  }, [isOpen, initialMode, clearAuthError]);

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

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    setLocalError(null);
    clearAuthError();
    try {
      const ok = await signInWithGoogle(targetRedirect);
      if (ok) {
        setSuccessMessage("Signed in with Google successfully!");
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err) {
      console.error("Google sign in failed:", err);
      setLocalError("Google sign-in was not completed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Email/Password Sign-In Handler
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!signInEmail.trim() || !EMAIL_REGEX.test(signInEmail.trim())) {
      setLocalError("Please enter a valid email address (e.g. yourname@gmail.com).");
      return;
    }

    if (!signInPassword) {
      setLocalError("Please enter your password.");
      return;
    }

    setSubmitting(true);

    try {
      const ok = await signInWithEmail(signInEmail, signInPassword, targetRedirect);
      if (ok) {
        setSuccessMessage("Signed in successfully!");
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err) {
      console.error("Sign in failed:", err);
      setLocalError("Invalid email or password. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Email/Password Sign-Up Handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!fullName.trim() || fullName.trim().length < 2) {
      setLocalError("Please enter your full name (at least 2 characters).");
      return;
    }

    if (!signUpEmail.trim() || !EMAIL_REGEX.test(signUpEmail.trim())) {
      setLocalError("Please enter a valid email address (e.g. yourname@gmail.com).");
      return;
    }

    if (!signUpPassword || signUpPassword.length < 6) {
      setLocalError("Password must be at least 6 characters long.");
      return;
    }

    if (signUpPassword !== confirmPassword) {
      setLocalError("Passwords do not match. Please re-enter.");
      return;
    }

    if (!agreeTerms) {
      setLocalError("Please agree to the Terms & Conditions and Privacy Policy to create an account.");
      return;
    }

    setSubmitting(true);

    try {
      const ok = await signUpWithEmail(fullName, signUpEmail, signUpPassword, targetRedirect);
      if (ok) {
        setSuccessMessage("Account created successfully!");
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (err) {
      console.error("Sign up failed:", err);
      setLocalError("Unable to create account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Password Reset Handler
  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearAuthError();

    if (!forgotEmail.trim() || !EMAIL_REGEX.test(forgotEmail.trim())) {
      setLocalError("Please enter a valid email address (e.g. yourname@gmail.com).");
      return;
    }

    setSubmitting(true);

    try {
      const ok = await sendPasswordReset(forgotEmail);
      if (ok) {
        setResetSent(true);
      }
    } catch (err) {
      console.error("Reset password failed:", err);
      setLocalError("Could not send reset email. Please verify your address.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 select-none">
      {/* Frosted Glass Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        className="relative w-full max-w-[440px] rounded-[30px] sm:rounded-[36px] bg-white dark:bg-[#12231b] border border-sage-200/80 dark:border-emerald-900/60 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-label={mode === "signup" ? "Create Your Account" : "Sign In to Your Account"}
      >
        {/* Top Header with Deep Emerald Gradient & Organic Luminous Waves */}
        <div className="relative bg-gradient-to-br from-[#0a3828] via-[#0d4432] to-[#12503c] text-white p-6 sm:p-7 pb-6 overflow-hidden">
          {/* Luminous Organic Curves & Waves */}
          <div className="absolute right-0 bottom-0 pointer-events-none overflow-hidden w-full h-full">
            <svg
              className="absolute -right-4 -bottom-4 w-64 h-40 opacity-40"
              viewBox="0 0 240 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 160C70 100 130 80 240 90V160H20Z"
                fill="url(#headerWaveGrad1)"
              />
              <path
                d="M80 160C130 120 175 105 240 115V160H80Z"
                fill="url(#headerWaveGrad2)"
              />
              <path
                d="M10 160C60 85 130 68 240 78"
                stroke="#34d399"
                strokeWidth="1.5"
                strokeOpacity="0.35"
                fill="none"
              />
              <path
                d="M70 160C120 108 170 98 240 108"
                stroke="#6ee7b7"
                strokeWidth="1.2"
                strokeOpacity="0.45"
                fill="none"
              />
              <defs>
                <linearGradient
                  id="headerWaveGrad1"
                  x1="20"
                  y1="80"
                  x2="240"
                  y2="160"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#10b981" stopOpacity="0.35" />
                  <stop offset="1" stopColor="#047857" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient
                  id="headerWaveGrad2"
                  x1="80"
                  y1="105"
                  x2="240"
                  y2="160"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#34d399" stopOpacity="0.45" />
                  <stop offset="1" stopColor="#065f46" stopOpacity="0.15" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Clinic Branding Header */}
          <div className="flex items-center gap-3 pr-8">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-white/80 bg-white p-0.5 shadow-md shrink-0">
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
                className="font-serif font-bold text-xl sm:text-2xl text-white tracking-wide block leading-none"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
              >
                Dr. Pratima Agale
              </span>
            </div>
          </div>

          {/* Mode Title & Subtitle */}
          <div className="mt-4">
            <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white">
              {mode === "signin"
                ? "SIGN IN TO YOUR ACCOUNT"
                : mode === "signup"
                ? "CREATE YOUR ACCOUNT"
                : "RESET YOUR PASSWORD"}
            </h2>
            <p className="text-xs text-white/85 leading-relaxed mt-1">
              {mode === "signin"
                ? "Access your personalized medical profile, prescriptions, and consultation records."
                : mode === "signup"
                ? "Join to access your health records, prescriptions, and consultation services."
                : "Enter your registered email address and we'll send you a password reset link."}
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-4 bg-white dark:bg-[#12231b]">
          {/* Success Banner */}
          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 text-xs font-medium flex items-center gap-2">
              <span className="text-base">🎉</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {(localError || authError) && !successMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs">
              <p>{localError || authError}</p>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* VIEW 1: SIGN IN (LEFT MODAL)                            */}
          {/* ──────────────────────────────────────────────────────── */}
          {mode === "signin" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-full border border-zinc-250 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-750 dark:text-zinc-200 font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </button>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  OR
                </span>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              </div>

              {/* Email & Password Form */}
              <form onSubmit={handleSignInSubmit} className="space-y-3">
                {/* Email Address */}
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="Email address"
                    disabled={submitting}
                    className="w-full pl-11 pr-4 py-3 rounded-full border border-zinc-250 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0d4a36]/25 focus:border-[#0d4a36] transition"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showSignInPassword ? "text" : "password"}
                    required
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    placeholder="Password"
                    disabled={submitting}
                    className="w-full pl-11 pr-11 py-3 rounded-full border border-zinc-250 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0d4a36]/25 focus:border-[#0d4a36] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignInPassword(!showSignInPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Remember me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-0.5 px-1">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-700 dark:text-zinc-300">
                    <div
                      className={`w-4 h-4 rounded-[4px] flex items-center justify-center transition-colors shrink-0 ${
                        rememberMe
                          ? "bg-[#0d4a36] text-white"
                          : "border border-zinc-350 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                      }`}
                      onClick={() => setRememberMe(!rememberMe)}
                    >
                      {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span onClick={() => setRememberMe(!rememberMe)}>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setLocalError(null);
                      clearAuthError();
                    }}
                    className="text-[#0d4a36] dark:text-emerald-400 font-semibold hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Sign In Primary Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-full bg-[#0d4a36] hover:bg-[#093527] active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer mt-1"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <span>Sign In</span>
                  )}
                </button>
              </form>

              {/* Switch to Sign Up */}
              <p className="text-center text-xs text-zinc-600 dark:text-zinc-400 pt-1">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signup");
                    setLocalError(null);
                    clearAuthError();
                  }}
                  className="text-[#0d4a36] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  Create Account
                </button>
              </p>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* VIEW 2: SIGN UP / CREATE ACCOUNT (RIGHT MODAL)          */}
          {/* ──────────────────────────────────────────────────────── */}
          {mode === "signup" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Google Sign-Up Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={submitting}
                className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-full border border-zinc-250 dark:border-zinc-700 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-750 dark:text-zinc-200 font-semibold text-xs sm:text-sm transition-all shadow-xs hover:shadow active:scale-[0.99] disabled:opacity-60 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-700" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
                      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                    />
                  </svg>
                )}
                <span>Sign up with Google</span>
              </button>

              {/* OR Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  OR
                </span>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
              </div>

              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                {/* Full Name */}
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full name"
                    disabled={submitting}
                    className="w-full pl-11 pr-4 py-3 rounded-full border border-zinc-250 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0d4a36]/25 focus:border-[#0d4a36] transition"
                  />
                </div>

                {/* Email Address */}
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="Email address"
                    disabled={submitting}
                    className="w-full pl-11 pr-4 py-3 rounded-full border border-zinc-250 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0d4a36]/25 focus:border-[#0d4a36] transition"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showSignUpPassword ? "text" : "password"}
                    required
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    placeholder="Password"
                    disabled={submitting}
                    className="w-full pl-11 pr-11 py-3 rounded-full border border-zinc-250 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0d4a36]/25 focus:border-[#0d4a36] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Confirm Password */}
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    disabled={submitting}
                    className="w-full pl-11 pr-11 py-3 rounded-full border border-zinc-250 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0d4a36]/25 focus:border-[#0d4a36] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Terms and Privacy Checkbox */}
                <div className="flex items-start gap-2.5 text-xs pt-1 px-1">
                  <div
                    className={`w-4 h-4 mt-0.5 rounded-[4px] flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      agreeTerms
                        ? "bg-[#0d4a36] text-white"
                        : "border border-zinc-350 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                    }`}
                    onClick={() => setAgreeTerms(!agreeTerms)}
                  >
                    {agreeTerms && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <label
                    onClick={() => setAgreeTerms(!agreeTerms)}
                    className="text-zinc-600 dark:text-zinc-400 leading-snug cursor-pointer"
                  >
                    I agree to the{" "}
                    <Link
                      href="/privacy-policy"
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#0d4a36] dark:text-emerald-400 font-semibold hover:underline"
                    >
                      Terms &amp; Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy-policy"
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                      className="text-[#0d4a36] dark:text-emerald-400 font-semibold hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                {/* Sign Up Primary Button */}
                <button
                  type="submit"
                  disabled={submitting || !agreeTerms}
                  className="w-full py-3.5 rounded-full bg-[#0d4a36] hover:bg-[#093527] active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer mt-1"
                >
                  {submitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    <span>Sign Up</span>
                  )}
                </button>
              </form>

              {/* Switch to Sign In */}
              <p className="text-center text-xs text-zinc-600 dark:text-zinc-400 pt-1">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("signin");
                    setLocalError(null);
                    clearAuthError();
                  }}
                  className="text-[#0d4a36] dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* VIEW 3: FORGOT PASSWORD                                  */}
          {/* ──────────────────────────────────────────────────────── */}
          {mode === "forgot" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              {resetSent ? (
                <div className="text-center py-4 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">
                    Password Reset Link Sent!
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Check your email inbox at{" "}
                    <span className="font-semibold text-zinc-900 dark:text-white">
                      {forgotEmail}
                    </span>{" "}
                    for instructions to reset your password.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setResetSent(false);
                    }}
                    className="w-full py-3 rounded-full bg-[#0d4a36] hover:bg-[#093527] text-white text-xs font-semibold shadow-md transition-all cursor-pointer mt-2"
                  >
                    Back to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePasswordResetSubmit} className="space-y-3">
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Email address"
                      disabled={submitting}
                      className="w-full pl-11 pr-4 py-3 rounded-full border border-zinc-250 dark:border-zinc-700 bg-white dark:bg-zinc-900/60 text-xs sm:text-sm text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#0d4a36]/25 focus:border-[#0d4a36] transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-full bg-[#0d4a36] hover:bg-[#093527] active:scale-[0.99] text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer mt-1"
                  >
                    {submitting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Link...</span>
                      </div>
                    ) : (
                      <span>Send Reset Link</span>
                    )}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setMode("signin");
                        setLocalError(null);
                        clearAuthError();
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400 hover:text-[#0d4a36] dark:hover:text-emerald-400 font-semibold cursor-pointer transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────── */}
          {/* FOOTER: 3 TRUST BADGES (EXACT SCREENSHOT FIDELITY)      */}
          {/* ──────────────────────────────────────────────────────── */}
          <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800/80">
            <div className="grid grid-cols-3 gap-2 text-center select-none">
              {/* Badge 1: Encrypted medical records & data privacy */}
              <div className="flex flex-col items-center">
                <svg
                  className="w-5 h-5 text-[#0d8a59] dark:text-emerald-400 mx-auto shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <p className="text-[10px] sm:text-[10.5px] leading-tight text-zinc-600 dark:text-zinc-400 font-normal mt-1.5">
                  Encrypted medical
                  <br />
                  records &amp; data privacy
                </p>
              </div>

              {/* Badge 2: Direct consultation & chat with doctor */}
              <div className="flex flex-col items-center">
                <svg
                  className="w-5 h-5 text-[#0d8a59] dark:text-emerald-400 mx-auto shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <p className="text-[10px] sm:text-[10.5px] leading-tight text-zinc-600 dark:text-zinc-400 font-normal mt-1.5">
                  Direct consultation
                  <br />
                  &amp; chat with doctor
                </p>
              </div>

              {/* Badge 3: Digital prescriptions & report uploads */}
              <div className="flex flex-col items-center">
                <svg
                  className="w-5 h-5 text-[#0d8a59] dark:text-emerald-400 mx-auto shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="12" y1="18" x2="12" y2="12" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
                <p className="text-[10px] sm:text-[10.5px] leading-tight text-zinc-600 dark:text-zinc-400 font-normal mt-1.5">
                  Digital prescriptions
                  <br />
                  &amp; report uploads
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
