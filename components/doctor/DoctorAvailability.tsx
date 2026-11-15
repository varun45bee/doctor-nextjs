"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  Plus,
  Trash2,
  Save,
  CheckCircle,
  Calendar,
  AlertCircle,
  ShieldCheck,
  Ban,
  Sparkles,
} from "lucide-react";
import {
  fetchAvailabilitySettings,
  saveAvailabilitySettings,
  type BlockedDate,
} from "@/lib/firestore/availability";

export default function DoctorAvailability() {
  const [weeklyDays, setWeeklyDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [slots, setSlots] = useState<string[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Add slot input
  const [newSlotTime, setNewSlotTime] = useState("");

  // Add blocked date inputs
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");

  const DAYS_OF_WEEK = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  // Today in YYYY-MM-DD
  const todayStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const data = await fetchAvailabilitySettings();
        setWeeklyDays(data.weeklyDays);
        setSlots([...data.slots].sort((a, b) => a.localeCompare(b)));
        setBlockedDates(data.blockedDates || []);
      } catch (err) {
        console.error("Failed to load settings:", err);
        setError("Could not load availability settings.");
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleToggleDay = (dayVal: number) => {
    setWeeklyDays((prev) =>
      prev.includes(dayVal) ? prev.filter((d) => d !== dayVal) : [...prev, dayVal]
    );
  };

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlotTime) return;

    if (slots.includes(newSlotTime)) {
      setError("This slot already exists.");
      return;
    }

    const updated = [...slots, newSlotTime].sort((a, b) => a.localeCompare(b));
    setSlots(updated);
    setNewSlotTime("");
    setError("");
  };

  const handleRemoveSlot = (slotToRemove: string) => {
    setSlots((prev) => prev.filter((s) => s !== slotToRemove));
  };

  // Preset generators
  const applyPreset = (type: "standard" | "morning" | "evening") => {
    let presetSlots: string[] = [];
    if (type === "standard") {
      presetSlots = ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00", "18:00", "19:00"];
    } else if (type === "morning") {
      presetSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30"];
    } else if (type === "evening") {
      presetSlots = ["16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30"];
    }
    setSlots(presetSlots);
    setError("");
  };

  // Blocked Date handlers
  const handleAddBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlockDate) return;

    if (blockedDates.some((b) => b.date === newBlockDate)) {
      setError("This date is already blocked.");
      return;
    }

    const newEntry: BlockedDate = {
      date: newBlockDate,
      reason: newBlockReason.trim() || "Clinic Closed / Doctor on Leave",
    };

    setBlockedDates((prev) => [...prev, newEntry].sort((a, b) => a.date.localeCompare(b.date)));
    setNewBlockDate("");
    setNewBlockReason("");
    setError("");
  };

  const handleRemoveBlockedDate = (dateToRemove: string) => {
    setBlockedDates((prev) => prev.filter((b) => b.date !== dateToRemove));
  };

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      await saveAvailabilitySettings({ weeklyDays, slots, blockedDates });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Failed to save settings:", err);
      setError("Could not save availability settings.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-sm text-[var(--text-secondary)]">
        <Clock className="w-7 h-7 animate-spin mx-auto mb-3 text-sage-600" />
        Loading clinic availability & schedule configurations...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Save Bar & Status */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs">
        <div>
          <h3 className="font-bold text-sm text-[var(--text-primary)]">
            Clinic Operating Schedule & Capacity
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Define working days, daily time slot templates, and blocked holidays for patient bookings.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {success && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-bold animate-in fade-in">
              <CheckCircle className="w-4 h-4" /> Schedule Saved!
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-sage-700 hover:bg-sage-800 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Schedule..." : "Save Schedule"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1: Weekly Active Days */}
        <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex flex-col space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-color)]">
            <Calendar className="w-4 h-4 text-sage-600" />
            <h4 className="font-bold text-sm text-[var(--text-primary)]">
              Weekly Operating Days
            </h4>
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            Days enabled below will accept booking reservations:
          </p>

          <div className="space-y-1.5">
            {DAYS_OF_WEEK.map((day) => {
              const isActive = weeklyDays.includes(day.value);
              return (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => handleToggleDay(day.value)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-sage-50/70 border-sage-300 text-sage-800 dark:bg-sage-950/40 dark:border-sage-800 dark:text-sage-300 shadow-2xs"
                      : "border-[var(--border-color)] bg-[var(--bg-surface-alt)] text-[var(--text-muted)] opacity-60 hover:opacity-100"
                  }`}
                >
                  <span>{day.label}</span>
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-sage-600 border-sage-600 text-white"
                        : "border-[var(--border-color)]"
                    }`}
                  >
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Column 2 & 3: Daily Slots & Holiday Management */}
        <div className="lg:col-span-2 space-y-6">
          {/* Daily Slots Manager */}
          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sage-600" />
                <h4 className="font-bold text-sm text-[var(--text-primary)]">
                  Daily Consultation Slots
                </h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sage-50 text-sage-700 dark:bg-sage-950/60 dark:text-sage-300 font-bold border border-sage-200 dark:border-sage-800">
                  {slots.length} Active Slots
                </span>
              </div>
            </div>

            {/* Presets Row */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="font-semibold text-[var(--text-muted)] text-[11px] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sage-600" /> Presets:
              </span>
              <button
                type="button"
                onClick={() => applyPreset("standard")}
                className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] font-medium transition-colors"
              >
                Standard (10:00–19:00, 1h)
              </button>
              <button
                type="button"
                onClick={() => applyPreset("morning")}
                className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] font-medium transition-colors"
              >
                Morning (09:00–12:30, 30m)
              </button>
              <button
                type="button"
                onClick={() => applyPreset("evening")}
                className="px-2.5 py-1 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-muted)] text-[var(--text-secondary)] font-medium transition-colors"
              >
                Evening (16:00–19:30, 30m)
              </button>
            </div>

            {/* Add Custom Slot */}
            <form onSubmit={handleAddSlot} className="flex gap-2">
              <input
                type="time"
                required
                value={newSlotTime}
                onChange={(e) => setNewSlotTime(e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-sage-600 hover:bg-sage-700 text-white font-bold text-xs transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Slot</span>
              </button>
            </form>

            {/* Slots Grid */}
            {slots.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-xl">
                No slots configured. Patients will not be able to book until slots are added.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 max-h-56 overflow-y-auto pr-1">
                {slots.map((slot) => {
                  let displayTime = slot;
                  try {
                    const [h, m] = slot.split(":");
                    const hours = parseInt(h, 10);
                    const ampm = hours >= 12 ? "PM" : "AM";
                    const h12 = hours % 12 || 12;
                    displayTime = `${h12}:${m} ${ampm}`;
                  } catch {}

                  return (
                    <div
                      key={slot}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-alt)] group hover:border-red-300 dark:hover:border-red-900 transition-colors"
                    >
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        {displayTime}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(slot)}
                        className="p-1 text-[var(--text-muted)] hover:text-red-500 transition-colors"
                        title="Remove Slot"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Blocked Dates / Holiday Management */}
          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <Ban className="w-4 h-4 text-rose-500" />
                <h4 className="font-bold text-sm text-[var(--text-primary)]">
                  Clinic Holidays & Blocked Dates ({blockedDates.length})
                </h4>
              </div>
            </div>

            <p className="text-xs text-[var(--text-muted)]">
              Block specific calendar dates (such as public holidays, doctor vacations, or clinic maintenance) to prevent all booking reservations on those days.
            </p>

            {/* Add Blocked Date Form */}
            <form onSubmit={handleAddBlockedDate} className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                min={todayStr}
                required
                value={newBlockDate}
                onChange={(e) => setNewBlockDate(e.target.value)}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
              <input
                type="text"
                placeholder="Reason (e.g., National Holiday, Doctor on Leave)"
                value={newBlockReason}
                onChange={(e) => setNewBlockReason(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[var(--border-color)] bg-[var(--bg-base)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-sage-500"
              />
              <button
                type="submit"
                className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shrink-0 shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Block Date</span>
              </button>
            </form>

            {/* Blocked Dates List */}
            {blockedDates.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {blockedDates.map((b) => (
                  <div
                    key={b.date}
                    className="p-3 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-rose-800 dark:text-rose-300">
                        {b.date}
                      </span>
                      <span className="text-[var(--text-secondary)] ml-2">
                        — {b.reason}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveBlockedDate(b.date)}
                      className="p-1 text-[var(--text-muted)] hover:text-rose-600 transition-colors"
                      title="Unblock date"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[var(--text-muted)] italic">
                No holidays or date blockouts scheduled.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
