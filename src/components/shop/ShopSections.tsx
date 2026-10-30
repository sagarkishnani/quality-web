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
        <h1 className="text-heading-lg" data-tina-field={editable && hero ? tinaField(hero, "title") : undefined}>
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
      <div className="container-xl grid gap-6 md:grid-cols-2">
        {promos.map((promo: any, index: number) => {
          const dark = promo.tone !== "light";
          return (
            <article
              key={index}
              className={`relative flex min-h-[320px] overflow-hidden rounded-3xl p-8 md:p-10 ${dark ? "bg-ink text-white" : "bg-surface text-content"}`}
            >
              {promo.image && (
                <img
                  src={mediaUrl(promo.image)}
                  alt=""
                  loading="lazy"
                  className={
                    dark
                      ? "absolute bottom-0 right-6 h-[70%] w-auto object-contain md:right-10"
                      : "absolute inset-y-0 right-0 h-full w-1/2 object-cover opacity-90 [mask-image:linear-gradient(90deg,transparent,#000_40%)]"
                  }
                  data-tina-field={tinaField(promo, "image")}
                />
              )}
              <div className="relative flex max-w-[60%] flex-col">
                {promo.eyebrow && (
                  <p
                    className={`eyebrow-caps ${dark ? "text-brand-secondary-light" : "text-brand-secondary-dark"}`}
                    data-tina-field={tinaField(promo, "eyebrow")}
                  >
                    {promo.eyebrow}
                  </p>
                )}
                <h2 className="mt-3 text-subtitle-lg" data-tina-field={tinaField(promo, "title")}>
                  {promo.title}
                </h2>
                {promo.text && (
                  <p className={`mt-3 text-body-md ${dark ? "text-white/80" : "text-content-muted"}`} data-tina-field={tinaField(promo, "text")}>
                    {promo.text}
                  </p>
                )}
                {promo.buttonLabel && promo.buttonUrl && (
                  <a href={promo.buttonUrl} className={`${dark ? "btn-light" : "btn-primary"} mt-auto self-start`}>
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
