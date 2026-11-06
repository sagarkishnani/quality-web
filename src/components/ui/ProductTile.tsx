import { FaEye } from "react-icons/fa6";
import { fillTemplate, quoteUrl } from "../shop/quote";
import type { CatalogItem } from "../../lib/woo/catalog";

interface Props {
  item: CatalogItem;
  href: string;
  buttonLabel?: string | null;
  quoteMessage?: string;
  tone?: "raised" | "sunken";
  compact?: boolean;
}

const regular = {
  card: "p-6",
  badge: "left-5 top-5 text-caption-md",
  body: "mt-6",
  brand: "text-caption-sm",
  name: "text-subtitle-xs",
  category: "text-body-base",
  quote: "inset-x-6 bottom-6 py-3 text-body-sm",
};

const compactBelowMd = {
  card: "p-3.5 md:p-6",
  badge: "left-3 top-3 text-caption-xs md:left-5 md:top-5 md:text-caption-md",
  body: "mt-3 md:mt-6",
  brand: "text-caption-xs md:text-caption-sm",
  name: "text-body-md font-semibold md:text-subtitle-xs",
  category: "text-caption-md md:text-body-base",
  quote: "inset-x-3.5 bottom-3.5 py-2.5 text-caption-md md:inset-x-6 md:bottom-6 md:py-3 md:text-body-sm",
};

export default function ProductTile({ item, href, buttonLabel, quoteMessage, tone = "raised", compact = false }: Props) {
  const product = `${item.brand} ${item.name}`.trim();
  const size = compact ? compactBelowMd : regular;

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-2xl ${size.card} transition-shadow duration-300 hover:shadow-[0_24px_48px_-24px_rgba(17,19,22,0.25)] ${
        tone === "raised" ? "bg-surface-raised" : "bg-surface"
      }`}
    >
      {item.badge && (
        <span className={`absolute z-10 inline-flex items-center gap-1.5 rounded-xs bg-brand-primary py-1 pl-2.5 pr-3 font-semibold text-white ${size.badge}`}>
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

      <div className={size.body}>
        {item.brand && (
          <p className={`font-semibold uppercase tracking-[0.14em] text-brand-secondary-dark ${size.brand}`}>{item.brand}</p>
        )}
        <h3 className={`mt-1 ${size.name}`}>
          <a href={href} className="after:absolute after:inset-0">
            {item.name}
          </a>
        </h3>
        {item.category && <p className={`mt-1 text-content-muted ${size.category}`}>{item.category}</p>}
      </div>

      {buttonLabel && quoteMessage && (
        <a
          href={quoteUrl(fillTemplate(quoteMessage, { cantidad: 1, producto: product }))}
          aria-label={`${buttonLabel}: ${product}`}
          className={`pointer-events-none absolute z-10 translate-y-4 rounded-full bg-ink text-center font-medium ${size.quote} text-white opacity-0 transition-all duration-300 focus-visible:pointer-events-auto focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:hover)]:group-hover:pointer-events-auto`}
        >
          {buttonLabel}
        </a>
      )}
    </article>
  );
}
