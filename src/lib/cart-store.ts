"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine } from "@/lib/types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      add: (line, quantity = 1) => {
        const lines = get().lines;
        const existing = lines.find((l) => l.productId === line.productId);
        if (existing) {
          const nextQty = Math.min(existing.quantity + quantity, existing.stock || 99);
          set({
            lines: lines.map((l) =>
              l.productId === line.productId ? { ...l, quantity: nextQty } : l
            ),
            isOpen: true,
          });
        } else {
          set({ lines: [...lines, { ...line, quantity }], isOpen: true });
        }
      },
      remove: (productId) => set({ lines: get().lines.filter((l) => l.productId !== productId) }),
      setQuantity: (productId, quantity) =>
        set({
          lines: get()
            .lines.map((l) => (l.productId === productId ? { ...l, quantity } : l))
            .filter((l) => l.quantity > 0),
        }),
      clear: () => set({ lines: [] }),
    }),
    { name: "amber-energy-cart" }
  )
);

export function useCartCount() {
  return useCartStore((s) => s.lines.reduce((sum, l) => sum + l.quantity, 0));
}

export function useCartSubtotal() {
  return useCartStore((s) => s.lines.reduce((sum, l) => sum + l.price * l.quantity, 0));
}
