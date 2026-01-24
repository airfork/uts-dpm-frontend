# Loading States & Skeleton Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add skeleton loading states to table views and the DPM type select to improve perceived performance on slower connections.

**Architecture:** Create reusable skeleton components in the UI library, then integrate them into existing components by replacing full-page loading spinners with inline skeleton loaders that match the content layout.

**Tech Stack:** Angular 21 signals, Tailwind CSS 4, existing design system tokens

---

## Summary of Current State

| Component | Current Loading | Issue |
|-----------|----------------|-------|
| Home (My DPMs) | Full-page `<app-loading>` spinner | Content jumps when data loads; no visual hint of what's coming |
| Users List | Full-page `<app-loading>` spinner | Same issue - jarring transition |
| New DPM Type Select | None | Select is empty while types load; user doesn't know it's loading |
| Approvals | Has inline loading in data-table | Already good - use as reference |

## Tasks

---

### Task 1: Create Skeleton Base Component

**Files:**
- Create: `src/app/ui/skeleton/skeleton.component.ts`
- Create: `src/app/ui/skeleton/skeleton.component.html`

**Step 1: Create the skeleton component TypeScript file**

```typescript
import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  imports: [NgClass],
  templateUrl: './skeleton.component.html',
})
export class SkeletonComponent {
  /** Width of the skeleton - can be Tailwind class like 'w-full' or 'w-24' */
  width = input<string>('w-full');

  /** Height of the skeleton - can be Tailwind class like 'h-4' or 'h-8' */
  height = input<string>('h-4');

  /** Whether to use rounded-full (for avatars) or rounded (for text/boxes) */
  rounded = input<'sm' | 'md' | 'lg' | 'full'>('md');

  /** Additional CSS classes */
  class = input<string>('');
}
```

**Step 2: Create the skeleton component template**

```html
<div
  class="animate-pulse bg-neutral-200 dark:bg-neutral-700"
  [ngClass]="[
    width(),
    height(),
    rounded() === 'sm' ? 'rounded' : '',
    rounded() === 'md' ? 'rounded-lg' : '',
    rounded() === 'lg' ? 'rounded-xl' : '',
    rounded() === 'full' ? 'rounded-full' : '',
    class()
  ]"
></div>
```

**Step 3: Verify the component compiles**

Run: `npm run build -- --configuration=development 2>&1 | head -20`
Expected: No errors related to skeleton component

**Step 4: Commit**

```bash
git add src/app/ui/skeleton/
git commit -m "feat(ui): add skeleton loading component

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 2: Create Table Skeleton Component

**Files:**
- Create: `src/app/ui/skeleton/table-skeleton.component.ts`
- Create: `src/app/ui/skeleton/table-skeleton.component.html`

**Step 1: Create the table skeleton TypeScript file**

```typescript
import { Component, input } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './table-skeleton.component.html',
})
export class TableSkeletonComponent {
  /** Number of rows to display */
  rows = input<number>(5);

  /** Number of columns to display */
  columns = input<number>(3);

  /** Whether to show a header row */
  showHeader = input<boolean>(true);

  /** Whether to show avatar in first column */
  showAvatar = input<boolean>(false);

  /** Array helper for iteration */
  get rowsArray(): number[] {
    return Array.from({ length: this.rows() }, (_, i) => i);
  }

  get columnsArray(): number[] {
    return Array.from({ length: this.columns() }, (_, i) => i);
  }
}
```

**Step 2: Create the table skeleton template**

```html
<div class="overflow-hidden">
  <table class="w-full table-fixed">
    <!-- Header skeleton -->
    @if (showHeader()) {
      <thead>
        <tr class="bg-gradient-to-r from-primary-600 to-primary-500">
          @for (col of columnsArray; track col) {
            <th class="px-6 py-4">
              <app-skeleton width="w-20" height="h-4" class="bg-white/20" />
            </th>
          }
        </tr>
      </thead>
    }

    <!-- Body skeleton rows -->
    <tbody>
      @for (row of rowsArray; track row) {
        <tr
          class="border-t border-neutral-200 dark:border-neutral-700"
          [style.animation-delay]="row * 50 + 'ms'"
        >
          @for (col of columnsArray; track col; let first = $first) {
            <td class="px-6 py-4">
              @if (first && showAvatar()) {
                <div class="flex items-center gap-3">
                  <app-skeleton width="w-8" height="h-8" rounded="full" />
                  <app-skeleton width="w-24" height="h-4" />
                </div>
              } @else {
                <app-skeleton
                  [width]="first ? 'w-32' : 'w-16'"
                  height="h-4"
                />
              }
            </td>
          }
        </tr>
      }
    </tbody>
  </table>
