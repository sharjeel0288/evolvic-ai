import Reveal from "./Reveal";
import SplitHeading from "./SplitHeading";

export default function SectionHead({ id, eyebrow, title, lead, className = "" }: { id: string; eyebrow?: string; title: string; lead?: string; className?: string }) {
  return (
    <div className={`mb-14 max-w-5xl ${className}`}>
      {eyebrow && <Reveal><p className="mono mb-5">{eyebrow}</p></Reveal>}
      <SplitHeading id={id} text={title} />
      {lead && <Reveal delay={0.15}><p className="lead mt-6">{lead}</p></Reveal>}
    </div>
  );
}
