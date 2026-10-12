"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Logo from "./Logo";
import { NAV } from "@/lib/site";

export default function Nav() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // menu is "open for a path": navigating anywhere (link, back/forward) closes it automatically
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === path;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => setOpenAt((cur) => ((typeof v === "function" ? v(cur === path) : v) ? path : null));
  const hdr = useRef<HTMLElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  // open menu: Escape closes (focus back to the toggle), Tab is trapped in toggle + menu, page scroll is locked
  useEffect(() => {
    if (!open) return;
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    const root = document.documentElement, prev = root.style.overflow;
    root.style.overflow = "hidden"; lenis?.stop();
    const items = () => [btn.current!, ...Array.from(hdr.current!.querySelectorAll<HTMLElement>("#mnav a"))];
    const t = window.setTimeout(() => items()[1]?.focus(), 250);
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpenAt(null); btn.current?.focus(); return; }
      if (e.key !== "Tab") return;
      const f = items(), i = f.indexOf(document.activeElement as HTMLElement);
      const n = e.shiftKey ? (i <= 0 ? f.length - 1 : i - 1) : (i === f.length - 1 || i < 0 ? 0 : i + 1);
      e.preventDefault(); f[n].focus();
    };
    window.addEventListener("keydown", k);
    return () => { window.clearTimeout(t); window.removeEventListener("keydown", k); root.style.overflow = prev; lenis?.start(); };
  }, [open]);

  return (
    <header ref={hdr} className={`fixed inset-x-0 top-0 z-50 px-3 transition-all duration-500 sm:px-5 ${scrolled ? "pt-2.5" : "pt-4"}`}>
      
      <nav aria-label="Primary" data-theme="light" className={`relative mx-auto flex max-w-[1240px] items-center justify-between gap-6 overflow-hidden rounded-full border py-2 pl-5 pr-2 backdrop-blur-xl transition-all duration-500 ${scrolled ? "border-black/5 !bg-white/95 shadow-[0_18px_40px_-22px_rgba(7,0,64,.45)]" : "border-black/5 !bg-white/90"}`}>
        <motion.span aria-hidden style={{ scaleX: bar }} className="absolute inset-x-6 bottom-0 h-px origin-left bg-gradient-to-r from-iris via-violet to-cyan opacity-70" />
        <Logo dark />
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <li key={n.href}>
                <Link href={n.href} aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${active ? "bg-black/[.07] text-ink" : "text-ink2 hover:bg-black/[.04] hover:text-ink"}`}>
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn p hidden !px-5 !py-2.5 !text-[14px] sm:inline-flex">Book a Consultation</Link>
          <button ref={btn} type="button" className="flex h-10 items-center gap-2.5 rounded-full bg-[#0a0a0a] pl-4 pr-3.5 text-[14px] font-medium text-white lg:hidden [&_span_span]:!bg-white" aria-expanded={open} aria-controls="mnav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            <span aria-hidden>{open ? "Close" : "Menu"}</span>
            <span aria-hidden className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-4 bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mnav" role="dialog" aria-modal="true" aria-label="Menu" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-0 -z-10 flex flex-col justify-center gap-2 bg-bg/95 px-[8vw] backdrop-blur-xl lg:hidden">
            {NAV.map((n, i) => (
              <motion.div key={n.href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <Link href={n.href} onClick={() => setOpen(false)} aria-current={(n.href === "/" ? path === "/" : path.startsWith(n.href)) ? "page" : undefined}
                  className="display block py-1 text-[clamp(30px,8vw,56px)] aria-[current=page]:text-iris">{n.label}</Link>
              </motion.div>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="btn p mt-6 self-start">Book a Consultation</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
