"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { TextField, TextAreaField, CheckboxField } from "@/components/admin/form-field";
import { ImageUploader } from "@/components/admin/image-uploader";
import { slugify } from "@/lib/utils";

export interface CollectionFormValues {
  id?: string;
  name: string;
  nameEn: string;
  slug: string;
  description: string;
  descriptionEn: string;
  heroImage: string;
  accentColor: string;
  featured: boolean;
  sortOrder: number;
}

const emptyValues: CollectionFormValues = {
  name: "",
  nameEn: "",
  slug: "",
  description: "",
  descriptionEn: "",
  heroImage: "",
  accentColor: "#C9862B",
  featured: false,
  sortOrder: 0,
};

export function CollectionForm({ initial }: { initial?: CollectionFormValues }) {
  const router = useRouter();
  const [values, setValues] = useState<CollectionFormValues>(initial ?? emptyValues);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof CollectionFormValues>(key: K, value: CollectionFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const url = values.id ? `/api/admin/collections/${values.id}` : "/api/admin/collections";
    const method = values.id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "تعذر حفظ المجموعة");
      return;
    }
    toast.success(values.id ? "تم تحديث المجموعة" : "تم إضافة المجموعة");
    router.push("/admin/collections");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="rounded-2xl card-border bg-background-card p-6">
        <h2 className="font-display mb-4 text-lg text-foreground">صورة الغلاف</h2>
        <ImageUploader
          images={values.heroImage ? [values.heroImage] : []}
          onChange={(imgs) => update("heroImage", imgs[0] ?? "")}
          multiple={false}
        />
      </div>

      <div className="grid gap-4 rounded-2xl card-border bg-background-card p-6 sm:grid-cols-2">
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
          label="لون مميز"
          type="color"
          value={values.accentColor}
          onChange={(e) => update("accentColor", e.target.value)}
          className="h-11 p-1"
        />
        <TextAreaField
          label="الوصف (عربي)"
          rows={3}
          className="sm:col-span-2"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
        />
        <TextAreaField
          label="الوصف (إنجليزي)"
          rows={3}
          className="sm:col-span-2"
          value={values.descriptionEn}
          onChange={(e) => update("descriptionEn", e.target.value)}
        />
        <TextField
          label="ترتيب العرض"
          type="number"
          value={values.sortOrder}
          onChange={(e) => update("sortOrder", Number(e.target.value))}
        />
        <CheckboxField
          label="مجموعة مميزة (تظهر بالصفحة الرئيسية)"
          checked={values.featured}
          onChange={(e) => update("featured", e.target.checked)}
        />
      </div>

      {error && <p className="text-sm text-cherry-500">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/collections")}
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
          حفظ المجموعة
        </button>
      </div>
    </form>
  );
}
