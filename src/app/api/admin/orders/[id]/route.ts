import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/types";

const schema = z.object({ status: z.enum(ORDER_STATUSES) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "غير مصرح" }, { status: 401 });

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });

  const order = await prisma.order.update({ where: { id }, data: { status: parsed.data.status } });
  return NextResponse.json({ order });
}
