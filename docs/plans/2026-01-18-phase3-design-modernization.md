# Phase 3: Design Modernization Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform UTS DPM from a flat, generic interface (4/10) to a modern, vibrant application (8/10) by applying gradient-first design, semantic color coding, and glassmorphism patterns from the design-preview page.

**Architecture:** Incremental migration starting with global UI components (Button, Badge, Avatar, StatCard), then updating the Navbar, followed by page-level changes (Home hero, Tables, Forms, Modals). Each component is standalone with signal-based inputs. Changes leverage existing design tokens (100+ CSS variables) that are currently underutilized.

**Tech Stack:** Angular 21, Tailwind CSS, OKLCH color space design tokens, Angular Signals

---

## Phase Overview

| Phase | Components | Impact | Priority |
|-------|------------|--------|----------|
| 3.1 | Badge, Avatar, StatCard | New components | High |
| 3.2 | Button gradient variants | Global buttons | High |
| 3.3 | Navbar modernization | Global navigation | High |
| 3.4 | Home hero section | Dashboard entry | Medium |
| 3.5 | Table styling | Data presentation | Medium |
| 3.6 | Form styling | Input experience | Medium |
| 3.7 | Modal & Toast updates | Feedback systems | Low |

---

## Phase 3.1: New UI Components

### Task 1: Create Badge Component Types

**Files:**
- Create: `src/app/ui/badge/badge.types.ts`

**Step 1: Create the types file**

```typescript
export type BadgeVariant = 'success' | 'error' | 'warning' | 'info' | 'neutral' | 'primary' | 'secondary';
export type BadgeSize = 'sm' | 'md' | 'lg';
```

**Step 2: Commit**

```bash
git add src/app/ui/badge/badge.types.ts
git commit -m "feat(badge): add badge component types"
```

---

### Task 2: Create Badge Component

**Files:**
- Create: `src/app/ui/badge/badge.component.ts`
- Create: `src/app/ui/badge/badge.component.html`

**Step 1: Create the component class**

```typescript
import { Component, input, computed } from '@angular/core';
import { BadgeVariant, BadgeSize } from './badge.types';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  standalone: true,
})
export class BadgeComponent {
  variant = input<BadgeVariant>('neutral');
  size = input<BadgeSize>('md');
  showIcon = input<boolean>(false);
  pill = input<boolean>(true);

  classes = computed(() => {
    const baseClasses = [
      'inline-flex items-center gap-1 font-medium',
      this.pill() ? 'rounded-full' : 'rounded-md',
    ];

    const variantClasses: Record<BadgeVariant, string[]> = {
      success: [
        'bg-success-50 text-success-700 border border-success-200',
        'dark:bg-success-900/30 dark:text-success-400 dark:border-success-800',
      ],
      error: [
        'bg-error-50 text-error-700 border border-error-200',
        'dark:bg-error-900/30 dark:text-error-400 dark:border-error-800',
      ],
      warning: [
        'bg-warning-50 text-warning-700 border border-warning-200',
        'dark:bg-warning-900/30 dark:text-warning-400 dark:border-warning-800',
      ],
      info: [
        'bg-info-50 text-info-700 border border-info-200',
        'dark:bg-info-900/30 dark:text-info-400 dark:border-info-800',
      ],
      neutral: [
        'bg-neutral-100 text-neutral-700 border border-neutral-200',
        'dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
      ],
      primary: [
        'bg-primary-50 text-primary-700 border border-primary-200',
        'dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800',
      ],
      secondary: [
        'bg-secondary-50 text-secondary-700 border border-secondary-200',
        'dark:bg-secondary-900/30 dark:text-secondary-400 dark:border-secondary-800',
      ],
    };

    const sizeClasses: Record<BadgeSize, string> = {
      sm: 'px-1.5 py-0.5 text-xs',
      md: 'px-2 py-0.5 text-xs',
      lg: 'px-2.5 py-1 text-sm',
    };

    return [
      ...baseClasses,
      ...variantClasses[this.variant()],
      sizeClasses[this.size()],
    ].join(' ');
  });

  iconPath = computed(() => {
    const icons: Record<BadgeVariant, string> = {
      success: 'M5 13l4 4L19 7', // checkmark
      error: 'M6 18L18 6M6 6l12 12', // x
      warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', // warning triangle
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // info circle
      neutral: '',
      primary: '',
      secondary: '',
    };
    return icons[this.variant()];
  });
}
```

