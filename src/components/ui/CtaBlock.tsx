import { tinaField } from "tinacms/dist/react";

interface CtaContent {
  title?: string | null;
  text?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
}

export default function CtaBlock({ cta }: { cta?: CtaContent | null }) {
  if (!cta?.title) return <div hidden />;

  return (
    <section className="section">
      <div className="container-xl text-center">
        <h2 className="text-heading-sm" data-tina-field={tinaField(cta as any, "title")}>
          {cta.title}
        </h2>
        {cta.text && (
          <p className="mx-auto mt-4 max-w-lg text-body-lg text-content-muted" data-tina-field={tinaField(cta as any, "text")}>
            {cta.text}
          </p>
        )}
        {cta.buttonLabel && cta.buttonUrl && (
          <a href={cta.buttonUrl} className="btn-primary mt-8 px-8" data-tina-field={tinaField(cta as any, "buttonLabel")}>
            {cta.buttonLabel}
          </a>
        )}
      </div>
    </section>
  );
}
