import { Component, signal, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgClass } from '@angular/common';
import { Ripple } from 'primeng/ripple';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [NgClass, ReactiveFormsModule, Ripple],
})
export class LoginComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  loginFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  badCredentials = signal(false);
  loading = signal(false);

  onSubmit() {
    this.loading.set(true);
    const values = this.loginFormGroup.value;
    this.authService.login(values.username!, values.password!).subscribe({
      next: ({ token }) => {
        this.authService.saveToken(token);
        this.loginFormGroup.reset();
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading.set(false);
        if (error.status === 401) this.badCredentials.set(true);
        else {
          console.error(error);
          this.notificationService.showError('Something went wrong, please try again', 'Error');
        }
      },
    });
  }

  getUsernameValidationMessages(): string {
    const badCredentials = this.badCredentials();
    if (!this.hasErrors(this.username) && !badCredentials) return '';

    if (this.username?.errors?.['required'] && this.hasErrors(this.username)) {
      return 'Username is required';
    }

    if (badCredentials) {
      return 'Username and/or password is incorrect';
    }

    return '';
  }

  getPasswordValidationMessages(): string {
    if (!this.hasErrors(this.password)) return '';

    if (this.password?.errors?.['required']) {
      return 'Password is required';
    }

    return '';
  }

  onUserInput() {
    if (this.badCredentials()) {
      this.badCredentials.set(false);
    }
  }

  hasErrors(control: AbstractControl | null): boolean {
    if (!control) return false;
    return control.invalid && (control.dirty || control.touched);
  }

  get username() {
    return this.loginFormGroup.get('username');
  }

  get password() {
    return this.loginFormGroup.get('password');
  }
}