**Step 2: Create the template**

```html
<span [class]="classes()">
  @if (showIcon() && iconPath()) {
    <svg
      class="w-3 h-3"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path [attr.d]="iconPath()"></path>
    </svg>
  }
  <ng-content></ng-content>
</span>
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 4: Commit**

```bash
git add src/app/ui/badge/
git commit -m "feat(badge): create badge component with variants and sizes"
```

---

### Task 3: Create Avatar Component

**Files:**
- Create: `src/app/ui/avatar/avatar.types.ts`
- Create: `src/app/ui/avatar/avatar.component.ts`
- Create: `src/app/ui/avatar/avatar.component.html`

**Step 1: Create types**

```typescript
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarVariant = 'primary' | 'secondary' | 'success' | 'error' | 'neutral';
```

**Step 2: Create component class**

```typescript
import { Component, input, computed } from '@angular/core';
import { AvatarSize, AvatarVariant } from './avatar.types';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  standalone: true,
})
export class AvatarComponent {
  name = input<string>('');
  imageUrl = input<string>('');
  size = input<AvatarSize>('md');
  variant = input<AvatarVariant>('primary');

  initials = computed(() => {
    const n = this.name();
    if (!n) return '?';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  });

  containerClasses = computed(() => {
    const sizeClasses: Record<AvatarSize, string> = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
    };

    const variantClasses: Record<AvatarVariant, string> = {
      primary: 'bg-gradient-to-br from-primary-400 to-primary-600',
      secondary: 'bg-gradient-to-br from-secondary-400 to-secondary-600',
      success: 'bg-gradient-to-br from-success-400 to-success-600',
      error: 'bg-gradient-to-br from-error-400 to-error-600',
      neutral: 'bg-gradient-to-br from-neutral-400 to-neutral-600',
    };

    return [
      'rounded-full flex items-center justify-center font-semibold text-white shadow-sm overflow-hidden',
      sizeClasses[this.size()],
      variantClasses[this.variant()],
    ].join(' ');
  });
}
```

**Step 3: Create template**

```html
<div [class]="containerClasses()">
  @if (imageUrl()) {
    <img
      [src]="imageUrl()"
      [alt]="name()"
      class="w-full h-full object-cover"
    />
  } @else {
    <span>{{ initials() }}</span>
  }
</div>
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 5: Commit**

```bash
git add src/app/ui/avatar/
git commit -m "feat(avatar): create avatar component with gradient variants"
```

---

### Task 4: Create StatCard Component

**Files:**
- Create: `src/app/ui/stat-card/stat-card.types.ts`
- Create: `src/app/ui/stat-card/stat-card.component.ts`
- Create: `src/app/ui/stat-card/stat-card.component.html`

**Step 1: Create types**

```typescript
export type StatCardVariant = 'default' | 'success' | 'error' | 'warning' | 'info';
```

**Step 2: Create component class**

```typescript
import { Component, input, computed } from '@angular/core';
import { StatCardVariant } from './stat-card.types';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  standalone: true,
})
export class StatCardComponent {
  title = input.required<string>();
  value = input.required<string | number>();
  subtitle = input<string>('');
  variant = input<StatCardVariant>('default');
  icon = input<string>('');

  containerClasses = computed(() => {
    const baseClasses = 'p-4 rounded-lg backdrop-blur border';

    const variantClasses: Record<StatCardVariant, string> = {
      default: 'bg-white/10 border-white/20',
      success: 'bg-success-500/20 border-success-400/30',
      error: 'bg-error-500/20 border-error-400/30',
      warning: 'bg-warning-500/20 border-warning-400/30',
      info: 'bg-info-500/20 border-info-400/30',
    };

    return `${baseClasses} ${variantClasses[this.variant()]}`;
  });

  titleClasses = computed(() => {
    const variantClasses: Record<StatCardVariant, string> = {
      default: 'text-white/60',
      success: 'text-success-200',
      error: 'text-error-200',
      warning: 'text-warning-200',
      info: 'text-info-200',
    };
    return `text-xs uppercase tracking-wide ${variantClasses[this.variant()]}`;
  });

  valueClasses = computed(() => {
    const variantClasses: Record<StatCardVariant, string> = {
      default: 'text-white',
      success: 'text-success-300',
      error: 'text-error-300',
      warning: 'text-warning-300',
      info: 'text-info-300',
    };
    return `text-2xl font-bold mt-1 ${variantClasses[this.variant()]}`;
  });
}
```

