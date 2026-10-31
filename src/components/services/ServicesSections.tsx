import { useTina, tinaField } from "tinacms/dist/react";
import DarkHero from "../ui/DarkHero";
import SplitTitle from "../ui/SplitTitle";
import CtaBlock from "../ui/CtaBlock";

interface TinaProps {
  query: string;
  variables: object;
  data: any;
}

function useServicesPage({ query, variables, data }: TinaProps) {
  return useTina({ query, variables, data }).data?.servicesPage;
}

export function ServicesHero(props: TinaProps) {
  const hero = useServicesPage(props)?.hero;
  if (!hero) return <div hidden />;

  return (
    <DarkHero
      align="center"
      eyebrow={hero.eyebrow}
      title={hero.title}
      text={hero.text}
      buttonLabel={hero.buttonLabel}
      buttonUrl={hero.buttonUrl}
      tina={{
        eyebrow: tinaField(hero, "eyebrow"),
        title: tinaField(hero, "title"),
        text: tinaField(hero, "text"),
        button: tinaField(hero, "buttonLabel"),
      }}
    />
  );
}

export function ServicesReasons(props: TinaProps) {
  const reasons = useServicesPage(props)?.reasons;
  const items = (reasons?.items || []).filter((item: any) => item?.title);
  if (!items.length) return <div hidden />;

  return (
    <section className="pb-8">
      <div className="container-xl">
        <div className="card grid gap-10 md:p-16 lg:grid-cols-[1fr_2fr]">
          <div>
            <SplitTitle light={reasons.titleLight} strong={reasons.titleStrong} className="text-heading-sm" tinaField={tinaField(reasons, "titleStrong")} />
            {reasons.text && (
              <p className="mt-5 max-w-sm text-body-md text-content-muted" data-tina-field={tinaField(reasons, "text")}>
                {reasons.text}
              </p>
            )}
          </div>
          <div className="grid gap-x-12 sm:grid-cols-2">
            {items.map((item: any, index: number) => (
              <div key={index} className="border-t border-line py-7">
                <p className="text-body-sm font-semibold text-accent">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 text-subtitle-xs font-bold" data-tina-field={tinaField(item, "title")}>
                  {item.title}
                </h3>
                <p className="mt-2 text-body-base text-content-muted" data-tina-field={tinaField(item, "text")}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ServicesCta(props: TinaProps) {
  return <CtaBlock cta={useServicesPage(props)?.cta} />;
}
