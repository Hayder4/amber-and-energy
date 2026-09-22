import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm, type ProductFormValues } from "@/components/admin/product-form";
import { parseImages } from "@/lib/utils";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, collections] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.collection.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!product) notFound();

  const initial: ProductFormValues = {
    id: product.id,
    name: product.name,
    nameEn: product.nameEn ?? "",
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    descriptionEn: product.descriptionEn ?? "",
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    stock: product.stock,
    images: parseImages(product.images),
    collectionId: product.collectionId ?? "",
    material: product.material,
    origin: product.origin ?? "",
    weightGrams: product.weightGrams,
    beadsCount: product.beadsCount,
    age: product.age ?? "",
    isUnique: product.isUnique,
    hasCertificate: product.hasCertificate,
    featured: product.featured,
    isNew: product.isNew,
    status: product.status,
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl text-foreground md:text-3xl">تعديل المنتج</h1>
      <ProductForm initial={initial} collections={collections} />
    </div>
  );
}
