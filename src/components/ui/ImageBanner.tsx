interface Props {
  eyebrow?: string | null;
  title?: string | null;
  image?: string;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  tina?: { eyebrow?: string; title?: string; image?: string; button?: string };
}

export default function ImageBanner({ eyebrow, title, image, buttonLabel, buttonUrl, tina = {} }: Props) {
  return (
    <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl bg-ink px-6 py-20 text-center md:min-h-[560px]">
      {image && (
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          data-tina-field={tina.image}
        />
      )}
      <div className="absolute inset-0 bg-ink/55" aria-hidden />
      <div className="relative max-w-3xl text-white">
        {eyebrow && (
          <p className="eyebrow-caps text-brand-secondary-light" data-tina-field={tina.eyebrow}>
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="mt-4 text-heading-md" data-tina-field={tina.title}>
            {title}
          </h2>
        )}
        {buttonLabel && buttonUrl && (
          <a href={buttonUrl} className="btn-light mt-8" data-tina-field={tina.button}>
            {buttonLabel}
          </a>
        )}
      </div>
    </div>
  );
}
