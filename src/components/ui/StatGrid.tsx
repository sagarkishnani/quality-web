import { tinaField } from "tinacms/dist/react";

interface Stat {
  value?: string | null;
  label?: string | null;
}

export default function StatGrid({ stats }: { stats: (Stat | null)[] }) {
  const visible = stats.filter((stat): stat is Stat => Boolean(stat?.value));
  if (!visible.length) return null;

  return (
    <dl className="grid grid-cols-2 gap-y-10 gap-x-6 lg:grid-cols-4">
      {visible.map((stat, index) => (
        <div key={index} className="flex flex-col-reverse gap-2">
          <dt className="text-body-base text-content-muted" data-tina-field={tinaField(stat as any, "label")}>
            {stat.label}
          </dt>
          <dd
            className="text-heading-lg text-accent"
            data-tina-field={tinaField(stat as any, "value")}
          >
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
