import { useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import type { ServiceSummary } from "../ui/ServiceCard";

interface Props {
  title: string;
  description: string;
  linkLabel: string;
  services: ServiceSummary[];
}

const pad = (value: number) => String(value).padStart(2, "0");

export default function ServicesExplorerReact({ title, description, linkLabel, services }: Props) {
  const [active, setActive] = useState(0);
  if (!services.length) return <div hidden />;
  const current = services[active];

  return (
    <section className="section">
      <div className="container-xl">
        <div className="grid items-end gap-6 md:grid-cols-2">
          <h2 className="text-heading-sm">{title}</h2>
          {description && <p className="max-w-xl text-body-md text-content-muted md:justify-self-end">{description}</p>}
        </div>

        <div className="mt-12 grid gap-4 rounded-3xl bg-surface-raised p-4 md:p-6 lg:grid-cols-2 lg:gap-10">
          <ol className="self-center px-2 py-4 md:px-6">
            {services.map((service, index) => {
              const selected = index === active;
              return (
                <li key={service.href} className="relative border-b border-line">
                  <a
                    href={service.href}
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    className="flex items-center gap-6 py-4"
                  >
                    <span className={`w-6 text-caption-sm font-semibold transition-colors ${selected ? "text-brand-secondary-dark" : "text-content-subtle"}`}>
                      {pad(index + 1)}
                    </span>
                    <span
                      className={`flex-1 text-body-lg transition-all duration-300 ${
                        selected ? "translate-x-1.5 font-semibold text-content" : "font-normal text-content-muted"
                      }`}
                    >
                      {service.name}
                    </span>
                    <FaArrowRight
                      aria-hidden
                      className={`h-3.5 w-3.5 transition-all duration-300 ${selected ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
                    />
                  </a>
                  <span
                    aria-hidden
                    className={`absolute -bottom-px left-0 h-0.5 bg-brand-secondary transition-[width] duration-500 ${selected ? "w-full" : "w-0"}`}
                  />
                </li>
              );
            })}
          </ol>

          <div className="relative min-h-[420px] overflow-hidden rounded-2xl bg-ink lg:min-h-[520px]">
            {services.map((service, index) => (
              <img
                key={service.href}
                src={service.image}
                alt=""
                loading="lazy"
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out ${
                  index === active ? "scale-100 opacity-100" : "scale-[1.08] opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" aria-hidden />
            <div key={active} className="absolute inset-x-0 bottom-0 animate-fade-up p-8 text-white">
              <p className="text-caption-sm font-semibold text-brand-secondary-light">
                {pad(active + 1)} / {pad(services.length)}
              </p>
              <h3 className="mt-2 text-subtitle-md font-semibold">{current.name}</h3>
              {current.summary && <p className="mt-3 max-w-md text-body-sm text-white/80">{current.summary}</p>}
              <a href={current.href} className="btn-light mt-6">
                {linkLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
