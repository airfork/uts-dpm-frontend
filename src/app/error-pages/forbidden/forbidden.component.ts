import { Component } from '@angular/core';
import { ErrorPageComponent } from '../error-page/error-page.component';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  imports: [ErrorPageComponent],
})
export class ForbiddenComponent {
  constructor() {}
}
