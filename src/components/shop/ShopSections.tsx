import { useTina, tinaField } from "tinacms/dist/react";
import { mediaUrl } from "../../utils/mediaUrl";
import Breadcrumbs, { type Crumb } from "../ui/Breadcrumbs";

interface TinaProps {
  query: string;
  variables: object;
  data: any;
}

function useShop({ query, variables, data }: TinaProps) {
  return useTina({ query, variables, data }).data?.shop;
}

export function ShopHeader(props: TinaProps & { crumbs: Crumb[]; title?: string; description?: string }) {
  const hero = useShop(props)?.hero;
  const title = props.title ?? hero?.title;
  const description = props.description ?? hero?.description;
  const editable = props.title === undefined;

  return (
    <div className="container-xl pt-8">
      <Breadcrumbs items={props.crumbs} />
      <div className="mt-10 grid items-start gap-6 md:grid-cols-[1fr_auto]">
        <h1 className="text-heading-xl" data-tina-field={editable && hero ? tinaField(hero, "title") : undefined}>
          {title}
        </h1>
        {description && (
          <p
            className="max-w-sm text-body-lg text-content-muted"
            data-tina-field={editable && hero ? tinaField(hero, "description") : undefined}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export function ShopPromos(props: TinaProps) {
  const promos = (useShop(props)?.promos || []).filter((promo: any) => promo?.title);
  if (!promos.length) return <div hidden />;

  return (
    <section className="bg-surface-raised pb-20 md:pb-28">
      <div className="container-xl grid gap-6 xl:grid-cols-2">
        {promos.map((promo: any, index: number) => {
          const dark = promo.tone !== "light";
          return (
            <article
              key={index}
              className={`relative flex flex-col overflow-hidden rounded-3xl p-8 md:min-h-[320px] md:flex-row md:p-10 ${dark ? "bg-ink text-white" : "bg-surface text-content"}`}
            >
              {promo.image && (
                <img
                  src={mediaUrl(promo.image)}
                  alt=""
                  loading="lazy"
                  className={
                    dark
                      ? "order-last mt-6 h-[200px] w-full object-contain md:absolute md:bottom-0 md:right-10 md:mt-0 md:h-[70%] md:w-auto"
                      : "order-last mt-6 h-[200px] w-full rounded-2xl object-cover md:absolute md:inset-y-0 md:right-0 md:mt-0 md:h-full md:w-1/2 md:rounded-none md:opacity-90 md:[mask-image:linear-gradient(90deg,transparent,#000_40%)]"
                  }
                  data-tina-field={tinaField(promo, "image")}
                />
              )}
              <div className="relative flex flex-col md:max-w-[60%]">
                {promo.eyebrow && (
                  <p
                    className={`eyebrow-caps ${dark ? "text-brand-secondary-light" : "text-brand-secondary-dark"}`}
                    data-tina-field={tinaField(promo, "eyebrow")}
                  >
                    {promo.eyebrow}
                  </p>
                )}
                <h2 className="mt-3 text-heading-xs" data-tina-field={tinaField(promo, "title")}>
                  {promo.title}
                </h2>
                {promo.text && (
                  <p className={`mt-3 text-body-md ${dark ? "text-white/80" : "text-content-muted"}`} data-tina-field={tinaField(promo, "text")}>
                    {promo.text}
                  </p>
                )}
                {promo.buttonLabel && promo.buttonUrl && (
                  <a href={promo.buttonUrl} className={`${dark ? "btn-light" : "btn-primary"} mt-6 self-start whitespace-nowrap md:mt-auto`}>
                    {promo.buttonLabel}
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
