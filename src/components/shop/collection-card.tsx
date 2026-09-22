"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocale } from "@/context/locale-context";
import { revealItemVariants } from "@/components/motion/reveal";

export function CollectionCard({
  slug,
  name,
  nameEn,
  image,
  count,
  size = "md",
}: {
  slug: string;
  name: string;
  nameEn?: string | null;
  image: string | null;
  count?: number;
  size?: "sm" | "md" | "lg";
}) {
  const { dir, pick, locale } = useLocale();
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;
  const heights = { sm: "aspect-[4/3]", md: "aspect-[4/3] md:aspect-[16/11]", lg: "aspect-[16/9]" };

  return (
    <motion.div variants={revealItemVariants}>
      <Link
        href={`/collections/${slug}`}
        className={`group relative block overflow-hidden rounded-3xl card-border ${heights[size]}`}
      >
        <Image
          src={image ?? "/images/placeholder.svg"}
          alt={pick(name, nameEn)}
          fill
          sizes="(min-width: 1024px) 33vw, 100vw"
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-5 md:p-7">
          <div>
            {typeof count === "number" && (
              <span className="text-xs tracking-[0.2em] text-amber-300/80 uppercase">
                {locale === "ar" ? `${count} قطعة` : `${count} pieces`}
              </span>
            )}
            <h3 className="font-display text-xl text-foreground md:text-2xl">{pick(name, nameEn)}</h3>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-amber-400/40 bg-black/40 text-amber-300 transition-all duration-300 group-hover:bg-amber-400 group-hover:text-amber-950">
            <Arrow size={16} />
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
