# Phase 1: Foundation & Design System - Visual Polish

**Date:** 2026-01-12
**Project:** UTS DPM Frontend Modernization
**Phase:** Phase 1 - Foundation & Design System
**Approach:** Visual Polish First - Refine existing components without library changes

---

## Overview

This design establishes a comprehensive design system for UTS DPM, focusing on visual polish through refined colors, typography, and spacing. The goal is to make the existing DaisyUI + PrimeNG components look more professional and consistent without changing the underlying libraries.

## Design Philosophy

- **Incremental Enhancement**: Build on existing purple/yellow brand colors
- **Professional Polish**: Add depth through color shades, consistent spacing, and smooth transitions
- **YAGNI Principle**: Only define what we'll actually use
- **Accessibility First**: WCAG AA contrast ratios, visible focus states
- **Mobile-First**: Responsive from the ground up

---

## 1. Color System

### Current State
- Primary: `oklch(0.31 0.0566 268.94)` (purple)
- Secondary: `oklch(0.68 0.171441 53.0829)` (yellow)
- Limited shades, no intermediate values

### Proposed Color Scales

#### Primary Palette (Purple)
```css
--color-primary-50:  oklch(0.98 0.01 268.94)   /* Lightest tint for backgrounds */
--color-primary-100: oklch(0.95 0.02 268.94)   /* Subtle hover states */
--color-primary-200: oklch(0.85 0.03 268.94)   /* Light borders */
--color-primary-300: oklch(0.70 0.04 268.94)   /* Disabled states */
--color-primary-400: oklch(0.50 0.05 268.94)   /* Hover states */
--color-primary-500: oklch(0.40 0.0566 268.94) /* Interactive elements */
--color-primary-600: oklch(0.31 0.0566 268.94) /* Main brand (current) */
--color-primary-700: oklch(0.25 0.055 268.94)  /* Pressed states */
--color-primary-800: oklch(0.20 0.05 268.94)   /* Dark emphasis */
--color-primary-900: oklch(0.15 0.04 268.94)   /* Darkest shade */
```

#### Secondary Palette (Yellow)
```css
--color-secondary-50:  oklch(0.98 0.03 53.08)
--color-secondary-100: oklch(0.95 0.05 53.08)
--color-secondary-200: oklch(0.88 0.08 53.08)
--color-secondary-300: oklch(0.80 0.12 53.08)
--color-secondary-400: oklch(0.74 0.15 53.08)
--color-secondary-500: oklch(0.71 0.17 53.08)
--color-secondary-600: oklch(0.68 0.171441 53.0829) /* Main (current) */
--color-secondary-700: oklch(0.60 0.16 53.08)
--color-secondary-800: oklch(0.50 0.14 53.08)
--color-secondary-900: oklch(0.40 0.12 53.08)
```

#### Neutral Palette (Grays)
```css
/* Light mode grays with better mid-tones */
--color-neutral-50:  oklch(0.99 0 0)    /* Backgrounds */
--color-neutral-100: oklch(0.96 0 0)    /* Alternate rows */
--color-neutral-200: oklch(0.92 0 0)    /* Borders (current base-200) */
--color-neutral-300: oklch(0.85 0 0)    /* Dividers (current base-300) */
--color-neutral-400: oklch(0.70 0 0)    /* Disabled text */
--color-neutral-500: oklch(0.51 0 0)    /* Secondary text (current base-content) */
--color-neutral-600: oklch(0.40 0 0)    /* Body text */
--color-neutral-700: oklch(0.30 0 0)    /* Headings */
--color-neutral-800: oklch(0.20 0 0)    /* Emphasis */
--color-neutral-900: oklch(0.10 0 0)    /* Maximum contrast */
```

#### Semantic Colors
Each with full 50-900 scale based on current values:

**Success (Green)**
- Base: `oklch(0.71 0.1769 139.12)` → success-600

**Error (Red)**
- Base: `oklch(0.59 0.2208 18.5)` → error-600

**Warning (Orange)**
- Base: `oklch(0.82 0.189 84.429)` → warning-600

**Info (Blue)**
- Base: `oklch(0.67 0.143484 235.7191)` → info-600

### Color Usage Guidelines

| Shade Range | Usage |
|-------------|-------|
| 50-200 | Background tints, subtle highlights |
| 300-400 | Borders, disabled states, placeholders |
| 500-600 | Primary interactive elements, default text |
| 700-900 | Emphasis, pressed states, dark text |

### Dark Mode Strategy
Maintain current approach of swapping primary/secondary, but with refined intermediate shades for both modes.

---

## 2. Typography System

### Current State
- Font: Poppins
- Line height: 1.8 (global)
- No systematic sizing

### Proposed Typography Scale

