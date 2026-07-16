import { expect, test } from "@playwright/test";

test("navigates primary Adventure OS views and searches mock entities", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Good afternoon, Boris" })).toBeVisible();

  await page.getByRole("button", { name: "Matrix" }).click();
  await expect(page.getByRole("heading", { name: "Organisation × active work × attention" })).toBeVisible();

  await page.getByRole("button", { name: "Projects" }).click();
  await expect(page.getByRole("heading", { name: "Active projects and next decisions" })).toBeVisible();

  await page.getByRole("button", { name: "People & graph" }).click();
  await expect(page.getByRole("heading", { name: "People connected to organisations and work" })).toBeVisible();

  await page.getByLabel("Search Adventure OS").fill("WeTravel");
  await expect(page.getByText("WeTravel migration")).toBeVisible();
});
