import type { Metadata } from "next";
import { Cairo, Aref_Ruqaa, Cormorant_Garamond } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Providers } from "@/components/providers";
import { getSession } from "@/lib/auth";
import type { Locale } from "@/lib/dictionary";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const arefRuqaa = Aref_Ruqaa({
  variable: "--font-aref-ruqaa",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Amberandenergy — متجر أنتيك",
  description:
    "Amberandenergy — متجر أنتيك صغير لعدي الخاقاني: تحف نحاسية، ساعات وراديوهات قديمة، خزف، ومسابح كهرمان.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("ae_locale")?.value === "en" ? "en" : "ar") as Locale;
  const session = await getSession();
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${cairo.variable} ${arefRuqaa.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers
          locale={locale}
          user={
            session
              ? { id: session.sub, name: session.name, email: session.email, role: session.role }
              : null
          }
        >
          {children}
        </Providers>
      </body>
    </html>
  );
}
