export const ALLOWED_DOCTOR_EMAIL = process.env.NEXT_PUBLIC_ALLOWED_DOCTOR_EMAIL;

export function isAllowedDoctorEmail(email: string | null | undefined): boolean {
  if (!email || !ALLOWED_DOCTOR_EMAIL) return false;
  return email.toLowerCase().trim() === ALLOWED_DOCTOR_EMAIL.toLowerCase().trim();
}
