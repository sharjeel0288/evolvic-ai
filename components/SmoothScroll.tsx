"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    // mobile: don't re-layout pins when the URL bar shows/hides
    ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: "visibilitychange,DOMContentLoaded,load" });

    // Re-measure every trigger once late content has settled: webfonts, lazy images, video metadata,
    // real resizes (width change) and orientation flips. Debounced so a burst costs one refresh.
    let t = 0, lastW = window.innerWidth;
    const refresh = () => { clearTimeout(t); t = window.setTimeout(() => ScrollTrigger.refresh(), 180); };
    const onResize = () => { if (window.innerWidth !== lastW) { lastW = window.innerWidth; refresh(); } }; // height-only = mobile address bar → ignore
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", refresh);
    const media = (e: Event) => { const el = e.target as HTMLElement; if (el.tagName === "IMG" || el.tagName === "VIDEO") refresh(); };
    document.addEventListener("load", media, true);
    document.addEventListener("loadedmetadata", media, true);
    const cleanup = () => {
      clearTimeout(t);
      window.removeEventListener("load", refresh); window.removeEventListener("resize", onResize); window.removeEventListener("orientationchange", refresh);
      document.removeEventListener("load", media, true); document.removeEventListener("loadedmetadata", media, true);
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return cleanup;
    const mac = document.documentElement.classList.contains("is-mac");
    // Mac trackpads already deliver inertial wheel events; a softer lerp + lower multiplier avoids double-smoothing
    // (the "laggy / floaty" feel) and fewer large jumps per frame. Touch stays native (syncTouch off).
    const lenis = new Lenis({ lerp: mac ? 0.12 : 0.09, smoothWheel: true, wheelMultiplier: mac ? 0.85 : 1, syncTouch: false });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    if (ScrollTrigger.isTouch === 1) ScrollTrigger.normalizeScroll({ allowNestedScroll: true, type: "touch" });
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      cleanup();
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.normalizeScroll(false);
    };
  }, []);
  return null;
}
