import { useTina, tinaField } from "tinacms/dist/react";
import { mediaUrl } from "../../utils/mediaUrl";

interface Props {
  query: string;
  variables: object;
  data: any;
}

const REPEAT = 4;

export default function PartnersReact({ query, variables, data: initialData }: Props) {
  const { data } = useTina({ query, variables, data: initialData });
  const partners = data?.global?.partners;
  const logos = (partners?.logos || []).filter((logo: any) => logo?.image);
  if (!logos.length) return <div hidden />;

  const track = Array.from({ length: REPEAT }, () => logos).flat();

  return (
    <section className="py-16 md:py-20" aria-label={partners?.title || "Aliados"}>
      {partners?.title && (
        <p className="text-center text-body-sm font-semibold text-content-muted" data-tina-field={tinaField(partners, "title")}>
          {partners.title}
        </p>
      )}
      <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-20 hover:[animation-play-state:paused] md:gap-28">
          {[...track, ...track].map((logo: any, index: number) => (
            <img
              key={index}
              src={mediaUrl(logo.image)}
              alt={index < logos.length ? logo.name || "" : ""}
              aria-hidden={index >= logos.length}
              loading="lazy"
              className="h-10 w-auto shrink-0 object-contain mix-blend-multiply md:h-12"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
