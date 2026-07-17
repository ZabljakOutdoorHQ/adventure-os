import type {
  AdventureHubModalResponse,
  AdventureHubSeason,
  AdventureHubTokenResponse,
  AdventureHubTotalPriceParams,
  AdventureHubTotalPriceResponse,
} from "./types";

export class AdventureHubApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown, message: string) {
    super(message);
    this.name = "AdventureHubApiError";
    this.status = status;
    this.body = body;
  }
}

export type AdventureHubClientConfig = {
  baseUrl: string;
};

// Read-only adapter. There is deliberately no method that calls
// POST /api/modal/booking — see docs/integrations/adventure-hub.md.
export class AdventureHubClient {
  private readonly baseUrl: string;

  constructor(config: AdventureHubClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
  }

  // The API's own error responses are inconsistent (structured problem+json,
  // unformatted text, or an unformatted 500 — see docs/integrations/
  // adventure-hub.md "Known documentation conflicts"), so this always
  // attempts JSON first and falls back to the raw text rather than assuming
  // a shape.
  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, init);
    const raw = await response.text();
    let parsed: unknown = raw;
    try {
      parsed = raw ? JSON.parse(raw) : undefined;
    } catch {
      // Response was not JSON — keep the raw text as the error body.
    }

    if (!response.ok) {
      throw new AdventureHubApiError(
        response.status,
        parsed,
        `AdventureHub request to ${path} failed with ${response.status}`,
      );
    }

    return parsed as T;
  }

  // No caching or refresh-token handling here on purpose — the API doesn't
  // document the refresh flow (see docs/integrations/adventure-hub.md), and
  // a skeleton adapter shouldn't guess one.
  async getToken(): Promise<AdventureHubTokenResponse> {
    return this.request<AdventureHubTokenResponse>("/api/tokens", {
      method: "POST",
    });
  }

  async getCatalog(
    accessToken: string,
    season?: AdventureHubSeason,
  ): Promise<AdventureHubModalResponse> {
    const query = season ? `?season=${season}` : "";
    return this.request<AdventureHubModalResponse>(`/api/modal${query}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  }

  async getTotalPrice(
    accessToken: string,
    params: AdventureHubTotalPriceParams,
  ): Promise<AdventureHubTotalPriceResponse> {
    const query = new URLSearchParams();
    for (const id of params.adventureIds)
      query.append("adventureIds", String(id));
    for (const count of params.numberOfGuests) {
      query.append("numberOfGuests", String(count));
    }
    if (params.discountCodeName) {
      query.append("discountCodeName", params.discountCodeName);
    }
    return this.request<AdventureHubTotalPriceResponse>(
      `/api/modal/total-price?${query.toString()}`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  }
}
