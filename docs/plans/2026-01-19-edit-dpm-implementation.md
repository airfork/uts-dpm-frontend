# Edit DPM Page Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign the edit DPM page with clear visual affordances, consistent feedback, and improved usability for infrequent admin users.

**Architecture:** Incremental refactor of existing `EditDpmsComponent`. CSS changes first to establish foundation, then structural HTML changes, then new TypeScript logic. Replace color modal with inline dropdown component.

**Tech Stack:** Angular 21, Tailwind CSS 4, PrimeNG (for dropdown), Angular CDK (drag-drop)

**Design Document:** `docs/plans/2026-01-19-edit-dpm-redesign.md`

---

## Phase 1: CSS Foundation

### Task 1.1: Add Points Color Utility Classes

**Files:**
- Modify: `src/styles.css` (end of file)

**Step 1: Add the utility classes**

Add to `src/styles.css`:

```css
/* Points display - positive/negative color coding */
.points-positive {
  color: var(--color-success-600);
  font-weight: 500;
}

.points-negative {
  color: var(--color-error-600);
  font-weight: 500;
}

.points-zero {
  color: var(--color-neutral-500);
}
```

**Step 2: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds with no errors

**Step 3: Commit**

```bash
git add src/styles.css
git commit -m "style: add points color utility classes for +/- display"
```

---

### Task 1.2: Add Color Swatch Styles

**Files:**
- Modify: `src/styles.css` (end of file)

**Step 1: Add color swatch styles**

Add to `src/styles.css`:

```css
/* Color swatch indicator */
.color-swatch {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 1px solid var(--color-base-300);
  vertical-align: middle;
  flex-shrink: 0;
}

.color-swatch-none {
  background: transparent;
  border-style: dashed;
}

/* Color dropdown trigger */
.color-cell {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border: 1px solid var(--color-base-300);
  border-radius: 0.375rem;
  cursor: pointer;
  min-width: 7rem;
  background: var(--color-base-100);
  transition: border-color 150ms ease;
}

.color-cell:hover {
  border-color: var(--color-primary-400);
}

.color-cell-text {
  flex: 1;
  font-size: 0.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
```

**Step 2: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/styles.css
git commit -m "style: add color swatch and color cell styles"
```

---

### Task 1.3: Add Header Row and Error Badge Styles

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.css` (end of file)

**Step 1: Add header row styles**

Add to `edit-dpms.component.css`:

```css
/* Column header row */
.dpm-header-row {
  display: grid;
  grid-template-columns: 2rem 1fr 5rem 8rem 3rem;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--color-base-200);
  border-bottom: 1px solid var(--color-base-300);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  color: var(--color-base-content);
  opacity: 0.7;
}

.dpm-header-row .header-color {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* DPM data row - matching grid */
.dpm-data-row {
  display: grid;
  grid-template-columns: 2rem 1fr 5rem 8rem 3rem;
  gap: 0.5rem;
  align-items: center;
}

/* Group error badge */
.group-error-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-error-700);
  background: var(--color-error-100);
  border-radius: 9999px;
}

/* Highlight animation for newly added items */
.dpm-highlight-pulse {
  animation: highlightPulse 300ms ease-out;
}

@keyframes highlightPulse {
  0% {
    background-color: var(--color-primary-100);
  }
  100% {
    background-color: transparent;
  }
}

/* Group card drag animation (match DPM items) */
.group-card.cdk-drag-animating {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}

.cdk-drop-list-dragging .group-card:not(.cdk-drag-placeholder) {
  transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
}
```

**Step 2: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.css
git commit -m "style: add header row, error badge, and animation styles"
```

---

### Task 1.4: Fix Sticky Save Bar for All Viewports

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.css:84-89`

**Step 1: Remove the desktop override**

Find and delete the media query that makes save bar static on desktop:

```css
/* DELETE THIS BLOCK */
@media (min-width: 768px) {
  .sticky-save-bar {
    position: static;
    border-top: none;
    background: transparent;
  }
}
```

**Step 2: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Visually verify in browser**

Run: `npm start`
Open: http://localhost:4200/dpm?tab=edit
Expected: Save bar stays sticky at bottom when scrolling on desktop

**Step 4: Commit**

