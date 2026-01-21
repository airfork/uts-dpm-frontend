# PageHeaderComponent

Consistent page header with icon, title, and optional subtitle. Provides visual hierarchy at the top of content areas.

## Inputs

| Input        | Type                                            | Default    | Description                                             |
| ------------ | ----------------------------------------------- | ---------- | ------------------------------------------------------- |
| icon         | string                                          | (required) | PrimeIcons class name (e.g., 'pi-users')                |
| title        | string                                          | (required) | Main heading text                                       |
| subtitle     | string                                          | ''         | Optional descriptive text below title                   |
| variant      | 'primary' \| 'secondary' \| 'success' \| 'info' | 'primary'  | Color theme for icon background                         |
| showGradient | boolean                                         | false      | (Currently unused) Reserved for future gradient effects |

## Usage

```html
<app-page-header icon="pi-users" title="User Management" subtitle="Manage user accounts and permissions" variant="primary" />
```

## Behavior

- Icon appears in a colored gradient box with shadow
- Variant determines icon background color (primary: blue, secondary: purple, success: green, info: cyan)
- Title uses bold 2xl font size
- Subtitle uses smaller, muted text
- Includes bottom margin (mb-6) by default
- All variants support dark mode automatically
