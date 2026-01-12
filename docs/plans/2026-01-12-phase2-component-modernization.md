# Phase 2: Component Modernization - Remove DaisyUI

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Remove DaisyUI dependency and replace with custom Tailwind-based components while maintaining all functionality and visual polish from Phase 1.

**Architecture:** Build minimal custom components for buttons, cards, modals, and navbar using Tailwind utilities and design tokens. Keep PrimeNG for complex components (tables, dropdowns, calendars). Maintain standalone component architecture and signals-based state management.

**Tech Stack:** Angular 21, Tailwind CSS 4, PrimeNG 21, TypeScript 5.7

---

## Overview

Phase 1 established design tokens and visual polish. Phase 2 removes the DaisyUI dependency by:
1. Replacing DaisyUI button classes with custom Tailwind button components
2. Replacing DaisyUI modal with custom modal component
3. Replacing DaisyUI card with custom card component
4. Replacing DaisyUI navbar utilities with custom navbar styles
5. Keeping PrimeNG for tables, forms, dropdowns (already modern)

**Success Criteria:**
- Zero DaisyUI classes remaining in templates
- All Phase 1 visual polish maintained
- All functionality preserved
- Build succeeds with DaisyUI uninstalled
- Bundle size reduced

---

## Task 1: Create Custom Button Component

**Goal:** Build a reusable button component that replaces all DaisyUI button classes (.btn, .btn-primary, .btn-ghost, etc.)

**Files:**
- Create: `src/app/ui/button/button.component.ts`
- Create: `src/app/ui/button/button.component.html`
- Create: `src/app/ui/button/button.types.ts`

### Step 1: Create button types file

**File:** `src/app/ui/button/button.types.ts`

```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonConfig {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
}
```

**Commit:**
```bash
git add src/app/ui/button/button.types.ts
git commit -m "feat(button): add button type definitions"
```

### Step 2: Create button component TypeScript

**File:** `src/app/ui/button/button.component.ts`

```typescript
import { Component, input, computed } from '@angular/core';
import { ButtonVariant, ButtonSize } from './button.types';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: true,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  fullWidth = input<boolean>(false);
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');

  // Compute classes based on inputs
  classes = computed(() => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-md',
      'transition-all duration-[var(--transition-base)]',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    // Variant classes
    const variantClasses = {
      primary: [
        'bg-primary-600 text-white',
        'hover:bg-primary-700 active:bg-primary-800',
        'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
      ],
      secondary: [
        'bg-secondary-600 text-neutral-900',
        'hover:bg-secondary-700 active:bg-secondary-800',
        'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
      ],
      ghost: [
        'bg-transparent text-neutral-700',
        'hover:bg-neutral-100 active:bg-neutral-200',
      ],
      outline: [
        'bg-transparent border-2 border-neutral-300 text-neutral-700',
        'hover:border-neutral-400 hover:bg-neutral-50',
        'active:bg-neutral-100',
      ],
    };

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const classes = [
      ...baseClasses,
      ...(variantClasses[this.variant()] || variantClasses.primary),
      sizeClasses[this.size()] || sizeClasses.md,
    ];

    if (this.fullWidth()) {
      classes.push('w-full');
    }

    return classes.join(' ');
  });
}
```

**Commit:**
```bash
git add src/app/ui/button/button.component.ts
git commit -m "feat(button): create button component with variants and sizes"
```

### Step 3: Create button component template

**File:** `src/app/ui/button/button.component.html`

```html
<button
  [type]="type()"
  [disabled]="disabled()"
  [class]="classes()"
>
  <ng-content></ng-content>
</button>
```

**Commit:**
```bash
git add src/app/ui/button/button.component.html
git commit -m "feat(button): add button component template"
```

### Step 4: Test button component

**Manual Test:**
1. Create a test page or add to an existing component
2. Import ButtonComponent
3. Add test buttons with different variants:

```html
<app-button variant="primary">Primary</app-button>
<app-button variant="secondary">Secondary</app-button>
<app-button variant="ghost">Ghost</app-button>
<app-button variant="outline">Outline</app-button>
<app-button variant="primary" size="sm">Small</app-button>
<app-button variant="primary" size="lg">Large</app-button>
<app-button variant="primary" [disabled]="true">Disabled</app-button>
```

