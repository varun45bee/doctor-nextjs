"use client";

import { createContext, useCallback, useContext, useState } from "react";
import AppointmentModal from "@/components/AppointmentModal";
import AiIntakeModal from "@/components/AiIntakeModal";

type AppointmentOptions = {
  condition?: string;
};

type AppointmentContextType = {
  openAppointment: (options?: AppointmentOptions) => void;
  closeAppointment: () => void;
  openAiIntake: () => void;
  closeAiIntake: () => void;
  isAiIntakeOpen: boolean;
};

const AppointmentContext = createContext<AppointmentContextType | null>(null);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultCondition, setDefaultCondition] = useState("");
  const [isAiIntakeOpen, setIsAiIntakeOpen] = useState(false);

  const openAppointment = useCallback((options?: AppointmentOptions) => {
    setDefaultCondition(options?.condition ?? "");
    setIsOpen(true);
  }, []);

  const closeAppointment = useCallback(() => {
    setIsOpen(false);
    setDefaultCondition("");
  }, []);

  const openAiIntake = useCallback(() => {
    setIsAiIntakeOpen(true);
  }, []);

  const closeAiIntake = useCallback(() => {
    setIsAiIntakeOpen(false);
  }, []);

  return (
    <AppointmentContext.Provider
      value={{ openAppointment, closeAppointment, openAiIntake, closeAiIntake, isAiIntakeOpen }}
    >
      {children}
      <AppointmentModal
        isOpen={isOpen}
        onClose={closeAppointment}
        defaultCondition={defaultCondition}
      />
      <AiIntakeModal
        isOpen={isAiIntakeOpen}
        onClose={closeAiIntake}
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
