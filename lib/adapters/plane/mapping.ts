import type { CanonicalTask } from "@/lib/tasks/types";
import type { PlaneState, PlaneWorkItem } from "./types";

// Maps one Plane work item (+ its resolved state, for the canonical status
// bucket) to the shared canonical Task shape from lib/tasks/types.ts.
//
// Deliberately does NOT collapse Plane's multi-assignee array into a single
// canonical owner — see docs/integrations/plane.md "Known mismatch": that
// decision belongs to whoever wires this into the knowledge graph, not to
// this mapper.
export function toCanonicalTask(
  workItem: PlaneWorkItem,
  state: PlaneState | undefined,
  projectName: string | undefined,
  observedAt: string = new Date().toISOString(),
): CanonicalTask {
  return {
    id: `plane:${workItem.id}`,
    title: workItem.name,
    status: state?.group ?? "unknown",
    priority: workItem.priority ?? null,
    dueDate: workItem.target_date ?? null,
    startDate: workItem.start_date ?? null,
    assigneeIds: workItem.assignees ?? [],
    createdAt: workItem.created_at,
    updatedAt: workItem.updated_at,
    archivedAt: workItem.archived_at ?? null,
    sourceRefs: [
      {
        system: "plane",
        objectType: "work_item",
        externalId: workItem.id,
        // Project name, not a deep link — the work-item URL format isn't
        // confirmed anywhere in docs/integrations/plane.md's sources, so
        // `url` is deliberately left unset rather than guessed.
        title: projectName,
        observedAt,
      },
    ],
  };
}
