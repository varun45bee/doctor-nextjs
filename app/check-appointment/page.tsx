"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { getAppointmentByPhone } from "@/lib/appointment-lookup";
import {
  getStatusColor,
  getStatusLabel,
} from "@/lib/notifications/patient-message";
import type { AppointmentStatus } from "@/lib/types/appointment";

export default function CheckAppointmentPage() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    patientName: string;
    patientPhone: string;
    appointmentDate: string;
    appointmentTime: string;
    status: AppointmentStatus;
  } | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotFound(false);
    setResult(null);

    try {
      const data = await getAppointmentByPhone(phone);
      if (data) {
        setResult(data);
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    }

    setLoading(false);
  };

  const formatDate = (date: string) => {
    if (!date) return "—";
    try {
      return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  return (
    <div className="pt-24 min-h-screen px-4 sm:px-6 pb-16">
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm mb-6 hover:text-sage-600 transition-colors"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1
          className="font-serif text-3xl mb-2"
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            color: "var(--text-primary)",
          }}
        >
          Check Appointment Status
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          Enter the phone number you used when booking to see if your request
          was accepted.
        </p>

        <form onSubmit={handleCheck} className="space-y-4 mb-8">
          <input
            required
            type="tel"
            placeholder="Your phone number (+91 XXXXX XXXXX)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sage-400"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sage-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 font-medium hover:bg-sage-600 transition-colors disabled:opacity-60"
          >
            <Search className="w-4 h-4" />
            {loading ? "Checking..." : "Check Status"}
          </button>
        </form>

        {notFound && (
          <div
            className="p-5 rounded-xl border text-center"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              No appointment found for this number. Please check the number or
              contact the clinic.
            </p>
            <a
              href="https://wa.me/919359875511?text=Hello%2C%20I%20would%20like%20to%20check%20my%20appointment%20status."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sage-600 text-sm underline"
            >
              Contact on WhatsApp
            </a>
          </div>
        )}

        {result && (
          <div
            className="p-6 rounded-2xl border space-y-4"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-color)",
            }}
          >
            <div
              className={`p-4 rounded-xl border text-center font-medium ${getStatusColor(result.status)}`}
            >
              {getStatusLabel(result.status)}
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-sage-500" />
                <span style={{ color: "var(--text-primary)" }}>
                  {result.patientName}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-sage-500" />
                <span style={{ color: "var(--text-secondary)" }}>
                  {formatDate(result.appointmentDate)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-sage-500" />
                <span style={{ color: "var(--text-secondary)" }}>
                  {result.appointmentTime || "—"}
                </span>
              </div>
            </div>

            {result.status === "Pending" && (
              <p className="text-xs text-center pt-2" style={{ color: "var(--text-muted)" }}>
                Your request is being reviewed. You will also receive an email
                once confirmed.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
