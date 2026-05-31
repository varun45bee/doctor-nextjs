import type { AppointmentStatus } from "@/lib/types/appointment";

const styles: Record<AppointmentStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  Confirmed: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span
      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
