"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import LoadingState from "@/components/doctor/LoadingState";

export default function DoctorGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading, isDoctor, signOut } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <LoadingState message="Verifying access..." />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <LoadingState message="Redirecting..." />
      </div>
    );
  }

  if (!isDoctor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)] px-4">
        <div className="max-w-md w-full text-center p-8 rounded-2xl border bg-[var(--bg-surface)] border-[var(--border-color)]">
          <div className="text-4xl mb-4">🚫</div>
          <h1 className="font-serif text-2xl mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Access Denied
          </h1>
          <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
            Your account is not authorized to access the doctor dashboard.
          </p>
          <button
            type="button"
            onClick={() => signOut()}
            className="bg-sage-500 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-sage-600 transition-colors"
          >
            Sign Out & Return Home
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
