"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useLocale } from "@/context/locale-context";
import { PriceTag } from "@/components/shop/price-tag";
import type { ProductPricing } from "@/lib/types";

interface Result {
  id: string;
  slug: string;
  name: string;
  nameEn: string | null;
  image: string | null;
  pricing: ProductPricing;
}

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dict, pick } = useLocale();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(handle);
  }, [open]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;
    const handle = setTimeout(() => {
      setLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}`)
        .then((r) => r.json())
        .then((data) => setResults(data.results ?? []))
        .finally(() => setLoading(false));
    }, 280);
    return () => clearTimeout(handle);
  }, [query]);

  function handleClose() {
    setQuery("");
    setResults([]);
    onClose();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  const visibleResults = query.trim() ? results : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="mx-auto mt-24 w-[92%] max-w-2xl rounded-3xl card-border bg-background-elevated p-2 shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3">
              <Search size={19} className="text-amber-400" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={dict.nav.search}
                className="flex-1 bg-transparent text-base text-foreground placeholder:text-muted focus:outline-none"
              />
              <button onClick={handleClose} className="text-muted hover:text-foreground">
                <X size={19} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2">
              {loading && <p className="p-4 text-center text-sm text-muted">{dict.common.loading}</p>}
              {!loading && query && visibleResults.length === 0 && (
                <p className="p-6 text-center text-sm text-muted">
                  {pick("لا توجد نتائج مطابقة", "No matching results")}
                </p>
              )}
              {visibleResults.map((r) => (
                <Link
                  key={r.id}
                  href={`/products/${r.slug}`}
                  onClick={handleClose}
                  className="flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-amber-400/10"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-amber-950/40">
                    {r.image && (
                      <Image src={r.image} alt={pick(r.name, r.nameEn)} fill className="object-cover" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{pick(r.name, r.nameEn)}</p>
                    <PriceTag price={r.pricing.price} originalPrice={r.pricing.originalPrice} size="sm" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
