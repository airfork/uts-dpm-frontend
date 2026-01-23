import {
  Component,
  input,
  output,
  signal,
  computed,
  ElementRef,
  HostListener,
  inject,
  Injector,
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
  private injector = inject(Injector);

  // Inputs
  colors = input.required<GetDpmColors[]>();
  selectedColor = input<GetDpmColors | null>(null);
  usedColorIds = input<number[]>([]);

  // Outputs
  colorSelected = output<GetDpmColors | null>();

  // State
  isOpen = signal(false);
  dropdownUp = signal(false);
  dropdownPosition = signal<{ top: number; left: number }>({ top: 0, left: 0 });

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
    if (!this.isOpen()) {
      // Check if dropdown should open upward
      this.checkDropdownPosition();
    }
    this.isOpen.update((v) => !v);
  }

  private checkDropdownPosition() {
    const element = this.elementRef.nativeElement;
    const button = element.querySelector('.color-cell');
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const dropdownHeight = 256; // max-height of dropdown (16rem)
    const spaceBelow = window.innerHeight - rect.bottom;

    // If not enough space below, open upward
    const openUp = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
    this.dropdownUp.set(openUp);

    // Calculate fixed position
    if (openUp) {
      this.dropdownPosition.set({
        top: rect.top - dropdownHeight - 4,
        left: rect.left,
      });
    } else {
      this.dropdownPosition.set({
        top: rect.bottom + 4,
        left: rect.left,
      });
    }
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

  @HostListener('window:scroll')
  onScroll() {
    if (this.isOpen()) {
      this.isOpen.set(false);
    }
  }
}
