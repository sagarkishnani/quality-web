import { useTina, tinaField } from "tinacms/dist/react";
import { FaArrowRight } from "react-icons/fa6";
import ImageBanner from "../ui/ImageBanner";
import { mediaUrl } from "../../utils/mediaUrl";

interface TinaProps {
  query: string;
  variables: object;
  data: any;
}

function useEnvironment({ query, variables, data }: TinaProps) {
  return useTina({ query, variables, data }).data?.environment;
}

function BackgroundVideo({ src, poster, className }: { src?: string | null; poster?: string; className: string }) {
  if (!src) return poster ? <img src={poster} alt="" className={className} /> : null;
  return <video className={className} src={mediaUrl(src)} poster={poster} autoPlay muted loop playsInline preload="metadata" aria-hidden />;
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

export function EnvironmentPillars(props: TinaProps) {
  const pillars = (useEnvironment(props)?.pillars || []).filter((pillar: any) => pillar?.title);
  if (!pillars.length) return <div hidden />;

  return (
    <section className="pb-16 md:pb-24">
      <div className="container-xl space-y-6">
        {pillars.map((pillar: any, index: number) => {
          const mediaFirst = index % 2 === 0;
          return (
            <article key={index} className="grid overflow-hidden rounded-3xl bg-surface-raised md:grid-cols-2">
              <div className={`relative min-h-[300px] md:min-h-[460px] ${mediaFirst ? "" : "md:order-2"}`}>
                <BackgroundVideo
                  src={pillar.video}
                  poster={mediaUrl(pillar.image)}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-14">
                <p className="text-body-sm font-semibold text-brand-secondary-dark">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-3 text-heading-md" data-tina-field={tinaField(pillar, "title")}>
                  {pillar.title}
                </h2>
                {pillar.text && (
                  <p className="mt-4 text-body-lg text-content-muted" data-tina-field={tinaField(pillar, "text")}>
                    {pillar.text}
                  </p>
                )}
                {pillar.linkLabel && pillar.linkUrl && (
                  <a href={pillar.linkUrl} className="link-arrow mt-8" data-tina-field={tinaField(pillar, "linkLabel")}>
                    {pillar.linkLabel}
                    <FaArrowRight className="h-3 w-3" aria-hidden />
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

  return (
    <section className="pb-16 md:pb-24">
      <div className="container-xl">
        <ImageBanner
          parallax={0.22}
          eyebrow={banner.eyebrow}
          title={banner.title}
          image={mediaUrl(banner.image)}
          buttonLabel={banner.buttonLabel}
          buttonUrl={banner.buttonUrl}
          tina={{
            eyebrow: tinaField(banner, "eyebrow"),
            title: tinaField(banner, "title"),
            image: tinaField(banner, "image"),
            button: tinaField(banner, "buttonLabel"),
          }}
        />
      </div>
    </section>
  );
}
