"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { TextField, TextAreaField, SelectField, CheckboxField } from "@/components/admin/form-field";
import { ImageUploader } from "@/components/admin/image-uploader";
import { slugify, generateSku } from "@/lib/utils";

interface CollectionOption {
  id: string;
  name: string;
}

export interface ProductFormValues {
  id?: string;
  name: string;
  nameEn: string;
  slug: string;
  sku: string;
  description: string;
  descriptionEn: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  images: string[];
  collectionId: string;
  material: string;
  origin: string;
  weightGrams: number | null;
  beadsCount: number | null;
  age: string;
  isUnique: boolean;
  hasCertificate: boolean;
  featured: boolean;
  isNew: boolean;
  status: string;
}

const emptyValues: ProductFormValues = {
  name: "",
  nameEn: "",
  slug: "",
  sku: generateSku(),
  description: "",
  descriptionEn: "",
  price: 0,
  compareAtPrice: null,
  stock: 1,
  images: [],
  collectionId: "",
  material: "كهرمان طبيعي",
  origin: "",
  weightGrams: null,
  beadsCount: null,
  age: "",
  isUnique: false,
  hasCertificate: false,
  featured: false,
  isNew: true,
  status: "PUBLISHED",
};

export function ProductForm({
  initial,
  collections,
}: {
  initial?: ProductFormValues;
  collections: CollectionOption[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(initial ?? emptyValues);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (values.images.length === 0) {
      setError("أضف صورة واحدة على الأقل");
      return;
    }
    setSaving(true);
    const url = values.id ? `/api/admin/products/${values.id}` : "/api/admin/products";
    const method = values.id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, collectionId: values.collectionId || null }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "تعذر حفظ المنتج");
      return;
    }
    toast.success(values.id ? "تم تحديث المنتج" : "تم إضافة المنتج");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="rounded-2xl card-border bg-background-card p-6">
        <h2 className="font-display mb-4 text-lg text-foreground">الصور</h2>
        <ImageUploader images={values.images} onChange={(images) => update("images", images)} />
      </div>

      <div className="grid gap-4 rounded-2xl card-border bg-background-card p-6 sm:grid-cols-2">
        <h2 className="font-display col-span-full text-lg text-foreground">المعلومات الأساسية</h2>
        <TextField
          label="الاسم (عربي)"
          required
          value={values.name}
          onChange={(e) => {
            update("name", e.target.value);
            if (!slugTouched) update("slug", slugify(e.target.value));
          }}
        />
        <TextField
          label="الاسم (إنجليزي)"
          value={values.nameEn}
          onChange={(e) => update("nameEn", e.target.value)}
        />
        <TextField
          label="الرابط (slug)"
          required
          dir="ltr"
          value={values.slug}
          onChange={(e) => {
            setSlugTouched(true);
            update("slug", e.target.value);
          }}
        />
        <TextField
          label="رمز المنتج (SKU)"
          required
          dir="ltr"
          value={values.sku}
          onChange={(e) => update("sku", e.target.value)}
        />
        <TextAreaField
          label="الوصف (عربي)"
          required
          rows={4}
          className="sm:col-span-2"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
        />
        <TextAreaField
          label="الوصف (إنجليزي)"
          rows={4}
          className="sm:col-span-2"
          value={values.descriptionEn}
          onChange={(e) => update("descriptionEn", e.target.value)}
        />
      </div>

      <div className="grid gap-4 rounded-2xl card-border bg-background-card p-6 sm:grid-cols-3">
        <h2 className="font-display col-span-full text-lg text-foreground">السعر والمخزون</h2>
        <TextField
          label="السعر (ر.س)"
          type="number"
          min={0}
          step="0.01"
          required
          value={values.price}
          onChange={(e) => update("price", Number(e.target.value))}
        />
        <TextField
          label="السعر قبل الخصم (اختياري)"
          type="number"
          min={0}
          step="0.01"
          value={values.compareAtPrice ?? ""}
          onChange={(e) => update("compareAtPrice", e.target.value ? Number(e.target.value) : null)}
        />
        <TextField
          label="الكمية المتوفرة"
          type="number"
          min={0}
          required
          value={values.stock}
          onChange={(e) => update("stock", Number(e.target.value))}
        />
        <SelectField
          label="المجموعة"
          value={values.collectionId}
          onChange={(e) => update("collectionId", e.target.value)}
        >
          <option value="">بدون مجموعة</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </SelectField>
        <SelectField label="الحالة" value={values.status} onChange={(e) => update("status", e.target.value)}>
          <option value="PUBLISHED">منشور</option>
          <option value="DRAFT">مسودة</option>
          <option value="ARCHIVED">مؤرشف</option>
        </SelectField>
      </div>

      <div className="grid gap-4 rounded-2xl card-border bg-background-card p-6 sm:grid-cols-3">
        <h2 className="font-display col-span-full text-lg text-foreground">تفاصيل الكهرمان</h2>
        <TextField
          label="المادة"
          value={values.material}
          onChange={(e) => update("material", e.target.value)}
        />
        <TextField
          label="المصدر / النوع"
          value={values.origin}
          onChange={(e) => update("origin", e.target.value)}
          placeholder="كهرمان بلطيقي طبيعي، فاتوران دمشقي..."
        />
        <TextField
          label="الوزن (جرام)"
          type="number"
          min={0}
          step="0.1"
          value={values.weightGrams ?? ""}
          onChange={(e) => update("weightGrams", e.target.value ? Number(e.target.value) : null)}
        />
        <TextField
          label="عدد الحبات (للمسابح)"
          type="number"
          min={0}
          value={values.beadsCount ?? ""}
          onChange={(e) => update("beadsCount", e.target.value ? Number(e.target.value) : null)}
        />
        <TextField
          label="العمر التقديري"
          value={values.age}
          onChange={(e) => update("age", e.target.value)}
          placeholder="أكثر من 40 عامًا"
        />
      </div>

      <div className="grid gap-3 rounded-2xl card-border bg-background-card p-6 sm:grid-cols-4">
        <h2 className="font-display col-span-full text-lg text-foreground">إعدادات إضافية</h2>
        <CheckboxField
          label="قطعة فريدة (1 من 1)"
          checked={values.isUnique}
          onChange={(e) => update("isUnique", e.target.checked)}
        />
        <CheckboxField
          label="بشهادة توثيق"
          checked={values.hasCertificate}
          onChange={(e) => update("hasCertificate", e.target.checked)}
        />
        <CheckboxField
          label="منتج مميز"
          checked={values.featured}
          onChange={(e) => update("featured", e.target.checked)}
        />
        <CheckboxField
          label="وصل حديثًا"
          checked={values.isNew}
          onChange={(e) => update("isNew", e.target.checked)}
        />
      </div>

      {error && <p className="text-sm text-cherry-500">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="rounded-full border border-border px-6 py-2.5 text-sm font-medium text-muted hover:text-foreground"
        >
          إلغاء
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 rounded-full bg-amber-400 px-6 py-2.5 text-sm font-bold text-amber-950 hover:bg-amber-300 disabled:opacity-60"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          حفظ المنتج
        </button>
      </div>
    </form>
  );
}
