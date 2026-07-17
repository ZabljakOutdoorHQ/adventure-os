import { UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { CanonicalTask, WaitingForMeViewState } from "@/lib/tasks";

const MAX_VISIBLE_TASKS = 5;

const STATUS_LABEL: Record<string, string> = {
  backlog: "Backlog",
  unstarted: "Unstarted",
  started: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
  triage: "Triage",
  unknown: "Unknown status",
};

const PRIORITY_LABEL: Record<string, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  low: "Low",
};

function dueDateTone(dueDate: string | null, today: string) {
  if (!dueDate) return "text-[var(--muted-foreground)]";
  if (dueDate < today) return "text-[var(--danger)]";
  if (dueDate === today) return "text-[var(--warning)]";
  return "text-[var(--muted-foreground)]";
}

function formatDueDate(dueDate: string | null, today: string) {
  if (!dueDate) return "No due date";
  if (dueDate < today) return `Overdue · ${dueDate}`;
  if (dueDate === today) return "Due today";
  return `Due ${dueDate}`;
}

function TaskRow({ task, today }: { task: CanonicalTask; today: string }) {
  const projectName = task.sourceRefs[0]?.title;
  return (
    <li className="border-t pt-2 first:border-t-0 first:pt-0 [&:not(:first-child)]:mt-2">
      <p className="text-sm font-medium leading-snug">{task.title}</p>
      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--muted-foreground)]">
        {projectName && <span>{projectName}</span>}
        <span>{STATUS_LABEL[task.status] ?? task.status}</span>
        {task.priority && PRIORITY_LABEL[task.priority] && (
          <span>{PRIORITY_LABEL[task.priority]}</span>
        )}
        <span className={dueDateTone(task.dueDate, today)}>
          {formatDueDate(task.dueDate, today)}
        </span>
      </div>
    </li>
  );
}

export function WaitingForMeCard({
  result,
}: {
  result: WaitingForMeViewState;
}) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center gap-2 pb-2">
        <div className="grid h-8 w-8 flex-none place-items-center rounded-lg bg-[var(--accent)] text-[var(--accent-foreground)]">
          <UserCheck size={15} />
        </div>
        <CardTitle className="text-sm">Waiting for me</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {result.state === "disconnected" && (
          <p className="text-sm text-[var(--muted-foreground)]">
            Not yet connected. Configure Plane to see your tasks here.
          </p>
        )}
        {result.state === "unavailable" && (
          <p className="text-sm text-[var(--muted-foreground)]">
            Plane is configured but couldn't be reached just now.
          </p>
        )}
        {result.state === "empty" && (
          <p className="text-sm text-[var(--muted-foreground)]">
            Nothing is waiting on you right now.
          </p>
        )}
        {result.state === "populated" && (
          <ul>
            {result.tasks.slice(0, MAX_VISIBLE_TASKS).map((task) => (
              <TaskRow key={task.id} task={task} today={today} />
            ))}
            {result.tasks.length > MAX_VISIBLE_TASKS && (
              <li className="mt-2 border-t pt-2 text-xs text-[var(--muted-foreground)]">
                +{result.tasks.length - MAX_VISIBLE_TASKS} more
              </li>
            )}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
