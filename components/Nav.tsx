"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import Logo from "./Logo";
import { NAV } from "@/lib/site";

export default function Nav() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  // close menu on Escape
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 px-3 transition-all duration-500 sm:px-5 ${scrolled ? "pt-2.5" : "pt-4"}`}>
      
      <nav aria-label="Primary" className={`relative mx-auto flex max-w-[1240px] items-center justify-between gap-6 overflow-hidden rounded-full border py-2 pl-5 pr-2 backdrop-blur-xl transition-all duration-500 ${scrolled ? "border-white/10 bg-[rgba(13,15,21,.72)] shadow-[0_1px_0_rgba(255,255,255,.06)_inset,0_20px_50px_-20px_rgba(0,0,0,.8)]" : "border-white/[.06] bg-[rgba(13,15,21,.35)]"}`}>
        <motion.span aria-hidden style={{ scaleX: bar }} className="absolute inset-x-6 bottom-0 h-px origin-left bg-gradient-to-r from-iris via-violet to-cyan opacity-70" />
        <Logo />
        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href);
            return (
              <li key={n.href}>
                <Link href={n.href} aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors ${active ? "bg-white/[.07] text-ink" : "text-ink2 hover:bg-white/[.04] hover:text-ink"}`}>
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center gap-3">
          <Link href="/contact" className="btn p hidden !px-5 !py-2.5 !text-[14px] sm:inline-flex">Book a Consultation</Link>
          <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/[.04] lg:hidden" aria-expanded={open} aria-controls="mnav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 h-px w-5 bg-ink transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 h-px w-5 bg-ink transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div id="mnav" initial={{ clipPath: "inset(0 0 100% 0)" }} animate={{ clipPath: "inset(0 0 0% 0)" }} exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 top-0 -z-10 flex flex-col justify-center gap-2 bg-bg/95 px-[8vw] backdrop-blur-xl lg:hidden">
            {NAV.map((n, i) => (
              <motion.div key={n.href} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                <Link href={n.href} onClick={() => setOpen(false)} className="display block py-1 text-[clamp(30px,8vw,56px)]">{n.label}</Link>
              </motion.div>
            ))}
            <Link href="/contact" onClick={() => setOpen(false)} className="btn p mt-6 self-start">Book a Consultation</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