```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.css
git commit -m "fix: make sticky save bar work on all viewports"
```

---

## Phase 2: Structural HTML Changes

### Task 2.1: Always Show Reset Button (Fix Layout Shift)

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.html:22-31`

**Step 1: Change reset button from hidden to disabled**

Find:
```html
<app-button
  variant="ghost"
  size="sm"
  (click)="confirmReset()"
  [hidden]="dpmEditForm.pristine"
  appTooltip="Reset Changes"
  tooltipPosition="top"
>
  <i class="pi pi-refresh"></i>
</app-button>
```

Replace with:
```html
<app-button
  variant="ghost"
  size="sm"
  (click)="confirmReset()"
  [disabled]="dpmEditForm.pristine"
  appTooltip="Reset Changes"
  tooltipPosition="top"
>
  <i class="pi pi-refresh"></i>
</app-button>
```

**Step 2: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Visually verify in browser**

Expected: Reset button always visible, grayed out when no changes

**Step 4: Commit**

```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.html
git commit -m "fix: always show reset button to prevent layout shift"
```

---

### Task 2.2: Remove Ghost Styling from Inputs

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.html`

**Step 1: Update group name textarea (line ~74)**

Find:
```html
<textarea
  appAutoResize
  id="dpmGroupName-{{ groupControl.value.id }}"
  class="form-textarea form-textarea-ghost grow text-xl min-h-0 resize-none font-semibold"
  placeholder="Group Name"
  formControlName="name"
  [ngClass]="{
    'form-textarea-error': groupNameHasErrors(groupControl),
    'form-textarea-ghost': !groupNameHasErrors(groupControl),
  }"
></textarea>
```

Replace with:
```html
<textarea
  appAutoResize
  id="dpmGroupName-{{ groupControl.value.id }}"
  class="form-textarea grow text-xl min-h-0 resize-none font-semibold"
  placeholder="Group Name"
  formControlName="name"
  [ngClass]="{
    'form-textarea-error': groupNameHasErrors(groupControl)
  }"
></textarea>
```

**Step 2: Update DPM name textarea (line ~156)**

Find:
```html
<textarea
  appAutoResize
  id="dpmName-{{ dpmControl.value.id }}"
  class="form-textarea w-full min-h-0 resize-none"
  placeholder="DPM Name"
  formControlName="name"
  [ngClass]="{
    'form-textarea-error':
      dpmHasErrors(dpmControl, 'name') ||
      dpmNameIsDuplicated(groupControl, dpmControl),
    'form-textarea-ghost':
      !dpmHasErrors(dpmControl, 'name') &&
      !dpmNameIsDuplicated(groupControl, dpmControl),
  }"
></textarea>
```

Replace with:
```html
<textarea
  appAutoResize
  id="dpmName-{{ dpmControl.value.id }}"
  class="form-textarea w-full min-h-0 resize-none"
  placeholder="DPM Name"
  formControlName="name"
  [ngClass]="{
    'form-textarea-error':
      dpmHasErrors(dpmControl, 'name') ||
      dpmNameIsDuplicated(groupControl, dpmControl)
  }"
></textarea>
```

**Step 3: Update points input (line ~177)**

Find:
```html
[ngClass]="{
  'form-input-error': dpmHasErrors(
    dpmControl,
    'points'
  ),
  'form-input-ghost': !dpmHasErrors(
    dpmControl,
    'points'
  ),
}"
```

Replace with:
```html
[ngClass]="{
  'form-input-error': dpmHasErrors(dpmControl, 'points')
}"
```

**Step 4: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Visually verify inputs have visible borders**

Expected: All inputs now have visible borders by default

**Step 6: Commit**

```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.html
git commit -m "style: remove ghost styling from inputs for clear affordances"
```

---

### Task 2.3: Add Column Header Row to Groups

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.html`
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.ts` (imports)

**Step 1: Add TooltipDirective import if not present**

Verify `TooltipDirective` is in imports array in `edit-dpms.component.ts` (it should already be there).

**Step 2: Add header row before DPM list (after line ~126)**

Find the `<div cdkDropList formArrayName="dpms"` section and add header row before it:

