import { NgClass } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs';
import CompletePasswordResetDto from '../../models/complete-password-reset-dto';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { PasswordsEqualValidator } from '../directives/passwords-equal.directive';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  imports: [NgClass, ReactiveFormsModule],
})
export class PasswordResetComponent {
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private token = this.route.snapshot.queryParamMap.get('token');

  invalidResetLink = signal(!this.token);
  waitingForResponse = signal(false);
  showNewPassword = signal(false);
  showConfirmPassword = signal(false);
  passwordResetFormGroup = new FormGroup(
    {
      newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: [PasswordsEqualValidator] }
  );

  constructor() {
    if (this.invalidResetLink()) {
      this.passwordResetFormGroup.disable();
    }
  }

  onSubmit() {
    if (!this.token) {
      this.invalidResetLink.set(true);
      this.passwordResetFormGroup.disable();
      return;
    }

    this.waitingForResponse.set(true);
    this.authService
      .completePasswordReset(this.formGroupToDto(this.token))
      .pipe(first())
      .subscribe({
        next: () => {
          this.passwordResetFormGroup.reset();
          this.router
            .navigate(['/login'])
            .then(() => this.notificationService.showSuccess('Password has been reset'));
        },
        error: (error: HttpErrorResponse) => {
          this.waitingForResponse.set(false);
          if (error.status === 400 || error.status === 422) {
            this.invalidResetLink.set(true);
            this.passwordResetFormGroup.disable();
            this.notificationService.showError('Reset link is invalid or expired', 'Error');
            return;
          }

          console.error(error);
          this.notificationService.showError('Something went wrong. please try again', 'Error');
        },
      });
  }

  formGroupToDto(token: string): CompletePasswordResetDto {
    const values = this.passwordResetFormGroup.value;
    return {
      token,
      newPassword: values.newPassword!,
      confirmPassword: values.confirmPassword!,
    };
  }

  hasErrors(control: AbstractControl | null): boolean {
    if (!control) return false;
    return control.invalid && (control.dirty || control.touched);
  }

  getNewPasswordValidationMessages(): string {
    if (this.hasErrors(this.newPassword) && this.newPassword?.errors?.['required']) {
      return 'New password is required';
    }

    if (this.newPassword?.errors?.['minlength']) {
      return 'New password must be at least 8 characters long';
    }

    return '';
  }

  getConfirmPasswordValidationMessages(): string {
    if (this.hasErrors(this.confirmPassword) && this.confirmPassword?.errors?.['required']) {
      return 'Confirm password is required';
    }

    if (this.passwordResetFormGroup?.errors?.['passwordsEqual']) {
      return 'Password does not match new password';
    }

    return '';
  }

  get newPassword() {
    return this.passwordResetFormGroup.get('newPassword');
  }

  get confirmPassword() {
    return this.passwordResetFormGroup.get('confirmPassword');
  }
}
