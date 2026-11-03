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
import {
  getPatientProfile,
  initializePatientProfileIfNew,
} from "@/lib/services/patient-profile";
import type { UserProfile, UserRole } from "@/lib/types/patient";

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  isDoctor: boolean;
  role: UserRole | null;
  accessDenied: boolean;
  authError: string | null;
  signInWithGoogle: (preferredRedirect?: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const [role, setRole] = useState<UserRole | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchProfileForUser = useCallback(async (firebaseUser: User, doctorStatus: boolean) => {
    setProfileLoading(true);
    try {
      if (doctorStatus) {
        setRole("doctor");
        // Doctor can also have a profile or minimal profile
        const profile = await getPatientProfile(firebaseUser.uid);
        setUserProfile(profile);
      } else {
        setRole("patient");
        // Initialize or fetch patient profile
        const profile = await initializePatientProfileIfNew({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
        setUserProfile(profile);
      }
    } catch (err) {
      console.error("Failed to load user profile:", err);
    } finally {
      setProfileLoading(false);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const profile = await getPatientProfile(user.uid);
      if (profile) {
        setUserProfile(profile);
      }
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.email) {
        const doctorStatus = await isDoctorEmail(firebaseUser.email);
        setIsDoctor(doctorStatus);
        await fetchProfileForUser(firebaseUser, doctorStatus);
      } else {
        setIsDoctor(false);
        setUserProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [fetchProfileForUser]);

  const signInWithGoogle = useCallback(
    async (preferredRedirect?: string) => {
      setAccessDenied(false);
      setAuthError(null);
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      try {
        const result = await signInWithPopup(auth, provider);
        const email = result.user.email;

        if (!email) {
          setAccessDenied(true);
          await firebaseSignOut(auth);
          return;
        }

        const allowedDoctor = await isDoctorEmail(email);

        if (allowedDoctor) {
          setIsDoctor(true);
          setRole("doctor");
          router.push(preferredRedirect || "/doctor");
        } else {
          setIsDoctor(false);
          setRole("patient");
          // Initialize patient profile
          const profile = await initializePatientProfileIfNew({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL,
          });
          setUserProfile(profile);

          if (preferredRedirect) {
            router.push(preferredRedirect);
          } else if (!profile.profileCompleted) {
            router.push("/patient/profile");
          } else {
            router.push("/patient/dashboard");
          }
        }
      } catch (err) {
        console.error("Google sign-in error:", err);
        setAuthError(getAuthErrorMessage(err));
      }
    },
    [router]
  );

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
    setIsDoctor(false);
    setUserProfile(null);
    setRole(null);
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
        userProfile,
        loading,
        profileLoading,
        isDoctor,
        role,
        accessDenied,
        authError,
        signInWithGoogle,
        signOut,
        refreshProfile,
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