</div>
```

**Step 3: Verify the component compiles**

Run: `npm run build -- --configuration=development 2>&1 | head -20`
Expected: No errors related to table-skeleton component

**Step 4: Commit**

```bash
git add src/app/ui/skeleton/
git commit -m "feat(ui): add table skeleton loading component

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 3: Create Card Skeleton Component (for mobile views)

**Files:**
- Create: `src/app/ui/skeleton/card-skeleton.component.ts`
- Create: `src/app/ui/skeleton/card-skeleton.component.html`

**Step 1: Create the card skeleton TypeScript file**

```typescript
import { Component, input } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'app-card-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './card-skeleton.component.html',
})
export class CardSkeletonComponent {
  /** Number of cards to display */
  count = input<number>(5);

  /** Whether to show avatar */
  showAvatar = input<boolean>(false);

  /** Array helper for iteration */
  get cardsArray(): number[] {
    return Array.from({ length: this.count() }, (_, i) => i);
  }
}
```

**Step 2: Create the card skeleton template**

```html
<div class="space-y-3">
  @for (card of cardsArray; track card) {
    <div
      class="bg-base-100 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 animate-pulse"
      [style.animation-delay]="card * 50 + 'ms'"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3 flex-1">
          @if (showAvatar()) {
            <app-skeleton width="w-10" height="h-10" rounded="full" />
          }
          <div class="flex-1 space-y-2">
            <app-skeleton width="w-3/4" height="h-4" />
            <app-skeleton width="w-1/2" height="h-3" />
          </div>
        </div>
        <app-skeleton width="w-12" height="h-6" rounded="lg" />
      </div>
    </div>
  }
</div>
```

**Step 3: Verify the component compiles**

Run: `npm run build -- --configuration=development 2>&1 | head -20`
Expected: No errors

**Step 4: Commit**

```bash
git add src/app/ui/skeleton/
git commit -m "feat(ui): add card skeleton loading component

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 4: Create Select Skeleton Component

**Files:**
- Create: `src/app/ui/skeleton/select-skeleton.component.ts`
- Create: `src/app/ui/skeleton/select-skeleton.component.html`

**Step 1: Create the select skeleton TypeScript file**

```typescript
import { Component, input } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'app-select-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './select-skeleton.component.html',
})
export class SelectSkeletonComponent {
  /** Whether to show the label */
  showLabel = input<boolean>(true);
}
```

**Step 2: Create the select skeleton template**

```html
<div class="flex flex-col gap-1.5">
  @if (showLabel()) {
    <app-skeleton width="w-20" height="h-4" />
  }
  <div class="relative">
    <app-skeleton width="w-full" height="h-[42px]" rounded="lg" />
    <!-- Chevron indicator skeleton -->
    <div class="absolute right-3 top-1/2 -translate-y-1/2">
      <app-skeleton width="w-4" height="h-4" rounded="sm" />
    </div>
  </div>
</div>
```

**Step 3: Verify the component compiles**

Run: `npm run build -- --configuration=development 2>&1 | head -20`
Expected: No errors

**Step 4: Commit**

```bash
git add src/app/ui/skeleton/
git commit -m "feat(ui): add select skeleton loading component

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 5: Create Skeleton Module Index (barrel export)

**Files:**
- Create: `src/app/ui/skeleton/index.ts`

**Step 1: Create the barrel export file**

```typescript
export { SkeletonComponent } from './skeleton.component';
export { TableSkeletonComponent } from './table-skeleton.component';
export { CardSkeletonComponent } from './card-skeleton.component';
export { SelectSkeletonComponent } from './select-skeleton.component';
```

**Step 2: Commit**

