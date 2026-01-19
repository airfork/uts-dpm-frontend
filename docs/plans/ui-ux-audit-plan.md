# UI/UX Comprehensive Audit & Fix Plan

## Overview

Systematic UI/UX audit and fix of the UTS DPM Angular application. The hybrid approach fixes obvious issues immediately while extracting reusable components as patterns emerge. Maximum thoroughness: all pages, accessibility, dark mode, and responsive testing via Chrome DevTools MCP.

**Key Problems Identified:**
1. Inconsistent form styling across pages (login vs other forms)
2. Button color usage not standardized (primary vs secondary)
3. Page headers have different visual treatments
4. Empty states not implemented consistently
5. Accessibility gaps (ARIA labels, contrast)
6. Some responsive design issues on mobile

## Planning Context

### Decision Log

| Decision | Reasoning Chain |
|----------|-----------------|
| Hybrid approach over component-first | Need visible progress while improving architecture -> component-first delays visible improvements -> hybrid delivers both incrementally |
| Fix auth pages first | Auth pages are first user touchpoint -> inconsistencies here create poor first impression -> high visibility ROI |
| Extract FormField component | 5+ pages have form inputs with different styling -> centralization eliminates duplication -> single source of truth for validation display |
| FormField uses ControlValueAccessor | User confirmed reactive forms integration -> enables Angular Forms API -> validates at component level with formControlName -> more complex but production-ready for enterprise forms |
| Extract PageHeader component | 6+ pages have header sections with icons -> current implementations copy/paste patterns -> component ensures consistency |
| PageHeader variants (primary, secondary, success, info) | Analysis of page headers shows 4 semantic categories needed -> success for positive actions (user mgmt), info for data operations (datagen), primary for main workflows (home, approvals), secondary for configuration (autogen, edit types) -> excludes warning/error as headers don't represent transient states |
| Extract EmptyState component | Only autogen has proper empty state -> data tables need consistent empty display -> component provides reusable pattern |
| Empty state content developer-authored | User confirmed developers write copy -> internal app with known user base -> friendly but professional tone -> ensure consistent voice across empty states |
| Primary color for main actions | Currently mixed primary/secondary on submit buttons -> user doesn't know significance -> standardize primary for main CTA |
| Chrome DevTools for validation | Visual bugs can't be caught by code review alone -> DevTools shows actual rendering -> verification before marking complete |
| WCAG AA conformance level | User confirmed organization requires AA (4.5:1 normal text, 3:1 large text, 3:1 UI components) -> AAA would be 7:1/4.5:1 but not required for internal tool -> balances accessibility with design flexibility |
| Single error alert below form for auth | Auth errors are authentication failures (not field validation) -> single error message more appropriate than per-field -> matches login/authentication UX patterns -> consolidates duplicate display |

### Milestone Flags Reference

| Flag | Meaning | Action Required |
|------|---------|-----------------|
| conformance | Verify matches design system patterns | Visual validation against design tokens |
| needs-rationale | Non-obvious choices require Decision Log | Ensure all decisions documented |

### Rejected Alternatives

| Alternative | Why Rejected |
|-------------|--------------|
| Page-by-page only | Would not address root cause of inconsistency; repeated manual fixes |
| Component-first only | Delays visible improvements; user wants to see progress |
| Skip accessibility audit | Maximum thoroughness requested; a11y is critical for UX |
| Use PrimeNG components only | Custom design system already established; PrimeNG doesn't match design tokens |

### Constraints & Assumptions

- Angular 21 with signals architecture
- Tailwind CSS 4 with OKLCH color system defined in src/styles.css
- Custom UI components in src/app/ui/ are standalone components
- Chrome DevTools MCP available for visual validation
- Default conventions applied: testing (visual verification via DevTools)

### Known Risks

| Risk | Mitigation | Anchor |
|------|------------|--------|
| Component extraction may break existing pages | Validate each page after component changes via DevTools | N/A |
| Dark mode may have contrast issues | Test every page in dark mode during validation | N/A |
| Responsive breakpoints untested | Test at 375px, 768px, 1024px, 1440px | N/A |

## Invisible Knowledge

### Architecture

```
src/app/
  ├── ui/           # Reusable UI components (Button, Card, Modal, etc.)
  ├── auth/         # Login, Change Password
  ├── dpms/         # Main app pages (Home, New DPM, Edit, Autogen, Datagen, Approvals)
  ├── users/        # User management (List, Detail, Form)
  └── error-pages/  # 403, 404 error pages
```

### Data Flow (UI/UX)

```
User -> Auth Pages -> DPMS Home (dashboard)
                   -> DPM Pages (create/edit/approve)
                   -> Users Pages (admin only)
```

### Why This Structure

- `ui/` components are building blocks consumed by feature pages
- Feature pages import and compose ui/ components
- Design tokens in styles.css provide consistent theming

### Invariants

- All form inputs must show validation errors the same way
- All primary actions use primary color variant
- All page headers follow same icon + title pattern
- All empty states provide visual feedback

### Tradeoffs

