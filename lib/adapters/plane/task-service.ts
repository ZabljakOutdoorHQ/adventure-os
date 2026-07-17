import type { TaskService } from "@/lib/tasks/task-service";
import type {
  CanonicalTask,
  CanonicalTaskUser,
  TaskFilter,
} from "@/lib/tasks/types";
import { PlaneClient, type PlaneClientConfig } from "./client";
import { toCanonicalTask } from "./mapping";

// The only place in this codebase that is allowed to know Plane exists
// beyond lib/adapters/plane itself. Implements the canonical TaskService —
// every method here returns canonical types, never PlaneWorkItem, PlaneUser,
// or any other Plane-shaped value. Swapping Plane for a different task
// system later means writing a new TaskService implementation; nothing that
// depends on TaskService (Mission Control included) needs to change.
export class PlaneTaskService implements TaskService {
  private readonly client: PlaneClient;

  constructor(config: PlaneClientConfig) {
    this.client = new PlaneClient(config);
  }

  async getCurrentUser(): Promise<CanonicalTaskUser> {
    const user = await this.client.getCurrentUser();
    if (!user.id) {
      throw new Error("Plane /users/me/ response had no id");
    }
    const displayName =
      user.display_name ??
      [user.first_name, user.last_name].filter(Boolean).join(" ") ??
      user.email ??
      user.id;
    return {
      id: user.id,
      displayName: displayName || user.id,
      email: user.email ?? null,
    };
  }

  // Confirmed gaps this method works around (see docs/integrations/plane.md):
  // work items and states are only listable per-project, so "all tasks in
  // the workspace" means iterating every project; there's no server-side
  // due-date filter, so dueOnOrBefore is applied client-side after fetching.
  //
  // Not handled: pagination beyond each endpoint's first page. Plane's
  // pagination contract (limit/offset vs cursor) isn't fully confirmed
  // (see docs/integrations/plane.md), and this adapter isn't connected to
  // any UI yet — adding untested pagination logic now would be guessing at
  // a contract, not implementing a confirmed one.
  async listTasks(filter?: TaskFilter): Promise<CanonicalTask[]> {
    const projects = await this.client.listProjects();
    const perProject = await Promise.all(
      projects.results.map((project) =>
        this.listTasksForProject(project.id, filter),
      ),
    );
    const tasks = perProject.flat();

    if (!filter?.dueOnOrBefore) return tasks;
    const cutoff = filter.dueOnOrBefore;
    return tasks.filter(
      (task) => task.dueDate !== null && task.dueDate <= cutoff,
    );
  }

  private async listTasksForProject(
    projectId: string,
    filter?: TaskFilter,
  ): Promise<CanonicalTask[]> {
    const [workItems, states] = await Promise.all([
      this.client.listWorkItems(
        projectId,
        filter?.assigneeId ? { assignee: filter.assigneeId } : undefined,
      ),
      this.client.listStates(projectId),
    ]);
    const stateById = new Map(states.results.map((state) => [state.id, state]));

    return workItems.results.map((workItem) =>
      toCanonicalTask(
        workItem,
        workItem.state ? stateById.get(workItem.state) : undefined,
      ),
    );
  }
}

export function createPlaneTaskService(config: PlaneClientConfig): TaskService {
  return new PlaneTaskService(config);
}
