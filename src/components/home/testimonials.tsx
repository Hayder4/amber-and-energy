"use client";

import { Quote } from "lucide-react";
import { useLocale } from "@/context/locale-context";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/motion/reveal";
import { StarRating } from "@/components/shop/star-rating";
import { motion } from "framer-motion";

const testimonialsAr = [
  {
    name: "خالد المطيري",
    role: "هاوي اقتناء",
    text: "تعاملت مع أمبر آند إنرجي لأكثر من قطعة، والصدق في وصف القطعة ودرجة الكهرمان شيء نادر بهذا المجال. مسبحة الفاتوران التي اقتنيتها فاقت التوقعات.",
  },
  {
    name: "سارة العتيبي",
    role: "عميلة",
    text: "الخاتم وصل بتغليف فخم جدًا وسريع، واللون طابق الصور تمامًا. تجربة تسوق راقية من الألف إلى الياء.",
  },
  {
    name: "أبو فيصل",
    role: "جامع كهرمان منذ 20 عامًا",
    text: "من القلائل الذين يفرّقون فعليًا بين الكهرمان الطبيعي والفاتوران والتقليد. القطعة النادرة التي اشتريتها تستحق كل ريال.",
  },
];

const testimonialsEn = [
  {
    name: "Khaled Al-Mutairi",
    role: "Collector",
    text: "I've bought several pieces from Amber & Energy — the honesty in describing amber grade is rare in this market. The faturan tasbih exceeded expectations.",
  },
  {
    name: "Sara Al-Otaibi",
    role: "Customer",
    text: "The ring arrived in beautiful packaging, fast, and matched the photos exactly. A genuinely refined shopping experience.",
  },
  {
    name: "Abu Faisal",
    role: "Amber collector for 20 years",
    text: "Few sellers can truly tell natural amber from faturan from imitation. The rare piece I bought was worth every riyal.",
  },
];

export function Testimonials() {
  const { dict, locale } = useLocale();
  const items = locale === "ar" ? testimonialsAr : testimonialsEn;

  return (
    <section className="bg-background-elevated py-20">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <Reveal className="mb-12 text-center">
          <h2 className="font-display text-3xl text-foreground md:text-4xl">
            {dict.home.testimonialsTitle}
          </h2>
        </Reveal>
        <RevealGroup className="grid gap-6 md:grid-cols-3" stagger={0.15}>
          {items.map((t) => (
            <motion.div
              key={t.name}
              variants={revealItemVariants}
              className="flex flex-col gap-4 rounded-3xl card-border bg-background-card p-7"
            >
              <Quote className="text-amber-500/50" size={28} />
              <p className="flex-1 text-sm leading-8 text-foreground/90">{t.text}</p>
              <div className="flex items-center justify-between border-t border-border pt-4">
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
                <StarRating rating={5} />
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
