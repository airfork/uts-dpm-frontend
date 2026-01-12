import { test, expect } from '@playwright/test';

/**
 * Navigation and routing tests
 *
 * These tests verify basic navigation and role-based access control.
 */

test.describe('Navigation', () => {
  test('should show login page for unauthenticated users', async ({ page }) => {
    await page.goto('/');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('should redirect to login when accessing protected routes', async ({ page }) => {
    // Try to access protected routes
    const protectedRoutes = ['/home', '/dpm', '/users', '/approvals', '/history'];

    for (const route of protectedRoutes) {
      await page.goto(route);

      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test('should show 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-route');

    // Should show 404 page
    await expect(page).toHaveURL(/\/non-existent-route/);
    await expect(page.getByText(/404|not found/i)).toBeVisible();
  });

  test.skip('should show appropriate nav items based on user role', async ({ page }) => {
    // TODO: Implement for different roles

    // For DRIVER role
    // await loginAsDriver(page);
    // await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    // await expect(page.getByRole('link', { name: /history/i })).toBeVisible();
    // await expect(page.getByRole('link', { name: /create dpm/i })).not.toBeVisible();

    // For MANAGER role
    // await loginAsManager(page);
    // await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    // await expect(page.getByRole('link', { name: /create dpm/i })).toBeVisible();
    // await expect(page.getByRole('link', { name: /approvals/i })).toBeVisible();

    // For ADMIN role
    // await loginAsAdmin(page);
    // await expect(page.getByRole('link', { name: /users/i })).toBeVisible();
    // await expect(page.getByRole('link', { name: /edit dpm types/i })).toBeVisible();
  });

  test.skip('should prevent access to admin routes for non-admin users', async ({ page }) => {
    // TODO: Implement with test credentials

    // Login as manager
    // await loginAsManager(page);

    // Try to access admin-only route
    await page.goto('/users');

    // Should show 403 forbidden page
    await expect(page).toHaveURL(/\/errors\/403/);
    await expect(page.getByText(/forbidden|unauthorized|403/i)).toBeVisible();
  });

  test.skip('should allow back/forward navigation', async ({ page }) => {
    // TODO: Enable when test environment is ready

    // await loginAsManager(page);

    // Navigate through multiple pages
    await page.goto('/home');
    await page.goto('/dpm/create');
    await page.goto('/history');

    // Go back
    await page.goBack();
    await expect(page).toHaveURL(/\/dpm\/create/);

    // Go back again
    await page.goBack();
    await expect(page).toHaveURL(/\/home/);

    // Go forward
    await page.goForward();
    await expect(page).toHaveURL(/\/dpm\/create/);
  });

  test('should have correct page titles', async ({ page }) => {
    // Test accessible pages only
    await page.goto('/login');
    await expect(page).toHaveTitle(/UTS DPM/i);

    // TODO: Add more title checks for other pages once authenticated
  });
});
