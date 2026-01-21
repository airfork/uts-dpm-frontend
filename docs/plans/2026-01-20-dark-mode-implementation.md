# Dark Mode Color Redesign - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement complementary purple/yellow color system where purple stays primary in both modes, dark backgrounds have purple tint, and yellow appears as intentional accents.

**Architecture:** Update CSS custom properties to remove color swap, add purple-tinted dark bases, update form inputs for consistent outlined styling, add yellow accents to badges and focus states.

**Tech Stack:** CSS custom properties, Tailwind CSS 4, Angular templates

---

## Task 1: Update Dark Mode Base Colors

**Files:**
- Modify: `src/styles.css:131-175` (media query dark mode)
- Modify: `src/styles.css:179-221` (data-theme dark mode)

**Step 1: Update the media query dark mode block**

Replace the dark mode variables in the `@media (prefers-color-scheme: dark)` block (lines 131-175) with purple-tinted bases and keep purple as primary:

```css
/* Dark theme colors - responds to system preference OR data-theme attribute */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* Purple-tinted dark backgrounds */
    --color-base-100: oklch(0.20 0.03 270);
    --color-base-200: oklch(0.24 0.025 270);
    --color-base-300: oklch(0.28 0.02 270);
    --color-base-content: oklch(0.90 0.02 270);

    /* Primary stays PURPLE - lighter shades for dark mode visibility */
    --color-primary: oklch(0.55 0.12 268.94);
    --color-primary-content: oklch(1 0 0);
    --color-primary-50: oklch(0.98 0.01 268.94);
    --color-primary-100: oklch(0.95 0.02 268.94);
    --color-primary-200: oklch(0.85 0.04 268.94);
    --color-primary-300: oklch(0.75 0.06 268.94);
    --color-primary-400: oklch(0.65 0.09 268.94);
    --color-primary-500: oklch(0.55 0.12 268.94);
    --color-primary-600: oklch(0.45 0.10 268.94);
    --color-primary-700: oklch(0.35 0.08 268.94);
    --color-primary-800: oklch(0.28 0.06 268.94);
    --color-primary-900: oklch(0.22 0.04 268.94);

    /* Secondary stays YELLOW - vibrant for accents */
    --color-secondary: oklch(0.75 0.16 53.08);
    --color-secondary-content: oklch(0.20 0.03 270);
    --color-secondary-50: oklch(0.98 0.02 53.08);
    --color-secondary-100: oklch(0.95 0.05 53.08);
    --color-secondary-200: oklch(0.90 0.10 53.08);
    --color-secondary-300: oklch(0.85 0.14 53.08);
    --color-secondary-400: oklch(0.80 0.16 53.08);
    --color-secondary-500: oklch(0.75 0.16 53.08);
    --color-secondary-600: oklch(0.65 0.15 53.08);
    --color-secondary-700: oklch(0.55 0.13 53.08);
    --color-secondary-800: oklch(0.45 0.11 53.08);
    --color-secondary-900: oklch(0.35 0.09 53.08);

    /* Neutral colors with slight purple tint for dark mode */
    --color-neutral-50: oklch(0.95 0.01 270);
    --color-neutral-100: oklch(0.90 0.01 270);
    --color-neutral-200: oklch(0.80 0.015 270);
    --color-neutral-300: oklch(0.70 0.02 270);
    --color-neutral-400: oklch(0.55 0.02 270);
    --color-neutral-500: oklch(0.45 0.02 270);
    --color-neutral-600: oklch(0.38 0.02 270);
    --color-neutral-700: oklch(0.32 0.025 270);
    --color-neutral-800: oklch(0.26 0.025 270);
    --color-neutral-900: oklch(0.20 0.03 270);
  }
}
```

**Step 2: Update the data-theme="dark" block**

Replace the `[data-theme="dark"]` block (lines 179-221) with identical values:

