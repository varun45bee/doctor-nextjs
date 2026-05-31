import { CalendarX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <CalendarX className="w-12 h-12 text-sage-300" />
      <h3 className="font-medium" style={{ color: "var(--text-primary)" }}>
        No appointments found
      </h3>
      <p className="text-sm text-center max-w-sm" style={{ color: "var(--text-muted)" }}>
        Try adjusting your search or filter, or wait for patients to book appointments.
      </p>
    </div>
  );
}