- Component extraction adds indirection but ensures consistency
- More upfront work but lower long-term maintenance

## Milestones

### Milestone 1: Auth Pages - Login & Change Password

**Files**:
- `src/app/auth/login/login.component.html`
- `src/app/auth/login/login.component.ts`
- `src/app/auth/change-password/change-password.component.html`
- `src/app/auth/change-password/change-password.component.ts`

**Flags**: `conformance`, `needs-rationale`

**Requirements**:
- Login: Fix duplicate error message display (show once, not on both fields)
- Login: Add password visibility toggle
- Change Password: Update form styling to match login page patterns
- Change Password: Add visual header section with icon
- Both: Consistent input focus states and error display

**Acceptance Criteria**:
- Login error shows in single location (not duplicated)
- Password field has visibility toggle icon
- Change password inputs match login input styling
- Both pages pass visual inspection in light and dark mode
- Responsive layout works at 375px

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: user-specified (maximum thoroughness)
- **Scenarios**:
  - Light mode appearance
  - Dark mode appearance
  - Mobile viewport (375px)
  - Error state display

**Code Intent**:
- Modify `login.component.html`: Remove duplicate error message display, consolidate to single alert below form
- Modify `login.component.html`: Add password visibility toggle button with eye/eye-off icons
- Modify `login.component.ts`: Add signal for password visibility state
- Modify `change-password.component.html`: Update input classes to use same pattern as login (`bg-base-200`, focus rings)
- Modify `change-password.component.html`: Add page header section with icon matching other pages
- Modify `change-password.component.ts`: Remove setStatusClass helper, use inline conditional classes

**Code Changes**:

```diff
--- a/src/app/auth/login/login.component.html
+++ b/src/app/auth/login/login.component.html
@@ -74,11 +74,13 @@
         <div class="space-y-2">
           <label
             for="password"
             class="block text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide"
           >
             Password
           </label>
-          <input
+          <div class="relative">
+            <input
             id="password"
-            type="password"
+            [type]="showPassword() ? 'text' : 'password'"
             class="w-full px-4 py-3 rounded-lg bg-base-200 border text-base-content placeholder:text-base-content/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
             [ngClass]="{
               'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20 focus:bg-primary-50/50 dark:focus:bg-primary-900/10':
@@ -93,16 +95,22 @@
             placeholder="Enter your password"
             formControlName="password"
             (input)="onUserInput()"
           />
-          @if (getPasswordValidationMessages()) {
-            <p class="text-sm text-error-600 font-medium mt-1.5">
-              {{ getPasswordValidationMessages() }}
-            </p>
-          }
+            <button
+              type="button"
+              class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content transition-colors"
+              (click)="showPassword.set(!showPassword())"
+            >
+              <i [class]="showPassword() ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
+            </button>
+          </div>
         </div>

+        @if (badCredentials()) {
+          <div class="rounded-lg bg-error-50 dark:bg-error-900/20 border border-error-200 dark:border-error-800 p-4">
+            <p class="text-sm text-error-600 dark:text-error-400 font-medium">
+              Username and/or password is incorrect
+            </p>
+          </div>
+        }
+
         <button
           id="submitButton"
```

```diff
--- a/src/app/auth/login/login.component.ts
+++ b/src/app/auth/login/login.component.ts
@@ -28,6 +28,7 @@ export class LoginComponent {
   });

   badCredentials = signal(false);
   loading = signal(false);
+  showPassword = signal(false);

   onSubmit() {
@@ -52,26 +53,11 @@ export class LoginComponent {
   }

   getUsernameValidationMessages(): string {
-    const badCredentials = this.badCredentials();
-    if (!this.hasErrors(this.username) && !badCredentials) return '';
+    if (!this.hasErrors(this.username)) return '';

     if (this.username?.errors?.['required'] && this.hasErrors(this.username)) {
       return 'Username is required';
     }

-    if (badCredentials) {
-      return 'Username and/or password is incorrect';
-    }
-
-    return '';
-  }
-
-  getPasswordValidationMessages(): string {
-    if (!this.hasErrors(this.password)) return '';
-
-    if (this.password?.errors?.['required']) {
-      return 'Password is required';
-    }
-
     return '';
   }
```

