export const ALLOWED_DOCTOR_EMAIL = process.env.NEXT_PUBLIC_ALLOWED_DOCTOR_EMAIL;

export function isAllowedDoctorEmail(email: string | null | undefined): boolean {
  const allowed = process.env.NEXT_PUBLIC_ALLOWED_DOCTOR_EMAIL || ALLOWED_DOCTOR_EMAIL;
  if (!email || !allowed) return false;
  const cleanAllowed = allowed.replace(/['"]/g, "");
  const allowedEmails = cleanAllowed.split(",").map(e => e.trim().toLowerCase());
  return allowedEmails.includes(email.toLowerCase().trim());
}
