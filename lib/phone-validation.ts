export const INDIAN_MOBILE_ERROR =
  "Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.";

export function getIndianMobileDigits(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  let mobile = digits;

  if (digits.length === 12 && digits.startsWith("91")) {
    mobile = digits.slice(2);
  }

  return /^[6-9]\d{9}$/.test(mobile) ? mobile : null;
}

export function isValidIndianMobileNumber(phone: string): boolean {
  return getIndianMobileDigits(phone) !== null;
}
