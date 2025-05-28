import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  imports: [RouterLink],
})
export class ErrorPageComponent {
  errorCode = input.required<string>();
  message = input.required<string>();

  constructor() {}
}
