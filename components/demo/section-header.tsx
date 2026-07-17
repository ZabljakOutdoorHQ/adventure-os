import { DemoBadge } from "./demo-badge";

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="page-placeholder-header">
      <div className="flex items-center gap-2">
        <p className="eyebrow">{eyebrow}</p>
        <DemoBadge />
      </div>
      <h1>{title}</h1>
      <p className="page-placeholder-lede">{description}</p>
    </header>
  );
}
