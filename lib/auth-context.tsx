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
import LoginModal from "@/components/LoginModal";

const STORAGE_KEY = "dr_pratima_user_session";

type AuthContextType = {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  isDoctor: boolean;
  role: UserRole | null;
  accessDenied: boolean;
  authError: string | null;
  isLoginModalOpen: boolean;
  openLoginModal: (preferredRedirect?: string) => void;
  closeLoginModal: () => void;
  signInWithGoogle: (preferredRedirect?: string) => Promise<boolean>;
  signInWithPhoneOrEmail: (
    details: { fullName: string; phone?: string; email?: string },
    preferredRedirect?: string
  ) => Promise<boolean>;
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
    return "This domain is not authorized. Add domain in Firebase → Authentication → Settings → Authorized domains.";
  }

  return "Sign-in failed. Please try again.";
}

function saveSessionToStorage(
  profile: Partial<UserProfile> & {
    uid: string;
    email?: string | null;
    displayName?: string | null;
    photoURL?: string | null;
  }
) {
  if (typeof window === "undefined") return;
  try {
    const session = {
      uid: profile.uid,
      email: profile.email || "",
      fullName: profile.fullName || profile.displayName || "Patient",
      displayName: profile.displayName || profile.fullName || "Patient",
      photoURL: profile.photoURL || "",
      phone: profile.phone || "",
      role: profile.role || "patient",
      profileCompleted: Boolean(profile.profileCompleted),
      savedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (e) {
    console.warn("Failed to write user session to localStorage:", e);
  }
}

function clearSessionFromStorage() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("Failed to clear user session from localStorage:", e);
  }
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

  // Login Modal State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginRedirectUrl, setLoginRedirectUrl] = useState<string | null>(null);

  const openLoginModal = useCallback((preferredRedirect?: string) => {
    setLoginRedirectUrl(preferredRedirect || "/patient/profile");
    setIsLoginModalOpen(true);
  }, []);

  const closeLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
    setLoginRedirectUrl(null);
  }, []);

  // 1. Instantly restore cached session from localStorage on initial load
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.uid) {
          const restoredProfile: UserProfile = {
            uid: parsed.uid,
            fullName: parsed.fullName || parsed.displayName || "Patient",
            email: parsed.email || "",
            phone: parsed.phone || "",
            photoURL: parsed.photoURL || "",
            role: parsed.role || "patient",
            profileCompleted: Boolean(parsed.profileCompleted),
          };
          setUserProfile(restoredProfile);
          setRole(parsed.role || "patient");
          setIsDoctor(parsed.role === "doctor");

          // Synthesize user object so UI reflects logged in immediately
          setUser((prev) =>
            prev ||
            ({
              uid: parsed.uid,
              email: parsed.email || null,
              displayName: parsed.fullName || parsed.displayName,
              photoURL: parsed.photoURL || null,
            } as unknown as User)
          );
          setLoading(false);
        }
      }
    } catch (e) {
      console.warn("Failed to read user session from localStorage:", e);
    }
  }, []);

  const fetchProfileForUser = useCallback(
    async (firebaseUser: User, doctorStatus: boolean) => {
      setProfileLoading(true);
      try {
        if (doctorStatus) {
          setRole("doctor");
          const profile = await getPatientProfile(firebaseUser.uid);
          setUserProfile(profile);
          if (profile) {
            saveSessionToStorage({
              ...profile,
              uid: firebaseUser.uid,
              role: "doctor",
            });
          }
        } else {
          setRole("patient");
          const profile = await initializePatientProfileIfNew({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL ?? null,
          });
          setUserProfile(profile);
          saveSessionToStorage({
            ...profile,
            uid: firebaseUser.uid,
            role: "patient",
          });
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
      } finally {
        setProfileLoading(false);
      }
    },
    []
  );

  const refreshProfile = useCallback(async () => {
    if (!user) return;
    try {
      const profile = await getPatientProfile(user.uid);
      if (profile) {
        setUserProfile(profile);
        saveSessionToStorage({
          ...profile,
          uid: user.uid,
          role: role || "patient",
        });
      }
    } catch (err) {
      console.error("Failed to refresh profile:", err);
    }
  }, [user, role]);

  // Firebase auth state subscription
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser?.email) {
        setUser(firebaseUser);
        const doctorStatus = await isDoctorEmail(firebaseUser.email);
        setIsDoctor(doctorStatus);
        await fetchProfileForUser(firebaseUser, doctorStatus);
      } else {
        // If not in Firebase, check if user logged in via local patient session
        const cached = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.uid) {
              // Retain local session
              setUserProfile({
                uid: parsed.uid,
                fullName: parsed.fullName || parsed.displayName || "Patient",
                email: parsed.email || "",
                phone: parsed.phone || "",
                photoURL: parsed.photoURL || "",
                role: parsed.role || "patient",
                profileCompleted: Boolean(parsed.profileCompleted),
              });
              setRole(parsed.role || "patient");
              setIsDoctor(parsed.role === "doctor");
              setUser((prev) =>
                prev ||
                ({
                  uid: parsed.uid,
                  email: parsed.email || null,
                  displayName: parsed.fullName || parsed.displayName,
                  photoURL: parsed.photoURL || null,
                } as unknown as User)
              );
            }
          } catch (e) {
            console.warn("Failed to parse cached session:", e);
          }
        } else {
          setIsDoctor(false);
          setUserProfile(null);
          setRole(null);
          setUser(null);
        }
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [fetchProfileForUser]);

  // Google Sign In
  const signInWithGoogle = useCallback(
    async (preferredRedirect?: string): Promise<boolean> => {
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
          return false;
        }

        const allowedDoctor = await isDoctorEmail(email);

        if (allowedDoctor) {
          setIsDoctor(true);
          setRole("doctor");
          const docProfile = await getPatientProfile(result.user.uid);
          setUserProfile(docProfile);
          saveSessionToStorage({
            uid: result.user.uid,
            email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL || undefined,
            role: "doctor",
          });
          setIsLoginModalOpen(false);
          router.push(preferredRedirect || "/doctor");
          return true;
        } else {
          setIsDoctor(false);
          setRole("patient");
          const profile = await initializePatientProfileIfNew({
            uid: result.user.uid,
            email: result.user.email,
            displayName: result.user.displayName,
            photoURL: result.user.photoURL || null,
          });
          setUserProfile(profile);
          saveSessionToStorage({
            ...profile,
            uid: result.user.uid,
            role: "patient",
          });
          setIsLoginModalOpen(false);

          if (preferredRedirect) {
            router.push(preferredRedirect);
          } else {
            router.push("/patient/profile");
          }
          return true;
        }
      } catch (err) {
        console.error("Google sign-in error:", err);
        setAuthError(getAuthErrorMessage(err));
        return false;
      }
    },
    [router]
  );

  // Phone / Name Sign In for instant access without OAuth popup
  const signInWithPhoneOrEmail = useCallback(
    async (
      details: { fullName: string; phone?: string; email?: string },
      preferredRedirect?: string
    ): Promise<boolean> => {
      setAccessDenied(false);
      setAuthError(null);

      try {
        const cleanName = details.fullName.trim() || "Patient";
        const cleanPhone = (details.phone || "").trim();
        const cleanEmail = (details.email || "").trim().toLowerCase();
        const uid = `patient_${cleanPhone.replace(/\D/g, "") || Date.now()}`;

        const profile: UserProfile = {
          uid,
          fullName: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          photoURL: "",
          role: "patient",
          profileCompleted: false,
        };

        // Try to persist to Firestore if possible
        try {
          await initializePatientProfileIfNew({
            uid,
            email: cleanEmail || null,
            displayName: cleanName,
            photoURL: null,
          });
        } catch (dbErr) {
          console.warn("Firestore profile initialization skipped, local session created:", dbErr);
        }

        setUserProfile(profile);
        setRole("patient");
        setIsDoctor(false);

        const syntheticUser = {
          uid,
          email: cleanEmail || null,
          displayName: cleanName,
          photoURL: null,
        } as unknown as User;

        setUser(syntheticUser);
        saveSessionToStorage(profile);
        setIsLoginModalOpen(false);

        if (preferredRedirect) {
          router.push(preferredRedirect);
        } else {
          router.push("/patient/profile");
        }
        return true;
      } catch (err) {
        console.error("Quick sign in error:", err);
        setAuthError("Failed to sign in. Please try again.");
        return false;
      }
    },
    [router]
  );

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (e) {
      console.warn("Firebase sign out error:", e);
    }
    clearSessionFromStorage();
    setUser(null);
    setUserProfile(null);
    setIsDoctor(false);
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
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
        signInWithGoogle,
        signInWithPhoneOrEmail,
        signOut,
        refreshProfile,
        clearAccessDenied,
        clearAuthError,
      }}
    >
      {children}
      {/* Global Login Popup available across all pages */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        redirectUrl={loginRedirectUrl}
      />
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
