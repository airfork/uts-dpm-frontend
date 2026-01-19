# FormFieldComponent

Form input component with label, validation, and error display. Implements ControlValueAccessor for Angular forms integration.

## Inputs

| Input       | Type    | Default    | Description                                     |
| ----------- | ------- | ---------- | ----------------------------------------------- |
| id          | string  | (required) | Unique identifier for the input element         |
| label       | string  | ''         | Label text displayed above input                |
| hint        | string  | ''         | Helper text displayed below input when no error |
| required    | boolean | false      | Shows asterisk next to label                    |
| type        | string  | 'text'     | HTML input type (text, email, password, etc.)   |
| placeholder | string  | ''         | Placeholder text for empty input                |

## Usage

```html
<app-form-field id="email" label="Email Address" hint="We'll never share your email" [required]="true" type="email" placeholder="Enter your email" formControlName="email" />
```

## Notes

- Automatically displays validation errors from Angular forms (required, email, minlength, maxlength)
- Error messages show when control is invalid and touched/dirty
- Hint text is replaced by error message when validation fails
- Uses design system colors for error states and focus rings
- Supports dark mode via theme tokens
- Must be used with Angular Reactive Forms or Template-driven Forms

## Technical Notes

### NgControl Injection Strategy

The component injects `NgControl` with `{ optional: true, self: true }`:

```typescript
ngControl = inject(NgControl, { optional: true, self: true });
```

**Why `self: true` is required**: Without this flag, Angular's DI would search up the injector tree and find the `NG_VALUE_ACCESSOR` provider registered by this component itself, creating a circular dependency. The `self: true` flag restricts lookup to the current injector level only, ensuring the component retrieves the `NgControl` directive applied in the template (e.g., `formControlName="email"`), not its own provider registration.
