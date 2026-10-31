import { useEffect, useMemo, useState } from "react";
import { FaMagnifyingGlass, FaChevronUp, FaCheck } from "react-icons/fa6";
import ProductTile from "../ui/ProductTile";
import { slugify, type CatalogItem } from "../../lib/woo/catalog";
import type { FacetOption } from "../../lib/content/shopSettings";

type SortKey = "popular" | "az" | "za";

interface Labels {
  all: string;
  searchPlaceholder: string;
  categoryTitle: string;
  brandTitle: string;
  emptyMessage: string;
  cardButton: string;
}

interface Props {
  items: CatalogItem[];
  segments: FacetOption[];
  productsPath: string;
  labels: Labels;
  emptyCatalogMessage: string;
}

interface FacetGroupProps {
  title: string;
  options: { label: string; count: number }[];
  selected: string[];
  onToggle: (value: string) => void;
}

function FacetGroup({ title, options, selected, onToggle }: FacetGroupProps) {
  const [open, setOpen] = useState(true);
  if (!options.length) return null;

  return (
    <fieldset className="border-b border-line pb-6">
      <legend className="w-full">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center justify-between py-1 text-body-md font-semibold"
        >
          {title}
          <FaChevronUp className={`h-3 w-3 transition-transform duration-300 ${open ? "" : "rotate-180"}`} aria-hidden />
        </button>
      </legend>
      {open && (
        <div className="mt-4 space-y-3">
          {options.map((option) => {
            const checked = selected.includes(option.label);
            return (
              <label key={option.label} className="flex cursor-pointer items-start gap-3 text-body-base text-content-strong">
                <input type="checkbox" className="peer sr-only" checked={checked} onChange={() => onToggle(option.label)} />
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-xs border transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary ${
                    checked ? "border-ink bg-ink text-white" : "border-line-strong bg-surface-raised"
                  }`}
                >
                  {checked && <FaCheck className="h-2.5 w-2.5" />}
                </span>
                <span className="flex-1">{option.label}</span>
                <span className="text-content-subtle">({option.count})</span>
              </label>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}

function countBy(items: CatalogItem[], key: "category" | "brand") {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (item[key]) counts.set(item[key], (counts.get(item[key]) ?? 0) + 1);
  }
  return [...counts.entries()]
    .sort(([a], [b]) => a.localeCompare(b, "es"))
    .map(([label, count]) => ({ label, count }));
}

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];
}

function readInitialFilters(items: CatalogItem[], segments: FacetOption[]) {
  const params = new URLSearchParams(window.location.search);
  const segment = segments.find((s) => s.slug === params.get("segmento"))?.slug ?? "all";
  const brandSlug = params.get("marca");
  const categorySlug = params.get("categoria");
  const brand = brandSlug ? items.find((i) => slugify(i.brand) === brandSlug)?.brand : undefined;
  const category = categorySlug ? items.find((i) => i.categorySlug === categorySlug)?.category : undefined;
  return { segment, brands: brand ? [brand] : [], categories: category ? [category] : [], term: params.get("q") ?? "" };
}

export default function ProductCatalogReact({ items, segments, productsPath, labels, emptyCatalogMessage }: Props) {
  const [segment, setSegment] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [term, setTerm] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");

  useEffect(() => {
    const initial = readInitialFilters(items, segments);
    setSegment(initial.segment);
    setBrands(initial.brands);
    setCategories(initial.categories);
    setTerm(initial.term);
  }, [items, segments]);

  const inSegment = useMemo(() => {
    const needle = term.trim().toLowerCase();
    return items.filter(
      (item) =>
        (segment === "all" || item.segmentSlug === segment) &&
        (!needle || `${item.name} ${item.brand}`.toLowerCase().includes(needle))
    );
  }, [items, segment, term]);

  const visible = useMemo(() => {
    const filtered = inSegment.filter(
      (item) => (!categories.length || categories.includes(item.category)) && (!brands.length || brands.includes(item.brand))
    );
    if (sort === "az") return [...filtered].sort((a, b) => a.name.localeCompare(b.name, "es"));
    if (sort === "za") return [...filtered].sort((a, b) => b.name.localeCompare(a.name, "es"));
    return filtered;
  }, [inSegment, categories, brands, sort]);

  const hasFilters = categories.length > 0 || brands.length > 0 || term.trim() !== "";
  const clearFilters = () => {
    setCategories([]);
    setBrands([]);
    setTerm("");
  };
  const pickSegment = (slug: string) => {
    setSegment(slug);
    setCategories([]);
    setBrands([]);
  };

  const tabs = [{ label: labels.all, slug: "all" }, ...segments];

  return (
    <>
      {segments.length > 0 && (
        <div className="container-xl">
          <div role="tablist" aria-label="Segmentos" className="-mb-px flex gap-8 overflow-x-auto pb-16 pt-8">
            {tabs.map((tab) => {
              const selected = segment === tab.slug;
              return (
                <button
                  key={tab.slug}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => pickSegment(tab.slug)}
                  className={`shrink-0 border-b-2 pb-2 text-body-md transition-colors ${
                    selected ? "border-ink font-semibold text-content" : "border-transparent font-medium text-content-subtle hover:text-content"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="sheet bg-surface-raised">
        <div className="container-xl grid gap-10 py-14 lg:grid-cols-[240px_1fr] lg:gap-14">
          <aside className="space-y-6">
            <FacetGroup title={labels.categoryTitle} options={countBy(inSegment, "category")} selected={categories} onToggle={(v) => setCategories((list) => toggleValue(list, v))} />
            <FacetGroup title={labels.brandTitle} options={countBy(inSegment, "brand")} selected={brands} onToggle={(v) => setBrands((list) => toggleValue(list, v))} />
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="text-body-sm font-semibold underline underline-offset-4">
                Limpiar filtros
              </button>
            )}
          </aside>

          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <label className="flex flex-1 items-center gap-3 rounded-md bg-surface px-4">
                <FaMagnifyingGlass className="h-3.5 w-3.5 text-content-subtle" aria-hidden />
                <span className="sr-only">{labels.searchPlaceholder}</span>
                <input
                  type="search"
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder={labels.searchPlaceholder}
                  className="h-12 w-full bg-transparent text-body-sm placeholder:text-content-subtle focus:outline-none"
                />
              </label>
              <p className="shrink-0 text-body-base font-semibold" aria-live="polite">
                {visible.length} {visible.length === 1 ? "producto" : "productos"}
              </p>
              <label className="shrink-0">
                <span className="sr-only">Ordenar</span>
                <select
                  value={sort}
                  onChange={(event) => setSort(event.target.value as SortKey)}
                  className="h-12 rounded-md border border-line-strong bg-surface-raised px-4 text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                >
                  <option value="popular">Ordenar: Populares</option>
                  <option value="az">Ordenar: Nombre A–Z</option>
                  <option value="za">Ordenar: Nombre Z–A</option>
                </select>
              </label>
            </div>

            {visible.length > 0 ? (
              <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((item) => (
                  <ProductTile key={item.id} item={item} href={`${productsPath}/${item.slug}`} buttonLabel={labels.cardButton} tone="sunken" />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-2xl border border-dashed border-line-strong px-6 py-20 text-center text-body-md text-content-muted">
                {items.length ? labels.emptyMessage : emptyCatalogMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
