import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CollectionForm, type CollectionFormValues } from "@/components/admin/collection-form";

export default async function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collection = await prisma.collection.findUnique({ where: { id } });
  if (!collection) notFound();

  const initial: CollectionFormValues = {
    id: collection.id,
    name: collection.name,
    nameEn: collection.nameEn ?? "",
    slug: collection.slug,
    description: collection.description ?? "",
    descriptionEn: collection.descriptionEn ?? "",
    heroImage: collection.heroImage ?? "",
    accentColor: collection.accentColor,
    featured: collection.featured,
    sortOrder: collection.sortOrder,
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl text-foreground md:text-3xl">تعديل المجموعة</h1>
      <CollectionForm initial={initial} />
    </div>
  );
}