4. Run `npm start` and verify buttons render correctly
5. Verify hover states work
6. Verify disabled state works
7. Verify shadows match Phase 1 button enhancements

**Expected:** All button variants render with Phase 1 design system styles

---

## Task 2: Replace DaisyUI Buttons in Navbar

**Goal:** Replace all DaisyUI button classes in navbar with custom ButtonComponent

**Files:**
- Modify: `src/app/ui/navbar/navbar.component.ts`
- Modify: `src/app/ui/navbar/navbar.component.html`

### Step 1: Import ButtonComponent in navbar

**File:** `src/app/ui/navbar/navbar.component.ts`

Find the imports section (around line 17) and add ButtonComponent:

```typescript
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  imports: [RouterLink, RouterLinkActive, RemoveIfUnauthorizedDirective, ButtonComponent],
})
```

**Commit:**
```bash
git add src/app/ui/navbar/navbar.component.ts
git commit -m "feat(navbar): import custom button component"
```

### Step 2: Replace DaisyUI button classes in navbar template

**File:** `src/app/ui/navbar/navbar.component.html`

Replace the mobile menu button (line 4):
```html
<!-- OLD -->
<span id="menuButton" tabindex="0" class="btn btn-ghost lg:hidden px-2">

<!-- NEW -->
<button id="menuButton" tabindex="0" class="lg:hidden px-2">
  <app-button variant="ghost" size="sm">
```

Replace the close tag after the SVG (line 19):
```html
<!-- OLD -->
</span>

<!-- NEW -->
  </app-button>
</button>
```

Replace the logo/brand button (line 56):
```html
<!-- OLD -->
<button routerLink="/" class="btn btn-ghost normal-case text-2xl font-bold">

<!-- NEW -->
<app-button routerLink="/" variant="ghost" class="text-2xl font-bold normal-case">
```

Replace navigation link buttons in mobile dropdown (lines 32, 45):
```html
<!-- OLD -->
<button
  class="btn btn-ghost font-medium text-base leading-normal px-4 py-2"
  routerLink="{{ link.path }}"
  routerLinkActive="btn-active btn-primary"
>

<!-- NEW -->
<app-button
  variant="ghost"
  [routerLink]="link.path"
  class="w-full font-medium text-base leading-normal"
  [class.bg-primary-600]="routerLinkActive"
  [class.text-white]="routerLinkActive"
>
```

Replace logout button (lines 45-49):
```html
<!-- OLD -->
<button
  class="btn btn-ghost font-semibold text-base leading-normal px-4 py-2"
  (click)="logoutClick()"
>

<!-- NEW -->
<app-button
  variant="ghost"
  class="w-full font-semibold text-base leading-normal"
  (click)="logoutClick()"
>
```

Repeat similar replacements for desktop navigation buttons (lines 66-81).

**Commit:**
```bash
git add src/app/ui/navbar/navbar.component.html
git commit -m "refactor(navbar): replace DaisyUI buttons with custom button component"
```

### Step 3: Test navbar buttons

**Manual Test:**
1. Run `npm start`
2. Open navbar in browser
3. Verify mobile menu button works
4. Verify brand logo button navigates to home
5. Verify all navigation links work
6. Verify active state highlighting works
7. Verify logout button works
8. Test in both light and dark themes

**Expected:** All navbar buttons function identically to before, with Phase 1 styling preserved

---

## Task 3: Create Custom Card Component

**Goal:** Build a reusable card component to replace DaisyUI card classes (.card, .card-body, etc.)

**Files:**
- Create: `src/app/ui/card/card.component.ts`
- Create: `src/app/ui/card/card.component.html`

### Step 1: Create card component TypeScript

**File:** `src/app/ui/card/card.component.ts`

