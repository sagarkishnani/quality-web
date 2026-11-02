const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const reducedMotion = () => window.matchMedia(REDUCED_MOTION_QUERY);

let listening = false;

function motionVideos() {
  return document.querySelectorAll<HTMLVideoElement>("video[data-motion-video]");
}

function syncVideos() {
  for (const video of motionVideos()) {
    if (reducedMotion().matches) video.pause();
    else void video.play().catch(() => {});
  }
}

export function startReducedMotionVideos() {
  if (reducedMotion().matches) syncVideos();

  if (listening) return;
  listening = true;
  reducedMotion().addEventListener("change", syncVideos);
}
