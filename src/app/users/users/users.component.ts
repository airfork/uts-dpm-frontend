import { Component } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../../ui/navbar/navbar.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  imports: [UiModule, RouterOutlet, NavbarComponent],
})
export class UsersComponent {
  constructor() {}
}
