import type { TaskServiceStatus } from "./task-service";
import type { CanonicalTask } from "./types";

export type WaitingForMeViewState =
  | { state: "disconnected" }
  | { state: "unavailable" }
  | { state: "empty" }
  | { state: "populated"; tasks: CanonicalTask[] };

// Resolves every outcome a consumer needs to render for "tasks assigned to
// the current user": not configured, configured but the live call failed,
// configured and empty, or configured with real tasks — sorted overdue
// first, then due today, then upcoming, then tasks with no due date.
//
// Pure aside from the TaskService call itself: takes a TaskServiceStatus,
// never constructs one. No adapter import here or anywhere else in
// lib/tasks — see lib/task-service-provider.ts for where a status is
// actually produced.
export async function resolveWaitingForMeViewState(
  status: TaskServiceStatus,
): Promise<WaitingForMeViewState> {
  if (status.state === "disabled") {
    return { state: "disconnected" };
  }

  try {
    const user = await status.service.getCurrentUser();
    const tasks = await status.service.listTasks({ assigneeId: user.id });
    if (tasks.length === 0) {
      return { state: "empty" };
    }
    return { state: "populated", tasks: sortByUrgency(tasks) };
  } catch {
    return { state: "unavailable" };
  }
}

function urgencyBucket(task: CanonicalTask, today: string): number {
  if (!task.dueDate) return 3; // no due date — least urgent
  if (task.dueDate < today) return 0; // overdue
  if (task.dueDate === today) return 1; // due today
  return 2; // upcoming
}

function sortByUrgency(tasks: CanonicalTask[]): CanonicalTask[] {
  const today = new Date().toISOString().slice(0, 10);
  return [...tasks].sort((a, b) => {
    const bucketDiff = urgencyBucket(a, today) - urgencyBucket(b, today);
    if (bucketDiff !== 0) return bucketDiff;
    if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
    return 0;
  });
}
