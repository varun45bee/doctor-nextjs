import { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebase-admin";
import { isAllowedDoctorEmail } from "@/lib/doctor-access";

export interface AuthenticatedDoctor {
  uid: string;
  email: string;
}

/**
 * Extracts and verifies the Firebase ID token from the Authorization header.
 * Returns the decoded doctor credentials or throws an Error.
 */
export async function authenticateDoctorRequest(
  req: NextRequest
): Promise<AuthenticatedDoctor> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED: Missing or malformed Authorization header.");
  }

  const token = authHeader.substring(7).trim();
  const auth = getAdminAuth();

  try {
    const decoded = await auth.verifyIdToken(token);
    const email = decoded.email?.toLowerCase();

    if (!email || !isAllowedDoctorEmail(email)) {
      throw new Error("FORBIDDEN: User does not have doctor privileges.");
    }

    return {
      uid: decoded.uid,
      email,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Token verification failed";
    throw new Error(`UNAUTHORIZED: ${msg}`);
  }
}

/**
 * Verifies that the internal worker secret or admin token is present.
 */
export function verifyWorkerSecret(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  const configuredSecret = process.env.INTERNAL_WORKER_SECRET || process.env.APP_SECRET;

  if (configuredSecret && authHeader === `Bearer ${configuredSecret}`) {
    return true;
  }

  // Also allow a query param `?secret=...` if configured
  const querySecret = req.nextUrl.searchParams.get("secret");
  if (configuredSecret && querySecret === configuredSecret) {
    return true;
  }

  return false;
}
