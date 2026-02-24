"use client";
import React, { createContext, useContext, useState } from "react";
import { translations, Locale } from "./translations";

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: typeof translations.en;
}>({ locale: "en", setLocale: () => {}, t: translations.en });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  return (
    <LanguageContext.Provider
      value={{ locale, setLocale, t: translations[locale] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
