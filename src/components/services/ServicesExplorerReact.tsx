import { useState } from "react";
import { FaArrowRight, FaChevronDown } from "react-icons/fa6";
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
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  if (!services.length) return <div hidden />;
  const current = services[active];

  return (
    <section className="section">
      <div className="container-xl">
        <div className="grid items-end gap-6 md:grid-cols-2">
          <h2 className="text-heading-md">{title}</h2>
          {description && <p className="max-w-xl text-body-md text-content-muted md:justify-self-end">{description}</p>}
        </div>

        <ol className="mt-10 rounded-3xl bg-surface-raised px-5 py-1 md:px-6 lg:hidden">
          {services.map((service, index) => {
            const open = index === openIndex;
            const panelId = `services-explorer-panel-${index}`;
            return (
              <li key={service.href} className="border-b border-line-soft last:border-b-0">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="relative grid min-h-11 w-full grid-cols-[2rem_minmax(0,1fr)_1.25rem] items-center gap-2.5 py-[18px] text-left"
                >
                  <span className={`text-caption-sm font-semibold transition-colors duration-300 ${open ? "text-brand-secondary-dark" : "text-content-faint"}`}>
                    {pad(index + 1)}
                  </span>
                  <span className={`text-body-md transition-colors duration-300 ${open ? "font-semibold text-content" : "font-medium text-content-muted"}`}>
                    {service.name}
                  </span>
                  <FaChevronDown
                    aria-hidden
                    className={`h-3.5 w-3.5 text-content-muted transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
                  />
                  <span
                    aria-hidden
                    className={`absolute -bottom-px left-0 h-0.5 bg-brand-secondary transition-[width] duration-300 motion-reduce:transition-none ${open ? "w-full" : "w-0"}`}
                  />
                </button>
                <div
                  id={panelId}
                  inert={!open}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="flex flex-col items-start gap-3.5 pb-5 pt-0.5">
                      {service.image && (
                        <img
                          src={service.image}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          width="640"
                          height="360"
                          className="h-[180px] w-full rounded-2xl bg-surface object-cover"
                        />
                      )}
                      {service.summary && <p className="text-body-sm text-content-muted">{service.summary}</p>}
                      <a href={service.href} className="btn-primary btn-sm px-5">
                        {linkLabel}
                      </a>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-12 hidden gap-4 rounded-3xl bg-surface-raised p-4 md:p-6 lg:grid lg:grid-cols-2 lg:gap-10">
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
                    <span className={`w-6 text-caption-md font-semibold transition-colors ${selected ? "text-brand-secondary-dark" : "text-content-faint"}`}>
                      {pad(index + 1)}
                    </span>
                    <span
                      className={`flex-1 text-body-xl transition-all duration-300 ${
                        selected ? "translate-x-1.5 font-semibold text-content" : "font-medium text-content-muted"
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
              {current.summary && <p className="mt-3 max-w-md text-body-base text-white/[0.88]">{current.summary}</p>}
              <a href={current.href} className="btn-light btn-sm mt-6">
                {linkLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
