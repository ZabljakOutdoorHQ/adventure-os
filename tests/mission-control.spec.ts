import { expect, test } from "@playwright/test";

test("Mission Control shows the daily operational sections with honest empty states", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Mission Control", exact: true }),
  ).toBeVisible();

  // Live greeting/date render client-side after mount.
  await expect(
    page.getByText(/Good morning|Good afternoon|Good evening/),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Attention", exact: true }),
  ).toBeVisible();
  for (const title of [
    "Waiting for me",
    "Waiting for team",
    "AI prepared",
    "Open questions",
  ]) {
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  }

  await expect(
    page.getByRole("heading", { name: "Today's operations", exact: true }),
  ).toBeVisible();
  for (const title of ["Tours", "Guides", "Equipment", "Weather"]) {
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  }

  await expect(
    page.getByRole("heading", { name: "Communications", exact: true }),
  ).toBeVisible();
  for (const title of ["Emails", "Messages", "Draft replies"]) {
    await expect(page.getByText(title, { exact: true })).toBeVisible();
  }
});

test("Waiting for me shows a disconnected state when Plane is not configured", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByText(
      "Not yet connected. Configure Plane to see your tasks here.",
    ),
  ).toBeVisible();
});

test("the Mission Control search banner opens the shared global search dialog", async ({
  page,
}) => {
  await page.goto("/");

  await page
    .getByRole("button", { name: /Search people, projects, bookings/ })
    .click();

  await expect(
    page.getByRole("dialog", { name: "Global search" }),
  ).toBeVisible();
  await expect(
    page.getByText("Search is not yet connected to any source"),
  ).toBeVisible();
});

test("context panel explains what each entity type will show", async ({
  page,
}) => {
  await page.goto("/");

  const contextPanel = page.getByRole("complementary", {
    name: "Context panel",
  });
  await expect(contextPanel.getByText("No context selected")).toBeVisible();
  for (const entity of [
    "Person",
    "Booking",
    "Project",
    "Organisation",
    "Document",
  ]) {
    await expect(contextPanel.getByText(entity, { exact: true })).toBeVisible();
  }
});
