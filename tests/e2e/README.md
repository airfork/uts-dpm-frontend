# E2E Tests

End-to-end tests for UTS DPM using Playwright.

## Running Tests

```bash
# Run all tests (headless)
npm run e2e

# Run tests with UI mode (recommended for development)
npm run e2e:ui

# Run tests in headed mode (see browser)
npm run e2e:headed

# Run specific test file
npx playwright test login.spec.ts

# Debug tests
npx playwright test --debug
```

## Test Structure

- **`login.spec.ts`** - Authentication flow tests
- **`navigation.spec.ts`** - Routing and access control tests
- **`dpm-creation.spec.ts`** - DPM creation workflow tests

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/your-page');
  });

  test('should do something', async ({ page }) => {
    // Arrange
    await page.getByLabel('Username').fill('testuser');

    // Act
    await page.getByRole('button', { name: 'Submit' }).click();

    // Assert
    await expect(page).toHaveURL('/success');
  });
});
```

### Test Organization

1. **Group related tests** with `test.describe()`
2. **Use beforeEach** for common setup
3. **Use descriptive test names** starting with "should"
4. **Follow AAA pattern**: Arrange, Act, Assert

### Selectors

Prefer these selectors in order of priority:

1. **Role-based**: `page.getByRole('button', { name: 'Submit' })`
2. **Label-based**: `page.getByLabel('Username')`
3. **Text-based**: `page.getByText('Welcome')`
4. **Test IDs** (if added): `page.getByTestId('submit-button')`
5. **CSS selectors** (last resort): `page.locator('.btn-primary')`

### Best Practices

- **Keep tests independent** - Each test should work in isolation
- **Use specific assertions** - Prefer `toHaveURL()` over generic `toBeTruthy()`
- **Wait for elements** - Use `await expect()` which auto-waits
- **Avoid hard-coded waits** - Don't use `page.waitForTimeout()` unless necessary
- **Clean up after tests** - Reset state if needed in `afterEach()`

### Authentication Helper (TODO)

When test environment is ready, create authentication helpers:

```typescript
// tests/e2e/helpers/auth.ts
export async function loginAsAdmin(page: Page) {
  await page.goto('/login');
  await page.getByLabel(/username/i).fill('admin');
  await page.getByLabel(/password/i).fill('adminpass');
  await page.getByRole('button', { name: /log in/i }).click();
  await page.waitForURL('/home');
}

export async function loginAsManager(page: Page) {
  // ...
}

export async function loginAsDriver(page: Page) {
  // ...
}
```

### Page Object Pattern (Optional)

For complex pages, consider using Page Objects:

```typescript
// tests/e2e/pages/login.page.ts
export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.page.getByLabel(/username/i).fill(username);
    await this.page.getByLabel(/password/i).fill(password);
    await this.page.getByRole('button', { name: /log in/i }).click();
  }
}

// Usage in tests
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login('testuser', 'testpass');
```

## Test Environment Setup

### Prerequisites

1. **Dev server running** - Playwright will start it automatically via `webServer` config
2. **Test database** (if separate from dev) - Configure API to use test DB
3. **Test credentials** - Create test users for each role (DRIVER, MANAGER, ADMIN)

### Environment Variables (Optional)

Create `.env.test` for test-specific config:

```bash
# .env.test
API_URL=http://localhost:8080
TEST_USERNAME=testuser
TEST_PASSWORD=testpass
```

Load in `playwright.config.ts`:

```typescript
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
```

## Continuous Integration

Tests run automatically in CI via GitHub Actions.

See `.github/workflows/ci.yml` (when created in Phase 0.5).

## Debugging Failed Tests

1. **View test report**: `npx playwright show-report`
2. **Check screenshots**: `playwright-report/data/screenshots/`
3. **Watch video**: `playwright-report/data/videos/`
4. **Use trace viewer**: `npx playwright show-trace trace.zip`

## Skipped Tests

Many tests are currently skipped (`.skip()`) because they require:

- Test authentication credentials
- Backend test environment
- Test data setup

**To enable tests:**

1. Set up test environment with backend
2. Create test users for all roles
3. Update test credentials in helper functions
4. Remove `.skip()` from tests
5. Run and verify all tests pass

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Locators Guide](https://playwright.dev/docs/locators)
- [Assertions](https://playwright.dev/docs/test-assertions)
