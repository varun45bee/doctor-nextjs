import { isAllowedDoctorEmail } from "@/lib/doctor-access";
import type { Doctor } from "@/lib/types/doctor";

export async function isDoctorEmail(email: string): Promise<boolean> {
  return isAllowedDoctorEmail(email);
}

export async function getDoctorByEmail(
  email: string
): Promise<Doctor | null> {
  if (!isAllowedDoctorEmail(email)) return null;

  return {
    email: email.toLowerCase().trim(),
    role: "doctor",
  };
}
