import { Injectable, LOCALE_ID, inject } from '@angular/core';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class FormatService {
  private locale = inject(LOCALE_ID);

  dpmDate(date?: Date | null, subtractMonth: boolean = false): string {
    if (!date) {
      date = new Date();
    }

    if (subtractMonth) {
      date.setMonth(date.getMonth() - 1);
    }

    return formatDate(date, 'MM/dd/yyyy', this.locale);
  }

  datagenDate(date?: Date): string {
    if (!date) return '';

    return formatDate(date, 'MM-dd-yyyy', this.locale);
  }

  pointsWord(points: number): string {
    return Math.abs(points) === 1 ? 'Point' : 'Points';
  }
}