#### Font Families
```css
--font-sans: Poppins, system-ui, -apple-system, sans-serif;
--font-mono: 'SF Mono', Monaco, 'Cascadia Code', monospace;
```

#### Font Sizes
```css
--text-xs:   0.75rem   /* 12px - Captions, helper text */
--text-sm:   0.875rem  /* 14px - Small body text, labels */
--text-base: 1rem      /* 16px - Body text (default) */
--text-lg:   1.125rem  /* 18px - Emphasized text */
--text-xl:   1.25rem   /* 20px - Large text, subheadings */
--text-2xl:  1.5rem    /* 24px - H3, section titles */
--text-3xl:  1.875rem  /* 30px - H2, page titles */
--text-4xl:  2.25rem   /* 36px - H1, hero text */
--text-5xl:  3rem      /* 48px - Marketing (rarely used) */
```

#### Line Heights
```css
--leading-none:    1       /* Tight (headings only) */
--leading-tight:   1.25    /* Headings */
--leading-snug:    1.375   /* Subheadings */
--leading-normal:  1.5     /* Body text (default) */
--leading-relaxed: 1.625   /* Long-form reading */
--leading-loose:   1.8     /* Current default (specific use) */
```

#### Font Weights
```css
--font-normal:    400  /* Body text */
--font-medium:    500  /* Emphasized text, labels */
--font-semibold:  600  /* Subheadings, buttons */
--font-bold:      700  /* Headings, strong emphasis */
```

#### Letter Spacing
```css
--tracking-tighter: -0.05em  /* Large headings */
--tracking-tight:   -0.025em /* Headings */
--tracking-normal:  0        /* Body (default) */
--tracking-wide:    0.025em  /* Uppercase labels */
--tracking-wider:   0.05em   /* Loose uppercase */
```

### Heading Hierarchy

| Element | Classes | Usage |
|---------|---------|-------|
| H1 | `text-4xl font-bold leading-tight tracking-tight` | Page titles, main headers |
| H2 | `text-3xl font-bold leading-tight tracking-tight` | Section titles |
| H3 | `text-2xl font-semibold leading-snug` | Subsection titles, card headers |
| H4 | `text-xl font-semibold leading-snug` | Component titles |
| H5 | `text-lg font-medium leading-normal` | List headers, small sections |
| H6 | `text-base font-medium leading-normal` | Inline emphasis |

### Body Text Standards

| Context | Classes |
|---------|---------|
| Default body | `text-base leading-normal font-normal` |
| Labels | `text-sm leading-normal font-medium` |
| Helper text | `text-xs leading-normal text-neutral-500` |
| Form inputs | `text-base leading-normal` |
| Table cells | `text-sm leading-normal` |
| Buttons | `text-base font-medium tracking-wide` |

### Responsive Typography

**Mobile (< 768px):**
- H1: `text-3xl` → `text-4xl` (desktop)
- H2: `text-2xl` → `text-3xl`
- Body: `text-base` (stays same)

**Tablet (768px - 1024px):**
- Scale up headings by 1 step

**Desktop (> 1024px):**
- Full scale as defined

---

## 3. Spacing & Layout System

### Spacing Scale
```css
--space-0:    0
--space-px:   1px
--space-0.5:  0.125rem  /* 2px - Hairline spacing */
--space-1:    0.25rem   /* 4px - Minimal spacing */
--space-1.5:  0.375rem  /* 6px - Subtle gaps */
--space-2:    0.5rem    /* 8px - Tight spacing */
--space-2.5:  0.625rem  /* 10px */
--space-3:    0.75rem   /* 12px - Default small gaps */
--space-4:    1rem      /* 16px - Standard spacing */
--space-5:    1.25rem   /* 20px */
--space-6:    1.5rem    /* 24px - Medium spacing */
--space-8:    2rem      /* 32px - Large spacing */
--space-10:   2.5rem    /* 40px */
--space-12:   3rem      /* 48px - Extra large */
--space-16:   4rem      /* 64px - Section spacing */
--space-20:   5rem      /* 80px - Page-level spacing */
--space-24:   6rem      /* 96px */
```

### Component-Specific Spacing

#### Cards & Containers
- Card padding: `p-6` (24px)
- Card padding (compact): `p-4` (16px)
- Card gap: `gap-4` (16px) between card elements
- Section spacing: `mb-8` or `mb-12` between major sections

#### Forms
- Field vertical gap: `gap-4` (16px)
- Field internal padding: `p-3` (12px) inside inputs
- Label margin: `mb-2` (8px) label to input
- Form section gap: `gap-6` (24px) between fieldsets
- Button margin: `mt-6` (24px) form to button

#### Tables
- Cell padding: `px-4 py-3` (16px horizontal, 12px vertical)
- Header padding: `px-4 py-4` (16px horizontal, 16px vertical)
- Table margin: `mb-6` (24px)

