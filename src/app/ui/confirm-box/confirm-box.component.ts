import { Component, effect, ElementRef, input, model, output, ViewChild } from '@angular/core';
import { Ripple } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  imports: [Ripple, FormsModule],
})
export class ConfirmBoxComponent {
  isOpen = model.required<boolean>();
  title = input('Are you sure?');
  message = input.required<string>();
  outputKey = input<string>('');
  onConfirm = input<() => void>();

  @ViewChild('confirmModal')
  confirmModalElement!: ElementRef<HTMLDialogElement>;

  confirmed = output<string>();

  constructor() {
    effect(() => {
      if (this.isOpen()) {
        this.showModalInternal();
      } else {
        this.closeModalInternal();
      }
    });
  }

  confirm() {
    this.confirmed.emit(this.outputKey());
    this.isOpen.set(false);

    const onConfirm = this.onConfirm();
    if (onConfirm) onConfirm();
  }

  requestClose() {
    this.isOpen.set(false);
  }

  private showModalInternal() {
    if (this.confirmModalElement && this.confirmModalElement.nativeElement) {
      this.confirmModalElement.nativeElement.showModal();
    }
  }

  private closeModalInternal() {
    if (this.confirmModalElement && this.confirmModalElement.nativeElement) {
      this.confirmModalElement.nativeElement.close();
    }
  }
}
