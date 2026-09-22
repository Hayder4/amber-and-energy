"use client";

import { useLocale } from "@/context/locale-context";

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  return (
    <button
      onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
      className={`flex h-9 min-w-9 items-center justify-center rounded-full border border-border px-2.5 text-xs font-bold tracking-wide text-muted transition-colors hover:border-amber-400/60 hover:text-amber-300 ${className ?? ""}`}
      aria-label="Toggle language"
    >
      {locale === "ar" ? "EN" : "AR"}
    </button>
  );
}