#### Buttons
- Button padding: `px-6 py-3` (24px horizontal, 12px vertical)
- Button gap: `gap-3` (12px) between buttons
- Icon-text gap: `gap-2` (8px) icon + text

#### Modals
- Modal padding: `p-6` (24px) modal content
- Modal header: `pb-4` (16px bottom) header separation
- Modal footer: `pt-4 mt-6` footer separation

#### Page Layout
- Container padding: `px-4 md:px-12 lg:px-20`
  - 16px mobile → 48px tablet → 80px desktop
- Page title margin: `mb-6` (24px)
- Section spacing: `mb-12` (48px)
- Content max-width: `max-w-7xl` (1280px)

### Spacing Patterns by Context

**Tight Grouping (Related Items):**
- Use `gap-2` or `gap-3` (8-12px)
- Example: Icon + label, tags in a group

**Standard Grouping (Form Fields, List Items):**
- Use `gap-4` or `gap-6` (16-24px)
- Example: Form inputs, card content sections

**Section Separation:**
- Use `gap-8` or `mb-12` (32-48px)
- Example: Between major page sections

### Border Radius Standards
```css
--radius-sm:    0.25rem  /* 4px - Small elements, badges */
--radius-base:  0.375rem /* 6px - Buttons, inputs */
--radius-md:    0.5rem   /* 8px - Cards, modals (current) */
--radius-lg:    0.75rem  /* 12px - Large containers */
--radius-xl:    1rem     /* 16px - Hero sections */
--radius-full:  9999px   /* Pills, avatars */
```

### Responsive Spacing

**Mobile (< 768px):**
- Reduce container padding: `px-4`
- Tighter card padding: `p-4` instead of `p-6`
- Smaller gaps: `gap-3` instead of `gap-4`

**Tablet (768px - 1024px):**
- Medium container padding: `px-8` or `px-12`
- Standard spacing as defined

**Desktop (> 1024px):**
- Full spacing as defined
- Max container padding: `px-20`

---

## 4. Elevation & Effects

### Shadow System
```css
/* Subtle lift, hover states */
--shadow-xs:   0 1px 2px 0 rgb(0 0 0 / 0.05)

/* Cards at rest, dropdown menus */
--shadow-sm:   0 1px 3px 0 rgb(0 0 0 / 0.1),
               0 1px 2px -1px rgb(0 0 0 / 0.1)

/* Elevated cards, active dropdowns */
--shadow-base: 0 4px 6px -1px rgb(0 0 0 / 0.1),
               0 2px 4px -2px rgb(0 0 0 / 0.1)

/* Modals, popovers */
--shadow-md:   0 10px 15px -3px rgb(0 0 0 / 0.1),
               0 4px 6px -4px rgb(0 0 0 / 0.1)

/* Drawers, major overlays */
--shadow-lg:   0 20px 25px -5px rgb(0 0 0 / 0.1),
               0 8px 10px -6px rgb(0 0 0 / 0.1)

/* Maximum elevation */
--shadow-xl:   0 25px 50px -12px rgb(0 0 0 / 0.25)
```

### Shadow Usage
- Tables/Cards at rest: `shadow-sm`
- Hover states: `shadow-base`
- Modals/Dialogs: `shadow-md` or `shadow-lg`
- Dropdown menus: `shadow-base`

