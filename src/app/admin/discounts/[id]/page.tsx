import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DiscountForm, type DiscountFormValues } from "@/components/admin/discount-form";

function toDateInput(date: Date | null) {
  if (!date) return "";
  return date.toISOString().slice(0, 10);
}

export default async function EditDiscountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [discount, products, collections] = await Promise.all([
    prisma.discount.findUnique({ where: { id } }),
    prisma.product.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.collection.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);
  if (!discount) notFound();

  const initial: DiscountFormValues = {
    id: discount.id,
    code: discount.code ?? "",
    label: discount.label,
    type: discount.type as "PERCENTAGE" | "FIXED",
    value: discount.value,
    scope: discount.productId ? "PRODUCT" : discount.collectionId ? "COLLECTION" : "NONE",
    productId: discount.productId ?? "",
    collectionId: discount.collectionId ?? "",
    active: discount.active,
    usageLimit: discount.usageLimit,
    startsAt: toDateInput(discount.startsAt),
    endsAt: toDateInput(discount.endsAt),
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl text-foreground md:text-3xl">تعديل الخصم</h1>
      <DiscountForm initial={initial} products={products} collections={collections} />
    </div>
  );
}
