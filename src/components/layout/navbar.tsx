"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useLocale } from "@/context/locale-context";
import { useCartStore, useCartCount } from "@/lib/cart-store";
import { AccountMenu } from "@/components/layout/account-menu";
import { LanguageToggle } from "@/components/layout/language-toggle";
import { SearchOverlay } from "@/components/layout/search-overlay";
import { SITE } from "@/lib/site";

const links = [
  { href: "/", key: "home" as const },
  { href: "/collections", key: "collections" as const },
  { href: "/about", key: "about" as const },
  { href: "/contact", key: "contact" as const },
];

export function Navbar() {
  const { dict } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openCart = useCartStore((s) => s.open);
  const cartCount = useCartCount();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "border-b border-border bg-background/85 backdrop-blur-xl"
            : "border-b border-transparent bg-gradient-to-b from-black/50 to-transparent"
        }`}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 py-3.5 md:px-8">
          <Link href="/" className="font-display gold-gradient-text text-2xl font-bold md:text-3xl">
            {SITE.name}
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="relative text-sm font-medium text-foreground/85 transition-colors hover:text-amber-300 [&:hover>span]:scale-x-100"
              >
                {dict.nav[l.key]}
                <span className="absolute -bottom-1 start-0 h-px w-full origin-start scale-x-0 bg-amber-400 transition-transform duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 md:gap-2.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-amber-400/60 hover:text-amber-300"
              aria-label={dict.nav.search}
            >
              <Search size={16} />
            </button>
            <LanguageToggle />
            <AccountMenu />
            <button
              onClick={openCart}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:border-amber-400/60 hover:text-amber-300"
              aria-label={dict.nav.cart}
            >
              <ShoppingBag size={16} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-bold text-amber-950"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted lg:hidden"
              aria-label="Menu"
            >
              <Menu size={17} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-background/98 backdrop-blur-xl lg:hidden"
          >
            <div className="flex items-center justify-between px-5 py-5">
              <span className="font-display gold-gradient-text text-xl font-bold">{SITE.name}</span>
              <button onClick={() => setMobileOpen(false)} className="text-muted">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-1 px-5 py-6">
              {links.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setMobileOpen(false)}
                    className="block border-b border-border py-4 font-display text-2xl text-foreground"
                  >
                    {dict.nav[l.key]}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
