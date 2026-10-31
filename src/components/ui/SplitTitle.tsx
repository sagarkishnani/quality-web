interface Props {
  light?: string | null;
  strong?: string | null;
  className?: string;
  tinaField?: string;
  as?: "h1" | "h2" | "h3";
}

export default function SplitTitle({ light, strong, className = "text-heading-xs", tinaField, as: Tag = "h2" }: Props) {
  return (
    <Tag className={`font-medium ${className}`} data-tina-field={tinaField}>
      {light && <span className="text-content-muted">{light} </span>}
      {strong && <strong className="font-bold text-content">{strong}</strong>}
    </Tag>
  );
}
