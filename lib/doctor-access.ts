export const ALLOWED_DOCTOR_EMAIL = process.env.NEXT_PUBLIC_ALLOWED_DOCTOR_EMAIL;

export function isAllowedDoctorEmail(email: string | null | undefined): boolean {
  if (!email || !ALLOWED_DOCTOR_EMAIL) return false;
  const allowedEmails = ALLOWED_DOCTOR_EMAIL.split(",").map(e => e.trim().toLowerCase());
  return allowedEmails.includes(email.toLowerCase().trim());
}