```typescript
import { Component, input, computed } from '@angular/core';

type CardVariant = 'default' | 'elevated' | 'outlined';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  standalone: true,
})
export class CardComponent {
  variant = input<CardVariant>('default');
  padding = input<'sm' | 'md' | 'lg'>('md');
  hover = input<boolean>(false);

  classes = computed(() => {
    const baseClasses = [
      'rounded-lg',
      'transition-all duration-[var(--transition-base)]',
    ];

    // Variant classes
    const variantClasses = {
      default: ['bg-base-100', 'shadow-[var(--shadow-base)]'],
      elevated: ['bg-base-100', 'shadow-[var(--shadow-md)]'],
      outlined: ['bg-base-100', 'border-2 border-neutral-300'],
    };

    // Padding classes
    const paddingClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const classes = [
      ...baseClasses,
      ...(variantClasses[this.variant()] || variantClasses.default),
      paddingClasses[this.padding()] || paddingClasses.md,
    ];

    if (this.hover()) {
      classes.push('hover:shadow-[var(--shadow-lg)]', 'cursor-pointer');
    }

    return classes.join(' ');
  });
}
```

**Commit:**
```bash
git add src/app/ui/card/card.component.ts
git commit -m "feat(card): create card component with variants"
```

### Step 2: Create card component template

**File:** `src/app/ui/card/card.component.html`

```html
<div [class]="classes()">
  <ng-content></ng-content>
</div>
```

**Commit:**
```bash
git add src/app/ui/card/card.component.html
git commit -m "feat(card): add card component template"
```

---

## Task 4: Replace DaisyUI Cards in Edit DPMs

**Goal:** Replace all DaisyUI card classes in edit-dpms component

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.ts`
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.html`

### Step 1: Import CardComponent

**File:** `src/app/dpms/edit-dpms/edit-dpms.component.ts`

Add CardComponent to imports array.

**Commit:**
```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.ts
git commit -m "feat(edit-dpms): import custom card component"
```

### Step 2: Replace card markup in template

**File:** `src/app/dpms/edit-dpms/edit-dpms.component.html`

Find all instances of:
```html
<div class="card bg-base-100 shadow-base hover:shadow-md transition-shadow">
  <div class="card-body p-6">
```

Replace with:
```html
<app-card variant="default" [hover]="true">
```

Remove closing `</div></div>` and replace with:
```html
</app-card>
```

**Commit:**
```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.html
git commit -m "refactor(edit-dpms): replace DaisyUI cards with custom card component"
```

### Step 3: Test card replacement

**Manual Test:**
1. Navigate to edit DPMs page
2. Verify cards render correctly
3. Verify hover shadow effect works
4. Verify internal spacing matches Phase 1
5. Test in both themes

**Expected:** Cards look identical to Phase 1 implementation

---

## Task 5: Create Custom Modal Component

**Goal:** Build a reusable modal component to replace DaisyUI modal classes

**Files:**
- Create: `src/app/ui/modal/modal.component.ts`
- Create: `src/app/ui/modal/modal.component.html`
- Create: `src/app/ui/modal/modal.service.ts`

### Step 1: Create modal component TypeScript

**File:** `src/app/ui/modal/modal.component.ts`

```typescript
import { Component, input, output, effect } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  standalone: true,
  host: {
    '[class.hidden]': '!open()',
    '[class.fixed]': 'true',
    '[class.inset-0]': 'true',
    '[class.z-50]': 'true',
  },
})
export class ModalComponent {
  open = input.required<boolean>();
  title = input<string>('');
  size = input<'sm' | 'md' | 'lg' | 'xl'>('md');

  close = output<void>();

  // Handle escape key
  constructor() {
    effect(() => {
      if (this.open()) {
        document.body.style.overflow = 'hidden';
        const handler = (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            this.close.emit();
          }
        };
        document.addEventListener('keydown', handler);
        return () => {
          document.body.style.overflow = '';
          document.removeEventListener('keydown', handler);
        };
      }
    });
  }

  handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      this.close.emit();
    }
  }

  getSizeClass(): string {
    const sizeClasses = {
      sm: 'max-w-md',
      md: 'max-w-lg',
      lg: 'max-w-2xl',
      xl: 'max-w-4xl',
    };
    return sizeClasses[this.size()] || sizeClasses.md;
  }
}
```

**Commit:**
```bash
git add src/app/ui/modal/modal.component.ts
git commit -m "feat(modal): create modal component with size variants"
```

### Step 2: Create modal component template

**File:** `src/app/ui/modal/modal.component.html`

