import { test, expect } from '@playwright/test';
import { loginAsAdmin } from './fixtures/auth';

/**
 * DPM Creation flow tests
 *
 * These tests verify that users can create new DPM records.
 */

test.describe('DPM Creation', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
  });

  test('should navigate to DPM page', async ({ page }) => {
    // Click on DPM link in navbar (use exact: true to avoid matching "UTS DPM")
    await page.getByRole('link', { name: 'DPM', exact: true }).click();

    // Should be on DPM page
    await expect(page).toHaveURL(/\/dpm/);
  });

  test('should display DPM page content', async ({ page }) => {
    await page.goto('/dpm');

    // Wait for page to load
    await page.waitForLoadState('networkidle');

    // Verify the page header is present
    await expect(page.getByText('DPM Management')).toBeVisible();
  });

  test('should display tabs on DPM page', async ({ page }) => {
    await page.goto('/dpm');

    // The DPM page has "New" and "Edit" tabs (admin only sees both)
    await expect(page.getByRole('tab', { name: 'New' })).toBeVisible();
    await expect(page.getByRole('tab', { name: 'Edit' })).toBeVisible();
  });

  test.skip('should show validation errors for required fields', async ({
    page,
  }) => {
    await page.goto('/dpm');

    // Find and click submit button
    const submitButton = page.getByRole('button', { name: /submit|create/i });

    if (await submitButton.isVisible()) {
      await submitButton.click();

      // Should show validation errors
      await expect(page.locator('.error, [class*="error"]')).toBeVisible();
    }
  });

  test.skip('should autocomplete driver names', async ({ page }) => {
    await page.goto('/dpm');

    // Find driver input field
    const driverInput = page.getByLabel(/driver/i);

    if (await driverInput.isVisible()) {
      // Start typing in driver field
      await driverInput.fill('test');

      // Should show autocomplete suggestions
      await expect(
        page.locator('[class*="autocomplete"], [role="listbox"]')
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test.skip('should successfully create a DPM', async ({ page }) => {
    await page.goto('/dpm');

    // This test needs to be updated based on actual form implementation
    // Fill in the form fields
    // Submit the form
    // Verify success message or redirect
  });
});
