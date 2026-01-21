# Dark Mode Color Redesign

## Problem Statement

The current dark mode implementation has several issues:

1. **Inconsistent form styling** - Some inputs have white borders, others don't; backgrounds vary between new-dpm and edit-dpm pages
2. **"Orange + black" aesthetic** - Dark mode swaps primary/secondary colors, resulting in yellow primary on neutral dark backgrounds that lacks vibrancy
3. **Color stripes disappear** - Left border indicators on cards and table rows lose visibility in dark mode
4. **Secondary color underutilized** - Yellow barely appears in light mode; purple and yellow feel disconnected rather than complementary

## Design Goals

- Purple and yellow should feel like a cohesive complementary palette in **both** modes
- Purple remains dominant (primary actions, headers, structure)
- Yellow serves as accent (highlights, feedback, strategic splashes)
- Dark mode should feel intentionally branded, not just "inverted"

---

## Color Foundation

### Light Mode (Unchanged)

```css
--color-primary: oklch(0.31 0.0566 268.94);     /* Purple */
--color-secondary: oklch(0.68 0.171441 53.08);  /* Yellow */
--color-base-100: oklch(1 0 0);                  /* White */
--color-base-200: oklch(0.92 0 0);               /* Light gray */
--color-base-300: oklch(0.85 0 0);               /* Gray */
```

### Dark Mode (Revised)

**Key change**: Base colors shift from neutral grays to purple-tinted darks.

```css
/* Purple-tinted dark backgrounds */
--color-base-100: oklch(0.20 0.03 270);   /* Main background - deep purple-black */
--color-base-200: oklch(0.24 0.025 270);  /* Card background */
--color-base-300: oklch(0.28 0.02 270);   /* Elevated surfaces */
--color-base-content: oklch(0.90 0.02 270); /* Light text with purple tint */

/* Primary stays purple - NOT swapped to yellow */
--color-primary: oklch(0.55 0.12 268.94);        /* Lighter purple for visibility */
--color-primary-content: oklch(1 0 0);            /* White text */

/* Secondary stays yellow - used for accents */
--color-secondary: oklch(0.75 0.16 53.08);       /* Vibrant yellow */
--color-secondary-content: oklch(0.20 0.03 270); /* Dark text */
```

### Why Purple-Tinted Backgrounds?

1. Solves "orange + black" - the whole UI feels branded
2. Complementary color theory - purple backgrounds make yellow accents pop
3. Cohesive identity - same brand feel in both modes
4. Current base (`oklch(0.28 0.0299 256.85)`) already hints at this but saturation is too low

---

## Primary Purple Usage (Dark Mode)

Purple stays primary but uses lighter shades for visibility on dark backgrounds:

| Element | Light Mode | Dark Mode |
|---------|------------|-----------|
| Button background | purple-600 | purple-500 |
| Button hover | purple-700 | purple-400 |
| Button active | purple-800 | purple-600 |
| Link text | purple-600 | purple-300 |
| Subtle text | purple-500 | purple-200 |
| Borders | purple-200 | purple-400/30% opacity |

### Navbar & Headers

- Light mode: `bg-primary-600` (current)
- Dark mode: `bg-primary-500` (one step lighter)
- Both: white text, consistent brand presence

---

## Yellow Accent Placement

Yellow appears strategically to create energy without overwhelming purple:

### Highlights
- Badges: "New", "Pending", notification counts
- Selected tab indicators (underline or pill background)
- Notification dots
- Positive points display

### Interactive Feedback
- Focus rings (especially in dark mode)
- Hover state accents
- Active/pressed indicators
- Progress bars, loading states

### Strategic Splashes
- Hero section stat cards (default variant gets yellow accent)
- Empty state icons
- Color stripes for certain content types
- Occasional icon accents

---

## Form Styling

### The Problem

Current inconsistencies:
- Some inputs hardcode `border-neutral-200`
- Others use dynamic `getInputBorderClass()`
- `dpm-form-input` class doesn't define borders for dark mode
- Select dropdowns have different styling than text inputs

### The Solution

One unified approach - **Outlined** style in both modes:

```css
/* Light Mode Inputs */
.dpm-form-input {
  background-color: var(--color-neutral-50);
  border: 1px solid var(--color-neutral-300);
}

.dpm-form-input:focus {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px oklch(from var(--color-primary-500) l c h / 0.2);
}

/* Dark Mode Inputs */
:root[data-theme="dark"] .dpm-form-input {
  background-color: var(--color-base-200);
  border: 1px solid oklch(from var(--color-primary-400) l c h / 0.3);
}

:root[data-theme="dark"] .dpm-form-input:focus {
  border-color: var(--color-secondary-400);
  box-shadow: 0 0 0 3px oklch(from var(--color-secondary-400) l c h / 0.25);
}
```