```html
<!-- Backdrop -->
<div
  class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
  (click)="handleBackdropClick($event)"
></div>

<!-- Modal container -->
<div class="fixed inset-0 flex items-center justify-center p-4">
  <div
    [class]="'relative bg-base-100 rounded-lg shadow-[var(--shadow-xl)] w-full ' + getSizeClass()"
    role="dialog"
    aria-modal="true"
  >
    <!-- Header -->
    @if (title()) {
      <div class="flex items-center justify-between p-6 border-b border-neutral-200">
        <h3 class="text-xl font-semibold">{{ title() }}</h3>
        <button
          type="button"
          class="text-neutral-400 hover:text-neutral-600 transition-colors"
          (click)="close.emit()"
          aria-label="Close modal"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    }

    <!-- Body -->
    <div class="p-6">
      <ng-content></ng-content>
    </div>

    <!-- Footer (optional, projected) -->
    <div class="modal-actions border-t border-neutral-200 p-6">
      <ng-content select="[modal-actions]"></ng-content>
    </div>
  </div>
</div>
```

**Commit:**
```bash
git add src/app/ui/modal/modal.component.html
git commit -m "feat(modal): add modal component template with header and footer"
```

---

## Task 6: Replace DaisyUI Modals

**Goal:** Replace all DaisyUI modal classes with custom ModalComponent

**Files:**
- Modify: `src/app/dpms/home/home.component.ts`
- Modify: `src/app/dpms/home/home.component.html`
- Modify: `src/app/dpms/approvals/approvals.component.ts`
- Modify: `src/app/dpms/approvals/approvals.component.html`
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.ts`
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.html`
- Modify: `src/app/users/user-detail/user-detail.component.ts`
- Modify: `src/app/users/user-detail/user-detail.component.html`
- Modify: `src/app/ui/confirm-box/confirm-box.component.ts`
- Modify: `src/app/ui/confirm-box/confirm-box.component.html`

### Step 1: Replace modal in confirm-box component

**File:** `src/app/ui/confirm-box/confirm-box.component.ts`

Add ModalComponent to imports and convert to use signals for open state.

**File:** `src/app/ui/confirm-box/confirm-box.component.html`

Replace:
```html
<dialog id="confirm-box" class="modal">
  <div class="modal-box relative shadow-xl p-6">
```

With:
```html
<app-modal [open]="isOpen()" [title]="title" size="sm" (close)="cancel()">
```

**Commit:**
```bash
git add src/app/ui/confirm-box/
git commit -m "refactor(confirm-box): replace DaisyUI modal with custom modal component"
```

### Step 2: Repeat for other modal components

Follow same pattern for:
- home.component (DPM detail modal)
- approvals.component (approval detail modal)
- edit-dpms.component (color picker modal)
- user-detail.component (DPM detail modal)

**Commit:**
```bash
git add src/app/dpms/ src/app/users/
git commit -m "refactor(modals): replace all DaisyUI modals with custom modal component"
```

---

## Task 7: Remove DaisyUI Navbar Utilities

**Goal:** Replace remaining DaisyUI navbar classes with custom Tailwind utilities

**Files:**
- Modify: `src/app/ui/navbar/navbar.component.html`

### Step 1: Replace navbar container classes

**File:** `src/app/ui/navbar/navbar.component.html`

Find the navbar container (line 1):
```html
<!-- OLD -->
<div class="navbar bg-base-100 h-16 px-4 md:px-8 lg:px-12">

<!-- NEW -->
<nav class="flex items-center justify-between bg-base-100 h-16 px-4 md:px-8 lg:px-12">
```

Replace `.navbar-start` and `.navbar-end`:
```html
<!-- OLD -->
<div class="navbar-start w-[40%]">
<div class="navbar-end w-[60%] hidden lg:flex">

<!-- NEW -->
<div class="flex items-center w-[40%]">
<div class="flex items-center justify-end w-[60%] hidden lg:flex">
```

**Commit:**
```bash
git add src/app/ui/navbar/navbar.component.html
git commit -m "refactor(navbar): remove DaisyUI navbar utilities"
```

---

## Task 8: Remove DaisyUI Dropdown Classes

**Goal:** Replace DaisyUI dropdown with custom Tailwind implementation

