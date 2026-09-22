"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/context/locale-context";
import { Reveal } from "@/components/motion/reveal";
import { MagneticButton } from "@/components/motion/magnetic-button";

export function Newsletter() {
  const { dict, locale } = useLocale();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (res.ok) {
      toast.success(locale === "ar" ? "تم الاشتراك بنجاح!" : "Subscribed successfully!");
      setEmail("");
    } else {
      toast.error(dict.common.error);
    }
  }

  return (
    <section className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_50%,rgba(217,169,74,0.1),transparent_65%)]" />
      <div className="mx-auto max-w-2xl px-6 text-center md:px-8">
        <Reveal>
          <h2 className="font-display text-3xl text-foreground md:text-4xl">
            {dict.home.newsletterTitle}
          </h2>
          <p className="mt-3 text-sm text-muted md:text-base">{dict.home.newsletterSub}</p>
        </Reveal>
        <Reveal delay={0.15}>
          <form onSubmit={handleSubmit} className="mx-auto mt-8 flex max-w-md gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={dict.home.newsletterPlaceholder}
              className="w-full flex-1 rounded-full border border-border bg-background-card px-5 py-3 text-sm text-foreground placeholder:text-muted focus:border-amber-400/60 focus:outline-none"
            />
            <MagneticButton
              type="submit"
              className="shrink-0 bg-amber-400 px-5 text-amber-950 hover:bg-amber-300 disabled:opacity-60"
            >
              {loading ? "..." : <Send size={16} />}
            </MagneticButton>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
