import type { Metadata } from "next";
import DoctorGuard from "@/components/doctor/DoctorGuard";
import DoctorHeader from "@/components/doctor/DoctorHeader";

export const metadata: Metadata = {
  title: "Doctor Dashboard",
  robots: { index: false, follow: false },
};

export default function DoctorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DoctorGuard>
      <div
        className="min-h-screen"
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <DoctorHeader />
        {children}
      </div>
    </DoctorGuard>
  );
}
