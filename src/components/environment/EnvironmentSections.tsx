import { useTina, tinaField } from "tinacms/dist/react";
import { mediaUrl } from "../../utils/mediaUrl";

interface TinaProps {
  query: string;
  variables: object;
  data: any;
}

function useEnvironment({ query, variables, data }: TinaProps) {
  return useTina({ query, variables, data }).data?.environment;
}

function BackgroundVideo({ src, poster, className, lazy }: { src?: string | null; poster?: string; className: string; lazy?: boolean }) {
  if (!src) return poster ? <img src={poster} alt="" className={className} loading={lazy ? "lazy" : undefined} decoding={lazy ? "async" : undefined} /> : null;
  const source = lazy ? { "data-lazy-src": mediaUrl(src), preload: "none" } : { src: mediaUrl(src), autoPlay: true, preload: "metadata" };
  return <video data-motion-video className={className} poster={poster} muted loop playsInline aria-hidden {...source} />;
}

export function EnvironmentHero(props: TinaProps) {
  const hero = useEnvironment(props)?.hero;
  if (!hero) return <div hidden />;

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] items-end overflow-hidden bg-petrol pb-28 text-white md:min-h-[820px]">
      <div aria-hidden data-parallax="0.3" className="absolute inset-x-0 -top-[14%] h-[128%]">
        <BackgroundVideo src={hero.video} poster={mediaUrl(hero.poster)} className="h-full w-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent" aria-hidden />
      <div className="container-xl relative text-center">
        {hero.eyebrow && (
          <p className="eyebrow-caps text-brand-secondary-light" data-tina-field={tinaField(hero, "eyebrow")}>
            {hero.eyebrow}
          </p>
        )}
        <h1 className="mx-auto mt-4 max-w-3xl text-heading-xl [text-shadow:0_8px_32px_rgba(0,0,0,0.35)]" data-tina-field={tinaField(hero, "title")}>
          {hero.title}
        </h1>
        {hero.buttonLabel && hero.buttonUrl && (
          <a href={hero.buttonUrl} className="btn-light mt-9" data-tina-field={tinaField(hero, "buttonLabel")}>
            {hero.buttonLabel}
          </a>
        )}
      </div>
    </section>
  );
}

export function EnvironmentCommitment(props: TinaProps) {
  const commitment = useEnvironment(props)?.commitment;
  if (!commitment?.title) return <div hidden />;

  return (
    <section className="section">
      <div className="container-xl grid gap-8 md:grid-cols-2 md:gap-16">
        <div>
          {commitment.eyebrow && (
            <p className="eyebrow" data-tina-field={tinaField(commitment, "eyebrow")}>
              {commitment.eyebrow}
            </p>
          )}
          <h2 className="mt-3 text-heading-md" data-tina-field={tinaField(commitment, "title")}>
            {commitment.title}
          </h2>
        </div>
        {commitment.text && (
          <p className="self-end text-body-lg leading-8 text-content-muted" data-tina-field={tinaField(commitment, "text")}>
            {commitment.text}
          </p>
        )}
      </div>
    </section>
  );
}

export function EnvironmentVideoBand(props: TinaProps) {
  const hero = useEnvironment(props)?.hero;
  if (!hero?.video && !hero?.poster) return <div hidden />;

  return (
    <section aria-hidden className="video-band-mask relative h-80 overflow-hidden lg:h-[720px]">
      <div data-parallax="0.18" className="absolute inset-x-0 -top-[20%] h-[140%]">
        <BackgroundVideo src={hero.video} poster={mediaUrl(hero.poster)} className="h-full w-full object-cover" lazy />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-b from-petrol/0 via-petrol/55 via-45% to-petrol" />
    </section>
  );
}

export function EnvironmentPillars(props: TinaProps) {
  const pillars = (useEnvironment(props)?.pillars || []).filter((pillar: any) => pillar?.title);
  if (!pillars.length) return <div hidden />;

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-petrol via-petrol-deep via-55% to-petrol pb-16 pt-6 text-white lg:pb-40">
      <svg
        aria-hidden
        data-scroll-line
        viewBox="0 0 100 300"
        preserveAspectRatio="none"
        style={{ clipPath: "inset(0 0 100% 0)" }}
        className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
      >
        <path
          d="M -5 8 C 20 4, 30 30, 48 36 S 78 60, 70 84 S 20 112, 30 140 S 86 170, 76 198 S 26 228, 36 254 S 70 286, 52 302"
          fill="none"
          className="stroke-brand-secondary"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="container-xl relative space-y-16 lg:space-y-[180px]">
        {pillars.map((pillar: any, index: number) => {
          const mediaFirst = index % 2 === 0;
          const hasMedia = Boolean(pillar.video || pillar.image);
          return (
            <article key={index} className="grid items-center gap-8 lg:grid-cols-2 lg:gap-24">
              {hasMedia && (
                <div
                  className={`relative h-[300px] w-full overflow-hidden rounded-panel shadow-deep md:h-[400px] lg:h-[540px] lg:max-w-[420px] ${
                    mediaFirst ? "lg:justify-self-start" : "lg:order-2 lg:justify-self-end"
                  }`}
                >
                  <div aria-hidden data-parallax="-0.08" className="absolute inset-x-0 -top-[15%] h-[130%]">
                    <BackgroundVideo
                      src={pillar.video}
                      poster={mediaUrl(pillar.image)}
                      className="h-full w-full object-cover"
                      lazy
                    />
                  </div>
                </div>
              )}
              <div className="flex flex-col items-start lg:max-w-[440px]">
                <p className="text-body-sm font-semibold text-brand-secondary-light">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 text-heading-md" data-tina-field={tinaField(pillar, "title")}>
                  {pillar.title}
                </h2>
                {pillar.text && (
                  <p className="mt-4 text-body-lg text-white/90" data-tina-field={tinaField(pillar, "text")}>
                    {pillar.text}
                  </p>
                )}
                {pillar.linkLabel && pillar.linkUrl && (
                  <a href={pillar.linkUrl} className="btn-light mt-8" data-tina-field={tinaField(pillar, "linkLabel")}>
                    {pillar.linkLabel}
                  </a>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function EnvironmentBanner(props: TinaProps) {
  const banner = useEnvironment(props)?.banner;
  if (!banner?.title) return <div hidden />;
  const image = mediaUrl(banner.image);

  return (
    <section className="relative flex min-h-[420px] items-center justify-center overflow-hidden bg-petrol px-6 py-20 text-center text-white md:min-h-[560px] lg:min-h-[820px]">
      {image && (
        <div aria-hidden data-parallax="0.22" className="absolute inset-x-0 -top-[16%] h-[132%]">
          <img
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            data-tina-field={tinaField(banner, "image")}
          />
        </div>
      )}
      <div className="environment-banner-scrim absolute inset-0" aria-hidden />
      <div className="relative max-w-3xl">
        {banner.eyebrow && (
          <p className="text-body-sm font-semibold uppercase tracking-[0.12em] text-brand-secondary-light" data-tina-field={tinaField(banner, "eyebrow")}>
            {banner.eyebrow}
          </p>
        )}
        <h2 className="mt-4 text-heading-xl [text-shadow:0_4px_30px_rgba(0,0,0,0.35)]" data-tina-field={tinaField(banner, "title")}>
          {banner.title}
        </h2>
        {banner.buttonLabel && banner.buttonUrl && (
          <a href={banner.buttonUrl} className="btn-light mt-8" data-tina-field={tinaField(banner, "buttonLabel")}>
            {banner.buttonLabel}
          </a>
        )}
      </div>
    </section>
  );
}
