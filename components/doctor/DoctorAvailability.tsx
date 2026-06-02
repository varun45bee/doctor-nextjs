"use client";

import { useEffect, useState } from "react";
import { Clock, Plus, Trash2, Save, CheckCircle, Calendar } from "lucide-react";
import { fetchAvailabilitySettings, saveAvailabilitySettings, type AvailabilitySettings } from "@/lib/firestore/availability";

export default function DoctorAvailability() {
  const [weeklyDays, setWeeklyDays] = useState<number[]>([1, 2, 3, 4, 5, 6]);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Input state for adding new slot
  const [newSlotTime, setNewSlotTime] = useState("");

  const DAYS_OF_WEEK = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ];

  useEffect(() => {
    async function loadSettings() {
      setLoading(true);
      try {
        const data = await fetchAvailabilitySettings();
        setWeeklyDays(data.weeklyDays);
        // Sort slots chronologically
        setSlots([...data.slots].sort((a, b) => a.localeCompare(b)));
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

  const handleSave = async () => {
    setSaving(true);
    setSuccess(false);
    setError("");
    try {
      await saveAvailabilitySettings({ weeklyDays, slots });
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
      <div className="p-8 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
        <Clock className="w-8 h-8 animate-spin mx-auto mb-3 text-sage-500" />
        Loading availability configurations...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 page-enter">
      {/* Weekly active days */}
      <div
        className="p-6 rounded-2xl border flex flex-col space-y-4"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center gap-2 border-b pb-3 mb-2" style={{ borderColor: "var(--border-color)" }}>
          <Calendar className="w-5 h-5 text-sage-500" />
          <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
            Working Days
          </h3>
        </div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Select the days of the week patients are allowed to book appointments.
        </p>

        <div className="space-y-2 pt-2">
          {DAYS_OF_WEEK.map((day) => {
            const isActive = weeklyDays.includes(day.value);
            return (
              <button
                key={day.value}
                type="button"
                onClick={() => handleToggleDay(day.value)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-sage-50 border-sage-300 dark:bg-sage-950/20 dark:border-sage-800 text-sage-700 dark:text-sage-300"
                    : "border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/20 text-zinc-500"
                }`}
              >
                <span>{day.label}</span>
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                    isActive ? "bg-sage-600 border-sage-600 text-white" : "border-zinc-300 dark:border-zinc-700"
                  }`}
                >
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Slots Manager */}
      <div
        className="lg:col-span-2 p-6 rounded-2xl border flex flex-col space-y-4"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center justify-between border-b pb-3 mb-2" style={{ borderColor: "var(--border-color)" }}>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sage-500" />
            <h3 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
              Daily Consultation Slots
            </h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-sage-50 dark:bg-sage-900 border font-semibold text-sage-600 dark:text-sage-400" style={{ borderColor: "var(--border-color)" }}>
            {slots.length} Slots
          </span>
        </div>

        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Add or remove the specific slot times you support during working hours.
        </p>

        {/* Add slot form */}
        <form onSubmit={handleAddSlot} className="flex gap-2 pt-2">
          <input
            type="time"
            required
            value={newSlotTime}
            onChange={(e) => setNewSlotTime(e.target.value)}
            className="px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-sage-500"
          />
          <button
            type="submit"
            className="bg-sage-600 hover:bg-sage-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Slot
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-xs font-semibold">{error}</p>
        )}

        {/* Slots Grid */}
        {slots.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-zinc-400 dark:text-zinc-600 border border-dashed rounded-xl">
            <Clock className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-sm font-medium">No Slots Added</p>
            <p className="text-xs">Add time slots using the form above to let patients book.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 max-h-[300px] overflow-y-auto pr-1">
            {slots.map((slot) => {
              // Format time to 12 hour AM/PM for neat display
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
                  className="flex items-center justify-between p-2.5 rounded-xl border group hover:border-red-200 dark:hover:border-red-950 transition-all"
                  style={{ borderColor: "var(--border-color)", backgroundColor: "var(--bg-surface-alt)" }}
                >
                  <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{displayTime}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(slot)}
                    className="p-1 text-zinc-400 hover:text-red-500 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Global actions */}
        <div className="border-t pt-4 flex items-center justify-between" style={{ borderColor: "var(--border-color)" }}>
          {success && (
            <span className="flex items-center gap-1.5 text-xs text-green-600 font-semibold">
              <CheckCircle className="w-4 h-4" /> Availability configuration updated!
            </span>
          )}
          <div className="flex-1"></div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-sage-600 hover:bg-sage-700 disabled:opacity-65 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save Availability"}
          </button>
        </div>
      </div>
    </div>
  );
}
