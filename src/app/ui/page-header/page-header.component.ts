import { Component, input, computed } from '@angular/core';

export type PageHeaderVariant = 'primary' | 'secondary' | 'success' | 'info';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  standalone: true,
})
export class PageHeaderComponent {
  icon = input.required<string>();
  title = input.required<string>();
  subtitle = input<string>('');
  variant = input<PageHeaderVariant>('primary');
  showGradient = input<boolean>(false);

  iconClasses = computed(() => {
    const baseClasses = ['w-10 h-10 rounded-xl', 'flex items-center justify-center', 'shadow-lg'];

    const variantClasses: Record<PageHeaderVariant, string[]> = {
      primary: ['bg-gradient-to-br from-primary-500 to-primary-600', 'shadow-primary-500/20'],
      secondary: [
        'bg-gradient-to-br from-secondary-500 to-secondary-600',
        'shadow-secondary-500/20',
      ],
      success: ['bg-gradient-to-br from-success-500 to-success-600', 'shadow-success-500/20'],
      info: ['bg-gradient-to-br from-info-500 to-info-600', 'shadow-info-500/20'],
    };

    return [...baseClasses, ...(variantClasses[this.variant()] || variantClasses.primary)].join(
      ' '
    );
  });
}
