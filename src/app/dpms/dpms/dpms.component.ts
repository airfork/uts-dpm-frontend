import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../ui/navbar/navbar.component';

@Component({
  selector: 'app-dpms',
  templateUrl: './dpms.component.html',
  imports: [RouterOutlet, NavbarComponent],
})
export class DpmsComponent {
  constructor() {}
}