```css
/* Manual dark mode via data-theme attribute */
:root[data-theme="dark"] {
  /* Purple-tinted dark backgrounds */
  --color-base-100: oklch(0.20 0.03 270);
  --color-base-200: oklch(0.24 0.025 270);
  --color-base-300: oklch(0.28 0.02 270);
  --color-base-content: oklch(0.90 0.02 270);

  /* Primary stays PURPLE - lighter shades for dark mode visibility */
  --color-primary: oklch(0.55 0.12 268.94);
  --color-primary-content: oklch(1 0 0);
  --color-primary-50: oklch(0.98 0.01 268.94);
  --color-primary-100: oklch(0.95 0.02 268.94);
  --color-primary-200: oklch(0.85 0.04 268.94);
  --color-primary-300: oklch(0.75 0.06 268.94);
  --color-primary-400: oklch(0.65 0.09 268.94);
  --color-primary-500: oklch(0.55 0.12 268.94);
  --color-primary-600: oklch(0.45 0.10 268.94);
  --color-primary-700: oklch(0.35 0.08 268.94);
  --color-primary-800: oklch(0.28 0.06 268.94);
  --color-primary-900: oklch(0.22 0.04 268.94);

  /* Secondary stays YELLOW - vibrant for accents */
  --color-secondary: oklch(0.75 0.16 53.08);
  --color-secondary-content: oklch(0.20 0.03 270);
  --color-secondary-50: oklch(0.98 0.02 53.08);
  --color-secondary-100: oklch(0.95 0.05 53.08);
  --color-secondary-200: oklch(0.90 0.10 53.08);
  --color-secondary-300: oklch(0.85 0.14 53.08);
  --color-secondary-400: oklch(0.80 0.16 53.08);
  --color-secondary-500: oklch(0.75 0.16 53.08);
  --color-secondary-600: oklch(0.65 0.15 53.08);
  --color-secondary-700: oklch(0.55 0.13 53.08);
  --color-secondary-800: oklch(0.45 0.11 53.08);
  --color-secondary-900: oklch(0.35 0.09 53.08);

  /* Neutral colors with slight purple tint for dark mode */
  --color-neutral-50: oklch(0.95 0.01 270);
  --color-neutral-100: oklch(0.90 0.01 270);
  --color-neutral-200: oklch(0.80 0.015 270);
  --color-neutral-300: oklch(0.70 0.02 270);
  --color-neutral-400: oklch(0.55 0.02 270);
  --color-neutral-500: oklch(0.45 0.02 270);
  --color-neutral-600: oklch(0.38 0.02 270);
  --color-neutral-700: oklch(0.32 0.025 270);
  --color-neutral-800: oklch(0.26 0.025 270);
  --color-neutral-900: oklch(0.20 0.03 270);
}
```

**Step 3: Verify the app compiles**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Visual verification**

Open browser, toggle dark mode, verify:
- Background has subtle purple tint (not pure gray)
- Purple navbar/headers are visible (not muddy)
- Yellow secondary still vibrant

**Step 5: Commit**

```bash
git add src/styles.css
git commit -m "feat(theme): update dark mode to purple-tinted backgrounds

- Remove primary/secondary color swap in dark mode
- Add purple-tinted base colors for cohesive brand feel
- Lighten primary purple shades for visibility on dark backgrounds
- Keep yellow secondary vibrant for accent usage"
```

---

## Task 2: Update Form Input Styling

**Files:**
- Modify: `src/styles.css:1220-1255` (dpm-form-input styles)

**Step 1: Update dpm-form-input with border definitions**

Replace the `.dpm-form-input` block (lines 1220-1255) with complete border handling:

