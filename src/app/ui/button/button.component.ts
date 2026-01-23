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

  classes = computed(() => {
    const baseClasses = [
      'inline-flex items-center justify-center',
      'font-semibold rounded-lg',
      'cursor-pointer',
      'transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const variantClasses: Record<ButtonVariant, string[]> = {
      primary: [
        'bg-gradient-to-r from-primary-600 to-primary-500 text-white',
        'hover:from-primary-700 hover:to-primary-600',
        'shadow-md shadow-primary-500/25 hover:shadow-lg hover:shadow-primary-500/30',
        'focus:ring-primary-500',
      ],
      secondary: ['btn-secondary', 'focus:ring-primary-500'],
      ghost: ['btn-ghost', 'focus:ring-neutral-500'],
      outline: ['btn-outline', 'focus:ring-primary-500'],
      success: [
        'bg-gradient-to-r from-success-600 to-success-500 text-white',
        'hover:from-success-700 hover:to-success-600',
        'shadow-md shadow-success-500/25 hover:shadow-lg hover:shadow-success-500/30',
        'focus:ring-success-500',
      ],
      error: [
        'bg-gradient-to-r from-error-600 to-error-500 text-white',
        'hover:from-error-700 hover:to-error-600',
        'shadow-md shadow-error-500/25 hover:shadow-lg hover:shadow-error-500/30',
        'focus:ring-error-500',
      ],
    };

    const sizeClasses: Record<ButtonSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
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
