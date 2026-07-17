import { expect, test } from "@playwright/test";

test("renders the Mission Control shell", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "Mission Control", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Adventure OS", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("navigation", { name: "Primary navigation" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Mission Control/ }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    page.getByRole("button", { name: "Open global search" }),
  ).toBeVisible();
  await expect(
    page.getByRole("complementary", { name: "Context panel" }),
  ).toBeVisible();
  await expect(page.getByText("No context selected")).toBeVisible();
});