```bash
git add src/app/ui/skeleton/index.ts
git commit -m "feat(ui): add skeleton barrel exports

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 6: Add Loading State to Home Component

**Files:**
- Modify: `src/app/dpms/home/home.component.ts`
- Modify: `src/app/dpms/home/home.component.html`

**Step 1: Update home component imports**

Add to imports array in `home.component.ts`:
```typescript
import { TableSkeletonComponent, CardSkeletonComponent } from '../../ui/skeleton';
```

And add to the `imports` array in the `@Component` decorator:
```typescript
imports: [
  // ... existing imports
  TableSkeletonComponent,
  CardSkeletonComponent,
],
```

**Step 2: Add loading signal to home component**

The component currently uses `toSignal()` which returns `undefined` initially. We need to track loading state. Add after `currentDpms`:

```typescript
isLoading = computed(() => this.currentDpms() === undefined || this.currentDpms()?.length === undefined);
```

Wait - actually `toSignal` with `initialValue: []` means it will never be undefined. Let's check the actual loading state differently.

Actually, looking at the code, the issue is that `toSignal` returns the `initialValue` (`[]`) immediately, then updates when data arrives. So we can't distinguish "loading" from "empty".

We need to change the approach. Update the component:

```typescript
private dpmService = inject(DpmService);

// Remove toSignal, use explicit loading state
private dpmsData = signal<HomeDpmDto[] | null>(null);
currentDpms = computed(() => this.dpmsData() ?? []);
isLoading = computed(() => this.dpmsData() === null);

constructor() {
  this.dpmService.getCurrentDpms().pipe(first()).subscribe(dpms => {
    this.dpmsData.set(dpms);
  });
}
```

Add `first` import:
```typescript
import { first } from 'rxjs';
```

**Step 3: Update home component template**

Replace the `@else` block at the end (line 217-219) with skeleton loading:

Replace:
```html
} @else {
  <app-loading></app-loading>
}
```

With:
```html
} @else if (isLoading()) {
  <div class="px-4 py-6 md:px-6 md:py-8">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Hero Section Skeleton -->
      <section class="bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl p-6 md:p-8">
        <div class="flex items-center gap-4 mb-6">
          <app-skeleton width="w-12" height="h-12" rounded="lg" class="bg-white/20" />
          <div class="space-y-2">
            <app-skeleton width="w-48" height="h-6" class="bg-white/20" />
            <app-skeleton width="w-32" height="h-4" class="bg-white/20" />
          </div>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (i of [0,1,2]; track i) {
            <div class="bg-white/10 rounded-xl p-4">
              <app-skeleton width="w-20" height="h-3" class="bg-white/20 mb-2" />
              <app-skeleton width="w-12" height="h-8" class="bg-white/20" />
            </div>
          }
        </div>
      </section>

      <!-- Mobile Card Skeleton -->
      <div class="md:hidden">
        <app-card-skeleton [count]="5" />
      </div>

      <!-- Desktop Table Skeleton -->
      <div class="hidden md:block bg-base-100 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-lg overflow-hidden">
        <app-table-skeleton [rows]="5" [columns]="3" />
      </div>
    </div>
  </div>
}
```

Also add `SkeletonComponent` to the imports in the component and template.

**Step 4: Verify changes compile**

Run: `npm run build -- --configuration=development 2>&1 | head -30`
Expected: No errors

**Step 5: Run tests**

Run: `npm test -- --no-watch --browsers=ChromeHeadless --include="**/home*.spec.ts"`
Expected: Tests pass (may need to update mocks)

**Step 6: Commit**

```bash
git add src/app/dpms/home/
git commit -m "feat(home): replace full-page spinner with skeleton loading

- Add skeleton for hero section stats
- Add mobile card skeleton
- Add desktop table skeleton
- Use explicit loading state signal

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 7: Add Loading State to Users List Component

**Files:**
- Modify: `src/app/users/users-list/users-list.component.ts`
- Modify: `src/app/users/users-list/users-list.component.html`

**Step 1: Update users-list component imports**

Add to imports in `users-list.component.ts`:
```typescript
import { TableSkeletonComponent, CardSkeletonComponent, SkeletonComponent } from '../../ui/skeleton';
```

