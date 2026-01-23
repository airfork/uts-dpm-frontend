import { Component, input, signal, ContentChild, TemplateRef } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-collapsible',
  templateUrl: './collapsible.component.html',
  standalone: true,
  imports: [NgTemplateOutlet],
})
export class CollapsibleComponent {
  // Inputs
  collapsed = input<boolean>(false);
  headerClass = input<string>('');
  contentClass = input<string>('');

  // Content projection
  @ContentChild('header') headerTemplate?: TemplateRef<unknown>;

  // Internal state
  isCollapsed = signal(false);

  constructor() {
    // Initialize collapsed state from input in ngOnInit-like pattern
    setTimeout(() => {
      this.isCollapsed.set(this.collapsed());
    }, 0);
  }

  toggle(): void {
    this.isCollapsed.update((collapsed) => !collapsed);
  }
}
