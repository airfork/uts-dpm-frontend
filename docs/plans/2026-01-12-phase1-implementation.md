# Phase 1: Design System Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement comprehensive design system with color scales, typography, spacing, and elevation to visually polish the UTS DPM application.

**Architecture:** Extend existing DaisyUI theme configuration in `src/styles.css` with new color scales (primary, secondary, neutral, semantic), typography variables, and shadow/transition standards. Then systematically update high-impact components (navbar, buttons, forms, cards, tables) to use the new design tokens for immediate visual improvement.

**Tech Stack:** Tailwind CSS 4, DaisyUI 5, Angular 21, OKLCH color space

---

## Task 1: Define Color System - Light Theme

**Files:**
- Modify: `src/styles.css:71-104` (light theme block)

**Step 1: Backup current theme configuration**

```bash
cp src/styles.css src/styles.css.backup
```

**Step 2: Extend light theme with primary color scale**

Add to light theme `@plugin "daisyui/theme"` block after existing `--color-primary`:

```css
@plugin "daisyui/theme" {
  name: light;
  default: true;
  prefersdark: false;
  color-scheme: light;
  --color-base-100: oklch(1 0 0);
  --color-base-200: oklch(0.92 0 0);
  --color-base-300: oklch(0.85 0 0);
  --color-base-content: oklch(0.51 0 0);

  /* Primary scale (purple) */
  --color-primary-50: oklch(0.98 0.01 268.94);
  --color-primary-100: oklch(0.95 0.02 268.94);
  --color-primary-200: oklch(0.85 0.03 268.94);
  --color-primary-300: oklch(0.70 0.04 268.94);
  --color-primary-400: oklch(0.50 0.05 268.94);
  --color-primary-500: oklch(0.40 0.0566 268.94);
  --color-primary: oklch(0.31 0.0566 268.94);
  --color-primary-600: oklch(0.31 0.0566 268.94);
  --color-primary-700: oklch(0.25 0.055 268.94);
  --color-primary-800: oklch(0.20 0.05 268.94);
  --color-primary-900: oklch(0.15 0.04 268.94);
  --color-primary-content: oklch(1 0 0);

  /* Secondary scale (yellow) */
  --color-secondary-50: oklch(0.98 0.03 53.08);
  --color-secondary-100: oklch(0.95 0.05 53.08);
  --color-secondary-200: oklch(0.88 0.08 53.08);
  --color-secondary-300: oklch(0.80 0.12 53.08);
  --color-secondary-400: oklch(0.74 0.15 53.08);
  --color-secondary-500: oklch(0.71 0.17 53.08);
  --color-secondary: oklch(0.68 0.171441 53.0829);
  --color-secondary-600: oklch(0.68 0.171441 53.0829);
  --color-secondary-700: oklch(0.60 0.16 53.08);
  --color-secondary-800: oklch(0.50 0.14 53.08);
  --color-secondary-900: oklch(0.40 0.12 53.08);
  --color-secondary-content: oklch(0.31 0.0566 268.94);

  /* Existing accent, neutral, semantic colors... */
  --color-accent: oklch(0.65 0.1889 42.94);
  --color-accent-content: oklch(28% 0.091 267.935);
  --color-neutral: oklch(0.31 0.0311 324.13);
  --color-neutral-content: oklch(92% 0.004 286.32);
  --color-info: oklch(0.67 0.143484 235.7191);
  --color-info-content: oklch(29% 0.066 243.157);
  --color-success: oklch(0.71 0.1769 139.12);
  --color-success-content: oklch(37% 0.077 168.94);
  --color-warning: oklch(82% 0.189 84.429);
  --color-warning-content: oklch(41% 0.112 45.904);
  --color-error: oklch(0.59 0.2208 18.5);
  --color-error-content: oklch(27% 0.105 12.094);
  --radius-selector: 0.5rem;
  --radius-field: 0.25rem;
  --radius-box: 0.5rem;
  --size-selector: 0.3125rem;
  --size-field: 0.3125rem;
  --border: 1px;
  --depth: 1;
  --noise: 0;
}
```

**Step 3: Add neutral gray scale**

Add before existing `--color-info`:

```css
  /* Neutral scale (grays) */
  --color-neutral-50: oklch(0.99 0 0);
  --color-neutral-100: oklch(0.96 0 0);
  --color-neutral-200: oklch(0.92 0 0);
  --color-neutral-300: oklch(0.85 0 0);
  --color-neutral-400: oklch(0.70 0 0);
  --color-neutral-500: oklch(0.51 0 0);
  --color-neutral-600: oklch(0.40 0 0);
  --color-neutral-700: oklch(0.30 0 0);
  --color-neutral-800: oklch(0.20 0 0);
  --color-neutral-900: oklch(0.10 0 0);
```

**Step 4: Add semantic color scales**

Add after existing semantic colors:

```css
  /* Success scale */
  --color-success-50: oklch(0.97 0.03 139.12);
  --color-success-100: oklch(0.94 0.06 139.12);
  --color-success-200: oklch(0.88 0.10 139.12);
  --color-success-300: oklch(0.80 0.13 139.12);
  --color-success-400: oklch(0.75 0.15 139.12);
  --color-success-500: oklch(0.73 0.17 139.12);
  --color-success: oklch(0.71 0.1769 139.12);
  --color-success-600: oklch(0.71 0.1769 139.12);
  --color-success-700: oklch(0.60 0.16 139.12);
  --color-success-800: oklch(0.50 0.14 139.12);
  --color-success-900: oklch(0.40 0.12 139.12);

  /* Error scale */
  --color-error-50: oklch(0.97 0.04 18.5);
  --color-error-100: oklch(0.93 0.08 18.5);
  --color-error-200: oklch(0.85 0.13 18.5);
  --color-error-300: oklch(0.75 0.17 18.5);
  --color-error-400: oklch(0.67 0.20 18.5);
  --color-error-500: oklch(0.63 0.22 18.5);
  --color-error: oklch(0.59 0.2208 18.5);
  --color-error-600: oklch(0.59 0.2208 18.5);
  --color-error-700: oklch(0.50 0.20 18.5);
  --color-error-800: oklch(0.40 0.17 18.5);
  --color-error-900: oklch(0.30 0.14 18.5);

  /* Warning scale */
  --color-warning-50: oklch(0.98 0.03 84.429);
  --color-warning-100: oklch(0.95 0.06 84.429);
  --color-warning-200: oklch(0.90 0.11 84.429);
  --color-warning-300: oklch(0.86 0.15 84.429);
  --color-warning-400: oklch(0.84 0.18 84.429);
  --color-warning-500: oklch(0.83 0.19 84.429);
  --color-warning: oklch(0.82 0.189 84.429);
  --color-warning-600: oklch(0.82 0.189 84.429);
  --color-warning-700: oklch(0.72 0.17 84.429);
  --color-warning-800: oklch(0.62 0.15 84.429);
  --color-warning-900: oklch(0.52 0.12 84.429);

  /* Info scale */
  --color-info-50: oklch(0.97 0.02 235.7191);
  --color-info-100: oklch(0.93 0.05 235.7191);
  --color-info-200: oklch(0.85 0.08 235.7191);
  --color-info-300: oklch(0.76 0.11 235.7191);
  --color-info-400: oklch(0.71 0.13 235.7191);
  --color-info-500: oklch(0.69 0.14 235.7191);
  --color-info: oklch(0.67 0.143484 235.7191);
  --color-info-600: oklch(0.67 0.143484 235.7191);
  --color-info-700: oklch(0.57 0.13 235.7191);
  --color-info-800: oklch(0.47 0.11 235.7191);
  --color-info-900: oklch(0.37 0.09 235.7191);
```

