import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { searchProducts, getActiveDiscounts } from "@/lib/data";
import { getProductPricing } from "@/lib/pricing";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const [products, discounts] = await Promise.all([searchProducts(q), getActiveDiscounts()]);
  const results = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    nameEn: p.nameEn,
    image: p.images[0] ?? null,
    pricing: getProductPricing(p, discounts),
  }));
  return NextResponse.json({ results });
}
