import Image from "next/image";
import Link from "next/link";

/** Brand wordmark (vector, from the supplied logo PDF). `dark` = black lettering for light surfaces. */
export default function Logo({ className = "", height = 26, dark = false, link = true }: { className?: string; height?: number; dark?: boolean; link?: boolean }) {
  const img = <Image src={dark ? "/brand/logo-dark.svg" : "/brand/logo-white.svg"} alt="Evolviq AI" width={Math.round((height * 935) / 202)} height={height} priority unoptimized />;
  if (!link) return <span className={`inline-flex items-center ${className}`}>{img}</span>;
  return <Link href="/" aria-label="Evolviq AI — home" className={`inline-flex items-center ${className}`}>{img}</Link>;
}
