// Health check for the Plane read-only adapter: authenticates via
// GET /users/me/, then makes exactly one more safe GET request
// (GET /workspaces/{slug}/projects/). No create/update/delete call — see
// docs/integrations/plane.md.
//
// NOT run in CI. This needs a real PLANE_API_KEY (a real secret) and
// network egress to a third-party host; neither belongs in an automatic
// build gate. Run manually:
//
//   PLANE_API_KEY=... PLANE_WORKSPACE_SLUG=... bun run plane:smoke

import { PlaneClient } from "../lib/adapters/plane";

function fail(message: string): never {
  console.error(`✗ ${message}`);
  process.exit(1);
}

async function main() {
  const apiKey = process.env.PLANE_API_KEY;
  const workspaceSlug = process.env.PLANE_WORKSPACE_SLUG;
  const baseUrl = process.env.PLANE_API_BASE_URL;

  if (!apiKey) fail("PLANE_API_KEY is not set — see .env.example");
  if (!workspaceSlug)
    fail("PLANE_WORKSPACE_SLUG is not set — see .env.example");

  const client = new PlaneClient({ apiKey, workspaceSlug, baseUrl });

  console.log(`Authenticating against workspace "${workspaceSlug}" ...`);
  const user = await client.getCurrentUser().catch((error) => {
    fail(`GET /users/me/ failed: ${error}`);
  });
  if (!user.id) {
    fail("GET /users/me/ returned no id");
  }
  console.log(
    `✓ Authenticated as ${user.display_name ?? user.email ?? user.id}`,
  );

  console.log("Fetching projects (GET /workspaces/{slug}/projects/) ...");
  const projects = await client.listProjects({ limit: 1 }).catch((error) => {
    fail(`GET /workspaces/${workspaceSlug}/projects/ failed: ${error}`);
  });

  if (!Array.isArray(projects.results)) {
    fail("Projects response did not include a results array");
  }

  console.log(
    `✓ Projects OK — ${projects.total_count} total project(s) in this workspace`,
  );
  console.log(
    "Reminder: this only confirms auth and project listing work. It does " +
      "not confirm work-item filtering, state resolution, or any capability " +
      "not already documented in docs/integrations/plane.md.",
  );
}

main();
