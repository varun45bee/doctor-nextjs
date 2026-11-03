import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

let adminApp: App | null = null;
let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

export function getFirebaseAdmin(): { app: App; db: Firestore; auth: Auth } {
  if (adminApp && adminDb && adminAuth) {
    return { app: adminApp, db: adminDb, auth: adminAuth };
  }

  if (getApps().length > 0) {
    adminApp = getApps()[0];
  } else {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    const projectId =
      process.env.FIREBASE_PROJECT_ID ||
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      "doc-web-a913f";

    if (serviceAccountJson) {
      try {
        const parsed = JSON.parse(
          serviceAccountJson.startsWith("{")
            ? serviceAccountJson
            : Buffer.from(serviceAccountJson, "base64").toString("utf-8")
        );
        adminApp = initializeApp({
          credential: cert(parsed),
          projectId: parsed.project_id || projectId,
        });
      } catch (err) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT JSON:", err);
      }
    } else if (clientEmail && privateKey) {
      adminApp = initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
        projectId,
      });
    } else {
      // Default initialization (e.g. Google Cloud Run, Cloud Functions, or ADC)
      try {
        adminApp = initializeApp({ projectId });
      } catch (err) {
        console.warn(
          "Firebase Admin initialized with project ID fallback. To enable full admin features set FIREBASE_CLIENT_EMAIL & FIREBASE_PRIVATE_KEY."
        );
        adminApp = initializeApp({ projectId }, "fallback-admin");
      }
    }
  }

  adminDb = getFirestore(adminApp!);
  // Settings for Firestore Admin
  try {
    adminDb.settings({ ignoreUndefinedProperties: true });
  } catch {
    // already configured
  }
  adminAuth = getAuth(adminApp!);

  return { app: adminApp!, db: adminDb, auth: adminAuth };
}

export function getAdminDb(): Firestore {
  return getFirebaseAdmin().db;
}

export function getAdminAuth(): Auth {
  return getFirebaseAdmin().auth;
}