### Implementation Tasks

1. Remove all hardcoded `border-neutral-200` from form templates
2. Update `dpm-form-input` class to include border definitions
3. Apply same styling to selects, textareas, and autocomplete inputs
4. Use yellow focus rings in dark mode (accent color doing its job)

---

## Color Stripes & Visual Indicators

### Table Row Stripes (Home Page)

Current implementation uses `box-shadow: inset 3px 0 0` which works but needs dark mode adjustments:

```css
/* Both modes - semantic colors */
.home-row-positive {
  box-shadow: inset 4px 0 0 var(--color-success-400);
}

.home-row-negative {
  box-shadow: inset 4px 0 0 var(--color-error-400);
}

/* Dark mode - add subtle glow for visibility */
:root[data-theme="dark"] .home-row-positive {
  box-shadow: inset 4px 0 0 var(--color-success-400),
              inset 8px 0 8px -4px oklch(from var(--color-success-400) l c h / 0.1);
}
```

### Action Cards (User Pages)

```css
/* Light mode */
.user-action-card.border-l-primary-500 {
  border-left-color: var(--color-primary-500);
}

/* Dark mode - use lighter shades */
:root[data-theme="dark"] .user-action-card {
  border-left-color: var(--color-primary-400); /* Override Tailwind */
}
```

### Mobile Cards

Same principle - ensure border-left colors use `-400` shades in dark mode for visibility.

---

## Component Patterns

### Buttons

| Variant | Light Mode | Dark Mode |
|---------|------------|-----------|
| Primary | bg-primary-600, text-white | bg-primary-500, text-white |
| Secondary | bg-secondary-500, text-primary-700 | bg-secondary-500, text-base-100 |
| Outline | border-primary-500, text-primary-600 | border-primary-400, text-primary-300 |
| Ghost | hover:bg-neutral-100 | hover:bg-secondary-500/10 (yellow tint) |

### Tabs (Pill Style)

- Active: purple background (both modes, adjusted shade)
- Inactive hover: subtle purple tint
- Consider: yellow underline indicator as alternative active state

### Stat Cards

| Variant | Accent Color |
|---------|--------------|
| Default | Yellow (brings accent into hero) |
| Success | Green (unchanged) |
| Error | Red (unchanged) |

### Badges

```css
/* Positive points - use yellow */
.home-badge-positive {
  /* Light */
  background: var(--color-secondary-100);
  color: var(--color-secondary-700);

  /* Dark */
  background: var(--color-secondary-900);
  color: var(--color-secondary-300);
}

/* Negative points - keep error colors */
.home-badge-negative {
  /* unchanged */
}
```

---

## Implementation Priority

### Phase 1: Foundation (Do First)
1. Update dark mode CSS custom properties with purple-tinted bases
2. Remove primary/secondary swap in dark mode
3. Adjust primary shades for dark mode visibility

### Phase 2: Forms (High Impact)
1. Consolidate form input styling in `styles.css`
2. Remove hardcoded border classes from templates
3. Add yellow focus rings for dark mode

### Phase 3: Accents (Visual Polish)
1. Add yellow to stat cards, badges, tab indicators
2. Update ghost button hover states
3. Review empty states for yellow accent opportunities

### Phase 4: Stripes & Cards (Cleanup)
1. Adjust color stripe visibility in dark mode
2. Ensure action cards use correct shades
3. Test all components in both modes

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/styles.css` | Dark mode variables, form input styles, component overrides |
| `src/app/dpms/new-dpm/new-dpm.component.html` | Remove hardcoded border classes |
| `src/app/dpms/edit-dpms/edit-dpms.component.html` | Consistent form styling |
| `src/app/users/user-form/user-form.component.html` | Remove hardcoded border classes |
| `src/app/dpms/home/home.component.html` | Badge color classes |
| `src/app/ui/stat-card/` | Add yellow accent to default variant |
| `src/app/ui/button/` | Dark mode ghost hover state |

---

## Success Criteria

- [ ] Purple feels present and branded in dark mode (not muddy)
- [ ] Yellow appears as intentional accent throughout the UI
- [ ] All form inputs have consistent styling in both modes
- [ ] Color stripes visible in dark mode
- [ ] Focus states use yellow in dark mode
- [ ] No hardcoded color classes in templates (use CSS custom properties)