**Step 3: Create template**

```html
<div [class]="containerClasses()">
  <p [class]="titleClasses()">{{ title() }}</p>
  <p [class]="valueClasses()">{{ value() }}</p>
  @if (subtitle()) {
    <p class="text-xs text-white/40 mt-1">{{ subtitle() }}</p>
  }
</div>
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 5: Commit**

```bash
git add src/app/ui/stat-card/
git commit -m "feat(stat-card): create stat card component for hero sections"
```

---

## Phase 3.2: Button Gradient Variants

### Task 5: Update Button Component with Gradient Support

**Files:**
- Modify: `src/app/ui/button/button.types.ts`
- Modify: `src/app/ui/button/button.component.ts`

**Step 1: Update button types to add new variants**

In `src/app/ui/button/button.types.ts`, replace content:

```typescript
export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'success' | 'error';
export type ButtonSize = 'sm' | 'md' | 'lg';
```

**Step 2: Update button component with gradient styles**

In `src/app/ui/button/button.component.ts`, update the `variantClasses` object inside `classes` computed:

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
  id = input<string>();
  tabindex = input<number>();

  classes = computed(() => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-semibold rounded-lg',
      'cursor-pointer',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const variantClasses: Record<ButtonVariant, string[]> = {
      primary: [
        'bg-gradient-to-r from-primary-600 to-primary-500 text-white',
        'hover:from-primary-700 hover:to-primary-600',
        'shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30',
        'focus:ring-primary-500',
      ],
      secondary: [
        'bg-base-100 text-primary-600 border-2 border-primary-200',
        'hover:bg-primary-50 dark:hover:bg-primary-900/20',
        'dark:border-primary-800 dark:text-primary-400',
        'focus:ring-primary-500',
      ],
      ghost: [
        'bg-transparent text-base-content',
        'hover:bg-base-200 dark:hover:bg-neutral-800',
        'focus:ring-neutral-500',
      ],
      outline: [
        'bg-transparent border-2 border-neutral-300 text-neutral-700',
        'hover:border-neutral-400 hover:bg-neutral-50',
        'dark:border-neutral-600 dark:text-neutral-200 dark:hover:bg-neutral-800',
        'focus:ring-neutral-500',
      ],
      success: [
        'bg-gradient-to-r from-success-600 to-success-500 text-white',
        'hover:from-success-700 hover:to-success-600',
        'shadow-md shadow-success-500/25 hover:shadow-lg hover:shadow-success-500/30',
        'focus:ring-success-500',
      ],
      error: [
        'bg-gradient-to-r from-error-600 to-error-500 text-white',
        'hover:from-error-700 hover:to-error-600',
        'shadow-md shadow-error-500/25 hover:shadow-lg hover:shadow-error-500/30',
        'focus:ring-error-500',
      ],
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
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

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 4: Commit**

```bash
git add src/app/ui/button/
git commit -m "feat(button): add gradient variants and colored shadows"
```

---

## Phase 3.3: Navbar Modernization

### Task 6: Update Navbar with Gradient Background

**Files:**
- Modify: `src/app/ui/navbar/navbar.component.html`

**Step 1: Update navbar template**

Replace the entire content of `src/app/ui/navbar/navbar.component.html`:

```html
<nav
  class="sticky top-0 z-40 bg-gradient-to-r from-primary-600 to-primary-500 shadow-lg shadow-primary-500/20"
