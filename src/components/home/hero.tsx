"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { useLocale } from "@/context/locale-context";
import { MagneticButton } from "@/components/motion/magnetic-button";

const wordVariants = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.06 * i, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export function Hero() {
  const { dict, dir } = useLocale();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const sectionRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const rotate = useTransform(sx, [-40, 40], [-6, 6]);
  const translateY = useTransform(sy, [-40, 40], [-14, 14]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 80);
    my.set(((e.clientY - rect.top) / rect.height - 0.5) * 80);
  }

  const words = dict.hero.title.split(" ");

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      className="relative isolate flex min-h-[92vh] items-center overflow-hidden bg-background"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 start-[-10%] h-[36rem] w-[36rem] rounded-full bg-amber-700/20 blur-[110px] animate-float-slow" />
        <div className="absolute bottom-[-14rem] end-[-6%] h-[30rem] w-[30rem] rounded-full bg-amber-500/15 blur-[110px] animate-float" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(217,169,74,0.08),transparent_60%)]" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-24 md:px-8 lg:grid-cols-2 lg:gap-8">
        <div className="relative z-10 text-center lg:text-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/5 px-4 py-1.5 text-xs font-medium tracking-widest text-amber-300 uppercase"
          >
            <Sparkles size={13} /> {dict.hero.eyebrow}
          </motion.div>

          <h1 className="font-display flex flex-wrap justify-center gap-x-3 text-4xl leading-[1.25] text-foreground sm:text-5xl lg:justify-start lg:text-6xl">
            {words.map((w, i) => (
              <motion.span
                key={i}
                custom={i}
                initial="hidden"
                animate="show"
                variants={wordVariants}
                className={i % 3 === 1 ? "gold-gradient-text" : undefined}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="mx-auto mt-6 max-w-lg text-base leading-8 text-muted lg:mx-0"
          >
            {dict.hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <Link href="/collections">
              <MagneticButton className="bg-amber-400 text-amber-950 hover:bg-amber-300">
                {dict.hero.cta}
                <Arrow size={16} />
              </MagneticButton>
            </Link>
            <Link
              href="/about"
              className="text-sm font-semibold text-foreground/85 underline decoration-amber-500/50 decoration-2 underline-offset-8 transition-colors hover:text-amber-300"
            >
              {dict.hero.ctaSecondary}
            </Link>
          </motion.div>

        </div>

        <motion.div
          style={{ rotate, y: translateY }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto aspect-square w-full max-w-md lg:max-w-lg"
        >
          <div className="absolute inset-0 rounded-full bg-amber-500/10 blur-3xl" />
          <Image
            src="/images/hero-gem.svg"
            alt="Amberandenergy"
            fill
            priority
            className="relative z-10 object-contain drop-shadow-2xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
