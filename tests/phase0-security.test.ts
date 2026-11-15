import test from "node:test";
import assert from "node:assert/strict";
import { encryptToken, decryptToken, signOAuthState, verifyOAuthState } from "../lib/security/encryption.ts";
import { isAllowedDoctorEmail } from "../lib/doctor-access.ts";
import { isValidIndianMobileNumber, getIndianMobileDigits } from "../lib/phone-validation.ts";

test("Phase 0 Security: Token Encryption & Decryption Round-Trip", () => {
  const sampleSecret = "ya29.sample_oauth_refresh_token_xyz_123456789";
  const encrypted = encryptToken(sampleSecret);

  assert.notEqual(encrypted, sampleSecret);
  assert.equal(encrypted.split(":").length, 3); // iv:authTag:ciphertext

  const decrypted = decryptToken(encrypted);
  assert.equal(decrypted, sampleSecret);
});

test("Phase 0 Security: OAuth State HMAC Tamper Resistance", () => {
  const payload = { doctorId: "default_doctor", timestamp: Date.now() };
  const signedState = signOAuthState(payload);

  const verified = verifyOAuthState<{ doctorId: string; timestamp: number }>(signedState);
  assert.ok(verified);
  assert.equal(verified?.doctorId, "default_doctor");

  // Tampered state must be rejected
  const tamperedState = signedState.slice(0, -4) + "XXXX";
  const rejected = verifyOAuthState(tamperedState);
  assert.equal(rejected, null);
});

test("Phase 0 Security: Doctor Whitelist Enforcement", () => {
  assert.equal(isAllowedDoctorEmail("varun45j@gmail.com"), true);
  assert.equal(isAllowedDoctorEmail("sardarvarun121@gmail.com"), true);
  assert.equal(isAllowedDoctorEmail("madhurmeetj@gmail.com"), true);

  // Untrusted emails must be rejected
  assert.equal(isAllowedDoctorEmail("attacker@evil.com"), false);
  assert.equal(isAllowedDoctorEmail("patient@gmail.com"), false);
  assert.equal(isAllowedDoctorEmail(""), false);
  assert.equal(isAllowedDoctorEmail(null), false);
  assert.equal(isAllowedDoctorEmail(undefined), false);
});

test("Phase 0 Security: Indian Mobile Number Strict Validation", () => {
  assert.equal(isValidIndianMobileNumber("9876543210"), true);
  assert.equal(isValidIndianMobileNumber("+91 98765 43210"), true);
  assert.equal(isValidIndianMobileNumber("919876543210"), true);
  assert.equal(getIndianMobileDigits("+91 98765 43210"), "9876543210");

  // Invalid numbers
  assert.equal(isValidIndianMobileNumber("1234567890"), false); // does not start with 6-9
  assert.equal(isValidIndianMobileNumber("98765"), false);
  assert.equal(isValidIndianMobileNumber(""), false);
});
