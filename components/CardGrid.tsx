import GlowCard from "./GlowCard";
import Reveal from "./Reveal";
import { IconTile } from "@/lib/icons";
import CountUp from "./CountUp";

/** Premium card grid: icon tile + index, title, body. */
export default function CardGrid({ items, cols = 3, numbered = true }: { items: readonly { t: string; d: string }[]; cols?: 2 | 3 | 4; numbered?: boolean }) {
  const c = cols === 4 ? "md:grid-cols-2 lg:grid-cols-4" : cols === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <ul className={`grid gap-4 ${c}`}>
      {items.map((it, i) => (
        <li key={it.t}>
          <Reveal delay={(i % 3) * 0.08} className="h-full">
            <GlowCard className="flex h-full flex-col p-7">
              <div className="mb-8 flex items-center justify-between">
                <IconTile k={it.t} />
                {numbered && <CountUp to={i + 1} className="num" />}
              </div>
              <h3 className="card-title">{it.t}</h3>
              <p className="card-body mt-2.5">{it.d}</p>
            </GlowCard>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}
