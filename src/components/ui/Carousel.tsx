import type { ReactNode } from "react";

const ITEM_WIDTH = {
  "62": "[&>*]:basis-[62%]",
  "68": "[&>*]:basis-[68%]",
  "72": "[&>*]:basis-[72%]",
  "78": "[&>*]:basis-[78%]",
  "84": "[&>*]:basis-[84%]",
};

interface Props {
  itemWidth: keyof typeof ITEM_WIDTH;
  gridClassName: string;
  label: string;
  focusable?: boolean;
  className?: string;
  children: ReactNode;
}

export default function Carousel({ itemWidth, gridClassName, label, focusable = false, className = "", children }: Props) {
  return (
    <div
      role="region"
      aria-label={label}
      tabIndex={focusable ? 0 : undefined}
      className={`-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:shrink-0 [&>*]:snap-start ${ITEM_WIDTH[itemWidth]} md:mx-0 md:grid md:snap-none md:overflow-visible md:px-0 md:[&>*]:basis-auto ${gridClassName} ${className}`}
    >
      {children}
    </div>
  );
}