```diff
--- a/src/app/auth/change-password/change-password.component.html
+++ b/src/app/auth/change-password/change-password.component.html
@@ -1,73 +1,109 @@
 @if (!isLoading()) {
-  <div class="grid place-items-center h-[90vh]">
-    <form
-      class="grid place-items-center max-w-[20rem] w-full"
-      [formGroup]="changePasswordFormGroup"
-      (ngSubmit)="onSubmit()"
-    >
-      <h3 class="text-4xl font-bold mb-3">Change Password</h3>
+  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-200 px-4">
+    <div class="w-full max-w-md">
+      <div class="text-center mb-8">
+        <div
+          class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25"
+        >
+          <i class="pi pi-lock text-2xl text-white"></i>
+        </div>
+        <h1 class="text-3xl font-bold text-base-content">Change Password</h1>
+        <p class="text-sm text-base-content/60 mt-2">
+          Update your password to continue
+        </p>
+      </div>

-      <fieldset class="form-fieldset w-full mb-2">
-        <input
-          id="currentPassword"
-          type="password"
-          class="form-input w-full {{
-            setStatusClass(currentPassword)
-          }}"
-          placeholder="Current Password"
-          formControlName="currentPassword"
-        />
-        @if (getCurrentPasswordValidationMessages()) {
-          <p class="text-error text-sm flex items-center gap-1">
-            <i class="pi pi-exclamation-circle"></i>
-            {{ getCurrentPasswordValidationMessages() }}
-          </p>
-        }
-      </fieldset>
+      <div class="bg-base-100 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8 shadow-xl">
+        <form
+          class="space-y-5"
+          [formGroup]="changePasswordFormGroup"
+          (ngSubmit)="onSubmit()"
+        >
+          <div class="space-y-2">
+            <label
+              for="currentPassword"
+              class="block text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide"
+            >
+              Current Password
+            </label>
+            <input
+              id="currentPassword"
+              type="password"
+              class="w-full px-4 py-3 rounded-lg bg-base-200 border text-base-content placeholder:text-base-content/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
+              [ngClass]="{
+                'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20 focus:bg-primary-50/50 dark:focus:bg-primary-900/10':
+                  !hasErrors(currentPassword),
+                'border-error-500 focus:border-error-500 focus:ring-error-500/20 bg-error-50/50 dark:bg-error-900/10':
+                  hasErrors(currentPassword),
+              }"
+              placeholder="Enter current password"
+              formControlName="currentPassword"
+            />
+            @if (getCurrentPasswordValidationMessages()) {
+              <p class="text-sm text-error-600 font-medium mt-1.5">
+                {{ getCurrentPasswordValidationMessages() }}
+              </p>
+            }
+          </div>

-      <fieldset class="form-fieldset w-full mb-2">
-        <input
-          id="newPassword"
-          type="password"
-          class="form-input w-full {{ setStatusClass(newPassword) }}"
-          placeholder="New Password"
-          formControlName="newPassword"
-        />
-        @if (getNewPasswordValidationMessages()) {
-          <p class="text-error text-sm flex items-center gap-1">
-            <i class="pi pi-exclamation-circle"></i>
-            {{ getNewPasswordValidationMessages() }}
-          </p>
-        }
-      </fieldset>
+          <div class="space-y-2">
+            <label
+              for="newPassword"
+              class="block text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide"
+            >
+              New Password
+            </label>
+            <input
+              id="newPassword"
+              type="password"
+              class="w-full px-4 py-3 rounded-lg bg-base-200 border text-base-content placeholder:text-base-content/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
+              [ngClass]="{
+                'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20 focus:bg-primary-50/50 dark:focus:bg-primary-900/10':
+                  !hasErrors(newPassword) && !getNewPasswordValidationMessages(),
+                'border-error-500 focus:border-error-500 focus:ring-error-500/20 bg-error-50/50 dark:bg-error-900/10':
+                  hasErrors(newPassword) || getNewPasswordValidationMessages(),
+              }"
+              placeholder="Enter new password (min 8 characters)"
+              formControlName="newPassword"
+            />
+            @if (getNewPasswordValidationMessages()) {
+              <p class="text-sm text-error-600 font-medium mt-1.5">
+                {{ getNewPasswordValidationMessages() }}
+              </p>
+            }
+          </div>

-      <fieldset class="form-fieldset w-full mb-2">
-        <input
-          id="confirmPassword"
-          type="password"
-          class="form-input w-full {{
-            setStatusClass(confirmPassword)
-          }}"
-          placeholder="Confirm Password"
-          formControlName="confirmPassword"
-        />
-        @if (getConfirmPasswordValidationMessages()) {
-          <p class="text-error text-sm flex items-center gap-1">
-            <i class="pi pi-exclamation-circle"></i>
-            {{ getConfirmPasswordValidationMessages() }}
-          </p>
-        }
-      </fieldset>
+          <div class="space-y-2">
+            <label
+              for="confirmPassword"
+              class="block text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide"
+            >
+              Confirm Password
+            </label>
+            <input
+              id="confirmPassword"
+              type="password"
+              class="w-full px-4 py-3 rounded-lg bg-base-200 border text-base-content placeholder:text-base-content/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
+              [ngClass]="{
+                'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20 focus:bg-primary-50/50 dark:focus:bg-primary-900/10':
+                  !hasErrors(confirmPassword) && !getConfirmPasswordValidationMessages(),
+                'border-error-500 focus:border-error-500 focus:ring-error-500/20 bg-error-50/50 dark:bg-error-900/10':
+                  hasErrors(confirmPassword) || getConfirmPasswordValidationMessages(),
+              }"
+              placeholder="Confirm new password"
+              formControlName="confirmPassword"
+            />
+            @if (getConfirmPasswordValidationMessages()) {
+              <p class="text-sm text-error-600 font-medium mt-1.5">
+                {{ getConfirmPasswordValidationMessages() }}
+              </p>
+            }
+          </div>

-      <button
-        id="submitButton"
-        type="submit"
-        class="px-8 py-3 bg-primary-600 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary-700 active:scale-[0.98] w-full"
-        [disabled]="!changePasswordFormGroup.valid || waitingForResponse()"
-      >
-        Change
-      </button>
-    </form>
+          <button
+            id="submitButton"
+            type="submit"
+            class="w-full mt-6 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-base-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:from-primary-700 hover:to-primary-600 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.98]"
+            [disabled]="!changePasswordFormGroup.valid || waitingForResponse()"
+          >
+            Change Password
+          </button>
+        </form>
+      </div>
+    </div>
   </div>
 } @else {
   <app-loading></app-loading>
```

