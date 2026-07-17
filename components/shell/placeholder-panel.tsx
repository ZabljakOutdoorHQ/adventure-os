import type { LucideIcon } from "lucide-react";

export type PlaceholderRegion = {
  title: string;
  description: string;
  icon: LucideIcon;
};

export function PlaceholderPanel({
  title,
  description,
  icon: Icon,
}: PlaceholderRegion) {
  return (
    <div className="placeholder-panel">
      <div className="placeholder-panel-icon">
        <Icon size={18} />
      </div>
      <p className="placeholder-panel-title">{title}</p>
      <p className="placeholder-panel-body">{description}</p>
      <span className="placeholder-badge">Not yet connected</span>
    </div>
  );
}
