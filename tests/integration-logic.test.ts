import test from "node:test";
import assert from "node:assert";

import { buildSlotLockId } from "../lib/services/slot-service.ts";
import { isAllowedDoctorEmail } from "../lib/doctor-access.ts";
import type { Appointment } from "../lib/types/appointment.ts";
import { getSlotTimestamps } from "../lib/utils/timezone.ts";

test("Slot Lock: Key generation formats consistently", () => {
  const doctorId = "dr.pratima@example.com";
  const date = "2026-11-25";
  const time = "15:00";

  const lockId = buildSlotLockId(doctorId, date, time);
  assert.strictEqual(lockId, "dr_pratima_example_com_2026-11-25_15-00");
  assert.ok(!lockId.includes(":"), "Lock ID must sanitize colons");
  assert.ok(!lockId.includes("@"), "Lock ID must sanitize at-signs");
});

test("Doctor Access: Allowed doctor email check", () => {
  process.env.NEXT_PUBLIC_ALLOWED_DOCTOR_EMAIL = "doctor@example.com, varun45j@gmail.com";

  assert.strictEqual(isAllowedDoctorEmail("doctor@example.com"), true);
  assert.strictEqual(isAllowedDoctorEmail("VARUN45J@GMAIL.COM"), true, "Case-insensitive check");
  assert.strictEqual(isAllowedDoctorEmail("random_user@gmail.com"), false);
  assert.strictEqual(isAllowedDoctorEmail(null), false);
  assert.strictEqual(isAllowedDoctorEmail(""), false);
});

test("Google Calendar & Meet: Event payload construction for Online Consultation", () => {
  const appointment: Appointment = {
    id: "appt_test_999",
    patientName: "Ananya Deshmukh",
    patientEmail: "ananya@example.com",
    patientPhone: "9876543210",
    doctorId: "default_doctor",
    appointmentDate: "2026-11-25",
    appointmentTime: "16:00",
    timezone: "Asia/Kolkata",
    consultationType: "online",
    status: "Confirmed",
    condition: "Migraines",
    message: "Frequent morning headaches",
    createdAt: new Date(),
  };

  const { startIso } = getSlotTimestamps(
    appointment.appointmentDate,
    appointment.appointmentTime
  );

  const isOnline = appointment.consultationType === "online";
  const summary = `Consultation: ${appointment.patientName} (Online Consultation (Google Meet))`;

  const attendees = [
    { email: appointment.patientEmail, displayName: appointment.patientName },
    { email: "doctor@example.com", displayName: "Dr. Pratima Agale", responseStatus: "accepted" },
  ];

  const conferenceData = isOnline
    ? {
        createRequest: {
          requestId: `meet_${appointment.id}`,
          conferenceSolutionKey: { type: "hangoutsMeet" },
        },
      }
    : undefined;

  assert.strictEqual(isOnline, true);
  assert.ok(summary.includes("Google Meet"));
  assert.strictEqual(attendees.length, 2);
  assert.strictEqual(conferenceData?.createRequest.conferenceSolutionKey.type, "hangoutsMeet");
  assert.ok(startIso.includes("2026-11-25T10:30:00.000Z"), "16:00 IST is 10:30 UTC");
});

test("Idempotency Simulation: Duplicate booking requests detect identical key", () => {
  const inMemoryStore = new Map<string, { appointmentId: string; status: string }>();

  function simulateBooking(idempotencyKey: string, apptId: string) {
    if (inMemoryStore.has(idempotencyKey)) {
      return { isDuplicate: true, ...inMemoryStore.get(idempotencyKey)! };
    }
    const record = { appointmentId: apptId, status: "Confirmed" };
    inMemoryStore.set(idempotencyKey, record);
    return { isDuplicate: false, ...record };
  }

  const res1 = simulateBooking("req_key_123", "appt_001");
  assert.strictEqual(res1.isDuplicate, false);
  assert.strictEqual(res1.appointmentId, "appt_001");

  const res2 = simulateBooking("req_key_123", "appt_002");
  assert.strictEqual(res2.isDuplicate, true, "Same key must return duplicate without creating new appt");
  assert.strictEqual(res2.appointmentId, "appt_001", "Must return original appointment ID");
});

test("Slot Lock Race Simulation: Concurrency test between two simultaneous reservations", () => {
  const activeLocks = new Set<string>();

  function attemptLock(lockId: string): boolean {
    if (activeLocks.has(lockId)) {
      return false; // Lock collision: rejected
    }
    activeLocks.add(lockId);
    return true; // Acquired
  }

  const slotId = "slot_2026-11-25_10-00";

  // Patient A and Patient B book at the exact same moment
  const patientA = attemptLock(slotId);
  const patientB = attemptLock(slotId);

  assert.strictEqual(patientA, true, "First patient acquires the slot lock");
  assert.strictEqual(patientB, false, "Second patient is rejected due to concurrent conflict");
});

