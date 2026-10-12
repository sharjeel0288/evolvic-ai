"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV } from "@/lib/site";

/** Footer navigation with current-page state (aria-current + iris marker). */
export default function FooterNav() {
  const path = usePathname();
  return (
    <ul className="space-y-2.5">
      {NAV.map((n) => {
        const on = n.href === "/" ? path === "/" : path.startsWith(n.href);
        return (
          <li key={n.href}>
            <Link aria-current={on ? "page" : undefined} href={n.href}
              className={`inline-flex items-center gap-2 text-[15px] transition-colors hover:text-ink ${on ? "text-ink" : "text-ink2"}`}>
              {on && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-iris" />}
              {n.label === "About" ? "About Us" : n.label === "Contact" ? "Contact Us" : n.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
