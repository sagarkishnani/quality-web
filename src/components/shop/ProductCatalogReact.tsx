import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaMagnifyingGlass, FaChevronUp, FaCheck, FaSliders } from "react-icons/fa6";
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
  quoteMessage: string;
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

interface ChipProps {
  label: string;
  pressed: boolean;
  onClick: () => void;
}

function Chip({ label, pressed, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`h-11 shrink-0 whitespace-nowrap rounded-full border px-4 text-body-sm transition-colors duration-300 motion-reduce:transition-none ${
        pressed ? "border-ink bg-ink font-semibold text-white" : "border-line-strong bg-surface-raised font-medium text-content-strong"
      }`}
    >
      {label}
    </button>
  );
}

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  onClear: () => void;
  groups: FacetGroupProps[];
  resultLabel: string;
}

function FilterSheet({ open, onClose, onClear, groups, resultLabel }: FilterSheetProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    titleRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [open, onClose]);

  return (
    <div className="lg:hidden" inert={!open} data-lenis-prevent>
      <div
        aria-hidden
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-ink/35 transition-opacity duration-300 motion-reduce:transition-none ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />
      <div
        id="catalog-filters"
        role="dialog"
        aria-modal="true"
        aria-labelledby="catalog-filters-title"
        className={`fixed inset-x-0 bottom-0 z-[61] flex max-h-[80dvh] flex-col rounded-t-panel bg-surface-raised transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-center pb-1 pt-2.5" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-line-strong" />
        </div>
        <div className="flex items-center justify-between px-6 pb-1 pt-2">
          <h2 id="catalog-filters-title" ref={titleRef} tabIndex={-1} className="text-subtitle-xs font-bold focus:outline-none">
            Filtros
          </h2>
          <button type="button" onClick={onClear} className="min-h-11 text-body-sm font-semibold text-brand-secondary-dark">
            Limpiar
          </button>
        </div>
        <div className="overflow-y-auto px-6">
          {groups.map((group) =>
            group.options.length ? (
              <fieldset key={group.title} className="border-b border-line-soft pb-4">
                <legend className="pt-4 text-body-md font-semibold">{group.title}</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.options.map((option) => (
                    <Chip
                      key={option.label}
                      label={`${option.label} (${option.count})`}
                      pressed={group.selected.includes(option.label)}
                      onClick={() => group.onToggle(option.label)}
                    />
                  ))}
                </div>
              </fieldset>
            ) : null
          )}
        </div>
        <div className="px-6 pb-7 pt-4">
          <button type="button" onClick={onClose} className="btn-primary btn-xl w-full">
            {resultLabel}
          </button>
        </div>
      </div>
    </div>
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

export default function ProductCatalogReact({ items, segments, productsPath, labels, emptyCatalogMessage, quoteMessage }: Props) {
  const [segment, setSegment] = useState("all");
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [term, setTerm] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

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

  const activeFilterCount = categories.length + brands.length;
  const hasFilters = categories.length > 0 || brands.length > 0 || term.trim() !== "";
  const clearFilters = () => {
    setCategories([]);
    setBrands([]);
    setTerm("");
  };
  const clearFacets = () => {
    setCategories([]);
    setBrands([]);
  };
  const closeFilters = useCallback(() => {
    setFiltersOpen(false);
    filterButtonRef.current?.focus();
  }, []);
  const facetGroups: FacetGroupProps[] = [
    { title: labels.categoryTitle, options: countBy(inSegment, "category"), selected: categories, onToggle: (v) => setCategories((list) => toggleValue(list, v)) },
    { title: labels.brandTitle, options: countBy(inSegment, "brand"), selected: brands, onToggle: (v) => setBrands((list) => toggleValue(list, v)) },
  ];
  const resultCount = `${visible.length} ${visible.length === 1 ? "producto" : "productos"}`;
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
          <div role="group" aria-label="Segmentos" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-16 pt-6 [scrollbar-width:none] md:-mx-8 md:px-8 lg:hidden [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => (
              <Chip key={tab.slug} label={tab.label} pressed={segment === tab.slug} onClick={() => pickSegment(tab.slug)} />
            ))}
          </div>
          <div role="tablist" aria-label="Segmentos" className="-mb-px hidden gap-8 overflow-x-auto pb-16 pt-8 lg:flex">
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
          <aside className="hidden space-y-6 lg:sticky lg:block lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
            {facetGroups.map((group) => (
              <FacetGroup key={group.title} {...group} />
            ))}
            {hasFilters && (
              <button type="button" onClick={clearFilters} className="text-body-sm font-semibold underline underline-offset-4">
                Limpiar filtros
              </button>
            )}
          </aside>

          <div>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <label className="flex flex-1 items-center gap-3 rounded-md bg-surface px-4 lg:order-1">
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
              <div className="flex gap-3 lg:contents">
                <button
                  ref={filterButtonRef}
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  aria-haspopup="dialog"
                  aria-expanded={filtersOpen}
                  aria-controls="catalog-filters"
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-md border border-line-strong bg-surface-raised text-body-sm font-semibold lg:hidden"
                >
                  <FaSliders className="h-3.5 w-3.5" aria-hidden />
                  Filtrar
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-secondary-darkest px-1.5 text-caption-sm font-semibold text-white">
                      <span className="sr-only">filtros activos: </span>
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                <label className="flex-1 lg:order-3 lg:flex-none lg:shrink-0">
                  <span className="sr-only">Ordenar</span>
                  <select
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className="h-12 w-full rounded-md border border-line-strong bg-surface-raised px-4 text-body-sm focus:outline-none focus:ring-2 focus:ring-brand-primary lg:w-auto"
                  >
                    <option value="popular">Populares</option>
                    <option value="az">Nombre A–Z</option>
                    <option value="za">Nombre Z–A</option>
                  </select>
                </label>
              </div>
              <p className="shrink-0 text-body-base font-semibold lg:order-2" aria-live="polite">
                {resultCount}
              </p>
            </div>

            {visible.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-6 lg:mt-8 xl:grid-cols-3">
                {visible.map((item) => (
                  <ProductTile key={item.id} item={item} href={`${productsPath}/${item.slug}`} buttonLabel={labels.cardButton} quoteMessage={quoteMessage} tone="sunken" compact />
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

      {mounted &&
        createPortal(
          <FilterSheet open={filtersOpen} onClose={closeFilters} onClear={clearFacets} groups={facetGroups} resultLabel={`Ver ${resultCount}`} />,
          document.body
        )}
    </>
  );
}
