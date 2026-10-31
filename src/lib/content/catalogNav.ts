import { getCatalogItems } from "../woo/rest";
import { loadShopContent, orderedSegments, facetOptions } from "./shopSettings";

export interface NavLink {
  label: string;
  href: string;
}

export interface CatalogNav {
  segments: NavLink[];
  categories: NavLink[];
  brands: NavLink[];
  products: NavLink[];
}

export function productsPath(): string {
  return `${(import.meta.env.BASE_URL || "/").replace(/\/?$/, "/")}productos`;
}

export async function loadCatalogNav(): Promise<CatalogNav> {
  const { attributes, segmentOrder } = await loadShopContent();
  const items = await getCatalogItems(attributes);
  const root = productsPath();

  return {
    segments: orderedSegments(items, segmentOrder).map((s) => ({ label: s.label, href: `${root}?segmento=${s.slug}` })),
    categories: facetOptions(items.map((i) => i.category)).map((c) => ({
      label: c.label,
      href: `${root}/categoria/${items.find((i) => i.category === c.label)?.categorySlug ?? c.slug}`,
    })),
    brands: facetOptions(items.map((i) => i.brand)).map((b) => ({ label: b.label, href: `${root}?marca=${b.slug}` })),
    products: items.slice(0, 60).map((i) => ({ label: `${i.brand} ${i.name}`.trim(), href: `${root}/${i.slug}` })),
  };
}
