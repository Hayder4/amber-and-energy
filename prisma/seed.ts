import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { COLLECTIONS, PRODUCTS, DISCOUNTS } from "../src/lib/catalog-seed-data.mjs";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

function stringifyImages(images: string[]) {
  return JSON.stringify(images);
}

async function main() {
  console.log("Seeding database…");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const collectionIdBySlug = new Map<string, string>();
  for (const c of COLLECTIONS) {
    const created = await prisma.collection.create({
      data: {
        slug: c.slug,
        name: c.name,
        nameEn: c.nameEn,
        description: c.description,
        descriptionEn: c.descriptionEn,
        heroImage: `/images/collections/${c.slug}.svg`,
        accentColor: c.accentColor,
        featured: c.featured,
        sortOrder: c.sortOrder,
      },
    });
    collectionIdBySlug.set(c.slug, created.id);
  }

  for (const p of PRODUCTS) {
    await prisma.product.create({
      data: {
        slug: p.slug,
        sku: p.sku,
        name: p.name,
        nameEn: p.nameEn,
        description: p.description,
        descriptionEn: p.descriptionEn,
        images: stringifyImages([
          `/images/products/${p.slug}-1.svg`,
          `/images/products/${p.slug}-2.svg`,
        ]),
        price: p.price,
        compareAtPrice: p.compareAtPrice ?? null,
        stock: p.stock,
        isUnique: p.isUnique,
        origin: p.origin,
        material: p.material,
        weightGrams: p.weightGrams ?? null,
        beadsCount: p.beadsCount ?? null,
        age: p.age ?? null,
        hasCertificate: p.hasCertificate,
        featured: p.featured,
        isNew: p.isNew,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        status: "PUBLISHED",
        collectionId: collectionIdBySlug.get(p.collectionSlug) ?? null,
      },
    });
  }

  for (const d of DISCOUNTS) {
    await prisma.discount.create({
      data: {
        code: d.code,
        label: d.label,
        type: d.type,
        value: d.value,
        collectionId: d.collectionSlug ? collectionIdBySlug.get(d.collectionSlug) : null,
        active: d.active,
        usageLimit: d.usageLimit ?? null,
      },
    });
  }

  // No admin account is pre-created here on purpose: whoever registers on the
  // storefront using one of the ADMIN_EMAILS (see .env) is promoted to ADMIN
  // automatically by /api/auth/register. That way no real password for the
  // owner's account ever lives in seed data or source control.
  console.log(`Seeded ${COLLECTIONS.length} collections, ${PRODUCTS.length} products, ${DISCOUNTS.length} discounts.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
