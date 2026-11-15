import { getAdminDb } from "@/lib/firebase-admin";
import {
  reserveSlotAtomic,
  confirmSlotLock,
  releaseSlotLock,
  buildSlotLockId,
} from "@/lib/services/slot-service";
import {
  enqueueNotificationJob,
  executeNotificationJob,
} from "@/lib/services/notification-service";
import { logAuditEvent } from "@/lib/services/audit-service";
import {
  Appointment,
  ConsultationType,
  normalizeAppointment,
} from "@/lib/types/appointment";

export interface CreateBookingInput {
  doctorId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:mm
  consultationType: ConsultationType;
  condition?: string;
  age?: string;
  message?: string;
  lang?: string;
  idempotencyKey?: string;
  patientId?: string;
}

export async function createAppointmentBooking(
  input: CreateBookingInput,
  actorIp?: string
): Promise<{
  success: boolean;
  appointment: Appointment;
  isDuplicate?: boolean;
}> {
  const doctorId = input.doctorId || "default_doctor";

  // 1. Atomically reserve slot lock and create pending appointment
  const reservation = await reserveSlotAtomic({
    ...input,
    doctorId,
    date: input.appointmentDate,
    time: input.appointmentTime,
  });

  const { appointmentId, slotLockId, accessSecret, isDuplicate } = reservation;
  const db = getAdminDb();
  const apptRef = db.collection("appointments").doc(appointmentId);

  // If this was an idempotent duplicate, return existing appointment directly
  if (isDuplicate) {
    const snap = await apptRef.get();
    return {
      success: true,
      appointment: normalizeAppointment({ id: snap.id, ...snap.data() }),
      isDuplicate: true,
    };
  }

  // 2. Prepare appointment entity for Calendar & Meet creation
  const tempAppointment: Appointment = {
    id: appointmentId,
    patientId: input.patientId,
    patientName: input.patientName,
    patientEmail: input.patientEmail,
    patientPhone: input.patientPhone,
    doctorId,
    appointmentDate: input.appointmentDate,
    appointmentTime: input.appointmentTime,
    timezone: "Asia/Kolkata",
    consultationType: input.consultationType,
    status: "Pending",
    condition: input.condition,
    age: input.age,
    message: input.message,
    lang: input.lang,
    accessSecret,
    createdAt: new Date(),
  };

  // 3. Mark appointment Confirmed
  const updates: Record<string, unknown> = {
    status: "Confirmed",
    calendarSyncStatus: "not_applicable",
    meetingStatus: "not_applicable",
    updatedAt: new Date(),
  };

  await apptRef.update(updates);

  // 4. Confirm slot lock
  await confirmSlotLock(slotLockId, appointmentId);

  // 5. Create / update appointment lookup for legacy / phone lookup
  try {
    const phoneClean = input.patientPhone.replace(/\D/g, "");
    const phoneKey = phoneClean.length === 10 ? `91${phoneClean}` : phoneClean;
    if (phoneKey) {
      await db.collection("appointment_lookup").doc(phoneKey).set({
        patientName: input.patientName,
        patientPhone: input.patientPhone,
        appointmentDate: input.appointmentDate,
        appointmentTime: input.appointmentTime,
        status: "Confirmed",
        appointmentId,
        updatedAt: new Date(),
      });
    }
  } catch (lookupErr) {
    console.warn("Could not write appointment_lookup doc:", lookupErr);
  }

  // 7. Enqueue notification job (Email & WhatsApp)
  const jobId = await enqueueNotificationJob({
    appointmentId,
    type: "booking_confirmed",
    channel: "both",
    patientName: input.patientName,
    patientEmail: input.patientEmail,
    patientPhone: input.patientPhone,
    appointmentDate: input.appointmentDate,
    appointmentTime: input.appointmentTime,
    consultationType: input.consultationType,
    googleMeetUrl: undefined,
  });

  // Attempt non-blocking immediate dispatch for fastest user experience
  setTimeout(async () => {
    try {
      const jobSnap = await db.collection("notificationJobs").doc(jobId).get();
      if (jobSnap.exists) {
        await executeNotificationJob(jobSnap.data() as any);
      }
    } catch (dispatchErr) {
      console.warn("Immediate notification dispatch error:", dispatchErr);
    }
  }, 50);

  // 8. Audit Log
  await logAuditEvent({
    action: "APPOINTMENT_CREATED",
    entityType: "appointment",
    entityId: appointmentId,
    actor: {
      type: "patient",
      ip: actorIp,
    },
    details: {
      date: input.appointmentDate,
      time: input.appointmentTime,
      type: input.consultationType,
      calendarSyncStatus: "not_applicable",
    },
    timestamp: new Date().toISOString(),
  });

  const finalSnap = await apptRef.get();
  return {
    success: true,
    appointment: normalizeAppointment({ id: finalSnap.id, ...finalSnap.data() }),
  };
}

