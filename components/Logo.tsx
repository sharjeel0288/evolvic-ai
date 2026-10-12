import Image from "next/image";
import Link from "next/link";

/** Single source of truth for the brand mark. Swap /public/logo.svg to rebrand. */
export default function Logo({ className = "", height = 26 }: { className?: string; height?: number }) {
  return (
    <Link href="/" aria-label="Evolviq AI — home" className={`inline-flex items-center ${className}`}>
      <Image src="/logo.svg" alt="Evolviq AI" width={Math.round(height * 5.5)} height={height} priority />
    </Link>
  );
}