```css
/* Theme-aware input styling for forms */
.dpm-form-input {
  background-color: var(--color-neutral-50);
  border: 1px solid var(--color-neutral-300);
}

.dpm-form-input:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px oklch(from var(--color-primary-500) l c h / 0.2);
}

.dpm-form-label {
  color: var(--color-neutral-700);
}

/* Dark mode via system preference when data-theme is NOT light */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .dpm-form-input {
    background-color: var(--color-base-200);
    border-color: oklch(from var(--color-primary-400) l c h / 0.3);
  }

  :root:not([data-theme="light"]) .dpm-form-input:focus {
    border-color: var(--color-secondary-400);
    box-shadow: 0 0 0 3px oklch(from var(--color-secondary-400) l c h / 0.25);
  }

  :root:not([data-theme="light"]) .dpm-form-label {
    color: var(--color-neutral-300);
  }
}

/* Dark mode via explicit data-theme="dark" */
:root[data-theme="dark"] .dpm-form-input {
  background-color: var(--color-base-200);
  border-color: oklch(from var(--color-primary-400) l c h / 0.3);
}

:root[data-theme="dark"] .dpm-form-input:focus {
  border-color: var(--color-secondary-400);
  box-shadow: 0 0 0 3px oklch(from var(--color-secondary-400) l c h / 0.25);
}

:root[data-theme="dark"] .dpm-form-label {
  color: var(--color-neutral-300);
}

/* Force light mode when data-theme="light" regardless of system preference */
:root[data-theme="light"] .dpm-form-input {
  background-color: var(--color-neutral-50);
  border-color: var(--color-neutral-300);
}

:root[data-theme="light"] .dpm-form-input:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px oklch(from var(--color-primary-500) l c h / 0.2);
}

:root[data-theme="light"] .dpm-form-label {
  color: var(--color-neutral-700);
}
```

**Step 2: Verify build succeeds**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git add src/styles.css
git commit -m "feat(forms): add consistent border styling for dark mode

- Define border color in dpm-form-input class
- Add yellow focus rings for dark mode (accent color)
- Purple-tinted subtle borders match new dark theme"
```

---

## Task 3: Remove Hardcoded Borders from New DPM Form

**Files:**
- Modify: `src/app/dpms/new-dpm/new-dpm.component.html`

**Step 1: Remove hardcoded border-neutral-200 from select element**

Find and update the DPM Type select (around line 193):

Change:
```html
class="w-full px-4 py-2.5 pr-10 rounded-lg dpm-form-input border border-neutral-200 text-base-content shadow-sm...
```

To:
```html
class="w-full px-4 py-2.5 pr-10 rounded-lg dpm-form-input text-base-content shadow-sm...
```

**Step 2: Remove hardcoded border-neutral-200 from notes input**

Find and update the Additional Notes input (around line 219):

Change:
```html
class="w-full px-4 py-2.5 rounded-lg dpm-form-input border border-neutral-200 text-base-content placeholder:text-neutral-400 shadow-sm...
```

To:
```html
class="w-full px-4 py-2.5 rounded-lg dpm-form-input text-base-content placeholder:text-neutral-400 shadow-sm...
```

**Step 3: Verify build succeeds**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/app/dpms/new-dpm/new-dpm.component.html
git commit -m "fix(new-dpm): remove hardcoded border colors from form inputs

Let dpm-form-input class handle border colors for consistent
light/dark mode styling"
```

---

## Task 4: Remove Hardcoded Borders from User Form

**Files:**
- Modify: `src/app/users/user-form/user-form.component.html`

**Step 1: Remove hardcoded border-neutral-200 from manager select**

Find the manager select (around line 114):

Change:
```html
class="w-full px-4 py-2.5 pr-10 rounded-lg dpm-form-input border border-neutral-200 text-base-content shadow-sm...
```

To:
```html
class="w-full px-4 py-2.5 pr-10 rounded-lg dpm-form-input text-base-content shadow-sm...
```

**Step 2: Remove hardcoded border-neutral-200 from role select**

Find the role select (around line 140):

Change:
```html
class="w-full px-4 py-2.5 pr-10 rounded-lg dpm-form-input border border-neutral-200 text-base-content shadow-sm...
```

To:
```html
class="w-full px-4 py-2.5 pr-10 rounded-lg dpm-form-input text-base-content shadow-sm...
```

**Step 3: Verify build succeeds**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/app/users/user-form/user-form.component.html
git commit -m "fix(user-form): remove hardcoded border colors from selects

