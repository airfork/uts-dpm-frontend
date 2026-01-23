import { Component, input, computed } from '@angular/core';

type CardVariant = 'default' | 'elevated' | 'outlined';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  standalone: true,
})
export class CardComponent {
  variant = input<CardVariant>('default');
  padding = input<'sm' | 'md' | 'lg'>('md');
  hover = input<boolean>(false);

  classes = computed(() => {
    const baseClasses = ['rounded-lg', 'transition-all duration-[var(--transition-base)]'];

    // Variant classes
    const variantClasses = {
      default: ['bg-base-100', 'shadow-[var(--shadow-base)]'],
      elevated: ['bg-base-100', 'shadow-[var(--shadow-md)]'],
      outlined: ['bg-base-100', 'border-2 border-neutral-300'],
    };

    // Padding classes
    const paddingClasses = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const classes = [
      ...baseClasses,
      ...(variantClasses[this.variant()] || variantClasses.default),
      paddingClasses[this.padding()] || paddingClasses.md,
    ];

    if (this.hover()) {
      classes.push('hover:shadow-[var(--shadow-lg)]', 'cursor-pointer');
    }

    return classes.join(' ');
  });
}
