# Edit DPM Page Redesign

**Date:** 2026-01-19
**Status:** Approved
**Component:** `src/app/dpms/edit-dpms/`

## Overview

Redesign the edit DPM page to improve usability, visual clarity, and feedback for infrequent admin users. The page manages groups of DPM types where each DPM has a name, point value, and optional color assignment for WhenToWork integration.

### Design Principles

- **Clear affordances** — Obvious what's editable vs static
- **Consistent feedback** — All actions produce visible responses
- **Scannable layout** — Column headers and visual hierarchy
- **Always accessible** — Save/reset available without scrolling

## Root Causes Addressed

| Issue | Root Cause | Solution |
|-------|-----------|----------|
| Fields look non-editable | Ghost styling (transparent borders) | Visible bordered inputs |
| Column purpose unclear | No headers | Header row per group |
| Color hidden | Only shown on button border | Dedicated color column with swatches |
| Group names seem static | Ghost textarea styling | Bordered input, larger font |
| Points lack context | Raw numbers displayed | +/- prefix with color coding |
| Save button inaccessible | Static positioning on desktop | Sticky bar on all viewports |
| Reset causes layout shift | Hidden/shown dynamically | Always visible (disabled when pristine) |
| No feedback on add | Items added off-screen silently | Scroll-to-new + highlight animation |
| Inconsistent drag animation | Only DPM items animated | Groups get same animation |
| Poor validation indicators | Small red text only | Group error badge + inline errors |
| Color modal clunky | Modal with collapsible info | Inline dropdown with swatches |

## Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│  DPM Configuration                        [+ Add Group]     │
│  Manage DPM types and groups                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ Group Card ─────────────────────────────────────────┐  │
│  │  ≡ [Group Name_______]  ⚠️ 2 errors       [+]  [🗑]  │  │
│  │  ┌──────────────────────────────────────────────────┐│  │
│  │  │ Name             │ Points │ Color  ⓘ │ Actions  ││  │
│  │  ├──────────────────────────────────────────────────┤│  │
│  │  │ ⋮⋮ [DPM Name___] │  +2    │ 🟡 Gold  │    🗑    ││  │
│  │  │ ⋮⋮ [Another____] │  -5    │ ── None  │    🗑    ││  │
│  │  └──────────────────────────────────────────────────┘│  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│              [↺ Reset]     [💾 Save Changes]                │
└─────────────────────────────────────────────────────────────┘
```

## Component Specifications

### 1. Group Card

**Header Row:**
- Drag handle (≡ icon) for group reordering
- Group name: bordered input, `text-xl font-semibold`
- Error badge: "⚠️ N errors" when validation fails, hidden otherwise
- Add DPM button (+)
- Delete group button (🗑) — only visible when group has 0 DPMs

**Column Header:**
- Background: `bg-base-200` to distinguish from data
- Columns: Name | Points | Color | Actions
- Color column has info icon (ⓘ) with tooltip explaining WhenToWork integration

### 2. DPM Row

```
┌─────────────────────────────────────────────────────────────┐
│ ⋮⋮ │ [DPM Name input_______] │ [+2] │ 🟡 Gold ▼ │    🗑    │
└─────────────────────────────────────────────────────────────┘
```

**Drag Handle:**
- Vertical dots (⋮⋮) icon
- `cursor-move` on hover

**Name Input:**
- Visible border (not ghost)
- Auto-resize textarea behavior preserved
- Red border + background tint when invalid

**Points Display:**
- Positive: `+N` in `text-success-600` (green)
- Negative: `-N` in `text-error-600` (red)
- Zero: `0` in neutral gray
- Number input for editing

**Color Cell:**
- Shows: color swatch (circle) + color name
- Click opens inline dropdown (not modal)
- "None" shown with dash indicator

**Actions:**
- Delete button (🗑)

### 3. Color Dropdown

Replaces the current modal approach:

```
┌──────────────────────┐
│ ── None              │
│ 🔵 Aqua              │
│ ⚫ Black             │
│ 🔵 Blue              │
│ 🟡 Gold        ✓     │  ← Current selection
│ ⚪ Gray (in use)     │  ← Disabled, used by another DPM
│ ...                  │
└──────────────────────┘
```

**Behavior:**
- Selection applies immediately (no Apply/Cancel)
- Colors in use by other DPMs shown grayed with "(in use)"
- Dismisses on selection or click outside

### 4. Sticky Save Bar

```
┌─────────────────────────────────────────────────────────────┐
│              [↺ Reset]     [💾 Save Changes]                │
└─────────────────────────────────────────────────────────────┘
```

**Positioning:**
- `position: sticky; bottom: 0` on ALL viewports
- Remove the `@media (min-width: 768px)` override that makes it static

**Reset Button:**
- Always visible (eliminates layout shift)
- Disabled when form is pristine

**Save Button:**
- Disabled when: pristine, invalid, or saving
- Shows spinner + "Saving..." during save
- Brief checkmark on success

### 5. Validation Display

**Field-level:**
- Red border on invalid inputs
- Subtle red background tint on invalid rows
- Error message below row with icon

**Group-level:**
- Error badge on group header: "⚠️ N errors"
- Red accent on group card border when has errors

**Save-time:**
- On save attempt with errors: toast "N errors found — click to see first"
- Auto-scroll to first group with errors
- Highlight the group briefly

## Animations & Feedback

| Action | Feedback |
|--------|----------|
| Drag group | 250ms ease-out transition (same as DPMs) |
| Drop group/DPM | Smooth reorder animation |
| Add DPM | Scroll into view + 300ms highlight pulse |
| Delete DPM/Group | 150ms fade out |
| Save success | Toast "Changes saved" + button checkmark |
| Save failed (validation) | Toast with error count + scroll to first error |
| Save failed (server) | Error toast with message |

## CSS Changes Summary

### Remove
- Ghost styling on DPM name/points inputs
- `position: static` override on desktop for save bar
- `[hidden]` toggle on reset button

### Add
- Column header styling (`.dpm-header-row`)
- Group drag animation (match `.cdk-drag-animating`)
- Points color classes (`.points-positive`, `.points-negative`)
- Error badge styling (`.group-error-badge`)
- Highlight animation for new items (`.dpm-highlight-pulse`)
- Color swatch styling (`.color-swatch`)

### Modify
- Group name input: add visible border
- DPM inputs: add visible border (remove ghost variant)
- Save bar: sticky on all viewports
- Reset button: always render, use `[disabled]` instead of `[hidden]`

## Implementation Notes

### Breaking Changes
- Color modal replaced with inline dropdown
- Layout shift behavior changed (reset button always visible)

### Migration
- No data migration needed
- CSS-only changes for most visual updates
- Color dropdown requires new component or PrimeNG integration

### Testing Focus
- Drag-drop still works for both groups and DPMs
- Color selection persists correctly
- Validation errors display at all levels
- Scroll-to-new works when adding DPMs
- Save bar visible on mobile and desktop
- Points display correct +/- prefix and colors

## Files to Modify

| File | Changes |
|------|---------|
| `edit-dpms.component.html` | Add header rows, restructure layout, replace color modal |
| `edit-dpms.component.css` | Add animations, header styles, remove ghost overrides |
| `edit-dpms.component.ts` | Add scroll-to-new logic, update color selection, error badge logic |
| `styles.css` | Add points color classes, color swatch styles |
| New: `color-dropdown.component.ts` | Inline color picker component (optional, could use PrimeNG) |