```html
<!-- Column Headers -->
<div class="dpm-header-row">
  <div></div>
  <div>Name</div>
  <div>Points</div>
  <div class="header-color">
    Color
    <i
      class="pi pi-info-circle text-xs cursor-help"
      appTooltip="Colors link DPMs to WhenToWork shifts for Autogen"
      tooltipPosition="top"
    ></i>
  </div>
  <div></div>
</div>

<div
  cdkDropList
  formArrayName="dpms"
  ...
```

**Step 3: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Visually verify header row appears**

Expected: Each group shows column headers above DPM list

**Step 5: Commit**

```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.html
git commit -m "feat: add column header row to DPM groups"
```

---

### Task 2.4: Add Group Error Badge

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.html` (group header area)
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.ts` (add helper method)

**Step 1: Add error count method to component**

Add to `edit-dpms.component.ts`:

```typescript
getGroupErrorCount(groupControl: AbstractControl): number {
  let count = 0;

  // Count group-level errors
  if (this.groupNameHasErrors(groupControl)) count++;
  if (this.groupNameIsDuplicated(groupControl)) count++;

  const dpmsArray = this.getDpmsFormArray(groupControl);
  if (!dpmsArray || dpmsArray.length === 0) count++;

  // Count DPM-level errors
  dpmsArray.controls.forEach(dpmControl => {
    if (this.dpmHasErrors(dpmControl, 'name')) count++;
    if (this.dpmHasErrors(dpmControl, 'points')) count++;
    if (this.dpmNameIsDuplicated(groupControl, dpmControl)) count++;
  });

  return count;
}
```

**Step 2: Add error badge to group header**

Find the group header area (around line 67-111) and add badge after the group name textarea:

```html
<!-- Error Badge -->
@if (groupHasErrors(groupControl) || dpmsInGroupHaveErrors(groupControl)) {
  <span class="group-error-badge">
    <i class="pi pi-exclamation-triangle text-xs"></i>
    {{ getGroupErrorCount(groupControl) }} {{ getGroupErrorCount(groupControl) === 1 ? 'error' : 'errors' }}
  </span>
}
```

**Step 3: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Test by creating a validation error**

Clear a DPM name field, verify badge shows "1 error"

**Step 5: Commit**

```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.html src/app/dpms/edit-dpms/edit-dpms.component.ts
git commit -m "feat: add error badge to group headers"
```

---

## Phase 3: Points Display with +/- Prefix

### Task 3.1: Create Points Display Pipe

**Files:**
- Create: `src/app/shared/pipes/points-display.pipe.ts`

**Step 1: Create the pipe file**

```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pointsDisplay',
  standalone: true
})
export class PointsDisplayPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';
    if (value > 0) return `+${value}`;
    return value.toString();
  }
}
```

**Step 2: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/app/shared/pipes/points-display.pipe.ts
git commit -m "feat: create pointsDisplay pipe for +/- formatting"
```

---

### Task 3.2: Add Points Display Column

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.ts` (imports)
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.html`

**Step 1: Import the pipe**

Add to imports array in `edit-dpms.component.ts`:

```typescript
import { PointsDisplayPipe } from '../../shared/pipes/points-display.pipe';

// In @Component imports array:
imports: [
  // ... existing imports
  PointsDisplayPipe,
],
```

**Step 2: Update points display in template**

Find the points input section and add a display span:

```html
<div class="flex-none flex items-center gap-1">
  <span
    class="text-sm font-medium w-10 text-right"
    [ngClass]="{
      'points-positive': dpmControl.value.points > 0,
      'points-negative': dpmControl.value.points < 0,
      'points-zero': dpmControl.value.points === 0
    }"
  >
    {{ dpmControl.value.points | pointsDisplay }}
  </span>
  <input
    id="dpmPoints-{{ dpmControl.value.id }}"
    class="form-input form-input-sm w-16"
    formControlName="points"
    type="number"
    placeholder="Pts"
    [ngClass]="{
      'form-input-error': dpmHasErrors(dpmControl, 'points')
    }"
  />
