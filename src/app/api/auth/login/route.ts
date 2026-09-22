import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminEmail, setSessionCookie, verifyPassword } from "@/lib/auth";

const schema = z.object({
  email: z.string().trim().toLowerCase().email("بريد إلكتروني غير صالح"),
  password: z.string().min(1, "أدخل كلمة المرور"),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" }, { status: 400 });
  }
  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
  }

  // Promote to admin on login too, in case ADMIN_EMAILS changed after the account was created.
  const role = isAdminEmail(user.email) ? "ADMIN" : (user.role as "ADMIN" | "CUSTOMER");
  if (role !== user.role) {
    await prisma.user.update({ where: { id: user.id }, data: { role } });
  }

  await setSessionCookie({ sub: user.id, email: user.email, name: user.name, role });

  return NextResponse.json({
    user: { id: user.id, name: user.name, email: user.email, role },
  });
}
