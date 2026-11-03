import { getAdminDb } from "@/lib/firebase-admin";
import { getDayOfWeekKolkata, isSlotInPast } from "@/lib/utils/timezone";

export interface SlotAvailability {
  time: string;
  available: boolean;
  reason?: "booked" | "locked" | "past" | "day_closed";
}

export interface DateAvailabilityResponse {
  date: string;
  doctorId: string;
  isWorkingDay: boolean;
  availableSlotsCount: number;
  slots: SlotAvailability[];
}

const DEFAULT_SLOTS = [
  "10:00",
  "11:00",
  "12:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];
const DEFAULT_WEEKLY_DAYS = [1, 2, 3, 4, 5, 6]; // Monday to Saturday

export async function getDoctorAvailabilitySettings(
  doctorId?: string
): Promise<{ weeklyDays: number[]; slots: string[] }> {
  const db = getAdminDb();

  // Try doctor-specific availability first, then clinic settings
  try {
    if (doctorId && doctorId !== "default_doctor") {
      const docSnap = await db.collection("doctorAvailability").doc(doctorId).get();
      if (docSnap.exists) {
        const data = docSnap.data();
        if (data?.slots && Array.isArray(data.slots)) {
          return {
            weeklyDays: data.weeklyDays || DEFAULT_WEEKLY_DAYS,
            slots: data.slots,
          };
        }
      }
    }

    const clinicSnap = await db.collection("settings").doc("availability").get();
    if (clinicSnap.exists) {
      const data = clinicSnap.data();
      return {
        weeklyDays: data?.weeklyDays ?? DEFAULT_WEEKLY_DAYS,
        slots: data?.slots ?? DEFAULT_SLOTS,
      };
    }
  } catch (err) {
    console.error("Failed to read availability settings from Firestore:", err);
  }

  return {
    weeklyDays: DEFAULT_WEEKLY_DAYS,
    slots: DEFAULT_SLOTS,
  };
}

export async function calculateDateAvailability(
  dateStr: string,
  doctorId = "default_doctor"
): Promise<DateAvailabilityResponse> {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD.`);
  }

  const { weeklyDays, slots: configuredSlots } =
    await getDoctorAvailabilitySettings(doctorId);

  const dayOfWeek = getDayOfWeekKolkata(dateStr);
  const isWorkingDay = weeklyDays.includes(dayOfWeek);

  if (!isWorkingDay) {
    return {
      date: dateStr,
      doctorId,
      isWorkingDay: false,
      availableSlotsCount: 0,
      slots: configuredSlots.map((time) => ({
        time,
        available: false,
        reason: "day_closed",
      })),
    };
  }

  const lockedTimes = new Map<string, "booked" | "locked">();

  try {
    const db = getAdminDb();
    const now = new Date();

    // 1. Fetch active slot locks for this date
    const locksSnap = await db
      .collection("slotLocks")
      .where("date", "==", dateStr)
      .where("doctorId", "==", doctorId)
      .get();

    locksSnap.forEach((doc) => {
      const data = doc.data();
      const time = data.time;
      if (!time) return;

      if (data.status === "confirmed") {
        lockedTimes.set(time, "booked");
      } else if (data.status === "reserved") {
        const exp = data.expiresAt?.toDate
          ? data.expiresAt.toDate()
          : new Date(data.expiresAt || 0);
        if (exp.getTime() > now.getTime()) {
          lockedTimes.set(time, "locked");
        }
      }
    });

    // 2. Fetch active appointments for this date
    const apptsSnap = await db
      .collection("appointments")
      .where("appointmentDate", "==", dateStr)
      .where("doctorId", "==", doctorId)
      .get();

    apptsSnap.forEach((doc) => {
      const data = doc.data();
      const time = data.appointmentTime;
      const status = data.status;
      if (time && (status === "Confirmed" || status === "Pending")) {
        lockedTimes.set(time, "booked");
      }
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("default credentials") || msg.includes("CREDENTIALS")) {
      console.warn(
        "⚠️ [Local Dev Warning] Firebase Admin credentials not set in .env. Falling back to default slots."
      );
    } else {
      console.error("Failed to query locked slots from Firestore Admin:", err);
    }
  }

  // 3. Build slot evaluation list
  const evaluatedSlots: SlotAvailability[] = configuredSlots.map((time) => {
    if (isSlotInPast(dateStr, time)) {
      return { time, available: false, reason: "past" };
    }

    const lockReason = lockedTimes.get(time);
    if (lockReason) {
      return { time, available: false, reason: lockReason };
    }

    return { time, available: true };
  });

  const availableSlotsCount = evaluatedSlots.filter((s) => s.available).length;

  return {
    date: dateStr,
    doctorId,
    isWorkingDay: true,
    availableSlotsCount,
    slots: evaluatedSlots,
  };
}
