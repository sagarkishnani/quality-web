export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items, tone = "default" }: { items: Crumb[]; tone?: "default" | "inverse" }) {
  const linkClass = tone === "inverse" ? "text-white hover:text-white/80" : "text-content hover:text-accent";
  const currentClass = tone === "inverse" ? "text-white/80" : "text-content-subtle";

  return (
    <nav aria-label="Miga de pan" className="text-body-sm">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {item.href && !last ? (
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              ) : (
                <span className={currentClass} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!last && (
                <span aria-hidden className={currentClass}>
                  ›
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