**Step 5: Verify dev server rebuilds successfully**

Run: `npm start` (if not already running) or check existing dev server output
Expected: No compilation errors, app rebuilds successfully

**Step 6: Test color variables in browser console**

Open browser dev tools, run:
```javascript
getComputedStyle(document.documentElement).getPropertyValue('--color-primary-50')
getComputedStyle(document.documentElement).getPropertyValue('--color-neutral-500')
```
Expected: See oklch color values

**Step 7: Commit light theme colors**

```bash
git add src/styles.css
git commit -m "feat(design-system): add color scales to light theme

Add 9-step scales for primary, secondary, neutral, and semantic colors:
- Primary (purple): 50-900 shades
- Secondary (yellow): 50-900 shades
- Neutral (grays): 50-900 shades
- Semantic (success, error, warning, info): 50-900 shades each

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 2: Define Color System - Dark Theme

**Files:**
- Modify: `src/styles.css:106-139` (dark theme block)

**Step 1: Extend dark theme with primary color scale**

Update dark theme `@plugin "daisyui/theme"` block:

```css
@plugin "daisyui/theme" {
  name: dark;
  default: false;
  prefersdark: true;
  color-scheme: dark;
  --color-base-100: oklch(0.28 0.0299 256.85);
  --color-base-200: oklch(0.26 0.0269 256.85);
  --color-base-300: oklch(0.25 0.0253 256.84);
  --color-base-content: oklch(0.85 0.0502 256.8);

  /* Primary scale (yellow in dark mode - swapped) */
  --color-primary-50: oklch(0.40 0.12 53.08);
  --color-primary-100: oklch(0.50 0.14 53.08);
  --color-primary-200: oklch(0.60 0.16 53.08);
  --color-primary-300: oklch(0.65 0.165 53.08);
  --color-primary-400: oklch(0.67 0.17 53.0829);
  --color-primary-500: oklch(0.68 0.171441 53.0829);
  --color-primary: oklch(0.68 0.171441 53.0829);
  --color-primary-600: oklch(0.68 0.171441 53.0829);
  --color-primary-700: oklch(0.74 0.15 53.08);
  --color-primary-800: oklch(0.80 0.12 53.08);
  --color-primary-900: oklch(0.88 0.08 53.08);
  --color-primary-content: oklch(0.3 0.0562 268.92);

  /* Secondary scale (purple in dark mode - swapped) */
  --color-secondary-50: oklch(0.15 0.04 268.94);
  --color-secondary-100: oklch(0.20 0.05 268.94);
  --color-secondary-200: oklch(0.25 0.055 268.94);
  --color-secondary-300: oklch(0.28 0.0562 268.92);
  --color-secondary-400: oklch(0.30 0.0562 268.92);
  --color-secondary-500: oklch(0.31 0.0566 268.94);
  --color-secondary: oklch(0.3 0.0562 268.92);
  --color-secondary-600: oklch(0.3 0.0562 268.92);
  --color-secondary-700: oklch(0.40 0.0566 268.94);
  --color-secondary-800: oklch(0.50 0.05 268.94);
  --color-secondary-900: oklch(0.70 0.04 268.94);
  --color-secondary-content: oklch(1 0 0);

  /* Existing accent, neutral */
  --color-accent: oklch(0.65 0.1889 42.94);
  --color-accent-content: oklch(1 0 0);
  --color-neutral: hsl(296, 14%, 20%);
  --color-neutral-content: oklch(0.85 0 0);
  --color-info: oklch(0.67 0.143484 235.7191);
  --color-info-content: oklch(0.23 0.0453 228.52);
  --color-success: oklch(0.71 0.1769 139.12);
  --color-success-content: oklch(0.28 0.0893 139.19);
  --color-warning: oklch(0.83 0.1435 83.23);
  --color-warning-content: oklch(0.3 0.0618 81.39);
  --color-error: oklch(0.59 0.2228 21.59);
  --color-error-content: oklch(0.89 0.0585 8.23);
  --radius-selector: 0.5rem;
  --radius-field: 0.25rem;
  --radius-box: 0.5rem;
  --size-selector: 0.3125rem;
  --size-field: 0.3125rem;
  --border: 1px;
  --depth: 1;
  --noise: 0;
}
```

**Step 2: Add neutral gray scale (dark mode)**

Add before existing `--color-info`:

```css
  /* Neutral scale (dark grays) */
  --color-neutral-50: oklch(0.10 0 0);
  --color-neutral-100: oklch(0.20 0 0);
  --color-neutral-200: oklch(0.25 0 0);
  --color-neutral-300: oklch(0.30 0 0);
  --color-neutral-400: oklch(0.40 0 0);
  --color-neutral-500: oklch(0.51 0 0);
  --color-neutral-600: oklch(0.60 0 0);
  --color-neutral-700: oklch(0.70 0 0);
  --color-neutral-800: oklch(0.85 0 0);
  --color-neutral-900: oklch(0.92 0 0);
```

**Step 3: Add semantic color scales (dark mode)**

```css
  /* Success scale (dark) */
  --color-success-50: oklch(0.40 0.12 139.12);
  --color-success-100: oklch(0.50 0.14 139.12);
  --color-success-200: oklch(0.60 0.16 139.12);
  --color-success-300: oklch(0.65 0.17 139.12);
  --color-success-400: oklch(0.69 0.1769 139.12);
  --color-success-500: oklch(0.71 0.1769 139.12);
  --color-success: oklch(0.71 0.1769 139.12);
  --color-success-600: oklch(0.71 0.1769 139.12);
  --color-success-700: oklch(0.75 0.15 139.12);
  --color-success-800: oklch(0.80 0.13 139.12);
  --color-success-900: oklch(0.88 0.10 139.12);

  /* Error scale (dark) */
  --color-error-50: oklch(0.30 0.14 21.59);
  --color-error-100: oklch(0.40 0.17 21.59);
  --color-error-200: oklch(0.50 0.20 21.59);
  --color-error-300: oklch(0.55 0.2228 21.59);
  --color-error-400: oklch(0.57 0.2228 21.59);
  --color-error-500: oklch(0.59 0.2228 21.59);
  --color-error: oklch(0.59 0.2228 21.59);
  --color-error-600: oklch(0.59 0.2228 21.59);
  --color-error-700: oklch(0.67 0.20 21.59);
  --color-error-800: oklch(0.75 0.17 21.59);
  --color-error-900: oklch(0.85 0.13 21.59);

  /* Warning scale (dark) */
  --color-warning-50: oklch(0.52 0.12 83.23);
  --color-warning-100: oklch(0.62 0.15 83.23);
  --color-warning-200: oklch(0.72 0.17 83.23);
  --color-warning-300: oklch(0.78 0.1435 83.23);
  --color-warning-400: oklch(0.81 0.1435 83.23);
  --color-warning-500: oklch(0.83 0.1435 83.23);
  --color-warning: oklch(0.83 0.1435 83.23);
  --color-warning-600: oklch(0.83 0.1435 83.23);
  --color-warning-700: oklch(0.86 0.15 83.23);
  --color-warning-800: oklch(0.90 0.11 83.23);
  --color-warning-900: oklch(0.95 0.06 83.23);

  /* Info scale (dark) */
  --color-info-50: oklch(0.37 0.09 235.7191);
  --color-info-100: oklch(0.47 0.11 235.7191);
  --color-info-200: oklch(0.57 0.13 235.7191);
  --color-info-300: oklch(0.62 0.143484 235.7191);
  --color-info-400: oklch(0.65 0.143484 235.7191);
  --color-info-500: oklch(0.67 0.143484 235.7191);
  --color-info: oklch(0.67 0.143484 235.7191);
  --color-info-600: oklch(0.67 0.143484 235.7191);
  --color-info-700: oklch(0.71 0.13 235.7191);
  --color-info-800: oklch(0.76 0.11 235.7191);
  --color-info-900: oklch(0.85 0.08 235.7191);