```diff
--- a/src/app/auth/change-password/change-password.component.ts
+++ b/src/app/auth/change-password/change-password.component.ts
@@ -106,22 +106,6 @@ export class ChangePasswordComponent implements OnInit {
     return control.invalid && (control.dirty || control.touched);
   }

-  setStatusClass(control: AbstractControl | null, isInput = true): string {
-    if (control == null) return '';
-    const prefix = isInput ? 'input-' : 'text-';
-
-    if (this.hasErrors(control)) return prefix + 'error';
-
-    if (control === this.confirmPassword && this.getConfirmPasswordValidationMessages() !== '') {
-      return prefix + 'error';
-    }
-
-    if (control === this.newPassword && this.getNewPasswordValidationMessages() !== '') {
-      return prefix + 'error';
-    }
-
-    if (control.dirty || control.touched) return prefix + 'success';
-    return '';
-  }
-
   getCurrentPasswordValidationMessages(): string {
     if (!this.hasErrors(this.currentPassword)) return '';

```

---

### Milestone 2: Extract FormField Component

**Files**:
- `src/app/ui/form-field/form-field.component.ts` (new)
- `src/app/ui/form-field/form-field.component.html` (new)

**Flags**: `conformance`, `needs-rationale`

**Requirements**:
- Create reusable FormField component with ControlValueAccessor
- Implement NG_VALUE_ACCESSOR for reactive forms integration
- Support label, error message, hint text, required indicator
- Consistent styling for all states (default, focus, error, disabled)
- Auto-validate when used with formControlName

**Acceptance Criteria**:
- Component implements ControlValueAccessor interface
- Works with formControlName and formControl directives
- Error state shows red border and error icon
- Works with text, password, email, number input types
- Visual inspection passes in DevTools

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: default-derived
- **Scenarios**:
  - Default state
  - Focus state
  - Error state with message (from FormControl)
  - Disabled state
  - Integration with reactive form

**Code Intent**:
- New file `form-field.component.ts`: Standalone component implementing ControlValueAccessor
- Provide NG_VALUE_ACCESSOR with forwardRef
- Signal inputs: `label: input<string>()`, `hint: input<string>()`, `required: input<boolean>(false)`, `type: input<string>('text')`
- Inject NgControl to access validation errors automatically
- Implement writeValue, registerOnChange, registerOnTouched, setDisabledState
- New file `form-field.component.html`: Label element, input element, conditional error/hint display
- Use design tokens: error-600 for errors, base-content for labels
- Decision: "FormField uses ControlValueAccessor" - enables Angular Forms API

**Code Changes**:

