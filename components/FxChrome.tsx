"use client";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fx, reducedMotion } from "@/lib/fx";
import { decode } from "@/lib/decode";

gsap.registerPlugin(ScrollTrigger);

/**
 * Cinematic chrome ported from the original: intro loader (counter + circular iris reveal + camera dive),
 * custom cursor (dot + ring), section rail,
 * letterbox bars on flagged scenes, opt-in scramble-decode ([data-decode]), and per-scene particle shape/offset.
 * Scenes opt in with data-scene, data-shape, data-x, data-name, data-lb.
 */
export default function FxChrome() {
  const path = usePathname();
  const [loading, setLoading] = useState(true);
  const [scenes, setScenes] = useState<{ name: string; el: HTMLElement }[]>([]);
  const [active, setActive] = useState(0);
  const cd = useRef<HTMLDivElement>(null), cr = useRef<HTMLDivElement>(null);
    const lbT = useRef<HTMLDivElement>(null), lbB = useRef<HTMLDivElement>(null);
  const ld = useRef<HTMLDivElement>(null), ldn = useRef<HTMLDivElement>(null), ldb = useRef<HTMLElement>(null);

  // Intro loader (once per session)
  useEffect(() => {
    if (reducedMotion() || sessionStorage.getItem("evq-intro")) { fx.introDone = true; fx.state.z = fx.base; if (ld.current) ld.current.style.display = "none"; return; }
    sessionStorage.setItem("evq-intro", "1");
    document.documentElement.classList.add("intro");
    const o = { v: 0 };
    const tl = gsap.timeline();
    tl.to(o, { v: 100, duration: 2, ease: "power2.inOut", onUpdate: () => { if (ldn.current) ldn.current.textContent = String(Math.round(o.v)).padStart(3, "0"); if (ldb.current) ldb.current.style.width = o.v + "%"; } })
      .to(".ld-fade", { opacity: 0, duration: 0.4 })
      .to(ld.current, { clipPath: "circle(0% at 50% 50%)", duration: 1.4, ease: "expo.inOut" })
      .add(() => {
        fx.state.z = fx.base;
        document.documentElement.classList.remove("intro");
        gsap.fromTo([lbT.current, lbB.current], { height: "16vh" }, { height: 0, duration: 2.2, ease: "expo.inOut" });
        window.dispatchEvent(new Event("evq:intro"));
      }, "-=1.1")
      .add(() => { fx.introDone = true; setLoading(false); });
    return () => { tl.kill(); };
  }, []);

  // Custom cursor (fine pointers only)
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const d = cd.current!, r = cr.current!;
    const xTo = gsap.quickTo(r, "x", { duration: 0.35, ease: "power3" }), yTo = gsap.quickTo(r, "y", { duration: 0.35, ease: "power3" });
    const move = (e: PointerEvent) => {
      d.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; xTo(e.clientX); yTo(e.clientY);
      const t = (e.target as HTMLElement).closest?.("[data-c],a,button,summary,select,label") as HTMLElement | null;
      r.classList.toggle("h", !!t);
      const card = (e.target as HTMLElement).closest?.(".nm") as HTMLElement | null;
      if (card) { const b = card.getBoundingClientRect(); card.style.setProperty("--mx", `${e.clientX - b.left}px`); card.style.setProperty("--my", `${e.clientY - b.top}px`); }
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => { window.removeEventListener("pointermove", move); document.documentElement.classList.remove("has-cursor"); };
  }, []);

  // Per-route scene wiring
  useEffect(() => {
    const reduce = reducedMotion();
    let triggers: ScrollTrigger[] = [];
    const t = setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
      setScenes(els.map((el) => ({ name: el.dataset.name || "", el })));
      els.forEach((s, i) => {
        const trg = s.parentElement?.classList.contains("pin-spacer") ? s.parentElement : s;
        triggers.push(ScrollTrigger.create({
          trigger: trg, start: "top 55%", end: "bottom 45%", refreshPriority: -10,
          onToggle: (st) => {
            if (!st.isActive) return;
            setActive(i);
            fx.setShape(+(s.dataset.shape ?? 0));
            fx.setX(+(s.dataset.x ?? 1.7)); fx.scene = s;
            if (!s.dataset.keepChaos) gsap.to(fx.chaos, { value: 0, duration: 1, overwrite: "auto" });
            if (!fx.introDone || reduce) return;
            gsap.to([lbT.current, lbB.current], { height: s.dataset.lb ? "9vh" : 0, duration: 1.3, ease: "expo.inOut", overwrite: "auto" });
          },
        }));
      });
      // Scramble-decode mono eyebrows once on enter
      document.querySelectorAll<HTMLElement>("main [data-decode]").forEach((m) => {
        if (m.children.length) return;
        const txt = m.textContent || "";
        triggers.push(ScrollTrigger.create({ trigger: m, start: "top 92%", once: true, onEnter: () => decode(m, txt) }));
      });
      ScrollTrigger.refresh();
    }, 120);
    const bars = [lbT.current, lbB.current];
    return () => { clearTimeout(t); triggers.forEach((x) => x.kill()); triggers = []; gsap.set(bars, { height: 0 }); };
  }, [path]);

  const jump = (el: HTMLElement) => {
    const trg = el.parentElement?.classList.contains("pin-spacer") ? el.parentElement : el;
    const y = trg.getBoundingClientRect().top + window.scrollY;
    const l = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (l) l.scrollTo(y); else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      <div ref={lbT} aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[45] h-0 bg-black" />
      <div ref={lbB} aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-[45] h-0 bg-black" />
      {scenes.length > 1 && (
        <nav aria-label="Sections" className="fixed right-[1.6vw] top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
          {scenes.map((s, i) => (
            <button key={i} type="button" aria-label={`Jump to section: ${s.name}`} aria-current={i === active ? "true" : undefined} data-c=" " onClick={() => jump(s.el)}
              className={`group relative h-[9px] w-[9px] rounded-full transition-all duration-500 ${i === active ? "!h-[13px] !w-[13px] -mx-[2px] bg-cyan shadow-[0_0_12px_#a59cff]" : "bg-[#1b1e24] shadow-[var(--well)]"}`} >
              <span className={`pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-black/80 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 ${i === active ? "opacity-70" : "opacity-0"}`}>{s.name}</span>
            </button>
          ))}
        </nav>
      )}
      <div ref={cd} aria-hidden className="cur-dot" />
      <div ref={cr} aria-hidden className="cur-ring" />
      {loading && (
        <div ref={ld} aria-hidden className="ld fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-[#050505] [clip-path:circle(150%_at_50%_50%)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/brand/logo-white.svg" alt="" width={231} height={50} className="ld-fade h-[50px] w-auto" />
          <div ref={ldn} className="ld-fade display text-[clamp(80px,18vw,260px)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.4)]">000</div>
          <div className="ld-fade well h-1.5 w-[min(360px,70vw)] overflow-hidden rounded-md"><i ref={ldb} className="block h-full w-0 bg-cyan shadow-[0_0_14px_#a59cff]" /></div>
          <p className="ld-fade mono">Evolviq AI · Smarter Systems. Better Business.</p>
        </div>
      )}
    </>
  );
}
