# Test Coverage Improvement Plan

Comprehensive plan to improve test coverage for UTS DPM Frontend using Playwright E2E tests and Jasmine unit tests.

## Current State

| Category   | Total | Tested | Coverage |
| ---------- | ----- | ------ | -------- |
| Components | 38    | 4      | 10.5%    |
| Services   | 9     | 0      | 0%       |
| Guards     | 1     | 0      | 0%       |
| Pipes      | 5     | 0      | 0%       |
| Directives | 4     | 0      | 0%       |
| E2E Tests  | 17    | 10     | 58.8%    |

## Phase 1: E2E Test Foundation

**Goal:** Enable all skipped E2E tests and establish authentication infrastructure.

### 1.1 Auth Helper Setup ✓

- [x] Create `tests/e2e/fixtures/auth.ts` with login/logout helpers
- [x] Implement `loginAsAdmin()`, `loginAsManager()`, `loginAsDriver()`
- [x] Add `clearAuth()`, `getCurrentRole()`, `waitForAuth()` utilities

### 1.2 Fix Login Tests

File: `tests/e2e/login.spec.ts`

- [ ] Update test to use correct form labels (`Username`, `Password`, `Sign In`)
- [ ] Unskip "should successfully log in with valid credentials"
- [ ] Unskip "should persist session after page reload"
- [ ] Unskip "should successfully log out"
- [ ] Add test for password visibility toggle
- [ ] Add test for disabled button when form invalid

### 1.3 Fix Navigation Tests

File: `tests/e2e/navigation.spec.ts`

- [ ] Import and use auth helpers
- [ ] Unskip "should show appropriate nav items based on user role"
- [ ] Unskip "should prevent access to admin routes for non-admin users"
- [ ] Unskip "should allow back/forward navigation"
- [ ] Add tests for all navbar links

### 1.4 Fix DPM Creation Tests

File: `tests/e2e/dpm-creation.spec.ts`

- [ ] Import and use auth helpers in beforeEach
- [ ] Unskip "should navigate to DPM creation form"
- [ ] Unskip "should show validation errors for required fields"
- [ ] Unskip "should successfully create a DPM"
- [ ] Unskip remaining tests
- [ ] Update selectors to match actual form implementation

### 1.5 New E2E Test Files

Create new test files for missing flows:

#### `tests/e2e/approvals.spec.ts`

- [ ] Should display approval queue with pagination
- [ ] Should expand DPM details
- [ ] Should approve a DPM
- [ ] Should deny a DPM
- [ ] Should edit and save points
- [ ] Should navigate pagination correctly
- [ ] Should handle empty queue state

#### `tests/e2e/user-management.spec.ts`

- [ ] Should display users list
- [ ] Should create new user
- [ ] Should show duplicate email error
- [ ] Should edit existing user
- [ ] Should disable role field for own profile
- [ ] Should reset password
- [ ] Should delete user with confirmation

#### `tests/e2e/home.spec.ts`

- [ ] Should display current DPMs
- [ ] Should calculate positive/negative points correctly
- [ ] Should expand DPM details
- [ ] Should handle empty state

---

## Phase 2: Service Unit Tests

**Goal:** Achieve 100% coverage on all 9 services.

### 2.1 AuthService Tests

File: `src/app/services/auth.service.spec.ts`

- [ ] `login()` - successful login saves token
- [ ] `login()` - failed login throws error
- [ ] `logout()` - clears all localStorage items
- [ ] `saveToken()` - parses JWT and stores claims
- [ ] `isAuthenticated()` - returns true when token valid
- [ ] `isAuthenticated()` - returns false when token expired
- [ ] `getRole()` - returns stored role
- [ ] `changePassword()` - calls API and handles response
- [ ] `changePasswordRequired()` - checks requirement flag

### 2.2 DpmService Tests

File: `src/app/services/dpm.service.spec.ts`

- [ ] `getCurrentDpms()` - fetches and returns DPMs
- [ ] `getCurrentDpms()` - retries on failure (2x)
- [ ] `create()` - posts new DPM
- [ ] `getAllForUser()` - fetches user's DPM history
- [ ] `getDpmGroups()` - fetches DPM type configuration
- [ ] `getDpmColors()` - fetches available colors
- [ ] `updateDpmGroups()` - posts updated configuration
- [ ] Error handling via ErrorService

