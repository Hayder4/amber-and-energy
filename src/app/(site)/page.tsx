import { cookies } from "next/headers";
import { Hero } from "@/components/home/hero";
import { SectionHeading } from "@/components/home/section-heading";
import { WhyUs } from "@/components/home/why-us";
import { Testimonials } from "@/components/home/testimonials";
import { Newsletter } from "@/components/home/newsletter";
import { CollectionCard } from "@/components/shop/collection-card";
import { ProductGrid } from "@/components/shop/product-grid";
import { RevealGroup } from "@/components/motion/reveal";
import { dictionary, type Locale } from "@/lib/dictionary";
import {
  getActiveDiscounts,
  getFeaturedCollections,
  getFeaturedProducts,
  getNewProducts,
} from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("ae_locale")?.value === "en" ? "en" : "ar") as Locale;
  const dict = dictionary[locale];

  const [collections, featured, fresh, discounts] = await Promise.all([
    getFeaturedCollections(),
    getFeaturedProducts(8),
    getNewProducts(8),
    getActiveDiscounts(),
  ]);

  const counts = await prisma.product.groupBy({
    by: ["collectionId"],
    _count: { _all: true },
    where: { status: "PUBLISHED" },
  });
  const countMap = new Map(counts.map((c) => [c.collectionId, c._count._all]));

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-20 md:px-8">
        <SectionHeading
          title={dict.home.featuredCollections}
          subtitle={dict.home.featuredCollectionsSub}
          viewAllHref="/collections"
          viewAllLabel={dict.home.viewAll}
        />
        <RevealGroup className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((c, i) => (
            <div key={c.id} className={i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
              <CollectionCard
                slug={c.slug}
                name={c.name}
                nameEn={c.nameEn}
                image={c.heroImage}
                count={countMap.get(c.id) ?? 0}
                size={i === 0 ? "lg" : "md"}
              />
            </div>
          ))}
        </RevealGroup>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12 md:px-8">
          <SectionHeading title={dict.home.bestSellers} viewAllHref="/collections" viewAllLabel={dict.home.viewAll} align="start" />
          <ProductGrid products={featured} discounts={discounts} />
        </section>
      )}

      <WhyUs />

      {fresh.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 py-12 md:px-8">
          <SectionHeading title={dict.home.newArrivals} viewAllHref="/collections" viewAllLabel={dict.home.viewAll} align="start" />
          <ProductGrid products={fresh} discounts={discounts} />
        </section>
      )}

      <Testimonials />
      <Newsletter />
    </div>
  );
}
