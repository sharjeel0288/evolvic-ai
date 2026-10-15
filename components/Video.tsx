"use client";
import { useEffect, useRef, type ComponentProps, type Ref } from "react";

/**
 * Responsive background video: 720p portrait variant (-m) on phones via <source media>,
 * 1280×720 on larger screens; WebM (VP9) first where available, H.264 MP4 fallback.
 *
 * autoPlay loops are driven here, not by the attribute alone:
 * - React never writes the `muted` *attribute* into SSR HTML, so iOS/Android Safari & Chrome can refuse the
 *   attribute autoplay; we force `muted` + `playsinline` on the element and call play() ourselves.
 * - Loops play only while on screen and the tab is visible (big GPU/decoder saving on Mac Retina).
 */
export default function Video({ name, webm = true, ref, autoPlay, ...p }: { name: string; webm?: boolean; ref?: Ref<HTMLVideoElement> } & ComponentProps<"video">) {
  const m = "(max-width: 767px)";
  const own = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = own.current;
    if (!v || !autoPlay) return;
    v.muted = true; v.defaultMuted = true; v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    let seen = false;
    const sync = () => {
      if (seen && !document.hidden) {
        if (v.preload === "none") v.preload = "auto";
        v.play().catch(() => {});
      } else if (!v.paused) v.pause();
    };
    const io = new IntersectionObserver(([e]) => { seen = e.isIntersecting; sync(); }, { rootMargin: "100px 0px" });
    io.observe(v);
    // first touch unlocks playback on browsers that blocked the initial attempt (Low Power Mode etc.)
    const unlock = () => sync();
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("touchstart", unlock, { passive: true, once: true });
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", sync); window.removeEventListener("touchstart", unlock); };
  }, [autoPlay]);
  const setRef = (el: HTMLVideoElement | null) => {
    own.current = el;
    if (typeof ref === "function") ref(el); else if (ref) (ref as { current: HTMLVideoElement | null }).current = el;
  };
  return (
    <video ref={setRef} muted playsInline aria-hidden tabIndex={-1} poster={`/videos/${name}-poster.webp`} {...p}>
      {webm && <source src={`/videos/${name}-m.webm`} type="video/webm" media={m} />}
      <source src={`/videos/${name}-m.mp4`} type="video/mp4" media={m} />
      {webm && <source src={`/videos/${name}.webm`} type="video/webm" />}
      <source src={`/videos/${name}.mp4`} type="video/mp4" />
    </video>
  );
}