**Files:**
- Modify: `src/app/ui/navbar/navbar.component.html`
- Modify: `src/app/ui/navbar/navbar.component.ts`

### Step 1: Add dropdown state signal

**File:** `src/app/ui/navbar/navbar.component.ts`

```typescript
import { Component, inject, signal } from '@angular/core';

export class NavbarComponent {
  // ... existing code ...

  isMenuOpen = signal(false);

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  closeMenu() {
    this.isMenuOpen.set(false);
  }

  menuItemClick() {
    this.closeMenu();
  }
}
```

**Commit:**
```bash
git add src/app/ui/navbar/navbar.component.ts
git commit -m "feat(navbar): add dropdown state signal"
```

### Step 2: Replace dropdown markup

**File:** `src/app/ui/navbar/navbar.component.html`

Replace dropdown wrapper:
```html
<!-- OLD -->
<div class="dropdown">
  <span id="menuButton" tabindex="0" class="lg:hidden px-2">
  ...
  <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-4 shadow bg-base-100 rounded-box w-52">

<!-- NEW -->
<div class="relative">
  <button id="menuButton" class="lg:hidden px-2" (click)="toggleMenu()">
  ...
  @if (isMenuOpen()) {
    <ul class="absolute left-0 mt-3 p-4 shadow-[var(--shadow-lg)] bg-base-100 rounded-lg w-52">
  }
</div>
```

**Commit:**
```bash
git add src/app/ui/navbar/navbar.component.html
git commit -m "refactor(navbar): replace DaisyUI dropdown with custom implementation"
```

---

## Task 9: Remove DaisyUI Menu Classes

**Goal:** Replace DaisyUI menu classes with custom Tailwind utilities

**Files:**
- Modify: `src/app/ui/navbar/navbar.component.html`

### Step 1: Replace menu classes

Replace:
```html
<!-- OLD -->
<ul class="menu menu-horizontal p-0 gap-2">
  <li>

<!-- NEW -->
<ul class="flex items-center gap-2 p-0">
  <!-- Remove <li> wrappers, keep buttons -->
```

**Commit:**
```bash
git add src/app/ui/navbar/navbar.component.html
git commit -m "refactor(navbar): remove DaisyUI menu classes"
```

---

## Task 10: Update Styles.css - Remove DaisyUI Theme Config

**Goal:** Remove DaisyUI theme configuration and keep only custom design tokens

**Files:**
- Modify: `src/styles.css`

### Step 1: Remove DaisyUI imports

**File:** `src/styles.css`

Remove lines 1-67 (all DaisyUI theme plugin configurations).

Keep:
- Line 70 onwards: DaisyUI imports comment can be removed
- Keep all custom design tokens (typography, shadows, transitions)
- Keep all button/input enhancement styles

**Commit:**
```bash
git add src/styles.css
git commit -m "refactor(styles): remove DaisyUI theme configuration"
```

### Step 2: Add base-100 utility class

Since we use `bg-base-100` for backgrounds, add a simple utility:

```css
/* Base background colors */
.bg-base-100 {
  background-color: oklch(var(--color-neutral-50));
}

:root[data-theme="dark"] .bg-base-100 {
  background-color: oklch(0.20 0.02 324.13);
}
```

**Commit:**
```bash
git add src/styles.css
git commit -m "feat(styles): add base background utility classes"
```

---

## Task 11: Uninstall DaisyUI

**Goal:** Remove DaisyUI from package.json and verify build succeeds

**Files:**
- Modify: `package.json`
- Modify: `tailwind.config.js`

### Step 1: Remove DaisyUI from dependencies

```bash
npm uninstall daisyui
```

**Commit:**
```bash
git add package.json package-lock.json
git commit -m "refactor: remove DaisyUI dependency"
```

### Step 2: Remove DaisyUI from Tailwind config

**File:** `tailwind.config.js`

Remove DaisyUI from plugins array:
```javascript
// OLD
plugins: [require('daisyui')],

// NEW
plugins: [],
```

**Commit:**
```bash
git add tailwind.config.js
git commit -m "refactor(tailwind): remove DaisyUI plugin"
```

### Step 3: Build verification

```bash
npm run build
```

**Expected:** Build succeeds with no errors. Bundle size should be reduced.