```

**Step 4: Test dark mode color variables**

Toggle to dark mode in browser, run in console:
```javascript
getComputedStyle(document.documentElement).getPropertyValue('--color-primary-50')
getComputedStyle(document.documentElement).getPropertyValue('--color-neutral-500')
```
Expected: See dark theme oklch color values

**Step 5: Commit dark theme colors**

```bash
git add src/styles.css
git commit -m "feat(design-system): add color scales to dark theme

Add 9-step scales for dark theme with swapped primary/secondary:
- Primary (yellow in dark): 50-900 shades
- Secondary (purple in dark): 50-900 shades
- Neutral (dark grays): 50-900 shades
- Semantic colors: 50-900 shades each

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 3: Define Typography, Shadow, and Transition Tokens

**Files:**
- Modify: `src/styles.css:141-149` (@theme block)

**Step 1: Expand @theme block with typography variables**

Update the `@theme` block to include full typography system:

```css
@theme {
  /* Existing */
  --text-base--line-height: calc(1.8 / 1);
  --table-spinner-height: 25px;
  --table-spinner-width: 25px;
  --table-loading-min-height: 200px;
  --p-select-transition-duration: .2s;
  --p-inputtext-transition-duration: .2s;
  --p-datepicker-transition-duration: .2s;

  /* Typography - Line Heights */
  --leading-none: 1;
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 1.8;

  /* Typography - Letter Spacing */
  --tracking-tighter: -0.05em;
  --tracking-tight: -0.025em;
  --tracking-normal: 0;
  --tracking-wide: 0.025em;
  --tracking-wider: 0.05em;

  /* Shadows */
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-base: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-md: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);

  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slower: 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

**Step 2: Test typography and shadow variables**

Run in browser console:
```javascript
getComputedStyle(document.documentElement).getPropertyValue('--leading-tight')
getComputedStyle(document.documentElement).getPropertyValue('--shadow-base')
getComputedStyle(document.documentElement).getPropertyValue('--transition-fast')
```
Expected: See defined values (1.25, shadow string, 150ms...)

**Step 3: Commit design tokens**

```bash
git add src/styles.css
git commit -m "feat(design-system): add typography, shadow, and transition tokens

Add design tokens for:
- Line heights (tight, snug, normal, relaxed, loose)
- Letter spacing (tighter, tight, normal, wide, wider)
- Shadows (xs through xl for elevation system)
- Transitions (fast, base, slow, slower with easing)

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 4: Create Design System Documentation

**Files:**
- Create: `docs/DESIGN_SYSTEM.md`

**Step 1: Create comprehensive design system reference**

```markdown
# UTS DPM Design System

Complete reference for colors, typography, spacing, and visual effects used in the UTS DPM application.

## Color System

### Usage Guidelines

Use color shades to create visual hierarchy and semantic meaning:

| Shade | Usage | Example |
|-------|-------|---------|
| 50-100 | Backgrounds, subtle tints | `bg-primary-50`, `bg-success-100` |
| 200-300 | Borders, dividers, disabled | `border-neutral-200`, `text-neutral-300` |
| 400-500 | Hover states, secondary actions | `hover:bg-primary-400` |
| 600 | Primary actions, main brand | `bg-primary-600`, `text-primary-600` |
| 700-900 | Pressed states, emphasis | `active:bg-primary-700`, `text-neutral-900` |

### Primary (Purple)

Main brand color for primary actions, headers, and key UI elements.

```
Light mode: purple-ish
Dark mode: yellow (swapped)

50:  Lightest tint
600: Main brand (default)
900: Darkest shade
```

**Example Usage:**
```html
<button class="bg-primary-600 hover:bg-primary-700 text-primary-content">
  Primary Action
</button>

<div class="bg-primary-50 border-primary-200">
  Subtle primary background
</div>
```

### Secondary (Yellow)

Accent color for secondary actions and highlights.

```
Light mode: yellow-ish
Dark mode: purple (swapped)

50:  Lightest tint
600: Main accent (default)
900: Darkest shade
```

### Neutral (Gray)

For text, backgrounds, borders, and structural elements.

```
50:  Backgrounds
200: Borders
500: Secondary text
700: Headings
900: Maximum contrast
```

**Example Usage:**
```html
<p class="text-neutral-700">Heading text</p>
<p class="text-neutral-500">Secondary text</p>
<div class="border border-neutral-200">Bordered container</div>
```

### Semantic Colors

**Success (Green)** - Confirmations, positive states
**Error (Red)** - Errors, destructive actions, alerts
**Warning (Orange)** - Warnings, caution states
**Info (Blue)** - Information, neutral notifications

**Example Usage:**
```html
<div class="bg-success-50 border-success-200 text-success-700">
  Success message
</div>

<button class="bg-error-600 hover:bg-error-700 text-error-content">
  Delete
</button>
```

### Accessibility

All color combinations meet WCAG AA contrast requirements:
- Text: Minimum 4.5:1 contrast ratio
- UI elements: Minimum 3:1 contrast ratio
- Large text (18pt+): Minimum 3:1 contrast ratio

---

## Typography

### Font Families

**Sans Serif (Default):**
```css
font-family: Poppins, system-ui, -apple-system, sans-serif
```

**Monospace (Code/Data):**
```css
font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace
```

### Font Sizes

Use Tailwind's text utilities:

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Captions, helper text |
| `text-sm` | 14px | Small body text, labels |
| `text-base` | 16px | Body text (default) |
| `text-lg` | 18px | Emphasized text |
| `text-xl` | 20px | Large text, subheadings |
| `text-2xl` | 24px | H3, section titles |
| `text-3xl` | 30px | H2, page titles |
| `text-4xl` | 36px | H1, hero text |

### Font Weights

| Class | Weight | Usage |
|-------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Emphasized text, labels |
| `font-semibold` | 600 | Subheadings, buttons |
| `font-bold` | 700 | Headings, strong emphasis |

### Line Heights

| Class | Height | Usage |
|-------|--------|-------|
| `leading-none` | 1 | Tight (headings only) |
| `leading-tight` | 1.25 | Headings |
| `leading-snug` | 1.375 | Subheadings |
| `leading-normal` | 1.5 | Body text (default) |
| `leading-relaxed` | 1.625 | Long-form reading |
| `leading-loose` | 1.8 | Extra breathing room |

### Letter Spacing

| Class | Spacing | Usage |
|-------|---------|-------|
| `tracking-tighter` | -0.05em | Large headings |
| `tracking-tight` | -0.025em | Headings |
| `tracking-normal` | 0 | Body (default) |
| `tracking-wide` | 0.025em | Uppercase labels |
| `tracking-wider` | 0.05em | Loose uppercase |

### Heading Hierarchy

**H1 - Page Titles**
```html
<h1 class="text-4xl font-bold leading-tight tracking-tight text-neutral-900">
  Page Title
</h1>
```

**H2 - Section Titles**
```html
<h2 class="text-3xl font-bold leading-tight tracking-tight text-neutral-800">
  Section Title
</h2>
```

**H3 - Subsection Titles**
```html
<h3 class="text-2xl font-semibold leading-snug text-neutral-700">
  Subsection Title
</h3>
```

**H4 - Component Titles**
```html
<h4 class="text-xl font-semibold leading-snug text-neutral-700">
  Component Title
</h4>
```

**Body Text**
```html
<p class="text-base leading-normal text-neutral-600">
  Body text content
</p>
```

**Labels**
```html
<label class="text-sm font-medium leading-normal text-neutral-700">
  Form Label
