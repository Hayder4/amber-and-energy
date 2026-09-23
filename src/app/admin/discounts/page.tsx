import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";

export default async function AdminDiscountsPage() {
  const discounts = await prisma.discount.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: { select: { name: true } } },
  });
  const collections = await prisma.collection.findMany({ select: { id: true, name: true } });
  const collectionNameById = new Map(collections.map((c) => [c.id, c.name]));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-foreground md:text-3xl">الخصومات</h1>
        <Link
          href="/admin/discounts/new"
          className="flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-amber-950 hover:bg-amber-300"
        >
          <Plus size={15} /> إضافة خصم
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl card-border bg-background-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-5 py-3 text-start font-medium">الاسم</th>
              <th className="px-5 py-3 text-start font-medium">الكود</th>
              <th className="px-5 py-3 text-start font-medium">القيمة</th>
              <th className="px-5 py-3 text-start font-medium">النطاق</th>
              <th className="px-5 py-3 text-start font-medium">الاستخدام</th>
              <th className="px-5 py-3 text-start font-medium">الحالة</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {discounts.map((d) => (
              <tr key={d.id} className="border-b border-border/60 last:border-0">
                <td className="px-5 py-3 font-medium text-foreground">{d.label}</td>
                <td className="px-5 py-3 text-muted" dir="ltr">
                  {d.code ?? "تلقائي"}
                </td>
                <td className="px-5 py-3 text-amber-300">
                  {d.type === "PERCENTAGE" ? `${d.value}%` : `${d.value} €`}
                </td>
                <td className="px-5 py-3 text-muted">
                  {d.productId
                    ? `منتج: ${d.product?.name ?? "—"}`
                    : d.collectionId
                      ? `مجموعة: ${collectionNameById.get(d.collectionId) ?? "—"}`
                      : "الطلب كاملًا"}
                </td>
                <td className="px-5 py-3 text-muted">
                  {d.usedCount}
                  {d.usageLimit ? ` / ${d.usageLimit}` : ""}
                </td>
                <td className="px-5 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      d.active ? "bg-emerald-500/15 text-emerald-400" : "bg-muted/10 text-muted"
                    }`}
                  >
                    {d.active ? "فعّال" : "متوقف"}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/discounts/${d.id}`}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-amber-400/50 hover:text-amber-300"
                    >
                      تعديل
                    </Link>
                    <ConfirmDeleteButton url={`/api/admin/discounts/${d.id}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {discounts.length === 0 && (
          <p className="p-10 text-center text-sm text-muted">لا توجد خصومات بعد</p>
        )}
      </div>
    </div>
  );
}
