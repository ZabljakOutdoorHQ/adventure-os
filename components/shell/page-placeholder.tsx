import { PlaceholderPanel, type PlaceholderRegion } from "./placeholder-panel";

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  regions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  regions: PlaceholderRegion[];
}) {
  return (
    <div className="page-placeholder">
      <header className="page-placeholder-header">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="page-placeholder-lede">{description}</p>
      </header>
      <div className="placeholder-grid">
        {regions.map((region) => (
          <PlaceholderPanel key={region.title} {...region} />
        ))}
      </div>
    </div>
  );
}
