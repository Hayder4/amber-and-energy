import { cookies } from "next/headers";
import { CollectionCard } from "@/components/shop/collection-card";
import { RevealGroup, Reveal } from "@/components/motion/reveal";
import { getAllCollections } from "@/lib/data";
import { dictionary, type Locale } from "@/lib/dictionary";

export const metadata = { title: "المجموعات | Amberandenergy" };

export default async function CollectionsPage() {
  const cookieStore = await cookies();
  const locale = (cookieStore.get("ae_locale")?.value === "en" ? "en" : "ar") as Locale;
  const dict = dictionary[locale];
  const collections = await getAllCollections();

  return (
    <div className="mx-auto max-w-7xl px-6 py-16 md:px-8">
      <Reveal className="mb-12 text-center">
        <p className="mb-3 text-xs font-medium tracking-[0.3em] text-amber-400 uppercase">
          {dict.nav.collections}
        </p>
        <h1 className="font-display text-4xl text-foreground md:text-5xl">
          {locale === "ar" ? "كل المجموعات" : "All Collections"}
        </h1>
      </Reveal>

      <RevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <CollectionCard
            key={c.id}
            slug={c.slug}
            name={c.name}
            nameEn={c.nameEn}
            image={c.heroImage}
            count={c._count.products}
          />
        ))}
      </RevealGroup>
    </div>
  );
}