Add to `@Component` imports array:
```typescript
imports: [
  // ... existing imports
  TableSkeletonComponent,
  CardSkeletonComponent,
  SkeletonComponent,
],
```

**Step 2: Update users-list component template**

The component already has `users()` signal that is `null` initially. Replace the `@else` block at line 232-234:

Replace:
```html
} @else {
  <app-loading></app-loading>
}
```

With:
```html
} @else {
  <div class="px-4 py-6 md:px-6 md:py-8">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Page Header Skeleton -->
      <div class="flex items-center gap-4">
        <app-skeleton width="w-12" height="h-12" rounded="lg" />
        <div class="space-y-2">
          <app-skeleton width="w-40" height="h-6" />
          <app-skeleton width="w-24" height="h-4" />
        </div>
      </div>

      <!-- Tabs Skeleton -->
      <div class="flex gap-2">
        <app-skeleton width="w-20" height="h-10" rounded="lg" />
        <app-skeleton width="w-20" height="h-10" rounded="lg" />
        <app-skeleton width="w-20" height="h-10" rounded="lg" />
      </div>

      <!-- Mobile Card Skeleton -->
      <div class="md:hidden space-y-3">
        <!-- Search skeleton -->
        <app-skeleton width="w-full" height="h-12" rounded="lg" />
        <app-card-skeleton [count]="5" [showAvatar]="true" />
      </div>

      <!-- Desktop Table Skeleton -->
      <div class="hidden md:block bg-base-100 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-md overflow-hidden">
        <!-- Search bar skeleton -->
        <div class="p-4 border-b border-neutral-200 dark:border-neutral-700">
          <app-skeleton width="w-64" height="h-9" rounded="lg" />
        </div>
        <app-table-skeleton [rows]="5" [columns]="2" [showAvatar]="true" />
      </div>
    </div>
  </div>
}
```

**Step 3: Verify changes compile**

Run: `npm run build -- --configuration=development 2>&1 | head -30`
Expected: No errors

**Step 4: Run tests**

Run: `npm test -- --no-watch --browsers=ChromeHeadless --include="**/users-list*.spec.ts"`
Expected: Tests pass

**Step 5: Commit**

```bash
git add src/app/users/users-list/
git commit -m "feat(users): replace full-page spinner with skeleton loading

- Add skeleton for page header
- Add skeleton for tab buttons
- Add mobile card skeleton with avatars
- Add desktop table skeleton with search bar

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 8: Add Loading State to DPM Type Select

**Files:**
- Modify: `src/app/dpms/new-dpm/new-dpm.component.ts`
- Modify: `src/app/dpms/new-dpm/new-dpm.component.html`

**Step 1: Update new-dpm component imports**

Add to imports in `new-dpm.component.ts`:
```typescript
import { SelectSkeletonComponent } from '../../ui/skeleton';
```

Add to `@Component` imports array:
```typescript
imports: [
  // ... existing imports
  SelectSkeletonComponent,
],
```

**Step 2: Update new-dpm component template**

The component receives `isGroupsLoaded` input. Wrap the DPM Type select in a conditional (around lines 161-180):

Replace:
```html
<div class="flex flex-col gap-1.5">
  <label for="dpmTypeInput" class="block text-sm font-semibold dpm-form-label">
    DPM Type
  </label>
  <select
    id="dpmTypeInput"
    class="w-full px-4 py-2.5 pr-10 rounded-lg dpm-form-input text-base-content shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer appearance-none bg-no-repeat bg-[length:1.25rem] bg-[right_0.75rem_center] bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22%236b7280%22%3e%3cpath%20fill-rule%3d%22evenodd%22%20d%3d%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3d%22evenodd%22%2f%3e%3c%2fsvg%3e')]"
    formControlName="type"
  >
    @for (group of dpmGroups(); track group.groupName) {
      <optgroup label="{{ group.groupName }}">
        @for (dpm of group.dpms; track dpm.name) {
          <option [value]="dpm.id">{{ dpm.name }} {{ formatPoints(dpm.points) }}</option>
        }
      </optgroup>
    }
  </select>
  <div class="min-h-5"></div>
