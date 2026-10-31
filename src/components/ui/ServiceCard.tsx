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
}

const titleSize = { lg: "text-subtitle-lg", md: "text-subtitle-sm", sm: "text-subtitle-xs font-bold" };

export default function ServiceCard({ service, className = "", showSummary = true, size = "md" }: Props) {
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
      <span className={`relative mt-auto block text-white ${size === "lg" ? "p-8 md:p-9" : "p-7"}`}>
        <span className={`block ${titleSize[size]}`}>
          {service.name}
        </span>
        {showSummary && service.summary && (
          <span className="mt-2 block max-w-md text-body-base text-white/[0.88]">{service.summary}</span>
        )}
      </span>
    </a>
  );
}
