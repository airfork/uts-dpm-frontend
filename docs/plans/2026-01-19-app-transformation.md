# UTS DPM App Transformation Plan

> **For Claude:** Use superpowers:executing-plans to implement this plan phase-by-phase with review checkpoints.

**Goal:** Transform UTS DPM from a partially-modernized app with broken functionality and legacy dependencies into a fully modern, lightweight, cohesive application.

**Approach:** Fix-first. Ensure everything works before refining aesthetics.

**Key Decisions:**
- Remove PrimeNG entirely (tables, autocomplete, datepicker, panels)
- Remove all remaining DaisyUI class usage
- Build custom lightweight components with full design control
- Use date-fns for date picker functionality
- Use native browser features where appropriate

---

## Phase 1: Critical Fixes

**Goal:** Get the app to a working state with no crashes, broken features, or build warnings.

### Task 1.1: Fix Users Page Load Failure

**Files to investigate:**
- `src/app/users/users-list/users-list.component.ts`
- `src/app/users/users/users.component.ts`
- `src/app/services/user.service.ts`

**Steps:**
1. Check browser console for error when navigating to /users
2. Identify the root cause (likely dependency injection or data loading)
3. Fix the issue
4. Verify page loads correctly

---

### Task 1.2: Fix Toast CSS Variables

**Files:**
- `src/styles/toast.css`
- `src/styles.css`

**Problem:** Toast styles reference undefined variables:
- `--color-info` / `--color-info-content`
- `--color-warning` / `--color-warning-content`
- `--color-success` / `--color-success-content`
- `--color-error` / `--color-error-content`

**Steps:**
1. Add missing color variables to `@theme` block in styles.css:
```css
/* Info colors (Blue) */
--color-info-50: oklch(0.98 0.02 240);
--color-info-100: oklch(0.95 0.05 240);
--color-info-500: oklch(0.58 0.18 240);
--color-info-600: oklch(0.48 0.16 240);

/* Warning colors (Amber/Orange) */
--color-warning-50: oklch(0.98 0.02 85);
--color-warning-100: oklch(0.95 0.05 85);
--color-warning-500: oklch(0.75 0.15 85);
--color-warning-600: oklch(0.65 0.14 85);
```

2. Add semantic aliases:
```css
--color-info: var(--color-info-500);
--color-info-content: white;
--color-warning: var(--color-warning-500);
--color-warning-content: oklch(0.2 0.02 85);
--color-success: var(--color-success-500);
--color-success-content: white;
--color-error: var(--color-error-500);
--color-error-content: white;
```

3. Verify toasts display correctly in all variants

---

### Task 1.3: Remove "Departmental Performance Management" Text

**Files:**
- `src/app/auth/login/login.component.html` (line 32)

**Steps:**
1. Remove or replace the subtitle text
2. Consider replacing with something shorter like "Driver Performance Tracking" or removing entirely

---

### Task 1.4: Fix Test Failures

**Files:**
- `src/app/app.component.spec.ts`
- `src/app/dpms/dpm-page/dpm-page.component.spec.ts`
- `src/app/dpms/edit-dpms/edit-dpms.component.spec.ts`

**Problems:**
1. `AppComponent` tests use `declarations` instead of `imports` for standalone component
2. Tests missing `ToastrService` provider
3. Test expects `title` to be `'uts-new-dpm'` but may be different

**Steps:**
1. Fix app.component.spec.ts:
```typescript
await TestBed.configureTestingModule({
  imports: [AppComponent],
}).compileComponents();
```

2. Add ToastrService provider to tests that need it:
```typescript
import { provideToastr } from 'ngx-toastr';

await TestBed.configureTestingModule({
  imports: [ComponentUnderTest],
  providers: [provideToastr()],
}).compileComponents();
```

3. Fix title expectation or component property

4. Run `npm test -- --watch=false --browsers=ChromeHeadless` and verify all pass

---

### Task 1.5: Fix Build Warnings