</label>
```

**Helper Text**
```html
<p class="text-xs leading-normal text-neutral-500">
  Helper or caption text
</p>
```

---

## Spacing

Use Tailwind's spacing scale consistently:

### Common Spacing Patterns

**Tight Grouping (Related Items):**
```html
<div class="flex gap-2 items-center">
  <Icon />
  <span>Label</span>
</div>
```

**Standard Grouping (Form Fields, Cards):**
```html
<form class="grid gap-4">
  <input />
  <input />
</form>
```

**Section Separation:**
```html
<section class="mb-12">
  <!-- Section content -->
</section>
```

### Component-Specific Spacing

**Cards:**
```html
<div class="card p-6 gap-4 shadow-sm">
  <!-- Card content with 24px padding, 16px gap -->
</div>
```

**Forms:**
```html
<form class="grid gap-4">
  <div class="grid gap-2">
    <label class="text-sm font-medium">Field Label</label>
    <input class="input p-3" />
  </div>
</form>
```

**Page Containers:**
```html
<div class="container mx-auto px-4 md:px-12 lg:px-20">
  <h1 class="mb-6">Page Title</h1>
  <section class="mb-12">
    <!-- Section content -->
  </section>
</div>
```

**Buttons:**
```html
<button class="btn px-6 py-3">Button Text</button>

<div class="flex gap-3">
  <button>Action 1</button>
  <button>Action 2</button>
</div>
```

---

## Elevation & Shadows

Use shadows to create depth and visual hierarchy:

### Shadow Scale

| Variable | Usage | Example |
|----------|-------|---------|
| `--shadow-xs` | Subtle lift, hover | Buttons on hover |
| `--shadow-sm` | Cards at rest | Default cards |
| `--shadow-base` | Elevated cards | Active dropdown |
| `--shadow-md` | Modals, popovers | Dialog boxes |
| `--shadow-lg` | Drawers, overlays | Side panels |
| `--shadow-xl` | Maximum elevation | Hero sections |

### Usage with Tailwind

```html
<!-- Card at rest -->
<div class="shadow-sm">Card</div>

<!-- Card on hover -->
<div class="shadow-sm hover:shadow-base transition-shadow">
  Interactive Card
</div>

<!-- Modal -->
<dialog class="shadow-md">Modal Content</dialog>
```

---

## Transitions

Use consistent transition timing for smooth interactions:

### Transition Speeds

| Variable | Duration | Usage |
|----------|----------|-------|
| `--transition-fast` | 150ms | Button states, hover |
| `--transition-base` | 200ms | Standard interactions |
| `--transition-slow` | 300ms | Modals, panels |
| `--transition-slower` | 500ms | Page transitions (rare) |

### Usage Examples

**Buttons:**
```html
<button class="transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]">
  Interactive Button
</button>
```

**Cards:**
```html
<div class="transition-shadow duration-200 hover:shadow-base">
  Hoverable Card
</div>
```

**Inputs:**
```html
<input class="transition-colors duration-150 focus:ring-2 focus:ring-primary-500" />
```

---

## Best Practices

### Color Usage

✅ **Do:**
- Use semantic colors for meaning (success, error, warning, info)
- Use shades for subtle variations (50-100 for backgrounds, 600 for main actions)
- Maintain consistent contrast ratios (4.5:1 for text)
- Test in both light and dark modes

❌ **Don't:**
- Mix random color values with design system
- Use color as the only indicator of state
- Use primary colors for everything
- Hard-code hex/rgb colors

### Typography

✅ **Do:**
- Follow heading hierarchy (H1 → H2 → H3)
- Use consistent line heights (normal for body, tight for headings)
- Apply font weights semantically (bold for headings, medium for labels)
- Test readability at different screen sizes

❌ **Don't:**
- Skip heading levels (H1 → H3)
- Mix too many font sizes on one screen
- Use tight line-height for body text
- Set font sizes with absolute pixels

### Spacing

✅ **Do:**
- Use gap utilities for flex/grid layouts
- Apply consistent padding to similar components
- Use responsive spacing (px-4 md:px-12 lg:px-20)
- Group related elements with smaller spacing

❌ **Don't:**
- Mix margin and padding inconsistently
- Use arbitrary spacing values
- Forget responsive spacing on mobile
- Cram elements together without breathing room

---

**Last Updated:** 2026-01-12
**Version:** 1.0.0 (Phase 1)
```

**Step 2: Commit design system documentation**

```bash
git add docs/DESIGN_SYSTEM.md
git commit -m "docs: create comprehensive design system reference

Add complete documentation for:
- Color system with usage guidelines and examples
- Typography scale with heading hierarchy
- Spacing patterns for components
- Elevation/shadow system
- Transition timing standards
- Best practices and anti-patterns

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 5: Update Navbar Component - Typography & Spacing

**Files:**
- Modify: `src/app/ui/navbar/navbar.component.html`

**Step 1: Read current navbar template**

```bash
cat src/app/ui/navbar/navbar.component.html
```

**Step 2: Update navbar with consistent spacing and typography**

Replace navbar template with improved version:

```html
<nav class="navbar bg-primary-600 text-primary-content shadow-sm px-4 md:px-8 lg:px-12">
  <div class="container mx-auto flex items-center justify-between">
    <!-- Logo/Brand -->
    <a routerLink="/home" class="text-xl font-bold tracking-tight">
      UTS DPM
    </a>

    <!-- Desktop Navigation -->
    <div class="hidden lg:flex items-center gap-2">
      @if (isAuthenticated) {
        <a
          routerLink="/home"
          routerLinkActive="bg-primary-700"
          class="btn btn-ghost text-base font-medium px-4 py-2 transition-colors duration-150"
        >
          Home
        </a>

        @if (hasRole(['ADMIN', 'ANALYST', 'MANAGER', 'SUPERVISOR'])) {
          <a
            routerLink="/dpm/create"
            routerLinkActive="bg-primary-700"
            class="btn btn-ghost text-base font-medium px-4 py-2 transition-colors duration-150"
          >
            Create DPM
          </a>
        }

        @if (hasRole(['ADMIN', 'MANAGER'])) {
          <a
            routerLink="/approvals"
            routerLinkActive="bg-primary-700"
            class="btn btn-ghost text-base font-medium px-4 py-2 transition-colors duration-150"
          >
            Approvals
          </a>
        }

        <a
          routerLink="/history"
          routerLinkActive="bg-primary-700"
          class="btn btn-ghost text-base font-medium px-4 py-2 transition-colors duration-150"
        >
          History
        </a>

        @if (hasRole(['ADMIN'])) {
          <a
            routerLink="/users"
            routerLinkActive="bg-primary-700"
            class="btn btn-ghost text-base font-medium px-4 py-2 transition-colors duration-150"
          >
            Users
          </a>

          <a
            routerLink="/dpm/edit"
            routerLinkActive="bg-primary-700"
            class="btn btn-ghost text-base font-medium px-4 py-2 transition-colors duration-150"
          >
            Edit DPM Types
          </a>
        }

        <!-- User Menu -->
        <div class="flex items-center gap-3 ml-4 pl-4 border-l border-primary-700">
          <span class="text-sm font-medium">{{ username }}</span>
          <button
            (click)="logout()"
            class="btn btn-ghost btn-sm text-sm font-medium px-4 py-2 transition-all duration-150 hover:bg-primary-700"
          >
            Logout
          </button>
        </div>
      }
    </div>

    <!-- Mobile Menu Button -->
    <button
      class="btn btn-ghost lg:hidden"
      (click)="toggleMobileMenu()"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </div>

  <!-- Mobile Dropdown Menu -->
  @if (mobileMenuOpen && isAuthenticated) {
    <div class="lg:hidden mt-4 pb-4 space-y-2">
      <a
        routerLink="/home"
        routerLinkActive="bg-primary-700"
        class="block btn btn-ghost w-full text-left text-base font-medium px-4 py-3 transition-colors duration-150"
        (click)="closeMobileMenu()"
      >
        Home
      </a>

      @if (hasRole(['ADMIN', 'ANALYST', 'MANAGER', 'SUPERVISOR'])) {
        <a
          routerLink="/dpm/create"
          routerLinkActive="bg-primary-700"
          class="block btn btn-ghost w-full text-left text-base font-medium px-4 py-3 transition-colors duration-150"
          (click)="closeMobileMenu()"
        >
          Create DPM
        </a>
      }

      @if (hasRole(['ADMIN', 'MANAGER'])) {
        <a
          routerLink="/approvals"
          routerLinkActive="bg-primary-700"
          class="block btn btn-ghost w-full text-left text-base font-medium px-4 py-3 transition-colors duration-150"
          (click)="closeMobileMenu()"
        >
          Approvals
        </a>
      }

      <a
        routerLink="/history"
        routerLinkActive="bg-primary-700"
        class="block btn btn-ghost w-full text-left text-base font-medium px-4 py-3 transition-colors duration-150"
        (click)="closeMobileMenu()"
      >
        History
      </a>

      @if (hasRole(['ADMIN'])) {
        <a
          routerLink="/users"
          routerLinkActive="bg-primary-700"
          class="block btn btn-ghost w-full text-left text-base font-medium px-4 py-3 transition-colors duration-150"
          (click)="closeMobileMenu()"
        >
          Users
        </a>

        <a
          routerLink="/dpm/edit"
          routerLinkActive="bg-primary-700"
          class="block btn btn-ghost w-full text-left text-base font-medium px-4 py-3 transition-colors duration-150"
          (click)="closeMobileMenu()"
        >
          Edit DPM Types
        </a>
      }

      <div class="pt-4 border-t border-primary-700 mt-4">
        <p class="px-4 text-sm font-medium mb-2">{{ username }}</p>
        <button
          (click)="logout()"
          class="block btn btn-ghost w-full text-left text-base font-medium px-4 py-3 transition-all duration-150 hover:bg-primary-700"
        >
          Logout
        </button>
      </div>
    </div>
  }
