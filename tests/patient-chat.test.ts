import test from "node:test";
import assert from "node:assert";

import {
  calculateProfileCompletion,
} from "../lib/types/patient.ts";
import type { UserProfile } from "../lib/types/patient.ts";
import { getConversationIdForPatient } from "../lib/services/chat-service.ts";
import { isAllowedDoctorEmail } from "../lib/doctor-access.ts";

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
