"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative aspect-square overflow-hidden rounded-3xl card-border bg-amber-950/30"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = ((e.clientX - rect.left) / rect.width) * 100;
          const y = ((e.clientY - rect.top) / rect.height) * 100;
          setOrigin(`${x}% ${y}%`);
        }}
        onMouseEnter={() => setZoom(true)}
        onMouseLeave={() => setZoom(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="absolute inset-0"
          >
            <Image
              src={images[active] ?? "/images/placeholder.svg"}
              alt={name}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              style={{ transformOrigin: origin }}
              className={`object-cover transition-transform duration-500 ${zoom ? "scale-[1.5]" : "scale-100"}`}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 transition-colors ${
                active === i ? "border-amber-400" : "border-border hover:border-amber-500/40"
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
