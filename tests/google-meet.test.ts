import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { normalizeAppointment, type Appointment } from "../lib/types/appointment.ts";
import { buildWhatsAppTextMessage, buildConfirmationEmail } from "../lib/notifications/templates.ts";

describe("Google Meet Automation & Security", () => {
  const sampleAppointment: Appointment = {
    id: "appt_test_meet_123",
    patientName: "Aditi Rao",
    patientPhone: "+919876543210",
    patientEmail: "aditi.rao@example.com",
    doctorId: "default_doctor",
    appointmentDate: "2026-11-15",
    appointmentTime: "11:30",
    timezone: "Asia/Kolkata",
    consultationType: "online",
    status: "Confirmed",
    accessSecret: "secret_token_abc123",
    googleMeetLink: "https://meet.google.com/xyz-uvwx-rst",
    googleMeetUrl: "https://meet.google.com/xyz-uvwx-rst",
    googleMeetSpaceName: "spaces/xyz-uvwx-rst",
    meetingStatus: "ready",
    meetingCreatedAt: "2026-11-05T10:00:00Z",
    meetingCreatedBy: "default_doctor",
    createdAt: new Date("2026-11-05T09:30:00Z"),
  };

  it("Test 1: normalizeAppointment preserves all Google Meet automation fields and aliases", () => {
    const normalized = normalizeAppointment(sampleAppointment as any);
    assert.equal(normalized.googleMeetLink, "https://meet.google.com/xyz-uvwx-rst");
    assert.equal(normalized.googleMeetUrl, "https://meet.google.com/xyz-uvwx-rst");
    assert.equal(normalized.googleMeetSpaceName, "spaces/xyz-uvwx-rst");
    assert.equal(normalized.meetingStatus, "ready");
    assert.equal(normalized.meetingCreatedBy, "default_doctor");
    assert.ok(normalized.meetingCreatedAt);
  });

  it("Test 2: normalizeAppointment gracefully defaults meetingStatus when link exists", () => {
    const raw = {
      id: "appt_legacy",
      patientName: "Legacy Patient",
      googleMeetUrl: "https://meet.google.com/abc-defg-hij",
      consultationType: "online",
    };
    const normalized = normalizeAppointment(raw);
    assert.equal(normalized.googleMeetLink, "https://meet.google.com/abc-defg-hij");
    assert.equal(normalized.meetingStatus, "ready");
  });

  it("Test 3: normalizeAppointment defaults in-clinic consultation without meet link", () => {
    const raw = {
      id: "appt_clinic",
      patientName: "Clinic Patient",
      consultationType: "clinic",
    };
    const normalized = normalizeAppointment(raw);
    assert.equal(normalized.meetingStatus, undefined);
    assert.equal(normalized.googleMeetLink, undefined);
  });

  it("Test 4: WhatsApp confirmation template formats Google Meet link cleanly", () => {
    const waText = buildWhatsAppTextMessage("confirmed", {
      patientName: "Aditi Rao",
      appointmentDate: "2026-11-15",
      appointmentTime: "11:30 AM",
      consultationType: "online",
      googleMeetUrl: "https://meet.google.com/xyz-uvwx-rst",
    });

    assert.match(waText, /Online \(Google Meet\)/i);
    assert.match(waText, /Google Meet Link/i);
    assert.match(waText, /https:\/\/meet\.google\.com\/xyz-uvwx-rst/);
    assert.match(waText, /Dr\. Pratima Agale/);
  });

  it("Test 5: Email template incorporates secure Google Meet video room CTA", () => {
    const email = buildConfirmationEmail({
      patientName: "Aditi Rao",
      appointmentDate: "2026-11-15",
      appointmentTime: "11:30 AM",
      consultationType: "online",
      googleMeetUrl: "https://meet.google.com/xyz-uvwx-rst",
    });

    assert.match(email.subject, /Confirmed/i);
    assert.match(email.html, /https:\/\/meet\.google\.com\/xyz-uvwx-rst/);
    assert.match(email.html, /Join Google Meet/i);
  });

  it("Test 6: Handles failed meeting status safely without exposing broken links", () => {
    const failedAppt: Appointment = {
      ...sampleAppointment,
      googleMeetLink: undefined,
      googleMeetUrl: undefined,
      meetingStatus: "failed",
      meetingError: "OAuth token expired",
    };
    const normalized = normalizeAppointment(failedAppt as any);
    assert.equal(normalized.meetingStatus, "failed");
    assert.equal(normalized.meetingError, "OAuth token expired");
    assert.equal(normalized.googleMeetLink, undefined);
  });
});
