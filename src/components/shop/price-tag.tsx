"use client";

import { useLocale } from "@/context/locale-context";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function PriceTag({
  price,
  originalPrice,
  size = "md",
  className,
}: {
  price: number;
  originalPrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const { locale } = useLocale();
  const sizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl md:text-3xl",
  };
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      <span className={cn("font-semibold text-amber-300", sizes[size])}>
        {formatPrice(price, locale)}
      </span>
      {originalPrice ? (
        <span className="text-muted-2 text-sm text-muted line-through opacity-60">
          {formatPrice(originalPrice, locale)}
        </span>
      ) : null}
    </span>
  );
}
