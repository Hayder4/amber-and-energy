import { RevealGroup } from "@/components/motion/reveal";
import { ProductCard } from "@/components/shop/product-card";
import { getProductPricing, type DiscountLike } from "@/lib/pricing";
import type { SerializedProduct } from "@/lib/types";

export function ProductGrid({
  products,
  discounts,
}: {
  products: SerializedProduct[];
  discounts: DiscountLike[];
}) {
  if (products.length === 0) {
    return null;
  }
  return (
    <RevealGroup className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} pricing={getProductPricing(p, discounts)} />
      ))}
    </RevealGroup>
  );
}
