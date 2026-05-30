"use client";

import { Search, ArrowUpDown } from "lucide-react";
import type { AppointmentStatus } from "@/lib/types/appointment";
import { APPOINTMENT_STATUSES } from "@/lib/types/appointment";

type AppointmentFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: AppointmentStatus | "all";
  onStatusChange: (value: AppointmentStatus | "all") => void;
  sortDirection: "asc" | "desc";
  onSortChange: (value: "asc" | "desc") => void;
  totalCount: number;
  filteredCount: number;
};

export default function AppointmentFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortDirection,
  onSortChange,
  totalCount,
  filteredCount,
}: AppointmentFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <select
          value={status}
          onChange={(e) =>
            onStatusChange(e.target.value as AppointmentStatus | "all")
          }
          className="px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <option value="all">All Statuses</option>
          {APPOINTMENT_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() =>
            onSortChange(sortDirection === "asc" ? "desc" : "asc")
          }
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          <ArrowUpDown className="w-4 h-4" />
          Date {sortDirection === "asc" ? "↑" : "↓"}
        </button>
      </div>

      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
        Showing {filteredCount} of {totalCount} appointments
      </p>
    </div>
  );
}