>
  <div class="flex items-center justify-between h-16 px-4 md:px-8 lg:px-12">
    <!-- Left side: Mobile menu + Logo -->
    <div class="flex items-center gap-3">
      <!-- Mobile menu button -->
      <div class="relative lg:hidden">
        <button
          type="button"
          id="menuButton"
          [tabindex]="0"
          (click)="toggleDropdown()"
          class="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            @if (!isDropdownOpen()) {
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            }
            @if (isDropdownOpen()) {
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            }
          </svg>
        </button>

        <!-- Mobile dropdown menu -->
        @if (isDropdownOpen()) {
          <div
            class="absolute left-0 top-full mt-2 w-56 rounded-xl bg-primary-700/95 backdrop-blur-lg border border-white/20 shadow-xl overflow-hidden"
          >
            <div class="py-2">
              @for (link of links; track link) {
                <div [appRemoveIfUnauthorized]="link.allowedRoles">
                  @if (link.path) {
                    <a
                      routerLink="{{ link.path }}"
                      routerLinkActive="bg-white text-primary-600 font-semibold"
                      [queryParamsHandling]="link.name === 'Users' ? 'preserve' : null"
                      (click)="menuItemClick()"
                      class="block px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {{ link.name }}
                    </a>
                  }
                  @if (!link.path) {
                    <div class="border-t border-white/20 mt-2 pt-2">
                      <button
                        type="button"
                        (click)="logoutClick(); menuItemClick()"
                        class="block w-full text-left px-4 py-3 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        {{ link.name }}
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Logo / Home button -->
      <a
        routerLink="/"
        class="flex items-center gap-2 px-3 py-1.5 rounded-lg text-white font-bold text-xl hover:bg-white/10 transition-colors"
      >
        <div class="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 4h8a4 4 0 014 4v8a2 2 0 01-2 2h-1l-1 2H8l-1-2H6a2 2 0 01-2-2V8a4 4 0 014-4z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M6 12h12M8 8h.01M16 8h.01M8 16h.01M16 16h.01"
            />
          </svg>
        </div>
        <span class="hidden sm:inline">UTS DPM</span>
      </a>
    </div>

    <!-- Desktop nav links -->
    <div class="hidden lg:flex items-center gap-1">
      @for (link of links; track link) {
        <div [appRemoveIfUnauthorized]="link.allowedRoles">
          @if (link.path) {
            <a
              routerLink="{{ link.path }}"
              routerLinkActive="bg-white text-primary-600 shadow-sm"
              [routerLinkActiveOptions]="{ exact: link.path === '/' }"
              [queryParamsHandling]="link.name === 'Users' ? 'preserve' : null"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
            >
              {{ link.name }}
            </a>
          }
          @if (!link.path) {
            <button
              type="button"
              (click)="logoutClick()"
              class="ml-2 px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
            >
              {{ link.name }}
            </button>
          }
        </div>
      }
    </div>
  </div>
</nav>
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add src/app/ui/navbar/
git commit -m "feat(navbar): modernize with gradient background and glassmorphism"
```

---

## Phase 3.4: Home Page Hero Section

### Task 7: Update Home Component with Hero Stats

**Files:**
- Modify: `src/app/dpms/home/home.component.ts`
- Modify: `src/app/dpms/home/home.component.html`

**Step 1: Update home component to import new UI components and add computed stats**

In `src/app/dpms/home/home.component.ts`, add the imports and computed properties:

```typescript
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DpmService } from '../../services/dpm.service';
import { ModalComponent } from '../../ui/modal/modal.component';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { StatCardComponent } from '../../ui/stat-card/stat-card.component';
import { PointsPipe } from '../../shared/pipes/points.pipe';
import { BlockPipe } from '../../shared/pipes/block.pipe';
import { TableModule } from 'primeng/table';
import { HomeDpmDto } from '../../models/home-dpm-dto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    ModalComponent,
    LoadingComponent,
    StatCardComponent,
    PointsPipe,
    BlockPipe,
    TableModule,
  ],
})
export class HomeComponent {
  private dpmService = inject(DpmService);

  currentDpms = toSignal(this.dpmService.findCurrentDpms());
  currentDpm = signal<HomeDpmDto | null>(null);
  isModalOpen = signal(false);

