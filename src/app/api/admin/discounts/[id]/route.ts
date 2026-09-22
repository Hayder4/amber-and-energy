import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { DISCOUNT_TYPES } from "@/lib/types";

const schema = z.object({
  code: z.string().trim().optional().or(z.literal("")),
  label: z.string().trim().min(2),
  type: z.enum(DISCOUNT_TYPES),
  value: z.number().min(0),
  scope: z.enum(["NONE", "PRODUCT", "COLLECTION"]),
  productId: z.string().optional().or(z.literal("")),
  collectionId: z.string().optional().or(z.literal("")),
  active: z.boolean(),
  usageLimit: z.number().int().min(0).nullable().optional(),
  startsAt: z.string().optional().or(z.literal("")),
  endsAt: z.string().optional().or(z.literal("")),
});

function buildData(data: z.infer<typeof schema>) {
  return {
    code: data.code ? data.code.toUpperCase() : null,
    label: data.label,
    type: data.type,
    value: data.value,
    productId: data.scope === "PRODUCT" ? data.productId || null : null,
    collectionId: data.scope === "COLLECTION" ? data.collectionId || null : null,
    active: data.active,
    usageLimit: data.usageLimit ?? null,
    startsAt: data.startsAt ? new Date(data.startsAt) : null,
    endsAt: data.endsAt ? new Date(data.endsAt) : null,
  };
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.discount.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "الخصم غير موجود" }, { status: 404 });

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" }, { status: 400 });
  }
  const data = parsed.data;

  if (data.code) {
    const conflict = await prisma.discount.findFirst({
      where: { code: data.code.toUpperCase(), NOT: { id } },
    });
    if (conflict) return NextResponse.json({ error: "كود الخصم مستخدم بالفعل" }, { status: 409 });
  }

  const discount = await prisma.discount.update({ where: { id }, data: buildData(data) });
  return NextResponse.json({ discount });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.discount.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "الخصم غير موجود" }, { status: 404 });

  await prisma.discount.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
