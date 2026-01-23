import { test, expect } from '@playwright/test';
import { loginAsAdmin, clearAuth } from './fixtures/auth';

/**
 * Navigation and routing tests
 *
 * Navbar links (based on navbar.component.ts):
 * - DPM: /dpm (ADMIN, ANALYST, MANAGER, SUPERVISOR)
 * - Autogen: /autogen (ADMIN, ANALYST, MANAGER, SUPERVISOR)
 * - Datagen: /datagen (ADMIN, ANALYST, MANAGER)
 * - Approvals: /approvals (ADMIN, MANAGER)
 * - Users: /users (ADMIN only)
 * - Logout: (all roles)
 */

test.describe('Navigation', () => {
  test.describe('Unauthenticated', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/login');
      await clearAuth(page);
    });

    test('should show login page for unauthenticated users', async ({
      page,
    }) => {
      await page.goto('/');

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect to login when accessing protected routes', async ({
      page,
    }) => {
      // Try to access protected routes
      const protectedRoutes = ['/dpm', '/users', '/approvals'];

      for (const route of protectedRoutes) {
        await page.goto(route);

        // Should redirect to login
        await expect(page).toHaveURL(/\/login/);
      }
    });

    test('should show 404 page for non-existent routes', async ({ page }) => {
      await page.goto('/non-existent-route');

      // Should show 404 page or redirect
      await expect(
        page.getByText(/404|not found|page.*not.*found/i)
      ).toBeVisible();
    });

    test('should have correct page titles', async ({ page }) => {
      await page.goto('/login');
      await expect(page).toHaveTitle(/UTS DPM/i);
    });
  });

  test.describe('Authenticated', () => {
    test.beforeEach(async ({ page }) => {
      await loginAsAdmin(page);
    });

    test('should show navbar after login', async ({ page }) => {
      // Navbar should be visible
      await expect(page.locator('nav')).toBeVisible();
    });

    test('should navigate to home by clicking logo', async ({ page }) => {
      // Navigate away from home first
      await page.goto('/dpm');
      await expect(page).toHaveURL(/\/dpm/);

      // Click the logo/home link (contains "UTS DPM")
      await page.getByRole('link', { name: /UTS DPM/i }).click();
      await expect(page).toHaveURL('/');
    });

    test('should navigate to DPM page', async ({ page }) => {
      // Click the DPM link in the navbar
      await page.getByRole('link', { name: 'DPM', exact: true }).click();
      await expect(page).toHaveURL(/\/dpm/);
    });

    test('should navigate to Autogen page', async ({ page }) => {
      await page.getByRole('link', { name: 'Autogen' }).click();
      await expect(page).toHaveURL(/\/autogen/);
    });

    test('should navigate to Approvals page', async ({ page }) => {
      await page.getByRole('link', { name: 'Approvals' }).click();
      await expect(page).toHaveURL(/\/approvals/);
    });

    test('should navigate to Users page (admin only)', async ({ page }) => {
      await page.getByRole('link', { name: 'Users' }).click();
      await expect(page).toHaveURL(/\/users/);
    });

    test('should allow back/forward navigation', async ({ page }) => {
      // Navigate to DPM page
      await page.getByRole('link', { name: 'DPM', exact: true }).click();
      await expect(page).toHaveURL(/\/dpm/);

      // Navigate to Approvals
      await page.getByRole('link', { name: 'Approvals' }).click();
      await expect(page).toHaveURL(/\/approvals/);

      // Go back
      await page.goBack();
      await expect(page).toHaveURL(/\/dpm/);

      // Go forward
      await page.goForward();
      await expect(page).toHaveURL(/\/approvals/);
    });

    test('should show logout button', async ({ page }) => {
      await expect(
        page.getByRole('button', { name: 'Logout' })
      ).toBeVisible();
    });

    test('should toggle theme', async ({ page }) => {
      // Find the theme toggle button
      const themeButton = page.getByRole('button', { name: /switch to dark mode|switch to light mode/i });

      // Get initial theme
      const initialTheme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );

      // Click to toggle theme
      await themeButton.click();

      // Theme should have changed
      const newTheme = await page.evaluate(() =>
        document.documentElement.getAttribute('data-theme')
      );

      expect(newTheme).not.toBe(initialTheme);
    });
  });
});
