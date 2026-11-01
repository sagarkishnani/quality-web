const DESKTOP_QUERY = "(min-width: 1024px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DRAW_START_VIEWPORT_RATIO = 0.75;

const desktop = () => window.matchMedia(DESKTOP_QUERY);
const reducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY);

let lines: SVGSVGElement[] = [];
let pendingFrame = 0;
let listening = false;

function drawProgress(line: SVGSVGElement) {
  const section = line.closest("section");
  if (!section) return 1;
  const { top, height } = section.getBoundingClientRect();
  const progress = (window.innerHeight * DRAW_START_VIEWPORT_RATIO - top) / height;
  return Math.min(1, Math.max(0, progress));
}

function drawLines() {
  pendingFrame = 0;
  if (!desktop().matches) return;
  for (const line of lines) {
    const progress = reducedMotion().matches ? 1 : drawProgress(line);
    line.style.clipPath = `inset(0 0 ${((1 - progress) * 100).toFixed(2)}% 0)`;
  }
}

function scheduleDraw() {
  if (lines.length && !pendingFrame) pendingFrame = requestAnimationFrame(drawLines);
}

export function startScrollLine() {
  lines = Array.from(document.querySelectorAll<SVGSVGElement>("[data-scroll-line]"));
  scheduleDraw();

  if (listening) return;
  listening = true;
  window.addEventListener("scroll", scheduleDraw, { passive: true });
  window.addEventListener("resize", scheduleDraw, { passive: true });
  desktop().addEventListener("change", scheduleDraw);
  reducedMotion().addEventListener("change", scheduleDraw);
}
