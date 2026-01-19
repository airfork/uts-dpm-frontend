import {
  Component,
  input,
  output,
  signal,
  computed,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { GetDpmColors } from '../../../models/get-dpm-colors';

@Component({
  selector: 'app-color-dropdown',
  standalone: true,
  imports: [NgClass],
  templateUrl: './color-dropdown.component.html',
  styleUrl: './color-dropdown.component.css',
})
export class ColorDropdownComponent {
  private elementRef = inject(ElementRef);

  // Inputs
  colors = input.required<GetDpmColors[]>();
  selectedColor = input<GetDpmColors | null>(null);
  usedColorIds = input<number[]>([]);

  // Outputs
  colorSelected = output<GetDpmColors | null>();

  // State
  isOpen = signal(false);

  // Computed
  displayText = computed(() => {
    const color = this.selectedColor();
    return color ? color.colorName : 'None';
  });

  displayHex = computed(() => {
    const color = this.selectedColor();
    return color?.hexCode || null;
  });

  toggle() {
    this.isOpen.update((v) => !v);
  }

  selectColor(color: GetDpmColors | null) {
    this.colorSelected.emit(color);
    this.isOpen.set(false);
  }

  isColorInUse(color: GetDpmColors): boolean {
    const currentId = this.selectedColor()?.colorId;
    // Don't mark current selection as "in use"
    if (color.colorId === currentId) return false;
    return this.usedColorIds().includes(color.colorId);
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
}
