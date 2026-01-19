import { Component, input, forwardRef, inject, computed, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.component.html',
  standalone: true,
  imports: [NgClass],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormFieldComponent),
      multi: true,
    },
  ],
})
export class FormFieldComponent implements ControlValueAccessor {
  label = input<string>('');
  hint = input<string>('');
  required = input<boolean>(false);
  type = input<string>('text');
  placeholder = input<string>('');
  id = input.required<string>();

  ngControl = inject(NgControl, { optional: true, self: true });

  value = signal<string>('');
  disabled = signal<boolean>(false);
  touched = signal<boolean>(false);

  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  hasError = computed(() => {
    const control = this.ngControl?.control;
    return control && control.invalid && (control.dirty || control.touched);
  });

  // Covers Angular's built-in validators: required, email, minlength, maxlength.
  // Custom validators return generic "Invalid input" message.
  errorMessage = computed(() => {
    if (!this.hasError()) return '';
    const errors = this.ngControl?.control?.errors;
    if (!errors) return '';

    if (errors['required']) return `${this.label()} is required`;
    if (errors['email']) return 'Please enter a valid email';
    if (errors['minlength'])
      return `Minimum ${errors['minlength'].requiredLength} characters required`;
    if (errors['maxlength'])
      return `Maximum ${errors['maxlength'].requiredLength} characters allowed`;
    return 'Invalid input';
  });

  writeValue(value: unknown): void {
    this.value.set((value as string) || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
    this.onChange(target.value);
  }

  onBlur(): void {
    this.touched.set(true);
    this.onTouched();
  }
}
