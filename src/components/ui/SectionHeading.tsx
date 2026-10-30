import type { ReactNode } from "react";
import { FaArrowRight } from "react-icons/fa6";

interface Props {
  eyebrow?: string | null;
  title?: ReactNode;
  description?: string | null;
  linkLabel?: string | null;
  linkUrl?: string | null;
  tina?: { eyebrow?: string; title?: string; description?: string; link?: string };
  as?: "h1" | "h2";
}

export default function SectionHeading({ eyebrow, title, description, linkLabel, linkUrl, tina = {}, as: Tag = "h2" }: Props) {
  const aside = description ? (
    <p className="max-w-xl text-body-md text-content-muted md:justify-self-end" data-tina-field={tina.description}>
      {description}
    </p>
  ) : linkLabel && linkUrl ? (
    <a href={linkUrl} className="link-arrow md:justify-self-end" data-tina-field={tina.link}>
      {linkLabel}
      <FaArrowRight aria-hidden className="h-3 w-3" />
    </a>
  ) : null;

  return (
    <div className="grid items-end gap-6 md:grid-cols-2">
      <div>
        {eyebrow && (
          <p className="eyebrow mb-3" data-tina-field={tina.eyebrow}>
            {eyebrow}
          </p>
        )}
        {title && (
          <Tag className="text-heading-sm" data-tina-field={tina.title}>
            {title}
          </Tag>
        )}
      </div>
      {aside}
    </div>
  );
}
