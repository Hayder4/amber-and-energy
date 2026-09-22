"use client";

import { Toaster } from "sonner";
import { LocaleProvider } from "@/context/locale-context";
import { AuthProvider, type AuthUser } from "@/context/auth-context";
import type { Locale } from "@/lib/dictionary";

export function Providers({
  locale,
  user,
  children,
}: {
  locale: Locale;
  user: AuthUser | null;
  children: React.ReactNode;
}) {
  return (
    <LocaleProvider locale={locale}>
      <AuthProvider initialUser={user}>
        {children}
        <Toaster
          position={locale === "ar" ? "top-left" : "top-right"}
          dir={locale === "ar" ? "rtl" : "ltr"}
          theme="dark"
          toastOptions={{
            style: {
              background: "#17130c",
              border: "1px solid rgba(217,169,74,0.32)",
              color: "#f3e9d6",
            },
          }}
        />
      </AuthProvider>
    </LocaleProvider>
  );
}
