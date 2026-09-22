import { CollectionForm } from "@/components/admin/collection-form";

export default function NewCollectionPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl text-foreground md:text-3xl">إضافة مجموعة جديدة</h1>
      <CollectionForm />
    </div>
  );
}