Let dpm-form-input class handle border colors for consistent
light/dark mode styling"
```

---

## Task 5: Add Yellow Accent to Default Stat Card

**Files:**
- Modify: `src/app/ui/stat-card/stat-card.component.ts`

**Step 1: Update default variant to use yellow accent**

In `stat-card.component.ts`, update the `containerClasses` computed property (around line 19):

Change:
```typescript
const variantClasses: Record<StatCardVariant, string> = {
  default: 'bg-white/10 border-white/20',
```

To:
```typescript
const variantClasses: Record<StatCardVariant, string> = {
  default: 'bg-secondary-500/15 border-secondary-400/30',
```

**Step 2: Update default title color for better contrast**

Update the `titleClasses` computed property (around line 31):

Change:
```typescript
const variantClasses: Record<StatCardVariant, string> = {
  default: 'text-white/70',
```

To:
```typescript
const variantClasses: Record<StatCardVariant, string> = {
  default: 'text-secondary-100',
```

**Step 3: Verify build succeeds**

Run: `npm run build`
Expected: Build succeeds

**Step 4: Commit**

```bash
git add src/app/ui/stat-card/stat-card.component.ts
git commit -m "feat(stat-card): add yellow accent to default variant

Brings secondary color into hero section for better color presence"
```

---

## Task 6: Update Home Page Badges to Use Yellow for Positive

**Files:**
- Modify: `src/styles.css:2503-2511` (home-badge-positive)
- Modify: `src/styles.css:2589-2597` (dark mode badge styles)
- Modify: `src/styles.css:2626-2634` (media query badge styles)

**Step 1: Update light mode positive badge to yellow**

Find `.home-badge-positive` (around line 2503) and change:

```css
.home-badge-positive {
  background: var(--color-success-100);
  color: var(--color-success-700);
}
```

To:
```css
.home-badge-positive {
  background: var(--color-secondary-100);
  color: var(--color-secondary-700);
}
```

**Step 2: Update data-theme dark mode positive badge**

Find `:root[data-theme="dark"] .home-badge-positive` (around line 2589) and change:

```css
:root[data-theme="dark"] .home-badge-positive {
  background: var(--color-success-900);
  color: var(--color-success-300);
}
```

To:
```css
:root[data-theme="dark"] .home-badge-positive {
  background: var(--color-secondary-900);
  color: var(--color-secondary-300);
}
```

**Step 3: Update media query dark mode positive badge**

Find the media query version (around line 2626) and change:

```css
:root:not([data-theme="light"]) .home-badge-positive {
  background: var(--color-success-900);
  color: var(--color-success-300);
}
```

To:
```css
:root:not([data-theme="light"]) .home-badge-positive {
  background: var(--color-secondary-900);
  color: var(--color-secondary-300);
}
```

**Step 4: Verify build succeeds**

Run: `npm run build`
Expected: Build succeeds

**Step 5: Commit**

```bash
git add src/styles.css
git commit -m "feat(home): use yellow for positive point badges

Yellow accent for positive points creates visual distinction
and brings secondary color presence to the home page"
```

---

## Task 7: Visual Verification and Final Testing

**Step 1: Start the dev server**

Run: `npm start`

**Step 2: Test light mode**

Verify in browser:
- [ ] Forms have visible neutral borders
- [ ] Focus states show purple ring
- [ ] Positive badges are yellow
- [ ] Stat cards in hero have yellow tint
- [ ] Purple navbar and primary buttons look correct

**Step 3: Toggle to dark mode**

Verify:
- [ ] Background has subtle purple tint (not pure black/gray)
- [ ] Forms have subtle purple-tinted borders
- [ ] Focus states show yellow ring
- [ ] Purple elements are visible (not muddy)
- [ ] Yellow accents pop against purple-tinted background
- [ ] Color stripes on cards/rows are visible

**Step 4: Test specific pages**

Navigate to:
- `/home` - Check stat cards, DPM badges, table rows
- `/dpms/create` - Check form inputs, selects, focus states
- `/users` - Check user form, action cards

**Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix(theme): address visual issues from testing"
```

---

## Success Checklist

- [ ] Dark mode backgrounds have purple tint
- [ ] Purple stays primary in both modes (no swap to yellow)
- [ ] Primary purple is visible in dark mode (lighter shades)
- [ ] Yellow appears as accent (badges, focus rings, stat cards)
- [ ] All form inputs have consistent borders in both modes
- [ ] Focus states use yellow in dark mode
- [ ] No hardcoded `border-neutral-200` in form templates
- [ ] Color stripes visible in dark mode
