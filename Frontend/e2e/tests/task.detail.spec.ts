import { test, expect } from '@playwright/test';

test.describe('Task Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:4200/tasks');
    await page.waitForSelector('a[title="View"]');
    await page.locator('a[title="View"]').first().click();
    await expect(page).toHaveURL(/\/tasks\/\d+$/);
  });

  test('should display task details', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Back to List' })).toBeVisible();
    await expect(page.getByText('Status:')).toBeVisible();
    await expect(page.getByText('Priority:')).toBeVisible();
    await expect(page.getByText('Due Date:')).toBeVisible();
    await expect(page.getByText('Created:')).toBeVisible();
  });
});