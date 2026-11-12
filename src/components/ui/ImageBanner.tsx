import BackgroundVideo from "./BackgroundVideo";

const PARALLAX_LAYERS = {
  0.16: "inset-x-0 -top-[18%] h-[136%]",
};

interface Props {
  parallax?: keyof typeof PARALLAX_LAYERS;
  eyebrow?: string | null;
  title?: string | null;
  image?: string;
  video?: string | null;
  videoWebm?: string | null;
  buttonLabel?: string | null;
  buttonUrl?: string | null;
  tina?: { eyebrow?: string; title?: string; image?: string; button?: string };
}

export default function ImageBanner({ parallax, eyebrow, title, image, video, videoWebm, buttonLabel, buttonUrl, tina = {} }: Props) {
  return (
    <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-3xl bg-ink px-6 py-20 text-center md:min-h-[560px]">
      {(image || video || videoWebm) && (
        <div
          aria-hidden
          data-parallax={parallax}
          className={`absolute ${parallax ? PARALLAX_LAYERS[parallax] : "inset-0"}`}
          data-tina-field={tina.image}
        >
          <BackgroundVideo webm={videoWebm} mp4={video} poster={image} className="h-full w-full object-cover" lazy />
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/60 to-ink/70" aria-hidden />
      <div className="relative max-w-3xl text-white [text-shadow:0_2px_24px_rgba(0,0,0,0.35)]">
        {eyebrow && (
          <p className="text-body-sm font-semibold uppercase tracking-[0.12em] text-brand-secondary-light" data-tina-field={tina.eyebrow}>
            {eyebrow}
          </p>
        )}
        {title && (
          <h2 className="mt-4 text-heading-sm" data-tina-field={tina.title}>
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
