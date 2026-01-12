import { test, expect } from '@playwright/test';

/**
 * DPM Creation flow tests
 *
 * These tests verify that users can create new DPM records.
 * Tests are skipped by default - enable when test environment with authentication is ready.
 */

test.describe('DPM Creation', () => {
  test.beforeEach(async ({ page }) => {
    // TODO: Implement authentication helper
    // await loginAsManager(page);
  });

  test.skip('should navigate to DPM creation form', async ({ page }) => {
    await page.goto('/home');

    // Click on DPM creation link in navbar
    await page.getByRole('link', { name: /create dpm/i }).click();

    // Should be on DPM creation page
    await expect(page).toHaveURL(/\/dpm\/create/);

    // Verify form elements are present
    await expect(page.getByLabel(/driver/i)).toBeVisible();
    await expect(page.getByLabel(/date/i)).toBeVisible();
    await expect(page.getByLabel(/type/i)).toBeVisible();
    await expect(page.getByLabel(/block/i)).toBeVisible();
    await expect(page.getByLabel(/location/i)).toBeVisible();
  });

  test.skip('should show validation errors for required fields', async ({ page }) => {
    await page.goto('/dpm/create');

    // Submit empty form
    await page.getByRole('button', { name: /submit/i }).click();

    // Should show validation errors (update selectors based on implementation)
    await expect(page.locator('.error-message')).toHaveCount(5); // 5 required fields
  });

  test.skip('should autocomplete driver names', async ({ page }) => {
    await page.goto('/dpm/create');

    // Start typing in driver field
    await page.getByLabel(/driver/i).fill('john');

    // Should show autocomplete suggestions
    await expect(page.locator('.p-autocomplete-panel')).toBeVisible();
    await expect(page.locator('.p-autocomplete-item')).toHaveCount.greaterThan(0);

    // Select first suggestion
    await page.locator('.p-autocomplete-item').first().click();

    // Driver field should be filled
    await expect(page.getByLabel(/driver/i)).not.toHaveValue('');
  });

  test.skip('should successfully create a DPM', async ({ page }) => {
    await page.goto('/dpm/create');

    // Fill in the form
    await page.getByLabel(/driver/i).fill('Test Driver');
    await page.getByLabel(/driver/i).press('ArrowDown');
    await page.getByLabel(/driver/i).press('Enter'); // Select from autocomplete

    // Select date (adjust based on date picker implementation)
    await page.getByLabel(/date/i).click();
    await page.locator('.p-datepicker-today').click();

    // Select DPM type from dropdown
    await page.getByLabel(/type/i).click();
    await page.locator('.p-dropdown-item').first().click();

    // Fill in remaining fields
    await page.getByLabel(/block/i).fill('Block A');
    await page.getByLabel(/location/i).fill('Main Station');
    await page.getByLabel(/start time/i).fill('08:00');
    await page.getByLabel(/end time/i).fill('16:00');

    // Submit form
    await page.getByRole('button', { name: /submit/i }).click();

    // Should show success message
    await expect(page.locator('.toast-success')).toBeVisible({ timeout: 5000 });

    // Should redirect to home page
    await expect(page).toHaveURL('/home');
  });

  test.skip('should show DPM as pending after creation', async ({ page }) => {
    // Create a DPM first (can extract to helper function)
    await page.goto('/dpm/create');
    // ... fill form and submit ...

    // Navigate to approvals page (if user has permission)
    await page.goto('/approvals');

    // Should see newly created DPM in pending list
    await expect(page.locator('p-table').getByText('Test Driver')).toBeVisible();
    await expect(page.locator('p-table').getByText('PENDING')).toBeVisible();
  });

  test.skip('should allow adding optional notes', async ({ page }) => {
    await page.goto('/dpm/create');

    // Fill required fields (extract to helper)
    // ...

    // Add notes
    const notes = 'This is a test DPM with additional notes.';
    await page.getByLabel(/notes/i).fill(notes);

    // Submit
    await page.getByRole('button', { name: /submit/i }).click();

    // Navigate to history to verify notes were saved
    await page.goto('/history');
    await page.getByRole('row', { name: /test driver/i }).click();

    // Should see notes in detail view
    await expect(page.getByText(notes)).toBeVisible();
  });
});
