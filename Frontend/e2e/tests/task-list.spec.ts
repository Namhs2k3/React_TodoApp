import { test, expect } from "@playwright/test";

test.describe("Task List", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4200/tasks");
  });

  test("has title", async ({ page }) => {
    await expect(page).toHaveTitle(/Task Management/);
  });

  test("has header", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "Task List" }),
    ).toBeVisible();

    await expect(page.locator("h2")).toHaveText("Task List");
  });

  test("has navigation links and can navigate to reports page", async ({
    page,
  }) => {
    await expect(page.locator('a[href="/tasks"]')).toHaveText("Tasks");
    await expect(page.locator('a[href="/reports"]')).toHaveText("Reports");

    await page.getByRole("link", { name: "Reports" }).click();
    await expect(page).toHaveURL("http://localhost:4200/reports");
  });

  test("should display task table", async ({ page }) => {
    // Wait for table to load
    await page.waitForSelector("table", { timeout: 10000 });

    // Check table headers
    const headers = page.locator("thead th");
    await expect(headers).toHaveCount(6);
    await expect(headers.nth(0)).toHaveText("ID");
    await expect(headers.nth(1)).toHaveText("Title");
  });

  test("should open add task dialog and submit form", async ({ page }) => {
    await page.click('button:has-text("Add New")');

    await page.waitForSelector('input[name="title"]', { timeout: 5000 });

    // Fill form
    await page.fill('input[name="title"]', "Test Task");
    await page.fill('textarea[name="description"]', "Test Description");
    await page.selectOption('select[name="priority"]', "2");

    // Submit form
    await page.click('button[type="submit"]');

    await expect(page.locator(".toast-item.success")).toBeVisible();
  });

  test("should update task and display success message", async ({ page }) => {
    await expect(page.locator('button[title="Edit"]').nth(0)).toBeVisible();

    await page.locator('button[title="Edit"]').nth(0).click();

    await page.waitForSelector('input[name="title"]', { timeout: 5000 });

    await page.fill('input[name="title"]', "Updated Task");
    await page.fill('textarea[name="description"]', "Updated Description");
    await page.selectOption('select[name="priority"]', "3");
    await page.selectOption('select[name="status"]', "1");
    await page.click('button[type="submit"]');

    await expect(page.locator(".toast-item.success")).toBeVisible();
  });

  test("should delete task and display success message", async ({ page }) => {
    await expect(page.locator('button[title="Delete"]').nth(0)).toBeVisible();
    await page.locator('button[title="Delete"]').nth(0).click();
    await page.locator('button:has-text("Confirm")').click();
    await expect(page.locator(".toast-item.success")).toBeVisible();
  });
});
