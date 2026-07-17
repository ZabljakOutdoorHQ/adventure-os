import { ClipboardList, Package, Radar } from "lucide-react";
import { PagePlaceholder } from "@/components/shell/page-placeholder";

export default function OperationsPage() {
  return (
    <PagePlaceholder
      description="Daily activity, bookings and operational status from Adventure Hub and connected systems — read-only until a reporting contract is confirmed."
      eyebrow="Operations"
      regions={[
        {
          title: "Today's activities",
          description:
            "Daily bookings, guides and meeting points, once Adventure Hub exposes an approved reporting endpoint.",
          icon: Radar,
        },
        {
          title: "Fleet & assets",
          description:
            "Bike, vehicle and equipment allocation status across Durmitor Adventure and connected activities.",
          icon: Package,
        },
        {
          title: "Guide assignments",
          description:
            "Who is guiding what, where and when, connected to tours and bookings.",
          icon: ClipboardList,
        },
      ]}
      title="Operations"
    />
  );
}
