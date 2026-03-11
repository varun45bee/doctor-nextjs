// app/doctor-dashboard/page.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Doctor Dashboard Page
// Route: /doctor-dashboard
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useEffect, useState } from "react";
import DoctorDashboard from "@/components/vitaintake/DoctorDashboard";

export default function DoctorDashboardPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load report from storage (set by the intake page)
    try {
      const stored =
        localStorage.getItem("vitaintake_report") ||
        sessionStorage.getItem("vitaintake_report");
      if (stored) {
        setReport(JSON.parse(stored));
      }
    } catch {
      // ignore parse errors
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f4f7f0",
          fontFamily: "'Lora', serif",
          color: "#5a7a5a",
          fontSize: 16,
        }}
      >
        Loading case report…
      </div>
    );
  }

  return <DoctorDashboard report={report} />;
}
