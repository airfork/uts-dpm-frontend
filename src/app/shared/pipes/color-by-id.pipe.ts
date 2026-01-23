import { Pipe, PipeTransform } from '@angular/core';
import { GetDpmColors } from '../../models/get-dpm-colors';

@Pipe({
  name: 'colorById',
  standalone: true,
})
export class ColorByIdPipe implements PipeTransform {
  transform(colors: GetDpmColors[], colorId: number | undefined | null): GetDpmColors | null {
    if (!colorId) return null;
    return colors.find((c) => c.colorId === colorId) || null;
  }
}
