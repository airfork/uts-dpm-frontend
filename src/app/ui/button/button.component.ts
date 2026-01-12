import { Component, input, computed } from '@angular/core';
import { ButtonVariant, ButtonSize } from './button.types';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  standalone: true,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  size = input<ButtonSize>('md');
  fullWidth = input<boolean>(false);
  disabled = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  id = input<string>();
  tabindex = input<number>();

  // Compute classes based on inputs
  classes = computed(() => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-medium rounded-md',
      'transition-all duration-[var(--transition-base)]',
      'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    // Variant classes
    const variantClasses = {
      primary: [
        'bg-primary-600 text-white',
        'hover:bg-primary-700 active:bg-primary-800',
        'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
      ],
      secondary: [
        'bg-secondary-600 text-neutral-900',
        'hover:bg-secondary-700 active:bg-secondary-800',
        'shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]',
      ],
      ghost: ['bg-transparent text-neutral-700', 'hover:bg-neutral-100 active:bg-neutral-200'],
      outline: [
        'bg-transparent border-2 border-neutral-300 text-neutral-700',
        'hover:border-neutral-400 hover:bg-neutral-50',
        'active:bg-neutral-100',
      ],
    };

    // Size classes
    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    const classes = [
      ...baseClasses,
      ...(variantClasses[this.variant()] || variantClasses.primary),
      sizeClasses[this.size()] || sizeClasses.md,
    ];

    if (this.fullWidth()) {
      classes.push('w-full');
    }

    return classes.join(' ');
  });
}
