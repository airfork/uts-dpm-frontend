import { Component, input, computed } from '@angular/core';
import { AvatarSize, AvatarVariant } from './avatar.types';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  standalone: true,
})
export class AvatarComponent {
  name = input<string>('');
  imageUrl = input<string>('');
  size = input<AvatarSize>('md');
  variant = input<AvatarVariant>('primary');

  initials = computed(() => {
    const n = this.name();
    if (!n) return '?';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return n.substring(0, 2).toUpperCase();
  });

  containerClasses = computed(() => {
    const sizeClasses: Record<AvatarSize, string> = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
    };

    const variantClasses: Record<AvatarVariant, string> = {
      primary: 'bg-gradient-to-br from-primary-400 to-primary-600',
      secondary: 'bg-gradient-to-br from-secondary-400 to-secondary-600',
      success: 'bg-gradient-to-br from-success-400 to-success-600',
      error: 'bg-gradient-to-br from-error-400 to-error-600',
      neutral: 'bg-gradient-to-br from-neutral-400 to-neutral-600',
    };

    return [
      'rounded-full flex items-center justify-center font-semibold text-white shadow-sm overflow-hidden',
      sizeClasses[this.size()],
      variantClasses[this.variant()],
    ].join(' ');
  });
}
