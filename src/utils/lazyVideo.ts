const NEAR_VIEWPORT_MARGIN = "100px 0px";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

let observer: IntersectionObserver | null = null;

function loadSources(video: HTMLVideoElement) {
  video.querySelectorAll<HTMLSourceElement>("source[data-src]").forEach((source) => {
    source.src = source.dataset.src ?? "";
    source.removeAttribute("data-src");
  });
  video.removeAttribute("data-lazy-video");
  video.load();
}

function loadNearVideos(entries: IntersectionObserverEntry[]) {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    const video = entry.target as HTMLVideoElement;
    observer?.unobserve(video);
    loadSources(video);
    if (!window.matchMedia(REDUCED_MOTION_QUERY).matches) void video.play().catch(() => {});
  }
}

export function startLazyVideos() {
  observer?.disconnect();
  observer = new IntersectionObserver(loadNearVideos, { rootMargin: NEAR_VIEWPORT_MARGIN });
  document.querySelectorAll("video[data-lazy-video]").forEach((video) => observer!.observe(video));
}
