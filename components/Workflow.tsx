"use client";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SplitHeading from "./SplitHeading";
import { home } from "@/lib/content";
import { fx } from "@/lib/fx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Original sys(): pinned 340%; a signal dot travels the workflow path, lighting each node, driving the particle "pulse" and a camera push-in. */
export default function Workflow() {
  const ref = useRef<HTMLElement>(null);
  const path = useRef<SVGPathElement>(null), dot = useRef<SVGCircleElement>(null);
  const [stage, setStage] = useState(0);
  const s = home.sys;
  const pts = s.nodes.map((_, i) => ({ x: 70 + i * 152, y: i % 2 ? 150 : 70 }));
  const d = pts.map((p, i) => (i ? `L${p.x},${p.y}` : `M${p.x},${p.y}`)).join(" ");

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const L = path.current!.getTotalLength(), o = { p: 0 };
      let last = -1;
      gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top top", end: "+=200%", pin: true, scrub: 1.2, anticipatePin: 1 } })
        .fromTo(".sys-h .w i", { yPercent: 120 }, { yPercent: 0, stagger: 0.02, duration: 0.5 }, 0)
        .fromTo(".sys-copy", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0.2)
        .fromTo(".sys-card", { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 }, 0.1)
        .to(o, { p: 1, ease: "none", duration: 3, onUpdate: () => {
          const pt = path.current!.getPointAtLength(L * o.p);
          dot.current!.setAttribute("cx", String(pt.x)); dot.current!.setAttribute("cy", String(pt.y));
          let n = 0; pts.forEach((q, j) => { if (pt.x >= q.x - 4) n = j; });
          if (n !== last) { last = n; setStage(n); }
          fx.pulse.value = -3.4 + 6.8 * o.p;
          path.current!.style.strokeDashoffset = String(L * (1 - o.p));
        } }, 0.4)
        .to(fx.state, { z: () => fx.base * 0.72, duration: 1.5, ease: "power1.inOut" }, 0.5)
        .to(fx.state, { z: () => fx.base, duration: 1 }, 2);
      gsap.set(path.current, { strokeDasharray: L, strokeDashoffset: L });
    });
  }, { scope: ref });

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center px-site py-[clamp(96px,11vw,150px)]" aria-labelledby="sys-h" data-scene data-shape="1" data-x="0" data-name="Connected">
      <div className="grid w-full items-center gap-14 lg:grid-cols-2">
        <div className="scrim relative">
          <p className="mono mb-5">{s.eyebrow}</p>
          <SplitHeading id="sys-h" manual text={s.h2} className="sys-h" />
          <p className="sys-copy lead mt-6">{s.copy}</p>
        </div>
        <div className="sys-card nm p-6 md:p-8">
          <svg viewBox="0 0 900 220" className="w-full" role="img" aria-label={`Workflow: ${s.nodes.join(" to ")}`}>
            <defs>
              <linearGradient id="wl" x1="0" x2="1"><stop offset="0" stopColor="#5ce1e6" /><stop offset="1" stopColor="#8e7bff" /></linearGradient>
              <filter id="glow"><feGaussianBlur stdDeviation="4" /></filter>
            </defs>
            <path d={d} stroke="rgba(255,255,255,.08)" strokeWidth="2" fill="none" />
            <path ref={path} d={d} stroke="url(#wl)" strokeWidth="2.5" fill="none" />
            {pts.map((p, i) => (
              <g key={i} className="transition-all duration-500" style={{ opacity: i <= stage ? 1 : 0.35 }}>
                <circle cx={p.x} cy={p.y} r="26" fill="#0d0f13" stroke={i <= stage ? "url(#wl)" : "rgba(255,255,255,.15)"} strokeWidth="1.5" />
                <circle cx={p.x} cy={p.y} r={i === stage ? 9 : 5} fill={i <= stage ? "#5ce1e6" : "#5ce1e6"} filter={i === stage ? "url(#glow)" : undefined} />
                <text x={p.x} y={i % 2 ? p.y + 52 : p.y - 40} textAnchor="middle" fill="#ecedf1" fontSize="15" fontFamily="var(--font-geist-mono)" letterSpacing="2">{s.nodes[i].toUpperCase()}</text>
              </g>
            ))}
            <circle ref={dot} cx={pts[0].x} cy={pts[0].y} r="7" fill="#5ce1e6" filter="url(#glow)" />
          </svg>
          <p className="mono mt-4 text-center" data-nodecode aria-live="off">Stage · {s.nodes[stage]}</p>
          <p className="mono mt-2 text-center !text-mut">{s.micro}</p>
        </div>
      </div>
    </section>
  );
}
