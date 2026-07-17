import type { CanonicalTask, CanonicalTaskUser, TaskFilter } from "./types";

// The single interface every task source implements and every consumer
// (Mission Control, or any future view) depends on. Replacing Plane with a
// different task system means writing a new class that implements this
// interface — no consumer changes.
export interface TaskService {
  getCurrentUser(): Promise<CanonicalTaskUser>;
  listTasks(filter?: TaskFilter): Promise<CanonicalTask[]>;
}

// Produced by a composition root (e.g. lib/task-service-provider.ts) that
// decides — from configuration — which concrete TaskService to construct,
// if any. Deliberately adapter-agnostic: this type doesn't know Plane
// exists, only that *some* TaskService might currently be configured.
export type TaskServiceStatus =
  | { state: "disabled" }
  | { state: "ready"; service: TaskService };
