import type { ComponentProps, Ref } from "react";

/**
 * Responsive background video: 720p portrait variant (-m) on phones via <source media>,
 * 1280×720 on larger screens; WebM (VP9) first where available, H.264 MP4 fallback.
 */
export default function Video({ name, webm = true, ref, ...p }: { name: string; webm?: boolean; ref?: Ref<HTMLVideoElement> } & ComponentProps<"video">) {
  const m = "(max-width: 767px)";
  return (
    <video ref={ref} muted playsInline aria-hidden tabIndex={-1} poster={`/videos/${name}-poster.webp`} {...p}>
      {webm && <source src={`/videos/${name}-m.webm`} type="video/webm" media={m} />}
      <source src={`/videos/${name}-m.mp4`} type="video/mp4" media={m} />
      {webm && <source src={`/videos/${name}.webm`} type="video/webm" />}
      <source src={`/videos/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
