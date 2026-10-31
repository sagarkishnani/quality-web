const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const desktop = () => window.matchMedia(DESKTOP_QUERY);
const reducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY);

let layers: HTMLElement[] = [];
const visibleBlocks = new Set<Element>();
let blockObserver: IntersectionObserver | null = null;
let pendingFrame = 0;
let listening = false;

function isEnabled() {
  return desktop().matches && !reducedMotion().matches;
}

function layerOffset(layer: HTMLElement) {
  const factor = Number.parseFloat(layer.dataset.parallax ?? "") || 0;
  if (layer.hasAttribute("data-parallax-pinned")) return window.scrollY * -factor;

  const block = layer.parentElement!.getBoundingClientRect();
  return (block.top + block.height / 2 - window.innerHeight / 2) * -factor;
}

function moveVisibleLayers() {
  pendingFrame = 0;
  if (!isEnabled()) return;
  for (const layer of layers) {
    if (!layer.parentElement || !visibleBlocks.has(layer.parentElement)) continue;
    layer.style.transform = `translate3d(0, ${layerOffset(layer).toFixed(2)}px, 0)`;
  }
}

function scheduleMove() {
  if (!pendingFrame) pendingFrame = requestAnimationFrame(moveVisibleLayers);
}

function syncWithEnvironment() {
  if (isEnabled()) {
    scheduleMove();
    return;
  }
  layers.forEach((layer) => layer.style.removeProperty("transform"));
}

function observeBlocks() {
  blockObserver?.disconnect();
  visibleBlocks.clear();
  blockObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) visibleBlocks.add(entry.target);
      else visibleBlocks.delete(entry.target);
    }
    scheduleMove();
  });
  layers.forEach((layer) => layer.parentElement && blockObserver!.observe(layer.parentElement));
}

export function startParallax() {
  layers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
  observeBlocks();
  syncWithEnvironment();

  if (listening) return;
  listening = true;
  window.addEventListener("scroll", scheduleMove, { passive: true });
  window.addEventListener("resize", scheduleMove, { passive: true });
  desktop().addEventListener("change", syncWithEnvironment);
  reducedMotion().addEventListener("change", syncWithEnvironment);
}
