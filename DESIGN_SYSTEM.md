# UTS DPM Design System

Complete design system reference for the University of Virginia Transit Service Driver Performance Management application. This document serves as the single source of truth for all design tokens, usage patterns, and accessibility guidelines.

## Table of Contents

- [Overview](#overview)
- [Color System](#color-system)
- [Typography System](#typography-system)
- [Shadow System](#shadow-system)
- [Transition System](#transition-system)
- [Usage in Components](#usage-in-components)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)

---

## Overview

### Purpose

The UTS DPM Design System provides a comprehensive set of design tokens (colors, typography, shadows, transitions) to ensure visual consistency, maintainability, and accessibility across the entire application. By using design tokens instead of hard-coded values, we can:

- Maintain visual consistency across all components
- Enable efficient theming (light/dark mode)
- Improve accessibility (WCAG AA compliant contrast ratios)
- Simplify maintenance (update tokens in one place)
- Speed up development (pre-defined patterns)

### Architecture

Design tokens are defined as CSS custom properties in `/src/styles.css`:
- **Color tokens**: Defined in DaisyUI theme blocks (light and dark)
- **Typography tokens**: Defined in `@theme` block
- **Shadow tokens**: Defined in `@theme` block
- **Transition tokens**: Defined in `@theme` block

All tokens are accessible throughout the application via Tailwind CSS utilities or direct CSS custom property usage.

---

## Color System

### Color Philosophy

The UTS DPM color system uses **OKLCH color space** for perceptually uniform colors across light and dark themes. Each color has a **10-step scale** (50-900) providing fine-grained control over shades and tints.

**Theme Behavior:**
- **Light mode**: Purple primary, yellow secondary
- **Dark mode**: Yellow primary (swapped), purple secondary (swapped)

This swap ensures optimal contrast and readability in both themes.

### Primary Colors

**Purpose:** Main brand color for primary actions, headers, navigation, and key UI elements.

**Light Mode:** Purple (`hue: 268.94`)
**Dark Mode:** Yellow (`hue: 53.08`)

| Shade | Light Mode (Purple) | Dark Mode (Yellow) | Usage |
|-------|---------------------|---------------------|-------|
| 50 | `oklch(0.98 0.01 268.94)` | `oklch(0.98 0.02 53.08)` | Subtle backgrounds, hover states |
| 100 | `oklch(0.95 0.02 268.94)` | `oklch(0.95 0.05 53.08)` | Light backgrounds |
| 200 | `oklch(0.85 0.03 268.94)` | `oklch(0.9 0.1 53.08)` | Borders, dividers |
| 300 | `oklch(0.7 0.04 268.94)` | `oklch(0.85 0.14 53.08)` | Disabled states |
| 400 | `oklch(0.5 0.05 268.94)` | `oklch(0.75 0.16 53.08)` | Secondary actions |
| 500 | `oklch(0.4 0.0566 268.94)` | `oklch(0.68 0.171441 53.08)` | Hover states |
| 600 | `oklch(0.31 0.0566 268.94)` | `oklch(0.6 0.17 53.08)` | **Primary actions** (default) |
| 700 | `oklch(0.25 0.055 268.94)` | `oklch(0.5 0.15 53.08)` | Active/pressed states |
| 800 | `oklch(0.2 0.05 268.94)` | `oklch(0.4 0.12 53.08)` | Strong emphasis |
| 900 | `oklch(0.15 0.04 268.94)` | `oklch(0.3 0.09 53.08)` | Maximum contrast |

**Example Usage:**

```html
<!-- Primary button -->
<button class="bg-primary-600 hover:bg-primary-700 active:bg-primary-800 text-primary-content">
  Submit Form
</button>

<!-- Navbar with primary background -->
<nav class="bg-primary-600 text-primary-content">
  <a href="/home" class="hover:bg-primary-700">Home</a>
</nav>

<!-- Subtle primary card -->
<div class="bg-primary-50 border border-primary-200">
  <h3 class="text-primary-700">Highlighted Content</h3>
</div>
```

**CSS Custom Properties:**

```css
.custom-element {
  background-color: var(--color-primary-600);
  border-color: var(--color-primary-200);
  color: var(--color-primary-content);
}
```

### Secondary Colors

**Purpose:** Accent color for secondary actions, highlights, and complementary elements.

**Light Mode:** Yellow (`hue: 53.08`)
**Dark Mode:** Purple (`hue: 268.94`)

| Shade | Light Mode (Yellow) | Dark Mode (Purple) | Usage |
|-------|---------------------|---------------------|-------|
| 50 | `oklch(0.98 0.02 53.08)` | `oklch(0.98 0.01 268.94)` | Subtle backgrounds |
| 100 | `oklch(0.95 0.05 53.08)` | `oklch(0.95 0.02 268.94)` | Light backgrounds |
| 200 | `oklch(0.9 0.1 53.08)` | `oklch(0.85 0.03 268.94)` | Borders |
| 300 | `oklch(0.85 0.14 53.08)` | `oklch(0.7 0.04 268.94)` | Disabled states |
| 400 | `oklch(0.75 0.16 53.08)` | `oklch(0.5 0.05 268.94)` | Hover states |
| 500 | `oklch(0.68 0.171441 53.08)` | `oklch(0.4 0.0566 268.94)` | Default |
| 600 | `oklch(0.6 0.17 53.08)` | `oklch(0.31 0.0566 268.94)` | **Secondary actions** |
| 700 | `oklch(0.5 0.15 53.08)` | `oklch(0.25 0.055 268.94)` | Active states |
| 800 | `oklch(0.4 0.12 53.08)` | `oklch(0.2 0.05 268.94)` | Strong emphasis |
| 900 | `oklch(0.3 0.09 53.08)` | `oklch(0.15 0.04 268.94)` | Maximum contrast |

**Example Usage:**

```html
<!-- Secondary action button -->
<button class="bg-secondary-600 hover:bg-secondary-700 text-secondary-content">
  Cancel
</button>

<!-- Highlighted badge -->
<span class="bg-secondary-100 text-secondary-700 px-3 py-1 rounded-full">
  New Feature
</span>
```

### Neutral Colors

**Purpose:** Grayscale for text, backgrounds, borders, and structural UI elements.

**Both Modes:** True neutral grays (achromatic)

| Shade | Value | Usage |
|-------|-------|-------|
| 50 | `oklch(0.98 0 0)` | Lightest background |
| 100 | `oklch(0.95 0 0)` | Card backgrounds |
| 200 | `oklch(0.92 0 0)` | Subtle borders |
| 300 | `oklch(0.85 0 0)` | Default borders |
| 400 | `oklch(0.7 0 0)` | Disabled text |
| 500 | `oklch(0.51 0 0)` | Secondary text |
| 600 | `oklch(0.4 0 0)` | Body text |
| 700 | `oklch(0.31 0.0311 324.13)` | Headings |
| 800 | `oklch(0.25 0.025 324.13)` | Strong emphasis |
| 900 | `oklch(0.2 0.02 324.13)` | Maximum contrast |

**Example Usage:**

```html
<!-- Typography hierarchy -->
<h1 class="text-3xl font-bold text-neutral-900">Page Title</h1>
<h2 class="text-2xl font-semibold text-neutral-800">Section Title</h2>
<p class="text-base text-neutral-700">Body text content</p>
<p class="text-sm text-neutral-500">Secondary information</p>

<!-- Card with borders -->
<div class="bg-neutral-50 border border-neutral-200 rounded-lg">
  <p class="text-neutral-700">Card content</p>
</div>

<!-- Divider -->
<hr class="border-neutral-200" />
```

### Semantic Colors

Semantic colors convey meaning and state. Each has a full 10-step scale.

#### Success (Green)

**Purpose:** Confirmations, successful operations, positive states.

| Shade | Value | Usage |
|-------|-------|-------|
| 50 | `oklch(0.97 0.02 139.12)` | Success backgrounds |
| 100 | `oklch(0.94 0.05 139.12)` | Success alerts |
| 200 | `oklch(0.88 0.1 139.12)` | Success borders |
| 600 | `oklch(0.65 0.17 139.12)` | **Success actions** |
| 700 | `oklch(0.55 0.15 139.12)` | Success text |
| 900 | `oklch(0.35 0.09 139.12)` | Maximum contrast |

**Example Usage:**

```html
<!-- Success message -->
<div class="bg-success-50 border border-success-200 text-success-700 p-4 rounded-lg">
  <p class="font-medium">Success!</p>
  <p class="text-sm">DPM has been created successfully.</p>
</div>

<!-- Success button -->
<button class="bg-success-600 hover:bg-success-700 text-success-content">
  Approve
</button>
```

#### Error (Red)

**Purpose:** Errors, destructive actions, alerts, validation failures.

| Shade | Value | Usage |
|-------|-------|-------|
| 50 | `oklch(0.97 0.03 18.5)` | Error backgrounds |
| 100 | `oklch(0.94 0.07 18.5)` | Error alerts |
| 200 | `oklch(0.88 0.12 18.5)` | Error borders |
| 600 | `oklch(0.5 0.21 18.5)` | **Error actions** |
| 700 | `oklch(0.4 0.18 18.5)` | Error text |
| 900 | `oklch(0.25 0.1 18.5)` | Maximum contrast |

**Example Usage:**

```html
<!-- Form validation error -->
<div class="grid gap-2">
  <label class="text-sm font-medium text-neutral-700">Email</label>
  <input
    type="email"
    class="input input-bordered input-error"
    aria-invalid="true"
  />
  <p class="text-xs text-error-600">Please enter a valid email address</p>
</div>

<!-- Destructive action -->
<button class="bg-error-600 hover:bg-error-700 text-error-content">
  Delete DPM
</button>

<!-- Error alert -->
<div class="bg-error-50 border border-error-200 text-error-700 p-4 rounded-lg">
  <p class="font-medium">Error</p>
  <p class="text-sm">Failed to save DPM. Please try again.</p>
</div>
```

#### Warning (Orange/Yellow)

**Purpose:** Warnings, caution states, pending actions.

| Shade | Value | Usage |
|-------|-------|-------|
| 50 | `oklch(0.98 0.02 84.43)` | Warning backgrounds |
| 100 | `oklch(0.95 0.06 84.43)` | Warning alerts |
| 200 | `oklch(0.9 0.11 84.43)` | Warning borders |
| 600 | `oklch(0.75 0.18 84.43)` | **Warning actions** |
| 700 | `oklch(0.65 0.15 84.43)` | Warning text |
| 900 | `oklch(0.45 0.09 84.43)` | Maximum contrast |

**Example Usage:**

```html
<!-- Warning alert -->
<div class="bg-warning-50 border border-warning-200 text-warning-700 p-4 rounded-lg">
  <p class="font-medium">Warning</p>
  <p class="text-sm">This action requires manager approval.</p>
</div>

<!-- Warning badge -->
<span class="bg-warning-100 text-warning-700 px-3 py-1 rounded-full text-sm">
  Pending Approval
</span>
```

#### Info (Blue)

**Purpose:** Information, neutral notifications, help text.

| Shade | Value | Usage |
|-------|-------|-------|
| 50 | `oklch(0.97 0.02 235.72)` | Info backgrounds |
| 100 | `oklch(0.94 0.05 235.72)` | Info alerts |
| 200 | `oklch(0.88 0.09 235.72)` | Info borders |
| 600 | `oklch(0.6 0.14 235.72)` | **Info actions** |
| 700 | `oklch(0.5 0.12 235.72)` | Info text |
| 900 | `oklch(0.32 0.08 235.72)` | Maximum contrast |

**Example Usage:**

```html
<!-- Info message -->
<div class="bg-info-50 border border-info-200 text-info-700 p-4 rounded-lg">
  <p class="font-medium">Did you know?</p>
  <p class="text-sm">You can autogenerate DPMs from your schedule.</p>
</div>
```

---

## Typography System

### Font Families

**Primary (Sans-Serif):**
```css
font-family: Poppins, system-ui, -apple-system, sans-serif;
```
Used for all UI text, headings, and body content.

**Monospace (Code/Data):**
```css
font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Courier New', monospace;
```
Used for code snippets, technical data, and tabular numbers.

### Font Size Scale

Design tokens provide a consistent type scale from extra-small to extra-large.

| Token | Value | Pixels | Tailwind Class | Usage |
|-------|-------|--------|----------------|-------|
| `--font-size-xs` | 0.75rem | 12px | `text-xs` | Captions, helper text, timestamps |
| `--font-size-sm` | 0.875rem | 14px | `text-sm` | Small body text, labels, table cells |
| `--font-size-base` | 1rem | 16px | `text-base` | Default body text |
| `--font-size-lg` | 1.125rem | 18px | `text-lg` | Emphasized text, large body |
| `--font-size-xl` | 1.25rem | 20px | `text-xl` | Large text, H4 headings |
| `--font-size-2xl` | 1.5rem | 24px | `text-2xl` | H3 headings, section titles |
| `--font-size-3xl` | 1.875rem | 30px | `text-3xl` | H2 headings, page titles |
| `--font-size-4xl` | 2.25rem | 36px | `text-4xl` | H1 headings, hero text |

**Example Usage:**

```html
<h1 class="text-4xl">Main Page Heading</h1>
<h2 class="text-3xl">Section Heading</h2>
<h3 class="text-2xl">Subsection Heading</h3>
<h4 class="text-xl">Component Heading</h4>
<p class="text-base">This is standard body text.</p>
<p class="text-sm">This is small supporting text.</p>
<span class="text-xs">Last updated: 2 hours ago</span>
```

### Font Weights

| Tailwind Class | Weight | Usage |
|----------------|--------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Labels, emphasized text, navbar links |
| `font-semibold` | 600 | Subheadings, buttons, table headers |
| `font-bold` | 700 | Headings, strong emphasis |

**Example Usage:**

```html
<h2 class="font-bold">Bold Heading</h2>
<label class="font-medium">Form Label</label>
<p class="font-normal">Regular body text</p>
<button class="font-semibold">Button Text</button>
```

### Line Height Scale

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--line-height-tight` | 1.25 | `leading-tight` | Large headings (H1, H2) |
| `--line-height-snug` | 1.375 | `leading-snug` | Subheadings (H3, H4) |
| `--line-height-normal` | 1.5 | `leading-normal` | Body text (default) |
| `--line-height-relaxed` | 1.625 | `leading-relaxed` | Long-form reading |
| `--line-height-loose` | 2 | `leading-loose` | Extra spacing for accessibility |

**Example Usage:**

```html
<h1 class="text-4xl font-bold leading-tight">Tight Line Height</h1>
<h3 class="text-2xl font-semibold leading-snug">Snug Line Height</h3>
<p class="text-base leading-normal">Normal body text with standard line height.</p>
<article class="text-base leading-relaxed">
  Long-form content with relaxed line height for better readability.
</article>
```

### Letter Spacing Scale

| Token | Value | Tailwind Class | Usage |
|-------|-------|----------------|-------|
| `--letter-spacing-tighter` | -0.05em | `tracking-tighter` | Large display headings |
| `--letter-spacing-tight` | -0.025em | `tracking-tight` | Headings (H1, H2, H3) |
| `--letter-spacing-normal` | 0 | `tracking-normal` | Body text (default) |
| `--letter-spacing-wide` | 0.025em | `tracking-wide` | Buttons, uppercase labels |
| `--letter-spacing-wider` | 0.05em | `tracking-wider` | Loose uppercase |
| `--letter-spacing-widest` | 0.1em | `tracking-widest` | Very loose uppercase |

**Example Usage:**

```html
<h1 class="text-4xl tracking-tight">Hero Heading</h1>
<button class="uppercase tracking-wide">Button Text</button>
<label class="text-xs uppercase tracking-wider">Form Label</label>
```

### Typography Hierarchy

Pre-defined patterns for consistent heading hierarchy across the application.

#### H1 - Page Titles

```html
<h1 class="text-4xl font-bold leading-tight tracking-tight text-neutral-900">
  Page Title
</h1>
```

**Usage:** Main page headings, hero sections.

#### H2 - Section Titles

```html
<h2 class="text-3xl font-bold leading-tight tracking-tight text-neutral-800">
  Section Title
</h2>
```

**Usage:** Major sections within a page.

#### H3 - Subsection Titles

```html
<h3 class="text-2xl font-semibold leading-snug text-neutral-700">
  Subsection Title
</h3>
```

**Usage:** Subsections, card titles, modal titles.

#### H4 - Component Titles

```html
<h4 class="text-xl font-semibold leading-snug text-neutral-700">
  Component Title
</h4>
```

**Usage:** Smaller component headings, form sections.

#### Body Text

```html
<p class="text-base leading-normal text-neutral-700">
  Standard body text with optimal readability.
</p>
```

**Usage:** Default paragraph text.

#### Small Body Text

```html
<p class="text-sm leading-normal text-neutral-600">
  Secondary information or supporting text.
</p>
```

**Usage:** Captions, descriptions, secondary content.

#### Form Labels

```html
<label class="text-sm font-medium leading-normal text-neutral-700">
  Form Label
</label>
```

**Usage:** Input labels, fieldset legends.

#### Helper Text

```html
<p class="text-xs leading-normal text-neutral-500">
  Helper text or inline documentation.
</p>
```

**Usage:** Form helper text, timestamps, captions.

---

## Shadow System

Shadows create depth and visual hierarchy using a 6-level elevation scale.

### Shadow Scale

| Token | Value | Tailwind Class | Elevation | Usage |
|-------|-------|----------------|-----------|-------|
| `--shadow-xs` | `0 1px 2px 0 rgb(0 0 0 / 0.05)` | `shadow-xs` | Minimal | Subtle lift on hover, small tooltips |
| `--shadow-sm` | `0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` | `shadow-sm` | Low | Cards at rest, buttons |
| `--shadow-base` | `0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)` | `shadow-base` | Medium | Elevated cards, dropdowns |
| `--shadow-md` | `0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)` | `shadow-md` | High | Modals, popovers |
| `--shadow-lg` | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` | `shadow-lg` | Very High | Large modals, drawers |
| `--shadow-xl` | `0 25px 50px -12px rgb(0 0 0 / 0.25)` | `shadow-xl` | Maximum | Hero sections, overlays |

### Visual Hierarchy Guide

Use shadows consistently to communicate element elevation:

- **Level 0 (No Shadow):** Flat elements, inline content
- **Level 1 (xs/sm):** Slight lift, interactive elements at rest
- **Level 2 (base):** Floating elements, active dropdowns
- **Level 3 (md):** Dialogs, overlays
- **Level 4 (lg):** Large modals, side panels
- **Level 5 (xl):** Full-screen overlays, hero sections

### Usage Examples

#### Cards

```html
<!-- Card at rest -->
<div class="card bg-base-100 shadow-sm rounded-lg p-6">
  <h3 class="text-xl font-semibold">Card Title</h3>
  <p class="text-neutral-600">Card content goes here.</p>
</div>

<!-- Interactive card with hover state -->
<div class="card bg-base-100 shadow-sm hover:shadow-base transition-shadow duration-200 rounded-lg p-6 cursor-pointer">
  <h3 class="text-xl font-semibold">Clickable Card</h3>
  <p class="text-neutral-600">Hover to see elevation change.</p>
</div>
```

#### Buttons

```html
<!-- Button with shadow -->
<button class="btn bg-primary-600 text-primary-content shadow-sm hover:shadow-base active:shadow-none px-6 py-3">
  Submit
</button>
```

#### Modals

```html
<!-- Modal dialog -->
<dialog class="modal shadow-lg rounded-lg p-6 max-w-2xl">
  <h3 class="text-2xl font-semibold mb-4">Modal Title</h3>
  <p class="text-neutral-700 mb-6">Modal content goes here.</p>
  <div class="flex gap-3 justify-end">
    <button class="btn btn-ghost">Cancel</button>
    <button class="btn btn-primary">Confirm</button>
  </div>
</dialog>
```

#### Dropdowns

```html
<!-- Dropdown menu -->
<div class="dropdown-menu bg-base-100 shadow-base rounded-lg p-2">
  <button class="dropdown-item">Option 1</button>
  <button class="dropdown-item">Option 2</button>
  <button class="dropdown-item">Option 3</button>
</div>
```

### Custom CSS Usage

```css
.custom-card {
  box-shadow: var(--shadow-sm);
  transition: box-shadow var(--transition-base);
}

.custom-card:hover {
  box-shadow: var(--shadow-base);
}
```

---

## Transition System

Consistent transition timing creates smooth, professional interactions.

### Timing Scale

| Token | Value | Duration | Easing | Usage |
|-------|-------|----------|--------|-------|
| `--transition-fast` | `150ms cubic-bezier(0.4, 0, 0.2, 1)` | 150ms | ease-out | Button states, hover effects, checkboxes |
| `--transition-base` | `300ms cubic-bezier(0.4, 0, 0.2, 1)` | 300ms | ease-out | Standard interactions, shadows, colors |
| `--transition-slow` | `500ms cubic-bezier(0.4, 0, 0.2, 1)` | 500ms | ease-out | Modals, panels, page transitions |

**Easing Curve:** All transitions use `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out) for natural deceleration.

### Usage Guidelines

#### Fast Transitions (150ms)

Use for immediate feedback on user interactions:
- Button hover/active states
- Checkbox/radio toggles
- Input focus states
- Small UI element changes

```html
<button class="btn transition-all duration-150 hover:scale-105 active:scale-95">
  Click Me
</button>

<input class="input transition-colors duration-150 focus:ring-2" />
```

#### Base Transitions (300ms)

Use for standard UI changes:
- Shadow elevation changes
- Background color transitions
- Card hover effects
- Dropdown animations

```html
<div class="card transition-shadow duration-300 shadow-sm hover:shadow-base">
  Card Content
</div>

<div class="transition-colors duration-300 hover:bg-primary-50">
  Hoverable Element
</div>
```

#### Slow Transitions (500ms)

Use for significant UI changes:
- Modal open/close
- Sidebar/drawer animations
- Page transitions
- Large component animations

```html
<dialog class="modal transition-opacity duration-500 opacity-0 open:opacity-100">
  Modal Content
</dialog>
```

### Transition Properties

Choose the appropriate transition property for optimal performance:

| Property | Usage | Performance |
|----------|-------|-------------|
| `transition-all` | Use sparingly, transitions all properties | Lowest |
| `transition-colors` | Background, border, text colors | High |
| `transition-shadow` | Box shadow changes | High |
| `transition-transform` | Scale, rotate, translate | Highest |
| `transition-opacity` | Fade in/out effects | Highest |

**Best Practice:** Always specify the property being transitioned for better performance.

### Complete Examples

#### Interactive Button

```html
<button class="
  btn
  bg-primary-600
  text-primary-content
  shadow-sm
  transition-all
  duration-150
  hover:bg-primary-700
  hover:shadow-base
  hover:scale-105
  active:bg-primary-800
  active:shadow-none
  active:scale-95
">
  Interactive Button
</button>
```

#### Smooth Card

```html
<div class="
  card
  bg-base-100
  shadow-sm
  transition-shadow
  duration-300
  hover:shadow-base
  cursor-pointer
">
  <div class="p-6">
    <h3 class="text-xl font-semibold">Card Title</h3>
    <p class="text-neutral-600">Card content</p>
  </div>
</div>
```

#### Animated Modal

```html
<dialog class="
  modal
  shadow-lg
  transition-all
  duration-500
  opacity-0
  scale-95
  open:opacity-100
  open:scale-100
">
  <div class="modal-box p-6">
    <h3 class="text-2xl font-semibold">Modal Title</h3>
    <p class="text-neutral-700">Modal content</p>
  </div>
</dialog>
```

---

## Usage in Components

### Tailwind Utility Classes

The primary method for applying design tokens is through Tailwind CSS utility classes.

#### Color Utilities

```html
<!-- Background colors -->
<div class="bg-primary-600">Primary background</div>
<div class="bg-neutral-50">Light background</div>

<!-- Text colors -->
<p class="text-neutral-700">Body text</p>
<p class="text-error-600">Error message</p>

<!-- Border colors -->
<div class="border border-neutral-200">Bordered element</div>
```

#### Typography Utilities

```html
<!-- Font sizes -->
<h1 class="text-4xl">Large heading</h1>
<p class="text-base">Body text</p>

<!-- Font weights -->
<span class="font-bold">Bold text</span>
<span class="font-medium">Medium text</span>

<!-- Line heights -->
<p class="leading-tight">Tight line height</p>
<p class="leading-relaxed">Relaxed line height</p>

<!-- Letter spacing -->
<h1 class="tracking-tight">Tight tracking</h1>
<button class="tracking-wide">Wide tracking</button>
```

#### Shadow Utilities

```html
<div class="shadow-sm">Light shadow</div>
<div class="shadow-base">Base shadow</div>
<div class="shadow-lg">Large shadow</div>
```

#### Transition Utilities

```html
<button class="transition-all duration-150">Fast transition</button>
<div class="transition-shadow duration-300">Shadow transition</div>
```

### Direct CSS Custom Properties

For custom components or specific use cases, access design tokens directly via CSS custom properties.

```css
.custom-button {
  background-color: var(--color-primary-600);
  color: var(--color-primary-content);
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-box);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-fast);
  font-size: var(--font-size-base);
  font-weight: 500;
  letter-spacing: var(--letter-spacing-wide);
}

.custom-button:hover {
  background-color: var(--color-primary-700);
  box-shadow: var(--shadow-base);
  transform: scale(1.02);
}

.custom-button:active {
  background-color: var(--color-primary-800);
  box-shadow: none;
  transform: scale(0.98);
}
```

### Component Patterns

#### Navbar

```html
<nav class="navbar bg-primary-600 text-primary-content shadow-sm px-4 md:px-8 lg:px-12">
  <div class="container mx-auto flex items-center justify-between">
    <a href="/home" class="text-xl font-bold tracking-tight">UTS DPM</a>
    <div class="flex items-center gap-2">
      <a href="/home" class="btn btn-ghost text-base font-medium px-4 py-2 transition-colors duration-150">
        Home
      </a>
      <a href="/history" class="btn btn-ghost text-base font-medium px-4 py-2 transition-colors duration-150">
        History
      </a>
    </div>
  </div>
</nav>
```

#### Form Field

```html
<div class="grid gap-2">
  <label class="text-sm font-medium text-neutral-700">Email Address</label>
  <input
    type="email"
    class="input input-bordered w-full p-3 text-base transition-colors duration-150 focus:ring-2 focus:ring-primary-500"
    placeholder="driver@example.com"
  />
  <p class="text-xs text-neutral-500">We'll never share your email.</p>
</div>
```

#### Card Component

```html
<div class="card bg-base-100 shadow-sm rounded-lg p-6 gap-4">
  <div class="flex items-center justify-between">
    <h3 class="text-xl font-semibold text-neutral-700">Card Title</h3>
    <span class="text-xs text-neutral-500">2 hours ago</span>
  </div>
  <p class="text-base text-neutral-600">
    Card content with consistent spacing and typography.
  </p>
  <div class="flex gap-3 justify-end">
    <button class="btn btn-ghost px-4 py-2">Cancel</button>
    <button class="btn btn-primary px-6 py-3">Confirm</button>
  </div>
</div>
```

#### Table

```html
<div class="rounded-lg bg-base-100 shadow-sm overflow-hidden">
  <table class="table w-full">
    <thead class="bg-primary-600 text-primary-content">
      <tr>
        <th class="px-4 py-4 text-sm font-semibold text-left">Driver</th>
        <th class="px-4 py-4 text-sm font-semibold text-left">Points</th>
        <th class="px-4 py-4 text-sm font-semibold text-left">Date</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hover:bg-base-200 transition-colors duration-150">
        <td class="px-4 py-3 text-sm text-neutral-700">John Doe</td>
        <td class="px-4 py-3 text-sm font-medium text-success-700">+5</td>
        <td class="px-4 py-3 text-sm text-neutral-700">2026-01-12</td>
      </tr>
    </tbody>
  </table>
</div>
```

#### Modal

```html
<dialog class="modal shadow-lg rounded-lg">
  <div class="modal-box max-w-2xl p-6">
    <!-- Header -->
    <div class="pb-4 mb-6 border-b border-neutral-200">
      <h3 class="text-2xl font-semibold text-neutral-800">Modal Title</h3>
    </div>

    <!-- Content -->
    <div class="grid gap-4">
      <p class="text-base text-neutral-700">Modal content goes here.</p>
    </div>

    <!-- Actions -->
    <div class="modal-action pt-6 mt-6 border-t border-neutral-200 gap-3">
      <button class="btn btn-ghost px-6 py-3">Cancel</button>
      <button class="btn btn-primary px-6 py-3">Confirm</button>
    </div>
  </div>

  <!-- Backdrop -->
  <form method="dialog" class="modal-backdrop bg-neutral-900/50">
    <button>close</button>
  </form>
</dialog>
```

---

## Accessibility Guidelines

### WCAG Compliance

The UTS DPM design system is built with **WCAG 2.1 Level AA compliance** as a baseline.

#### Contrast Requirements

All color combinations meet or exceed WCAG AA contrast ratios:

| Content Type | Minimum Ratio | Design System |
|--------------|---------------|---------------|
| Normal text (< 18pt) | 4.5:1 | All text colors on backgrounds |
| Large text (>= 18pt) | 3:1 | All heading colors |
| UI components | 3:1 | All buttons, borders, icons |
| Graphical objects | 3:1 | All charts, icons, focus indicators |

**Tested Combinations:**

- `text-neutral-900` on `bg-base-100`: ~16:1 (Excellent)
- `text-neutral-700` on `bg-base-100`: ~8:1 (Excellent)
- `text-neutral-600` on `bg-base-100`: ~5.5:1 (Good)
- `text-primary-content` on `bg-primary-600`: ~12:1 (Excellent)
- `text-error-700` on `bg-error-50`: ~7:1 (Excellent)

### Focus States

All interactive elements must have visible focus indicators for keyboard navigation.

**Recommended Pattern:**

```html
<button class="focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none">
  Accessible Button
</button>

<input class="focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:outline-none" />
```

**Focus Ring Guidelines:**
- Use `ring-2` (2px width) for visibility
- Use `ring-primary-500` for brand consistency
- Use `ring-offset-2` for clear separation
- Always remove default outline with `outline-none` when using rings

### Color Usage for Information

**Never rely on color alone** to convey information. Always provide additional indicators.

**Bad Example:**

```html
<!-- Only uses color to indicate error -->
<input class="border-error-500" />
```

**Good Example:**

```html
<!-- Uses color + icon + text -->
<div class="grid gap-2">
  <label>Email Address</label>
  <input class="border border-error-500" aria-invalid="true" aria-describedby="email-error" />
  <p id="email-error" class="text-xs text-error-600">
    <i class="pi pi-exclamation-circle" aria-hidden="true"></i>
    Please enter a valid email address
  </p>
</div>
```

### Text Readability

**Line Length:** Limit text to 60-80 characters per line for optimal readability.

```html
<article class="max-w-prose">
  <p class="text-base leading-relaxed">
    Long-form content with optimal line length for comfortable reading.
  </p>
</article>
```

**Line Height:** Use appropriate line heights for text length:
- Short text (headings): `leading-tight` (1.25)
- Medium text (UI): `leading-normal` (1.5)
- Long text (articles): `leading-relaxed` (1.625)

### Touch Targets

All interactive elements should meet minimum touch target size of **44×44px**.

```html
<!-- Button with adequate touch target -->
<button class="btn px-6 py-3">
  Submit
</button>

<!-- Link with adequate padding -->
<a href="/home" class="px-4 py-3">Home</a>
```

### Semantic HTML

Always use semantic HTML elements with proper ARIA attributes.

```html
<!-- Good: Semantic structure -->
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/home">Home</a></li>
    <li><a href="/history">History</a></li>
  </ul>
</nav>

<!-- Good: Accessible button -->
<button type="button" aria-label="Close modal">
  <i class="pi pi-times" aria-hidden="true"></i>
</button>

<!-- Good: Form with labels -->
<form>
  <label for="email">Email Address</label>
  <input type="email" id="email" name="email" required />
</form>
```

---

## Best Practices

### Do's and Don'ts

#### Color Usage

**Do:**
- Use design system color scales (50-900) for all color needs
- Use semantic colors (success, error, warning, info) to convey meaning
- Test color combinations in both light and dark modes
- Maintain consistent contrast ratios (WCAG AA minimum)
- Use `*-content` colors for text on colored backgrounds

**Don't:**
- Hard-code hex or RGB color values
- Use color as the only indicator of state or meaning
- Mix random shades outside the design system
- Use primary colors for everything (dilutes brand)
- Forget to test dark mode

**Example:**

```html
<!-- Good: Uses design system colors -->
<button class="bg-primary-600 hover:bg-primary-700 text-primary-content">
  Submit
</button>

<!-- Bad: Hard-coded colors -->
<button style="background-color: #6420AA; color: white;">
  Submit
</button>
```

#### Typography

**Do:**
- Follow the heading hierarchy (H1 → H2 → H3 → H4)
- Use consistent font sizes from the type scale
- Apply appropriate line heights (tight for headings, normal/relaxed for body)
- Use font weights semantically (bold for headings, medium for labels)
- Test readability at different screen sizes

**Don't:**
- Skip heading levels (e.g., H1 → H3)
- Use too many font sizes on a single page
- Apply tight line-height to body text (reduces readability)
- Set font sizes with absolute pixel values
- Use all caps excessively (harder to read)

**Example:**

```html
<!-- Good: Proper hierarchy -->
<article>
  <h1 class="text-4xl font-bold leading-tight">Article Title</h1>
  <h2 class="text-3xl font-bold leading-tight">Section</h2>
  <h3 class="text-2xl font-semibold leading-snug">Subsection</h3>
  <p class="text-base leading-normal">Body content...</p>
</article>

<!-- Bad: Random sizes, skipped levels -->
<article>
  <h1 class="text-5xl">Article Title</h1>
  <h3 class="text-xl">Section</h3>
  <p style="font-size: 14.5px; line-height: 1.2;">Body...</p>
</article>
```

#### Spacing

**Do:**
- Use Tailwind's spacing scale consistently (gap-2, gap-4, p-6, etc.)
- Apply responsive spacing (`px-4 md:px-12 lg:px-20`)
- Use `gap` utilities for flex/grid layouts
- Group related elements with smaller spacing (gap-2)
- Separate sections with larger spacing (mb-12)

**Don't:**
- Mix margin and padding inconsistently
- Use arbitrary spacing values outside the scale
- Forget responsive spacing on mobile devices
- Cram elements together without breathing room
- Over-space elements (creates disconnection)

**Example:**

```html
<!-- Good: Consistent spacing -->
<form class="grid gap-4">
  <div class="grid gap-2">
    <label class="text-sm font-medium">Email</label>
    <input class="input p-3" />
  </div>
  <div class="grid gap-2">
    <label class="text-sm font-medium">Password</label>
    <input class="input p-3" />
  </div>
  <button class="btn px-6 py-3 mt-2">Submit</button>
</form>

<!-- Bad: Random spacing -->
<form style="margin-bottom: 23px;">
  <div style="margin-bottom: 15px;">
    <label>Email</label>
    <input style="padding: 11px;" />
  </div>
  <button style="padding: 8px 19px;">Submit</button>
</form>
```

#### Shadows & Elevation

**Do:**
- Use shadows consistently to indicate elevation level
- Transition shadows smoothly on hover (duration-200/300)
- Apply appropriate shadow for context (sm for cards, lg for modals)
- Use shadow-none for flat, non-interactive elements
- Combine shadows with subtle transforms for depth

**Don't:**
- Mix random shadow values outside the system
- Use heavy shadows on every element (loses impact)
- Forget to transition shadows (jarring changes)
- Apply shadows to inline text elements
- Use shadows for decorative purposes only

**Example:**

```html
<!-- Good: Appropriate shadow usage -->
<div class="card shadow-sm hover:shadow-base transition-shadow duration-200">
  Card content
</div>

<!-- Bad: Random shadow -->
<div style="box-shadow: 2px 4px 8px rgba(0,0,0,0.15);">
  Card content
</div>
```

#### Transitions

**Do:**
- Use consistent timing (fast for immediate feedback, base for standard)
- Specify the property being transitioned (better performance)
- Use ease-out easing for natural deceleration
- Transition shadows, colors, and transforms smoothly
- Keep transitions subtle and purposeful

**Don't:**
- Use very slow transitions (> 500ms) for small UI changes
- Transition all properties indiscriminately (performance)
- Forget transitions on interactive elements (feels abrupt)
- Use linear easing (feels robotic)
- Over-animate (creates distraction)

**Example:**

```html
<!-- Good: Specific, performant transition -->
<button class="transition-all duration-150 hover:scale-105">
  Click Me
</button>

<!-- Less ideal: Transitions everything -->
<button class="transition-all duration-500">
  Click Me
</button>
```

### Component Guidelines

#### Forms

- Use `gap-4` between form fields
- Use `gap-2` between label and input
- Apply `p-3` to inputs for comfortable touch targets
- Show validation errors with `text-error-600` and icons
- Use `text-sm font-medium` for labels
- Add helper text with `text-xs text-neutral-500`

#### Cards

- Use `p-6` for padding (comfortable spacing)
- Use `gap-4` for internal spacing
- Apply `shadow-sm` at rest, `shadow-base` on hover
- Use `text-xl font-semibold` for card titles
- Include rounded corners with `rounded-lg`

#### Buttons

- Use `px-6 py-3` for standard button padding
- Apply `font-semibold` or `font-medium` for text
- Use `shadow-sm` at rest, `shadow-base` on hover
- Transition with `duration-150` for responsiveness
- Use semantic colors (primary, success, error) appropriately

#### Tables

- Use `px-4 py-4` for header cells
- Use `px-4 py-3` for body cells
- Apply `text-sm` for cell text
- Use `font-semibold` for headers
- Add `hover:bg-base-200` for row highlighting

---

## Migration Guide

### Updating Existing Components

Follow this process to migrate components to use design system tokens.

#### Step 1: Identify Hard-Coded Values

Search for:
- Hex colors (`#RRGGBB`)
- RGB/RGBA colors (`rgb()`, `rgba()`)
- Arbitrary pixel values (`font-size: 14.5px`)
- Custom box-shadow values
- Custom transition values

#### Step 2: Map to Design Tokens

Replace hard-coded values with design system equivalents:

| Old Value | New Token | Tailwind Class |
|-----------|-----------|----------------|
| `#6420AA` (purple) | `--color-primary-600` | `bg-primary-600` |
| `#FCD34D` (yellow) | `--color-secondary-500` | `bg-secondary-500` |
| `#9CA3AF` (gray) | `--color-neutral-400` | `text-neutral-400` |
| `font-size: 14px` | `--font-size-sm` | `text-sm` |
| `box-shadow: 0 2px 4px rgba(0,0,0,0.1)` | `--shadow-sm` | `shadow-sm` |
| `transition: 0.2s` | `--transition-fast` | `duration-150` |

#### Step 3: Update Templates

**Before:**

```html
<button style="
  background-color: #6420AA;
  color: white;
  padding: 12px 24px;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: 0.2s;
">
  Submit
</button>
```

**After:**

```html
<button class="
  bg-primary-600
  hover:bg-primary-700
  text-primary-content
  px-6
  py-3
  text-sm
  font-medium
  shadow-sm
  hover:shadow-base
  transition-all
  duration-150
">
  Submit
</button>
```

#### Step 4: Update Component Styles

**Before:**

```css
.custom-card {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

**After:**

```css
.custom-card {
  background-color: var(--color-base-100);
  padding: 1.5rem; /* 24px */
  border-radius: var(--radius-box);
  box-shadow: var(--shadow-sm);
}
```

Or better, use Tailwind utilities:

```html
<div class="bg-base-100 p-6 rounded-lg shadow-sm">
  Card content
</div>
```

#### Step 5: Test in Both Themes

After migration, test components in both light and dark modes to ensure proper contrast and readability.

### Common Migration Patterns

#### Colors

```typescript
// Before
const styles = {
  background: '#6420AA',
  color: '#FFFFFF'
};

// After (Angular)
<div class="bg-primary-600 text-primary-content">
  Content
</div>
```

#### Typography

```typescript
// Before
const styles = {
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: 1.5
};

// After
<p class="text-sm font-medium leading-normal">
  Text content
</p>
```

#### Spacing

```typescript
// Before
const styles = {
  padding: '24px',
  gap: '16px',
  marginBottom: '48px'
};

// After
<div class="p-6 gap-4 mb-12">
  Content
</div>
```

---

## Versioning & Changelog

**Current Version:** 1.0.0 (Phase 1)
**Last Updated:** 2026-01-12

### Version 1.0.0 (2026-01-12)

**Initial Release - Phase 1: Foundation & Design System**

- Complete color system with 10-step scales for all color categories
- Typography system with font sizes, weights, line heights, and letter spacing
- Shadow system with 6 elevation levels
- Transition system with 3 timing options
- Comprehensive usage examples and accessibility guidelines
- Component patterns for common UI elements
- Migration guide for updating existing components

---

## Quick Reference

### Most Common Patterns

**Page Container:**
```html
<div class="container mx-auto px-4 md:px-12 lg:px-20 py-8">
  <h1 class="text-3xl font-bold leading-tight tracking-tight text-neutral-900 mb-6">
    Page Title
  </h1>
  <section class="mb-12">
    <!-- Content -->
  </section>
</div>
```

**Form Field:**
```html
<div class="grid gap-2">
  <label class="text-sm font-medium text-neutral-700">Label</label>
  <input class="input input-bordered p-3 text-base transition-colors duration-150" />
  <p class="text-xs text-neutral-500">Helper text</p>
</div>
```

**Card:**
```html
<div class="card bg-base-100 shadow-sm rounded-lg p-6 gap-4">
  <h3 class="text-xl font-semibold text-neutral-700">Card Title</h3>
  <p class="text-base text-neutral-600">Card content</p>
</div>
```

**Button:**
```html
<button class="btn bg-primary-600 hover:bg-primary-700 text-primary-content shadow-sm px-6 py-3 transition-all duration-150">
  Action
</button>
```

**Alert:**
```html
<div class="bg-success-50 border border-success-200 text-success-700 p-4 rounded-lg">
  <p class="font-medium">Success!</p>
  <p class="text-sm">Action completed successfully.</p>
</div>
```

---

## Support & Feedback

For questions, suggestions, or issues with the design system:

1. Check this documentation first
2. Review component examples in `/src/app/`
3. Consult the implementation plan at `/docs/plans/2026-01-12-phase1-implementation.md`
4. Refer to the Phase 1 specification at `/docs/specs/phase1-design-system.md`

---

**UTS DPM Design System v1.0.0**
University of Virginia Transit Service
Maintained by the UTS Development Team
