import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ConfirmBoxComponent } from './confirm-box/confirm-box.component';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { RouterLink, RouterLinkActive } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    RippleModule,
    RouterLink,
    RouterLinkActive,
    NavbarComponent,
    ConfirmBoxComponent,
  ],
})
export class UiModule {}
