import test from "node:test";
import assert from "node:assert";

import {
  encryptToken,
  decryptToken,
  signOAuthState,
  verifyOAuthState,
} from "../lib/security/encryption.ts";
import {
  getSlotTimestamps,
  isSlotInPast,
  formatInKolkata,
  getDayOfWeekKolkata,
} from "../lib/utils/timezone.ts";
import {
  buildConfirmationEmail,
  buildCancellationEmail,
  buildWhatsAppTextMessage,
} from "../lib/notifications/templates.ts";

test("Security & Encryption: Token encryption and decryption round-trip", () => {
  const secretRefreshToken = "1//04aBcDeFgHiJkLmNoPqRsTuVwXyZ123456789";
  const encrypted = encryptToken(secretRefreshToken);

  assert.notStrictEqual(encrypted, secretRefreshToken);
  assert.ok(encrypted.includes(":"), "Encrypted payload should format as iv:authTag:ciphertext");

  const decrypted = decryptToken(encrypted);
  assert.strictEqual(decrypted, secretRefreshToken);
});

test("Security & Encryption: OAuth state HMAC signing and verification", () => {
  const payload = {
    doctorId: "doctor_pratima_123",
    doctorEmail: "drpratima@example.com",
    nonce: "random-nonce-999",
    timestamp: Date.now(),
  };

  const state = signOAuthState(payload);
  assert.ok(state.includes("."), "Signed state must contain separator");

  const verified = verifyOAuthState<typeof payload>(state);
  assert.ok(verified, "Verified payload should not be null");
  assert.strictEqual(verified?.doctorId, "doctor_pratima_123");
  assert.strictEqual(verified?.doctorEmail, "drpratima@example.com");

  // Tampered state test
  const tamperedState = state + "tampered";
  const tamperedResult = verifyOAuthState(tamperedState);
  assert.strictEqual(tamperedResult, null, "Tampered state must fail verification");
});

test("Timezone Utilities: Asia/Kolkata ISO calculation", () => {
  const dateStr = "2026-11-15";
  const timeStr = "11:00"; // 11:00 AM IST

  const { startIso, endIso } = getSlotTimestamps(dateStr, timeStr, 45);

  assert.ok(startIso.includes("2026-11-15T05:30:00.000Z"), "11:00 AM IST is 05:30 UTC");
  assert.ok(endIso.includes("2026-11-15T06:15:00.000Z"), "45 min duration should end at 06:15 UTC");

  const dayOfWeek = getDayOfWeekKolkata("2026-11-15");
  assert.strictEqual(dayOfWeek, 0, "2026-11-15 is a Sunday");

  const formatted = formatInKolkata(startIso);
  assert.ok(formatted.length > 0, "Formatted IST string should not be empty");
});

test("Timezone Utilities: Past slot detection", () => {
  // A date far in the past
  const pastSlot = isSlotInPast("2020-01-01", "10:00");
  assert.strictEqual(pastSlot, true, "Past slot must return true");

  // A date in the future
  const futureSlot = isSlotInPast("2030-01-01", "10:00");
  assert.strictEqual(futureSlot, false, "Future slot must return false");
});

test("Email & Notification Templates: Online Google Meet confirmation", () => {
  const email = buildConfirmationEmail({
    patientName: "Aarav Patil",
    doctorName: "Dr. Pratima Agale",
    appointmentDate: "2026-11-20",
    appointmentTime: "11:00",
    consultationType: "online",
    googleMeetUrl: "https://meet.google.com/abc-defg-hij",
    appointmentId: "appt_test_123",
    accessSecret: "secret_456",
  });

  assert.ok(email.subject.includes("Appointment Confirmed"));
  assert.ok(email.html.includes("Aarav Patil"));
  assert.ok(email.html.includes("https://meet.google.com/abc-defg-hij"));
  assert.ok(email.html.includes("Google Meet"));
});

test("Email & Notification Templates: Cancellation email", () => {
  const email = buildCancellationEmail({
    patientName: "Aarav Patil",
    appointmentDate: "2026-11-20",
    appointmentTime: "11:00",
    consultationType: "online",
    cancellationReason: "Rescheduled upon patient request",
  });

  assert.ok(email.subject.includes("Appointment Cancelled"));
  assert.ok(email.html.includes("Rescheduled upon patient request"));
});

test("WhatsApp Messages: Online confirmation text format", () => {
  const msg = buildWhatsAppTextMessage("confirmed", {
    patientName: "Sneha Sharma",
    appointmentDate: "2026-11-20",
    appointmentTime: "15:00",
    consultationType: "online",
    googleMeetUrl: "https://meet.google.com/xyz-uvwx-rst",
  });

  assert.ok(msg.includes("*CONFIRMED*"));
  assert.ok(msg.includes("Sneha Sharma"));
  assert.ok(msg.includes("https://meet.google.com/xyz-uvwx-rst"));
  assert.ok(msg.includes("Google Meet"));
});
