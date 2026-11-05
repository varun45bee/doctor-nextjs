export const DEFAULT_DOCTOR_EMAILS = "varun45j@gmail.com,sardarvarun121@gmail.com,madhurmeetj@gmail.com";
export const ALLOWED_DOCTOR_EMAIL = process.env.NEXT_PUBLIC_ALLOWED_DOCTOR_EMAIL || DEFAULT_DOCTOR_EMAILS;

export function isAllowedDoctorEmail(email: string | null | undefined): boolean {
  const allowed = process.env.NEXT_PUBLIC_ALLOWED_DOCTOR_EMAIL || DEFAULT_DOCTOR_EMAILS;
  if (!email || !allowed) return false;
  const cleanAllowed = allowed.replace(/['"]/g, "");
  const allowedEmails = cleanAllowed.split(",").map(e => e.trim().toLowerCase());
  return allowedEmails.includes(email.toLowerCase().trim());
}
