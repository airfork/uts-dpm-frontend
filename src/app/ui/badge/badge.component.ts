import { Component, input, computed } from '@angular/core';
import { BadgeVariant, BadgeSize } from './badge.types';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html',
  standalone: true,
})
export class BadgeComponent {
  variant = input<BadgeVariant>('neutral');
  size = input<BadgeSize>('md');
  showIcon = input<boolean>(false);
  pill = input<boolean>(true);

  classes = computed(() => {
    const baseClasses = [
      'inline-flex items-center gap-1 font-medium',
      this.pill() ? 'rounded-full' : 'rounded-md',
    ];

    const variantClasses: Record<BadgeVariant, string[]> = {
      success: [
        'bg-success-50 text-success-700 border border-success-200',
        'dark:bg-success-900/30 dark:text-success-400 dark:border-success-800',
      ],
      error: [
        'bg-error-50 text-error-700 border border-error-200',
        'dark:bg-error-900/30 dark:text-error-400 dark:border-error-800',
      ],
      warning: [
        'bg-warning-50 text-warning-700 border border-warning-200',
        'dark:bg-warning-900/30 dark:text-warning-400 dark:border-warning-800',
      ],
      info: [
        'bg-info-50 text-info-700 border border-info-200',
        'dark:bg-info-900/30 dark:text-info-400 dark:border-info-800',
      ],
      neutral: [
        'bg-neutral-100 text-neutral-700 border border-neutral-200',
        'dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700',
      ],
      primary: [
        'bg-primary-50 text-primary-700 border border-primary-200',
        'dark:bg-primary-900/30 dark:text-primary-400 dark:border-primary-800',
      ],
      secondary: [
        'bg-secondary-50 text-secondary-700 border border-secondary-200',
        'dark:bg-secondary-900/30 dark:text-secondary-400 dark:border-secondary-800',
      ],
    };

    const sizeClasses: Record<BadgeSize, string> = {
      sm: 'px-1.5 py-0.5 text-xs',
      md: 'px-2 py-0.5 text-xs',
      lg: 'px-2.5 py-1 text-sm',
    };

    return [...baseClasses, ...variantClasses[this.variant()], sizeClasses[this.size()]].join(' ');
  });

  iconPath = computed(() => {
    const icons: Record<BadgeVariant, string> = {
      success: 'M5 13l4 4L19 7',
      error: 'M6 18L18 6M6 6l12 12',
      warning:
        'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      neutral: '',
      primary: '',
      secondary: '',
    };
    return icons[this.variant()];
  });
}
