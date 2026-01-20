# UTS DPM - Agent Instructions

Angular 21 web application for departmental performance management.

## Test Login Information

Username: test@account.com
Password: testAccount

This account has full admin access to the app and should be used when needing to get past the login screen

## Workflow Requirements

### Visual Validation

**Always use Chrome DevTools MCP** to validate UI changes before marking work complete.

**Avoiding API image size limits:**
- Use `take_snapshot` for layout/structure verification (no image limits)
- When screenshots are needed for visual styling:
  - First resize viewport: `resize_page` with max 1400x900
  - Never use `fullPage: true`
  - Target specific elements with `uid` parameter when possible
  - Save to file with `filePath` parameter for large captures

**Validation checklist:**
- Take snapshots to verify layout and structure
- Take viewport screenshots (resized) to verify visual styling
- Check console for errors after changes
- Verify responsive behavior at different viewports
- Test interactive elements (modals, dropdowns, tabs)

### Issue Investigation

When investigating bugs or issues:

1. Use Chrome DevTools to reproduce and inspect
2. Check console errors and network requests
3. Inspect element styles and computed values
4. Read relevant source files to understand context

## Technical Stack

- **Framework**: Angular 21 with signals architecture
- **Styling**: Tailwind CSS 4 with custom design tokens
- **UI Components**: Custom components + PrimeNG
- **State**: Angular signals (`signal()`, `computed()`, `effect()`)
- **Control Flow**: Modern `@if`, `@for`, `@switch` syntax

## Architecture Patterns

### Components

- All components are **standalone**
- Use **signal inputs**: `input<T>()`, `input.required<T>()`
- Use **signal outputs**: `output<T>()`
- Use **computed** for derived state
- Use **effect** for side effects

### Styling

- Design tokens defined in `src/styles.css`
- Use CSS variables: `var(--color-primary-500)`, `var(--shadow-md)`
- Theme-aware (light/dark mode via `[data-theme]`)
- Reference `DESIGN_SYSTEM.md` for token documentation

### Custom UI Components

Located in `src/app/ui/`:

- `button/` - ButtonComponent (variants: primary, secondary, ghost, outline)
- `card/` - CardComponent (variants: default, elevated, outlined)
- `modal/` - ModalComponent (sizes: sm, md, lg, xl)
- `badge/` - BadgeComponent (variants: default, primary, secondary, success, error)
- `avatar/` - AvatarComponent (variants: default, gradient, ring)
- `stat-card/` - StatCardComponent
- `data-table/` - DataTableComponent (pagination, sorting)
- `tabs/` - TabsComponent (keyboard navigation)
- `date-picker/` - DatePickerComponent (PrimeNG wrapper)
- `autocomplete/` - AutocompleteComponent (PrimeNG wrapper)
- `collapsible/` - CollapsibleComponent
- `confirm-box/` - ConfirmBoxComponent
- `form-field/` - FormFieldComponent (ControlValueAccessor for reactive forms)
- `page-header/` - PageHeaderComponent (consistent page headers with icons)
- `empty-state/` - EmptyStateComponent (empty/zero state displays)

## Build Commands

```bash
npm start        # Development server
npm run build    # Production build
npm test         # Run tests
```

## Key Files

- `src/styles.css` - Design tokens and global styles
- `DESIGN_SYSTEM.md` - Complete design token reference
- `docs/DEVELOPMENT_HISTORY.md` - Detailed phase history
- `tailwind.config.js` - Tailwind configuration

## Common Patterns

### Creating a modal

```html
<app-modal [open]="isOpen()" (close)="isOpen.set(false)" size="md">
  <div modal-header>Title</div>
  <div modal-body>Content</div>
  <div modal-footer>
    <app-button variant="ghost" (click)="isOpen.set(false)">Cancel</app-button>
    <app-button variant="primary" (click)="save()">Save</app-button>
  </div>
</app-modal>
```

### Using design tokens

```html
<div class="bg-primary-500 text-white shadow-md p-4">
  <h2 class="text-lg font-semibold">Title</h2>
</div>
```

### Signal-based state

```typescript
export class MyComponent {
  items = signal<Item[]>([]);
  selectedId = signal<string | null>(null);
  selectedItem = computed(() =>
    this.items().find(i => i.id === this.selectedId())
  );
}
```
