# EmptyStateComponent

Centered message display for empty lists, no data, or zero states. Provides visual feedback when content is unavailable.

## Inputs

| Input       | Type   | Default    | Description                            |
| ----------- | ------ | ---------- | -------------------------------------- |
| heading     | string | (required) | Main message text                      |
| icon        | string | 'pi-inbox' | PrimeIcons class name for icon         |
| description | string | ''         | Optional supporting text below heading |

## Usage

```html
<app-empty-state icon="pi-users" heading="No users found" description="There are no users matching your search criteria">
  <app-button variant="primary" (click)="addUser()">Add User</app-button>
</app-empty-state>
```

## Behavior

- Icon displays in a circular neutral background
- Content is centered with generous padding (py-16)
- Description text has max-width constraint for readability
- Supports content projection for action buttons via `<ng-content />`
- Use for empty lists, search results, or initial states
- Dark mode supported via theme tokens
