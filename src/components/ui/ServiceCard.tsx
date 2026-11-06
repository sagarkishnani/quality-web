export interface ServiceSummary {
  name: string;
  summary: string;
  image: string;
  href: string;
}

interface Props {
  service: ServiceSummary;
  className?: string;
  showSummary?: boolean;
  size?: "lg" | "md" | "sm";
  counter?: string;
}

const titleSize = { lg: "text-subtitle-lg", md: "text-subtitle-sm", sm: "text-subtitle-xs font-bold" };
const carouselTitleSize = { lg: "text-subtitle-sm md:text-subtitle-lg", md: "text-subtitle-sm", sm: "text-subtitle-sm md:text-subtitle-xs md:font-bold" };
const padding = { lg: "p-8 md:p-9", md: "p-7", sm: "p-7" };
const carouselPadding = { lg: "p-6 md:p-9", md: "p-6 md:p-7", sm: "p-6 md:p-7" };

export default function ServiceCard({ service, className = "", showSummary = true, size = "md", counter }: Props) {
  const inCarousel = Boolean(counter);

  return (
    <a
      href={service.href}
      className={`group relative flex overflow-hidden rounded-panel bg-ink-soft ${className}`}
    >
      {service.image && (
        <img
          src={service.image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/30 to-transparent" aria-hidden />
      <span className={`relative mt-auto block text-white ${inCarousel ? carouselPadding[size] : padding[size]}`}>
        {counter && (
          <span className="mb-2 block text-caption-sm font-semibold text-brand-secondary-light md:hidden">{counter}</span>
        )}
        <span className={`block ${inCarousel ? carouselTitleSize[size] : titleSize[size]}`}>
          {service.name}
        </span>
        {showSummary && service.summary && (
          <span className={`mt-2 max-w-md text-body-base text-white/[0.88] ${inCarousel ? "hidden md:block" : "block"}`}>{service.summary}</span>
        )}
      </span>
    </a>
  );
}
