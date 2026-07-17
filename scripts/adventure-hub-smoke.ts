// Health check for the AdventureHub read-only adapter: authenticates, then
// makes exactly one safe GET request (GET /api/modal). No booking, no
// payment call — see docs/integrations/adventure-hub.md.
//
// NOT run in CI. This hits a real third-party production host
// (ADVENTURE_HUB_BASE_URL) over the network; this repository's CI
// environment isn't guaranteed to have egress to it, and a third-party
// production API shouldn't be depended on by a build gate. Run manually:
//
//   ADVENTURE_HUB_BASE_URL=https://api.adventurehub.tech bun run hub:smoke

import { AdventureHubClient } from "../lib/adapters/adventure-hub";

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

async function main() {
  const baseUrl = process.env.ADVENTURE_HUB_BASE_URL;
  if (!baseUrl) {
    fail("ADVENTURE_HUB_BASE_URL is not set — see .env.example");
  }

  const client = new AdventureHubClient({ baseUrl });

  console.log(`Authenticating against ${baseUrl} ...`);
  const token = await client.getToken().catch((error) => {
    fail(`POST /api/tokens failed: ${error}`);
  });
  if (!token.accessToken) {
    fail("POST /api/tokens returned no accessToken");
  }
  console.log("✓ Authenticated");

  console.log("Fetching catalog (GET /api/modal) ...");
  const catalog = await client.getCatalog(token.accessToken).catch((error) => {
    fail(`GET /api/modal failed: ${error}`);
  });

  if (!Array.isArray(catalog) || catalog.length === 0) {
    fail("GET /api/modal returned an empty or non-array response");
  }

  const adventureCount = catalog.reduce(
    (total, group) => total + (group.adventures?.length ?? 0),
    0,
  );
  if (adventureCount === 0) {
    fail("GET /api/modal returned no adventures");
  }

  console.log(
    `✓ Catalog OK — ${catalog.length} type group(s), ${adventureCount} adventure(s)`,
  );
  console.log(
    "Reminder: this only confirms the catalog is reachable and non-empty. " +
      "It does not confirm prices, capacity, or any field not already " +
      "documented in docs/integrations/adventure-hub.md.",
  );
}

main();
