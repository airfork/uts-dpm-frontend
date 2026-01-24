import { Component, input } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'app-select-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './select-skeleton.component.html',
})
export class SelectSkeletonComponent {
  /** Whether to show the label */
  showLabel = input<boolean>(true);
}
