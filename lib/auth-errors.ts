/**
 * Authentication error message mapper for Firebase Auth
 * Translates technical error codes and raw exceptions into clear, actionable human text.
 */

export function getAuthErrorMessage(err: unknown): string {
  const code =
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    typeof (err as { code: string }).code === "string"
      ? (err as { code: string }).code
      : "";

  const rawMessage = err instanceof Error ? err.message : typeof err === "string" ? err : "";

  if (
    code === "auth/operation-not-allowed" ||
    code === "auth/configuration-not-found" ||
    rawMessage.includes("OPERATION_NOT_ALLOWED") ||
    rawMessage.includes("operation-not-allowed")
  ) {
    return "Email/Password sign-up is currently not enabled in Firebase. Please sign in with Google, or enable 'Email/Password' in Firebase Console → Authentication → Sign-in method.";
  }
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found") {
    return "Invalid email or password. Please check your credentials.";
  }
  if (code === "auth/email-already-in-use") {
    return "An account already exists with this email address. Please sign in instead.";
  }
  if (code === "auth/weak-password") {
    return "Password should be at least 6 characters long.";
  }
  if (code === "auth/invalid-email") {
    return "Please enter a valid email address.";
  }
  if (code === "auth/too-many-requests") {
    return "Too many failed attempts. Please wait a few moments before trying again.";
  }
  if (code === "auth/popup-closed-by-user") {
    return "Sign-in was cancelled.";
  }
  if (code === "auth/unauthorized-domain") {
    return "This domain is not authorized. Add domain in Firebase → Authentication → Settings → Authorized domains.";
  }

  return rawMessage || "Authentication failed. Please check your details and try again.";
}

export const EMAIL_VALIDATION_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

