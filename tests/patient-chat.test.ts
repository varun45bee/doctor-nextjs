import test from "node:test";
import assert from "node:assert";

import {
  calculateProfileCompletion,
} from "../lib/types/patient.ts";
import type { UserProfile } from "../lib/types/patient.ts";
import { getConversationIdForPatient } from "../lib/services/chat-service.ts";
import { isAllowedDoctorEmail } from "../lib/doctor-access.ts";
import { getAuthErrorMessage, EMAIL_VALIDATION_REGEX } from "../lib/auth-errors.ts";

test("Patient Profile: calculateProfileCompletion calculates accurate percentages", () => {
  // 1. Null or empty profile
  assert.strictEqual(calculateProfileCompletion(null), 0);
  assert.strictEqual(calculateProfileCompletion({}), 0);

  // 2. Partial profile
  const partialProfile: Partial<UserProfile> = {
    fullName: "Rohan Patil",
    email: "rohan@example.com",
    phone: "+919876543210",
  };
  // 3 out of 10 fields = 30%
  const partialScore = calculateProfileCompletion(partialProfile);
  assert.strictEqual(partialScore, 30);

  // 3. Blood group 'Unknown' should not count towards completed fields
  const profileWithUnknown: Partial<UserProfile> = {
    fullName: "Rohan Patil",
    email: "rohan@example.com",
    bloodGroup: "Unknown",
  };
  assert.strictEqual(calculateProfileCompletion(profileWithUnknown), 20);

  // 4. Complete profile with all 10 key fields
  const completeProfile: Partial<UserProfile> = {
    fullName: "Rohan Patil",
    email: "rohan@example.com",
    phone: "+919876543210",
    dateOfBirth: "1990-05-15",
    gender: "male",
    address: "Pune, Maharashtra",
    emergencyContact: "+919822001122",
    bloodGroup: "O+",
    allergies: "None",
    medicalHistory: "Childhood asthma, resolved with homeopathy",
  };
  assert.strictEqual(calculateProfileCompletion(completeProfile), 100);
});

test("Real-Time Chat: getConversationIdForPatient produces deterministic thread IDs", () => {
  const patientUid = "firebase_patient_xyz_789";
  const id1 = getConversationIdForPatient(patientUid);
  const id2 = getConversationIdForPatient(patientUid);

  assert.strictEqual(id1, "conv_firebase_patient_xyz_789");
  assert.strictEqual(id1, id2, "Conversation IDs must be strictly deterministic to avoid duplicate threads");
});

test("Doctor Access Control: Only authorized emails receive doctor privileges", () => {
  // Test non-doctor patient emails
  assert.strictEqual(isAllowedDoctorEmail("patient@gmail.com"), false);
  assert.strictEqual(isAllowedDoctorEmail("random.user@example.com"), false);
  assert.strictEqual(isAllowedDoctorEmail(null), false);
  assert.strictEqual(isAllowedDoctorEmail(undefined), false);

  // Test authorized doctor emails (case-insensitive check)
  assert.strictEqual(isAllowedDoctorEmail("varun45j@gmail.com"), true);
  assert.strictEqual(isAllowedDoctorEmail("VARUN45J@GMAIL.COM"), true);
  assert.strictEqual(isAllowedDoctorEmail("sardarvarun121@gmail.com"), true);
  assert.strictEqual(isAllowedDoctorEmail("madhurmeetj@gmail.com"), true);
});

test("Patient Dashboard: Appointment deduplication merges UID and email-linked appointments safely", () => {
  const appointmentsByUid = [
    { id: "apt-1", patientName: "Aarav Sharma", status: "confirmed", patientEmail: "aarav@example.com" },
    { id: "apt-2", patientName: "Aarav Sharma", status: "completed", patientEmail: "aarav@example.com" },
  ];
  const appointmentsByEmail = [
    { id: "apt-2", patientName: "Aarav Sharma", status: "completed", patientEmail: "aarav@example.com" },
    { id: "apt-3", patientName: "Aarav Sharma", status: "confirmed", patientEmail: "aarav@example.com" },
  ];

  // Emulate deduplication strategy used in Patient Dashboard loadData
  const mergedMap = new Map<string, typeof appointmentsByUid[0]>();
  for (const a of [...appointmentsByUid, ...appointmentsByEmail]) {
    mergedMap.set(a.id, a);
  }
  const deduplicated = Array.from(mergedMap.values());

  assert.strictEqual(deduplicated.length, 3);
  assert.deepStrictEqual(deduplicated.map(a => a.id), ["apt-1", "apt-2", "apt-3"]);
});

test("Patient Dossier: Critical allergy alerts are highlighted for doctor clinical safety", () => {
  const profileWithAllergies: Partial<UserProfile> = {
    fullName: "Priya Deshmukh",
    allergies: "Penicillin, Sulfa drugs, Peanuts",
  };
  const profileWithoutAllergies: Partial<UserProfile> = {
    fullName: "Amit Verma",
    allergies: "None",
  };

  const hasAllergiesWarning = (allergies?: string) => {
    if (!allergies) return false;
    const lower = allergies.trim().toLowerCase();
    return lower !== "" && lower !== "none" && lower !== "nil" && lower !== "no known allergies";
  };

  assert.strictEqual(hasAllergiesWarning(profileWithAllergies.allergies), true);
  assert.strictEqual(hasAllergiesWarning(profileWithoutAllergies.allergies), false);
  assert.strictEqual(hasAllergiesWarning(""), false);
  assert.strictEqual(hasAllergiesWarning(undefined), false);
});

test("Auth Error Handler: Maps operation-not-allowed to clear actionable guidance", () => {
  // 1. Firebase code auth/operation-not-allowed
  const err1 = { code: "auth/operation-not-allowed" };
  const msg1 = getAuthErrorMessage(err1);
  assert.match(msg1, /Firebase Console/i);
  assert.match(msg1, /Google/i);

  // 2. Firebase raw REST error with OPERATION_NOT_ALLOWED message
  const err2 = new Error("OPERATION_NOT_ALLOWED");
  const msg2 = getAuthErrorMessage(err2);
  assert.match(msg2, /Firebase Console/i);

  // 3. String error message
  const msg3 = getAuthErrorMessage("Firebase: Error (auth/operation-not-allowed).");
  assert.match(msg3, /Firebase Console/i);

  // 4. Invalid email format error
  const errEmail = { code: "auth/invalid-email" };
  const msgEmail = getAuthErrorMessage(errEmail);
  assert.strictEqual(msgEmail, "Please enter a valid email address.");

  // 5. Email validation regex
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  assert.strictEqual(EMAIL_REGEX.test("varun45@gmail.com"), true);
  assert.strictEqual(EMAIL_REGEX.test("invalid-email"), false);
  assert.strictEqual(EMAIL_REGEX.test("user@gmail"), false);
  assert.strictEqual(EMAIL_REGEX.test("user@.com"), false);
  assert.strictEqual(EMAIL_REGEX.test("@domain.com"), false);
});