### 2.3 ApprovalsService Tests

File: `src/app/services/approvals.service.spec.ts`

- [ ] `getApprovalDpms()` - fetches paginated approvals
- [ ] `updatePoints()` - patches point value
- [ ] `approveDpm()` - posts approval, retries on failure
- [ ] `denyDpm()` - posts denial
- [ ] Error handling for all methods

### 2.4 UserService Tests

File: `src/app/services/user.service.spec.ts`

- [ ] `getUser()` - fetches user by ID
- [ ] `getUser()` - handles 303 (password change required)
- [ ] `getUser()` - handles 404 (not found)
- [ ] `createUser()` - posts new user
- [ ] `createUser()` - handles 422 (duplicate email)
- [ ] `updateUser()` - patches user
- [ ] `deleteUser()` - deletes user
- [ ] `resetPassword()` - sends reset email
- [ ] `getManagers()` - fetches manager list
- [ ] `resetPointBalances()` - batch reset
- [ ] `sendPointsBalance()` - sends email to user
- [ ] `sendPointsBalanceAll()` - sends email to all

### 2.5 NotificationService Tests

File: `src/app/services/notification.service.spec.ts`

- [ ] `showSuccess()` - displays success toast
- [ ] `showError()` - displays error toast
- [ ] `showWarning()` - displays warning toast
- [ ] Toast configuration options

### 2.6 ErrorService Tests

File: `src/app/services/error.service.spec.ts`

- [ ] `errorResponse()` - wraps error with message
- [ ] Returns Observable that throws
- [ ] Preserves original error details

### 2.7 Remaining Service Tests

- [ ] `autogen.service.spec.ts` - bulk DPM generation
- [ ] `datagen.service.spec.ts` - test data generation
- [ ] `format.service.spec.ts` - utility formatting

---

## Phase 3: Component Unit Tests

**Goal:** Cover all critical components with complex business logic.

### 3.1 ApprovalsComponent Tests

File: `src/app/dpms/approvals/approvals.component.spec.ts`

- [ ] Initial load fetches first page
- [ ] Pagination navigates correctly
- [ ] `approveDpm()` removes item and reloads
- [ ] `denyDpm()` removes item and reloads
- [ ] `savePoints()` calls API with new value
- [ ] Last item removal navigates to previous page
- [ ] Scroll position preserved after reload
- [ ] Animation states managed correctly
- [ ] Empty state displayed when no approvals

### 3.2 HomeComponent Tests

File: `src/app/dpms/home/home.component.spec.ts`

- [ ] Loads current DPMs on init
- [ ] Calculates positive points correctly
- [ ] Calculates negative points correctly
- [ ] Handles empty DPM list
- [ ] Expands/collapses DPM details
- [ ] Initial load animation triggered

### 3.3 LoginComponent Tests

File: `src/app/auth/login/login.component.spec.ts`

- [ ] Form validation (required fields)
- [ ] Submit disabled when invalid
- [ ] `onSubmit()` calls AuthService
- [ ] Bad credentials state displayed
- [ ] Password visibility toggle works
- [ ] Loading state during submission
- [ ] Redirects on successful login

### 3.4 UserFormComponent Tests

File: `src/app/users/user-form/user-form.spec.ts`

- [ ] Create mode initializes empty form
- [ ] Edit mode loads user data
- [ ] `hasFormChanged()` detects changes
- [ ] `hasFieldChanged()` tracks individual fields
- [ ] Role field disabled for own profile
- [ ] Validation errors displayed
- [ ] Submit creates/updates user
- [ ] Duplicate email error handled

### 3.5 ChangePasswordComponent Tests

File: `src/app/auth/change-password/change-password.component.spec.ts`

- [ ] Redirects if not required
- [ ] Form validation (min length, matching)
- [ ] Passwords must match validator
- [ ] New != current password validator
- [ ] 401 response clears current password
- [ ] 422 response clears new password
- [ ] Success navigates to home

### 3.6 NewDpmComponent Tests

File: `src/app/dpms/new-dpm/new-dpm.component.spec.ts`

- [ ] Form initialization
- [ ] Driver autocomplete
- [ ] Date picker interaction
- [ ] DPM type selection
- [ ] Form validation
- [ ] Successful submission
- [ ] Error handling

