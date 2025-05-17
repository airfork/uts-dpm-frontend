import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  imports: [NgClass],
})
export class LoadingComponent {
  public _halfScreen: boolean = false;

  @Input()
  get halfScreen() {
    return this._halfScreen;
  }

  set halfScreen(value: boolean) {
    this._halfScreen = value;
  }

  constructor() {}
}
