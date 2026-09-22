import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { stringifyImages } from "@/lib/utils";
import { PRODUCT_STATUSES } from "@/lib/types";

const schema = z.object({
  name: z.string().trim().min(2),
  nameEn: z.string().trim().optional().or(z.literal("")),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[\p{L}\p{N}-]+$/u, "الرابط يجب أن يحتوي أحرف وأرقام وشرطات فقط"),
  sku: z.string().trim().min(2),
  description: z.string().trim().min(2),
  descriptionEn: z.string().trim().optional().or(z.literal("")),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).nullable().optional(),
  stock: z.number().int().min(0),
  images: z.array(z.string()).min(1),
  collectionId: z.string().nullable().optional(),
  material: z.string().trim().min(1),
  origin: z.string().trim().optional().or(z.literal("")),
  weightGrams: z.number().min(0).nullable().optional(),
  beadsCount: z.number().int().min(0).nullable().optional(),
  age: z.string().trim().optional().or(z.literal("")),
  isUnique: z.boolean(),
  hasCertificate: z.boolean(),
  featured: z.boolean(),
  isNew: z.boolean(),
  status: z.enum(PRODUCT_STATUSES),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" }, { status: 400 });
  }
  const data = parsed.data;

  const [slugConflict, skuConflict] = await Promise.all([
    prisma.product.findFirst({ where: { slug: data.slug, NOT: { id } } }),
    prisma.product.findFirst({ where: { sku: data.sku, NOT: { id } } }),
  ]);
  if (slugConflict) return NextResponse.json({ error: "الرابط مستخدم بالفعل" }, { status: 409 });
  if (skuConflict) return NextResponse.json({ error: "رمز المنتج مستخدم بالفعل" }, { status: 409 });

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      nameEn: data.nameEn || null,
      slug: data.slug,
      sku: data.sku,
      description: data.description,
      descriptionEn: data.descriptionEn || null,
      price: data.price,
      compareAtPrice: data.compareAtPrice ?? null,
      stock: data.stock,
      images: stringifyImages(data.images),
      collectionId: data.collectionId || null,
      material: data.material,
      origin: data.origin || null,
      weightGrams: data.weightGrams ?? null,
      beadsCount: data.beadsCount ?? null,
      age: data.age || null,
      isUnique: data.isUnique,
      hasCertificate: data.hasCertificate,
      featured: data.featured,
      isNew: data.isNew,
      status: data.status,
    },
  });

  return NextResponse.json({ product });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });

  await prisma.product.delete({ where: { id } }).catch(async () => {
    // Product referenced by existing order items — archive instead of hard delete.
    await prisma.product.update({ where: { id }, data: { status: "ARCHIVED", stock: 0 } });
  });

  return NextResponse.json({ ok: true });
}
