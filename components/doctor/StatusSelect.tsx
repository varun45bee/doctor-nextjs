import type { AppointmentStatus } from "@/lib/types/appointment";
import { APPOINTMENT_STATUSES } from "@/lib/types/appointment";

type StatusSelectProps = {
  value: AppointmentStatus;
  onChange: (status: AppointmentStatus) => void;
  disabled?: boolean;
};

export default function StatusSelect({
  value,
  onChange,
  disabled,
}: StatusSelectProps) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as AppointmentStatus)}
      className="text-xs px-2 py-1.5 rounded-lg border bg-[var(--bg-surface)] border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-sage-400 disabled:opacity-50"
      style={{ color: "var(--text-primary)" }}
    >
      {APPOINTMENT_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
