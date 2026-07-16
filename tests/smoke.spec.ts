import { expect, test } from "@playwright/test";

test("navigates the primary command centre views", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Good afternoon, Boris" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What is moving across the system" })).toBeVisible();

  await page.getByRole("button", { name: "Matrix" }).click();
  await expect(page.getByRole("heading", { name: "Organisation × active work × attention" })).toBeVisible();

  await page.getByRole("button", { name: "Projects" }).click();
  await expect(page.getByRole("heading", { name: "Active projects and next decisions" })).toBeVisible();

  await page.getByRole("button", { name: "People & graph" }).click();
  await expect(page.getByRole("heading", { name: "People connected to organisations and work" })).toBeVisible();

  await page.getByLabel("Search Adventure OS").fill("Yaron");
  await expect(page.getByRole("button", { name: /ProjectYaron group/ })).toBeVisible();
  await expect(page.getByLabel("Ask Adventure OS")).toBeVisible();
});