export async function cancelAppointmentBooking(params: {
  appointmentId: string;
  actor: { type: "doctor" | "patient" | "admin"; id?: string; ip?: string };
  reason?: string;
  token?: string; // patient access secret
}): Promise<{ success: boolean; appointment: Appointment }> {
  const db = getAdminDb();
  const apptRef = db.collection("appointments").doc(params.appointmentId);
  const snap = await apptRef.get();

  if (!snap.exists) {
    throw new Error("Appointment not found");
  }

  const appt = normalizeAppointment({ id: snap.id, ...snap.data() });

  // Security check: if patient, verify access token
  if (params.actor.type === "patient") {
    if (!params.token || params.token !== appt.accessSecret) {
      throw new Error("UNAUTHORIZED: Invalid appointment access token");
    }
  }

  if (appt.status === "Cancelled") {
    return { success: true, appointment: appt };
  }

  // 1. Release slot lock
  const slotLockId = buildSlotLockId(
    appt.doctorId,
    appt.appointmentDate,
    appt.appointmentTime
  );
  await releaseSlotLock(slotLockId);

  // 2. Update appointment in Firestore
  const nowIso = new Date().toISOString();
  await apptRef.update({
    status: "Cancelled",
    cancellationReason: params.reason || "Cancelled by user",
    cancelledAt: nowIso,
    cancelledBy: params.actor.type,
    updatedAt: new Date(),
  });

  // 4. Update lookup
  if (appt.patientPhone) {
    const phoneClean = appt.patientPhone.replace(/\D/g, "");
    const phoneKey = phoneClean.length === 10 ? `91${phoneClean}` : phoneClean;
    if (phoneKey) {
      await db
        .collection("appointment_lookup")
        .doc(phoneKey)
        .update({ status: "Cancelled", updatedAt: new Date() })
        .catch(() => {});
    }
  }

  // 5. Enqueue cancellation notification
  await enqueueNotificationJob({
    appointmentId: appt.id,
    type: "booking_cancelled",
    channel: "both",
    patientName: appt.patientName,
    patientEmail: appt.patientEmail,
    patientPhone: appt.patientPhone,
    appointmentDate: appt.appointmentDate,
    appointmentTime: appt.appointmentTime,
    consultationType: appt.consultationType,
    googleMeetUrl: appt.googleMeetUrl,
  });

  // 6. Audit log
  await logAuditEvent({
    action: "APPOINTMENT_CANCELLED",
    entityType: "appointment",
    entityId: appt.id,
    actor: params.actor,
    details: { reason: params.reason },
    timestamp: nowIso,
  });

  const updatedSnap = await apptRef.get();
  return {
    success: true,
    appointment: normalizeAppointment({ id: updatedSnap.id, ...updatedSnap.data() }),
  };
}

export async function rescheduleAppointmentBooking(params: {
  appointmentId: string;
  newDate: string;
  newTime: string;
  actor: { type: "doctor" | "patient" | "admin"; id?: string; ip?: string };
  reason?: string;
  token?: string; // patient access secret
}): Promise<{ success: boolean; appointment: Appointment }> {
  const db = getAdminDb();
  const apptRef = db.collection("appointments").doc(params.appointmentId);
  const snap = await apptRef.get();

  if (!snap.exists) {
    throw new Error("Appointment not found");
  }

  const appt = normalizeAppointment({ id: snap.id, ...snap.data() });

  // Security check
  if (params.actor.type === "patient") {
    if (!params.token || params.token !== appt.accessSecret) {
      throw new Error("UNAUTHORIZED: Invalid appointment access token");
    }
  }

  const oldDate = appt.appointmentDate;
  const oldTime = appt.appointmentTime;

  // 1. Reserve the new slot atomically
  const newLockId = buildSlotLockId(appt.doctorId, params.newDate, params.newTime);
  const newLockRef = db.collection("slotLocks").doc(newLockId);
  const now = new Date();

  await db.runTransaction(async (transaction) => {
    const lockDoc = await transaction.get(newLockRef);
    if (lockDoc.exists) {
      const lData = lockDoc.data();
      if (lData?.status === "confirmed") {
        throw new Error("SLOT_ALREADY_BOOKED: The new time slot is already booked.");
      }
    }

    transaction.set(newLockRef, {
      id: newLockId,
      doctorId: appt.doctorId,
      date: params.newDate,
      time: params.newTime,
      appointmentId: appt.id,
      lockedAt: now,
      status: "confirmed",
      updatedAt: now,
    });
  });

  // 2. Release old slot lock
  const oldLockId = buildSlotLockId(appt.doctorId, oldDate, oldTime);
  await releaseSlotLock(oldLockId);

  // 3. Update appointment doc
  const nowIso = new Date().toISOString();
  await apptRef.update({
    appointmentDate: params.newDate,
    appointmentTime: params.newTime,
    rescheduledFrom: `${oldDate} ${oldTime}`,
    updatedAt: new Date(),
  });

  // 5. Update lookup
  if (appt.patientPhone) {
    const phoneClean = appt.patientPhone.replace(/\D/g, "");
    const phoneKey = phoneClean.length === 10 ? `91${phoneClean}` : phoneClean;
    if (phoneKey) {
      await db
        .collection("appointment_lookup")
        .doc(phoneKey)
        .update({
          appointmentDate: params.newDate,
          appointmentTime: params.newTime,
          updatedAt: new Date(),
        })
        .catch(() => {});
    }
  }

  // 6. Enqueue notification
  await enqueueNotificationJob({
    appointmentId: appt.id,
    type: "booking_rescheduled",
    channel: "both",
    patientName: appt.patientName,
    patientEmail: appt.patientEmail,
    patientPhone: appt.patientPhone,
    appointmentDate: params.newDate,
    appointmentTime: params.newTime,
    consultationType: appt.consultationType,
    googleMeetUrl: appt.googleMeetUrl,
  });

  // 7. Audit log
  await logAuditEvent({
    action: "APPOINTMENT_RESCHEDULED",
    entityType: "appointment",
    entityId: appt.id,
    actor: params.actor,
    details: {
      from: `${oldDate} ${oldTime}`,
      to: `${params.newDate} ${params.newTime}`,
      reason: params.reason,
    },
    timestamp: nowIso,
  });

  const updatedSnap = await apptRef.get();
  return {
    success: true,
    appointment: normalizeAppointment({ id: updatedSnap.id, ...updatedSnap.data() }),
  };
}