  // Computed stats for hero section
  totalCount = computed(() => this.currentDpms()?.length ?? 0);

  positivePoints = computed(() => {
    const dpms = this.currentDpms();
    if (!dpms) return 0;
    return dpms
      .filter((d) => d.points > 0)
      .reduce((sum, d) => sum + d.points, 0);
  });

  negativePoints = computed(() => {
    const dpms = this.currentDpms();
    if (!dpms) return 0;
    return dpms
      .filter((d) => d.points < 0)
      .reduce((sum, d) => sum + d.points, 0);
  });

  clickRow(dpm: HomeDpmDto) {
    this.currentDpm.set(dpm);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
```

**Step 2: Update home template with hero section**

Replace the content of `src/app/dpms/home/home.component.html`:

```html
<!-- DPM Detail Modal -->
<app-modal [open]="isModalOpen()" [size]="'md'" (close)="closeModal()">
  @if (currentDpm(); as currentDpm) {
    <ng-container modal-header>
      <h3 class="text-xl font-semibold text-base-content">
        {{ currentDpm.type }}
      </h3>
    </ng-container>
    <ng-container modal-body>
      <div class="space-y-3">
        <div
          class="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700"
        >
          <span class="font-medium text-base-content">Points:</span>
          <span class="text-base-content">{{
            currentDpm.points | points
          }}</span>
        </div>
        <div
          class="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700"
        >
          <span class="font-medium text-base-content">Block:</span>
          <span class="text-base-content">{{ currentDpm.block | block }}</span>
        </div>
        <div
          class="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700"
        >
          <span class="font-medium text-base-content">Location:</span>
          <span class="text-base-content">{{
            currentDpm.location | uppercase
          }}</span>
        </div>
        <div
          class="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700"
        >
          <span class="font-medium text-base-content">Date:</span>
          <span class="text-base-content">{{ currentDpm.date }}</span>
        </div>
        <div
          class="flex justify-between py-2 border-b border-neutral-200 dark:border-neutral-700"
        >
          <span class="font-medium text-base-content">Time:</span>
          <span class="text-base-content">{{ currentDpm.time }}</span>
        </div>
        @if (currentDpm.notes) {
          <div class="flex justify-between py-2">
            <span class="font-medium text-base-content">Notes:</span>
            <span class="text-base-content text-right">{{
              currentDpm.notes
            }}</span>
          </div>
        }
      </div>
    </ng-container>
  }
</app-modal>

<ng-template #loading>
  <app-loading></app-loading>
</ng-template>

@if (currentDpms(); as dpms) {
  <div class="px-4 py-6 md:px-6 md:py-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- Hero Section -->
      <section class="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold text-white">Performance Overview</h1>
            <p class="text-sm text-white/70">Your current DPM summary</p>
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <app-stat-card
            title="Total DPMs"
            [value]="totalCount()"
            variant="default"
          />
          <app-stat-card
            title="Positive Points"
            [value]="'+' + positivePoints()"
            variant="success"
          />
          <app-stat-card
            title="Negative Points"
            [value]="negativePoints()"
            variant="error"
          />
        </div>
      </section>

      <!-- Table Section -->
      <section>
        <h2 class="text-xl font-semibold text-base-content mb-4">Current DPMs</h2>

        <div
          class="bg-base-200 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm overflow-hidden"
        >
          <p-table
            #dt
            [value]="dpms"
            dataKey="id"
            styleClass="w-full"
            [rowHover]="true"
            [rows]="10"
            [showCurrentPageReport]="true"
            [rowsPerPageOptions]="[10, 25, 50]"
            [loading]="false"
            responsiveLayout="scroll"
            [paginator]="true"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
          >
            <ng-template pTemplate="header">
              <tr class="bg-gradient-to-r from-primary-600 to-primary-500">
                <th
                  class="px-6 py-4 text-left text-sm font-semibold text-white"
                >
                  Type
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-semibold text-white"
                >
                  Points
                </th>
                <th
                  class="px-6 py-4 text-left text-sm font-semibold text-white"
                >
                  Date
                </th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-dpm>
              <tr
                class="border-t border-neutral-200 dark:border-neutral-700 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors duration-150 cursor-pointer"
                (click)="clickRow(dpm)"
              >
                <td class="px-6 py-4 text-sm text-base-content">
                  {{ dpm.type }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <span
                    [class]="dpm.points >= 0
                      ? 'px-2 py-1 rounded-full text-xs font-bold bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                      : 'px-2 py-1 rounded-full text-xs font-bold bg-error-50 text-error-700 dark:bg-error-900/30 dark:text-error-400'"
                  >
                    {{ dpm.points | points }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-base-content/70">
                  {{ dpm.date }}
                </td>
              </tr>
            </ng-template>
            <ng-template pTemplate="emptymessage">
              <tr>
                <td
                  colspan="3"
                  class="px-6 py-8 text-center text-base-content/60"
                >
                  No DPMs found.
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </section>
    </div>
  </div>
} @else {
  <app-loading></app-loading>
}
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 4: Commit**

```bash
git add src/app/dpms/home/
git commit -m "feat(home): add hero section with stat cards and gradient table headers"
```

---

## Phase 3.5: Update Approvals Page

### Task 8: Modernize Approvals Table and Modal

**Files:**
- Modify: `src/app/dpms/approvals/approvals.component.ts`
- Modify: `src/app/dpms/approvals/approvals.component.html`

**Step 1: Update imports in approvals component**

Add BadgeComponent and AvatarComponent imports to `src/app/dpms/approvals/approvals.component.ts`:

```typescript
// Add to imports array:
import { BadgeComponent } from '../../ui/badge/badge.component';
import { AvatarComponent } from '../../ui/avatar/avatar.component';

// Update @Component imports:
imports: [
  // ... existing imports
  BadgeComponent,
  AvatarComponent,
],
```

**Step 2: Update approvals template with modern styling**

Key changes to `src/app/dpms/approvals/approvals.component.html`:

1. Update table header to use gradient:
```html
<ng-template pTemplate="header">
  <tr class="bg-gradient-to-r from-primary-600 to-primary-500">
    <th class="px-6 py-4 text-left text-sm font-semibold text-white">Driver</th>
    <th class="px-6 py-4 text-left text-sm font-semibold text-white">Block/Time</th>
    <th class="px-6 py-4 text-left text-sm font-semibold text-white">Type</th>
  </tr>
</ng-template>
```

2. Update table body with avatars:
```html
<ng-template pTemplate="body" let-dpm>
  <tr
    class="border-t border-neutral-200 dark:border-neutral-700 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors duration-150 cursor-pointer"
    (click)="showApprovalModal(dpm)"
  >
    <td class="px-6 py-4">
      <div class="flex items-center gap-3">
        <app-avatar [name]="dpm.driver" size="sm" variant="primary" />
        <span class="text-sm font-medium text-base-content">{{ dpm.driver }}</span>
      </div>
    </td>
    <td class="px-6 py-4 text-sm text-base-content/70">
      {{ dpm.block | block }} {{ dpm.time }}
    </td>
    <td class="px-6 py-4 text-sm text-base-content">
      {{ dpm.type }}
    </td>
  </tr>
</ng-template>
```

3. Update modal footer buttons to use new variants:
```html
<ng-container modal-footer>
  <div class="flex justify-end gap-2">
    <app-button variant="success" (click)="approveDpm()">
      Approve
    </app-button>
    <app-button variant="error" (click)="denyDpm()">
      Deny
    </app-button>
    <app-button variant="ghost" (click)="showEdit($event)">
      Edit
    </app-button>
  </div>
</ng-container>
```

**Step 3: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 4: Commit**

```bash
git add src/app/dpms/approvals/
git commit -m "feat(approvals): modernize with avatars, badges, and gradient headers"
```

---

## Phase 3.6: Update Login Page

### Task 9: Modernize Login Form

**Files:**
- Modify: `src/app/auth/login/login.component.html`

**Step 1: Update login template with gradient button and improved styling**

Replace the content of `src/app/auth/login/login.component.html`:

```html
<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-base-100 to-base-200 px-4">
  <div class="w-full max-w-md">
    <!-- Logo/Branding Section -->
    <div class="text-center mb-8">
      <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 4h8a4 4 0 014 4v8a2 2 0 01-2 2h-1l-1 2H8l-1-2H6a2 2 0 01-2-2V8a4 4 0 014-4z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 12h12M8 8h.01M16 8h.01M8 16h.01M16 16h.01" />
        </svg>
      </div>
      <h1 class="text-3xl font-bold text-base-content">UTS DPM</h1>
      <p class="text-sm text-base-content/60 mt-1">Departmental Performance Management</p>
    </div>

    <!-- Login Form -->
    <div
      class="bg-base-100 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-8 shadow-xl"
    >
      <h2 class="text-xl font-semibold text-base-content mb-6">Sign in to your account</h2>

      <form
        class="space-y-5"
        [formGroup]="loginFormGroup"
        (ngSubmit)="onSubmit()"
      >
        <div class="space-y-2">
          <label
            for="username"
            class="block text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide"
          >
            Username
          </label>
          <input
            id="username"
            type="email"
            class="w-full px-4 py-3 rounded-lg bg-base-200 border text-base-content placeholder:text-base-content/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
            [ngClass]="{
              'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20 focus:bg-primary-50/50 dark:focus:bg-primary-900/10':
                !(hasErrors(username) || badCredentials()),
              'border-error-500 focus:border-error-500 focus:ring-error-500/20 bg-error-50/50 dark:bg-error-900/10':
                hasErrors(username) || badCredentials(),
            }"
            placeholder="Enter your username"
            formControlName="username"
            (input)="onUserInput()"
          />
          @if (getUsernameValidationMessages()) {
            <p class="text-sm text-error-600 font-medium mt-1.5">
              {{ getUsernameValidationMessages() }}
            </p>
          }
        </div>

        <div class="space-y-2">
          <label
            for="password"
            class="block text-xs font-medium text-primary-600 dark:text-primary-400 uppercase tracking-wide"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            class="w-full px-4 py-3 rounded-lg bg-base-200 border text-base-content placeholder:text-base-content/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0"
            [ngClass]="{
              'border-neutral-200 dark:border-neutral-700 focus:border-primary-500 focus:ring-primary-500/20 focus:bg-primary-50/50 dark:focus:bg-primary-900/10':
                !(hasErrors(password) || badCredentials()),
              'border-error-500 focus:border-error-500 focus:ring-error-500/20 bg-error-50/50 dark:bg-error-900/10':
                hasErrors(password) || badCredentials(),
            }"
            placeholder="Enter your password"
            formControlName="password"
            (input)="onUserInput()"
          />
          @if (getPasswordValidationMessages()) {
            <p class="text-sm text-error-600 font-medium mt-1.5">
              {{ getPasswordValidationMessages() }}
            </p>
          }
        </div>

        <button
          id="submitButton"
          type="submit"
          class="w-full mt-6 px-6 py-3.5 bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold rounded-lg shadow-lg shadow-primary-500/25 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-base-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:from-primary-700 hover:to-primary-600 hover:shadow-xl hover:shadow-primary-500/30 active:scale-[0.98]"
          [disabled]="!loginFormGroup.valid || loading()"
        >
          @if (loading()) {
            <span class="inline-flex items-center gap-2">
              <svg
                class="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Signing in...
            </span>
          } @else {
            Sign In
          }
        </button>
      </form>
    </div>
  </div>
</div>
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add src/app/auth/login/
git commit -m "feat(login): modernize with gradient branding and improved form styling"
```

---

## Phase 3.7: Update Modal Component

### Task 10: Add Gradient Header Option to Modal

**Files:**
- Modify: `src/app/ui/modal/modal.types.ts`
- Modify: `src/app/ui/modal/modal.component.ts`
- Modify: `src/app/ui/modal/modal.component.html`

**Step 1: Update modal types**

In `src/app/ui/modal/modal.types.ts`, add:

```typescript
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';
export type ModalHeaderStyle = 'default' | 'gradient';
```

**Step 2: Update modal component**

In `src/app/ui/modal/modal.component.ts`, add:

```typescript
import { ModalSize, ModalHeaderStyle } from './modal.types';

// Add input:
headerStyle = input<ModalHeaderStyle>('default');
```

**Step 3: Update modal template**

In `src/app/ui/modal/modal.component.html`, update the header section:

```html
<!-- Header -->
@if (hasHeader) {
  <div
    [class]="headerStyle() === 'gradient'
      ? 'px-6 py-4 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-t-xl'
      : 'px-6 py-4 border-b border-neutral-200 dark:border-neutral-700'"
  >
    <ng-content select="[modal-header]"></ng-content>
  </div>
}
```

**Step 4: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 5: Commit**

```bash
git add src/app/ui/modal/
git commit -m "feat(modal): add gradient header style option"
```

---

## Phase 3.8: Global Style Updates

### Task 11: Update Global PrimeNG Table Styles

**Files:**
- Modify: `src/styles.css`

**Step 1: Add PrimeNG table overrides**

Add to the end of `src/styles.css`:

```css
/* PrimeNG Table Modernization */
.p-datatable .p-datatable-thead > tr > th {
  background: transparent !important;
  border: none !important;
}

.p-datatable .p-datatable-tbody > tr {
  background: transparent !important;
}

.p-datatable .p-datatable-tbody > tr:hover {
  background: oklch(0.95 0.02 var(--primary-hue)) !important;
}

[data-theme="dark"] .p-datatable .p-datatable-tbody > tr:hover {
  background: oklch(0.25 0.02 var(--primary-hue)) !important;
}

/* Paginator styling */
.p-paginator {
  background: transparent !important;
  border: none !important;
  padding: 1rem 1.5rem !important;
}

.p-paginator .p-paginator-current {
  color: var(--color-base-content);
  opacity: 0.6;
}

.p-paginator .p-paginator-page.p-highlight {
  background: linear-gradient(to right, var(--primary-600), var(--primary-500)) !important;
  color: white !important;
  border-radius: 0.5rem !important;
}

.p-paginator .p-paginator-page:not(.p-highlight):hover {
  background: var(--color-base-300) !important;
  border-radius: 0.5rem !important;
}
```

**Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add src/styles.css
git commit -m "style: add PrimeNG table and paginator modernization"
```

---

## Final Verification

### Task 12: Full Application Verification

**Step 1: Run full build**

```bash
npm run build
```

Expected: Build succeeds with no errors

**Step 2: Run tests**

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

Expected: All tests pass

**Step 3: Manual verification checklist**

- [ ] Login page shows gradient logo and button
- [ ] Navbar has gradient background with glassmorphism mobile menu
- [ ] Home page has hero section with stat cards
- [ ] Tables have gradient headers
- [ ] Point values show color-coded badges
- [ ] Driver names have avatar icons
- [ ] Buttons have gradient styling with colored shadows
- [ ] Dark mode works correctly throughout

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat: complete Phase 3 design modernization"
```

---

## Summary

| Task | Component | Commit Message |
|------|-----------|----------------|
| 1 | Badge types | `feat(badge): add badge component types` |
| 2 | Badge component | `feat(badge): create badge component with variants and sizes` |
| 3 | Avatar component | `feat(avatar): create avatar component with gradient variants` |
| 4 | StatCard component | `feat(stat-card): create stat card component for hero sections` |
| 5 | Button updates | `feat(button): add gradient variants and colored shadows` |
| 6 | Navbar modernization | `feat(navbar): modernize with gradient background and glassmorphism` |
| 7 | Home hero section | `feat(home): add hero section with stat cards and gradient table headers` |
| 8 | Approvals page | `feat(approvals): modernize with avatars, badges, and gradient headers` |
| 9 | Login page | `feat(login): modernize with gradient branding and improved form styling` |
| 10 | Modal gradient header | `feat(modal): add gradient header style option` |
| 11 | Global table styles | `style: add PrimeNG table and paginator modernization` |
| 12 | Final verification | `feat: complete Phase 3 design modernization` |

**Total Tasks:** 12
**Estimated Components Modified:** 15+
**New Components Created:** 4 (Badge, Avatar, StatCard + types)
