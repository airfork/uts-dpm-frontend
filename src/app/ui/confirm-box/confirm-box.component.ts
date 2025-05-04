import { Component, EventEmitter, Input, input, Output, output } from '@angular/core';
import Required from '../../shared/required-decorator';

@Component({
  selector: 'app-confirm-box',
  templateUrl: './confirm-box.component.html',
  standalone: false,
})
export class ConfirmBoxComponent {
  private _isOpen = false;

  @Output() isOpenChange = new EventEmitter<boolean>();
  @Input() @Required get isOpen(): boolean {
    return this._isOpen;
  }

  set isOpen(value: boolean) {
    this._isOpen = value;
    this.isOpenChange.emit(value);
  }

  title = input('Are you sure?');
  message = input.required<string>();
  outputKey = input.required<string>();

  confirmed = output<string>();

  constructor() {}

  confirm() {
    this.confirmed.emit(this.outputKey());
  }
}
