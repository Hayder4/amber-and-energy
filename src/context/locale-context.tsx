"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import { useRouter } from "next/navigation";
import { dictionary, type Dictionary, type Locale } from "@/lib/dictionary";

interface LocaleContextValue {
  locale: Locale;
  dict: Dictionary;
  dir: "rtl" | "ltr";
  setLocale: (locale: Locale) => void;
  pick: <T extends string | null | undefined>(ar: T, en: T | undefined | null) => T;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();

  const setLocale = useCallback(
    (next: Locale) => {
      document.cookie = `ae_locale=${next}; path=/; max-age=31536000; samesite=lax`;
      router.refresh();
    },
    [router]
  );

  const value = useMemo<LocaleContextValue>(() => {
    const pick = <T extends string | null | undefined>(ar: T, en: T | undefined | null): T =>
      (locale === "en" && en ? en : ar) as T;
    return {
      locale,
      dict: dictionary[locale],
      dir: locale === "ar" ? "rtl" : "ltr",
      setLocale,
      pick,
    };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
