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
  quoteSlot: "mt-4",
  quote: "h-11 px-6 text-body-sm",
};

const compactBelowMd = {
  card: "p-3.5 md:p-6",
  badge: "left-3 top-3 text-caption-xs md:left-5 md:top-5 md:text-caption-md",
  body: "mt-3 md:mt-6",
  brand: "text-caption-xs md:text-caption-sm",
  name: "text-body-md font-semibold md:text-subtitle-xs",
  category: "text-caption-md md:text-body-base",
  quoteSlot: "mt-3 md:mt-4",
  quote: "h-10 px-4 text-caption-md md:h-11 md:px-6 md:text-body-sm",
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
          className="absolute right-0 top-0 flex h-11 w-11 scale-75 items-center justify-center rounded-full border border-line bg-surface-raised text-ink opacity-0 transition-all duration-300 [@media(hover:hover)]:group-hover:scale-100 [@media(hover:hover)]:group-hover:opacity-100"
        >
          <FaEye className="h-4 w-4" />
        </span>
      </div>

      {buttonLabel && quoteMessage && (
        <div className={`relative z-10 hidden justify-center ${size.quoteSlot} [@media(hover:hover)]:flex`}>
          <a
            href={quoteUrl(fillTemplate(quoteMessage, { cantidad: 1, producto: product }))}
            aria-label={`${buttonLabel}: ${product}`}
            className={`pointer-events-none flex translate-y-2 items-center whitespace-nowrap rounded-full bg-ink font-medium ${size.quote} text-white opacity-0 transition-all duration-300 focus-visible:pointer-events-auto focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100`}
          >
            {buttonLabel}
          </a>
        </div>
      )}

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

    </article>
  );
}
