import { test } from "node:test";
import assert from "node:assert";
import { isAllowedDoctorEmail } from "../lib/doctor-access.ts";
import {
  filterAppointments,
  sortAppointmentsByDate,
} from "../lib/firestore/appointments.ts";
import { normalizeAppointment, type Appointment } from "../lib/types/appointment.ts";
import { buildSlotLockId } from "../lib/services/slot-service.ts";

test("Doctor Portal Enterprise - Security: Doctor Whitelist Verification", () => {
  // Allowed emails should pass
  assert.strictEqual(isAllowedDoctorEmail("varun45j@gmail.com"), true);
  assert.strictEqual(isAllowedDoctorEmail("sardarvarun121@gmail.com"), true);
  assert.strictEqual(isAllowedDoctorEmail("madhurmeetj@gmail.com"), true);
  assert.strictEqual(isAllowedDoctorEmail("  VARUN45J@GMAIL.COM  "), true);

  // Unauthorized emails must strictly fail
  assert.strictEqual(isAllowedDoctorEmail("attacker@evil.com"), false);
  assert.strictEqual(isAllowedDoctorEmail("patient123@gmail.com"), false);
  assert.strictEqual(isAllowedDoctorEmail(""), false);
});

test("Doctor Portal Enterprise - Security: Role Tampering Prevention Simulation", () => {
  // Simulates an attacker modifying localStorage to { role: "doctor", email: "hacker@domain.com" }
  const fakeSession = {
    role: "doctor",
    email: "hacker@domain.com",
    uid: "malicious_user_1",
  };

  const isDoc = fakeSession.role === "doctor" && isAllowedDoctorEmail(fakeSession.email || "");
  const assignedRole = isDoc ? "doctor" : "patient";

  assert.strictEqual(isDoc, false);
  assert.strictEqual(assignedRole, "patient");
});

test("Doctor Portal Enterprise - Appointments Filtering Engine", () => {
  const sampleAppointments: Appointment[] = [
    {
      id: "appt-001",
      patientName: "Rahul Sharma",
      patientEmail: "rahul@example.com",
      patientPhone: "9876543210",
      doctorId: "default_doctor",
      appointmentDate: "2026-11-20",
      appointmentTime: "10:00",
      timezone: "Asia/Kolkata",
      consultationType: "online",
      status: "Confirmed",
      condition: "Severe Chronic Eczema",
      createdAt: new Date(),
    },
    {
      id: "appt-002",
      patientName: "Priya Patel",
      patientEmail: "priya@example.com",
      patientPhone: "9123456780",
      doctorId: "default_doctor",
      appointmentDate: "2026-11-20",
      appointmentTime: "11:00",
      timezone: "Asia/Kolkata",
      consultationType: "in-person",
      status: "Pending",
      condition: "Migraine & Neurological",
      createdAt: new Date(),
    },
    {
      id: "appt-003",
      patientName: "Amit Verma",
      patientEmail: "amit@example.com",
      patientPhone: "9988776655",
      doctorId: "default_doctor",
      appointmentDate: "2026-11-25",
      appointmentTime: "16:00",
      timezone: "Asia/Kolkata",
      consultationType: "online",
      status: "Completed",
      condition: "Allergic Rhinitis",
      createdAt: new Date(),
    },
  ];

  // 1. Search by Name
  const searchName = filterAppointments(sampleAppointments, "Rahul", "all");
  assert.strictEqual(searchName.length, 1);
  assert.strictEqual(searchName[0].id, "appt-001");

  // 2. Search by Condition keyword
  const searchCond = filterAppointments(sampleAppointments, "Migraine", "all");
  assert.strictEqual(searchCond.length, 1);
  assert.strictEqual(searchCond[0].id, "appt-002");

  // 3. Search by Phone number
  const searchPhone = filterAppointments(sampleAppointments, "9876543210", "all");
  assert.strictEqual(searchPhone.length, 1);
  assert.strictEqual(searchPhone[0].id, "appt-001");

  // 4. Status Filter
  const filterPending = filterAppointments(sampleAppointments, "", "Pending");
  assert.strictEqual(filterPending.length, 1);
  assert.strictEqual(filterPending[0].id, "appt-002");

  // 5. Mode Filter
  const filterOnline = filterAppointments(sampleAppointments, "", "all", "online");
  assert.strictEqual(filterOnline.length, 2);

  const filterClinic = filterAppointments(sampleAppointments, "", "all", "in-person");
  assert.strictEqual(filterClinic.length, 1);
  assert.strictEqual(filterClinic[0].id, "appt-002");
});