**Warnings to fix:**

1. **Unused imports:**
   - `LoginComponent`: Remove `Ripple` from imports
   - `NewDpmComponent`: Remove `NgClass` from imports
   - `NavbarComponent`: Remove `ButtonComponent` from imports

2. **Content projection warnings** in modals - restructure templates:
   - `approvals.component.html`
   - `home.component.html`
   - `user-detail.component.html`

**Pattern to fix content projection:**
```html
<!-- Before (causes warning) -->
<app-modal [open]="isOpen()">
  @if (data(); as item) {
    <ng-container modal-header>Title</ng-container>
    <ng-container modal-body>Content</ng-container>
  }
</app-modal>

<!-- After (no warning) -->
@if (data(); as item) {
  <app-modal [open]="isOpen()">
    <ng-container modal-header>Title</ng-container>
    <ng-container modal-body>Content</ng-container>
  </app-modal>
}
```

3. Run `npm run build` and verify zero warnings

---

## Phase 2: Remove PrimeNG & Create Custom Components

**Goal:** Replace all PrimeNG components with lightweight custom alternatives.

### Task 2.1: Create DataTable Component

**Files to create:**
- `src/app/ui/data-table/data-table.types.ts`
- `src/app/ui/data-table/data-table.component.ts`
- `src/app/ui/data-table/data-table.component.html`

**Features:**
- Column definitions via input
- Built-in pagination with page size selector
- Row hover and click handlers
- Sort by column (optional)
- Empty state message
- Loading state
- Responsive (horizontal scroll on mobile)

**API Design:**
```typescript
interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  template?: TemplateRef<any>;
}

// Usage
<app-data-table
  [data]="users()"
  [columns]="columns"
  [rows]="10"
  [rowsPerPageOptions]="[10, 25, 50]"
  [loading]="loading()"
  [emptyMessage]="'No users found.'"
  (rowClick)="onRowClick($event)"
/>
```

**Styling:**
- Gradient header matching current design
- Design token colors throughout
- Proper dark mode support

---

### Task 2.2: Create Autocomplete Component

**Files to create:**
- `src/app/ui/autocomplete/autocomplete.types.ts`
- `src/app/ui/autocomplete/autocomplete.component.ts`
- `src/app/ui/autocomplete/autocomplete.component.html`

**Features:**
- Text input with dropdown suggestions
- Keyboard navigation (up/down/enter/escape)
- Highlight matching text in suggestions
- forceSelection option
- Custom suggestion template support
- Hover states on dropdown items

**API Design:**
```typescript
<app-autocomplete
  [suggestions]="filteredNames()"
  [forceSelection]="true"
  placeholder="Search driver..."
  (completeMethod)="search($event)"
  (onSelect)="onDriverSelect($event)"
  formControlName="name"
/>
```

---

### Task 2.3: Create DatePicker Component

**Files to create:**
- `src/app/ui/date-picker/date-picker.types.ts`
- `src/app/ui/date-picker/date-picker.component.ts`
- `src/app/ui/date-picker/date-picker.component.html`

**Dependencies:**
- `date-fns` (already may be indirect dep, or add it - very lightweight)

**Features:**
- Calendar dropdown
- Month/year navigation
- Today button
- Keyboard navigation
- Format customization
- Min/max date constraints
- Mobile-friendly (larger touch targets)

**API Design:**
```typescript
<app-date-picker
  formControlName="dpmDate"
  [placeholder]="'Select date'"
  [format]="'MM/dd/yyyy'"
  [minDate]="minDate"
  [maxDate]="maxDate"
/>
```

---

### Task 2.4: Create Collapsible Component

**Files to create:**
- `src/app/ui/collapsible/collapsible.component.ts`
- `src/app/ui/collapsible/collapsible.component.html`

**Features:**
- Expandable/collapsible panel
- Animated open/close
- Custom header via content projection
- Open/closed state control

