import { useEffect, useRef, useState } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import { FaBars, FaXmark, FaMagnifyingGlass, FaArrowRight, FaChevronDown } from "react-icons/fa6";
import { tField, localizeHref } from "../../utils/i18n";
import { mediaUrl } from "../../utils/mediaUrl";
import type { Locale } from "../../i18n/config";
import type { CatalogNav, NavLink } from "../../lib/content/catalogNav";

type MenuKey = "services" | "products" | "search";

interface Props {
  query: string;
  variables: object;
  data: any;
  locale: Locale;
  currentPath: string;
  services: NavLink[];
  catalog: CatalogNav;
}

function isActive(currentPath: string, url: string): boolean {
  if (!url || url === "/") return false;
  const clean = (value: string) => value.replace(/\/+$/, "");
  return clean(currentPath) === clean(url) || clean(currentPath).startsWith(`${clean(url)}/`);
}

function MenuColumn({ title, links, onNavigate }: { title?: string | null; links: NavLink[]; onNavigate: () => void }) {
  if (!links.length) return null;
  return (
    <div>
      {title && <p className="mb-4 text-caption-sm font-semibold uppercase tracking-[0.14em] text-content-subtle">{title}</p>}
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={onNavigate}
              className="block rounded-md py-1.5 text-body-md text-content transition-colors hover:text-accent"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SearchPanel({ products, placeholder, popularTitle, onNavigate }: {
  products: NavLink[];
  placeholder: string;
  popularTitle: string;
  onNavigate: () => void;
}) {
  const [term, setTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setTimeout(() => inputRef.current?.focus(), 150);
    return () => window.clearTimeout(id);
  }, []);

  const normalized = term.trim().toLowerCase();
  const results = normalized ? products.filter((p) => p.label.toLowerCase().includes(normalized)) : products.slice(0, 6);
  const heading = normalized ? (results.length ? "Resultados" : `Sin resultados para “${term}”`) : popularTitle;

  return (
    <div className="mx-auto max-w-3xl">
      <label className="flex items-center gap-4 border-b border-line-strong pb-4">
        <FaMagnifyingGlass className="h-5 w-5 text-content-subtle" aria-hidden />
        <span className="sr-only">{placeholder}</span>
        <input
          ref={inputRef}
          type="search"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-subtitle-sm font-medium placeholder:text-content-subtle focus:outline-none"
        />
      </label>
      <p className="mt-6 text-caption-sm font-semibold uppercase tracking-[0.14em] text-content-subtle">{heading}</p>
      <ul className="mt-3 grid gap-1 sm:grid-cols-2">
        {results.slice(0, 10).map((product) => (
          <li key={product.href}>
            <a href={product.href} onClick={onNavigate} className="flex items-center justify-between rounded-md py-2 pr-2 text-body-md hover:text-accent">
              {product.label}
              <FaArrowRight className="h-3 w-3 opacity-50" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function HeaderReact({ query, variables, data: initialData, locale, currentPath, services, catalog }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const nav = data?.global?.nav;
  const servicesMenu = nav?.servicesMenu;
  const productsMenu = nav?.productsMenu;

  const [menu, setMenu] = useState<MenuKey | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenu(null);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openMenu = (key: MenuKey) => {
    window.clearTimeout(closeTimer.current);
    setMenu(key);
  };
  const scheduleClose = () => {
    if (menu === "search") return;
    closeTimer.current = window.setTimeout(() => setMenu(null), 120);
  };
  const close = () => {
    setMenu(null);
    setMobileOpen(false);
  };

  const links = (nav?.links || []).filter(Boolean);
  const panelOpen = menu !== null;
  const solid = scrolled && !panelOpen;
  const promoImage = mediaUrl(servicesMenu?.promoImage);

  return (
    <>
      <div
        aria-hidden
        onClick={close}
        className={`fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px] transition-opacity duration-300 ${
          panelOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <header
        onMouseLeave={scheduleClose}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid ? "border-b border-black/5 bg-surface/75 backdrop-blur-xl backdrop-saturate-150" : "border-b border-transparent bg-surface"
        }`}
      >
        <div className="container-xl flex h-16 items-center gap-12">
          <a href={localizeHref("/", locale)} className="flex shrink-0 items-center" aria-label={nav?.logoAlt || "Quality Sumprint"}>
            {nav?.logo ? (
              <img
                src={mediaUrl(nav.logo)}
                alt={nav?.logoAlt || "Quality Sumprint"}
                width="170"
                height="30"
                className="h-[30px] w-auto"
                data-tina-field={tinaField(nav, "logo")}
              />
            ) : (
              <span className="text-subtitle-sm font-semibold">Quality Sumprint</span>
            )}
          </a>

          <nav className="hidden h-full items-stretch gap-8 lg:flex" aria-label="Principal">
            {links.map((link: any, index: number) => {
              const hasMenu = link.menu === "services" || link.menu === "products";
              const active = isActive(currentPath, link.url);
              const expanded = menu === link.menu;
              return (
                <div
                  key={index}
                  className="relative flex items-center"
                  onMouseEnter={() => (hasMenu ? openMenu(link.menu) : menu !== "search" && setMenu(null))}
                >
                  <a
                    href={localizeHref(link.url, locale, link.external)}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    aria-current={active ? "page" : undefined}
                    className="text-body-sm font-medium text-content transition-colors hover:text-content-muted"
                    data-tina-field={tinaField(link, "label")}
                  >
                    {tField(link, "label", locale)}
                  </a>
                  {hasMenu && (
                    <button
                      type="button"
                      onClick={() => (expanded ? setMenu(null) : openMenu(link.menu))}
                      aria-expanded={expanded}
                      aria-label={`Abrir menú de ${link.label}`}
                      className="ml-1 p-1 text-content-subtle"
                    >
                      <FaChevronDown className={`h-2.5 w-2.5 transition-transform ${expanded ? "rotate-180" : ""}`} aria-hidden />
                    </button>
                  )}
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 bottom-0 h-0.5 transition-colors ${
                      expanded ? "bg-ink" : active ? "bg-brand-secondary" : "bg-transparent"
                    }`}
                  />
                </div>
              );
            })}
          </nav>

          <div className="ml-auto hidden items-center gap-6 lg:flex">
            <button
              type="button"
              onClick={() => (menu === "search" ? setMenu(null) : openMenu("search"))}
              aria-expanded={menu === "search"}
              aria-label="Buscar productos"
              className="p-2 text-content transition-colors hover:text-accent"
            >
              {menu === "search" ? <FaXmark className="h-4 w-4" /> : <FaMagnifyingGlass className="h-4 w-4" />}
            </button>
            {nav?.cta?.label && (
              <a
                href={localizeHref(nav.cta.url, locale)}
                className="btn-accent !px-5 !py-2.5"
                data-tina-field={tinaField(nav.cta, "label")}
              >
                {tField(nav.cta, "label", locale)}
              </a>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            className="ml-auto p-2 text-content lg:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <FaXmark size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        <div
          onMouseEnter={() => window.clearTimeout(closeTimer.current)}
          className={`absolute inset-x-0 top-full hidden border-t border-line bg-surface shadow-[0_24px_48px_-24px_rgba(17,19,22,0.25)] transition-all duration-300 lg:block ${
            panelOpen ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-3 opacity-0"
          }`}
        >
          <div className="container-xl py-10">
            {menu === "services" && (
              <div className="grid grid-cols-[1.4fr_1fr_1.2fr] gap-12">
                <MenuColumn title={servicesMenu?.title} links={services} onNavigate={close} />
                <MenuColumn
                  title="Enlaces rápidos"
                  links={(servicesMenu?.quickLinks || []).filter(Boolean).map((l: any) => ({ label: l.label, href: l.url }))}
                  onNavigate={close}
                />
                {servicesMenu?.promoTitle && (
                  <a href={servicesMenu.promoUrl || "#"} onClick={close} className="group relative block overflow-hidden rounded-2xl bg-ink p-7 text-white">
                    {promoImage && (
                      <img src={promoImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50 transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <span className="relative block text-subtitle-sm font-semibold">{servicesMenu.promoTitle}</span>
                    <span className="relative mt-2 block text-body-sm text-white/80">{servicesMenu.promoText}</span>
                    <span className="relative mt-16 inline-flex items-center gap-2 text-body-sm font-semibold">
                      Conocer más <FaArrowRight className="h-3 w-3" aria-hidden />
                    </span>
                  </a>
                )}
              </div>
            )}

            {menu === "products" && (
              <div>
                {productsMenu?.title && <p className="eyebrow mb-6">{productsMenu.title}</p>}
                <div className="grid grid-cols-4 gap-12">
                  <MenuColumn title={productsMenu?.segmentsTitle} links={catalog.segments} onNavigate={close} />
                  <MenuColumn title={productsMenu?.categoriesTitle} links={catalog.categories} onNavigate={close} />
                  <MenuColumn title={productsMenu?.brandsTitle} links={catalog.brands} onNavigate={close} />
                  <a href={localizeHref("/productos", locale)} onClick={close} className="link-arrow self-start justify-self-end">
                    Ver todos los productos <FaArrowRight className="h-3 w-3" aria-hidden />
                  </a>
                </div>
              </div>
            )}

            {menu === "search" && (
              <SearchPanel
                products={catalog.products}
                placeholder={nav?.search?.placeholder || "Buscar productos"}
                popularTitle={nav?.search?.popularTitle || "Productos populares"}
                onNavigate={close}
              />
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-surface lg:hidden">
            <nav className="container-xl flex flex-col py-6" aria-label="Principal">
              {links.map((link: any, index: number) => (
                <div key={index} className="border-b border-line py-3">
                  <a
                    href={localizeHref(link.url, locale, link.external)}
                    onClick={close}
                    className="block py-1 text-subtitle-sm font-medium"
                  >
                    {tField(link, "label", locale)}
                  </a>
                  {link.menu === "services" && (
                    <div className="mt-2 grid gap-1 pl-1">
                      {services.map((s) => (
                        <a key={s.href} href={s.href} onClick={close} className="py-1 text-body-sm text-content-muted">
                          {s.label}
                        </a>
                      ))}
                    </div>
                  )}
                  {link.menu === "products" && (
                    <div className="mt-2 grid gap-1 pl-1">
                      {[...catalog.segments, ...catalog.categories].map((s) => (
                        <a key={s.href} href={s.href} onClick={close} className="py-1 text-body-sm text-content-muted">
                          {s.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {nav?.cta?.label && (
                <a href={localizeHref(nav.cta.url, locale)} onClick={close} className="btn-accent mt-6">
                  {tField(nav.cta, "label", locale)}
                </a>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
