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
  size?: "lg" | "md";
}

export default function ServiceCard({ service, className = "", showSummary = true, size = "md" }: Props) {
  return (
    <a
      href={service.href}
      className={`group relative flex overflow-hidden rounded-2xl bg-ink-soft ${className}`}
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
        <span className={`block font-semibold tracking-tight ${size === "lg" ? "text-subtitle-md" : "text-subtitle-sm"}`}>
          {service.name}
        </span>
        {showSummary && service.summary && (
          <span className="mt-2 block max-w-md text-body-sm text-white/80">{service.summary}</span>
        )}
      </span>
    </a>
  );
}
