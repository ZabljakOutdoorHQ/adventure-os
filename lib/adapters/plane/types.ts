// Confirmed against docs/integrations/plane.md — every field here traces to
// the official @makeplane/plane-node-sdk's compiled source (dist/types.bundle.d.ts),
// not to guessed API documentation. Do not add fields that aren't confirmed
// there; add a note to that document first if a new field is observed.

export type PlaneUser = {
  id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  display_name?: string;
};

export type PlaneStateGroup =
  | "backlog"
  | "unstarted"
  | "started"
  | "completed"
  | "cancelled"
  | "triage";

export type PlaneState = {
  id: string;
  name: string;
  color: string;
  group?: PlaneStateGroup;
  project?: string;
};

export type PlaneProject = {
  id: string;
  name: string;
  identifier?: string;
  workspace: string;
};

export type PlanePriority = "urgent" | "high" | "medium" | "low" | "none";

// Matches WorkItemBase in the vendor SDK. Capacity for "assignee resolves to
// a single owner" does NOT exist here — assignees is an array; see
// docs/integrations/plane.md "Known mismatch" before collapsing it.
export type PlaneWorkItem = {
  id: string;
  created_at: string;
  updated_at: string;
  archived_at?: string;
  created_by: string;
  updated_by?: string;
  name: string;
  sequence_id: number;
  project: string;
  labels?: string[];
  assignees?: string[];
  state?: string;
  parent?: string;
  is_draft?: boolean;
  completed_at?: string;
  target_date?: string;
  start_date?: string;
  priority?: PlanePriority;
};

// Confirmed request shape for GET /workspaces/{slug}/projects/{projectId}/work-items/
// "assignee" accepts exactly one user id — no confirmed "me" shorthand, no
// confirmed multi-value support. "pql" syntax is undocumented; not used here.
export type PlaneListWorkItemsParams = {
  state?: string;
  assignee?: string;
  limit?: number;
  offset?: number;
};

export type PlanePaginatedResponse<T> = {
  count: number;
  total_count: number;
  total_pages: number;
  results: T[];
  next_cursor?: string;
  prev_cursor?: string;
};