**API Design:**
```typescript
<app-collapsible [collapsed]="true">
  <ng-container header>
    <span class="italic">Info</span>
  </ng-container>
  <p>Panel content here...</p>
</app-collapsible>
```

---

### Task 2.5: Create Auto-Resize Textarea Directive

**Files to create:**
- `src/app/shared/directives/auto-resize.directive.ts`

**Features:**
- Automatically adjusts textarea height based on content
- Respects min-height
- Works with reactive forms

**API Design:**
```html
<textarea appAutoResize [minRows]="1" formControlName="name"></textarea>
```

---

### Task 2.6: Migrate Home Page from PrimeNG

**Files:**
- `src/app/dpms/home/home.component.ts`
- `src/app/dpms/home/home.component.html`

**Steps:**
1. Replace `p-table` with `app-data-table`
2. Update imports
3. Verify functionality

---

### Task 2.7: Migrate Approvals Page from PrimeNG

**Files:**
- `src/app/dpms/approvals/approvals.component.ts`
- `src/app/dpms/approvals/approvals.component.html`

**Steps:**
1. Replace `p-table` with `app-data-table`
2. Update imports
3. Verify lazy loading still works

---

### Task 2.8: Migrate Users List from PrimeNG

**Files:**
- `src/app/users/users-list/users-list.component.ts`
- `src/app/users/users-list/users-list.component.html`

**Steps:**
1. Replace `p-table` with `app-data-table`
2. Update imports
3. Verify search filtering works

---

### Task 2.9: Migrate Autogen Page from PrimeNG

**Files:**
- `src/app/dpms/autogen/autogen.component.ts`
- `src/app/dpms/autogen/autogen.component.html`

**Note:** This page uses basic HTML table, not p-table. Just needs styling update.

---

### Task 2.10: Migrate New DPM Form from PrimeNG

**Files:**
- `src/app/dpms/new-dpm/new-dpm.component.ts`
- `src/app/dpms/new-dpm/new-dpm.component.html`

**Steps:**
1. Replace `p-autoComplete` with `app-autocomplete`
2. Replace `p-date-picker` with `app-date-picker`
3. Update imports
4. Verify form submission works

---

### Task 2.11: Migrate Datagen Page from PrimeNG

**Files:**
- `src/app/dpms/datagen/datagen.component.ts`
- `src/app/dpms/datagen/datagen.component.html`

**Steps:**
1. Replace `p-date-picker` with `app-date-picker`
2. Update imports

---

### Task 2.12: Migrate Edit DPMs from PrimeNG

**Files:**
- `src/app/dpms/edit-dpms/edit-dpms.component.ts`
- `src/app/dpms/edit-dpms/edit-dpms.component.html`

**Steps:**
1. Replace `pInputTextarea` with native textarea + `appAutoResize`
2. Replace `p-panel` with `app-collapsible`
3. Update imports

---

### Task 2.13: Remove PrimeNG Dependencies

**Files:**
- `package.json`
- `src/styles.css`
- `src/app/app.config.ts` (if PrimeNG providers exist)

**Steps:**
1. Remove from package.json:
   - `primeng`
   - `@primeng/themes`
   - `primeicons`
2. Remove from styles.css:
   - `@plugin "tailwindcss-primeui"`
   - Any PrimeNG-specific CSS
3. Remove `primeicons` CSS import from angular.json
4. Run `npm install` to clean lockfile
5. Run `npm run build` and verify success

---

## Phase 3: Remove DaisyUI Remnants

**Goal:** Replace all remaining DaisyUI utility classes with custom Tailwind/design system classes.

### Task 3.1: Audit DaisyUI Class Usage

**Run search for DaisyUI classes:**
```bash
grep -r "btn\|btn-\|table\|tabs\|tab-\|tooltip\|checkbox\|input\|select\|textarea\|badge\|card\|modal\|dropdown\|menu\|navbar\|fieldset\|divider" src/app --include="*.html" | grep -v "app-"
```

