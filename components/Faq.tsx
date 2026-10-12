import Reveal from "./Reveal";
import { Plus } from "lucide-react";

export default function Faq({ items }: { items: readonly { q: string; a: string }[] }) {
  return (
    <div className="space-y-3">
      {items.map((f, i) => (
        <Reveal key={f.q} delay={i * 0.04}>
          <details className="nm group p-6 [&_summary::-webkit-details-marker]:hidden">
            <summary className="card-title flex cursor-pointer list-none items-center justify-between gap-6 !text-[17px]">
              {f.q}
              <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[.04] text-iris transition-transform duration-500 group-open:rotate-45 group-open:bg-iris/15"><Plus size={16} /></span>
            </summary>
            <p className="card-body mt-4 max-w-[68ch]">{f.a}</p>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
