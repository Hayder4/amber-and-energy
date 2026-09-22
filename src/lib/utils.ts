import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ARABIC_INDIC_DIGITS = "٠١٢٣٤٥٦٧٨٩";

export function formatPrice(value: number, locale: "ar" | "en" = "ar") {
  const currency = process.env.NEXT_PUBLIC_CURRENCY || "SAR";
  const formatted = new Intl.NumberFormat(locale === "ar" ? "ar-SA" : "en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
  return formatted;
}

export function toLatinDigits(input: string) {
  return input.replace(/[٠-٩]/g, (d) => String(ARABIC_INDIC_DIGITS.indexOf(d)));
}

export function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{N}-]+/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function generateSku(prefix = "AE") {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}-${rand}`;
}

export function generateOrderNumber() {
  const date = new Date();
  const y = date.getFullYear().toString().slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AE${y}${m}${d}-${rand}`;
}

export function parseImages(images: string): string[] {
  try {
    const parsed = JSON.parse(images);
    return Array.isArray(parsed) ? parsed.filter((i) => typeof i === "string") : [];
  } catch {
    return [];
  }
}

export function stringifyImages(images: string[]): string {
  return JSON.stringify(images.filter(Boolean));
}
