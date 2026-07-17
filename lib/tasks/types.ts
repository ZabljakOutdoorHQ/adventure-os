// Canonical, source-agnostic task model. Nothing in this file may import
// from lib/adapters/** — Mission Control (and any future consumer) depends
// only on these types, never on a source system's response shapes. See
// docs/MODULARITY.md: "UI components must consume canonical view models,
// not raw third-party API responses."

// Matches docs/KNOWLEDGE_GRAPH.md's confirmed SourceReference shape.
export type SourceReference = {
  system:
    | "google-drive"
    | "gmail"
    | "plane"
    | "docmost"
    | "notion"
    | "adventure-hub"
    | "github"
    | "apple-notes"
    | "apple-reminders"
    | string;
  objectType: string;
  externalId: string;
  url?: string;
  title?: string;
  version?: string;
  observedAt: string;
  modifiedAt?: string;
  checksum?: string;
};

export type CanonicalTaskStatus =
  | "backlog"
  | "unstarted"
  | "started"
  | "completed"
  | "cancelled"
  | "triage"
  | "unknown";

export type CanonicalTaskPriority =
  | "urgent"
  | "high"
  | "medium"
  | "low"
  | "none";

export type CanonicalTaskUser = {
  id: string;
  displayName: string;
  email: string | null;
};

// `id` is provisional: a namespaced composite of the source system and its
// external id (e.g. "plane:<work-item-uuid>"), not a real Adventure OS
// entity id. docs/DOMAIN_MODEL.md's modelling rule is explicit that
// "source-system IDs are never used as the only global identity" — this
// adapter has no persistence layer yet to mint a real one, so this is a
// stand-in until that exists, not a claim that it satisfies that rule.
export type CanonicalTask = {
  id: string;
  title: string;
  status: CanonicalTaskStatus;
  priority: CanonicalTaskPriority | null;
  dueDate: string | null;
  startDate: string | null;
  assigneeIds: string[];
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  sourceRefs: SourceReference[];
};

// Every field is optional and additive — a TaskService implementation only
// needs to honor the filters it can actually support server-side and may
// apply the rest client-side (see docs/integrations/plane.md's confirmed
// gaps around date filtering).
export type TaskFilter = {
  assigneeId?: string;
  dueOnOrBefore?: string; // ISO date, inclusive — covers both "due today" and "overdue"
};
