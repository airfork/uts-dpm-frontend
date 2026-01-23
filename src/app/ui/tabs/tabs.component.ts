import { Component, computed, input, output, model } from '@angular/core';
import { Tab, TabSize, TabVariant } from './tabs.types';

@Component({
  selector: 'app-tabs',
  standalone: true,
  template: `
    <div [class]="containerClasses()" role="tablist" [attr.aria-label]="ariaLabel()">
      @for (tab of tabs(); track tab.name) {
        <button
          type="button"
          role="tab"
          [attr.aria-selected]="activeTab() === tab.name"
          [attr.aria-controls]="tab.name + '-panel'"
          [disabled]="tab.disabled"
          [class]="getTabClasses(tab)"
          (click)="selectTab(tab.name)"
        >
          {{ tab.label }}
        </button>
      }
    </div>
  `,
})
export class TabsComponent {
  /** Array of tab definitions */
  tabs = input.required<Tab[]>();

  /** Currently active tab name (two-way binding) */
  activeTab = model.required<string>();

  /** Size variant */
  size = input<TabSize>('md');

  /** Style variant */
  variant = input<TabVariant>('bordered');

  /** Accessibility label for the tab list */
  ariaLabel = input<string>('Tabs');

  /** Center tabs */
  centered = input<boolean>(false);

  /** Event emitted when tab changes */
  tabChange = output<string>();

  containerClasses = computed(() => {
    const base = 'flex gap-1';
    const center = this.centered() ? 'justify-center' : '';

    return `${base} ${center}`.trim();
  });

  getTabClasses(tab: Tab): string {
    const isActive = this.activeTab() === tab.name;
    const size = this.size();
    const variant = this.variant();

    // Base classes
    const base =
      'relative font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2';

    // Size classes
    const sizeClasses: Record<TabSize, string> = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    // Variant and state classes
    let variantClasses = '';
    if (variant === 'bordered') {
      variantClasses = isActive
        ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
        : 'border-b-2 border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:border-neutral-300 dark:hover:border-neutral-600';
    } else if (variant === 'lifted') {
      variantClasses = isActive
        ? 'bg-base-100 border border-neutral-200 dark:border-neutral-700 border-b-transparent rounded-t-lg -mb-px text-primary-600 dark:text-primary-400'
        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100';
    } else {
      // default
      variantClasses = isActive
        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg'
        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg';
    }

    // Disabled classes
    const disabledClasses = tab.disabled
      ? 'opacity-50 cursor-not-allowed pointer-events-none'
      : 'cursor-pointer';

    return `${base} ${sizeClasses[size]} ${variantClasses} ${disabledClasses}`.trim();
  }

  selectTab(name: string): void {
    const tab = this.tabs().find((t) => t.name === name);
    if (tab && !tab.disabled) {
      this.activeTab.set(name);
      this.tabChange.emit(name);
    }
  }
}
