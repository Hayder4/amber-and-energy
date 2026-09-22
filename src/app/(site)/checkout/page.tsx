"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, Tag, Truck } from "lucide-react";
import { useCartStore, useCartSubtotal } from "@/lib/cart-store";
import { useAuth } from "@/context/auth-context";
import { useLocale } from "@/context/locale-context";
import { formatPrice } from "@/lib/utils";
import { MagneticButton } from "@/components/motion/magnetic-button";
import { Reveal } from "@/components/motion/reveal";
import type { PaymentMethod } from "@/lib/types";

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 35;

export default function CheckoutPage() {
  const { dict, locale } = useLocale();
  const { user } = useAuth();
  const lines = useCartStore((s) => s.lines);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartSubtotal();

  const [form, setForm] = useState({
    guestName: user?.name ?? "",
    guestEmail: user?.email ?? "",
    guestPhone: "",
    city: "",
    district: "",
    street: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<{ label: string; discountTotal: number } | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ number: string; total: number } | null>(null);

  const discountTotal = applied?.discountTotal ?? 0;
  const shippingFee = subtotal - discountTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal - discountTotal + shippingFee);

  async function applyCode() {
    setCodeError(null);
    if (!code.trim()) return;
    const res = await fetch(`/api/discounts/validate?code=${encodeURIComponent(code)}&subtotal=${subtotal}`);
    const data = await res.json();
    if (!res.ok || !data.valid) {
      setCodeError(data.error ?? dict.common.error);
      setApplied(null);
      return;
    }
    setApplied({ label: data.label, discountTotal: data.discountTotal });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        ...form,
        paymentMethod,
        discountCode: applied ? code : undefined,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) {
      setError(data.error ?? dict.common.error);
      return;
    }
    setSuccess(data.order);
    clear();
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-20 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <CheckCircle2 size={72} className="mx-auto text-amber-400" />
        </motion.div>
        <h1 className="font-display mt-6 text-3xl text-foreground">{dict.checkout.success}</h1>
        <p className="mt-3 text-muted">
          {dict.checkout.successSub} <span className="font-semibold text-amber-300">{success.number}</span>
        </p>
        <p className="mt-1 text-lg font-semibold text-foreground">{formatPrice(success.total, locale)}</p>
        <Link href="/" className="mt-8">
          <MagneticButton className="bg-amber-400 text-amber-950 hover:bg-amber-300">
            {dict.checkout.backHome}
          </MagneticButton>
        </Link>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <p className="text-muted">{dict.cart.empty}</p>
        <Link href="/collections" className="mt-6">
          <MagneticButton className="bg-amber-400 text-amber-950 hover:bg-amber-300">
            {dict.cart.emptyCta}
          </MagneticButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:px-8 lg:grid-cols-[1.3fr_1fr]">
      <Reveal>
        <h1 className="font-display mb-8 text-3xl text-foreground">{dict.checkout.title}</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {!user && (
            <fieldset className="flex flex-col gap-4">
              <legend className="mb-1 font-display text-lg text-foreground">{dict.checkout.contactInfo}</legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label={dict.checkout.fullName}
                  value={form.guestName}
                  onChange={(v) => setForm((f) => ({ ...f, guestName: v }))}
                  required
                />
                <Field
                  label={dict.checkout.phone}
                  value={form.guestPhone}
                  onChange={(v) => setForm((f) => ({ ...f, guestPhone: v }))}
                  required
                  dir="ltr"
                />
              </div>
              <Field
                label={dict.checkout.email}
                type="email"
                value={form.guestEmail}
                onChange={(v) => setForm((f) => ({ ...f, guestEmail: v }))}
                required
              />
            </fieldset>
          )}

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-1 font-display text-lg text-foreground">{dict.checkout.shippingInfo}</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label={dict.checkout.city}
                value={form.city}
                onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                required
              />
              <Field
                label={dict.checkout.district}
                value={form.district}
                onChange={(v) => setForm((f) => ({ ...f, district: v }))}
              />
            </div>
            <Field
              label={dict.checkout.street}
              value={form.street}
              onChange={(v) => setForm((f) => ({ ...f, street: v }))}
              required
            />
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted">{dict.checkout.notes}</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-border bg-background-card px-4 py-3 text-sm text-foreground focus:border-amber-400/60 focus:outline-none"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 font-display text-lg text-foreground">{dict.checkout.paymentMethod}</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["COD", "BANK_TRANSFER"] as PaymentMethod[]).map((method) => (
                <button
                  type="button"
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-2xl border p-4 text-start text-sm font-medium transition-colors ${
                    paymentMethod === method
                      ? "border-amber-400 bg-amber-400/10 text-amber-300"
                      : "border-border text-muted hover:border-amber-500/40"
                  }`}
                >
                  {method === "COD" ? dict.checkout.cod : dict.checkout.bankTransfer}
                </button>
              ))}
            </div>
          </fieldset>

          {error && <p className="text-sm text-cherry-500">{error}</p>}

          <MagneticButton
            type="submit"
            className="w-full bg-amber-400 py-4 text-base text-amber-950 hover:bg-amber-300 disabled:opacity-60"
          >
            {submitting ? dict.common.loading : dict.checkout.placeOrder}
          </MagneticButton>
        </form>
      </Reveal>

      <Reveal delay={0.15}>
        <div className="sticky top-24 rounded-3xl card-border bg-background-card p-6">
          <h2 className="font-display mb-5 text-xl text-foreground">{dict.checkout.orderSummary}</h2>
          <ul className="flex max-h-72 flex-col gap-4 overflow-y-auto pe-1">
            {lines.map((l) => (
              <li key={l.productId} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-amber-950/40">
                  {l.image && <Image src={l.image} alt={l.name} fill className="object-cover" />}
                  <span className="absolute -end-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-bold text-amber-950">
                    {l.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">{l.name}</p>
                </div>
                <span className="text-sm font-medium text-amber-300">
                  {formatPrice(l.price * l.quantity, locale)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex gap-2">
            <div className="relative flex-1">
              <Tag size={14} className="absolute top-1/2 start-3 -translate-y-1/2 text-muted" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={dict.cart.codePlaceholder}
                className="w-full rounded-full border border-border bg-background px-9 py-2.5 text-sm text-foreground focus:border-amber-400/60 focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={applyCode}
              className="rounded-full border border-amber-400/50 px-4 text-sm font-semibold text-amber-300 hover:bg-amber-400/10"
            >
              {dict.cart.applyCode}
            </button>
          </div>
          {codeError && <p className="mt-2 text-xs text-cherry-500">{codeError}</p>}
          {applied && <p className="mt-2 text-xs text-emerald-500">{applied.label}</p>}

          <div className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5 text-sm">
            <div className="flex justify-between text-muted">
              <span>{dict.cart.subtotal}</span>
              <span>{formatPrice(subtotal, locale)}</span>
            </div>
            {discountTotal > 0 && (
              <div className="flex justify-between text-emerald-500">
                <span>{dict.cart.discount}</span>
                <span>-{formatPrice(discountTotal, locale)}</span>
              </div>
            )}
            <div className="flex items-center justify-between text-muted">
              <span className="flex items-center gap-1.5">
                <Truck size={14} /> {locale === "ar" ? "الشحن" : "Shipping"}
              </span>
              <span>{shippingFee === 0 ? (locale === "ar" ? "مجاني" : "Free") : formatPrice(shippingFee, locale)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2.5 text-base font-semibold text-foreground">
              <span>{dict.cart.total}</span>
              <span className="text-amber-300">{formatPrice(total, locale)}</span>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  dir,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted">{label}</label>
      <input
        type={type}
        required={required}
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background-card px-4 py-3 text-sm text-foreground focus:border-amber-400/60 focus:outline-none"
      />
    </div>
  );
}
