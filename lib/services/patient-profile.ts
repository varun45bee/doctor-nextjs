import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase.ts";
import { calculateProfileCompletion } from "../types/patient.ts";
import type { UserProfile, MedicalRecord } from "../types/patient.ts";

/**
 * Fetch patient profile document from Firestore `users/{uid}`
 */
export async function getPatientProfile(uid: string): Promise<UserProfile | null> {
  if (!uid) return null;
  try {
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    const data = snap.data();
    return {
      uid: snap.id,
      ...data,
    } as UserProfile;
  } catch (error) {
    console.error("Error fetching patient profile:", error);
    throw error;
  }
}

/**
 * Initial creation on first login without overwriting existing data.
 */
export async function initializePatientProfileIfNew(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}): Promise<UserProfile> {
  const docRef = doc(db, "users", user.uid);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    const existing = snap.data() as UserProfile;
    // If it exists, return it as-is (do not overwrite patient customizations)
    return { ...existing, uid: snap.id };
  }

  // Create new patient profile
  const newProfile: Omit<UserProfile, "uid"> = {
    fullName: user.displayName || "Patient",
    email: user.email || "",
    phone: "",
    photoURL: user.photoURL || undefined,
    role: "patient",
    profileCompleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(docRef, newProfile);

  return {
    uid: user.uid,
    ...newProfile,
  } as UserProfile;
}

/**
 * Updates patient profile and recalculates completion status.
 */
export async function updatePatientProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> {
  if (!uid) throw new Error("Missing user ID");

  const docRef = doc(db, "users", uid);
  const snap = await getDoc(docRef);
  const current = snap.exists() ? (snap.data() as Partial<UserProfile>) : {};

  const merged = { ...current, ...updates };
  const completionPercentage = calculateProfileCompletion(merged);
  const isCompleted = completionPercentage >= 60; // 60%+ considered completed

  const cleanedUpdates: Record<string, any> = {
    ...updates,
    profileCompleted: isCompleted,
    updatedAt: serverTimestamp(),
  };

  // Ensure role cannot be elevated to doctor from client update
  delete cleanedUpdates.role;
  delete cleanedUpdates.uid;

  await updateDoc(docRef, cleanedUpdates);
}

/**
 * Fetch patient's medical records subcollection `users/{uid}/medicalRecords`
 */
export async function getMedicalRecords(uid: string): Promise<MedicalRecord[]> {
  if (!uid) return [];
  try {
    const recordsCol = collection(db, "users", uid, "medicalRecords");
    let q;
    try {
      q = query(recordsCol, orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      return snap.docs.map((docSnap) => ({
        id: docSnap.id,
        userId: uid,
        ...docSnap.data(),
      })) as MedicalRecord[];
    } catch {
      // Fallback without orderBy if index is still indexing
      const snap = await getDocs(recordsCol);
      const list = snap.docs.map((docSnap) => ({
        id: docSnap.id,
        userId: uid,
        ...docSnap.data(),
      })) as MedicalRecord[];
      return list.sort((a, b) => {
        const timeA = a.createdAt?.toMillis?.() || 0;
        const timeB = b.createdAt?.toMillis?.() || 0;
        return timeB - timeA;
      });
    }
  } catch (error) {
    console.error("Error fetching medical records:", error);
    return [];
  }
}

/**
 * Add a new medical record
 */
export async function addMedicalRecord(
  uid: string,
  record: Omit<MedicalRecord, "id" | "userId" | "createdAt" | "updatedAt">
): Promise<string> {
  if (!uid) throw new Error("Missing patient ID");
  const recordsCol = collection(db, "users", uid, "medicalRecords");
  const docRef = await addDoc(recordsCol, {
    ...record,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Update an existing medical record
 */
export async function updateMedicalRecord(
  uid: string,
  recordId: string,
  updates: Partial<MedicalRecord>
): Promise<void> {
  if (!uid || !recordId) throw new Error("Missing arguments for updateMedicalRecord");
  const recordRef = doc(db, "users", uid, "medicalRecords", recordId);
  const clean = { ...updates, updatedAt: serverTimestamp() };
  delete clean.id;
  delete clean.userId;
  await updateDoc(recordRef, clean);
}

/**
 * Delete a medical record
 */
export async function deleteMedicalRecord(uid: string, recordId: string): Promise<void> {
  if (!uid || !recordId) throw new Error("Missing arguments for deleteMedicalRecord");
  const recordRef = doc(db, "users", uid, "medicalRecords", recordId);
  await deleteDoc(recordRef);
}
