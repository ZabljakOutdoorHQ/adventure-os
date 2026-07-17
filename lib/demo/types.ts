// Prototype-only entity model. This exists to make the information
// architecture click-through-able (docs/PROJECT_CONSTITUTION.md §8: "mock
// data precedes live data"). It intentionally does not reuse or extend the
// canonical lib/tasks types beyond a light adaptation in data.ts — nothing
// here is a source-of-truth model, an adapter, or wired to a real system.

export type DemoEntityKind =
  | "person"
  | "organisation"
  | "project"
  | "booking"
  | "document"
  | "task"
  | "message"
  | "event";

export type DemoFact = {
  label: string;
  value: string;
};

export type DemoEntity = {
  id: string;
  kind: DemoEntityKind;
  title: string;
  subtitle?: string;
  description?: string;
  facts?: DemoFact[];
  relatedIds?: string[];
  href?: string;
};

export type DemoEdge = {
  from: string;
  to: string;
  relation: string;
};
