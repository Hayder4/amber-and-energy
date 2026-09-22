import Image from "next/image";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/reveal";
import { ProductGrid } from "@/components/shop/product-grid";
import { getActiveDiscounts, getCollectionBySlug, getProductsByCollection } from "@/lib/data";
import { dictionary, type Locale } from "@/lib/dictionary";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) notFound();

  const cookieStore = await cookies();
  const locale = (cookieStore.get("ae_locale")?.value === "en" ? "en" : "ar") as Locale;
  const dict = dictionary[locale];
  const pick = <T,>(ar: T, en: T | null | undefined) => (locale === "en" && en ? en : ar);

  const [products, discounts] = await Promise.all([
    getProductsByCollection(collection.id),
    getActiveDiscounts(),
  ]);

  return (
    <div>
      <section className="relative flex h-[46vh] min-h-[320px] items-end overflow-hidden">
        {collection.heroImage && (
          <Image
            src={collection.heroImage}
            alt={pick(collection.name, collection.nameEn)}
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />
        <Reveal className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-12 md:px-8">
          <p className="mb-2 text-xs font-medium tracking-[0.3em] text-amber-400 uppercase">
            {dict.nav.collections}
          </p>
          <h1 className="font-display max-w-2xl text-4xl text-foreground md:text-5xl">
            {pick(collection.name, collection.nameEn)}
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted md:text-base">
            {pick(collection.description, collection.descriptionEn)}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:px-8">
        {products.length === 0 ? (
          <p className="py-20 text-center text-muted">
            {locale === "ar" ? "لا توجد منتجات في هذه المجموعة حاليًا" : "No products in this collection yet"}
          </p>
        ) : (
          <ProductGrid products={products} discounts={discounts} />
        )}
      </section>
    </div>
  );
}
