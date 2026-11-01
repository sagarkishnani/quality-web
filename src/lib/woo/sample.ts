import type { WooProduct, WooCategory, WooTermRef } from "./types";

const BASE = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");

const CATEGORIES: WooCategory[] = [
  { id: 11, name: "Impresora multifuncional", slug: "impresora-multifuncional", parent: 0, count: 3, image: null },
  { id: 12, name: "Impresora a color", slug: "impresora-a-color", parent: 0, count: 1, image: null },
  { id: 13, name: "Impresora monocromática", slug: "impresora-monocromatica", parent: 0, count: 2, image: null },
  { id: 14, name: "Escáner", slug: "escaner", parent: 0, count: 1, image: null },
];

const TAGS: Record<string, WooTermRef> = {
  bestSeller: { id: 21, name: "Más vendido", slug: "mas-vendido" },
  new: { id: 22, name: "Nuevo", slug: "nuevo" },
};

const M608_SPECS: [string, string][] = [
  ["Velocidad", "Hasta 61 ppm"],
  ["Ciclo de trabajo", "Hasta 275,000 páginas / mes"],
  ["Tamaños de papel", "99 × 148 mm a 216 × 356 mm"],
  ["Cantidad bandejas", "Dos, opcional (4 bandejas adicionales)"],
  ["Conectividad", "1 host USB 2.0, red Gigabit 10/100/1000Base-TX, red inalámbrica integrada"],
  ["Conectividad móvil", "HP ePrint; Wi-Fi Direct; Apple AirPrint™; Certificación Mopria"],
  ["Tecnología", "Láser"],
  ["Resolución", "1200 × 1200 dpi"],
  ["Capacidad de entrada", "650 páginas"],
  ["Tamaño", "43.1 × 46.6 × 38 cm"],
  ["Peso", "21.6 kg"],
];

interface SampleSeed {
  id: number;
  name: string;
  slug: string;
  brand: string;
  segment: string;
  categoryId: number;
  images: string[];
  tag?: WooTermRef;
  onSale?: boolean;
  featured?: boolean;
  specs?: [string, string][];
  description?: string;
  crossSells?: number[];
}

const SEEDS: SampleSeed[] = [
  { id: 101, name: "WorkCentre 3345", slug: "workcentre-3345", brand: "Xerox", segment: "Home & Home Office", categoryId: 11, images: ["workcentre-3345"], tag: TAGS.bestSeller, featured: true },
  {
    id: 102,
    name: "LaserJet Enterprise M608",
    slug: "laserjet-enterprise-m608",
    brand: "HP",
    segment: "Enterprise",
    categoryId: 13,
    images: ["laserjet-m608", "laserjet-m608-4", "laserjet-m608-2", "laserjet-m608-frente", "laserjet-m608-3", "laserjet-m608-1"],
    featured: true,
    specs: M608_SPECS,
    description:
      "<p>Esta impresora <strong>HP LaserJet con JetIntelligence</strong> combina un rendimiento excepcional y eficiencia energética con documentos de calidad profesional justo cuando los necesita, todo mientras protege su red de ataques con la seguridad más profunda de HP.</p>",
    crossSells: [104],
  },
  { id: 103, name: "B215", slug: "b215", brand: "Xerox", segment: "Home & Home Office", categoryId: 11, images: ["b215"], tag: TAGS.new, featured: true },
  { id: 104, name: "LaserJet M2727 nf", slug: "laserjet-m2727-nf", brand: "HP", segment: "Small Business", categoryId: 11, images: ["laserjet-m2727"], onSale: true, featured: true },
  { id: 105, name: "AltaLink B8090", slug: "altalink-b8090", brand: "Xerox", segment: "Enterprise", categoryId: 14, images: ["altalink-b8090"] },
  { id: 106, name: "VersaLink C600", slug: "versalink-c600", brand: "Xerox", segment: "Small Business", categoryId: 12, images: ["versalink-c600"] },
  { id: 107, name: "LaserJet E60055", slug: "laserjet-e60055", brand: "HP", segment: "Small Business", categoryId: 13, images: ["laserjet-e60055"] },
];

function toProduct(seed: SampleSeed): WooProduct {
  const category = CATEGORIES.find((c) => c.id === seed.categoryId)!;
  return {
    id: seed.id,
    name: seed.name,
    slug: seed.slug,
    permalink: "",
    type: "simple",
    description: seed.description ?? `<p>${seed.brand} ${seed.name}: ${category.name.toLowerCase()} de última generación.</p>`,
    short_description: "",
    sku: "",
    price: "",
    regular_price: "",
    sale_price: "",
    on_sale: Boolean(seed.onSale),
    purchasable: false,
    stock_status: "instock",
    stock_quantity: null,
    average_rating: "0",
    rating_count: 0,
    featured: Boolean(seed.featured),
    categories: [{ id: category.id, name: category.name, slug: category.slug }],
    tags: seed.tag ? [seed.tag] : [],
    images: seed.images.map((file) => ({ src: `${BASE}images/productos/${file}.webp`, alt: seed.name })),
    attributes: [
      { name: "Marca", options: [seed.brand] },
      { name: "Segmento", options: [seed.segment] },
      ...(seed.specs ?? []).map(([name, value]) => ({ name, options: [value] })),
    ],
    related_ids: SEEDS.filter((s) => s.id !== seed.id && s.categoryId === seed.categoryId).map((s) => s.id),
    cross_sell_ids: seed.crossSells ?? [],
    meta_data: [],
  };
}

export const sampleProducts: WooProduct[] = SEEDS.map(toProduct);
export const sampleCategories: WooCategory[] = CATEGORIES;
