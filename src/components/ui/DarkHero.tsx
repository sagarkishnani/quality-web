import type { ReactNode } from "react";

interface Props {
  eyebrow?: ReactNode;
  title?: ReactNode;
  text?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  align?: "left" | "center";
  tina?: { eyebrow?: string; title?: string; text?: string; button?: string };
}

export default function DarkHero({ eyebrow, title, text, buttonLabel, buttonUrl, align = "left", tina = {} }: Props) {
  const centered = align === "center";

  return (
    <section className="relative overflow-hidden bg-ink pb-36 pt-24 text-white md:pb-44 md:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-brand-primary/10 blur-3xl"
      />
      <div className={`container-xl relative ${centered ? "text-center" : ""}`}>
        <div className={centered ? "mx-auto max-w-3xl" : "max-w-2xl"}>
          {eyebrow && (
            <div className="eyebrow-caps text-brand-secondary-light" data-tina-field={tina.eyebrow}>
              {eyebrow}
            </div>
          )}
          {title && (
            <h1 className="mt-4 text-heading-xl" data-tina-field={tina.title}>
              {title}
            </h1>
          )}
          {text && (
            <p
              className={`mt-6 text-body-xl text-white/90 ${centered ? "mx-auto max-w-2xl" : "max-w-xl"}`}
              data-tina-field={tina.text}
            >
              {text}
            </p>
          )}
          {buttonLabel && buttonUrl && (
            <a href={buttonUrl} className="btn-light mt-9" data-tina-field={tina.button}>
              {buttonLabel}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
