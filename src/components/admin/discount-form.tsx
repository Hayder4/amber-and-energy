"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { TextField, SelectField, CheckboxField } from "@/components/admin/form-field";

interface Option {
  id: string;
  name: string;
}

export interface DiscountFormValues {
  id?: string;
  code: string;
  label: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  scope: "NONE" | "PRODUCT" | "COLLECTION";
  productId: string;
  collectionId: string;
  active: boolean;
  usageLimit: number | null;
  startsAt: string;
  endsAt: string;
}

const emptyValues: DiscountFormValues = {
  code: "",
  label: "",
  type: "PERCENTAGE",
  value: 10,
  scope: "NONE",
  productId: "",
  collectionId: "",
  active: true,
  usageLimit: null,
  startsAt: "",
  endsAt: "",
};

export function DiscountForm({
  initial,
  products,
  collections,
}: {
  initial?: DiscountFormValues;
  products: Option[];
  collections: Option[];
}) {
  const router = useRouter();
  const [values, setValues] = useState<DiscountFormValues>(initial ?? emptyValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof DiscountFormValues>(key: K, value: DiscountFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const url = values.id ? `/api/admin/discounts/${values.id}` : "/api/admin/discounts";
    const method = values.id ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      setError(data.error ?? "تعذر حفظ الخصم");
      return;
    }
    toast.success(values.id ? "تم تحديث الخصم" : "تم إضافة الخصم");
    router.push("/admin/discounts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid gap-4 rounded-2xl card-border bg-background-card p-6 sm:grid-cols-2">
        <TextField
          label="اسم الخصم (للعرض الداخلي)"
          required
          value={values.label}
          onChange={(e) => update("label", e.target.value)}
          placeholder="خصم نهاية الموسم"
        />
        <TextField
          label="كود الخصم (اتركه فارغًا لخصم تلقائي)"
          dir="ltr"
          value={values.code}
          onChange={(e) => update("code", e.target.value.toUpperCase())}
          placeholder="AMBER15"
        />
        <SelectField
          label="نوع الخصم"
          value={values.type}
          onChange={(e) => update("type", e.target.value as "PERCENTAGE" | "FIXED")}
        >
          <option value="PERCENTAGE">نسبة مئوية %</option>
          <option value="FIXED">مبلغ ثابت (ر.س)</option>
        </SelectField>
        <TextField
          label="القيمة"
          type="number"
          min={0}
          required
          value={values.value}
          onChange={(e) => update("value", Number(e.target.value))}
        />

        <SelectField
          label="نطاق التطبيق"
          value={values.scope}
          onChange={(e) => update("scope", e.target.value as DiscountFormValues["scope"])}
        >
          <option value="NONE">الطلب كاملًا (بدون تحديد)</option>
          <option value="PRODUCT">منتج محدد</option>
          <option value="COLLECTION">مجموعة محددة</option>
        </SelectField>

        {values.scope === "PRODUCT" && (
          <SelectField
            label="المنتج"
            value={values.productId}
            onChange={(e) => update("productId", e.target.value)}
          >
            <option value="">اختر منتجًا</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </SelectField>
        )}

        {values.scope === "COLLECTION" && (
          <SelectField
            label="المجموعة"
            value={values.collectionId}
            onChange={(e) => update("collectionId", e.target.value)}
          >
            <option value="">اختر مجموعة</option>
            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>
        )}

        <TextField
          label="حد الاستخدام (اختياري)"
          type="number"
          min={0}
          value={values.usageLimit ?? ""}
          onChange={(e) => update("usageLimit", e.target.value ? Number(e.target.value) : null)}
        />
        <CheckboxField
          label="فعّال"
          checked={values.active}
          onChange={(e) => update("active", e.target.checked)}
        />
        <TextField
          label="تاريخ البداية (اختياري)"
          type="date"
          value={values.startsAt}
          onChange={(e) => update("startsAt", e.target.value)}
        />
        <TextField
          label="تاريخ الانتهاء (اختياري)"
          type="date"
          value={values.endsAt}
          onChange={(e) => update("endsAt", e.target.value)}
        />
      </div>

      {error && <p className="text-sm text-cherry-500">{error}</p>}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.push("/admin/discounts")}
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
          حفظ الخصم
        </button>
      </div>
    </form>
  );
}
