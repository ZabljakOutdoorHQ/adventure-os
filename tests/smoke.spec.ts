import { expect, test } from "@playwright/test";

test("renders the command centre foundation", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Good afternoon, Boris" })).toBeVisible();
  await expect(page.getByText("Adventure OS", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Matrix" })).toBeVisible();
  await expect(page.getByLabel("Search Adventure OS")).toBeVisible();
  await expect(page.getByLabel("Ask Adventure OS")).toBeVisible();
});
