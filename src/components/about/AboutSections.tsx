import { useTina, tinaField } from "tinacms/dist/react";
import { FaArrowRight, FaCheck, FaXmark } from "react-icons/fa6";
import DarkHero from "../ui/DarkHero";
import SectionHeading from "../ui/SectionHeading";
import SplitTitle from "../ui/SplitTitle";
import StatGrid from "../ui/StatGrid";
import CtaBlock from "../ui/CtaBlock";
import { mediaUrl } from "../../utils/mediaUrl";

interface TinaProps {
  query: string;
  variables: object;
  data: any;
}

function useAbout({ query, variables, data }: TinaProps) {
  return useTina({ query, variables, data }).data?.about;
}

export function AboutHero(props: TinaProps) {
  const hero = useAbout(props)?.hero;
  if (!hero) return <div hidden />;

  return (
    <DarkHero
      eyebrow={hero.eyebrow}
      title={
        <>
          {hero.title} {hero.highlight && <span className="text-brand-secondary-light">{hero.highlight}</span>}
        </>
      }
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

export function AboutIntro(props: TinaProps) {
  const intro = useAbout(props)?.intro;
  if (!intro) return <div hidden />;
  const paragraphs = (intro.paragraphs || []).filter(Boolean);

  return (
    <section className="section">
      <div className="container-xl">
        <div className="card md:p-16">
          <div className="grid gap-8 md:grid-cols-2 md:gap-16">
            <div>
              {intro.eyebrow && (
                <p className="eyebrow mb-3" data-tina-field={tinaField(intro, "eyebrow")}>
                  {intro.eyebrow}
                </p>
              )}
              <SplitTitle light={intro.titleLight} strong={intro.titleStrong} tinaField={tinaField(intro, "titleStrong")} />
            </div>
            <div className="space-y-4 text-body-md leading-7 text-content-muted" data-tina-field={tinaField(intro, "paragraphs")}>
              {paragraphs.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="mt-12 border-t border-line pt-12">
            <StatGrid stats={intro.stats || []} />
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutValues(props: TinaProps & { leafIcon: string }) {
  const values = (useAbout(props)?.values || []).filter((value: any) => value?.title);
  if (!values.length) return <div hidden />;

  return (
    <section className="pb-16 md:pb-24">
      <div className="container-xl grid gap-6 md:grid-cols-2">
        {values.map((value: any, index: number) => (
          <article key={index} className="card md:p-11">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-secondary-lightest">
              <img src={props.leafIcon} alt="" width="22" height="22" className="h-[22px] w-[22px]" />
            </span>
            <h2 className="mt-8 text-subtitle-md" data-tina-field={tinaField(value, "title")}>
              {value.title}
            </h2>
            <p className="mt-4 text-body-md leading-7 text-content-muted" data-tina-field={tinaField(value, "text")}>
              {value.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function AboutCompare(props: TinaProps) {
  const compare = useAbout(props)?.compare;
  if (!compare?.title) return <div hidden />;
  const before = (compare.before || []).filter(Boolean);
  const after = (compare.after || []).filter(Boolean);

  return (
    <section className="section pt-0">
      <div className="container-xl">
        <SectionHeading
          eyebrow={compare.eyebrow}
          title={compare.title}
          description={compare.description}
          tina={{ eyebrow: tinaField(compare, "eyebrow"), title: tinaField(compare, "title"), description: tinaField(compare, "description") }}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="card md:p-10">
            <p className="eyebrow-caps text-caption-md text-content-subtle" data-tina-field={tinaField(compare, "beforeLabel")}>
              {compare.beforeLabel}
            </p>
            <ul className="mt-5" data-tina-field={tinaField(compare, "before")}>
              {before.map((item: string, index: number) => (
                <li key={index} className="flex items-center gap-4 border-b border-line py-4 text-body-md text-content-muted">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-surface">
                    <FaXmark className="h-3 w-3" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-brand-primary p-6 text-white md:p-10">
            <p className="eyebrow-caps text-caption-md text-white" data-tina-field={tinaField(compare, "afterLabel")}>
              {compare.afterLabel}
            </p>
            <ul className="mt-5" data-tina-field={tinaField(compare, "after")}>
              {after.map((item: string, index: number) => (
                <li key={index} className="flex items-center gap-4 border-b border-white/20 py-4 text-body-md font-semibold">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-ink">
                    <FaCheck className="h-3 w-3" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSolution(props: TinaProps) {
  const solution = useAbout(props)?.solution;
  if (!solution?.title) return <div hidden />;
  const items = (solution.items || []).filter((item: any) => item?.title);
  const image = mediaUrl(solution.image);

  return (
    <section className="pb-8">
      <div className="container-xl grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="relative min-h-[320px] overflow-hidden rounded-2xl bg-ink-soft">
          {image && (
            <img src={image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" data-tina-field={tinaField(solution, "image")} />
          )}
        </div>
        <div className="card md:p-12">
          {solution.eyebrow && (
            <p className="eyebrow" data-tina-field={tinaField(solution, "eyebrow")}>
              {solution.eyebrow}
            </p>
          )}
          <h2 className="mt-3 text-heading-xs" data-tina-field={tinaField(solution, "title")}>
            {solution.title}
          </h2>
          <div className="mt-8 grid gap-x-8 sm:grid-cols-2">
            {items.map((item: any, index: number) => (
              <div key={index} className="border-t border-line py-6">
                <h3 className="text-body-lg font-bold" data-tina-field={tinaField(item, "title")}>
                  {item.title}
                </h3>
                <p className="mt-2 text-body-base text-content-muted" data-tina-field={tinaField(item, "text")}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
          {solution.linkLabel && solution.linkUrl && (
            <a href={solution.linkUrl} className="link-arrow mt-2" data-tina-field={tinaField(solution, "linkLabel")}>
              {solution.linkLabel}
              <FaArrowRight className="h-3 w-3" aria-hidden />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export function AboutCta(props: TinaProps) {
  return <CtaBlock cta={useAbout(props)?.cta} />;
}
