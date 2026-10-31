import { useEffect, useRef, useState } from "react";
import { FaMinus, FaPlus, FaWhatsapp, FaArrowRight } from "react-icons/fa6";
import { fillTemplate, quoteUrl } from "./quote";

interface Props {
  productName: string;
  productImage?: string;
  quantityLabel: string;
  quoteLabel: string;
  quoteMessage: string;
  advisorTitle: string;
  advisorText: string;
  whatsappUrl?: string;
}

function Stepper({ quantity, onChange, compact = false }: { quantity: number; onChange: (value: number) => void; compact?: boolean }) {
  return (
    <div className={`flex items-center rounded-md bg-surface ${compact ? "h-11" : "h-14"}`}>
      <button type="button" onClick={() => onChange(Math.max(1, quantity - 1))} aria-label="Quitar un equipo" className="flex h-full w-11 items-center justify-center">
        <FaMinus className="h-3 w-3" />
      </button>
      <span className="w-8 text-center text-body-md font-semibold" aria-live="polite">
        {quantity}
      </span>
      <button type="button" onClick={() => onChange(quantity + 1)} aria-label="Agregar un equipo" className="flex h-full w-11 items-center justify-center">
        <FaPlus className="h-3 w-3" />
      </button>
    </div>
  );
}

export default function QuoteBoxReact(props: Props) {
  const [quantity, setQuantity] = useState(1);
  const [showBar, setShowBar] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setShowBar(!entry.isIntersecting && entry.boundingClientRect.top < 0));
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const label = quantity > 1 ? `${props.quoteLabel} (${quantity} equipos)` : props.quoteLabel;
  const href = quoteUrl(fillTemplate(props.quoteMessage, { cantidad: quantity, producto: props.productName }));

  return (
    <>
      <div ref={boxRef}>
        <p className="text-body-base font-semibold">{props.quantityLabel}</p>
        <div className="mt-3 flex gap-3">
          <Stepper quantity={quantity} onChange={setQuantity} />
          <a href={href} className="btn-primary btn-xl flex-1">
            {label}
          </a>
        </div>
        {props.whatsappUrl && (
          <a
            href={props.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-5 flex items-center gap-4 rounded-2xl bg-brand-secondary-lightest px-5 py-4"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-white">
              <FaWhatsapp className="h-5 w-5" aria-hidden />
            </span>
            <span className="flex-1">
              <span className="block text-body-sm font-medium">{props.advisorTitle}</span>
              <span className="block text-body-sm text-content-muted">{props.advisorText}</span>
            </span>
            <FaArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" aria-hidden />
          </a>
        )}
      </div>

      <div
        aria-hidden={!showBar}
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface-raised/95 backdrop-blur transition-transform duration-500 ease-out ${
          showBar ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="container-xl flex items-center gap-4 py-3">
          {props.productImage && <img src={props.productImage} alt="" className="hidden h-12 w-12 object-contain mix-blend-multiply sm:block" />}
          <p className="hidden flex-1 truncate text-body-md font-semibold sm:block">{props.productName}</p>
          <Stepper quantity={quantity} onChange={setQuantity} compact />
          <a href={href} tabIndex={showBar ? 0 : -1} className="btn-primary h-11 flex-1 sm:flex-none">
            {label}
          </a>
        </div>
      </div>
    </>
  );
}