**Document all occurrences for replacement.**

---

### Task 3.2: Create Tooltip Component

**Files to create:**
- `src/app/ui/tooltip/tooltip.directive.ts`

**Features:**
- Directive-based (not component)
- Positions: top, bottom, left, right
- Delay option
- Uses design tokens

**API Design:**
```html
<button appTooltip="Add DPM Group" tooltipPosition="top">
  <i class="pi pi-plus"></i>
</button>
```

---

### Task 3.3: Create Tabs Component

**Files to create:**
- `src/app/ui/tabs/tabs.types.ts`
- `src/app/ui/tabs/tabs.component.ts`
- `src/app/ui/tabs/tabs.component.html`
- `src/app/ui/tabs/tab.component.ts`

**API Design:**
```html
<app-tabs [(activeTab)]="activeTab">
  <app-tab name="search" label="Search">
    <!-- Search content -->
  </app-tab>
  <app-tab name="create" label="Create">
    <!-- Create content -->
  </app-tab>
</app-tabs>
```

---

### Task 3.4: Create Input Component/Styles

**Files:**
- `src/app/ui/input/input.component.ts` (or just global styles)

**Standardize input styling:**
- Consistent border, padding, focus states
- Error state styling
- Success state styling
- Disabled state
- Design tokens throughout

---

### Task 3.5: Create Select Component/Styles

**Same as inputs but for select elements:**
- Fix arrow spacing issue (too close to right edge)
- Consistent styling with inputs

---

### Task 3.6: Create Checkbox Component

**Files to create:**
- `src/app/ui/checkbox/checkbox.component.ts`
- `src/app/ui/checkbox/checkbox.component.html`

**Features:**
- Custom styled checkbox
- Label support
- Disabled state
- Works with reactive forms

---

### Task 3.7: Replace All DaisyUI Classes

Go through each file identified in Task 3.1 and replace:

| DaisyUI Class | Replacement |
|---------------|-------------|
| `btn btn-primary` | `<app-button variant="primary">` |
| `btn btn-secondary` | `<app-button variant="secondary">` |
| `btn btn-ghost` | `<app-button variant="ghost">` |
| `table` | `<app-data-table>` or custom table styles |
| `tabs`, `tab`, `tab-active` | `<app-tabs>` |
| `tooltip` | `appTooltip` directive |
| `checkbox` | `<app-checkbox>` |
| `input`, `input-bordered` | Input styles from design system |
| `select`, `select-bordered` | Select styles from design system |
| `textarea` | Textarea styles from design system |
| `fieldset`, `fieldset-legend` | Custom fieldset styles |
| `divider` | Custom divider styles (simple `<hr>` with styling) |

---

## Phase 4: UI/UX Fixes

**Goal:** Fix all the small but noticeable UI issues.

### Task 4.1: Fix Navbar Active State Contrast

**File:** `src/app/ui/navbar/navbar.component.html`

**Problem:** Active link uses `bg-white text-primary-600` which may be hard to read.

**Solution:** Ensure sufficient contrast, possibly use `font-bold` or different background.

---

### Task 4.2: Fix Hamburger Menu Cursor

**File:** `src/app/ui/navbar/navbar.component.html`

**Problem:** No pointer cursor on mobile menu button.

**Solution:** Add `cursor-pointer` class.

---

### Task 4.3: Fix Select Arrow Spacing

**File:** Global styles or select component

**Problem:** Dropdown arrow too close to right edge.

**Solution:** Add right padding to select elements.

---

### Task 4.4: Fix Placeholder Contrast in Light Mode

**File:** `src/styles.css`

**Problem:** Placeholder text has low contrast.

**Solution:** Adjust placeholder opacity or color for better readability while still being distinguishable from actual input.

---

### Task 4.5: Fix Hero Banner Dark Mode Contrast

**File:** `src/app/dpms/home/home.component.html`

**Problem:** Stat card colors look bad in dark mode.

