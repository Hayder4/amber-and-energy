import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { requireAdminSession } from "@/lib/auth";

const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"]);
const MAX_SIZE = 6 * 1024 * 1024;
const EXT_BY_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "لم يتم إرفاق ملف" }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "نوع الملف غير مدعوم" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "حجم الملف كبير جدًا (الحد 6 ميجابايت)" }, { status: 400 });
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const ext = EXT_BY_TYPE[file.type] ?? "bin";
  const filename = `${randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
