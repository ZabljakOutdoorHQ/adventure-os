import "server-only";

import { createPlaneTaskService } from "@/lib/adapters/plane";
import type { TaskServiceStatus } from "@/lib/tasks";

// The one place in this codebase allowed to decide which concrete
// TaskService (if any) backs the canonical TaskService interface, based on
// environment configuration. Every consumer — Mission Control included —
// depends on TaskService / TaskServiceStatus from lib/tasks only, never on
// this file's imports.
//
// The `server-only` import makes any accidental import of this module from
// a Client Component a build-time error, not a runtime leak — this is how
// PLANE_API_KEY is kept out of the browser, not just by convention.
export function getTaskService(): TaskServiceStatus {
  if (process.env.PLANE_ENABLED !== "true") {
    return { state: "disabled" };
  }

  const apiKey = process.env.PLANE_API_KEY;
  const workspaceSlug = process.env.PLANE_WORKSPACE_SLUG;
  if (!apiKey || !workspaceSlug) {
    return { state: "disabled" };
  }

  return {
    state: "ready",
    service: createPlaneTaskService({
      apiKey,
      workspaceSlug,
      baseUrl: process.env.PLANE_API_BASE_URL,
    }),
  };
}
