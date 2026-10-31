import client from "../../../tina/__generated__/client";
import { DEFAULT_ATTRIBUTES, slugify, uniqueSorted, type CatalogAttributes, type CatalogItem } from "../woo/catalog";

const DEFAULT_QUOTE_MESSAGE = "Hola, quisiera una cotización de {cantidad} × {producto}.";

export interface FacetOption {
  label: string;
  slug: string;
}

export async function loadShopContent() {
  const result = await client.queries.shop({ relativePath: "index.json" });
  const catalog = result.data?.shop?.catalog;
  const attributes: CatalogAttributes = {
    brand: catalog?.brandAttribute || DEFAULT_ATTRIBUTES.brand,
    segment: catalog?.segmentAttribute || DEFAULT_ATTRIBUTES.segment,
  };
  const segmentOrder = (catalog?.segmentOrder ?? []).filter((value): value is string => Boolean(value));
  const quoteMessage = result.data?.shop?.product?.quoteMessage || DEFAULT_QUOTE_MESSAGE;
  return { result, attributes, segmentOrder, quoteMessage };
}

export function orderedSegments(items: CatalogItem[], segmentOrder: string[]): FacetOption[] {
  const present = uniqueSorted(items.map((item) => item.segment));
  const rank = (label: string) => {
    const index = segmentOrder.findIndex((value) => value.toLowerCase() === label.toLowerCase());
    return index === -1 ? segmentOrder.length : index;
  };
  return present
    .sort((a, b) => rank(a) - rank(b))
    .map((label) => ({ label, slug: slugify(label) }));
}

export function facetOptions(values: string[]): FacetOption[] {
  return uniqueSorted(values).map((label) => ({ label, slug: slugify(label) }));
}
