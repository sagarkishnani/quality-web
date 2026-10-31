interface Props {
  image: string;
  align?: "left" | "center";
  tinaField?: string;
}

const SCRIMS = {
  left: "bg-gradient-to-r from-ink/80 to-ink/30",
  center: "bg-gradient-to-b from-ink/60 via-ink/30 to-ink/50",
};

export default function HeroPhoto({ image, align = "left", tinaField }: Props) {
  return (
    <>
      <div aria-hidden data-parallax="0.15" data-parallax-pinned className="absolute inset-x-0 -top-[10%] h-[120%]">
        <img src={image} alt="" loading="eager" fetchPriority="high" className="h-full w-full object-cover" data-tina-field={tinaField} />
      </div>
      <div aria-hidden className={`absolute inset-0 ${SCRIMS[align]}`} />
    </>
  );
}
