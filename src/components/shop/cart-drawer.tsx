"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/lib/cart-store";
import { useLocale } from "@/context/locale-context";
import { formatPrice } from "@/lib/utils";
import { MagneticButton } from "@/components/motion/magnetic-button";

export function CartDrawer() {
  const { dict, locale, pick } = useLocale();
  const isOpen = useCartStore((s) => s.isOpen);
  const close = useCartStore((s) => s.close);
  const lines = useCartStore((s) => s.lines);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const remove = useCartStore((s) => s.remove);
  const subtotal = useCartSubtotal();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="fixed inset-y-0 right-0 z-[95] flex w-full max-w-md flex-col border-s border-border bg-background-elevated shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-xl text-foreground">{dict.cart.title}</h2>
              <button onClick={close} className="text-muted hover:text-foreground">
                <X size={20} />
              </button>
            </div>

            {lines.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <ShoppingBag size={40} className="text-amber-800" />
                <p className="text-muted">{dict.cart.empty}</p>
                <Link
                  href="/collections"
                  onClick={close}
                  className="rounded-full bg-amber-400 px-6 py-2.5 text-sm font-bold text-amber-950"
                >
                  {dict.cart.emptyCta}
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="flex flex-col gap-4">
                    {lines.map((line) => (
                      <li key={line.productId} className="flex gap-3">
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-amber-950/40">
                          {line.image && (
                            <Image src={line.image} alt={line.name} fill className="object-cover" />
                          )}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <p className="line-clamp-2 text-sm font-medium text-foreground">
                              {pick(line.name, line.nameEn)}
                            </p>
                            <button
                              onClick={() => remove(line.productId)}
                              className="shrink-0 text-muted hover:text-cherry-500"
                              aria-label={dict.cart.remove}
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-full border border-border px-1">
                              <button
                                onClick={() => setQuantity(line.productId, line.quantity - 1)}
                                className="flex h-6 w-6 items-center justify-center text-muted hover:text-amber-300"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-4 text-center text-xs">{line.quantity}</span>
                              <button
                                onClick={() =>
                                  setQuantity(
                                    line.productId,
                                    Math.min(line.quantity + 1, line.stock || 99)
                                  )
                                }
                                className="flex h-6 w-6 items-center justify-center text-muted hover:text-amber-300"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-sm font-semibold text-amber-300">
                              {formatPrice(line.price * line.quantity, locale)}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-border p-5">
                  <div className="mb-4 flex items-center justify-between text-base">
                    <span className="text-muted">{dict.cart.subtotal}</span>
                    <span className="font-semibold text-foreground">{formatPrice(subtotal, locale)}</span>
                  </div>
                  <Link href="/checkout" onClick={close}>
                    <MagneticButton className="w-full bg-amber-400 text-amber-950 hover:bg-amber-300">
                      {dict.cart.checkout}
                    </MagneticButton>
                  </Link>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
