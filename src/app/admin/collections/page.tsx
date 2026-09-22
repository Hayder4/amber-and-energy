import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ConfirmDeleteButton } from "@/components/admin/confirm-delete-button";

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-foreground md:text-3xl">المجموعات</h1>
        <Link
          href="/admin/collections/new"
          className="flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-bold text-amber-950 hover:bg-amber-300"
        >
          <Plus size={15} /> إضافة مجموعة
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl card-border bg-background-card">
            <div className="relative h-32">
              {c.heroImage && <Image src={c.heroImage} alt={c.name} fill className="object-cover" />}
              <div className="absolute inset-0 bg-black/30" />
              {c.featured && (
                <span className="absolute top-2 end-2 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-amber-950">
                  مميزة
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="font-display text-lg text-foreground">{c.name}</p>
              <p className="mt-1 text-xs text-muted">{c._count.products} منتج</p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <Link
                  href={`/admin/collections/${c.id}`}
                  className="flex-1 rounded-lg border border-border py-2 text-center text-xs font-medium text-foreground hover:border-amber-400/50 hover:text-amber-300"
                >
                  تعديل
                </Link>
                <ConfirmDeleteButton
                  url={`/api/admin/collections/${c.id}`}
                  confirmMessage="سيتم حذف المجموعة وإلغاء ربط منتجاتها بها. هل أنت متأكد؟"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {collections.length === 0 && (
        <p className="rounded-2xl card-border bg-background-card p-10 text-center text-sm text-muted">
          لا توجد مجموعات بعد
        </p>
      )}
    </div>
  );
}
