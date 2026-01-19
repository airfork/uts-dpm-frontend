import { Component, input, computed } from '@angular/core';
import { StatCardVariant } from './stat-card.types';

@Component({
  selector: 'app-stat-card',
  templateUrl: './stat-card.component.html',
  standalone: true,
})
export class StatCardComponent {
  title = input.required<string>();
  value = input.required<string | number>();
  subtitle = input<string>('');
  variant = input<StatCardVariant>('default');
  icon = input<string>('');

  containerClasses = computed(() => {
    const baseClasses = 'p-4 rounded-lg backdrop-blur border';

    const variantClasses: Record<StatCardVariant, string> = {
      default: 'bg-white/10 border-white/20',
      success: 'bg-success-500/20 border-success-400/30',
      error: 'bg-error-500/20 border-error-400/30',
      warning: 'bg-warning-500/20 border-warning-400/30',
      info: 'bg-info-500/20 border-info-400/30',
    };

    return `${baseClasses} ${variantClasses[this.variant()]}`;
  });

  titleClasses = computed(() => {
    const variantClasses: Record<StatCardVariant, string> = {
      default: 'text-white/70',
      success: 'text-success-100',
      error: 'text-error-100',
      warning: 'text-warning-100',
      info: 'text-info-100',
    };
    return `text-xs uppercase tracking-wide font-medium ${variantClasses[this.variant()]}`;
  });

  valueClasses = computed(() => {
    const variantClasses: Record<StatCardVariant, string> = {
      default: 'text-white',
      success: 'text-white',
      error: 'text-white',
      warning: 'text-white',
      info: 'text-white',
    };
    return `text-2xl font-bold mt-1 ${variantClasses[this.variant()]}`;
  });
}
