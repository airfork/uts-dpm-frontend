import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'points',
  standalone: false,
})
export class PointsPipe implements PipeTransform {
  transform(points?: number): string {
    if (!points) return '';

    if (points > 0) {
      return `+${points}`;
    }
    return points.toString();
  }
}
