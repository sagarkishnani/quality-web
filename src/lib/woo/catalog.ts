import type { WooProduct } from "./types";

export interface CatalogAttributes {
  brand: string;
  segment: string;
}

export interface CatalogItem {
  id: number;
  name: string;
  slug: string;
  brand: string;
  segment: string;
  segmentSlug: string;
  category: string;
  categorySlug: string;
  image: string;
  imageAlt: string;
  badge: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export const DEFAULT_ATTRIBUTES: CatalogAttributes = { brand: "Marca", segment: "Segmento" };
export const DATASHEET_META_KEY = "ficha_tecnica";

const DATASHEET_URL = /^https?:\/\//i;

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function sameName(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

export function attributeValue(product: WooProduct, attributeName: string): string {
  const attribute = product.attributes.find((a) => sameName(a.name, attributeName));
  return attribute?.options.join(", ") ?? "";
}

export function badgeOf(product: WooProduct): string {
  if (product.on_sale) return "Oferta";
  return product.tags[0]?.name ?? "";
}

export function specsOf(product: WooProduct, attributes: CatalogAttributes): ProductSpec[] {
  return product.attributes
    .filter((a) => !sameName(a.name, attributes.brand) && !sameName(a.name, attributes.segment))
    .map((a) => ({ label: a.name, value: a.options.join(", ") }))
    .filter((spec) => spec.value);
}

export function datasheetUrlOf(product: WooProduct): string | undefined {
  const value = product.meta_data.find((meta) => meta.key === DATASHEET_META_KEY)?.value;
  if (typeof value !== "string") return undefined;
  const url = value.trim();
  return DATASHEET_URL.test(url) ? url : undefined;
}

export function toCatalogItem(product: WooProduct, attributes: CatalogAttributes): CatalogItem {
  const segment = attributeValue(product, attributes.segment);
  const category = product.categories[0];
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    brand: attributeValue(product, attributes.brand),
    segment,
    segmentSlug: slugify(segment),
    category: category?.name ?? "",
    categorySlug: category?.slug ?? "",
    image: product.images[0]?.src ?? "",
    imageAlt: product.images[0]?.alt || product.name,
    badge: badgeOf(product),
  };
}

export function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, "es"));
}
