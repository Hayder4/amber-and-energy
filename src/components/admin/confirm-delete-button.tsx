"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function ConfirmDeleteButton({
  url,
  confirmMessage = "هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.",
  onDeleted,
  className,
}: {
  url: string;
  confirmMessage?: string;
  onDeleted?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!window.confirm(confirmMessage)) return;
    setLoading(true);
    const res = await fetch(url, { method: "DELETE" });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error ?? "تعذر الحذف");
      return;
    }
    toast.success("تم الحذف بنجاح");
    onDeleted?.();
    router.refresh();
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={
        className ??
        "flex h-9 w-9 items-center justify-center rounded-lg border border-cherry-500/30 text-cherry-500 transition-colors hover:bg-cherry-500/10 disabled:opacity-50"
      }
      aria-label="حذف"
    >
      {loading ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
    </button>
  );
}
