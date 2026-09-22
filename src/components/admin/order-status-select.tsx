"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ORDER_STATUSES } from "@/lib/types";

const LABELS: Record<string, string> = {
  PENDING: "قيد المراجعة",
  CONFIRMED: "مؤكد",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغي",
};

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [loading, setLoading] = useState(false);

  async function handleChange(next: string) {
    setValue(next);
    setLoading(true);
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setLoading(false);
    if (!res.ok) {
      toast.error("تعذر تحديث حالة الطلب");
      setValue(status);
      return;
    }
    toast.success("تم تحديث حالة الطلب");
    router.refresh();
  }

  return (
    <select
      value={value}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground focus:border-amber-400/60 focus:outline-none disabled:opacity-50"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {LABELS[s]}
        </option>
      ))}
    </select>
  );
}
