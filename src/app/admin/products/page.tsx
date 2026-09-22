import Link from "next/link";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, parseImages } from "@/lib/utils";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const products = await prisma.product.findMany({
    where: q
      ? { OR: [{ name: { contains: q } }, { sku: { contains: q } }, { nameEn: { contains: q } }] }
      : undefined,
    include: { collection: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-foreground md:text-3xl">المنتجات</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-amber-950 hover:bg-amber-300"
        >
          <Plus size={15} /> إضافة منتج
        </Link>
      </div>

      <form className="relative max-w-sm">
        <Search size={15} className="absolute top-1/2 start-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="ابحث بالاسم أو رمز المنتج..."
          className="w-full rounded-full border border-border bg-background-card px-10 py-2.5 text-sm text-foreground focus:border-amber-400/60 focus:outline-none"
        />
      </form>

      <div className="overflow-x-auto rounded-2xl card-border bg-background-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted">
              <th className="px-5 py-3 text-start font-medium">المنتج</th>
              <th className="px-5 py-3 text-start font-medium">المجموعة</th>
              <th className="px-5 py-3 text-start font-medium">السعر</th>
              <th className="px-5 py-3 text-start font-medium">المخزون</th>
              <th className="px-5 py-3 text-start font-medium">الحالة</th>
              <th className="px-5 py-3 text-start font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => {
              const images = parseImages(p.images);
              return (
                <tr key={p.id} className="border-b border-border/60 last:border-0">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-amber-950/40">
                        {images[0] && <Image src={images[0]} alt={p.name} fill className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-foreground">{p.name}</p>
                        <p className="truncate text-xs text-muted" dir="ltr">
                          {p.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted">{p.collection?.name ?? "—"}</td>
                  <td className="px-5 py-3 font-medium text-amber-300">{formatPrice(p.price, "ar")}</td>
                  <td className="px-5 py-3">
                    <span className={p.stock === 0 ? "text-cherry-500" : "text-foreground"}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        p.status === "PUBLISHED"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : "bg-muted/10 text-muted"
                      }`}
                    >
                      {p.status === "PUBLISHED" ? "منشور" : p.status === "DRAFT" ? "مسودة" : "مؤرشف"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:border-amber-400/50 hover:text-amber-300"
                      >
                        تعديل
                      </Link>
                      <ConfirmDeleteButton url={`/api/admin/products/${p.id}`} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="p-10 text-center text-sm text-muted">لا توجد منتجات مطابقة</p>
        )}
      </div>
    </div>
  );
}