**Solution:** Adjust stat-card component colors for dark mode, ensure sufficient contrast.

---

### Task 4.6: Fix New DPM Default State

**File:** `src/app/dpms/new-dpm/new-dpm.component.ts`

**Problem:** Date field should default to today and show green (valid) state.

**Current:** Date already defaults to today, but border is neutral not green.

**Solution:** Update `getInputBorderClass` to show success state for valid untouched fields, or adjust the logic.

---

### Task 4.7: Fix Autocomplete Hover States

**File:** New autocomplete component from Phase 2

**Ensure:** Dropdown items have visible hover state.

---

### Task 4.8: Fix Logout Button Cursor

**File:** `src/app/ui/navbar/navbar.component.html`

**Problem:** Logout button doesn't show pointer cursor.

**Solution:** Add `cursor-pointer` class.

---

## Phase 5: Page Redesigns

**Goal:** Bring all pages up to the modern design standard.

### Task 5.1: Redesign Edit DPMs Page

**Files:**
- `src/app/dpms/edit-dpms/edit-dpms.component.html`
- `src/app/dpms/edit-dpms/edit-dpms.component.ts`

**Issues to fix:**
1. Missing icons (empty squares) - ensure icon classes are correct
2. Color modal styling - modernize to match app design
3. Add tooltips using new tooltip directive
4. Improve drag & drop UX:
   - Visual drag handle
   - Drop zone highlighting
   - Better visual feedback during drag

---

### Task 5.2: Redesign Autogen Page

**Files:**
- `src/app/dpms/autogen/autogen.component.html`
- `src/app/dpms/autogen/autogen.component.ts`

**Changes:**
1. Use new data-table component or style the HTML table
2. Add gradient header
3. Modernize submit button
4. Add page container with proper spacing

---

### Task 5.3: Redesign Datagen Page

**Files:**
- `src/app/dpms/datagen/datagen.component.html`
- `src/app/dpms/datagen/datagen.component.ts`

**Changes:**
1. Use new date-picker component
2. Modernize form layout
3. Improve button styling
4. Add proper section headers and spacing
5. Modernize the checkbox styling

---

### Task 5.4: Redesign Users List Page

**Files:**
- `src/app/users/users-list/users-list.component.html`
- `src/app/users/users-list/users-list.component.ts`

**Changes:**
1. Use new tabs component
2. Use new data-table component
3. Modernize search input
4. Improve actions section layout

---

### Task 5.5: Redesign Toast Notifications

**File:** `src/styles/toast.css`

**Changes:**
1. Modern styling with rounded corners
2. Icons for each toast type
3. Gradient or solid colors matching design system
4. Smooth animations
5. Better positioning

---

### Task 5.6: Final Polish Pass

**Review all pages for:**
- Consistent spacing
- Consistent typography
- Proper dark mode support
- Responsive behavior
- Loading states
- Empty states
- Error states

---

## Verification Checklist

After completing all phases:

- [ ] All pages load without errors
- [ ] All forms submit correctly
- [ ] All modals open and display content
- [ ] All tables paginate correctly
- [ ] All tests pass
- [ ] Build has zero warnings
- [ ] Light mode looks good
- [ ] Dark mode looks good
- [ ] Mobile responsive works
- [ ] No PrimeNG in bundle
- [ ] No DaisyUI classes in codebase
- [ ] Bundle size reduced

---

## Summary

| Phase | Tasks | Focus |
|-------|-------|-------|
| 1 | 5 | Critical bug fixes |
| 2 | 13 | Remove PrimeNG, create custom components |
| 3 | 7 | Remove DaisyUI remnants |
| 4 | 8 | UI/UX fixes |
| 5 | 6 | Page redesigns |

**Total Tasks:** 39

**Dependencies to remove:**
- primeng
- @primeng/themes
- primeicons
- tailwindcss-primeui

**Dependencies to add:**
- date-fns (if not already present)
