import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../ui/navbar/navbar.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  imports: [RouterOutlet, NavbarComponent],
})
export class UsersComponent {
  constructor() {}
}
