"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Gem, ShieldCheck, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useLocale } from "@/context/locale-context";
import { useCartStore } from "@/lib/cart-store";
import { useRouter } from "next/navigation";
import { PriceTag } from "@/components/shop/price-tag";
import { StarRating } from "@/components/shop/star-rating";
import { ProductGallery } from "@/components/shop/product-gallery";
import { Reveal } from "@/components/motion/reveal";
import { MagneticButton } from "@/components/motion/magnetic-button";
import type { ProductPricing, SerializedProduct } from "@/lib/types";

export function ProductDetail({
  product,
  pricing,
}: {
  product: SerializedProduct;
  pricing: ProductPricing;
}) {
  const { dict, pick, locale } = useLocale();
  const [qty, setQty] = useState(1);
  const add = useCartStore((s) => s.add);
  const router = useRouter();

  const name = pick(product.name, product.nameEn);
  const description = pick(product.description, product.descriptionEn);
  const outOfStock = product.stock <= 0;

  function addToCart() {
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
      qty
    );
    toast.success(locale === "ar" ? `تمت إضافة "${name}" إلى السلة` : `Added "${name}" to cart`);
  }

  function buyNow() {
    addToCart();
    router.push("/checkout");
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: name, url });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(locale === "ar" ? "تم نسخ الرابط" : "Link copied");
    }
  }

  const details: [string, string | number | null][] = [
    [dict.product.material, product.material],
    [dict.product.origin, product.origin],
    [dict.product.weight, product.weightGrams ? `${product.weightGrams} ${locale === "ar" ? "جم" : "g"}` : null],
    [dict.product.beads, product.beadsCount],
    [dict.product.age, product.age],
    [dict.product.sku, product.sku],
  ];

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 md:px-8 lg:grid-cols-2 lg:gap-16">
      <Reveal>
        <ProductGallery images={product.images} name={name} />
      </Reveal>

      <Reveal delay={0.1}>
        <div className="flex flex-col gap-6">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {product.isNew && (
                <span className="rounded-full bg-emerald-500/90 px-2.5 py-1 text-[11px] font-bold text-white">
                  {dict.product.new}
                </span>
              )}
              {pricing.onSale && (
                <span className="rounded-full bg-cherry-500/90 px-2.5 py-1 text-[11px] font-bold text-white">
                  {dict.product.sale}
                  {pricing.discountPercent > 0 ? ` -${pricing.discountPercent}%` : ""}
                </span>
              )}
              {product.isUnique && (
                <span className="flex items-center gap-1 rounded-full bg-amber-950/80 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                  <Gem size={11} /> {dict.product.oneOfOne}
                </span>
              )}
              {product.hasCertificate && (
                <span className="flex items-center gap-1 rounded-full border border-amber-500/30 px-2.5 py-1 text-[11px] font-bold text-amber-300">
                  <ShieldCheck size={11} /> {dict.product.certificate}
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl text-foreground md:text-4xl">{name}</h1>
            {product.reviewsCount > 0 && (
              <div className="mt-3 flex items-center gap-3">
                <StarRating rating={product.rating} />
                <span className="text-sm text-muted">
                  {product.rating.toFixed(1)} · {product.reviewsCount} {dict.product.reviews}
                </span>
              </div>
            )}
          </div>

          <PriceTag price={pricing.price} originalPrice={pricing.originalPrice} size="lg" />

          <p className="text-sm leading-8 text-muted">{description}</p>

          <div className="grid grid-cols-2 gap-3 rounded-2xl card-border bg-background-card p-5 sm:grid-cols-3">
            {details
              .filter(([, v]) => v !== null && v !== undefined && v !== "")
              .map(([label, value]) => (
                <div key={label}>
                  <p className="text-[11px] tracking-wide text-muted uppercase">{label}</p>
                  <p className="mt-1 text-sm font-medium text-foreground">{value}</p>
                </div>
              ))}
          </div>

          <div>
            {outOfStock ? (
              <p className="text-sm font-medium text-cherry-500">{dict.product.outOfStock}</p>
            ) : product.stock <= 5 ? (
              <p className="text-sm font-medium text-amber-400">
                {dict.product.onlyLeft.replace("{n}", String(product.stock))}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {!product.isUnique && (
              <div className="flex items-center gap-3 rounded-full border border-border px-2 py-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="flex h-9 w-9 items-center justify-center text-muted hover:text-amber-300"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="flex h-9 w-9 items-center justify-center text-muted hover:text-amber-300"
                >
                  <Plus size={14} />
                </button>
              </div>
            )}

            <motion.button
              onClick={addToCart}
              disabled={outOfStock}
              whileTap={{ scale: 0.97 }}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-amber-400/60 px-6 py-3.5 text-sm font-bold text-amber-300 transition-colors hover:bg-amber-400/10 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              <ShoppingBag size={16} /> {dict.product.addToCart}
            </motion.button>

            <MagneticButton
              onClick={buyNow}
              className="flex-1 bg-amber-400 text-amber-950 hover:bg-amber-300 disabled:opacity-50 sm:flex-none"
            >
              {dict.product.buyNow}
            </MagneticButton>

            <button
              onClick={share}
              aria-label={dict.product.shareTitle}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted hover:border-amber-400/60 hover:text-amber-300"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
