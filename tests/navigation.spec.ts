import { expect, test } from "@playwright/test";

test("navigates every primary route via the top nav", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Mission Control", exact: true }),
  ).toBeVisible();

  const routes: Array<{ link: RegExp; heading: string; url: string }> = [
    {
      link: /Communications/,
      heading: "Communications",
      url: "/communications",
    },
    { link: /Operations/, heading: "Operations", url: "/operations" },
    { link: /Projects/, heading: "Projects", url: "/projects" },
    { link: /Knowledge/, heading: "Knowledge", url: "/knowledge" },
    { link: /System Map/, heading: "System Map", url: "/system-map" },
  ];

  for (const route of routes) {
    await page.getByRole("link", { name: route.link }).click();
    await expect(page).toHaveURL(new RegExp(`${route.url}$`));
    await expect(
      page.getByRole("heading", { name: route.heading, exact: true }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: route.link })).toHaveAttribute(
      "aria-current",
      "page",
    );
  }

  await page.getByRole("link", { name: /Mission Control/ }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(
    page.getByRole("heading", { name: "Mission Control", exact: true }),
  ).toBeVisible();
});

test("global search opens as a structural placeholder", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "Open global search" }).click();
  await expect(
    page.getByRole("dialog", { name: "Global search" }),
  ).toBeVisible();
  await expect(
    page.getByText("Search is not yet connected to any source"),
  ).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await page.keyboard.press("Control+k");
  await expect(
    page.getByRole("dialog", { name: "Global search" }),
  ).toBeVisible();
});

test("context panel toggles on narrow viewports", async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 900 });
  await page.goto("/operations");

  const contextPanel = page.getByRole("complementary", {
    name: "Context panel",
  });
  await expect(contextPanel).toBeHidden();

  await page.getByRole("button", { name: "Toggle context panel" }).click();
  await expect(contextPanel).toBeVisible();
});
