import { useState } from "react";
import type { ProductSpec } from "../../lib/woo/catalog";

interface Props {
  name: string;
  descriptionHtml: string;
  specs: ProductSpec[];
  image?: string;
  descriptionTab: string;
  featuresTab: string;
}

export default function ProductTabsReact({ name, descriptionHtml, specs, image, descriptionTab, featuresTab }: Props) {
  const tabs = [
    { key: "description", label: descriptionTab, show: Boolean(descriptionHtml) },
    { key: "features", label: featuresTab, show: specs.length > 0 },
  ].filter((tab) => tab.show);
  const [active, setActive] = useState(tabs[0]?.key);

  if (!tabs.length) return <div hidden />;

  return (
    <section className="section">
      <div className="container-xl">
        <div role="tablist" className="flex gap-10 border-b border-line">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={active === tab.key}
              onClick={() => setActive(tab.key)}
              className={`-mb-px border-b-2 px-0.5 pb-4 text-subtitle-sm transition-colors ${
                active === tab.key ? "border-ink font-semibold" : "border-transparent text-content-subtle hover:text-content"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {active === "description" && (
          <div className="grid items-center gap-12 pt-12 md:grid-cols-2">
            <div>
              <h2 className="text-heading-xs">{name}</h2>
              <div
                className="prose mt-5 max-w-none text-body-lg leading-8 text-content-muted prose-strong:text-content"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </div>
            {image && <img src={image} alt={name} loading="lazy" className="mx-auto max-h-[440px] w-auto object-contain mix-blend-multiply" />}
          </div>
        )}

        {active === "features" && (
          <dl className="grid gap-x-12 pt-10 md:grid-cols-2">
            {specs.map((spec) => (
              <div key={spec.label} className="flex justify-between gap-6 border-b border-line py-4 text-body-md">
                <dt className="text-content-muted">{spec.label}</dt>
                <dd className="text-right font-medium">{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