</div>
```

**Step 3: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Visually verify points display**

Expected: "+1" shows green, "-5" shows red, "0" shows gray

**Step 5: Commit**

```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.ts src/app/dpms/edit-dpms/edit-dpms.component.html
git commit -m "feat: add colored +/- points display"
```

---

## Phase 4: Color Dropdown Component

### Task 4.1: Create Color Dropdown Component

**Files:**
- Create: `src/app/dpms/edit-dpms/color-dropdown/color-dropdown.component.ts`
- Create: `src/app/dpms/edit-dpms/color-dropdown/color-dropdown.component.html`
- Create: `src/app/dpms/edit-dpms/color-dropdown/color-dropdown.component.css`

**Step 1: Create the component TypeScript file**

```typescript
import { Component, input, output, signal, computed, ElementRef, HostListener, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { GetDpmColors } from '../../../models/get-dpm-colors';

@Component({
  selector: 'app-color-dropdown',
  standalone: true,
  imports: [NgClass],
  templateUrl: './color-dropdown.component.html',
  styleUrl: './color-dropdown.component.css'
})
export class ColorDropdownComponent {
  private elementRef = inject(ElementRef);

  // Inputs
  colors = input.required<GetDpmColors[]>();
  selectedColor = input<GetDpmColors | null>(null);
  usedColorIds = input<number[]>([]);

  // Outputs
  colorSelected = output<GetDpmColors | null>();

  // State
  isOpen = signal(false);

  // Computed
  displayText = computed(() => {
    const color = this.selectedColor();
    return color ? color.colorName : 'None';
  });

  displayHex = computed(() => {
    const color = this.selectedColor();
    return color?.hexCode || null;
  });

  toggle() {
    this.isOpen.update(v => !v);
  }

  selectColor(color: GetDpmColors | null) {
    this.colorSelected.emit(color);
    this.isOpen.set(false);
  }

  isColorInUse(color: GetDpmColors): boolean {
    const currentId = this.selectedColor()?.colorId;
    // Don't mark current selection as "in use"
    if (color.colorId === currentId) return false;
    return this.usedColorIds().includes(color.colorId);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
```

**Step 2: Create the template file**

```html
<div class="color-dropdown">
  <button type="button" class="color-cell" (click)="toggle()">
    @if (displayHex()) {
      <span class="color-swatch" [style.background-color]="displayHex()"></span>
    } @else {
      <span class="color-swatch color-swatch-none"></span>
    }
    <span class="color-cell-text">{{ displayText() }}</span>
    <i class="pi pi-chevron-down text-xs"></i>
  </button>

  @if (isOpen()) {
    <div class="color-dropdown-menu">
      <button
        type="button"
        class="color-option"
        [ngClass]="{ 'color-option-selected': !selectedColor() }"
        (click)="selectColor(null)"
      >
        <span class="color-swatch color-swatch-none"></span>
        <span>None</span>
        @if (!selectedColor()) {
          <i class="pi pi-check text-xs ml-auto"></i>
        }
      </button>

      @for (color of colors(); track color.colorId) {
        <button
          type="button"
          class="color-option"
          [ngClass]="{
            'color-option-selected': selectedColor()?.colorId === color.colorId,
            'color-option-disabled': isColorInUse(color)
          }"
          [disabled]="isColorInUse(color)"
          (click)="selectColor(color)"
        >
          <span class="color-swatch" [style.background-color]="color.hexCode"></span>
          <span>{{ color.colorName }}</span>
          @if (isColorInUse(color)) {
            <span class="text-xs text-base-content/50 ml-auto">(in use)</span>
          }
          @if (selectedColor()?.colorId === color.colorId) {
            <i class="pi pi-check text-xs ml-auto"></i>
          }
        </button>
      }
    </div>
  }
</div>
```

**Step 3: Create the CSS file**

```css
.color-dropdown {
  position: relative;
}

.color-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 50;
  min-width: 10rem;
  max-height: 16rem;
  overflow-y: auto;
  margin-top: 0.25rem;
  padding: 0.25rem;
  background: var(--color-base-100);
  border: 1px solid var(--color-base-300);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.color-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  text-align: left;
  border: none;
  background: transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 150ms ease;
}

.color-option:hover:not(:disabled) {
  background: var(--color-base-200);
}

.color-option-selected {
  background: var(--color-primary-50);
}

.color-option-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Step 4: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/app/dpms/edit-dpms/color-dropdown/
git commit -m "feat: create color dropdown component with swatches"
```

---

### Task 4.2: Integrate Color Dropdown into Edit DPMs

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.ts`
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.html`

**Step 1: Import the component**

Add to `edit-dpms.component.ts`:

```typescript
import { ColorDropdownComponent } from './color-dropdown/color-dropdown.component';

// In imports array:
imports: [
  // ... existing imports
  ColorDropdownComponent,
],
```

**Step 2: Add computed for used color IDs**

Add to `edit-dpms.component.ts`:

```typescript
getUsedColorIds(excludeDpmId: string): number[] {
  const usedIds: number[] = [];

  this.groupsFormArray.controls.forEach(groupControl => {
    const dpmsArray = this.getDpmsFormArray(groupControl);
    dpmsArray.controls.forEach(dpmControl => {
      const dpmValue = dpmControl.value;
      if (dpmValue.id !== excludeDpmId && dpmValue.color?.colorId) {
        usedIds.push(dpmValue.color.colorId);
      }
    });
  });

  return usedIds;
}

onColorSelected(dpmControl: AbstractControl, color: GetDpmColors | null) {
  const colorValue = color ? { colorId: color.colorId, hexCode: color.hexCode } : null;
  (dpmControl as FormGroup).get('color')?.setValue(colorValue);
  dpmControl.markAsDirty();
  this.dpmEditForm.markAsDirty();
}
```

**Step 3: Replace color button with dropdown in template**

Find the color button section (around line 190-200) and replace:

```html
<!-- Old color button - REMOVE THIS -->
<app-button
  variant="outline"
  size="sm"
  type="button"
  [style.border-color]="dpmControl.value.color?.hexCode"
  (click)="showColorModal(dpmControl)"
  appTooltip="Set Color"
  tooltipPosition="top"
>
  <i class="pi pi-palette text-xs"></i>
</app-button>
```

With:

```html
<app-color-dropdown
  [colors]="dpmColors()"
  [selectedColor]="dpmColors() | colorById:dpmControl.value.color?.colorId"
  [usedColorIds]="getUsedColorIds(dpmControl.value.id)"
  (colorSelected)="onColorSelected(dpmControl, $event)"
/>
```

**Step 4: Create helper pipe for color lookup**

Create `src/app/shared/pipes/color-by-id.pipe.ts`:

```typescript
import { Pipe, PipeTransform } from '@angular/core';
import { GetDpmColors } from '../../models/get-dpm-colors';

@Pipe({
  name: 'colorById',
  standalone: true
})
export class ColorByIdPipe implements PipeTransform {
  transform(colors: GetDpmColors[], colorId: number | undefined | null): GetDpmColors | null {
    if (!colorId) return null;
    return colors.find(c => c.colorId === colorId) || null;
  }
}
```

**Step 5: Import the pipe**

Add to `edit-dpms.component.ts` imports:

```typescript
import { ColorByIdPipe } from '../../shared/pipes/color-by-id.pipe';

imports: [
  // ...
  ColorByIdPipe,
],
```

**Step 6: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 7: Commit**

```bash
git add src/app/dpms/edit-dpms/ src/app/shared/pipes/color-by-id.pipe.ts
git commit -m "feat: integrate color dropdown, replace modal"
```

---

### Task 4.3: Remove Old Color Modal

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.html`
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.ts`

**Step 1: Remove modal from template (lines 262-327)**

Delete the entire `<app-modal>` block for color selection.

**Step 2: Remove modal-related code from component**

Remove from `edit-dpms.component.ts`:
- `isColorModalOpen` signal
- `currentModalDpm` signal
- `colorSelectionForm` FormGroup
- `showColorModal()` method
- `closeColorModal()` method
- `initializeColorSelectionModal()` method
- `selectedColorIsInUse()` method
- `applyColorSelection()` method
- `get selectedColor()` getter

Also remove `CollapsibleComponent` from imports if no longer used elsewhere.

**Step 3: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Verify color selection still works**

Test selecting a color, verify it saves correctly

**Step 5: Commit**

```bash
git add src/app/dpms/edit-dpms/
git commit -m "refactor: remove old color modal code"
```

---

## Phase 5: Feedback & Animations

### Task 5.1: Add Scroll-to-New with Highlight

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.ts`

**Step 1: Update addDpmToGroup method**

Replace the `addDpmToGroup` method:

```typescript
addDpmToGroup(groupControl: AbstractControl) {
  const dpmsArray = this.getDpmsFormArray(groupControl);
  const newId = uuidv4();
  const newDpm = this.fb.group({
    id: [newId],
    name: [null, DPM_NAME_VALIDATORS],
    points: [1, DPM_POINTS_VALIDATORS],
    color: [null],
  });
  dpmsArray.push(newDpm);

  // Scroll to new item and highlight
  setTimeout(() => {
    const element = document.getElementById(`dpmName-${newId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Add highlight class to parent row
      const row = element.closest('.dpm-type-box');
      if (row) {
        row.classList.add('dpm-highlight-pulse');
        setTimeout(() => row.classList.remove('dpm-highlight-pulse'), 300);
      }

      // Focus the name input
      element.focus();
    }
  }, 50);
}
```

**Step 2: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Test by adding a DPM to a group**

Scroll to bottom of a long group, click Add DPM
Expected: New DPM scrolls into view with brief highlight, name field focused

**Step 4: Commit**

```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.ts
git commit -m "feat: scroll to newly added DPM with highlight animation"
```

---

### Task 5.2: Add Group Drag Animation Class

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.html`

