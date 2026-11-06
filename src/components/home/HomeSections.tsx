import { useTina, tinaField } from "tinacms/dist/react";
import { FaArrowRight, FaStar } from "react-icons/fa6";
import SectionHeading from "../ui/SectionHeading";
import SplitTitle from "../ui/SplitTitle";
import StatGrid from "../ui/StatGrid";
import ProductTile from "../ui/ProductTile";
import ServiceCard, { type ServiceSummary } from "../ui/ServiceCard";
import ImageBanner from "../ui/ImageBanner";
import Carousel from "../ui/Carousel";
import { mediaUrl } from "../../utils/mediaUrl";
import type { CatalogItem } from "../../lib/woo/catalog";

interface TinaProps {
  query: string;
  variables: object;
  data: any;
}

function useHome({ query, variables, data }: TinaProps) {
  return useTina({ query, variables, data }).data?.home;
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function HomeProducts(props: TinaProps & { products: CatalogItem[]; productsPath: string; buttonLabel: string; quoteMessage: string }) {
  const section = useHome(props)?.products;
  if (!section || !props.products.length) return <div hidden />;

  return (
    <section className="section pb-10 md:pb-16">
      <div className="container-xl">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          linkLabel={section.linkLabel}
          linkUrl={section.linkUrl}
          tina={{ eyebrow: tinaField(section, "eyebrow"), title: tinaField(section, "title"), link: tinaField(section, "linkLabel") }}
        />
        <Carousel itemWidth="68" label={section.title || "Productos"} gridClassName="md:grid-cols-2 md:gap-6 lg:grid-cols-4" className="mt-10">
          {props.products.map((item) => (
            <ProductTile key={item.id} item={item} href={`${props.productsPath}/${item.slug}`} buttonLabel={props.buttonLabel} quoteMessage={props.quoteMessage} />
          ))}
        </Carousel>
      </div>
    </section>
  );
}

const BENTO_LAYOUT = [
  "h-[380px] md:h-auto md:row-span-2",
  "h-[380px] md:h-auto md:col-span-2 md:min-h-[260px]",
  "h-[380px] md:h-auto md:min-h-[260px]",
  "h-[380px] md:h-auto md:min-h-[260px]",
];

const twoDigits = (value: number) => String(value).padStart(2, "0");

export function HomeServices(props: TinaProps & { services: ServiceSummary[] }) {
  const section = useHome(props)?.services;
  if (!section) return <div hidden />;
  const featured = props.services.slice(0, BENTO_LAYOUT.length);

  return (
    <section className="section">
      <div className="container-xl">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          tina={{ eyebrow: tinaField(section, "eyebrow"), title: tinaField(section, "title"), description: tinaField(section, "description") }}
        />
        <Carousel itemWidth="78" label={section.title || "Servicios"} gridClassName="md:auto-rows-[300px] md:grid-cols-[1.2fr_1fr_1fr] md:gap-5" className="mt-12">
          {featured.map((service, index) => (
            <ServiceCard
              key={service.href}
              service={service}
              className={BENTO_LAYOUT[index]}
              size={index === 0 ? "lg" : index === 1 ? "md" : "sm"}
              showSummary={index < 2}
              counter={`${twoDigits(index + 1)} / ${twoDigits(featured.length)}`}
            />
          ))}
        </Carousel>
        {section.linkLabel && section.linkUrl && (
          <div className="mt-10 text-center">
            <a href={section.linkUrl} className="link-arrow" data-tina-field={tinaField(section, "linkLabel")}>
              {section.linkLabel}
              <FaArrowRight className="h-3 w-3" aria-hidden />
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

export function HomeExperience(props: TinaProps) {
  const experience = useHome(props)?.experience;
  if (!experience) return <div hidden />;

  return (
    <section className="section">
      <div className="container-xl">
        <div className="card md:p-16">
          <div className="grid gap-8 md:grid-cols-2 md:gap-16">
            <SplitTitle light={experience.titleLight} strong={experience.titleStrong} tinaField={tinaField(experience, "titleStrong")} />
            {experience.text && (
              <p className="text-body-md leading-7 text-content-muted" data-tina-field={tinaField(experience, "text")}>
                {experience.text}
              </p>
            )}
          </div>
          <div className="mt-12 border-t border-line pt-12">
            <StatGrid stats={experience.stats || []} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeEcoBanner(props: TinaProps) {
  const banner = useHome(props)?.ecoBanner;
  if (!banner?.title) return <div hidden />;

  return (
    <section className="pb-16 md:pb-24">
      <div className="container-xl">
        <ImageBanner
          parallax={0.16}
          eyebrow={banner.eyebrow}
          title={banner.title}
          image={mediaUrl(banner.image)}
          buttonLabel={banner.buttonLabel}
          buttonUrl={banner.buttonUrl}
          tina={{
            eyebrow: tinaField(banner, "eyebrow"),
            title: tinaField(banner, "title"),
            image: tinaField(banner, "image"),
            button: tinaField(banner, "buttonLabel"),
          }}
        />
      </div>
    </section>
  );
}

export function HomeTestimonials(props: TinaProps) {
  const testimonials = useHome(props)?.testimonials;
  const items = (testimonials?.items || []).filter((item: any) => item?.quote);
  if (!items.length) return <div hidden />;

  return (
    <section className="section pt-0">
      <div className="container-xl">
        <SectionHeading
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          tina={{ eyebrow: tinaField(testimonials, "eyebrow"), title: tinaField(testimonials, "title") }}
        />
        <Carousel itemWidth="84" label={testimonials.title || "Testimonios"} gridClassName="md:grid-cols-3 md:gap-6" className="mt-10" focusable>
          {items.map((item: any, index: number) => (
            <figure key={index} className="card flex flex-col">
              <div className="flex gap-1 text-[#F2B53B]" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }, (_, star) => (
                  <FaStar key={star} className="h-4 w-4" aria-hidden />
                ))}
              </div>
              <blockquote className="mt-6 flex-1 text-body-lg text-content-strong" data-tina-field={tinaField(item, "quote")}>
                {item.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-secondary-lightest text-body-base font-bold text-brand-secondary-darkest">
                  {initials(item.name || "")}
                </span>
                <span>
                  <span className="block text-body-base font-bold" data-tina-field={tinaField(item, "name")}>
                    {item.name}
                  </span>
                  <span className="block text-body-sm text-content-muted" data-tina-field={tinaField(item, "organization")}>
                    {item.organization}
                  </span>
                </span>
              </figcaption>
            </figure>
          ))}
        </Carousel>
      </div>
    </section>
  );
}
