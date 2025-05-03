import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthModule } from '../auth/auth.module';
import { ConfirmBoxComponent } from './confirm-box/confirm-box.component';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { RouterLinkActive, RouterLink } from '@angular/router';

@NgModule({
  declarations: [NavbarComponent, ConfirmBoxComponent],
  imports: [CommonModule, AuthModule, FormsModule, RippleModule, RouterLink, RouterLinkActive],
  exports: [NavbarComponent, ConfirmBoxComponent],
})
export class UiModule {}