### Transition Standards
```css
/* Button states, hover effects */
--transition-fast:    150ms cubic-bezier(0.4, 0, 0.2, 1)

/* Standard interactions */
--transition-base:    200ms cubic-bezier(0.4, 0, 0.2, 1)

/* Modals, panels, complex animations */
--transition-slow:    300ms cubic-bezier(0.4, 0, 0.2, 1)

/* Page transitions (rare) */
--transition-slower:  500ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Component-Specific Effects

**Buttons:**
- Default: `shadow-sm`
- Hover: `shadow-base` + `scale-[1.02]`
- Active: `shadow-none` + `scale-[0.98]`
- Disabled: `opacity-50` + `cursor-not-allowed`
- Transition: `transition-fast`

**Cards:**
- Default: `shadow-sm`
- Hover: `shadow-base` (interactive cards only)
- Transition: `transition-base`

**Inputs:**
- Default: border with focus-visible ring
- Focus: `ring-2 ring-primary-500 ring-offset-2`
- Error: `ring-2 ring-error-500`
- Transition: `transition-fast`

---

## 5. Implementation Strategy

### Phase 1.1: Define Design Tokens

**File:** `src/styles.css`

1. Extend DaisyUI theme blocks with new color shades (light/dark)
2. Add typography variables to `@theme` block
3. Add spacing, shadow, and transition tokens
4. Keep all existing DaisyUI variables

### Phase 1.2: Systematic Component Updates

**Priority Order:**

#### High Priority (Immediate Visual Impact)
1. **Navbar** - Typography, spacing, responsive behavior
2. **Buttons** - Consistent padding, shadows, transitions
3. **Forms** - Field spacing, label typography, validation states
4. **Cards** - Padding, shadows, consistent structure
5. **Tables** - Cell padding, header styling, row spacing

#### Medium Priority (Consistency)
6. **Modals** - Padding, shadow, backdrop
7. **Page Containers** - Consistent width, padding, section spacing
8. **Typography** - Apply heading hierarchy across all pages
9. **Loading States** - Consistent spinners and skeleton screens

#### Low Priority (Polish)
10. **Transitions** - Add smooth transitions to interactive elements
11. **Hover States** - Consistent hover effects across components
12. **Focus States** - Keyboard navigation improvements

### Phase 1.3: Component Refactoring Process

For each component:
1. Update template with new spacing classes (`gap-4`, `p-6`, etc.)
2. Apply typography scale (`text-base`, `text-sm`, `font-medium`, etc.)
3. Use new color shades (`primary-600`, `neutral-500`, etc.)
4. Add consistent shadows and transitions
5. Test in both light and dark modes
6. Test responsive behavior on mobile/tablet/desktop

### Phase 1.4: Validation

- Visual regression testing (manual or automated screenshots)
- Accessibility audit (contrast ratios, focus states)
- Performance check (CSS bundle size)
- Cross-browser testing (Chrome, Firefox, Safari)

---

## 6. Success Criteria

### Visual Consistency
- [ ] All similar components use the same spacing
- [ ] Typography hierarchy is consistent across all pages
- [ ] Colors are used consistently (no random hex codes)

### Professional Feel
- [ ] Consistent shadows on elevated elements
- [ ] Smooth transitions on interactive elements
- [ ] Proper hover/focus states everywhere

### Accessibility
- [ ] WCAG AA contrast ratios met (4.5:1 for text, 3:1 for UI)
- [ ] Focus states visible on all interactive elements
- [ ] Keyboard navigation works smoothly

### Responsive Design
- [ ] Layout works on mobile (320px+), tablet (768px+), desktop (1024px+)
- [ ] Touch targets are at least 44x44px on mobile
- [ ] Text is readable at all sizes

### Maintainability
- [ ] Design tokens documented in this file
- [ ] CSS variables used instead of hard-coded values
- [ ] No significant increase in CSS bundle size

### Documentation
- [ ] Design system documented in `docs/DESIGN_SYSTEM.md`
- [ ] Component examples created
- [ ] Updated `docs/claude.md` with new patterns

---

## 7. Migration Checklists

### Design Token Migration

```
□ Primary color scales (50-900) added to DaisyUI light theme
□ Primary color scales (50-900) added to DaisyUI dark theme
□ Secondary color scales (50-900) added to both themes
□ Neutral gray scales (50-900) added to both themes
□ Semantic color scales (success, error, warning, info) added
□ Typography variables defined in @theme block
□ Spacing scale verified (Tailwind default is good)
□ Shadow system variables added
□ Transition timing variables added
□ Border radius variables added
□ Design tokens documented in docs/DESIGN_SYSTEM.md
```

### Per-Component Update Checklist

```
□ Container spacing updated (container mx-auto px-4 md:px-12 lg:px-20)
□ Typography scale applied (h1-h6, body, labels)
□ Color variables updated (use new shades instead of base)
□ Internal spacing standardized (gap-4, p-6, etc.)
□ Shadows applied appropriately (shadow-sm, shadow-base, etc.)
□ Transitions added to interactive elements (transition-fast, transition-base)
□ Hover states consistent and smooth
□ Focus states visible and accessible
□ Responsive spacing tested on mobile/tablet/desktop
□ Light mode tested
□ Dark mode tested
□ Component looks consistent with others in its category
```

---

## 8. Notes & Considerations

### Why OKLCH Color Space?
- Perceptually uniform (equal steps look equally different)
- Better for programmatic color generation
- Already in use, just extending it

### Why Not Change Libraries Yet?
- DaisyUI provides good base components with theme system
- PrimeNG handles complex components (tables, calendars) well
- Visual polish doesn't require library changes
- Later phases will address library removal

### Performance Impact
- Color variables: Minimal (CSS variables are cheap)
- Typography system: None (just using existing Tailwind utilities)
- Shadows/transitions: Minimal (few additional CSS rules)
- Expected total CSS increase: < 5KB gzipped

### Accessibility Notes
- All color combinations will be tested for WCAG AA
- Focus states will use `ring-2 ring-primary-500 ring-offset-2` pattern
- Touch targets on mobile will be minimum 44x44px
- Color will never be the only indicator of state

---

**Last Updated:** 2026-01-12
**Status:** Design Complete - Ready for Implementation
**Next Step:** Create implementation plan and begin token definition