```diff
--- /dev/null
+++ b/src/app/ui/form-field/form-field.component.ts
@@ -0,0 +1,72 @@
+import { Component, input, forwardRef, inject, computed, signal } from '@angular/core';
+import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
+import { NgClass } from '@angular/common';
+
+@Component({
+  selector: 'app-form-field',
+  templateUrl: './form-field.component.html',
+  standalone: true,
+  imports: [NgClass],
+  providers: [
+    {
+      provide: NG_VALUE_ACCESSOR,
+      useExisting: forwardRef(() => FormFieldComponent),
+      multi: true,
+    },
+  ],
+})
+export class FormFieldComponent implements ControlValueAccessor {
+  label = input<string>('');
+  hint = input<string>('');
+  required = input<boolean>(false);
+  type = input<string>('text');
+  placeholder = input<string>('');
+  id = input.required<string>();
+
+  ngControl = inject(NgControl, { optional: true, self: true });
+
+  value = signal<any>('');
+  disabled = signal<boolean>(false);
+  touched = signal<boolean>(false);
+
+  onChange: (value: any) => void = () => {};
+  onTouched: () => void = () => {};
+
+  constructor() {
+    if (this.ngControl) {
+      this.ngControl.valueAccessor = this;
+    }
+  }
+
+  hasError = computed(() => {
+    const control = this.ngControl?.control;
+    return control && control.invalid && (control.dirty || control.touched);
+  });
+
+  errorMessage = computed(() => {
+    if (!this.hasError()) return '';
+    const errors = this.ngControl?.control?.errors;
+    if (!errors) return '';
+
+    if (errors['required']) return `${this.label()} is required`;
+    if (errors['email']) return 'Please enter a valid email';
+    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters required`;
+    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
+    return 'Invalid input';
+  });
+
+  writeValue(value: any): void {
+    this.value.set(value || '');
+  }
+
+  registerOnChange(fn: any): void {
+    this.onChange = fn;
+  }
+
+  registerOnTouched(fn: any): void {
+    this.onTouched = fn;
+  }
+
+  setDisabledState(isDisabled: boolean): void {
+    this.disabled.set(isDisabled);
+  }
+
+  onInput(event: Event): void {
+    const target = event.target as HTMLInputElement;
+    this.value.set(target.value);
+    this.onChange(target.value);
+  }
+
+  onBlur(): void {
+    this.touched.set(true);
+    this.onTouched();
+  }
+}
```

```diff
--- /dev/null
+++ b/src/app/ui/form-field/form-field.component.html
@@ -0,0 +1,30 @@
+<div class="space-y-2">
+  @if (label()) {
+    <label
+      [for]="id()"
+      class="block text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide"
+    >
+      {{ label() }}
+      @if (required()) {
+        <span class="text-error-500">*</span>
+      }
+    </label>
+  }
+
+  <input
+    [id]="id()"
+    [type]="type()"
+    [value]="value()"
+    [disabled]="disabled()"
+    [placeholder]="placeholder()"
+    [attr.aria-describedby]="hasError() ? id() + '-error' : null"
+    (input)="onInput($event)"
+    (blur)="onBlur()"
+    class="w-full px-4 py-3 rounded-lg bg-base-200 border text-base-content placeholder:text-base-content/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
+    [ngClass]="{
+      'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20 focus:bg-primary-50/50 dark:focus:bg-primary-900/10': !hasError(),
+      'border-error-500 focus:border-error-500 focus:ring-error-500/20 bg-error-50/50 dark:bg-error-900/10': hasError()
+    }"
+  />
+
+  @if (hasError() && errorMessage()) {
+    <p [id]="id() + '-error'" class="text-sm text-error-600 font-medium mt-1.5">
+      {{ errorMessage() }}
+    </p>
+  } @else if (hint()) {
+    <p class="text-sm text-base-content/60 mt-1.5">
+      {{ hint() }}
+    </p>
+  }
+</div>
```

---

### Milestone 3: Extract PageHeader Component

**Files**:
- `src/app/ui/page-header/page-header.component.ts` (new)
- `src/app/ui/page-header/page-header.component.html` (new)

**Flags**: `conformance`

**Requirements**:
- Create reusable PageHeader component
- Support icon, title, subtitle, and optional hero gradient
- Support theme color variants (primary, secondary, success, info)
- Consistent icon wrapper sizing

**Acceptance Criteria**:
- Component renders icon wrapper, title, subtitle
- Gradient background option works
- Color variants apply correctly
- Matches existing header patterns

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: default-derived
- **Scenarios**:
  - Primary color variant
  - Secondary color variant
  - With and without gradient background
  - Dark mode appearance

**Code Intent**:
- New file `page-header.component.ts`: Standalone component
- Signal inputs: `icon: input.required<string>()`, `title: input.required<string>()`, `subtitle: input<string>()`, `variant: input<'primary'|'secondary'|'success'|'info'>('primary')`, `showGradient: input<boolean>(false)`
- New file `page-header.component.html`: Icon wrapper with gradient, title/subtitle typography
- Computed classes for variant color application
- Decision: "Component ensures consistency"

**Code Changes**:

```diff
--- /dev/null
+++ b/src/app/ui/page-header/page-header.component.ts
@@ -0,0 +1,47 @@
+import { Component, input, computed } from '@angular/core';
+
+export type PageHeaderVariant = 'primary' | 'secondary' | 'success' | 'info';
+
+@Component({
+  selector: 'app-page-header',
+  templateUrl: './page-header.component.html',
+  standalone: true,
+})
+export class PageHeaderComponent {
+  icon = input.required<string>();
+  title = input.required<string>();
+  subtitle = input<string>('');
+  variant = input<PageHeaderVariant>('primary');
+  showGradient = input<boolean>(false);
+
+  iconClasses = computed(() => {
+    const baseClasses = [
+      'w-10 h-10 rounded-xl',
+      'flex items-center justify-center',
+      'shadow-lg',
+    ];
+
+    const variantClasses: Record<PageHeaderVariant, string[]> = {
+      primary: [
+        'bg-gradient-to-br from-primary-500 to-primary-600',
+        'shadow-primary-500/20',
+      ],
+      secondary: [
+        'bg-gradient-to-br from-secondary-500 to-secondary-600',
+        'shadow-secondary-500/20',
+      ],
+      success: [
+        'bg-gradient-to-br from-success-500 to-success-600',
+        'shadow-success-500/20',
+      ],
+      info: [
+        'bg-gradient-to-br from-info-500 to-info-600',
+        'shadow-info-500/20',
+      ],
+    };
+
+    return [
+      ...baseClasses,
+      ...(variantClasses[this.variant()] || variantClasses.primary),
+    ].join(' ');
+  });
+}
```

```diff
--- /dev/null
+++ b/src/app/ui/page-header/page-header.component.html
@@ -0,0 +1,12 @@
+<div class="flex items-center gap-3 mb-6">
+  <div [class]="iconClasses()">
+    <i [class]="'pi ' + icon() + ' text-lg text-white'"></i>
+  </div>
+  <div>
+    <h2 class="text-2xl font-bold text-base-content">{{ title() }}</h2>
+    @if (subtitle()) {
+      <p class="text-sm text-base-content/60">
+        {{ subtitle() }}
+      </p>
+    }
+  </div>
+</div>
```

---

### Milestone 4: Extract EmptyState Component

**Files**:
- `src/app/ui/empty-state/empty-state.component.ts` (new)
- `src/app/ui/empty-state/empty-state.component.html` (new)

**Flags**: `conformance`

**Requirements**:
- Create reusable EmptyState component
- Support icon, heading, description, optional action button
- Centered layout with proper spacing
- Based on autogen empty state pattern

**Acceptance Criteria**:
- Component renders centered icon, heading, description
- Optional action slot works
- Matches autogen empty state styling
- Works in light and dark mode

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: default-derived
- **Scenarios**:
  - With all props
  - Without action button
  - Dark mode

**Code Intent**:
- New file `empty-state.component.ts`: Standalone component
- Signal inputs: `icon: input<string>('pi-inbox')`, `heading: input.required<string>()`, `description: input<string>()`
- New file `empty-state.component.html`: Centered flex layout, icon in rounded circle bg, heading, description, ng-content for action
- Decision: "Component provides reusable pattern"

**Code Changes**:

```diff
--- /dev/null
+++ b/src/app/ui/empty-state/empty-state.component.ts
@@ -0,0 +1,13 @@
+import { Component, input } from '@angular/core';
+
+@Component({
+  selector: 'app-empty-state',
+  templateUrl: './empty-state.component.html',
+  standalone: true,
+})
+export class EmptyStateComponent {
+  icon = input<string>('pi-inbox');
+  heading = input.required<string>();
+  description = input<string>('');
+}
```

```diff
--- /dev/null
+++ b/src/app/ui/empty-state/empty-state.component.html
@@ -0,0 +1,15 @@
+<div class="flex flex-col items-center justify-center py-16 px-6">
+  <div class="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
+    <i [class]="'pi ' + icon() + ' text-2xl text-neutral-400'"></i>
+  </div>
+  <h3 class="text-lg font-medium text-base-content mb-1">{{ heading() }}</h3>
+  @if (description()) {
+    <p class="text-sm text-base-content/60 text-center max-w-sm mb-6">
+      {{ description() }}
+    </p>
+  }
+  <div class="mt-4">
+    <ng-content />
+  </div>
+</div>
```

---

### Milestone 5: DPMS Home Page Fixes

**Files**:
- `src/app/dpms/home/home.component.html`
- `src/app/dpms/home/home.component.ts`

**Flags**: `conformance`

**Requirements**:
- Add empty state for when no DPMs exist
- Improve DPM detail modal layout
- Ensure stat cards are responsive
- Verify table hover states

**Acceptance Criteria**:
- Empty state shows when no DPMs
- Modal detail view has clear visual hierarchy
- Stat cards stack properly on mobile
- Table rows have consistent hover

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: user-specified
- **Scenarios**:
  - With DPM data
  - Without DPM data (empty state)
  - Mobile viewport
  - Dark mode
  - Modal open state

**Code Intent**:
- Modify `home.component.html`: Add `@if` check for empty DPMs, render EmptyState component
- Modify `home.component.html`: Update modal body to use better visual hierarchy (cards or sections for detail data)
- Verify stat card responsive classes
- Verify table hover styling consistency

**Code Changes**: (Developer fills after plan approval)

---

### Milestone 6: New DPM Page Fixes

**Files**:
- `src/app/dpms/new-dpm/new-dpm.component.html`
- `src/app/dpms/new-dpm/new-dpm.component.ts`

**Flags**: `conformance`

**Requirements**:
- Update form inputs to use consistent styling
- Improve grid layout for tablet (2 cols on tablet, 3 on desktop)
- Ensure button uses primary color
- Fix any form validation display issues

**Acceptance Criteria**:
- Input styling matches auth pages
- Grid is 1 col mobile, 2 col tablet, 3 col desktop
- Submit button is primary variant
- Validation errors display consistently

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: user-specified
- **Scenarios**:
  - Form default state
  - Form with validation errors
  - Tablet viewport (768px)
  - Mobile viewport (375px)
  - Dark mode

**Code Intent**:
- Modify `new-dpm.component.html`: Update input classes to match login pattern
- Modify `new-dpm.component.html`: Change grid to `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Ensure submit button uses `app-button variant="primary"`
- Standardize error message display

