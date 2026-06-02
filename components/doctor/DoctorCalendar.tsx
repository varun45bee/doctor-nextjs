"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Clock } from "lucide-react";
import type { Appointment } from "@/lib/types/appointment";

type DoctorCalendarProps = {
  appointments: Appointment[];
  onSelectAppointment: (appt: Appointment) => void;
};

export default function DoctorCalendar({ appointments, onSelectAppointment }: DoctorCalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Helper to format date string to matching DB structure: YYYY-MM-DD
  const formatDateString = (y: number, m: number, d: number) => {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  };

  // Calculate days list
  const calendarCells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();
    const prevMonthTotalDays = new Date(year, month, 0).getDate();

    const cells: { date: number; monthOffset: number; key: string; fullDateStr: string }[] = [];

    // Prev month padding days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevMonthTotalDays - i;
      const mOffset = -1;
      const targetM = month === 0 ? 11 : month - 1;
      const targetY = month === 0 ? year - 1 : year;
      cells.push({
        date: d,
        monthOffset: mOffset,
        key: `prev-${d}`,
        fullDateStr: formatDateString(targetY, targetM, d),
      });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      cells.push({
        date: d,
        monthOffset: 0,
        key: `curr-${d}`,
        fullDateStr: formatDateString(year, month, d),
      });
    }

    // Next month padding days to make perfect grid (6 rows of 7 = 42 cells)
    const remaining = 42 - cells.length;
    for (let d = 1; d <= remaining; d++) {
      const mOffset = 1;
      const targetM = month === 11 ? 0 : month + 1;
      const targetY = month === 11 ? year + 1 : year;
      cells.push({
        date: d,
        monthOffset: mOffset,
        key: `next-${d}`,
        fullDateStr: formatDateString(targetY, targetM, d),
      });
    }

    return cells;
  }, [year, month]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Group appointments by date
  const appointmentsByDate = useMemo(() => {
    const groups: Record<string, Appointment[]> = {};
    appointments.forEach((appt) => {
      if (appt.appointmentDate) {
        if (!groups[appt.appointmentDate]) {
          groups[appt.appointmentDate] = [];
        }
        groups[appt.appointmentDate].push(appt);
      }
    });
    return groups;
  }, [appointments]);

  // Selected date status list
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);
  const selectedDayAppointments = useMemo(() => {
    if (!selectedDateStr) return [];
    return appointmentsByDate[selectedDateStr] || [];
  }, [selectedDateStr, appointmentsByDate]);

  const handleDayClick = (dateStr: string) => {
    setSelectedDateStr(dateStr);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50";
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/50";
      case "Completed":
        return "bg-green-100 text-green-800 border border-green-200 dark:bg-green-950/40 dark:text-green-300 dark:border-green-900/50";
      case "Cancelled":
        return "bg-red-100 text-red-800 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900/50";
      default:
        return "bg-zinc-100 text-zinc-800 border border-zinc-200 dark:bg-zinc-800/40 dark:text-zinc-300 dark:border-zinc-700/50";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 page-enter">
      {/* Calendar Grid Container */}
      <div
        className="lg:col-span-2 p-5 rounded-2xl border flex flex-col"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
      >
        {/* Calendar Nav Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-sage-100 dark:bg-sage-950 text-sage-700 dark:text-sage-400">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              {monthNames[month]} {year}
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg border hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors"
              style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors"
              style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg border hover:bg-sage-50 dark:hover:bg-sage-900 transition-colors"
              style={{ borderColor: "var(--border-color)", color: "var(--text-secondary)" }}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Days of Week Headers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold mb-2 py-2 uppercase tracking-wider" style={{ color: "var(--text-muted)", backgroundColor: "var(--bg-surface-alt)" }}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1 bg-zinc-200/50 dark:bg-zinc-800/10 rounded-lg overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50">
          {calendarCells.map((cell) => {
            const isOutside = cell.monthOffset !== 0;
            const appts = appointmentsByDate[cell.fullDateStr] || [];
            const isSelected = selectedDateStr === cell.fullDateStr;
            const isToday = cell.fullDateStr === formatDateString(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

            return (
              <div
                key={cell.key}
                onClick={() => handleDayClick(cell.fullDateStr)}
                className={`min-h-[75px] sm:min-h-[85px] p-1.5 flex flex-col justify-between transition-all cursor-pointer relative ${
                  isOutside
                    ? "opacity-40 hover:opacity-70 bg-zinc-50/20 dark:bg-zinc-950/5"
                    : "bg-white dark:bg-zinc-900 hover:bg-sage-50/20 dark:hover:bg-sage-950/20"
                } ${isSelected ? "ring-2 ring-sage-500 ring-inset" : ""}`}
              >
                {/* Date indicator */}
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold flex items-center justify-center w-5 h-5 rounded-full ${
                      isToday
                        ? "bg-sage-600 text-white shadow-sm"
                        : ""
                    }`}
                    style={{ color: !isToday ? (isOutside ? "var(--text-muted)" : "var(--text-primary)") : undefined }}
                  >
                    {cell.date}
                  </span>
                  {appts.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sage-500"></span>
                  )}
                </div>

                {/* Micro preview on desktop */}
                <div className="hidden sm:block space-y-1 mt-1">
                  {appts.slice(0, 2).map((appt) => (
                    <div
                      key={appt.id}
                      className="text-[9px] truncate px-1 rounded font-medium border"
                      style={{
                        backgroundColor: appt.status === "Completed" ? "rgba(90,127,90,0.1)" : "rgba(90,127,90,0.05)",
                        borderColor: "var(--border-color)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {appt.patientName}
                    </div>
                  ))}
                  {appts.length > 2 && (
                    <div className="text-[8px] text-right font-semibold" style={{ color: "var(--text-muted)" }}>
                      +{appts.length - 2} more
                    </div>
                  )}
                </div>

                {/* Mobile indicators */}
                <div className="sm:hidden flex flex-wrap gap-0.5 justify-end">
                  {appts.slice(0, 3).map((appt) => (
                    <span
                      key={appt.id}
                      className={`w-1 h-1 rounded-full ${
                        appt.status === "Pending" ? "bg-amber-400" :
                        appt.status === "Confirmed" ? "bg-blue-400" :
                        appt.status === "Completed" ? "bg-green-400" : "bg-red-400"
                      }`}
                    ></span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Date Detail Column */}
      <div className="flex flex-col space-y-5">
        <div
          className="p-5 rounded-2xl border flex-1 flex flex-col h-full"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
        >
          {selectedDateStr ? (
            <>
              {/* Detail Header */}
              <div className="border-b pb-3 mb-4 flex items-center justify-between" style={{ borderColor: "var(--border-color)" }}>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    Selected Schedule
                  </h4>
                  <p className="text-md font-serif font-bold mt-1" style={{ color: "var(--text-primary)", fontFamily: "'Cormorant Garamond', serif" }}>
                    {new Date(selectedDateStr + "T00:00:00").toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-sage-50 dark:bg-sage-900 border font-semibold text-sage-600 dark:text-sage-400" style={{ borderColor: "var(--border-color)" }}>
                  {selectedDayAppointments.length} Booked
                </span>
              </div>

              {/* Detail Bookings List */}
              {selectedDayAppointments.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-2">
                  <div className="w-12 h-12 rounded-full border border-dashed flex items-center justify-center text-zinc-300 dark:text-zinc-700">
                    <Clock className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>No appointments</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>There are no consultations scheduled for this date.</p>
                </div>
              ) : (
                <div className="space-y-3 overflow-y-auto flex-1 max-h-[350px]">
                  {selectedDayAppointments.map((appt) => (
                    <div
                      key={appt.id}
                      onClick={() => onSelectAppointment(appt)}
                      className="p-3.5 rounded-xl border hover:border-sage-500/50 cursor-pointer transition-all hover:bg-sage-50/10"
                      style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-surface-alt)" }}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-semibold text-sm truncate" style={{ color: "var(--text-primary)" }}>
                          {appt.patientName}
                        </span>
                        <span className={`text-[10px] uppercase font-bold tracking-wide px-2 py-0.5 rounded-full ${getStatusColor(appt.status)}`}>
                          {appt.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs" style={{ color: "var(--text-secondary)" }}>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-sage-500" />
                          {appt.appointmentTime}
                        </span>
                        {appt.age && <span>{appt.age} Years</span>}
                      </div>
                      {appt.condition && (
                        <p className="text-xs mt-2 border-t pt-1.5 truncate italic" style={{ color: "var(--text-muted)", borderColor: "var(--border-color)" }}>
                          "{appt.condition}"
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <CalendarIcon className="w-10 h-10 text-sage-400 animate-pulse" />
              <div>
                <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>View Day Agenda</p>
                <p className="text-xs max-w-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  Click on any date in the calendar grid to view the corresponding list of patient consultations.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
