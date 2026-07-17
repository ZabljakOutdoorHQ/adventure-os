import type { CanonicalTask, CanonicalTaskUser, TaskFilter } from "./types";

// The single interface every task source implements and every consumer
// (Mission Control, or any future view) depends on. Replacing Plane with a
// different task system means writing a new class that implements this
// interface — no consumer changes.
export interface TaskService {
  getCurrentUser(): Promise<CanonicalTaskUser>;
  listTasks(filter?: TaskFilter): Promise<CanonicalTask[]>;
}