</div>
```

With:
```html
<div class="flex flex-col gap-1.5">
  <label for="dpmTypeInput" class="block text-sm font-semibold dpm-form-label">
    DPM Type
  </label>
  @if (isGroupsLoaded()) {
    <select
      id="dpmTypeInput"
      class="w-full px-4 py-2.5 pr-10 rounded-lg dpm-form-input text-base-content shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 cursor-pointer appearance-none bg-no-repeat bg-[length:1.25rem] bg-[right_0.75rem_center] bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg%20xmlns%3d%22http%3a%2f%2fwww.w3.org%2f2000%2fsvg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22%236b7280%22%3e%3cpath%20fill-rule%3d%22evenodd%22%20d%3d%22M5.293%207.293a1%201%200%20011.414%200L10%2010.586l3.293-3.293a1%201%200%20111.414%201.414l-4%204a1%201%200%2001-1.414%200l-4-4a1%201%200%20010-1.414z%22%20clip-rule%3d%22evenodd%22%2f%3e%3c%2fsvg%3e')]"
      formControlName="type"
    >
      @for (group of dpmGroups(); track group.groupName) {
        <optgroup label="{{ group.groupName }}">
          @for (dpm of group.dpms; track dpm.name) {
            <option [value]="dpm.id">{{ dpm.name }} {{ formatPoints(dpm.points) }}</option>
          }
        </optgroup>
      }
    </select>
  } @else {
    <div class="relative">
      <div class="w-full h-[42px] px-4 py-2.5 rounded-lg dpm-form-input border border-neutral-200 dark:border-neutral-600 flex items-center">
        <div class="animate-pulse flex items-center gap-2 w-full">
          <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-32"></div>
          <div class="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-16"></div>
        </div>
      </div>
      <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg class="w-5 h-5 text-neutral-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
        </svg>
      </div>
    </div>
  }
  <div class="min-h-5"></div>
</div>
```

**Step 3: Verify changes compile**

Run: `npm run build -- --configuration=development 2>&1 | head -30`
Expected: No errors

**Step 4: Run tests**

Run: `npm test -- --no-watch --browsers=ChromeHeadless --include="**/new-dpm*.spec.ts"`
Expected: Tests pass

**Step 5: Commit**

```bash
git add src/app/dpms/new-dpm/
git commit -m "feat(new-dpm): add skeleton loading state for DPM type select

- Show skeleton while DPM types are loading
- Maintain form field height to prevent layout shift
- Use existing isGroupsLoaded input signal

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 9: Add Unit Tests for Skeleton Components

**Files:**
- Create: `src/app/ui/skeleton/skeleton.component.spec.ts`
- Create: `src/app/ui/skeleton/table-skeleton.component.spec.ts`
- Create: `src/app/ui/skeleton/card-skeleton.component.spec.ts`
- Create: `src/app/ui/skeleton/select-skeleton.component.spec.ts`

**Step 1: Create skeleton component test**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkeletonComponent } from './skeleton.component';

describe('SkeletonComponent', () => {
  let component: SkeletonComponent;
  let fixture: ComponentFixture<SkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default width of w-full', () => {
    expect(component.width()).toBe('w-full');
  });

  it('should have default height of h-4', () => {
    expect(component.height()).toBe('h-4');
  });

  it('should have default rounded of md', () => {
    expect(component.rounded()).toBe('md');
  });

  it('should apply animate-pulse class', () => {
    const element = fixture.nativeElement.querySelector('div');
    expect(element.classList.contains('animate-pulse')).toBeTrue();
  });

  it('should apply custom width', () => {
    fixture.componentRef.setInput('width', 'w-24');
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element.classList.contains('w-24')).toBeTrue();
  });

  it('should apply rounded-full for avatar style', () => {
    fixture.componentRef.setInput('rounded', 'full');
    fixture.detectChanges();
    const element = fixture.nativeElement.querySelector('div');
    expect(element.classList.contains('rounded-full')).toBeTrue();
  });
});
```

**Step 2: Create table skeleton component test**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableSkeletonComponent } from './table-skeleton.component';

describe('TableSkeletonComponent', () => {
  let component: TableSkeletonComponent;
  let fixture: ComponentFixture<TableSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TableSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default 5 rows', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(5);
  });

  it('should render default 3 columns', () => {
    const firstRowCells = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(firstRowCells.length).toBe(3);
  });

  it('should show header by default', () => {
    const header = fixture.nativeElement.querySelector('thead');
    expect(header).toBeTruthy();
  });

  it('should hide header when showHeader is false', () => {
    fixture.componentRef.setInput('showHeader', false);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('thead');
    expect(header).toBeFalsy();
  });

  it('should render custom row count', () => {
    fixture.componentRef.setInput('rows', 10);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(10);
  });
});
```

