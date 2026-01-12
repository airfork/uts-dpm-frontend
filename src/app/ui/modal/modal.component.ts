import { Component, input, output, computed, effect } from '@angular/core';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  standalone: true,
})
export class ModalComponent {
  // Signal inputs
  open = input.required<boolean>();
  size = input<ModalSize>('md');
  closeOnBackdrop = input<boolean>(true);
  closeOnEscape = input<boolean>(true);

  // Signal output
  closed = output<void>();

  // Computed classes for modal container
  classes = computed(() => {
    const baseClasses = [
      'relative',
      'bg-base-100',
      'rounded-lg',
      'shadow-[var(--shadow-xl)]',
      'transform transition-all duration-[var(--transition-base)]',
      'w-full',
      'mx-4',
    ];

    // Size classes
    const sizeClasses: Record<ModalSize, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    };

    const classes = [...baseClasses, sizeClasses[this.size()] || sizeClasses.md];

    // Scale animation based on open state
    if (this.open()) {
      classes.push('scale-100 opacity-100');
    } else {
      classes.push('scale-95 opacity-0');
    }

    return classes.join(' ');
  });

  constructor() {
    // Effect to handle body scroll lock and escape key
    effect(() => {
      const isOpen = this.open();

      if (isOpen) {
        // Lock body scroll
        document.body.style.overflow = 'hidden';

        // Add escape key listener
        const handleEscape = (event: KeyboardEvent) => {
          if (event.key === 'Escape' && this.closeOnEscape()) {
            this.handleClose();
          }
        };

        document.addEventListener('keydown', handleEscape);

        // Cleanup function
        return () => {
          document.body.style.overflow = '';
          document.removeEventListener('keydown', handleEscape);
        };
      } else {
        // Ensure body scroll is unlocked when modal is closed
        document.body.style.overflow = '';
      }

      return undefined;
    });
  }

  // Handle close button click
  handleClose(): void {
    this.closed.emit();
  }

  // Handle backdrop click
  handleBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.handleClose();
    }
  }
}
