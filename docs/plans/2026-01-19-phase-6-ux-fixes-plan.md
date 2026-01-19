# Phase 6: UX Fixes & Redesigns Plan

**Date:** 2026-01-19
**Branch:** trusting-villani
**Status:** Proposed

## Executive Summary

This plan addresses 15+ identified UX issues across the UTS DPM application. Issues are categorized by fix complexity, with recommendations for which components need quick fixes versus complete redesigns.

## Issue Categories

### Tier 1: Quick CSS Fixes (30 min total)

| # | Issue | Solution | Files |
|---|-------|----------|-------|
| 1.1 | Row hover not working | Use static classes with CSS variable toggle | `data-table.component.html`, `styles.css` |
| 1.2 | Select arrow spacing | Reduce padding-right from 2.5rem to 2rem | `styles.css` |
| 1.3 | Error text too small | Change `text-xs` to `text-sm` + add error icon | Multiple components |
| 1.4 | Drag placeholder invisible | Change `opacity: 0` to `opacity: 0.4` + dashed border | `edit-dpms.component.css` |

### Tier 2: Component Fixes (2-3 hours total)

| # | Issue | Solution | Files |
|---|-------|----------|-------|
| 2.1 | Pagination buttons verbose | Replace text with icons (chevrons/bars) | `data-table.component.html` |
| 2.2 | Page size flicker | Batch state updates with `queueMicrotask` | `data-table.component.ts` |
| 2.3 | Navbar active unreadable | Use primary-100 bg with primary-700 text | `navbar.component.html` |
| 2.4 | DPMs tab not loading | Trigger load on tab activation via `activeIndex` change | `user-detail.component.ts` |
| 2.5 | Confirm-box button order | Flip to primary confirm, ghost cancel | `confirm-box.component.html` |

### Tier 3: Major Redesigns (4-6 hours total)

| # | Component | Redesign Scope |
|---|-----------|----------------|
| 3.1 | **Edit DPM Types Page** | Complete UX overhaul |
| 3.2 | **Color Selection Modal** | Visual swatch grid |
| 3.3 | **Users Actions Tab** | Card-based actions |

---

## Detailed Specifications

### Tier 1: Quick CSS Fixes

#### 1.1 Row Hover Fix

**Problem:** Tailwind JIT doesn't see `[class.hover:...]` bindings.

**Solution:** Use a static `row-hoverable` class that applies hover via CSS custom properties.

```css
/* Add to styles.css */
.row-hoverable {
  transition: background-color var(--transition-fast);
}
.row-hoverable:hover {
  background-color: var(--color-primary-50);
}
@media (prefers-color-scheme: dark) {
  .row-hoverable:hover {
    background-color: oklch(0.25 0.04 268.94 / 0.3);
  }
}
```

```html
<!-- In data-table.component.html -->
<tr class="border-t ... row-hoverable cursor-pointer">
```

#### 1.2 Select Arrow Spacing

**Problem:** Arrow too close to right edge.

```css
/* Change in styles.css */
.form-select {
  padding: 0.625rem 2rem 0.625rem 0.875rem; /* was 2.5rem */
  background-position: right 0.5rem center; /* was 0.75rem */
}
```

#### 1.3 Error Text Enhancement

**Problem:** `text-xs` is hard to read.

**Solution:** Change to `text-sm` and add warning icon prefix.

```html
<p class="text-error text-sm flex items-center gap-1">
  <i class="pi pi-exclamation-circle"></i>
  {{ errorMessage }}
</p>
```

#### 1.4 Drag Placeholder Visibility

**Problem:** `opacity: 0` makes placeholder invisible.

```css
/* Change in edit-dpms.component.css */
.cdk-drag-placeholder {
  opacity: 0.5;
  border: 2px dashed var(--color-primary-400);
  border-radius: 8px;
  background: var(--color-primary-50);
}
```

---

### Tier 2: Component Fixes

#### 2.1 Pagination Button Icons

**Current:** "First Page", "Previous Page", "Next Page", "Last Page"

**New:** Use PrimeIcons for compact buttons

```html
<!-- First -->
<button aria-label="First page">
  <i class="pi pi-angle-double-left"></i>
</button>

<!-- Previous -->
<button aria-label="Previous page">
  <i class="pi pi-angle-left"></i>
</button>

<!-- Next -->
<button aria-label="Next page">
  <i class="pi pi-angle-right"></i>
</button>

<!-- Last -->
<button aria-label="Last page">
  <i class="pi pi-angle-double-right"></i>
</button>
```

