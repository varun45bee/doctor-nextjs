"use client";

import { useAppointment } from "@/lib/appointment-context";

export default function CaseStudyConsultationButton() {
  const { openAppointment } = useAppointment();

  return (
    <button
      type="button"
      onClick={() => openAppointment()}
      className="inline-flex w-full sm:w-auto justify-center items-center gap-2 bg-white text-sage-700 px-8 py-3.5 rounded-full font-semibold hover:bg-cream-50 transition-all hover:shadow-md hover:-translate-y-0.5"
    >
      Book a Consultation
    </button>
  );
}
