import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface AvailabilitySettings {
  weeklyDays: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  slots: string[]; // array of time slots, e.g. ["09:00", "10:00"]
}

const DEFAULT_AVAILABILITY: AvailabilitySettings = {
  weeklyDays: [1, 2, 3, 4, 5, 6], // Monday to Saturday
  slots: ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00", "19:00"],
};

// Fetch availability configuration set by the doctor
export async function fetchAvailabilitySettings(): Promise<AvailabilitySettings> {
  try {
    const docRef = doc(db, "settings", "availability");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        weeklyDays: data.weeklyDays ?? DEFAULT_AVAILABILITY.weeklyDays,
        slots: data.slots ?? DEFAULT_AVAILABILITY.slots,
      };
    }
  } catch (err) {
    console.error("Error fetching availability settings:", err);
  }
  return DEFAULT_AVAILABILITY;
}

// Save availability configuration set by the doctor
export async function saveAvailabilitySettings(settings: AvailabilitySettings): Promise<void> {
  const docRef = doc(db, "settings", "availability");
  await setDoc(docRef, {
    weeklyDays: settings.weeklyDays,
    slots: settings.slots,
    updatedAt: new Date(),
  });
}

// Fetch all booked slot times on a specific date (YYYY-MM-DD)
export async function fetchBookedSlotsForDate(date: string): Promise<string[]> {
  try {
    const q = query(
      collection(db, "appointments"),
      where("appointmentDate", "==", date)
    );
    const snapshot = await getDocs(q);
    const bookedSlots: string[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      // Only treat Confirmed or Pending appointments as booking slot hold
      if (data.status !== "Cancelled" && data.appointmentTime) {
        bookedSlots.push(data.appointmentTime);
      }
    });
    return bookedSlots;
  } catch (err) {
    console.error("Error fetching booked slots for date:", err);
    return [];
  }
}
