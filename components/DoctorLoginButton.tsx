"use client";

import Link from "next/link";
import { LogIn, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function DoctorLoginButton() {
  const {
    user,
    isDoctor,
    loading,
    signInWithGoogle,
    accessDenied,
    authError,
    clearAccessDenied,
    clearAuthError,
  } = useAuth();

  if (loading) return null;

  if (user && isDoctor) {
    return (
      <Link
        href="/doctor"
        className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border border-sage-400 text-sage-600 hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors font-medium"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => {
          clearAccessDenied();
          clearAuthError();
          signInWithGoogle();
        }}
        className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full border border-sage-300 hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">Doctor Login</span>
      </button>

      {(accessDenied || authError) && (
        <div className="absolute top-full right-0 mt-2 w-72 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs shadow-lg z-50">
          {authError ||
            "Access Denied. Your account is not authorized."}
          <button
            type="button"
            onClick={() => {
              clearAccessDenied();
              clearAuthError();
            }}
            className="block mt-1 underline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
