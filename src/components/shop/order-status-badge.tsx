import { useLocale } from "@/context/locale-context";

const STYLES: Record<string, string> = {
  PENDING: "bg-amber-400/15 text-amber-300 border-amber-400/30",
  CONFIRMED: "bg-blue-400/15 text-blue-300 border-blue-400/30",
  SHIPPED: "bg-purple-400/15 text-purple-300 border-purple-400/30",
  DELIVERED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  CANCELLED: "bg-cherry-500/15 text-cherry-500 border-cherry-500/30",
};

const LABELS_AR: Record<string, string> = {
  PENDING: "قيد المراجعة",
  CONFIRMED: "مؤكد",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغي",
};

const LABELS_EN: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export function OrderStatusBadge({
  status,
  locale = "ar",
}: {
  status: string;
  locale?: "ar" | "en";
}) {
  const labels = locale === "ar" ? LABELS_AR : LABELS_EN;
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-semibold ${STYLES[status] ?? STYLES.PENDING}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

export function useOrderStatusLabel() {
  const { locale } = useLocale();
  return (status: string) => (locale === "ar" ? LABELS_AR[status] : LABELS_EN[status]) ?? status;
}
