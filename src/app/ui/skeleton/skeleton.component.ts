import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  templateUrl: './skeleton.component.html',
})
export class SkeletonComponent {
  /** Width of the skeleton - can be Tailwind class like 'w-full' or 'w-24' */
  width = input<string>('w-full');

  /** Height of the skeleton - can be Tailwind class like 'h-4' or 'h-8' */
  height = input<string>('h-4');

  /** Whether to use rounded-full (for avatars) or rounded (for text/boxes) */
  rounded = input<'sm' | 'md' | 'lg' | 'full'>('md');

  /** Additional CSS classes */
  class = input<string>('');

  /** Computed classes for the skeleton element */
  classes = computed(() => {
    const roundedClasses: Record<'sm' | 'md' | 'lg' | 'full', string> = {
      sm: 'rounded',
      md: 'rounded-lg',
      lg: 'rounded-xl',
      full: 'rounded-full',
    };

    return [
      'animate-pulse bg-neutral-200 dark:bg-neutral-700',
      this.width(),
      this.height(),
      roundedClasses[this.rounded()],
      this.class(),
    ]
      .filter(Boolean)
      .join(' ');
  });
}