**Step 1: Add group-card class to app-card**

Find the `<app-card>` element (around line 51) and add the `group-card` class:

```html
<app-card
  [formGroupName]="groupIndex"
  cdkDrag
  variant="default"
  [hover]="true"
  class="w-full cursor-move border-2 group-card"
  ...
```

**Step 2: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Test group drag animation**

Drag a group, verify it animates smoothly like DPM items

**Step 4: Commit**

```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.html
git commit -m "feat: add animation class for group dragging"
```

---

### Task 5.3: Add Save Validation Feedback

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.ts`

**Step 1: Update save method to scroll to first error**

Modify the `save()` method to handle validation errors:

```typescript
save() {
  // Check for validation errors first
  if (!this.dpmEditForm.valid || this.formHasNonFormGroupErrors()) {
    const errorCount = this.getTotalErrorCount();
    this.notificationService.showError(
      `${errorCount} ${errorCount === 1 ? 'error' : 'errors'} found. Please fix before saving.`,
      'Validation Error'
    );
    this.scrollToFirstError();
    return;
  }

  this.isSaving.set(true);
  // ... rest of existing save logic
}

private getTotalErrorCount(): number {
  let count = 0;
  this.groupsFormArray.controls.forEach(groupControl => {
    count += this.getGroupErrorCount(groupControl);
  });
  return count;
}