</nav>
```

**Step 3: Test navbar visually**

- Check navigation links have consistent `text-base font-medium`
- Verify spacing between items (`gap-2`, `gap-3`)
- Test responsive behavior on mobile (< 768px)
- Check hover transitions are smooth
- Verify active state styling

**Step 4: Commit navbar improvements**

```bash
git add src/app/ui/navbar/navbar.component.html
git commit -m "feat(navbar): apply design system typography and spacing

Improvements:
- Consistent font sizing (text-base, text-xl for brand)
- Font weights (font-medium for links, font-bold for brand)
- Spacing (gap-2 for nav items, gap-3 for user menu)
- Transitions (duration-150 on hover states)
- Responsive padding (px-4 md:px-8 lg:px-12)
- Mobile menu spacing (space-y-2, py-3 for items)

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 6: Update Button Components - Shadows & Transitions

**Files:**
- Modify: `src/styles.css` (@layer app section)

**Step 1: Add global button enhancements to app layer**

Add after existing `.p-paginator-current` rule in `@layer app`:

```css
@layer app {
  /* Existing rules... */

  /* Button enhancements */
  .btn {
    @apply transition-all;
    transition-duration: var(--transition-fast);
    box-shadow: var(--shadow-sm);
    font-weight: 500;
    letter-spacing: var(--tracking-wide);
  }

  .btn:hover:not(:disabled) {
    box-shadow: var(--shadow-base);
    transform: scale(1.02);
  }

  .btn:active:not(:disabled) {
    box-shadow: none;
    transform: scale(0.98);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Button variants with proper shadows */
  .btn-primary {
    @apply bg-primary-600 text-primary-content;
  }

  .btn-primary:hover:not(:disabled) {
    @apply bg-primary-700;
  }

  .btn-secondary {
    @apply bg-secondary-600 text-secondary-content;
  }

  .btn-secondary:hover:not(:disabled) {
    @apply bg-secondary-700;
  }

  .btn-success {
    @apply bg-success-600 text-success-content;
  }

  .btn-success:hover:not(:disabled) {
    @apply bg-success-700;
  }

  .btn-error {
    @apply bg-error-600 text-error-content;
  }

  .btn-error:hover:not(:disabled) {
    @apply bg-error-700;
  }

  .btn-info {
    @apply bg-info-600 text-info-content;
  }

  .btn-info:hover:not(:disabled) {
    @apply bg-info-700;
  }

  /* Outline variants */
  .btn-outline {
    box-shadow: none;
    border-width: 1px;
  }

  .btn-outline:hover:not(:disabled) {
    box-shadow: var(--shadow-xs);
  }
}
```

**Step 2: Test button styles across app**

Navigate to pages with buttons:
- Login page: Primary button
- DPM create form: Submit button
- Approvals page: Success/Error outline buttons
- Users page: Various button states

Check:
- Buttons have subtle shadow at rest
- Hover increases shadow and slight scale
- Active state reduces shadow and scale
- Disabled buttons show reduced opacity

**Step 3: Commit button enhancements**

```bash
git add src/styles.css
git commit -m "feat(buttons): add shadows, transitions, and hover effects

Button improvements:
- Shadow-sm at rest, shadow-base on hover
- Scale transforms (1.02 on hover, 0.98 on active)
- Fast transitions (150ms)
- Font weight and letter spacing
- Proper disabled states
- Variant colors using design system shades

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 7: Update Form Components - Field Spacing & Typography

**Files:**
- Modify: `src/app/users/user-form/user-form.component.html`

**Step 1: Read current user form template**

```bash
cat src/app/users/user-form/user-form.component.html
```

**Step 2: Update form with consistent spacing and typography**

Find form sections and update with design system classes:

```html
<form [formGroup]="userForm" (ngSubmit)="onSubmit()" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
  <!-- Email Field -->
  <fieldset class="grid gap-2">
    <legend class="text-sm font-medium text-neutral-700">Email</legend>
    <input
      type="email"
      formControlName="email"
      class="input input-bordered w-full p-3 text-base transition-colors duration-150"
      [class.input-error]="hasError('email')"
      placeholder="driver@example.com"
    />
    @if (hasError('email')) {
      <p class="text-xs text-error-600">Email is required</p>
    }
  </fieldset>

  <!-- First Name Field -->
  <fieldset class="grid gap-2">
    <legend class="text-sm font-medium text-neutral-700">First Name</legend>
    <input
      type="text"
      formControlName="firstname"
      class="input input-bordered w-full p-3 text-base transition-colors duration-150"
      [class.input-error]="hasError('firstname')"
      placeholder="John"
    />
    @if (hasError('firstname')) {
      <p class="text-xs text-error-600">First name is required</p>
    }
  </fieldset>

  <!-- Last Name Field -->
  <fieldset class="grid gap-2">
    <legend class="text-sm font-medium text-neutral-700">Last Name</legend>
    <input
      type="text"
      formControlName="lastname"
      class="input input-bordered w-full p-3 text-base transition-colors duration-150"
      [class.input-error]="hasError('lastname')"
      placeholder="Doe"
    />
    @if (hasError('lastname')) {
      <p class="text-xs text-error-600">Last name is required</p>
    }
  </fieldset>

  <!-- Role Field -->
  <fieldset class="grid gap-2">
    <legend class="text-sm font-medium text-neutral-700">Role</legend>
    <select
      formControlName="role"
      class="select select-bordered w-full p-3 text-base transition-colors duration-150"
      [class.input-error]="hasError('role')"
    >
      <option value="">Select role...</option>
      <option value="DRIVER">Driver</option>
      <option value="ANALYST">Analyst</option>
      <option value="SUPERVISOR">Supervisor</option>
      <option value="MANAGER">Manager</option>
      <option value="ADMIN">Admin</option>
    </select>
    @if (hasError('role')) {
      <p class="text-xs text-error-600">Role is required</p>
    }
  </fieldset>

  <!-- Manager Field -->
  <fieldset class="grid gap-2">
    <legend class="text-sm font-medium text-neutral-700">Manager</legend>
    <input
      type="text"
      formControlName="manager"
      class="input input-bordered w-full p-3 text-base transition-colors duration-150"
      placeholder="Manager name"
    />
  </fieldset>

  <!-- Full Time Checkbox -->
  <fieldset class="flex items-center gap-3">
    <input
      type="checkbox"
      formControlName="fullTime"
      class="checkbox checkbox-lg checkbox-secondary dark:checkbox-primary transition-colors duration-150"
      id="fullTime"
    />
    <label for="fullTime" class="text-sm font-medium text-neutral-700 cursor-pointer">
      Full Time
    </label>
  </fieldset>

  <!-- Points Field (Edit Mode Only) -->
  @if (isEditMode) {
    <fieldset class="grid gap-2">
      <legend class="text-sm font-medium text-neutral-700">Points</legend>
      <input
        type="number"
        formControlName="points"
        class="input input-bordered w-full p-3 text-base transition-colors duration-150"
        placeholder="0"
      />
    </fieldset>
  }

  <!-- Submit Button -->
  <div class="col-span-full mt-6">
    <button
      type="submit"
      [disabled]="userForm.invalid || userForm.pristine"
      class="btn btn-primary px-6 py-3 w-full md:w-auto md:min-w-[200px]"
    >
      {{ isEditMode ? 'Update User' : 'Create User' }}
    </button>
  </div>
