"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { User, LayoutDashboard, LogOut, Package } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";

export function AccountMenu() {
  const { user, isAdmin, logout } = useAuth();
  const { dict } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-amber-400/60 hover:text-amber-300"
        aria-label={dict.nav.login}
      >
        <User size={17} />
      </Link>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10 text-amber-300 transition-colors hover:border-amber-400/70"
      >
        <User size={17} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="absolute end-0 top-12 z-50 w-56 overflow-hidden rounded-2xl card-border bg-background-elevated p-1.5 shadow-2xl"
          >
            <div className="px-3 py-2.5">
              <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted">{user.email}</p>
            </div>
            <div className="h-px bg-border" />
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-foreground/90 hover:bg-amber-400/10"
            >
              <Package size={16} /> {dict.account.title}
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-amber-300 hover:bg-amber-400/10"
              >
                <LayoutDashboard size={16} /> {dict.nav.admin}
              </Link>
            )}
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-start text-sm text-cherry-500 hover:bg-cherry-500/10"
            >
              <LogOut size={16} /> {dict.nav.logout}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
