import { mediaUrl } from "../../utils/mediaUrl";

interface Props {
  webm?: string | null;
  mp4?: string | null;
  poster?: string;
  className: string;
  lazy?: boolean;
}

const SOURCE_TYPES = [
  ["webm", "video/webm"],
  ["mp4", "video/mp4"],
] as const;

export default function BackgroundVideo({ webm, mp4, poster, className, lazy }: Props) {
  const files = { webm, mp4 };
  const sources = SOURCE_TYPES.filter(([format]) => files[format]).map(([format, type]) => ({ src: mediaUrl(files[format]!), type }));

  if (!sources.length) {
    return poster ? <img src={poster} alt="" className={className} loading={lazy ? "lazy" : undefined} decoding={lazy ? "async" : undefined} /> : null;
  }

  return (
    <video
      data-motion-video
      data-lazy-video={lazy ? "" : undefined}
      className={className}
      poster={poster}
      muted
      loop
      playsInline
      aria-hidden
      autoPlay={!lazy}
      preload={lazy ? "none" : "metadata"}
    >
      {sources.map(({ src, type }) => (lazy ? <source key={type} data-src={src} type={type} /> : <source key={type} src={src} type={type} />))}
    </video>
  );
}
