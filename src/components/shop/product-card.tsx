"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Gem } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/context/locale-context";
import { useCartStore } from "@/lib/cart-store";
import { PriceTag } from "@/components/shop/price-tag";
import { StarRating } from "@/components/shop/star-rating";
import type { ProductPricing, SerializedProduct } from "@/lib/types";
import { revealItemVariants } from "@/components/motion/reveal";

export function ProductCard({
  product,
  pricing,
}: {
  product: SerializedProduct;
  pricing: ProductPricing;
}) {
  const { locale, dict, pick } = useLocale();
  const [hovered, setHovered] = useState(false);
  const add = useCartStore((s) => s.add);

  const name = pick(product.name, product.nameEn);
  const outOfStock = product.stock <= 0;

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    add(
      {
        productId: product.id,
        slug: product.slug,
        name,
        nameEn: product.nameEn,
        image: product.images[0] ?? null,
        price: pricing.price,
        stock: product.stock,
      },
      1
    );
    toast.success(locale === "ar" ? `تمت إضافة "${name}" إلى السلة` : `Added "${name}" to cart`);
  }

  return (
    <motion.div variants={revealItemVariants}>
      <Link
        href={`/products/${product.slug}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl card-border bg-background-card transition-colors hover:border-amber-500/50"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-square overflow-hidden bg-amber-950/40">
          <Image
            src={product.images[0] ?? "/images/placeholder.svg"}
            alt={name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className={`object-cover transition-all duration-700 ease-out ${
              hovered ? "scale-110 opacity-0" : "scale-100 opacity-100"
            }`}
          />
          {product.images[1] ? (
            <Image
              src={product.images[1]}
              alt={name}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
              className={`object-cover transition-all duration-700 ease-out ${
                hovered ? "scale-110 opacity-100" : "scale-100 opacity-0"
              }`}
            />
          ) : null}

          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
            <div className="flex flex-col gap-1.5">
              {product.isNew && (
                <span className="rounded-full bg-emerald-500/90 px-2.5 py-1 text-[11px] font-bold text-white">
                  {dict.product.new}
                </span>
              )}
              {pricing.onSale && (
                <span className="rounded-full bg-cherry-500/90 px-2.5 py-1 text-[11px] font-bold text-white">
                  {pricing.discountPercent > 0 ? `-${pricing.discountPercent}%` : dict.product.sale}
                </span>
              )}
              {product.isUnique && (
                <span className="flex items-center gap-1 rounded-full bg-amber-950/80 px-2.5 py-1 text-[11px] font-bold text-amber-300 backdrop-blur">
                  <Gem size={11} /> {locale === "ar" ? "قطعة فريدة" : "1 of 1"}
                </span>
              )}
            </div>
          </div>

          <motion.button
            onClick={handleAdd}
            disabled={outOfStock}
            initial={{ y: 56, opacity: 0 }}
            animate={hovered && !outOfStock ? { y: 0, opacity: 1 } : { y: 56, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-3 bottom-3 z-10 flex items-center justify-center gap-2 rounded-full bg-amber-400 py-2.5 text-sm font-bold text-amber-950 shadow-lg hover:bg-amber-300 disabled:cursor-not-allowed"
          >
            <ShoppingBag size={16} />
            {dict.product.addToCart}
          </motion.button>

          {outOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="rounded-full border border-amber-500/40 px-3 py-1 text-xs text-amber-200">
                {dict.product.outOfStock}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <h3 className="line-clamp-1 font-display text-base text-foreground">{name}</h3>
          {product.reviewsCount > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="text-xs text-muted">({product.reviewsCount})</span>
            </div>
          )}
          <div className="mt-auto pt-1">
            <PriceTag price={pricing.price} originalPrice={pricing.originalPrice} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
