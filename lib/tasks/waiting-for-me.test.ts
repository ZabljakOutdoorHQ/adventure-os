import { describe, expect, test } from "bun:test";
import type { TaskService, TaskServiceStatus } from "./task-service";
import type { CanonicalTask, CanonicalTaskUser, TaskFilter } from "./types";
import { resolveWaitingForMeViewState } from "./waiting-for-me";

const currentUser: CanonicalTaskUser = {
  id: "user-1",
  displayName: "Test User",
  email: "test@example.com",
};

function makeTask(overrides: Partial<CanonicalTask>): CanonicalTask {
  return {
    id: "plane:test",
    title: "Test task",
    status: "started",
    priority: "medium",
    dueDate: null,
    startDate: null,
    assigneeIds: [currentUser.id],
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
    archivedAt: null,
    sourceRefs: [
      {
        system: "plane",
        objectType: "work_item",
        externalId: "test",
        observedAt: "2026-01-01T00:00:00.000Z",
      },
    ],
    ...overrides,
  };
}

function fakeService(tasks: CanonicalTask[]): TaskService {
  return {
    async getCurrentUser() {
      return currentUser;
    },
    async listTasks() {
      return tasks;
    },
  };
}

describe("resolveWaitingForMeViewState", () => {
  test("returns disconnected when the service status is disabled", async () => {
    const status: TaskServiceStatus = { state: "disabled" };
    expect(await resolveWaitingForMeViewState(status)).toEqual({
      state: "disconnected",
    });
  });

  test("returns unavailable when the service throws", async () => {
    const service: TaskService = {
      async getCurrentUser() {
        throw new Error("network down");
      },
      async listTasks() {
        return [];
      },
    };
    const result = await resolveWaitingForMeViewState({
      state: "ready",
      service,
    });
    expect(result).toEqual({ state: "unavailable" });
  });

  test("returns empty when there are no matching tasks", async () => {
    const service = fakeService([]);
    const result = await resolveWaitingForMeViewState({
      state: "ready",
      service,
    });
    expect(result).toEqual({ state: "empty" });
  });

  test("returns populated tasks sorted overdue, then today, then upcoming, then no due date", async () => {
    const today = new Date().toISOString().slice(0, 10);
    const yesterday = new Date(Date.now() - 86_400_000)
      .toISOString()
      .slice(0, 10);
    const tomorrow = new Date(Date.now() + 86_400_000)
      .toISOString()
      .slice(0, 10);

    const upcoming = makeTask({ id: "upcoming", dueDate: tomorrow });
    const overdue = makeTask({ id: "overdue", dueDate: yesterday });
    const dueToday = makeTask({ id: "today", dueDate: today });
    const noDueDate = makeTask({ id: "none", dueDate: null });

    const service = fakeService([upcoming, overdue, noDueDate, dueToday]);
    const result = await resolveWaitingForMeViewState({
      state: "ready",
      service,
    });

    expect(result.state).toBe("populated");
    if (result.state !== "populated") throw new Error("expected populated");
    expect(result.tasks.map((task) => task.id)).toEqual([
      "overdue",
      "today",
      "upcoming",
      "none",
    ]);
  });

  test("filters tasks by the current user's id", async () => {
    let capturedFilter: TaskFilter | undefined;
    const service: TaskService = {
      async getCurrentUser() {
        return currentUser;
      },
      async listTasks(filter) {
        capturedFilter = filter;
        return [];
      },
    };
    await resolveWaitingForMeViewState({ state: "ready", service });
    expect(capturedFilter?.assigneeId).toBe(currentUser.id);
  });
});
