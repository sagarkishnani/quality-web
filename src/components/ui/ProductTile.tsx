import { FaEye } from "react-icons/fa6";
import type { CatalogItem } from "../../lib/woo/catalog";

interface Props {
  item: CatalogItem;
  href: string;
  buttonLabel?: string | null;
  tone?: "raised" | "sunken";
}

export default function ProductTile({ item, href, buttonLabel, tone = "raised" }: Props) {
  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl p-6 transition-shadow duration-300 hover:shadow-[0_24px_48px_-24px_rgba(17,19,22,0.25)] ${
        tone === "raised" ? "bg-surface-raised" : "bg-surface"
      }`}
    >
      {item.badge && (
        <span className="absolute left-5 top-5 z-10 inline-flex items-center gap-1.5 rounded-md bg-brand-primary-dark py-1 pl-2.5 pr-3 text-caption-sm font-semibold text-white">
          <span className="h-1 w-1 rounded-full bg-white" aria-hidden />
          {item.badge}
        </span>
      )}

      <div className="relative flex aspect-[4/3] items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt={item.imageAlt}
            loading="lazy"
            decoding="async"
            width="320"
            height="240"
            className="h-full max-h-[200px] w-auto object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          />
        ) : (
          <span className="text-body-sm text-content-subtle">Sin imagen</span>
        )}
        <span
          aria-hidden
          className="absolute inset-0 m-auto flex h-12 w-12 scale-75 items-center justify-center rounded-full bg-white/90 text-ink opacity-0 shadow-md transition-all duration-300 group-hover:scale-100 group-hover:opacity-100"
        >
          <FaEye className="h-4 w-4" />
        </span>
      </div>

      <div className="mt-6">
        {item.brand && (
          <p className="text-caption-sm font-semibold uppercase tracking-[0.14em] text-brand-secondary-dark">{item.brand}</p>
        )}
        <h3 className="mt-1 text-[20px] font-medium leading-snug tracking-tight">
          <a href={href} className="after:absolute after:inset-0">
            {item.name}
          </a>
        </h3>
        {item.category && <p className="mt-1 text-body-sm text-content-muted">{item.category}</p>}
      </div>

      {buttonLabel && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 bottom-6 translate-y-4 rounded-md bg-ink py-3 text-center text-body-sm font-semibold text-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          {buttonLabel}
        </span>
      )}
    </article>
  );
}
