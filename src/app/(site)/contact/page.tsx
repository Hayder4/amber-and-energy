"use client";

import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/context/locale-context";
import { Reveal } from "@/components/motion/reveal";
import { MagneticButton } from "@/components/motion/magnetic-button";

export default function ContactPage() {
  const { dict, locale } = useLocale();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setForm({ name: "", email: "", message: "" });
      toast.success(locale === "ar" ? "تم إرسال رسالتك، سنرد عليك قريبًا" : "Message sent, we'll reply soon");
    }, 700);
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-16 md:px-8 lg:grid-cols-2">
      <Reveal>
        <p className="mb-3 text-xs font-medium tracking-[0.3em] text-amber-400 uppercase">
          {dict.nav.contact}
        </p>
        <h1 className="font-display text-4xl text-foreground md:text-5xl">
          {locale === "ar" ? "تواصل معنا" : "Get in Touch"}
        </h1>
        <p className="mt-5 max-w-md text-sm leading-8 text-muted">
          {locale === "ar"
            ? "لديك استفسار عن قطعة معينة أو ترغب بتقييم قطعة كهرمان تملكها؟ فريقنا جاهز لمساعدتك."
            : "Have a question about a piece, or want an amber item appraised? Our team is ready to help."}
        </p>

        <div className="mt-8 flex flex-col gap-4">
          {[
            { icon: Phone, text: "+966 5X XXX XXXX", dir: "ltr" as const },
            { icon: Mail, text: "hello@amberandenergy.com", dir: "ltr" as const },
            { icon: MapPin, text: locale === "ar" ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia", dir: undefined },
          ].map(({ icon: Icon, text, dir }) => (
            <div key={text} className="flex items-center gap-3 text-sm text-foreground/90">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-amber-300">
                <Icon size={16} />
              </span>
              <span dir={dir}>{text}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.15}>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-3xl card-border bg-background-card p-7"
        >
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">{dict.auth.name}</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-amber-400/60 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">{dict.auth.email}</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-amber-400/60 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted">
              {locale === "ar" ? "رسالتك" : "Your Message"}
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground focus:border-amber-400/60 focus:outline-none"
            />
          </div>
          <MagneticButton
            type="submit"
            className="mt-2 w-full bg-amber-400 text-amber-950 hover:bg-amber-300 disabled:opacity-60"
          >
            {sending ? dict.common.loading : <>{locale === "ar" ? "إرسال الرسالة" : "Send Message"} <Send size={15} /></>}
          </MagneticButton>
        </form>
      </Reveal>
    </div>
  );
}
