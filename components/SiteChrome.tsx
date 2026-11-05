"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CuraAiFloatingButton from "@/components/CuraAiFloatingButton";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname() || "";
  const isDoctorRoute = pathname.startsWith("/doctor");
  const isPatientRoute = pathname.startsWith("/patient");
  const isLoginRoute = pathname === "/login";

  // Dedicated portal layouts for Doctor Portal, Patient Portal, and Login
  if (isDoctorRoute || isPatientRoute || isLoginRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
      <CuraAiFloatingButton />
      <WhatsAppButton />
    </>
  );
}
