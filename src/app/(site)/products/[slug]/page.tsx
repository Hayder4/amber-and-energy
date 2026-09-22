import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/shop/product-detail";
import { ProductGrid } from "@/components/shop/product-grid";
import { SectionHeading } from "@/components/home/section-heading";
import { getActiveDiscounts, getProductBySlug, getRelatedProducts } from "@/lib/data";
import { getProductPricing } from "@/lib/pricing";
import { dictionary, type Locale } from "@/lib/dictionary";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "PUBLISHED") notFound();

  const cookieStore = await cookies();
  const locale = (cookieStore.get("ae_locale")?.value === "en" ? "en" : "ar") as Locale;
  const dict = dictionary[locale];

  const [discounts, related] = await Promise.all([
    getActiveDiscounts(),
    getRelatedProducts(product.collectionId, product.id, 4),
  ]);

  const pricing = getProductPricing(product, discounts);

  return (
    <div>
      <ProductDetail product={product} pricing={pricing} />
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20 md:px-8">
          <SectionHeading title={dict.product.relatedProducts} align="start" />
          <ProductGrid products={related} discounts={discounts} />
        </section>
      )}
    </div>
  );
}