**Code Changes**: (Developer fills after plan approval)

---

### Milestone 7: Edit DPM Types Page Fixes

**Files**:
- `src/app/dpms/edit-dpms/edit-dpms.component.html`
- `src/app/dpms/edit-dpms/edit-dpms.component.ts`
- `src/app/dpms/edit-dpms/edit-dpms.component.css`

**Flags**: `conformance`

**Requirements**:
- Integrate PageHeader component
- Verify drag-drop visual feedback is clear
- Ensure color picker modal styling matches design
- Check sticky save bar on mobile

**Acceptance Criteria**:
- Page header uses PageHeader component
- Drag interactions have clear visual feedback
- Color picker modal follows modal styling standards
- Sticky save bar works on mobile

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: user-specified
- **Scenarios**:
  - Page header appearance
  - Drag interaction feedback
  - Color picker modal
  - Mobile sticky bar
  - Dark mode

**Code Intent**:
- Modify `edit-dpms.component.html`: Replace inline header with PageHeader component
- Verify drag-drop classes for hover/active states
- Update color modal to use gradient header style
- Test sticky positioning on mobile

**Code Changes**: (Developer fills after plan approval)

---

### Milestone 8: Autogen & Datagen Page Fixes

**Files**:
- `src/app/dpms/autogen/autogen.component.html`
- `src/app/dpms/autogen/autogen.component.ts`
- `src/app/dpms/datagen/datagen.component.html`
- `src/app/dpms/datagen/datagen.component.ts`

