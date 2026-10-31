import { useTina, tinaField } from "tinacms/dist/react";
import { FaCheck, FaArrowRight } from "react-icons/fa6";
import Breadcrumbs from "../ui/Breadcrumbs";
import ServiceCard, { type ServiceSummary } from "../ui/ServiceCard";
import { mediaUrl } from "../../utils/mediaUrl";
import { fillTemplate, quoteUrl } from "../shop/quote";

interface DetailLabels {
  heroButtonLabel: string;
  consistsEyebrow: string;
  includesTitle: string;
  requestLabel: string;
  othersTitle: string;
  othersLinkLabel: string;
  requestMessage: string;
}

interface TinaProps {
  query: string;
  variables: object;
  data: any;
}

function useService({ query, variables, data }: TinaProps) {
  return useTina({ query, variables, data }).data?.service;
}

function requestHref(labels: DetailLabels, name: string) {
  return quoteUrl(fillTemplate(labels.requestMessage, { servicio: name }));
}

export function ServiceHero(props: TinaProps & { labels: DetailLabels; servicesHref: string; servicesLabel: string }) {
  const service = useService(props);
  if (!service) return <div hidden />;

  return (
    <section className="relative overflow-hidden bg-ink pb-36 pt-24 text-white md:pb-44 md:pt-32">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-primary/10 blur-3xl" />
      <div className="container-xl relative">
        <Breadcrumbs tone="inverse" items={[{ label: props.servicesLabel, href: props.servicesHref }, { label: service.name }]} />
        <h1 className="mt-6 max-w-3xl text-heading-xl" data-tina-field={tinaField(service, "name")}>
          {service.name}
        </h1>
        {service.summary && (
          <p className="mt-6 max-w-xl text-body-xl text-white/90" data-tina-field={tinaField(service, "summary")}>
            {service.summary}
          </p>
        )}
        <a href={requestHref(props.labels, service.name)} className="btn-light mt-9">
          {props.labels.heroButtonLabel}
        </a>
      </div>
    </section>
  );
}

export function ServiceBody(props: TinaProps & { labels: DetailLabels }) {
  const service = useService(props);
  if (!service) return <div hidden />;
  const includes = (service.includes || []).filter(Boolean);
  const detailImage = mediaUrl(service.detailImage);

  return (
    <>
      <section className="section">
        <div className="container-xl grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          <div>
            <p className="eyebrow">{props.labels.consistsEyebrow}</p>
            <h2 className="mt-3 text-heading-xs">{service.name}</h2>
            {service.description && (
              <p className="mt-5 text-body-md leading-7 text-content-muted" data-tina-field={tinaField(service, "description")}>
                {service.description}
              </p>
            )}
          </div>
          {includes.length > 0 && (
            <div className="card self-start">
              <p className="text-body-sm font-semibold">{props.labels.includesTitle}</p>
              <ul className="mt-3" data-tina-field={tinaField(service, "includes")}>
                {includes.map((item: string, index: number) => (
                  <li key={index} className="flex items-center gap-4 border-b border-line py-3.5 text-body-base text-content-strong">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-secondary-lightest text-brand-secondary-dark">
                      <FaCheck className="h-2.5 w-2.5" aria-hidden />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <a href={requestHref(props.labels, service.name)} className="btn-primary mt-6 w-full">
                {props.labels.requestLabel}
              </a>
            </div>
          )}
        </div>
      </section>

      {detailImage && (
        <section className="pb-16 md:pb-24">
          <div className="container-xl">
            <div className="relative h-[280px] overflow-hidden rounded-3xl bg-ink-soft md:h-[480px]">
              <img src={detailImage} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" data-tina-field={tinaField(service, "detailImage")} />
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export function OtherServices({ labels, others, servicesHref }: { labels: DetailLabels; others: ServiceSummary[]; servicesHref: string }) {
  if (!others.length) return <div hidden />;

  return (
    <section className="pb-8">
      <div className="container-xl">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-heading-xs">{labels.othersTitle}</h2>
          <a href={servicesHref} className="link-arrow">
            {labels.othersLinkLabel}
            <FaArrowRight className="h-3 w-3" aria-hidden />
          </a>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {others.map((service) => (
            <ServiceCard key={service.href} service={service} className="min-h-[300px]" showSummary={false} />
          ))}
        </div>
      </div>
    </section>
  );
}
