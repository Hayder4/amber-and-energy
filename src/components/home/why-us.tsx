"use client";

import { ShieldCheck, Gem, Truck } from "lucide-react";
import { useLocale } from "@/context/locale-context";
import { Reveal, RevealGroup, revealItemVariants } from "@/components/motion/reveal";
import { motion } from "framer-motion";

export function WhyUs() {
  const { dict } = useLocale();
  const items = [
    { icon: ShieldCheck, title: dict.home.whyUs1Title, desc: dict.home.whyUs1Desc },
    { icon: Gem, title: dict.home.whyUs2Title, desc: dict.home.whyUs2Desc },
    { icon: Truck, title: dict.home.whyUs3Title, desc: dict.home.whyUs3Desc },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
      <Reveal className="mb-12 text-center">
        <h2 className="font-display text-3xl text-foreground md:text-4xl">{dict.home.whyUs}</h2>
      </Reveal>
      <RevealGroup className="grid gap-6 md:grid-cols-3" stagger={0.15}>
        {items.map(({ icon: Icon, title, desc }) => (
          <motion.div
            key={title}
            variants={revealItemVariants}
            whileHover={{ y: -6 }}
            className="group rounded-3xl card-border bg-background-card p-8 text-center transition-colors hover:border-amber-500/50"
          >
            <span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-300 transition-colors group-hover:bg-amber-400 group-hover:text-amber-950">
              <Icon size={24} />
            </span>
            <h3 className="font-display mb-2 text-xl text-foreground">{title}</h3>
            <p className="text-sm leading-7 text-muted">{desc}</p>
          </motion.div>
        ))}
      </RevealGroup>
    </section>
  );
}