test("Doctor Portal Enterprise - Chronological Sorting", () => {
  const list: Appointment[] = [
    {
      id: "a3",
      patientName: "User 3",
      patientEmail: "u3@test.com",
      patientPhone: "9999999993",
      doctorId: "default_doctor",
      appointmentDate: "2026-11-22",
      appointmentTime: "15:00",
      timezone: "Asia/Kolkata",
      consultationType: "online",
      status: "Confirmed",
      createdAt: new Date(),
    },
    {
      id: "a1",
      patientName: "User 1",
      patientEmail: "u1@test.com",
      patientPhone: "9999999991",
      doctorId: "default_doctor",
      appointmentDate: "2026-11-15",
      appointmentTime: "10:00",
      timezone: "Asia/Kolkata",
      consultationType: "online",
      status: "Confirmed",
      createdAt: new Date(),
    },
    {
      id: "a2",
      patientName: "User 2",
      patientEmail: "u2@test.com",
      patientPhone: "9999999992",
      doctorId: "default_doctor",
      appointmentDate: "2026-11-15",
      appointmentTime: "11:00",
      timezone: "Asia/Kolkata",
      consultationType: "online",
      status: "Confirmed",
      createdAt: new Date(),
    },
  ];

  const sortedAsc = sortAppointmentsByDate(list, "asc");
  assert.strictEqual(sortedAsc[0].id, "a1");
  assert.strictEqual(sortedAsc[1].id, "a2");
  assert.strictEqual(sortedAsc[2].id, "a3");

  const sortedDesc = sortAppointmentsByDate(list, "desc");
  assert.strictEqual(sortedDesc[0].id, "a3");
  assert.strictEqual(sortedDesc[1].id, "a2");
  assert.strictEqual(sortedDesc[2].id, "a1");
});

test("Doctor Portal Enterprise - Atomic Slot Lock ID Generation", () => {
  const lockId1 = buildSlotLockId("default_doctor", "2026-11-20", "10:00");
  const lockId2 = buildSlotLockId("doc_123", "2026-12-01", "15:30");

  assert.strictEqual(lockId1, "default_doctor_2026-11-20_10-00");
  assert.strictEqual(lockId2, "doc_123_2026-12-01_15-30");
});

test("Doctor Portal Enterprise - Data Normalization & EHR fields", () => {
  const rawData = {
    id: "appt_test_99",
    name: "Aarav Sharma",
    phone: "9876500000",
    email: "aarav@test.com",
    date: "2026-11-30",
    time: "14:00",
    status: "confirmed",
    condition: "Hair Thinning",
    doctorNotes: "Prescribed Thuja 200C. Monitor scalp response.",
    prescription: {
      remedy: "Thuja Occidentalis",
      potency: "200C",
      dosage: "4 globules once a week",
      duration: "1 month",
      instructions: "Avoid strong perfumes",
      prescribedAt: "2026-11-15T10:00:00.000Z",
    },
  };

  const normalized = normalizeAppointment(rawData);
  assert.strictEqual(normalized.id, "appt_test_99");
  assert.strictEqual(normalized.patientName, "Aarav Sharma");
  assert.strictEqual(normalized.status, "Confirmed");
  assert.strictEqual(normalized.doctorNotes, "Prescribed Thuja 200C. Monitor scalp response.");
  assert.ok(normalized.prescription);
  assert.strictEqual(normalized.prescription?.remedy, "Thuja Occidentalis");
  assert.strictEqual(normalized.prescription?.potency, "200C");
});
