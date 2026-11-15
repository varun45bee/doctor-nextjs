"use client";

import { Search, ArrowUpDown, X, Filter, Calendar, Video, MapPin } from "lucide-react";
import type { AppointmentStatus } from "@/lib/types/appointment";
import { APPOINTMENT_STATUSES } from "@/lib/types/appointment";
import type { DateQuickFilter } from "@/lib/firestore/appointments";

type AppointmentFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  status: AppointmentStatus | "all";
  onStatusChange: (value: AppointmentStatus | "all") => void;
  mode?: "all" | "online" | "in-person";
  onModeChange?: (value: "all" | "online" | "in-person") => void;
  dateFilter?: DateQuickFilter;
  onDateFilterChange?: (value: DateQuickFilter) => void;
  sortDirection: "asc" | "desc";
  onSortChange: (value: "asc" | "desc") => void;
  totalCount: number;
  filteredCount: number;
  statusCounts?: Record<string, number>;
};

export default function AppointmentFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  mode = "all",
  onModeChange,
  dateFilter = "all",
  onDateFilterChange,
  sortDirection,
  onSortChange,
  totalCount,
  filteredCount,
  statusCounts = {},
}: AppointmentFiltersProps) {
  return (
    <div className="space-y-3.5">
      {/* Top Search & Primary Filters Row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search patient name, condition, phone, or ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-2 focus:ring-sage-500 bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)]"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Mode Selector */}
        {onModeChange && (
          <select
            value={mode}
            onChange={(e) => onModeChange(e.target.value as "all" | "online" | "in-person")}
            className="px-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500 bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)] cursor-pointer"
          >
            <option value="all">All Consultation Modes</option>
            <option value="online">🎥 Online Video Only</option>
            <option value="in-person">🏥 Clinic In-Person</option>
          </select>
        )}

        {/* Date Quick Filter Selector */}
        {onDateFilterChange && (
          <select
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value as DateQuickFilter)}
            className="px-3 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sage-500 bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-primary)] cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="today">📅 Today's Consultations</option>
            <option value="upcoming">⏳ Upcoming Slots</option>
            <option value="past">📜 Past Consultations</option>
          </select>
        )}

        {/* Sort Button */}
        <button
          type="button"
          onClick={() => onSortChange(sortDirection === "asc" ? "desc" : "asc")}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-[var(--bg-muted)] border-[var(--border-color)] text-[var(--text-secondary)] transition-colors shrink-0"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>Date {sortDirection === "asc" ? "Oldest First" : "Newest First"}</span>
        </button>
      </div>

      {/* Quick Status Filter Chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-xs font-semibold text-[var(--text-muted)] mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Status:
        </span>

        {/* 'All' Chip */}
        <button
          type="button"
          onClick={() => onStatusChange("all")}
          className={`
            inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border
            ${
              status === "all"
                ? "bg-sage-600 border-sage-600 text-white shadow-2xs"
                : "bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-sage-400"
            }
          `}
        >
          <span>All</span>
          <span
            className={`px-1.5 py-0.2 rounded-full text-[10px] ${
              status === "all" ? "bg-white/20 text-white" : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
            }`}
          >
            {totalCount}
          </span>
        </button>

        {/* Status Chips */}
        {APPOINTMENT_STATUSES.map((s) => {
          const isSelected = status === s;
          const count = statusCounts[s] ?? 0;
          return (
            <button
              key={s}
              type="button"
              onClick={() => onStatusChange(s)}
              className={`
                inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all border
                ${
                  isSelected
                    ? "bg-sage-600 border-sage-600 text-white shadow-2xs"
                    : "bg-[var(--bg-surface)] border-[var(--border-color)] text-[var(--text-secondary)] hover:border-sage-400"
                }
              `}
            >
              <span>{s}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? "bg-white/20 text-white" : "bg-[var(--bg-muted)] text-[var(--text-muted)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
