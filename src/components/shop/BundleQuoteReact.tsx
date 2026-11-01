import { useState } from "react";
import { FaCheck, FaPlus } from "react-icons/fa6";
import { quoteUrl } from "./quote";
import type { CatalogItem } from "../../lib/woo/catalog";

interface Props {
  main: CatalogItem;
  extras: CatalogItem[];
  eyebrow: string;
  title: string;
  note: string;
  quoteLabel: string;
}

function BundleCard({ item, kind, selected, locked, onToggle }: {
  item: CatalogItem;
  kind: string;
  selected: boolean;
  locked: boolean;
  onToggle: () => void;
}) {
  return (
    <label
      className={`relative flex h-full items-center gap-4 rounded-2xl bg-surface-raised p-4 transition-opacity has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand-primary ${
        selected ? "opacity-100" : "opacity-50"
      } ${locked ? "cursor-default" : "cursor-pointer"}`}
    >
      <input type="checkbox" className="sr-only" checked={selected} disabled={locked} onChange={onToggle} />
      <span className="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-surface-sunken">
        {item.image && <img src={item.image} alt="" width={112} height={112} loading="lazy" className="h-full w-full object-contain p-2 mix-blend-multiply" />}
        <span
          aria-hidden
          className={`absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-md border ${
            selected ? "border-ink bg-ink text-white" : "border-line-strong bg-surface-raised"
          }`}
        >
          {selected && <FaCheck className="h-3 w-3" />}
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="break-words text-caption-xs font-semibold uppercase tracking-[0.1em] text-brand-secondary-dark">{kind}</span>
        <span className="break-words text-body-md font-semibold">{item.name}</span>
      </span>
    </label>
  );
}

export default function BundleQuoteReact({ main, extras, eyebrow, title, note, quoteLabel }: Props) {
  const [selected, setSelected] = useState<number[]>(extras.map((extra) => extra.id));
  if (!extras.length) return <div hidden />;

  const hasSingleExtra = extras.length === 1;
  const chosen = [main, ...extras.filter((extra) => selected.includes(extra.id))];
  const toggle = (id: number) => setSelected((list) => (list.includes(id) ? list.filter((value) => value !== id) : [...list, id]));
  const message = `Hola, quisiera una cotización conjunta de: ${chosen.map((item) => `${item.brand} ${item.name}`.trim()).join(", ")}.`;

  return (
    <section className="section bg-surface-raised">
      <div className="container-xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-heading-xs">{title}</h2>
        <div className="mt-10 grid gap-6 rounded-panel bg-surface-sunken p-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className={`grid gap-4 ${hasSingleExtra ? "md:grid-cols-[minmax(0,1fr)_32px_minmax(0,1fr)]" : "md:grid-cols-2"}`}>
            <BundleCard item={main} kind="Este producto" selected locked onToggle={() => undefined} />
            {hasSingleExtra && (
              <span className="flex items-center justify-center" aria-hidden>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-raised text-content-muted">
                  <FaPlus className="h-3 w-3" />
                </span>
              </span>
            )}
            {extras.map((extra) => (
              <BundleCard key={extra.id} item={extra} kind={extra.category || "Complemento"} selected={selected.includes(extra.id)} locked={false} onToggle={() => toggle(extra.id)} />
            ))}
          </div>
          <div className="flex flex-col justify-center border-t border-line-strong pt-6 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
            <p className="text-body-sm text-content-muted">
              Seleccionados · {chosen.length} {chosen.length === 1 ? "artículo" : "artículos"}
            </p>
            <p className="mt-2 text-body-sm text-content-muted">{note}</p>
            <a href={quoteUrl(message)} className="btn-primary btn-lg mt-6 w-full">
              {quoteLabel}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
