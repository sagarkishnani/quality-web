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
      className={`relative flex w-full flex-col rounded-2xl bg-surface-raised p-5 transition-opacity sm:w-56 ${selected ? "opacity-100" : "opacity-50"} ${
        locked ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <input type="checkbox" className="peer sr-only" checked={selected} disabled={locked} onChange={onToggle} />
      <span
        aria-hidden
        className={`absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-md border peer-focus-visible:ring-2 peer-focus-visible:ring-brand-primary ${
          selected ? "border-ink bg-ink text-white" : "border-line-strong bg-surface-raised"
        }`}
      >
        {selected && <FaCheck className="h-3 w-3" />}
      </span>
      <span className="flex h-32 items-center justify-center">
        {item.image && <img src={item.image} alt="" loading="lazy" className="max-h-full w-auto object-contain mix-blend-multiply" />}
      </span>
      <span className="mt-4 text-caption-xs font-semibold uppercase tracking-[0.1em] text-brand-secondary-dark">{kind}</span>
      <span className="mt-1 text-body-md font-semibold">{item.name}</span>
    </label>
  );
}

export default function BundleQuoteReact({ main, extras, eyebrow, title, note, quoteLabel }: Props) {
  const [selected, setSelected] = useState<number[]>(extras.map((extra) => extra.id));
  if (!extras.length) return <div hidden />;

  const chosen = [main, ...extras.filter((extra) => selected.includes(extra.id))];
  const toggle = (id: number) => setSelected((list) => (list.includes(id) ? list.filter((value) => value !== id) : [...list, id]));
  const message = `Hola, quisiera una cotización conjunta de: ${chosen.map((item) => `${item.brand} ${item.name}`.trim()).join(", ")}.`;

  return (
    <section className="section bg-surface">
      <div className="container-xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-3 text-heading-xs">{title}</h2>
        <div className="mt-10 flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <BundleCard item={main} kind="Este producto" selected locked onToggle={() => undefined} />
            {extras.map((extra) => (
              <div key={extra.id} className="flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
                <FaPlus className="h-4 w-4 text-content-subtle" aria-hidden />
                <BundleCard item={extra} kind={extra.category || "Complemento"} selected={selected.includes(extra.id)} locked={false} onToggle={() => toggle(extra.id)} />
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-surface-raised p-7 lg:ml-auto lg:w-80">
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
