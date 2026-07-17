import { expect, test } from "@playwright/test";

test("System Map: clicking a node selects it and Clear returns to the empty state", async ({
  page,
}) => {
  await page.goto("/system-map");
  await expect(
    page.getByRole("heading", { name: "System Map", exact: true }),
  ).toBeVisible();

  const contextPanel = page.getByRole("complementary", {
    name: "Context panel",
  });
  await expect(contextPanel.getByText("No context selected")).toBeVisible();

  await page.getByRole("button", { name: "Boris Stijepovic" }).click();
  await expect(
    contextPanel.getByRole("heading", { name: "Boris Stijepovic" }),
  ).toBeVisible();
  await expect(contextPanel.getByText("Founder & Operator")).toBeVisible();

  await contextPanel.getByRole("button", { name: "Clear selection" }).click();
  await expect(contextPanel.getByText("No context selected")).toBeVisible();
});

test("System Map: clicking a related entity in the context panel re-selects it", async ({
  page,
}) => {
  await page.goto("/system-map");
  await page.getByRole("button", { name: "Boris Stijepovic" }).click();

  const contextPanel = page.getByRole("complementary", {
    name: "Context panel",
  });
  await contextPanel
    .getByRole("button", { name: "Durmitor Adventure" })
    .click();
  await expect(
    contextPanel.getByRole("heading", { name: "Durmitor Adventure" }),
  ).toBeVisible();
});

test("Search page filters demo data as you type", async ({ page }) => {
  await page.goto("/search");
  await expect(
    page.getByRole("heading", { name: "Search", exact: true }),
  ).toBeVisible();

  const input = page.getByLabel("Search everything");
  await input.fill("fleet");
  await expect(
    page.getByText("Fleet Renewal Contract", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /Boris Stijepovic/ }),
  ).toHaveCount(0);
});

test("Knowledge, Operations, Communications, Documents, Calendar and Tasks render demo content", async ({
  page,
}) => {
  const checks: Array<{ url: string; heading: string; text: string }> = [
    { url: "/knowledge", heading: "Knowledge", text: "Rafting Safety SOP" },
    {
      url: "/operations",
      heading: "Operations",
      text: "Durmitor Rafting Group",
    },
    {
      url: "/communications",
      heading: "Communications",
      text: "Fleet supplier: renewal quote attached",
    },
    { url: "/documents", heading: "Documents", text: "Fleet Renewal Contract" },
    { url: "/calendar", heading: "Calendar", text: "Agenda" },
    {
      url: "/tasks",
      heading: "Tasks",
      text: "Confirm guide roster for Tara Canyon launch",
    },
  ];

  for (const check of checks) {
    await page.goto(check.url);
    await expect(
      page.getByRole("heading", { name: check.heading, exact: true }),
    ).toBeVisible();
    await expect(page.getByText(check.text)).toBeVisible();
    await expect(
      page.getByText("Demo data", { exact: true }).first(),
    ).toBeVisible();
  }
});

test("Calendar: selecting a day with an event updates the context panel", async ({
  page,
}) => {
  await page.goto("/calendar");
  const contextPanel = page.getByRole("complementary", {
    name: "Context panel",
  });

  await page
    .getByRole("button", { name: /Durmitor Rafting Group departure/ })
    .first()
    .click();
  await expect(
    contextPanel.getByRole("heading", {
      name: "Durmitor Rafting Group departure",
    }),
  ).toBeVisible();
});
