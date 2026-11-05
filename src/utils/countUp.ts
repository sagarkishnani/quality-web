const DURATION_MS = 1200;
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const FIGURE = /^(\D*)(\d+)(.*)$/s;

let observer: IntersectionObserver | null = null;

const easeOutCubic = (progress: number) => 1 - Math.pow(1 - progress, 3);

function animate(element: HTMLElement) {
  const original = element.dataset.countUp ?? "";
  const match = original.match(FIGURE);
  if (!match) return;
  const [, prefix, digits, suffix] = match;
  const target = Number(digits);
  const startedAt = performance.now();

  const step = (now: number) => {
    const progress = Math.min(1, (now - startedAt) / DURATION_MS);
    element.textContent = progress < 1 ? `${prefix}${Math.round(target * easeOutCubic(progress))}${suffix}` : original;
    if (progress < 1) requestAnimationFrame(step);
  };

  element.textContent = `${prefix}0${suffix}`;
  requestAnimationFrame(step);
}

export function startCountUp() {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches || !("IntersectionObserver" in window)) return;
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        animate(entry.target as HTMLElement);
      }
    },
    { threshold: 0.6 },
  );
  document.querySelectorAll<HTMLElement>("[data-count-up]").forEach((element) => observer?.observe(element));
}