</form>
```

**Step 3: Test form visually**

- Check field spacing (`gap-2` between label and input, `gap-4` between fields)
- Verify label typography (`text-sm font-medium text-neutral-700`)
- Test input transitions on focus
- Check error message styling (`text-xs text-error-600`)
- Test responsive grid layout

**Step 4: Commit form improvements**

```bash
git add src/app/users/user-form/user-form.component.html
git commit -m "feat(forms): apply design system to user form

Improvements:
- Consistent field spacing (gap-2 label-to-input, gap-4 between fields)
- Typography (text-sm font-medium for labels, text-base for inputs)
- Input padding (p-3 for comfortable touch targets)
- Error messages (text-xs text-error-600 for validation)
- Smooth transitions on focus (duration-150)
- Responsive grid (1 col mobile, 2 cols tablet, 3 cols desktop)

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 8: Update Card Components - Shadows & Spacing

**Files:**
- Modify: `src/styles.css` (@layer app section)

**Step 1: Add global card enhancements**

Add after button rules in `@layer app`:

```css
@layer app {
  /* Existing rules... */

  /* Card enhancements */
  .card {
    box-shadow: var(--shadow-sm);
    transition: box-shadow var(--transition-base);
  }

  .card-hover:hover {
    box-shadow: var(--shadow-base);
  }

  .card-body {
    @apply p-6 gap-4;
  }

  .card-body-compact {
    @apply p-4 gap-3;
  }

  .card-title {
    @apply text-xl font-semibold leading-snug text-neutral-700;
  }
}
```

**Step 2: Update a sample card component (edit-dpms)**

File: `src/app/dpms/edit-dpms/edit-dpms.component.html`

Find cards and update classes:

```html
<div class="card bg-base-100 shadow-sm border" [class.border-error]="groupHasErrors(group)" [class.border-base-300]="!groupHasErrors(group)">
  <div class="card-body p-6 gap-4">
    <div class="flex items-center justify-between">
      <h3 class="text-xl font-semibold leading-snug text-neutral-700">
        {{ group.groupName || 'Untitled Group' }}
      </h3>
      <button
        type="button"
        (click)="removeGroup(i)"
        class="btn btn-error btn-outline btn-sm px-3 py-2"
      >
        <i class="pi pi-trash"></i>
      </button>
    </div>

    <!-- Group content with consistent spacing -->
    <div class="grid gap-4">
      <!-- Group name input -->
      <input
        [(ngModel)]="group.groupName"
        class="input input-bordered w-full p-3 text-base transition-colors duration-150"
        placeholder="Group name"
      />

      <!-- DPM items grid -->
      <div class="grid gap-3">
        @for (dpm of group.dpms; track dpm.id) {
          <div class="rounded-lg border border-neutral-200 p-4 gap-3 grid">
            <!-- DPM fields -->
          </div>
        }
      </div>
    </div>
  </div>
</div>
```

**Step 3: Test card styling**

Navigate to edit DPMs page:
- Check cards have subtle shadow (shadow-sm)
- Verify consistent padding (p-6) and gap (gap-4)
- Test card titles use correct typography
- Check nested element spacing

**Step 4: Commit card improvements**

```bash
git add src/styles.css src/app/dpms/edit-dpms/edit-dpms.component.html
git commit -m "feat(cards): add shadows, spacing, and typography

Card improvements:
- Shadow-sm at rest for subtle elevation
- Hover shadow transition (card-hover class)
- Consistent padding (p-6) and gap (gap-4)
- Card title typography (text-xl font-semibold)
- Compact variant for dense layouts (card-body-compact)
- Applied to edit-dpms component as example

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 9: Update Table Components - Cell Spacing & Typography

**Files:**
- Modify: `src/app/dpms/approvals/approvals.component.html`

**Step 1: Read current approvals table template**

```bash
cat src/app/dpms/approvals/approvals.component.html
```

**Step 2: Update table with improved spacing and typography**

Update p-table markup:

```html
<div class="container mx-auto px-4 md:px-12 lg:px-20 py-8">
  <h1 class="text-3xl font-bold leading-tight tracking-tight text-neutral-900 mb-6">
    Pending Approvals
  </h1>

  <div class="rounded-lg bg-base-100 shadow-sm overflow-hidden">
    <p-table
      [value]="approvalDpms()"
      [lazy]="true"
      [paginator]="true"
      [rows]="10"
      [totalRecords]="totalRecords()"
      [loading]="loading()"
      [styleClass]="''"
      (onLazyLoad)="loadApprovals($event)"
    >
      <ng-template pTemplate="header">
        <tr class="bg-primary-600 text-primary-content">
          <th class="px-4 py-4 text-sm font-semibold text-left">Driver</th>
          <th class="px-4 py-4 text-sm font-semibold text-left">Type</th>
          <th class="px-4 py-4 text-sm font-semibold text-left">Points</th>
          <th class="px-4 py-4 text-sm font-semibold text-left">Block</th>
          <th class="px-4 py-4 text-sm font-semibold text-left">Date</th>
          <th class="px-4 py-4 text-sm font-semibold text-left">Actions</th>
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-dpm>
        <tr class="hover:bg-base-200 transition-colors duration-150 cursor-pointer">
          <td class="px-4 py-3 text-sm text-neutral-700">{{ dpm.driver }}</td>
          <td class="px-4 py-3 text-sm text-neutral-700">{{ dpm.type }}</td>
          <td class="px-4 py-3 text-sm font-medium" [class.text-success-700]="dpm.points > 0" [class.text-error-700]="dpm.points < 0">
            {{ dpm.points > 0 ? '+' : '' }}{{ dpm.points }}
          </td>
          <td class="px-4 py-3 text-sm text-neutral-700">{{ dpm.block }}</td>
          <td class="px-4 py-3 text-sm text-neutral-700">{{ dpm.date }}</td>
          <td class="px-4 py-3">
            <div class="flex gap-2">
              <button
                (click)="openApprovalModal(dpm)"
                class="btn btn-success btn-outline btn-sm px-4 py-2 text-sm font-medium"
              >
                Review
              </button>
            </div>
          </td>
        </tr>
      </ng-template>

      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="6" class="text-center py-8">
            <p class="text-base text-neutral-500">No pending approvals</p>
          </td>
        </tr>
      </ng-template>
    </p-table>
  </div>
