"use client";

import { useMemo } from "react";
import {
  TrendingUp,
  Users,
  Heart,
  FileText,
  CheckCircle2,
  Calendar,
  Activity,
  AlertTriangle,
  Globe,
  PieChart,
} from "lucide-react";
import type { Appointment } from "@/lib/types/appointment";

type DoctorAnalyticsProps = {
  appointments: Appointment[];
};

export default function DoctorAnalytics({ appointments }: DoctorAnalyticsProps) {
  const totalBookings = appointments.length;

  const analysis = useMemo(() => {
    const conditionsMap: Record<string, number> = {};
    const ageBrackets = {
      Pediatric: 0,
      Youth: 0,
      Adult: 0,
      Senior: 0,
      Unspecified: 0,
    };
    const languages: Record<string, number> = {};
    const statusCounts = {
      Pending: 0,
      Confirmed: 0,
      Completed: 0,
      Cancelled: 0,
      Failed: 0,
    };
    let totalSeverityScore = 0;
    let totalLogsCount = 0;

    appointments.forEach((appt) => {
      // 1. Conditions
      const cond = appt.condition?.toLowerCase().trim() || "";
      let category = "General Consultation";
      if (
        cond.includes("skin") ||
        cond.includes("acne") ||
        cond.includes("rash") ||
        cond.includes("psoriasis") ||
        cond.includes("eczema")
      ) {
        category = "Skin & Dermatological";
      } else if (
        cond.includes("cough") ||
        cond.includes("cold") ||
        cond.includes("asthma") ||
        cond.includes("allergy") ||
        cond.includes("sinus")
      ) {
        category = "Allergies & Respiratory";
      } else if (
        cond.includes("hair") ||
        cond.includes("alopecia") ||
        cond.includes("scalp") ||
        cond.includes("fall")
      ) {
        category = "Hair & Trichology";
      } else if (
        cond.includes("stomach") ||
        cond.includes("digestion") ||
        cond.includes("acidity") ||
        cond.includes("gastric") ||
        cond.includes("constipation")
      ) {
        category = "Gastrointestinal";
      } else if (
        cond.includes("joint") ||
        cond.includes("pain") ||
        cond.includes("arthritis") ||
        cond.includes("rheumatism") ||
        cond.includes("back")
      ) {
        category = "Joints & Rheumatology";
      } else if (
        cond.includes("headache") ||
        cond.includes("migraine")
      ) {
        category = "Migraine & Neurological";
      } else if (cond) {
        category = appt.condition
          ? appt.condition.charAt(0).toUpperCase() + appt.condition.slice(1)
          : "General Consultation";
      }

      conditionsMap[category] = (conditionsMap[category] || 0) + 1;

      // 2. Age Profile
      if (appt.age) {
        const val = parseInt(appt.age, 10);
        if (isNaN(val)) {
          ageBrackets.Unspecified++;
        } else if (val < 13) {
          ageBrackets.Pediatric++;
        } else if (val < 25) {
          ageBrackets.Youth++;
        } else if (val < 60) {
          ageBrackets.Adult++;
        } else {
          ageBrackets.Senior++;
        }
      } else {
        ageBrackets.Unspecified++;
      }

      // 3. Languages
      const lang = appt.lang ? appt.lang.trim().toLowerCase() : "English";
      const normalizedLang =
        lang === "hi"
          ? "Hindi"
          : lang === "mr"
          ? "Marathi"
          : lang === "en" || lang === "english"
          ? "English"
          : lang.charAt(0).toUpperCase() + lang.slice(1);
      languages[normalizedLang] = (languages[normalizedLang] || 0) + 1;

      // 4. Status
      if (appt.status in statusCounts) {
        statusCounts[appt.status as keyof typeof statusCounts]++;
      }

      // 5. Progress logs average severity
      if (appt.progressLogs && Array.isArray(appt.progressLogs)) {
        appt.progressLogs.forEach((log) => {
          if (typeof log.rating === "number" && !isNaN(log.rating)) {
            totalSeverityScore += log.rating;
            totalLogsCount++;
          }
        });
      }
    });

    // Top conditions
    const sortedConditions = Object.entries(conditionsMap)
      .map(([name, count]) => ({
        name,
        count,
        percent: totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Languages
    const sortedLanguages = Object.entries(languages)
      .map(([name, count]) => ({
        name,
        count,
        percent: totalBookings > 0 ? Math.round((count / totalBookings) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    const activeCases = statusCounts.Pending + statusCounts.Confirmed;
    const completionRate =
      totalBookings > 0
        ? Math.round((statusCounts.Completed / totalBookings) * 100)
        : 0;
    const cancellationRate =
      totalBookings > 0
        ? Math.round((statusCounts.Cancelled / totalBookings) * 100)
        : 0;

    const avgSeverity =
      totalLogsCount > 0 ? (totalSeverityScore / totalLogsCount).toFixed(1) : null;

    return {
      sortedConditions,
      ageBrackets,
      sortedLanguages,
      statusCounts,
      activeCases,
      completionRate,
      cancellationRate,
      avgSeverity,
      totalLogsCount,
    };
  }, [appointments, totalBookings]);

  if (totalBookings === 0) {
    return (
      <div className="p-12 text-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-sage-50 text-sage-600 dark:bg-sage-950/60 dark:text-sage-300 flex items-center justify-center mx-auto">
          <PieChart className="w-6 h-6" />
        </div>
        <h3 className="font-bold text-base text-[var(--text-primary)]">
          No Clinical Analytics Available Yet
        </h3>
        <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
          As patients book online teleconsultations and complete appointments, genuine clinical statistics, demographics, and condition breakdowns will populate here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Visual KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: "Total Appointments",
            value: totalBookings,
            subtitle: "Lifetime patient bookings",
            icon: FileText,
            color: "text-sage-600 bg-sage-50 dark:bg-sage-950/60 dark:text-sage-300",
          },
          {
            title: "Active Consultations",
            value: analysis.activeCases,
            subtitle: "Pending & confirmed slots",
            icon: Activity,
            color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300",
          },
          {
            title: "Completed Treatments",
            value: analysis.statusCounts.Completed,
            subtitle: `${analysis.completionRate}% completion rate`,
            icon: CheckCircle2,
            color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300",
          },
          {
            title: "Cancellation Rate",
            value: `${analysis.cancellationRate}%`,
            subtitle: `${analysis.statusCounts.Cancelled} total cancelled`,
            icon: AlertTriangle,
            color: "text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-300",
          },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  {kpi.title}
                </p>
                <h4 className="text-2xl font-bold mt-1 text-[var(--text-primary)]">
                  {kpi.value}
                </h4>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                  {kpi.subtitle}
                </p>
              </div>
              <div className={`p-3 rounded-2xl ${kpi.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Conditions Treated */}
        <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
            <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>Common Homeopathic Clinical Cases</span>
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sage-50 text-sage-700 dark:bg-sage-950/60 dark:text-sage-300 border border-sage-200 dark:border-sage-800">
              Verified Data
            </span>
          </div>

          <div className="space-y-3.5">
            {analysis.sortedConditions.slice(0, 6).map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[var(--text-primary)]">{item.name}</span>
                  <span className="text-[var(--text-secondary)] font-mono">
                    {item.count} {item.count === 1 ? "case" : "cases"} ({item.percent}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-[var(--bg-muted)] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-sage-600 transition-all duration-700 ease-out"
                    style={{ width: `${Math.max(item.percent, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Demographics & Patient Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Age Brackets Card */}
          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-color)] mb-4">
              <TrendingUp className="w-4 h-4 text-sage-600" />
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Patient Age Profile
              </h3>
            </div>

            <div className="space-y-3 flex-1">
              {[
                { label: "Pediatric (<13)", val: analysis.ageBrackets.Pediatric, color: "bg-teal-500" },
                { label: "Youth (13–24)", val: analysis.ageBrackets.Youth, color: "bg-sky-500" },
                { label: "Adult (25–59)", val: analysis.ageBrackets.Adult, color: "bg-sage-600" },
                { label: "Senior (60+)", val: analysis.ageBrackets.Senior, color: "bg-amber-500" },
              ].map((bracket, idx) => {
                const totalReportedAge =
                  analysis.ageBrackets.Pediatric +
                  analysis.ageBrackets.Youth +
                  analysis.ageBrackets.Adult +
                  analysis.ageBrackets.Senior;
                const pct =
                  totalReportedAge > 0
                    ? Math.round((bracket.val / totalReportedAge) * 100)
                    : 0;

                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold text-[var(--text-secondary)]">
                      <span>{bracket.label}</span>
                      <span className="font-mono">{bracket.val}</span>
                    </div>
                    <div className="h-1.5 w-full bg-[var(--bg-muted)] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${bracket.color}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Languages Breakdown Card */}
          <div className="p-6 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-xs flex flex-col justify-between">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--border-color)] mb-4">
              <Globe className="w-4 h-4 text-sage-600" />
              <h3 className="font-bold text-sm text-[var(--text-primary)]">
                Language Distribution
              </h3>
            </div>

            <div className="space-y-3.5 flex-1">
              {analysis.sortedLanguages.map((lang, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-[var(--text-primary)]">{lang.name}</span>
                    <span className="text-[var(--text-muted)] font-mono">{lang.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[var(--bg-muted)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sage-500"
                      style={{ width: `${Math.max(lang.percent, 3)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
