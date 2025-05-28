import { Component } from '@angular/core';
import { ErrorPageComponent } from '../error-page/error-page.component';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  imports: [ErrorPageComponent],
})
export class NotFoundComponent {
  constructor() {}
}