Button sizing: `w-9 h-9` consistent with page number buttons.

#### 2.2 Page Size Flicker Fix

**Problem:** Synchronous `currentPage.set(0)` causes double render.

**Solution:** Batch updates using microtask.

```typescript
onRowsChange(event: Event): void {
  const select = event.target as HTMLSelectElement;
  const newRows = parseInt(select.value, 10);

  // Batch updates to prevent flicker
  queueMicrotask(() => {
    this.currentRows.set(newRows);
    this.currentPage.set(0);
    this.emitPageChange();
  });
}
```

#### 2.3 Navbar Active State

**Problem:** White bg on dark gradient navbar creates poor contrast.

**Solution:** Use semi-transparent primary tint.

```html
<!-- Change routerLinkActive classes -->
routerLinkActive="bg-primary-100/90 text-primary-700 font-semibold shadow-sm"
```

For dark mode, use:
```html
dark:bg-primary-900/50 dark:text-primary-200
```

#### 2.4 DPMs Tab Load Fix

**Problem:** `lazyLoadEvent` only fires on pagination, not tab switch.

**Solution:** Trigger initial load when tab becomes active.

```typescript
// Add to user-detail.component.ts
activeTabIndex = signal(0);

onTabChange(index: number): void {
  this.activeTabIndex.set(index);

  // Load DPMs when switching to DPMs tab (index 1)
  if (index === 1 && this.dpms().length === 0 && !this.loadingDpms()) {
    this.loadDpms({ first: 0, rows: this.dpmRows() });
  }
}
```

#### 2.5 Confirm-Box Button Order

**Problem:** Cancel is primary, Confirm is ghost (backwards).

**Solution:** Flip the order and use semantic colors.

```html
<div modal-footer class="flex justify-end gap-2">
  <app-button variant="ghost" (click)="cancel()">
    Cancel
  </app-button>
  <app-button
    [variant]="isDestructive ? 'outline' : 'primary'"
    [class]="isDestructive ? 'border-error-500 text-error-600 hover:bg-error-50' : ''"
    (click)="confirm()"
  >
    {{ confirmText || 'Confirm' }}
  </app-button>
</div>
```

---

### Tier 3: Major Redesigns

#### 3.1 Edit DPM Types Page Redesign

**Current Issues:**
1. Textareas grow unbounded
2. Color indication is just a border
3. Drag placeholder invisible
4. Save button at bottom
5. Color modal is ugly dropdown
6. Error states hard to read

**Proposed Design:**

##### Layout Changes
- **Sticky Save Bar:** Fixed at bottom of viewport with shadow
- **Inline Color Indicators:** Colored circle/pill next to each DPM
- **Constrained Textareas:** Max height of 4 lines, scrollable

##### Component Structure
```
┌────────────────────────────────────────────────────┐
│ Edit DPM Types                        [+ Add Group]│
├────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────┐   │
│ │ ≡ Safety Violations              [+ Add DPM] │   │
│ ├──────────────────────────────────────────────┤   │
│ │ ⋮ ● Late Arrival          [-5 pts] 🎨 🗑    │   │
│ │ ⋮ ● Missed Safety Check   [-10 pts] 🎨 🗑   │   │
│ └──────────────────────────────────────────────┘   │
│                                                    │
│ ┌──────────────────────────────────────────────┐   │
│ │ ≡ Positive Actions               [+ Add DPM] │   │
│ ├──────────────────────────────────────────────┤   │
│ │ ⋮ ● Extra Shift Pickup    [+15 pts] 🎨 🗑   │   │
│ └──────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────┤
│ ██████████████ Save Changes ██████████████████████ │ <- Sticky
└────────────────────────────────────────────────────┘
```

##### Visual Changes
- **Color Indicator:** Filled circle (12px) before DPM name
- **Points Badge:** Pill-shaped badge with positive (green) / negative (red) color
- **Drag Handle:** Visible on hover, clear affordance
- **Drag Placeholder:** Dashed border + light fill + "Drop here" text

##### CSS for Sticky Save
```css
.sticky-save-bar {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: var(--color-base-100);
  border-top: 1px solid var(--color-neutral-200);
  box-shadow: 0 -4px 6px -1px rgb(0 0 0 / 0.1);
  z-index: 10;
}
```

#### 3.2 Color Selection Modal Redesign