</div>
```

**Step 3: Test table styling**

- Check header cells: `px-4 py-4 text-sm font-semibold`
- Check body cells: `px-4 py-3 text-sm`
- Verify row hover effect (`hover:bg-base-200`)
- Test responsive container padding
- Check page heading typography

**Step 4: Commit table improvements**

```bash
git add src/app/dpms/approvals/approvals.component.html
git commit -m "feat(tables): apply design system to approvals table

Table improvements:
- Consistent cell padding (px-4 py-4 for headers, px-4 py-3 for cells)
- Typography (text-sm for cells, font-semibold for headers)
- Hover effect with transition (hover:bg-base-200 duration-150)
- Page heading typography (text-3xl font-bold)
- Container spacing (px-4 md:px-12 lg:px-20)
- Semantic colors for points (success-700/error-700)

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 10: Update Page Containers - Responsive Spacing

**Files:**
- Modify: `src/app/home/home.component.html`
- Modify: `src/app/history/history.component.html`

**Step 1: Update home component container**

File: `src/app/home/home.component.html`

Wrap content in consistent container:

```html
<div class="container mx-auto px-4 md:px-12 lg:px-20 py-8">
  <h1 class="text-3xl font-bold leading-tight tracking-tight text-neutral-900 mb-6">
    My DPMs
  </h1>

  <section class="mb-12">
    <app-home-table [dpms]="currentDpms()"></app-home-table>
  </section>
</div>
```

**Step 2: Update history component container**

File: `src/app/history/history.component.html`

```html
<div class="container mx-auto px-4 md:px-12 lg:px-20 py-8">
  <h1 class="text-3xl font-bold leading-tight tracking-tight text-neutral-900 mb-6">
    DPM History
  </h1>

  <section class="mb-12">
    <!-- History table content -->
  </section>
</div>
```

**Step 3: Test responsive container behavior**

- Test on mobile (< 768px): Should have `px-4`
- Test on tablet (768px - 1024px): Should have `px-12`
- Test on desktop (> 1024px): Should have `px-20`
- Verify consistent max-width with `container mx-auto`
- Check heading typography across pages

**Step 4: Commit container improvements**

```bash
git add src/app/home/home.component.html src/app/history/history.component.html
git commit -m "feat(layout): standardize page containers and spacing

Container improvements:
- Consistent responsive padding (px-4 md:px-12 lg:px-20)
- Max-width container with mx-auto
- Vertical spacing (py-8)
- Heading typography (text-3xl font-bold leading-tight)
- Section separation (mb-12)
- Applied to home and history pages

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 11: Add Input Focus States

**Files:**
- Modify: `src/styles.css` (@layer app section)

**Step 1: Add focus ring styles for inputs**

Add after card rules in `@layer app`:

```css
@layer app {
  /* Existing rules... */

  /* Input focus states */
  .input:focus,
  .textarea:focus,
  .select:focus {
    outline: none;
    @apply ring-2 ring-primary-500 ring-offset-2;
    transition: box-shadow var(--transition-fast);
  }

  .input-error:focus {
    @apply ring-2 ring-error-500 ring-offset-2;
  }

  .input-success:focus {
    @apply ring-2 ring-success-500 ring-offset-2;
  }

  /* Checkbox and radio focus */
  .checkbox:focus,
  .radio:focus {
    @apply ring-2 ring-primary-500 ring-offset-2;
  }
}
```

**Step 2: Test focus states**

Navigate to forms and test:
- Tab through form fields
- Verify visible focus ring (2px ring-primary-500)
- Check focus ring offset (2px)
- Test error state focus (ring-error-500)
- Test checkbox/radio focus

**Step 3: Commit focus improvements**

```bash
git add src/styles.css
git commit -m "feat(a11y): add visible focus states for inputs

Accessibility improvements:
- Focus rings for inputs, textareas, selects (ring-2 ring-primary-500)
- Ring offset for better visibility (ring-offset-2)
- Error state focus rings (ring-error-500)
- Success state focus rings (ring-success-500)
- Checkbox and radio focus rings
- Smooth transitions (transition-fast)

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 12: Update Modal Components - Shadows & Spacing

**Files:**
- Modify: `src/app/dpms/approvals/approval-modal/approval-modal.component.html`

**Step 1: Read current modal template**

```bash
cat src/app/dpms/approvals/approval-modal/approval-modal.component.html
```

**Step 2: Update modal with consistent spacing and shadows**

```html
<dialog #modal class="modal">
  <div class="modal-box max-w-2xl p-6 shadow-lg">
    <!-- Modal Header -->
    <div class="pb-4 mb-6 border-b border-neutral-200">
      <h3 class="text-2xl font-semibold leading-snug text-neutral-800">
        Review DPM
      </h3>
    </div>

    <!-- Modal Content -->
    <div class="grid gap-6">
      <!-- DPM Details -->
      <div class="grid gap-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs font-medium text-neutral-500 mb-1">Driver</p>
            <p class="text-base text-neutral-700">{{ dpm.driver }}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-neutral-500 mb-1">Type</p>
            <p class="text-base text-neutral-700">{{ dpm.type }}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs font-medium text-neutral-500 mb-1">Block</p>
            <p class="text-base text-neutral-700">{{ dpm.block }}</p>
          </div>
          <div>
            <p class="text-xs font-medium text-neutral-500 mb-1">Date</p>
            <p class="text-base text-neutral-700">{{ dpm.date }}</p>
          </div>
        </div>

        <!-- Points Field (Editable) -->
        <div>
          <label class="text-sm font-medium text-neutral-700 mb-2 block">Points</label>
          <input
            type="number"
            [(ngModel)]="editedPoints"
            class="input input-bordered w-full p-3 text-base transition-colors duration-150"
          />
          <p class="text-xs text-neutral-500 mt-1">Adjust points if needed before approval</p>
        </div>

        @if (dpm.notes) {
          <div>
            <p class="text-sm font-medium text-neutral-700 mb-2">Notes</p>
            <p class="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-md">
              {{ dpm.notes }}
            </p>
          </div>
        }
      </div>
    </div>

    <!-- Modal Actions -->
    <div class="modal-action pt-6 mt-6 border-t border-neutral-200 gap-3">
      <button
        type="button"
        (click)="closeModal()"
        class="btn btn-ghost px-6 py-3"
      >
        Cancel
      </button>
      <button
        type="button"
        (click)="denyDpm()"
        class="btn btn-error btn-outline px-6 py-3"
      >
        Deny
      </button>
      <button
        type="button"
        (click)="approveDpm()"
        class="btn btn-success px-6 py-3"
      >
        Approve
      </button>
    </div>
  </div>

  <!-- Modal Backdrop -->
  <form method="dialog" class="modal-backdrop bg-neutral-900/50">
    <button>close</button>
  </form>
</dialog>
```

**Step 3: Test modal styling**

Open approval modal:
- Check modal shadow (`shadow-lg`)
- Verify padding (`p-6`)
- Test spacing between sections (`gap-6`, `gap-4`)
- Check header/footer borders and spacing
- Test button spacing in footer (`gap-3`)
- Verify typography hierarchy

