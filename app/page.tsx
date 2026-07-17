import {
  Activity,
  AlertTriangle,
  CalendarClock,
  HelpCircle,
} from "lucide-react";
import { PagePlaceholder } from "@/components/shell/page-placeholder";

export default function MissionControlPage() {
  return (
    <PagePlaceholder
      description="A prioritised view of what needs attention, connected to real projects, operations and communications once those sources are wired up."
      eyebrow="Mission Control"
      regions={[
        {
          title: "Attention",
          description:
            "Items that need a decision or response, ranked by urgency once real sources are connected.",
          icon: AlertTriangle,
        },
        {
          title: "Today",
          description:
            "Meetings, deadlines, tasks and bookings for today, aggregated from Plane, Calendar and Adventure Hub.",
          icon: CalendarClock,
        },
        {
          title: "Recent activity",
          description:
            "A timeline of what changed across connected systems — bookings, payments, documents and decisions.",
          icon: Activity,
        },
        {
          title: "Open questions",
          description:
            "Unresolved decisions and stale data, surfaced for review instead of silently discarded.",
          icon: HelpCircle,
        },
      ]}
      title="Mission Control"
    />
  );
}
