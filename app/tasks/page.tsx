import {
  CheckCircle2,
  CircleDashed,
  CirclePlay,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import { EntitySectionCard } from "@/components/demo/entity-section-card";
import { SectionHeader } from "@/components/demo/section-header";
import { factValue, taskEntities } from "@/lib/demo/data";

const STATUS_COLUMNS: { status: string; label: string; icon: LucideIcon }[] = [
  { status: "started", label: "In progress", icon: CirclePlay },
  { status: "unstarted", label: "Unstarted", icon: CircleDashed },
  { status: "backlog", label: "Backlog", icon: Inbox },
  { status: "completed", label: "Completed", icon: CheckCircle2 },
];

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        description="Tasks assigned across the team, connected to the projects and people they serve. Demo data only — this does not reflect real Plane tasks."
        eyebrow="Tasks"
        title="Tasks"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {STATUS_COLUMNS.map(({ status, label, icon }) => (
          <EntitySectionCard
            emptyLabel="Nothing here."
            icon={icon}
            items={taskEntities.filter(
              (task) => factValue(task, "Status") === status,
            )}
            key={status}
            title={label}
          />
        ))}
      </div>
    </div>
  );
}
