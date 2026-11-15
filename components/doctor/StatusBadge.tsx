import type { AppointmentStatus } from "@/lib/types/appointment";

type BadgeConfig = {
  classes: string;
  dotColor: string;
};

const STATUS_CONFIGS: Record<AppointmentStatus, BadgeConfig> = {
  Pending: {
    classes: "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",
    dotColor: "bg-amber-500",
  },
  Confirmed: {
    classes: "bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60",
    dotColor: "bg-sky-500",
  },
  Completed: {
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",
    dotColor: "bg-emerald-500",
  },
  Cancelled: {
    classes: "bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60",
    dotColor: "bg-rose-500",
  },
  Failed: {
    classes: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
    dotColor: "bg-slate-400",
  },
};

export default function StatusBadge({ status }: { status: AppointmentStatus }) {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.Pending;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors ${config.classes}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotColor}`} />
      <span>{status}</span>
    </span>
  );
}
