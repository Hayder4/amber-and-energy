import { prisma } from "@/lib/prisma";
import { DiscountForm } from "@/components/admin/discount-form";

export default async function NewDiscountPage() {
  const [products, collections] = await Promise.all([
    prisma.product.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
    prisma.collection.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl text-foreground md:text-3xl">إضافة خصم جديد</h1>
      <DiscountForm products={products} collections={collections} />
    </div>
  );
}
