import crypto from "crypto";
import { getAdminDb } from "../firebase-admin.ts";
import { getSlotTimestamps, DEFAULT_TIMEZONE } from "../utils/timezone.ts";
import type {
  AppointmentWrite,
  ConsultationType,
} from "../types/appointment.ts";

export const SLOT_LOCK_HOLD_MINUTES = 10;

export function buildSlotLockId(doctorId: string, date: string, time: string): string {
  const safeDoctor = doctorId.replace(/[^a-zA-Z0-9_-]/g, "_");
  const safeTime = time.replace(":", "-");
  return `${safeDoctor}_${date}_${safeTime}`;
}

export interface ReservationResult {
  isDuplicate: boolean;
  appointmentId: string;
  slotLockId: string;
  accessSecret: string;
  appointment: AppointmentWrite;
}

/**
 * Atomically reserves a time slot using Firestore transaction.
 * Guarantees no double booking, handles idempotency, and sets a temporary hold.
 */
export async function reserveSlotAtomic(params: {
  doctorId: string;
  date: string;
  time: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  consultationType: ConsultationType;
  condition?: string;
  age?: string;
  message?: string;
  lang?: string;
  idempotencyKey?: string;
  patientId?: string;
}): Promise<ReservationResult> {
  const db = getAdminDb();
  const { doctorId, date, time, idempotencyKey } = params;
  const slotLockId = buildSlotLockId(doctorId, date, time);
  const lockRef = db.collection("slotLocks").doc(slotLockId);

  // 1. Idempotency Check: if an appointment with this idempotency key already exists, return it
  if (idempotencyKey) {
    const existingQ = await db
      .collection("appointments")
      .where("idempotencyKey", "==", idempotencyKey)
      .limit(1)
      .get();

    if (!existingQ.empty) {
      const docSnap = existingQ.docs[0];
      const data = docSnap.data();
      return {
        isDuplicate: true,
        appointmentId: docSnap.id,
        slotLockId,
        accessSecret: data.accessSecret || "",
        appointment: data as AppointmentWrite,
      };
    }
  }

  // Calculate start and end ISO
  const { startIso, endIso } = getSlotTimestamps(date, time);
  const accessSecret = crypto.randomBytes(24).toString("hex");

  // 2. Transactional Reservation
  const newApptRef = db.collection("appointments").doc();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SLOT_LOCK_HOLD_MINUTES * 60 * 1000);

  await db.runTransaction(async (transaction) => {
    // Read slot lock
    const lockDoc = await transaction.get(lockRef);

    if (lockDoc.exists) {
      const lockData = lockDoc.data();
      const lockExpires = lockData?.expiresAt?.toDate
        ? lockData.expiresAt.toDate()
        : new Date(lockData?.expiresAt || 0);

      if (lockData?.status === "confirmed") {
        throw new Error("SLOT_ALREADY_BOOKED: This time slot is already booked.");
      }

      if (lockData?.status === "reserved" && lockExpires.getTime() > now.getTime()) {
        throw new Error(
          "SLOT_LOCKED: This time slot is currently on temporary hold. Please select another time or try again in a few minutes."
        );
      }
    }

    // Check for any existing active appointments for this doctor on this date and time
    const conflictQuery = await transaction.get(
      db
        .collection("appointments")
        .where("doctorId", "==", doctorId)
        .where("appointmentDate", "==", date)
        .where("appointmentTime", "==", time)
    );

    for (const doc of conflictQuery.docs) {
      const st = doc.data().status;
      if (st === "Confirmed" || st === "Pending") {
        throw new Error(
          "SLOT_ALREADY_BOOKED: An appointment already exists for this slot."
        );
      }
    }

    // Write slot lock
    transaction.set(lockRef, {
      id: slotLockId,
      doctorId,
      date,
      time,
      appointmentId: newApptRef.id,
      lockedAt: now,
      expiresAt,
      status: "reserved",
      updatedAt: now,
    });

    // Write appointment document with status "Pending"
    const apptData: AppointmentWrite = {
      patientId: params.patientId,
      patientName: params.patientName.trim(),
      patientEmail: params.patientEmail.trim().toLowerCase(),
      patientPhone: params.patientPhone.trim(),
      doctorId,
      appointmentDate: date,
      appointmentTime: time,
      startTimestamp: startIso,
      endTimestamp: endIso,
      timezone: DEFAULT_TIMEZONE,
      consultationType: params.consultationType,
      status: "Pending",
      condition: params.condition,
      age: params.age,
      message: params.message,
      lang: params.lang || "en",
      accessSecret,
      idempotencyKey,
      calendarSyncStatus: "pending",
      notificationStatus: {
        email: "pending",
        whatsapp: "pending",
      },
    };

    transaction.set(newApptRef, {
      ...apptData,
      createdAt: now,
      updatedAt: now,
    });
  });

  return {
    isDuplicate: false,
    appointmentId: newApptRef.id,
    slotLockId,
    accessSecret,
    appointment: {
      patientId: params.patientId,
      patientName: params.patientName,
      patientEmail: params.patientEmail,
      patientPhone: params.patientPhone,
      doctorId,
      appointmentDate: date,
      appointmentTime: time,
      startTimestamp: startIso,
      endTimestamp: endIso,
      timezone: DEFAULT_TIMEZONE,
      consultationType: params.consultationType,
      status: "Pending",
    },
  };
}

/**
 * Confirms a slot reservation lock once the booking and calendar sync succeed.
 */
export async function confirmSlotLock(
  slotLockId: string,
  appointmentId: string
): Promise<void> {
  const db = getAdminDb();
  await db
    .collection("slotLocks")
    .doc(slotLockId)
    .set(
      {
        status: "confirmed",
        appointmentId,
        updatedAt: new Date(),
      },
      { merge: true }
    );
}

/**
 * Releases a slot reservation lock if booking fails or is cancelled.
 */
export async function releaseSlotLock(slotLockId: string): Promise<void> {
  const db = getAdminDb();
  try {
    await db.collection("slotLocks").doc(slotLockId).delete();
  } catch (err) {
    console.warn(`Failed to delete slotLock ${slotLockId}:`, err);
  }
}
