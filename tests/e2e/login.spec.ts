import { test, expect } from '@playwright/test';
import { login, logout, clearAuth, waitForAuth } from './fixtures/auth';

/**
 * Login flow tests
 *
 * These tests verify the authentication flow for the UTS DPM application.
 * Test credentials: test@account.com / testAccount
 */

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth state
    await page.goto('/login');
    await clearAuth(page);
  });

  test('should display login form', async ({ page }) => {
    await page.goto('/login');

    // Check that login page loads correctly
    await expect(page).toHaveTitle(/UTS DPM/i);

    // Verify form elements are present (use ID selectors for specificity)
    await expect(page.locator('#username')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should show validation errors for empty fields', async ({ page }) => {
    await page.goto('/login');

    // The submit button should be disabled when form is empty/invalid
    const submitButton = page.getByRole('button', { name: /sign in/i });
    await expect(submitButton).toBeDisabled();

    // Should stay on login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Enter invalid credentials
    await page.locator('#username').fill('invaliduser@example.com');
    await page.locator('#password').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should show error toast or inline error message
    // The app shows "Username and/or password is incorrect" inline
    await expect(
      page.getByText(/username and\/or password is incorrect/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('should toggle password visibility', async ({ page }) => {
    await page.goto('/login');

    const passwordInput = page.locator('#password');
    const toggleButton = page.getByRole('button', {
      name: /toggle password visibility/i,
    });

    // Password should be hidden by default
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle to show password
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click toggle to hide password again
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('should disable submit button when form is invalid', async ({ page }) => {
    await page.goto('/login');

    const submitButton = page.getByRole('button', { name: /sign in/i });

    // Empty form - should be disabled
    await expect(submitButton).toBeDisabled();

    // Only username filled - should be disabled
    await page.locator('#username').fill('test@account.com');
    await expect(submitButton).toBeDisabled();

    // Both filled - should be enabled
    await page.locator('#password').fill('testAccount');
    await expect(submitButton).toBeEnabled();

    // Clear password - should be disabled again
    await page.locator('#password').clear();
    await expect(submitButton).toBeDisabled();
  });

  test('should successfully log in with valid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.locator('#username').fill('test@account.com');
    await page.locator('#password').fill('testAccount');
    await page.getByRole('button', { name: /sign in/i }).click();

    // Should redirect to home page
    await expect(page).toHaveURL('/', { timeout: 10000 });

    // Token should be saved
    await waitForAuth(page);
  });

  test('should persist session after page reload', async ({ page }) => {
    // Log in first
    await login(page);

    // Verify we're on the home page
    await expect(page).toHaveURL('/');

    // Reload the page
    await page.reload();

    // Should still be on protected page (not redirected to login)
    await expect(page).not.toHaveURL(/\/login/);
  });

  test('should successfully log out', async ({ page }) => {
    // Log in first
    await login(page);

    // Verify we're logged in
    await expect(page).toHaveURL('/');

    // Click logout button
    await logout(page);

    // Should be on login page
    await expect(page).toHaveURL(/\/login/);

    // Try to access protected route
    await page.goto('/');

    // Should redirect back to login
    await expect(page).toHaveURL(/\/login/);
  });
});
