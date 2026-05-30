export const ALLOWED_DOCTOR_EMAIL = "varun45j@gmail.com";

export function isAllowedDoctorEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === ALLOWED_DOCTOR_EMAIL.toLowerCase();
}