private scrollToFirstError() {
  for (const groupControl of this.groupsFormArray.controls) {
    if (this.groupHasErrors(groupControl) || this.dpmsInGroupHaveErrors(groupControl)) {
      const groupId = groupControl.value.id;
      const element = document.getElementById(`dpmGroupName-${groupId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Highlight the group card
        const card = element.closest('app-card');
        if (card) {
          card.classList.add('dpm-highlight-pulse');
          setTimeout(() => card.classList.remove('dpm-highlight-pulse'), 300);
        }
      }
      break;
    }
  }
}
```

**Step 2: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Test validation feedback**

Create a validation error (empty name), click Save
Expected: Toast shows error count, scrolls to first error, highlights group

**Step 4: Commit**

```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.ts
git commit -m "feat: add save validation feedback with scroll-to-error"
```

---

## Phase 6: Final Polish

### Task 6.1: Update DPM Row Layout to Grid

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.html`

**Step 1: Update DPM row structure to use grid**

Replace the current DPM row flex layout with the grid layout matching headers:

```html
<div class="dpm-type-box" cdkDrag [formGroupName]="dpmIndex">
  <div class="dpm-data-row">
    <!-- Drag Handle -->
    <div class="text-base-content/30 cursor-move flex items-center justify-center" cdkDragHandle>
      <i class="pi pi-ellipsis-v text-sm"></i>
    </div>

    <!-- Name -->
    <div>
      <textarea
        appAutoResize
        id="dpmName-{{ dpmControl.value.id }}"
        class="form-textarea w-full min-h-0 resize-none"
        placeholder="DPM Name"
        formControlName="name"
        [ngClass]="{
          'form-textarea-error':
            dpmHasErrors(dpmControl, 'name') ||
            dpmNameIsDuplicated(groupControl, dpmControl)
        }"
      ></textarea>
    </div>

    <!-- Points -->
    <div class="flex items-center gap-1">
      <span
        class="text-sm font-medium"
        [ngClass]="{
          'points-positive': dpmControl.value.points > 0,
          'points-negative': dpmControl.value.points < 0,
          'points-zero': dpmControl.value.points === 0
        }"
      >
        {{ dpmControl.value.points | pointsDisplay }}
      </span>
      <input
        id="dpmPoints-{{ dpmControl.value.id }}"
        class="form-input form-input-sm w-14"
        formControlName="points"
        type="number"
        [ngClass]="{
          'form-input-error': dpmHasErrors(dpmControl, 'points')
        }"
      />
    </div>

    <!-- Color -->
    <app-color-dropdown
      [colors]="dpmColors()"
      [selectedColor]="dpmColors() | colorById:dpmControl.value.color?.colorId"
      [usedColorIds]="getUsedColorIds(dpmControl.value.id)"
      (colorSelected)="onColorSelected(dpmControl, $event)"
    />

    <!-- Actions -->
    <div class="flex justify-center">
      <app-button
        variant="ghost"
        size="sm"
        type="button"
        (click)="confirmRemoveDpmFromGroup(groupControl, dpmIndex)"
        appTooltip="Delete DPM"
        tooltipPosition="top"
      >
        <i class="pi pi-trash text-xs"></i>
      </app-button>
    </div>
  </div>

  <!-- Error Messages -->
  @if (getDpmErrorMessages(groupControl, dpmControl).length > 0) {
    <div class="mt-2 pl-8">
      @for (errorMessage of getDpmErrorMessages(groupControl, dpmControl); track errorMessage) {
        <p class="text-error text-sm flex items-center gap-1">
          <i class="pi pi-exclamation-circle"></i>
          {{ errorMessage }}
        </p>
      }
    </div>
  }
</div>
```

**Step 2: Verify the build compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Visually verify layout alignment**

Expected: Columns align with headers

**Step 4: Commit**

```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.html
git commit -m "refactor: update DPM row to grid layout matching headers"
```

---

### Task 6.2: Visual QA and Final Adjustments

**Files:**
- Various CSS adjustments as needed

**Step 1: Run full visual QA checklist**

Use Chrome DevTools to verify:
- [ ] All inputs have visible borders
- [ ] Column headers align with data
- [ ] Color swatches display correctly
- [ ] Points show +/- with correct colors
- [ ] Error badges appear on groups with errors
- [ ] Sticky save bar works on desktop and mobile
- [ ] Reset button always visible (disabled when pristine)
- [ ] Drag-drop animations work for both groups and DPMs
- [ ] Adding DPM scrolls and highlights
- [ ] Save validation shows toast and scrolls to error

**Step 2: Fix any alignment/spacing issues found**

**Step 3: Final commit**

```bash
git add -A
git commit -m "style: final visual polish and alignment fixes"
```

---

### Task 6.3: Update Component Tests

**Files:**
- Modify: `src/app/dpms/edit-dpms/edit-dpms.component.spec.ts`

**Step 1: Update tests for removed modal**

Remove tests related to color modal, add tests for:
- Color dropdown integration
- Error badge display
- Scroll-to-new behavior
- Save validation feedback

**Step 2: Run tests**

Run: `npm test`
Expected: All tests pass

**Step 3: Commit**

```bash
git add src/app/dpms/edit-dpms/edit-dpms.component.spec.ts
git commit -m "test: update component tests for redesign"
```

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1 | 1.1-1.4 | CSS foundation (utility classes, animations, sticky bar fix) |
| 2 | 2.1-2.4 | Structural HTML (reset button, input styling, headers, error badge) |
| 3 | 3.1-3.2 | Points display with +/- prefix and colors |
| 4 | 4.1-4.3 | Color dropdown component (create, integrate, remove modal) |
| 5 | 5.1-5.3 | Feedback & animations (scroll-to-new, group drag, save validation) |
| 6 | 6.1-6.3 | Final polish (grid layout, QA, tests) |

**Total Tasks:** 16
**Estimated Commits:** 16-18
