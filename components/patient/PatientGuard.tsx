"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";

export default function PatientGuard({
  children,
  requireCompleteProfile = false,
}: {
  children: React.ReactNode;
  requireCompleteProfile?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, userProfile, profileLoading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
    } else if (
      !loading &&
      !profileLoading &&
      user &&
      requireCompleteProfile &&
      userProfile &&
      !userProfile.profileCompleted &&
      pathname !== "/patient/profile"
    ) {
      router.replace("/patient/profile?prompt=complete");
    }
  }, [loading, profileLoading, user, userProfile, requireCompleteProfile, pathname, router]);

  if (loading || (user && profileLoading && !userProfile)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-sage-600 dark:text-sage-400" />
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Loading your health portal...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-base)]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-sage-600 dark:text-sage-400" />
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

