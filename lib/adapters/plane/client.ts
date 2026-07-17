import type {
  PlaneListWorkItemsParams,
  PlanePaginatedResponse,
  PlaneProject,
  PlaneState,
  PlaneUser,
  PlaneWorkItem,
} from "./types";

export class PlaneApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.name = "PlaneApiError";
    this.status = status;
    this.body = body;
  }
}

export type PlaneClientConfig = {
  apiKey: string;
  workspaceSlug: string;
  baseUrl?: string;
};

// Read-only adapter. There is deliberately no create/update/delete method —
// see docs/integrations/plane.md. Every endpoint here is confirmed against
// the official SDK's own compiled source, not guessed.
export class PlaneClient {
  private readonly apiKey: string;
  private readonly workspaceSlug: string;
  private readonly baseUrl: string;

  constructor(config: PlaneClientConfig) {
    this.apiKey = config.apiKey;
    this.workspaceSlug = config.workspaceSlug;
    this.baseUrl = (config.baseUrl ?? "https://api.plane.so").replace(
      /\/+$/,
      "",
    );
  }

  private async request<T>(
    path: string,
    params?: Record<string, string | number | undefined>,
  ): Promise<T> {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value !== undefined) query.set(key, String(value));
    }
    const suffix = query.toString() ? `?${query.toString()}` : "";
    const response = await fetch(`${this.baseUrl}/api/v1${path}${suffix}`, {
      headers: {
        "X-Api-Key": this.apiKey,
        "Content-Type": "application/json",
      },
    });

    const raw = await response.text();
    let parsed: unknown = raw;
    try {
      parsed = raw ? JSON.parse(raw) : undefined;
    } catch {
      // Non-JSON body — keep the raw text as the error body.
    }

    if (!response.ok) {
      throw new PlaneApiError(
        response.status,
        parsed,
        `Plane request to ${path} failed with ${response.status}`,
      );
    }

    return parsed as T;
  }

  async getCurrentUser(): Promise<PlaneUser> {
    return this.request<PlaneUser>("/users/me/");
  }

  async listWorkspaceMembers(): Promise<PlaneUser[]> {
    return this.request<PlaneUser[]>(
      `/workspaces/${this.workspaceSlug}/members/`,
    );
  }

  async listProjects(params?: {
    limit?: number;
    offset?: number;
  }): Promise<PlanePaginatedResponse<PlaneProject>> {
    return this.request<PlanePaginatedResponse<PlaneProject>>(
      `/workspaces/${this.workspaceSlug}/projects/`,
      params,
    );
  }

  // Confirmed project-scoped only — see docs/integrations/plane.md "Explicit
  // gaps": there is no confirmed workspace-wide work-item list.
  async listWorkItems(
    projectId: string,
    params?: PlaneListWorkItemsParams,
  ): Promise<PlanePaginatedResponse<PlaneWorkItem>> {
    return this.request<PlanePaginatedResponse<PlaneWorkItem>>(
      `/workspaces/${this.workspaceSlug}/projects/${projectId}/work-items/`,
      params,
    );
  }

  async getWorkItemByIdentifier(identifier: string): Promise<PlaneWorkItem> {
    return this.request<PlaneWorkItem>(
      `/workspaces/${this.workspaceSlug}/work-items/${identifier}/`,
    );
  }

  async listStates(
    projectId: string,
  ): Promise<PlanePaginatedResponse<PlaneState>> {
    return this.request<PlanePaginatedResponse<PlaneState>>(
      `/workspaces/${this.workspaceSlug}/projects/${projectId}/states/`,
    );
  }
}