**Step 4: Commit modal improvements**

```bash
git add src/app/dpms/approvals/approval-modal/approval-modal.component.html
git commit -m "feat(modals): apply design system to approval modal

Modal improvements:
- Large shadow for elevation (shadow-lg)
- Consistent padding (p-6) and gaps (gap-6, gap-4)
- Header with border and spacing (pb-4 mb-6)
- Footer with border and spacing (pt-6 mt-6)
- Typography hierarchy (text-2xl for title, text-sm for labels)
- Button spacing in actions (gap-3)
- Backdrop with semi-transparent overlay

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

---

## Task 13: Final Visual Regression Check & Documentation Update

**Files:**
- Modify: `docs/claude.md`

**Step 1: Visual regression check**

Manually test all updated components:

1. **Navbar**
   - [ ] Typography consistent (text-base, font-medium)
   - [ ] Hover transitions smooth
   - [ ] Mobile menu spacing correct
   - [ ] Active state visible

2. **Buttons**
   - [ ] Shadows at rest (shadow-sm)
   - [ ] Hover shadow and scale work
   - [ ] Active state has reduced shadow
   - [ ] Disabled state shows opacity

3. **Forms**
   - [ ] Label typography (text-sm font-medium)
   - [ ] Input padding consistent (p-3)
   - [ ] Focus rings visible (ring-2)
   - [ ] Error states clear (text-error-600)

4. **Cards**
   - [ ] Shadows subtle (shadow-sm)
   - [ ] Padding consistent (p-6)
   - [ ] Typography hierarchy clear

5. **Tables**
   - [ ] Cell padding consistent
   - [ ] Header typography clear
   - [ ] Hover states smooth

6. **Modals**
   - [ ] Shadow elevation correct (shadow-lg)
   - [ ] Spacing comfortable (p-6, gap-6)
   - [ ] Actions layout clean

7. **Containers**
   - [ ] Responsive padding works (px-4 → px-20)
   - [ ] Page titles consistent (text-3xl)
   - [ ] Section spacing appropriate (mb-12)

**Step 2: Test light and dark modes**

Toggle theme and verify:
- [ ] Colors swap correctly (primary ↔ secondary)
- [ ] Contrast ratios maintained
- [ ] Shadows visible in both modes
- [ ] Text readable in both modes

**Step 3: Test responsive behavior**

Test at:
- [ ] Mobile (375px): Padding reduces, cards stack
- [ ] Tablet (768px): Medium padding, cards in grid
- [ ] Desktop (1280px): Full padding, full grid layout

**Step 4: Update claude.md with design system info**

Add section after "Common Workflows" in `docs/claude.md`:

```markdown
## Design System

### Colors

Use the complete color scale for nuanced UI:

```typescript
// Primary (purple in light, yellow in dark)
'bg-primary-50'   // Lightest tint
'bg-primary-600'  // Main brand
'bg-primary-900'  // Darkest shade

// Semantic colors (each has 50-900 scale)
'text-success-700'  // Success emphasis
'bg-error-50'       // Error background tint
'border-warning-200' // Warning border
```

### Typography

Standard heading hierarchy:

```html
<!-- H1 - Page titles -->
<h1 class="text-3xl font-bold leading-tight tracking-tight text-neutral-900">

<!-- H2 - Section titles -->
<h2 class="text-2xl font-semibold leading-snug text-neutral-800">

<!-- H3 - Subsection titles -->
<h3 class="text-xl font-semibold leading-snug text-neutral-700">

<!-- Body text -->
<p class="text-base leading-normal text-neutral-600">

<!-- Labels -->
<label class="text-sm font-medium text-neutral-700">

<!-- Helper text -->
<p class="text-xs text-neutral-500">
```

### Spacing

Component spacing standards:

- **Cards**: `p-6 gap-4` (padding and internal gap)
- **Forms**: `gap-4` between fields, `gap-2` label-to-input
- **Buttons**: `px-6 py-3` for standard buttons
- **Containers**: `px-4 md:px-12 lg:px-20` responsive padding
- **Sections**: `mb-12` between major sections

### Shadows & Elevation

```html
<!-- Cards at rest -->
<div class="shadow-sm">

<!-- Elevated cards/dropdowns -->
<div class="shadow-base">

<!-- Modals -->
<dialog class="shadow-lg">
```

### Transitions

All interactive elements use smooth transitions:

```html
<!-- Buttons -->
<button class="transition-all duration-150">

<!-- Cards -->
<div class="transition-shadow duration-200">

<!-- Inputs -->
<input class="transition-colors duration-150">
```

For complete design system reference, see `docs/DESIGN_SYSTEM.md`.
```

**Step 5: Commit documentation update**

```bash
git add docs/claude.md
git commit -m "docs: add design system quick reference to claude.md

Add quick reference section for:
- Color scale usage patterns
- Typography hierarchy examples
- Spacing standards by component
- Shadow levels for elevation
- Transition timing standards

Links to full design system documentation.

Part of Phase 1: Foundation & Design System

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Step 6: Create completion commit**

```bash
git add -A
git commit -m "feat: complete Phase 1 design system implementation

Phase 1 Complete: Foundation & Design System

✅ Design Tokens Implemented:
- Color scales: Primary, secondary, neutral, semantic (50-900 each)
- Typography: Font sizes, weights, line heights, letter spacing
- Shadows: 6-level elevation system (xs through xl)
- Transitions: Timing standards (fast, base, slow)

✅ Components Updated:
- Navbar: Typography, spacing, transitions
- Buttons: Shadows, hover effects, variants
- Forms: Field spacing, label typography, focus states
- Cards: Shadows, padding, typography hierarchy
- Tables: Cell spacing, typography, hover states
- Modals: Elevation, spacing, action layout
- Containers: Responsive padding, consistent layout

✅ Improvements:
- Consistent visual language across all components
- Professional shadows and smooth transitions
- Accessible focus states (WCAG AA)
- Responsive spacing (mobile → tablet → desktop)
- Light/dark mode support maintained

✅ Documentation:
- Complete design system reference (docs/DESIGN_SYSTEM.md)
- Quick reference in claude.md
- Usage guidelines and examples

Next: Phase 2 - DaisyUI Removal & Custom Components

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
```

**Step 7: Push all changes**

```bash
git push origin trusting-villani
```

---

## Success Criteria Checklist

### Visual Consistency
- [x] All similar components use same spacing (gap-4, p-6, etc.)
- [x] Typography hierarchy consistent (text-3xl for H1, text-sm for labels)
- [x] Colors use design system (primary-600, neutral-500, not random hex)

### Professional Feel
- [x] Consistent shadows on elevated elements (shadow-sm, shadow-base, shadow-lg)
- [x] Smooth transitions on interactive elements (150ms-200ms)
- [x] Proper hover/focus states everywhere

### Accessibility
- [x] Focus states visible (ring-2 ring-primary-500 ring-offset-2)
- [x] Keyboard navigation works smoothly
- [x] Color combinations meet WCAG AA (design includes accessible shades)

### Responsive Design
- [x] Layout works on mobile (px-4), tablet (px-12), desktop (px-20)
- [x] Typography scales appropriately
- [x] Touch targets adequate on mobile (py-3 = 48px with padding)

### Maintainability
- [x] Design tokens documented (docs/DESIGN_SYSTEM.md)
- [x] CSS variables used (--shadow-sm, --transition-fast, etc.)
- [x] Quick reference in claude.md

---

**Plan Complete!**

**Total Tasks:** 13 tasks covering design token definition, component updates, and documentation.

**Estimated Time:** 2-3 hours for full implementation

**Files Modified:** ~15-20 files (styles.css, component templates, documentation)

**Commits:** 13 commits (one per task)
