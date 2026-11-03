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
});
