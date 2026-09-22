export const ROLES = ["CUSTOMER", "ADMIN"] as const;
export type Role = (typeof ROLES)[number];

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const DISCOUNT_TYPES = ["PERCENTAGE", "FIXED"] as const;
export type DiscountType = (typeof DISCOUNT_TYPES)[number];

export const PRODUCT_STATUSES = ["PUBLISHED", "DRAFT", "ARCHIVED"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PAYMENT_METHODS = ["COD", "BANK_TRANSFER"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: Role;
}

export interface SerializedProduct {
  id: string;
  slug: string;
  sku: string;
  name: string;
  nameEn: string | null;
  description: string;
  descriptionEn: string | null;
  images: string[];
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isUnique: boolean;
  origin: string | null;
  material: string;
  weightGrams: number | null;
  beadsCount: number | null;
  age: string | null;
  hasCertificate: boolean;
  featured: boolean;
  isNew: boolean;
  rating: number;
  reviewsCount: number;
  status: string;
  collectionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPricing {
  price: number;
  originalPrice: number | null;
  onSale: boolean;
  discountPercent: number;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  nameEn?: string | null;
  image: string | null;
  price: number;
  quantity: number;
  stock: number;
}