---

## Phase 4: UI Component Tests

**Goal:** Cover reusable UI components for regression prevention.

### 4.1 DataTableComponent Tests

File: `src/app/ui/data-table/data-table.component.spec.ts`

- [ ] Renders columns correctly
- [ ] Pagination controls work
- [ ] Page size selection
- [ ] Empty state displayed
- [ ] Loading state displayed
- [ ] Row click emits event
- [ ] Sorting (if applicable)

### 4.2 FormFieldComponent Tests

File: `src/app/ui/form-field/form-field.component.spec.ts`

- [ ] Renders label correctly
- [ ] Shows error state
- [ ] Shows success state
- [ ] Required indicator displayed
- [ ] Accessibility attributes

### 4.3 TabsComponent Tests

File: `src/app/ui/tabs/tabs.component.spec.ts`

- [ ] Renders tabs correctly
- [ ] Tab selection works
- [ ] Active tab styling
- [ ] Tab content displayed

### 4.4 Other UI Components

- [ ] `button.component.spec.ts` - variants, states
- [ ] `card.component.spec.ts` - rendering, slots
- [ ] `badge.component.spec.ts` - colors, sizes
- [ ] `avatar.component.spec.ts` - image, initials
- [ ] `stat-card.component.spec.ts` - values, trends
- [ ] `date-picker.component.spec.ts` - selection
- [ ] `autocomplete.component.spec.ts` - search, selection
- [ ] `collapsible.component.spec.ts` - expand/collapse
- [ ] `confirm-box.component.spec.ts` - actions
- [ ] `page-header.component.spec.ts` - rendering
- [ ] `empty-state.component.spec.ts` - messaging

---

## Phase 5: Guards, Pipes, and Directives

**Goal:** Complete coverage of auth infrastructure and utilities.

### 5.1 AuthGuard Tests

File: `src/app/auth/auth.guard.spec.ts`

- [ ] Allows access when authenticated
- [ ] Redirects to login when not authenticated
- [ ] Checks role requirements
- [ ] Redirects to 403 for unauthorized roles
- [ ] Redirects authenticated users from login page

### 5.2 Pipe Tests

- [ ] `name.pipe.spec.ts` - formats names
- [ ] `block.pipe.spec.ts` - formats blocks
- [ ] `points.pipe.spec.ts` - formats points with sign
- [ ] `color-by-id.pipe.spec.ts` - returns color

### 5.3 Directive Tests

- [ ] `authorized.directive.spec.ts` - shows/hides by role
- [ ] `passwords-equal.directive.spec.ts` - form validation
- [ ] Other custom directives

---

## Execution Checklist

### Before Starting Each Phase

- [ ] Run existing tests to ensure green baseline: `npm run test:headless`
- [ ] Run E2E tests: `npm run e2e`

### After Completing Each Phase

- [ ] All new tests pass
- [ ] No regression in existing tests
- [ ] Run coverage report: `npm run test:coverage`
- [ ] Document coverage improvement

### Phase Completion Criteria

| Phase   | Target Coverage    | Validation                       |
| ------- | ------------------ | -------------------------------- |
| Phase 1 | All E2E tests pass | `npm run e2e` - 0 failures       |
| Phase 2 | Services 100%      | Coverage report shows full green |
| Phase 3 | Components 60%+    | Critical paths covered           |
| Phase 4 | UI library 80%+    | Regression suite complete        |
| Phase 5 | Infrastructure 90% | Guards, pipes, directives tested |

---

## Test Commands Reference

```bash
# Unit tests
npm test                    # Watch mode
npm run test:headless       # CI mode (headless, single run)
npm run test:coverage       # Generate coverage report

# E2E tests
npm run e2e                 # Headless
npm run e2e:ui              # Interactive UI mode
npm run e2e:headed          # Visible browser

# Specific test file
npx playwright test login.spec.ts
ng test --include='**/auth.service.spec.ts'

# View reports
npx playwright show-report  # E2E HTML report
open coverage/uts-dpm/index.html  # Unit coverage
```

---

## Notes

- Test credentials: `test@account.com` / `testAccount` (admin access)
- Dev server auto-starts for E2E via Playwright config
- Coverage output: `./coverage/uts-dpm/`
- E2E report output: `./playwright-report/`
