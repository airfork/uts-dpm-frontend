import { Component, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../modal/modal.component';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  imports: [FormsModule, ModalComponent, ButtonComponent],
})
export class ConfirmBoxComponent {
  isOpen = model.required<boolean>();
  title = input('Are you sure?');
  message = input.required<string>();
  confirmText = input<string>('');
  outputKey = input<string>('');
  onConfirm = input<() => void>();

  confirmed = output<string>();

  confirm() {
    this.confirmed.emit(this.outputKey());
    this.isOpen.set(false);

    const onConfirm = this.onConfirm();
    if (onConfirm) onConfirm();
  }

  requestClose() {
    this.isOpen.set(false);
  }
}