**Current:** Plain `<select>` dropdown.

**Proposed:** Visual swatch grid.

```
┌─────────────────────────────────────────┐
│ Select Color for "Late Arrival"        │
├─────────────────────────────────────────┤
│ Currently: ● Red (#ef4444)              │
│                                         │
│ ○ None (no color)                       │
│                                         │
│ Available Colors:                       │
│ ┌────┬────┬────┬────┬────┐             │
│ │ 🔴 │ 🟠 │ 🟡 │ 🟢 │ 🔵 │             │
│ ├────┼────┼────┼────┼────┤             │
│ │ 🟣 │ ⚫ │ ⚪ │ 🟤 │ 🩷 │             │
│ └────┴────┴────┴────┴────┘             │
│                                         │
│ ⚠ Red is in use by "Safety Violation"  │
├─────────────────────────────────────────┤
│                    [Cancel] [Apply]     │
└─────────────────────────────────────────┘
```

##### Implementation
```html
<div class="grid grid-cols-5 gap-3 p-4">
  @for (color of dpmColors(); track color.colorId) {
    <button
      type="button"
      class="w-12 h-12 rounded-lg border-2 transition-all"
      [class]="selectedColor()?.colorId === color.colorId
        ? 'border-primary-500 ring-2 ring-primary-500/30 scale-110'
        : 'border-transparent hover:scale-105'"
      [style.background-color]="color.hexCode"
      [disabled]="colorInUse(color)"
      (click)="selectColor(color)"
    >
      @if (colorInUse(color)) {
        <i class="pi pi-lock text-white/70"></i>
      }
    </button>
  }
</div>
```

#### 3.3 Users Actions Tab Redesign

**Current:** Text links in a modal.

**Proposed:** Action cards in the tab content.

```
┌────────────────────────────────────────────────────┐
│ User Actions                                       │
├────────────────────────────────────────────────────┤
│ ┌──────────────────┐  ┌──────────────────┐        │
│ │ 📧               │  │ 🔄               │        │
│ │ Send Points      │  │ Reset Points     │        │
│ │ Email            │  │ Balance          │        │
│ │                  │  │                  │        │
│ │ Email all users  │  │ Set all user     │        │
│ │ their current    │  │ points to zero.  │        │
│ │ point balance.   │  │ Cannot be undone.│        │
│ │                  │  │                  │        │
│ │ [Send Email]     │  │ [Reset Points]   │        │
│ └──────────────────┘  └──────────────────┘        │
└────────────────────────────────────────────────────┘
```

Each card:
- Icon at top (40px, primary tint background)
- Title (semibold, text-lg)
- Description (text-sm, muted)
- Action button at bottom

---

## Implementation Order

### Wave 1: Quick Wins (Tier 1)
1. Row hover CSS fix
2. Select arrow spacing
3. Error text enhancement
4. Drag placeholder visibility

### Wave 2: Component Fixes (Tier 2)
5. Pagination icon buttons
6. Page size flicker fix
7. Navbar active state
8. DPMs tab load trigger
9. Confirm-box button order

### Wave 3: Redesigns (Tier 3)
10. Edit DPM Types sticky save bar
11. Edit DPM Types inline color indicators
12. Color selection modal swatch grid
13. Edit DPM Types textarea constraints
14. Users Actions card layout

---

## Estimated Effort

| Wave | Tasks | Time |
|------|-------|------|
| Wave 1 | 4 tasks | 30 min |
| Wave 2 | 5 tasks | 2 hours |
| Wave 3 | 5 tasks | 4 hours |
| **Total** | **14 tasks** | **~6.5 hours** |

---

## Success Criteria

1. All data table rows show hover feedback
2. Pagination buttons are icon-only and compact
3. Page size changes without flicker
4. Edit DPM Types page is usable without scrolling to save
5. Color selection shows visual swatches
6. Drag/drop shows clear feedback
7. Error messages are readable
8. DPMs tab loads on first visit
9. All forms follow consistent styling

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Sticky save may overlap content on small screens | Add padding-bottom to scroll area |
| Color swatches may not fit all colors | Use scrollable grid or pagination |
| Icon-only buttons may confuse users | Add tooltips to all buttons |

---

## Approval Needed

- [ ] Proceed with Wave 1 (Quick Wins)
- [ ] Proceed with Wave 2 (Component Fixes)
- [ ] Proceed with Wave 3 (Redesigns)
- [ ] Alternative: Different approach for specific items

