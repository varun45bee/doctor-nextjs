// app/intake/page.jsx
// ─────────────────────────────────────────────────────────────────────────────
// Patient Intake Page
// Route: /intake
// ─────────────────────────────────────────────────────────────────────────────

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PatientChat from "@/components/vitaintake/PatientChat";

export default function IntakePage() {
  const router = useRouter();

  // When the AI finishes and generates a report,
  // store it in localStorage so the doctor page can read it.
  function handleReportReady(report, navigate = false) {
    try {
      localStorage.setItem("vitaintake_report", JSON.stringify(report));
    } catch {
      // fallback: sessionStorage
      sessionStorage.setItem("vitaintake_report", JSON.stringify(report));
    }
    if (navigate) {
      router.push("/doctor-dashboard");
    }
  }

  return <PatientChat onReportReady={handleReportReady} />;
}
