import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, isAdminEmail, setSessionCookie } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2, "الاسم قصير جدًا").max(80),
  email: z.string().trim().toLowerCase().email("بريد إلكتروني غير صالح"),
  password: z.string().min(8, "كلمة المرور يجب أن تكون 8 أحرف على الأقل"),
  phone: z.string().trim().max(20).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" }, { status: 400 });
  }
  const { name, email, password, phone } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "هذا البريد الإلكتروني مسجّل بالفعل" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const role = isAdminEmail(email) ? "ADMIN" : "CUSTOMER";

  const user = await prisma.user.create({
    data: { name, email, passwordHash, role, phone: phone || null },
  });

  await setSessionCookie({ sub: user.id, email: user.email, name: user.name, role: user.role as "ADMIN" | "CUSTOMER" });

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
}
