import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import type { WooImage } from "../../lib/woo/types";

export default function ProductGalleryReact({ images, name }: { images: WooImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const count = images.length;

  if (!count) {
    return <div className="flex aspect-[11/9] items-center justify-center rounded-3xl bg-surface text-content-subtle">Sin imagen</div>;
  }

  const go = (step: number) => setIndex((current) => (current + step + count) % count);

  return (
    <div>
      <div className="relative aspect-[11/9] overflow-hidden rounded-3xl bg-surface">
        {images.map((image, imageIndex) => (
          <img
            key={image.src}
            src={image.src}
            alt={image.alt || name}
            loading={imageIndex === 0 ? "eager" : "lazy"}
            className={`absolute inset-0 m-auto h-[82%] w-[82%] object-contain mix-blend-multiply transition-[opacity,transform] duration-700 ease-out ${
              imageIndex === index ? "scale-100 opacity-100" : "pointer-events-none scale-[1.04] opacity-0"
            }`}
          />
        ))}
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Imagen anterior"
              className="absolute left-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface-raised shadow-sm transition-transform hover:scale-105"
            >
              <FaChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Imagen siguiente"
              className="absolute right-5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface-raised shadow-sm transition-transform hover:scale-105"
            >
              <FaChevronRight className="h-3.5 w-3.5" />
            </button>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-surface-raised px-3 py-1 text-caption-sm font-medium" aria-live="polite">
              {index + 1} / {count}
            </span>
          </>
        )}
      </div>

      {count > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto">
          {images.map((image, imageIndex) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setIndex(imageIndex)}
              aria-label={`Ver imagen ${imageIndex + 1}`}
              aria-current={imageIndex === index}
              className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-surface p-1.5 transition-colors ${
                imageIndex === index ? "border-ink" : "border-transparent hover:border-line-strong"
              }`}
            >
              <img src={image.src} alt="" loading="lazy" className="h-full w-full object-contain mix-blend-multiply" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
