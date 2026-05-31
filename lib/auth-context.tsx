"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { isDoctorEmail } from "@/lib/firestore/doctors";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isDoctor: boolean;
  accessDenied: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  clearAccessDenied: () => void;
  clearAuthError: () => void;
};

function getAuthErrorMessage(err: unknown): string {
  const code =
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: string }).code === "string"
      ? (err as { code: string }).code
      : "";

  if (code === "auth/configuration-not-found") {
    return "Google sign-in is not enabled in Firebase. Open Firebase Console → Authentication → Sign-in method → enable Google.";
  }
  if (code === "auth/popup-closed-by-user") {
    return "Sign-in was cancelled.";
  }
  if (code === "auth/unauthorized-domain") {
    return "This domain is not authorized. Add localhost in Firebase → Authentication → Settings → Authorized domains.";
  }

  return "Sign-in failed. Please try again.";
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDoctor, setIsDoctor] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const verifyDoctor = useCallback(async (email: string | null) => {
    if (!email) {
      setIsDoctor(false);
      return false;
    }
    const allowed = await isDoctorEmail(email);
    setIsDoctor(allowed);
    return allowed;
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.email) {
        await verifyDoctor(firebaseUser.email);
      } else {
        setIsDoctor(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [verifyDoctor]);

  const signInWithGoogle = useCallback(async () => {
    setAccessDenied(false);
    setAuthError(null);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      if (!email) {
        setAccessDenied(true);
        await firebaseSignOut(auth);
        return;
      }

      const allowed = await isDoctorEmail(email);

      if (allowed) {
        setIsDoctor(true);
        router.push("/doctor");
      } else {
        setAccessDenied(true);
        setIsDoctor(false);
        await firebaseSignOut(auth);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setAuthError(getAuthErrorMessage(err));
    }
  }, [router]);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setIsDoctor(false);
    setAccessDenied(false);
    router.push("/");
  }, [router]);

  const clearAccessDenied = useCallback(() => {
    setAccessDenied(false);
  }, []);

  const clearAuthError = useCallback(() => {
    setAuthError(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isDoctor,
        accessDenied,
        authError,
        signInWithGoogle,
        signOut,
        clearAccessDenied,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
