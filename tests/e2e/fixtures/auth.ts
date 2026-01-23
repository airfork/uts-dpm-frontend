import { Page, expect } from '@playwright/test';

/**
 * Authentication helpers for E2E tests
 *
 * Test credentials:
 * - Admin: test@account.com / testAccount (has full admin access)
 */

export interface LoginOptions {
  waitForRedirect?: boolean;
  expectedUrl?: string | RegExp;
}

/**
 * Login with the default test account (admin access)
 */
export async function login(
  page: Page,
  email = 'test@account.com',
  password = 'testAccount',
  options: LoginOptions = {}
): Promise<void> {
  const { waitForRedirect = true, expectedUrl = '/' } = options;

  await page.goto('/login');

  // Fill in credentials - use specific selectors to avoid ambiguity
  await page.locator('#username').fill(email);
  await page.locator('#password').fill(password);

  // Submit form
  await page.getByRole('button', { name: /sign in/i }).click();

  // Wait for redirect if requested
  if (waitForRedirect) {
    await expect(page).toHaveURL(expectedUrl, { timeout: 10000 });
  }
}

/**
 * Login as admin user (full access)
 */
export async function loginAsAdmin(page: Page): Promise<void> {
  await login(page, 'test@account.com', 'testAccount');
}

/**
 * Login as manager user
 * TODO: Create manager test account and update credentials
 */
export async function loginAsManager(page: Page): Promise<void> {
  // For now, use admin account since it has all permissions
  // Replace with actual manager credentials when available
  await login(page, 'test@account.com', 'testAccount');
}

/**
 * Login as driver user
 * TODO: Create driver test account and update credentials
 */
export async function loginAsDriver(page: Page): Promise<void> {
  // For now, use admin account since it has all permissions
  // Replace with actual driver credentials when available
  await login(page, 'test@account.com', 'testAccount');
}

/**
 * Logout the current user
 */
export async function logout(page: Page): Promise<void> {
  // Click the logout button in the navbar
  await page.getByRole('button', { name: /log out|logout|sign out/i }).click();

  // Wait for redirect to login page
  await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
}

/**
 * Check if user is currently logged in
 */
export async function isLoggedIn(page: Page): Promise<boolean> {
  // Check if we're on the login page or a protected page
  const url = page.url();
  return !url.includes('/login');
}

/**
 * Ensure user is logged in before running test
 * Useful in beforeEach hooks
 */
export async function ensureLoggedIn(page: Page): Promise<void> {
  const loggedIn = await isLoggedIn(page);
  if (!loggedIn) {
    await loginAsAdmin(page);
  }
}

/**
 * Clear authentication state (localStorage tokens)
 */
export async function clearAuth(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('exp');
    localStorage.removeItem('username');
  });
}

/**
 * Get the current user's role from localStorage
 */
export async function getCurrentRole(page: Page): Promise<string | null> {
  return page.evaluate(() => localStorage.getItem('role'));
}

/**
 * Wait for authentication to complete (token saved)
 */
export async function waitForAuth(page: Page): Promise<void> {
  await page.waitForFunction(() => {
    return localStorage.getItem('token') !== null;
  }, { timeout: 10000 });
}
