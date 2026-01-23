import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  standalone: true,
})
export class EmptyStateComponent {
  icon = input<string>('pi-inbox');
  heading = input.required<string>();
  description = input<string>('');
}
