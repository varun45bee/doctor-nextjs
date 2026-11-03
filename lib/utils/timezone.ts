/**
 * Centralized Timezone and Date Utilities for Dr. Pratima Agale Clinic.
 * Default timezone: Asia/Kolkata (IST = UTC+05:30)
 */

export const DEFAULT_TIMEZONE = "Asia/Kolkata";
export const APPOINTMENT_DURATION_MINUTES = 45;

/**
 * Returns current timestamp in ISO format.
 */
export function nowIso(): string {
  return new Date().toISOString();
}

/**
 * Parses a YYYY-MM-DD date string and HH:mm time string into start and end ISO strings in Asia/Kolkata.
 * In IST (UTC+05:30), 10:00 AM IST is 04:30 AM UTC.
 */
export function getSlotTimestamps(
  dateStr: string,
  timeStr: string,
  durationMinutes = APPOINTMENT_DURATION_MINUTES,
  _tz = DEFAULT_TIMEZONE
): { startIso: string; endIso: string; startDate: Date; endDate: Date } {
  // Validate format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    throw new Error(`Invalid date format: ${dateStr}. Expected YYYY-MM-DD`);
  }
  if (!/^\d{1,2}:\d{2}$/.test(timeStr)) {
    throw new Error(`Invalid time format: ${timeStr}. Expected HH:mm`);
  }

  const [hours, minutes] = timeStr.split(":").map((v) => parseInt(v, 10));

  // Construct ISO string with explicit IST offset (+05:30)
  const pad = (n: number) => String(n).padStart(2, "0");
  const isoLocal = `${dateStr}T${pad(hours)}:${pad(minutes)}:00+05:30`;
  const startDate = new Date(isoLocal);

  if (isNaN(startDate.getTime())) {
    throw new Error(`Could not construct valid date from ${dateStr} ${timeStr}`);
  }

  const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

  return {
    startIso: startDate.toISOString(),
    endIso: endDate.toISOString(),
    startDate,
    endDate,
  };
}

/**
 * Returns whether a given date string (YYYY-MM-DD) and time string (HH:mm) is in the past in Asia/Kolkata.
 */
export function isSlotInPast(dateStr: string, timeStr: string): boolean {
  try {
    const { startDate } = getSlotTimestamps(dateStr, timeStr);
    const now = new Date();
    // Allow a small 5 minute grace period
    return startDate.getTime() < now.getTime() - 5 * 60 * 1000;
  } catch {
    return true;
  }
}

/**
 * Formats an ISO string or Date into friendly IST string.
 */
export function formatInKolkata(
  dateOrIso: Date | string,
  options: Intl.DateTimeFormatOptions = {
    dateStyle: "medium",
    timeStyle: "short",
  }
): string {
  const d = typeof dateOrIso === "string" ? new Date(dateOrIso) : dateOrIso;
  if (isNaN(d.getTime())) return String(dateOrIso);

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: DEFAULT_TIMEZONE,
    ...options,
  }).format(d);
}

/**
 * Gets day of week index for dateStr in Asia/Kolkata (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 */
export function getDayOfWeekKolkata(dateStr: string): number {
  const [year, month, day] = dateStr.split("-").map(Number);
  // Noon in IST avoids timezone border jitter
  const d = new Date(Date.UTC(year, month - 1, day, 6, 30, 0));
  return d.getUTCDay();
}
