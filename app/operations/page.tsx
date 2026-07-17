import { ClipboardList, Package, Radar } from "lucide-react";
import { EntitySectionCard } from "@/components/demo/entity-section-card";
import { SectionHeader } from "@/components/demo/section-header";
import { bookings, documents, people, projects } from "@/lib/demo/data";

export default function OperationsPage() {
  const guides = people.filter((person) => person.subtitle?.includes("Guide"));
  const fleet = [
    ...projects.filter((project) => project.id === "project-fleet"),
    ...documents.filter((doc) => doc.id === "doc-fleet-contract"),
  ];

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        description="Daily activity, bookings and operational status from Adventure Hub and connected systems. Demo data only — this does not reflect real bookings."
        eyebrow="Operations"
        title="Operations"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <EntitySectionCard
          icon={Radar}
          items={bookings}
          title="Today's activities"
        />
        <EntitySectionCard
          icon={ClipboardList}
          items={guides}
          title="Guide assignments"
        />
        <EntitySectionCard
          icon={Package}
          items={fleet}
          title="Fleet & assets"
        />
      </div>
    </div>
  );
}
