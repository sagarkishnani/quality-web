const NEAR_VIEWPORT_MARGIN = "50% 0px";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

let observer: IntersectionObserver | null = null;

function loadNearVideos(entries: IntersectionObserverEntry[]) {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const video = entry.target as HTMLVideoElement;
    observer?.unobserve(video);
    video.src = video.dataset.lazySrc ?? "";
    if (!window.matchMedia(REDUCED_MOTION_QUERY).matches) void video.play().catch(() => {});
  }
}

export function startLazyVideos() {
  observer?.disconnect();
  observer = new IntersectionObserver(loadNearVideos, { rootMargin: NEAR_VIEWPORT_MARGIN });
  document.querySelectorAll("video[data-lazy-src]:not([src])").forEach((video) => observer!.observe(video));
}
