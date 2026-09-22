"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { GripVertical, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";

export function ImageUploader({
  images,
  onChange,
  multiple = true,
}: {
  images: string[];
  onChange: (images: string[]) => void;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (res.ok) uploaded.push(data.url);
      else toast.error(data.error ?? "فشل رفع الصورة");
    }
    setUploading(false);
    onChange(multiple ? [...images, ...uploaded] : uploaded.slice(0, 1));
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function move(index: number, dir: -1 | 1) {
    const next = [...images];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {images.map((img, i) => (
          <div
            key={img + i}
            className="group relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-border"
          >
            <Image src={img} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute end-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
              <X size={11} />
            </button>
            {images.length > 1 && (
              <button
                type="button"
                onClick={() => move(i, -1)}
                className="absolute bottom-1 start-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition-opacity group-hover:opacity-100"
                title="تحريك"
              >
                <GripVertical size={11} />
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border text-muted transition-colors hover:border-amber-400/50 hover:text-amber-300 disabled:opacity-50"
        >
          {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
          <span className="text-[10px]">رفع صورة</span>
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
