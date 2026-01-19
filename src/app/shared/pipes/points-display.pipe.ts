import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pointsDisplay',
  standalone: true,
})
export class PointsDisplayPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';
    if (value > 0) return `+${value}`;
    return value.toString();
  }
}
