import Image from "next/image";
import Link from "next/link";

/** Single source of truth for the brand mark. Swap /public/logo.svg to rebrand. */
export default function Logo({ className = "", height = 26, dark = false }: { className?: string; height?: number; dark?: boolean }) {
  return (
    <Link href="/" aria-label="Evolviq AI — home" className={`inline-flex items-center ${className}`}>
      <Image src={dark ? "/logo-dark.svg" : "/logo.svg"} alt="Evolviq AI" width={Math.round(height * 5.5)} height={height} priority />
    </Link>
  );
}
