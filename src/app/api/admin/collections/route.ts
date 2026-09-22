import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2),
  nameEn: z.string().trim().optional().or(z.literal("")),
  slug: z
    .string()
    .trim()
    .min(2)
    .regex(/^[\p{L}\p{N}-]+$/u, "الرابط يجب أن يحتوي أحرف وأرقام وشرطات فقط"),
  description: z.string().trim().optional().or(z.literal("")),
  descriptionEn: z.string().trim().optional().or(z.literal("")),
  heroImage: z.string().trim().optional().or(z.literal("")),
  accentColor: z.string().trim().min(4),
  featured: z.boolean(),
  sortOrder: z.number().int(),
});

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" }, { status: 400 });
  }
  const data = parsed.data;

  const slugExists = await prisma.collection.findUnique({ where: { slug: data.slug } });
  if (slugExists) return NextResponse.json({ error: "الرابط مستخدم بالفعل" }, { status: 409 });

  const collection = await prisma.collection.create({
    data: {
      name: data.name,
      nameEn: data.nameEn || null,
      slug: data.slug,
      description: data.description || null,
      descriptionEn: data.descriptionEn || null,
      heroImage: data.heroImage || null,
      accentColor: data.accentColor,
      featured: data.featured,
      sortOrder: data.sortOrder,
    },
  });

  return NextResponse.json({ collection });
}
