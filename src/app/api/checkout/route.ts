import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { getProductPricing, applyCoupon } from "@/lib/pricing";
import { generateOrderNumber } from "@/lib/utils";
import { PAYMENT_METHODS } from "@/lib/types";

const schema = z.object({
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().min(1).max(50) }))
    .min(1),
  guestName: z.string().trim().min(2).optional(),
  guestEmail: z.string().trim().email().optional(),
  guestPhone: z.string().trim().min(6).optional(),
  city: z.string().trim().min(2),
  district: z.string().trim().optional().or(z.literal("")),
  street: z.string().trim().min(3),
  notes: z.string().trim().optional().or(z.literal("")),
  paymentMethod: z.enum(PAYMENT_METHODS),
  discountCode: z.string().trim().optional().or(z.literal("")),
});

const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_FEE = 35;

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" }, { status: 400 });
  }
  const data = parsed.data;
  const session = await getSession();

  if (!session && (!data.guestName || !data.guestEmail || !data.guestPhone)) {
    return NextResponse.json({ error: "يرجى إدخال بيانات التواصل كاملة" }, { status: 400 });
  }

  const productIds = data.items.map((i) => i.productId);
  const [products, discounts] = await Promise.all([
    prisma.product.findMany({ where: { id: { in: productIds } } }),
    prisma.discount.findMany({ where: { active: true } }),
  ]);

  if (products.length !== productIds.length) {
    return NextResponse.json({ error: "أحد المنتجات لم يعد متوفرًا" }, { status: 400 });
  }

  const lines = data.items.map((item) => {
    const product = products.find((p) => p.id === item.productId)!;
    const pricing = getProductPricing(product, discounts);
    return { product, quantity: item.quantity, pricing };
  });

  for (const line of lines) {
    if (line.quantity > line.product.stock) {
      return NextResponse.json(
        { error: `الكمية المطلوبة من "${line.product.name}" غير متوفرة` },
        { status: 400 }
      );
    }
  }

  const subtotal = lines.reduce((sum, l) => sum + l.pricing.price * l.quantity, 0);

  let codeDiscount = null as (typeof discounts)[number] | null;
  if (data.discountCode) {
    const now = new Date();
    codeDiscount = discounts.find(
      (d) =>
        d.code?.toLowerCase() === data.discountCode!.toLowerCase() &&
        d.active &&
        (!d.startsAt || d.startsAt <= now) &&
        (!d.endsAt || d.endsAt >= now) &&
        (!d.usageLimit || d.usedCount < d.usageLimit)
    ) ?? null;
    if (!codeDiscount) {
      return NextResponse.json({ error: "كود الخصم غير صالح أو منتهي" }, { status: 400 });
    }
  }

  const { discountTotal } = applyCoupon(subtotal, codeDiscount);
  const shippingFee = subtotal - discountTotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = Math.max(0, subtotal - discountTotal + shippingFee);

  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        number: generateOrderNumber(),
        userId: session?.sub ?? null,
        guestName: session ? null : data.guestName,
        guestEmail: session ? null : data.guestEmail,
        guestPhone: session ? null : data.guestPhone,
        city: data.city,
        district: data.district || null,
        street: data.street,
        notes: data.notes || null,
        paymentMethod: data.paymentMethod,
        subtotal,
        discountTotal,
        shippingFee,
        total,
        discountCode: codeDiscount?.code ?? null,
        items: {
          create: lines.map((l) => ({
            productId: l.product.id,
            name: l.product.name,
            image: JSON.parse(l.product.images)[0] ?? null,
            price: l.pricing.price,
            quantity: l.quantity,
          })),
        },
      },
    });

    for (const line of lines) {
      await tx.product.update({
        where: { id: line.product.id },
        data: { stock: { decrement: line.quantity } },
      });
    }

    if (codeDiscount) {
      await tx.discount.update({
        where: { id: codeDiscount.id },
        data: { usedCount: { increment: 1 } },
      });
    }

    return created;
  });

  return NextResponse.json({ order: { id: order.id, number: order.number, total: order.total } });
}