**Step 3: Create card skeleton component test**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardSkeletonComponent } from './card-skeleton.component';

describe('CardSkeletonComponent', () => {
  let component: CardSkeletonComponent;
  let fixture: ComponentFixture<CardSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default 5 cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.space-y-3 > div');
    expect(cards.length).toBe(5);
  });

  it('should render custom card count', () => {
    fixture.componentRef.setInput('count', 3);
    fixture.detectChanges();
    const cards = fixture.nativeElement.querySelectorAll('.space-y-3 > div');
    expect(cards.length).toBe(3);
  });

  it('should not show avatar by default', () => {
    expect(component.showAvatar()).toBeFalse();
  });
});
```

**Step 4: Create select skeleton component test**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectSkeletonComponent } from './select-skeleton.component';

describe('SelectSkeletonComponent', () => {
  let component: SelectSkeletonComponent;
  let fixture: ComponentFixture<SelectSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectSkeletonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show label by default', () => {
    expect(component.showLabel()).toBeTrue();
  });

  it('should render 2 skeleton elements when label shown', () => {
    const skeletons = fixture.nativeElement.querySelectorAll('app-skeleton');
    expect(skeletons.length).toBe(3); // label + select + chevron
  });
});
```

**Step 5: Run all skeleton tests**

Run: `npm test -- --no-watch --browsers=ChromeHeadless --include="**/skeleton*.spec.ts"`
Expected: All tests pass

**Step 6: Commit**

```bash
git add src/app/ui/skeleton/*.spec.ts
git commit -m "test(ui): add unit tests for skeleton components

- Test skeleton component defaults and customization
- Test table skeleton row/column rendering
- Test card skeleton count and avatar options
- Test select skeleton label visibility

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

---

### Task 10: Visual Validation with Chrome DevTools

**Files:**
- None (validation only)

**Step 1: Start development server**

Run: `npm start`
Expected: Server starts on localhost:4200

**Step 2: Validate home page skeleton**

Using Chrome DevTools MCP:
1. Navigate to login page
2. Login with test credentials
3. Navigate to home page
4. Throttle network to "Slow 3G"
5. Refresh and take snapshot
6. Verify skeleton appears before content

**Step 3: Validate users list skeleton**

1. Navigate to /users
2. Throttle network to "Slow 3G"
3. Refresh and take snapshot
4. Verify skeleton appears before content

**Step 4: Validate DPM type select skeleton**

1. Navigate to /dpms (new DPM page)
2. Throttle network to "Slow 3G"
3. Refresh and take snapshot
4. Verify type select shows skeleton while loading

**Step 5: Document findings**

If any issues found, note them for follow-up fixes.

---

### Task 11: Final Build Verification

**Files:**
- None (verification only)

**Step 1: Run full test suite**

Run: `npm test -- --no-watch --browsers=ChromeHeadless`
Expected: All tests pass

**Step 2: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Run lint**

Run: `npm run lint`
Expected: No lint errors

**Step 4: Final commit if any fixes needed**

Only if fixes were required from validation.

---

## Summary

This plan adds skeleton loading states to improve perceived performance:

1. **Skeleton UI Components (Tasks 1-5):** Reusable components in `src/app/ui/skeleton/`
   - Base skeleton element
   - Table skeleton for data tables
   - Card skeleton for mobile views
   - Select skeleton for form selects

2. **Component Integrations (Tasks 6-8):**
   - Home page: Hero stats + table/card skeletons
   - Users list: Header + tabs + table/card skeletons
   - New DPM: Type select skeleton

3. **Testing & Validation (Tasks 9-11):**
   - Unit tests for all skeleton components
   - Visual validation with network throttling
   - Full build verification
