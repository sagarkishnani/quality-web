import { useEffect, useState } from "react";
import { useTina, tinaField } from "tinacms/dist/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { mediaUrl } from "../../utils/mediaUrl";

interface Props {
  query: string;
  variables: object;
  data: any;
}

const AUTOPLAY_MS = 6500;

export default function HeroSliderReact({ query, variables, data: initialData }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const slides = (data?.home?.slides || []).filter((slide: any) => slide?.title);
  const secondary = data?.home?.heroSecondary;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = slides.length;

  useEffect(() => {
    if (paused || count < 2) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;
    const id = window.setInterval(() => setCurrent((index) => (index + 1) % count), AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, count]);

  if (!count) return <div hidden />;

  const active = slides[Math.min(current, count - 1)];
  const go = (step: number) => setCurrent((index) => (index + step + count) % count);

  return (
    <section
      className="relative flex min-h-[640px] items-center overflow-hidden bg-ink pb-24 pt-16 text-white md:min-h-[720px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrusel"
    >
      {slides.map((slide: any, index: number) => (
        <img
          key={index}
          src={mediaUrl(slide.image)}
          alt=""
          aria-hidden
          fetchPriority={index === 0 ? "high" : "low"}
          loading={index === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1400ms] ease-out ${
            index === current ? "scale-100 opacity-100" : "scale-[1.08] opacity-0"
          }`}
          data-tina-field={tinaField(slide, "image")}
        />
      ))}
      <div className="absolute inset-0 bg-ink/50" aria-hidden />

      <div className="container-xl relative text-center" aria-live="polite">
        <div key={current} className="mx-auto max-w-3xl animate-fade-up">
          {active.eyebrow && (
            <p className="eyebrow-caps text-brand-secondary-light" data-tina-field={tinaField(active, "eyebrow")}>
              {active.eyebrow}
            </p>
          )}
          <h1 className="mt-5 text-heading-xl" data-tina-field={tinaField(active, "title")}>
            {active.title}
          </h1>
          {active.text && (
            <p className="mx-auto mt-6 max-w-2xl text-body-lg text-white/85" data-tina-field={tinaField(active, "text")}>
              {active.text}
            </p>
          )}
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            {active.buttonLabel && active.buttonUrl && (
              <a href={active.buttonUrl} className="btn-light" data-tina-field={tinaField(active, "buttonLabel")}>
                {active.buttonLabel}
              </a>
            )}
            {secondary?.buttonLabel && secondary?.buttonUrl && (
              <a href={secondary.buttonUrl} className="btn-ghost-light" data-tina-field={tinaField(secondary, "buttonLabel")}>
                {secondary.buttonLabel}
              </a>
            )}
          </div>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Diapositiva anterior"
            className={`absolute left-6 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-300 hover:bg-white/25 md:flex ${
              paused ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
            }`}
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Diapositiva siguiente"
            className={`absolute right-6 top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-all duration-300 hover:bg-white/25 md:flex ${
              paused ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
            }`}
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-20 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_: any, index: number) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Ir a la diapositiva ${index + 1}`}
                aria-current={index === current}
                className={`h-2 rounded-full transition-all duration-500 ${index === current ? "w-7 bg-white" : "w-2 bg-white/45"}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