**Flags**: `conformance`

**Requirements**:
- Integrate PageHeader component on both pages
- Verify autogen empty state (can use as reference)
- Datagen form styling consistency
- Responsive layout verification

**Acceptance Criteria**:
- Both pages use PageHeader component
- Autogen empty state displays correctly
- Datagen form inputs styled consistently
- Both pages responsive

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: user-specified
- **Scenarios**:
  - Page headers
  - Autogen with and without data
  - Datagen form
  - Mobile viewport
  - Dark mode

**Code Intent**:
- Modify `autogen.component.html`: Replace inline header with PageHeader component (variant="secondary")
- Modify `datagen.component.html`: Replace inline header with PageHeader component (variant="info")
- Update datagen form inputs for consistency
- Verify responsive classes

**Code Changes**: (Developer fills after plan approval)

---

### Milestone 9: Approvals Page Fixes

**Files**:
- `src/app/dpms/approvals/approvals.component.html`
- `src/app/dpms/approvals/approvals.component.ts`

**Flags**: `conformance`

**Requirements**:
- Add page header with icon (currently just h2 text)
- Update modal to use gradient header
- Add empty state for no pending approvals
- Improve points edit inline input styling

**Acceptance Criteria**:
- Page has proper header with icon
- Modal has gradient header
- Empty state shows when no approvals
- Points edit input styled consistently

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: user-specified
- **Scenarios**:
  - Page with approvals
  - Page without approvals (empty state)
  - Modal open
  - Points edit mode
  - Dark mode

**Code Intent**:
- Modify `approvals.component.html`: Add PageHeader component (variant="primary" or "warning")
- Update modal headerStyle to 'gradient'
- Add empty state check and render EmptyState component
- Style inline points edit input

**Code Changes**: (Developer fills after plan approval)

---

### Milestone 10: Users List Page Fixes

**Files**:
- `src/app/users/users-list/users-list.component.html`
- `src/app/users/users-list/users-list.component.ts`

**Flags**: `conformance`

**Requirements**:
- Integrate PageHeader component
- Add search icon to search input
- Verify tab navigation accessibility
- Add empty state for search results

**Acceptance Criteria**:
- Page uses PageHeader component
- Search input has icon
- Tabs are keyboard navigable
- Empty search shows appropriate message

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: user-specified
- **Scenarios**:
  - Page header
  - Search with icon
  - Tab navigation
  - Empty search results
  - Mobile viewport
  - Dark mode

**Code Intent**:
- Modify `users-list.component.html`: Replace inline header with PageHeader component (variant="success")
- Add search icon (pi-search) inside search input container
- Verify tab ARIA attributes
- Add empty state for no users found

**Code Changes**: (Developer fills after plan approval)

---

### Milestone 11: User Detail & Form Page Fixes

**Files**:
- `src/app/users/user-detail/user-detail.component.html`
- `src/app/users/user-detail/user-detail.component.ts`
- `src/app/users/user-form/user-form.component.html`
- `src/app/users/user-form/user-form.component.ts`

**Flags**: `conformance`

**Requirements**:
- User Detail: Style action links as buttons
- User Detail: Standardize DPM detail modal
- User Form: Change submit button to primary color (currently secondary)
- User Form: Improve checkbox styling

**Acceptance Criteria**:
- Actions are button styled, not links
- Modal matches other modals
- Submit is primary color
- Checkbox is clearly visible

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: user-specified
- **Scenarios**:
  - User detail view
  - Action buttons
  - DPM detail modal
  - User form
  - Mobile viewport
  - Dark mode

