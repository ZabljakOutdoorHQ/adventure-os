import { Users, Waypoints } from "lucide-react";
import { PagePlaceholder } from "@/components/shell/page-placeholder";

export default function SystemMapPage() {
  return (
    <PagePlaceholder
      description="The connected graph of people, organisations, projects and operations — every inferred relationship shown as confirmed, probable or suggested."
      eyebrow="System Map"
      regions={[
        {
          title: "Graph",
          description:
            "People, organisations, brands, projects, bookings and documents as connected entities, not isolated files.",
          icon: Waypoints,
        },
        {
          title: "People & organisations",
          description:
            "Every person and organisation with their roles, relationships and connected work.",
          icon: Users,
        },
      ]}
      title="System Map"
    />
  );
}
