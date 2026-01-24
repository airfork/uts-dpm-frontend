import { Component, input } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'app-card-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './card-skeleton.component.html',
})
export class CardSkeletonComponent {
  /** Number of cards to display */
  count = input<number>(5);

  /** Whether to show avatar */
  showAvatar = input<boolean>(false);

  /** Array helper for iteration */
  get cardsArray(): number[] {
    return Array.from({ length: this.count() }, (_, i) => i);
  }
}