**Code Intent**:
- Modify `user-detail.component.html`: Change action `<a>` links to `<app-button>` components
- Modify `user-detail.component.html`: Update modal detail view to match home page modal
- Modify `user-form.component.html`: Change submit button from `variant="secondary"` to `variant="primary"`
- Modify `user-form.component.html`: Improve checkbox container styling

**Code Changes**: (Developer fills after plan approval)

---

### Milestone 12: Error Pages Fixes

**Files**:
- `src/app/error-pages/error-page/error-page.component.html`
- `src/app/error-pages/error-page/error-page.component.ts`
- `src/app/error-pages/forbidden/forbidden.component.html`
- `src/app/error-pages/not-found/not-found.component.html`

**Flags**: `conformance`

**Requirements**:
- Verify error page component styling
- Ensure consistent layout with design system
- Add appropriate icons
- Check responsive layout

**Acceptance Criteria**:
- Error pages have clear visual hierarchy
- Icons are appropriate (lock for 403, question for 404)
- Layout is centered and responsive
- Links/buttons styled correctly

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: user-specified
- **Scenarios**:
  - 404 page
  - 403 page
  - Mobile viewport
  - Dark mode

**Code Intent**:
- Review and update `error-page.component.html` for consistent styling
- Ensure icons are semantic (pi-lock for 403, pi-question-circle for 404)
- Verify button/link styling uses design system
- Check responsive centering

**Code Changes**: (Developer fills after plan approval)

---

### Milestone 13: Navbar & Global Layout Fixes

**Files**:
- `src/app/ui/navbar/navbar.component.html`
- `src/app/ui/navbar/navbar.component.ts`

**Flags**: `conformance`

**Requirements**:
- Verify mobile menu doesn't get cut off
- Check active link contrast
- Ensure dropdown closes properly
- Verify theme switcher works

**Acceptance Criteria**:
- Mobile menu displays fully
- Active link has sufficient contrast
- Dropdown interactions smooth
- Theme switch toggles correctly

**Tests**:
- **Test type**: Visual validation via Chrome DevTools
- **Backing**: user-specified
- **Scenarios**:
  - Desktop nav
  - Mobile nav expanded
  - Active link states
  - Theme switching
  - Dropdown open/close

**Code Intent**:
- Review mobile menu positioning classes
- Verify active link styling contrast
- Test dropdown behavior
- Verify theme toggle functionality

**Code Changes**: (Developer fills after plan approval)

---

### Milestone 14: Accessibility & Final Polish

**Files**:
- Multiple files touched in previous milestones
- `src/styles.css` (if global fixes needed)

**Flags**: `conformance`

**Requirements**:
- Run WCAG contrast check on all color combinations
- Verify all interactive elements have focus states
- Ensure form inputs have proper ARIA labels
- Test keyboard navigation on all pages

**Acceptance Criteria**:
- All text meets WCAG AA contrast (4.5:1 normal, 3:1 large)
- All buttons/links show focus rings
- Forms have proper labels and error associations
- Tab order is logical on all pages

**Tests**:
- **Test type**: Accessibility audit via DevTools
- **Backing**: user-specified
- **Scenarios**:
  - Contrast check all pages
  - Keyboard navigation all pages
  - Screen reader simulation
  - Focus state verification

**Code Intent**:
- Add missing aria-label attributes where needed
- Fix any contrast issues found
- Ensure focus:ring classes on all interactive elements
- Verify tabindex ordering

**Code Changes**: (Developer fills after plan approval)

---

### Milestone 15: Documentation

**Delegated to**: @agent-technical-writer (mode: post-implementation)

**Source**: `## Invisible Knowledge` section of this plan

**Files**:
- `src/app/ui/CLAUDE.md` (update with new components)
- `src/app/ui/form-field/CLAUDE.md` (new)
- `src/app/ui/page-header/CLAUDE.md` (new)
- `src/app/ui/empty-state/CLAUDE.md` (new)

**Requirements**:
- Update UI component index
- Document new components
- Add usage examples

**Acceptance Criteria**:
- CLAUDE.md files follow tabular format
- New components documented
- Usage patterns clear

## Milestone Dependencies

```
M1 (Auth Pages) -----> M5 (Home) --> M6 (New DPM) --> M9 (Approvals)
                  |                              |
M2 (FormField) ---+---> M6 (New DPM)             +-> M11 (User Form)
                  |
M3 (PageHeader) --+--> M7 (Edit DPM) --> M8 (Autogen/Datagen)
                  |
M4 (EmptyState) --+--> M5 (Home) --> M9 (Approvals) --> M10 (Users List)
                  |
                  +--> M12 (Error Pages)
                  |
                  +--> M13 (Navbar)
                  |
All above --------+--> M14 (Accessibility)
                  |
                  +--> M15 (Documentation)
```

**Parallel Waves:**
- Wave 1: M1, M2, M3, M4 (Auth + Component extraction - can run in parallel)
- Wave 2: M5, M6, M7, M8, M10, M12, M13 (Page fixes using new components)
- Wave 3: M9, M11 (Pages depending on earlier page patterns)
- Wave 4: M14 (Accessibility sweep)
- Wave 5: M15 (Documentation)
