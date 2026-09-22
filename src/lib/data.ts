import "server-only";
import { prisma } from "@/lib/prisma";

export function serializeProduct<T extends { images: string; createdAt: Date; updatedAt: Date }>(
  product: T
) {
  return {
    ...product,
    images: JSON.parse(product.images) as string[],
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export async function getActiveDiscounts() {
  return prisma.discount.findMany({ where: { active: true } });
}

export async function getFeaturedCollections() {
  return prisma.collection.findMany({
    orderBy: { sortOrder: "asc" },
    where: { featured: true },
  });
}

export async function getAllCollections() {
  return prisma.collection.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

export async function getCollectionBySlug(slug: string) {
  return prisma.collection.findUnique({ where: { slug } });
}

export async function getProductsByCollection(collectionId: string) {
  const products = await prisma.product.findMany({
    where: { collectionId, status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProduct);
}

export async function getFeaturedProducts(take = 8) {
  const products = await prisma.product.findMany({
    where: { featured: true, status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take,
  });
  return products.map(serializeProduct);
}

export async function getNewProducts(take = 8) {
  const products = await prisma.product.findMany({
    where: { isNew: true, status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take,
  });
  return products.map(serializeProduct);
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { collection: true },
  });
  if (!product) return null;
  return serializeProduct(product);
}

export async function getRelatedProducts(collectionId: string | null, excludeId: string, take = 4) {
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      id: { not: excludeId },
      ...(collectionId ? { collectionId } : {}),
    },
    take,
    orderBy: { createdAt: "desc" },
  });
  return products.map(serializeProduct);
}

export async function searchProducts(query: string) {
  const q = query.trim();
  if (!q) return [];
  const products = await prisma.product.findMany({
    where: {
      status: "PUBLISHED",
      OR: [
        { name: { contains: q } },
        { nameEn: { contains: q } },
        { origin: { contains: q } },
        { sku: { contains: q } },
      ],
    },
    take: 12,
  });
  return products.map(serializeProduct);
}
