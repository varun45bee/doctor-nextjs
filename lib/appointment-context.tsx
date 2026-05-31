"use client";

import { createContext, useCallback, useContext, useState } from "react";
import AppointmentModal from "@/components/AppointmentModal";

type AppointmentOptions = {
  condition?: string;
};

type AppointmentContextType = {
  openAppointment: (options?: AppointmentOptions) => void;
  closeAppointment: () => void;
};

const AppointmentContext = createContext<AppointmentContextType | null>(null);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultCondition, setDefaultCondition] = useState("");

  const openAppointment = useCallback((options?: AppointmentOptions) => {
    setDefaultCondition(options?.condition ?? "");
    setIsOpen(true);
  }, []);

  const closeAppointment = useCallback(() => {
    setIsOpen(false);
    setDefaultCondition("");
  }, []);

  return (
    <AppointmentContext.Provider value={{ openAppointment, closeAppointment }}>
      {children}
      <AppointmentModal
        isOpen={isOpen}
        onClose={closeAppointment}
        defaultCondition={defaultCondition}
      />
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const ctx = useContext(AppointmentContext);
  if (!ctx) {
    throw new Error("useAppointment must be used within AppointmentProvider");
  }
  return ctx;
}
