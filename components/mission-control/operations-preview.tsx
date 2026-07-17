import { CloudSun, Package, Radar, Users } from "lucide-react";
import { PreviewRow } from "./preview-row";

const operationsItems = [
  {
    title: "Tours",
    icon: Radar,
    emptyState:
      "Today's tours will appear here once Adventure Hub is connected.",
  },
  {
    title: "Guides",
    icon: Users,
    emptyState:
      "Guide assignments will appear here once operational data is connected.",
  },
  {
    title: "Equipment",
    icon: Package,
    emptyState:
      "Bike, vehicle and equipment status will appear here once connected.",
  },
  {
    title: "Weather",
    icon: CloudSun,
    emptyState:
      "Local conditions relevant to today's activities will appear here once connected.",
  },
];

export function OperationsPreview() {
  return (
    <section aria-labelledby="operations-heading">
      <h2 className="mb-3 text-base font-semibold" id="operations-heading">
        Today's operations
      </h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {operationsItems.map((item) => (
          <PreviewRow key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
