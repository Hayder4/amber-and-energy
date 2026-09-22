import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyCoupon } from "@/lib/pricing";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")?.trim();
  const subtotal = Number(request.nextUrl.searchParams.get("subtotal") ?? 0);
  if (!code) return NextResponse.json({ valid: false, error: "أدخل كود الخصم" }, { status: 400 });

  const now = new Date();
  const discount = await prisma.discount.findFirst({
    where: {
      code: { equals: code },
      active: true,
      OR: [{ startsAt: null }, { startsAt: { lte: now } }],
    },
  });

  const usable =
    discount &&
    (!discount.endsAt || discount.endsAt >= now) &&
    (!discount.usageLimit || discount.usedCount < discount.usageLimit);

  if (!usable) {
    return NextResponse.json({ valid: false, error: "كود الخصم غير صالح أو منتهي" }, { status: 400 });
  }

  const { discountTotal } = applyCoupon(subtotal, discount);
  return NextResponse.json({ valid: true, label: discount.label, discountTotal });
}
