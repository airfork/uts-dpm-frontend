import { test, expect } from '@playwright/test';

/**
 * Login flow tests
 *
 * These tests verify the authentication flow for the UTS DPM application.
 * Note: Update the test credentials to match your test environment.
 */

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    // Check that login page loads correctly
    await expect(page).toHaveTitle(/UTS DPM/i);

    // Verify form elements are present
    await expect(page.getByLabel(/username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click submit without filling in fields
    await page.getByRole('button', { name: /log in/i }).click();

    // Should stay on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Enter invalid credentials
    await page.getByLabel(/username/i).fill('invaliduser');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /log in/i }).click();

    // Should show error toast or message
    // Note: Update selector based on your error notification implementation
    await expect(page.locator('.toast-error')).toBeVisible({ timeout: 5000 });
  });

  test.skip('should successfully log in with valid credentials', async ({ page }) => {
    // TODO: Update with actual test credentials
    // This test is skipped by default - enable when test environment is ready

    await page.getByLabel(/username/i).fill('testuser');
    await page.getByLabel(/password/i).fill('testpassword');
    await page.getByRole('button', { name: /log in/i }).click();

    // Should redirect to home page
    await expect(page).toHaveURL('/home');

    // Should show user's name in navbar
    await expect(page.getByText(/testuser/i)).toBeVisible();
  });

  test.skip('should persist session after page reload', async ({ page }) => {
    // TODO: Enable when test environment is ready

    // Log in first
    await page.getByLabel(/username/i).fill('testuser');
    await page.getByLabel(/password/i).fill('testpassword');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page).toHaveURL('/home');

    // Reload the page
    await page.reload();

    // Should still be logged in
    await expect(page).toHaveURL('/home');
    await expect(page.getByText(/testuser/i)).toBeVisible();
  });

  test.skip('should successfully log out', async ({ page }) => {
    // TODO: Enable when test environment is ready

    // Log in first
    await page.getByLabel(/username/i).fill('testuser');
    await page.getByLabel(/password/i).fill('testpassword');
    await page.getByRole('button', { name: /log in/i }).click();
    await expect(page).toHaveURL('/home');

    // Click logout button
    await page.getByRole('button', { name: /log out/i }).click();

    // Should redirect to login page
    await expect(page).toHaveURL('/login');

    // Try to access protected route
    await page.goto('/home');

    // Should redirect back to login
    await expect(page).toHaveURL('/login');
  });
});