**Commit:**
```bash
# If any fixes needed, commit them
git commit -m "fix: resolve build issues after DaisyUI removal"
```

---

## Task 12: Final Testing and Verification

**Goal:** Comprehensive manual testing to ensure all functionality preserved

**Files:**
- Modify: `claude.md` (add Phase 2 completion documentation)

### Step 1: Manual testing checklist

Test all components:
- [ ] Navbar: All buttons work, dropdown works, routing works
- [ ] Buttons: All variants render, hover states work, disabled state works
- [ ] Cards: Render correctly, hover effects work
- [ ] Modals: Open/close works, backdrop click closes, escape key closes
- [ ] Forms: PrimeNG inputs still work, focus states preserved
- [ ] Tables: PrimeNG tables still work, styling preserved
- [ ] Theme switching: All components work in both themes

### Step 2: Visual regression check

Compare with Phase 1:
- [ ] Button shadows match Phase 1
- [ ] Card shadows match Phase 1
- [ ] Modal shadows match Phase 1
- [ ] Typography consistent throughout
- [ ] Spacing consistent throughout
- [ ] Responsive behavior matches Phase 1

### Step 3: Build and bundle size verification

```bash
npm run build
```

Check output for:
- Build success (no errors)
- Bundle size (should be smaller than Phase 1)
- No DaisyUI references in bundle

### Step 4: Update documentation

**File:** `claude.md`

Add Phase 2 completion section:

```markdown
## Phase 2: Component Modernization (Completed)

**Completed**: 2026-01-12
**Commits**: [first commit] - [last commit]
**Branch**: `trusting-villani`

### Summary

Phase 2 removed the DaisyUI dependency and replaced it with custom Tailwind-based components while maintaining all Phase 1 visual polish and functionality.

### Components Created

1. **ButtonComponent**: Custom button with variants (primary, secondary, ghost, outline)
2. **CardComponent**: Custom card with elevation variants
3. **ModalComponent**: Custom modal with size variants and accessibility features

### Components Updated

1. Navbar: Replaced DaisyUI navbar/dropdown/menu with custom implementation
2. All button usages: Migrated to custom ButtonComponent
3. All card usages: Migrated to custom CardComponent
4. All modal usages: Migrated to custom ModalComponent

### Bundle Size Improvement

- Before: [size] MB
- After: [size] MB
- Reduction: [size] MB / [percent]%

### DaisyUI Classes Removed

- `.btn` variants (btn-primary, btn-ghost, btn-outline, etc.)
- `.card` and `.card-body`
- `.modal`, `.modal-box`, `.modal-backdrop`
- `.navbar`, `.navbar-start`, `.navbar-end`
- `.dropdown`, `.dropdown-content`
- `.menu`, `.menu-horizontal`, `.menu-compact`

### Dependencies Removed

- `daisyui@5.x`

### Next Steps

Phase 3: Performance Optimization and Testing
- Add comprehensive unit tests for new components
- Add E2E tests for critical user flows
- Optimize bundle size further
- Add component documentation
```

**Commit:**
```bash
git add claude.md
git commit -m "docs: complete Phase 2 component modernization"
```

---

## Success Criteria

Phase 2 is complete when:

1. ✅ Zero DaisyUI classes remain in HTML templates
2. ✅ DaisyUI is uninstalled from package.json
3. ✅ All Phase 1 visual polish is maintained
4. ✅ All functionality works identically to before
5. ✅ Build succeeds with no errors
6. ✅ Bundle size is reduced
7. ✅ Manual testing passes all checks
8. ✅ Both light and dark themes work correctly
9. ✅ Documentation is updated

---

## Rollback Plan

If issues arise:

1. Revert to Phase 1 completion commit: `git reset --hard 1fa609c`
2. DaisyUI can be reinstalled: `npm install daisyui@5`
3. All Phase 1 work is preserved in git history

---

## Notes

- Keep PrimeNG: It's already modern, has good Angular 21 support, and handles complex components well
- Maintain signals: Use Angular signals for all component state
- Preserve Phase 1: All design tokens, shadows, transitions stay intact
- Incremental testing: Test after each component replacement
- Commit frequently: Small, focused commits for easy debugging
