"use client";

import Link from "next/link";
import { Camera, MessageCircle, Phone, AtSign } from "lucide-react";
import { useLocale } from "@/context/locale-context";
import { Marquee } from "@/components/motion/marquee";
import { SITE } from "@/lib/site";

export function Footer() {
  const { dict } = useLocale();

  return (
    <footer className="relative mt-24 border-t border-border bg-background-elevated">
      <Marquee
        items={["تحف نحاسية", "ساعات وراديوهات قديمة", "خزف وزجاج", "مسابح كهرمان", "شحن آمن"]}
        className="border-b border-border py-4"
      />

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4 md:px-8">
        <div className="md:col-span-2">
          <Link href="/" className="font-display gold-gradient-text text-2xl font-bold">
            {SITE.name}
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-7 text-muted">{dict.footer.about}</p>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: Camera, href: "#" },
              { Icon: AtSign, href: `mailto:${SITE.email}` },
              { Icon: MessageCircle, href: SITE.whatsappHref },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-amber-400/60 hover:text-amber-300"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg text-foreground">{dict.footer.quickLinks}</h4>
          <ul className="flex flex-col gap-3 text-sm text-muted">
            <li><Link href="/collections" className="hover:text-amber-300">{dict.nav.collections}</Link></li>
            <li><Link href="/about" className="hover:text-amber-300">{dict.nav.about}</Link></li>
            <li><Link href="/contact" className="hover:text-amber-300">{dict.nav.contact}</Link></li>
            <li><Link href="/account" className="hover:text-amber-300">{dict.nav.account}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 font-display text-lg text-foreground">{dict.footer.customerCare}</h4>
          <ul className="flex flex-col gap-3 text-sm text-muted">
            <li><Link href="/contact" className="hover:text-amber-300">{dict.footer.shipping}</Link></li>
            <li><Link href="/contact" className="hover:text-amber-300">{dict.footer.returns}</Link></li>
            <li><Link href="/contact" className="hover:text-amber-300">{dict.footer.faq}</Link></li>
            <li className="flex items-center gap-2 pt-1 text-amber-300">
              <Phone size={14} /> <a href={SITE.phoneHref} dir="ltr">{SITE.phone}</a>
            </li>
            <li className="flex items-center gap-2 text-amber-300">
              <AtSign size={14} /> <a href={`mailto:${SITE.email}`} dir="ltr">{SITE.email}</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border px-6 py-6 text-center text-xs text-muted md:px-8">
        © {new Date().getFullYear()} {SITE.name} — {dict.footer.rights}
      </div>
    </footer>
  );
}
