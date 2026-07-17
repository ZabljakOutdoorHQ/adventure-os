import type {
  PlanePriority,
  PlaneState,
  PlaneStateGroup,
  PlaneWorkItem,
} from "./types";

// Shape matches docs/KNOWLEDGE_GRAPH.md's confirmed SourceReference —
// "plane" is already a literal in that document's system union.
export type SourceReference = {
  system: "plane";
  objectType: "work_item";
  externalId: string;
  observedAt: string;
};

// Partial canonical Task per docs/DOMAIN_MODEL.md's Task entity and
// lifecycle fields. Deliberately does NOT include a single `ownerRef` — see
// docs/integrations/plane.md "Known mismatch": Plane work items can have
// multiple assignees, and collapsing that to one owner is a decision for
// whoever wires this into the knowledge graph, not for this mapper.
export type CanonicalTask = {
  title: string;
  status: PlaneStateGroup | "unknown";
  priority: PlanePriority | null;
  dueDate: string | null;
  startDate: string | null;
  assigneeIds: string[];
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  sourceRefs: [SourceReference];
};

export function toCanonicalTask(
  workItem: PlaneWorkItem,
  state: PlaneState | undefined,
  observedAt: string = new Date().toISOString(),
): CanonicalTask {
  return {
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
        observedAt,
      },
    ],
  };
}
