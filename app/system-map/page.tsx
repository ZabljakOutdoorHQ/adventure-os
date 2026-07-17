import { SectionHeader } from "@/components/demo/section-header";
import { SystemMapGraph } from "@/components/system-map/system-map-graph";

export default function SystemMapPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        description="The connected graph of people, organisations, projects, bookings and documents. Click any node to see its connected context on the right — every relationship shown here is demo data."
        eyebrow="System Map"
        title="System Map"
      />
      <SystemMapGraph />
    </div>
  );
}
