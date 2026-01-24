import { Component, input } from '@angular/core';
import { SkeletonComponent } from './skeleton.component';

@Component({
  selector: 'app-table-skeleton',
  standalone: true,
  imports: [SkeletonComponent],
  templateUrl: './table-skeleton.component.html',
})
export class TableSkeletonComponent {
  /** Number of rows to display */
  rows = input<number>(5);

  /** Number of columns to display */
  columns = input<number>(3);

  /** Whether to show a header row */
  showHeader = input<boolean>(true);

  /** Whether to show avatar in first column */
  showAvatar = input<boolean>(false);

  /** Array helper for iteration */
  get rowsArray(): number[] {
    return Array.from({ length: this.rows() }, (_, i) => i);
  }

  get columnsArray(): number[] {
    return Array.from({ length: this.columns() }, (_, i) => i);
  }
}
