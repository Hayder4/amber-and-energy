export interface DiscountLike {
  code: string | null;
  type: string;
  value: number;
  productId: string | null;
  collectionId: string | null;
  active: boolean;
  startsAt: Date | null;
  endsAt: Date | null;
}

export interface PricedProduct {
  id: string;
  price: number;
  compareAtPrice: number | null;
  collectionId: string | null;
}

export function findAutomaticDiscount(product: PricedProduct, discounts: DiscountLike[]) {
  const now = Date.now();
  return (
    discounts.find((d) => {
      if (!d.active || d.code) return false;
      if (d.startsAt && d.startsAt.getTime() > now) return false;
      if (d.endsAt && d.endsAt.getTime() < now) return false;
      return d.productId === product.id || (d.collectionId && d.collectionId === product.collectionId);
    }) ?? null
  );
}

export function getProductPricing(product: PricedProduct, discounts: DiscountLike[]) {
  const auto = findAutomaticDiscount(product, discounts);
  if (auto) {
    const discounted =
      auto.type === "PERCENTAGE" ? product.price * (1 - auto.value / 100) : product.price - auto.value;
    const finalPrice = Math.max(0, Math.round(discounted * 100) / 100);
    return {
      price: finalPrice,
      originalPrice: product.price,
      onSale: finalPrice < product.price,
      discountPercent: Math.round((1 - finalPrice / product.price) * 100),
    };
  }
  if (product.compareAtPrice && product.compareAtPrice > product.price) {
    return {
      price: product.price,
      originalPrice: product.compareAtPrice,
      onSale: true,
      discountPercent: Math.round((1 - product.price / product.compareAtPrice) * 100),
    };
  }
  return { price: product.price, originalPrice: null, onSale: false, discountPercent: 0 };
}

export function applyCoupon(
  subtotal: number,
  discount: DiscountLike | null
): { discountTotal: number } {
  if (!discount) return { discountTotal: 0 };
  const raw = discount.type === "PERCENTAGE" ? subtotal * (discount.value / 100) : discount.value;
  return { discountTotal: Math.min(subtotal, Math.max(0, Math.round(raw * 100) / 100)) };
}
