import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangePasswordComponent } from './change-password.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

describe('ChangePasswordComponent', () => {
  let component: ChangePasswordComponent;
  let fixture: ComponentFixture<ChangePasswordComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'changePasswordRequired',
      'changePassword',
    ]);
    authServiceSpy.changePasswordRequired.and.returnValue(of(true));
    authServiceSpy.changePassword.and.returnValue(of(void 0));

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showWarning',
      'showInfo',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [ChangePasswordComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Suppress console.error in tests
    spyOn(console, 'error');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should call changePasswordRequired on init', () => {
      expect(authServiceSpy.changePasswordRequired).toHaveBeenCalled();
    });

    it('should set isLoading to false after check', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should have waitingForResponse as false initially', () => {
      expect(component.waitingForResponse()).toBe(false);
    });

    it('should navigate to home if password change not required', fakeAsync(() => {
      authServiceSpy.changePasswordRequired.and.returnValue(of(false));
      const newFixture = TestBed.createComponent(ChangePasswordComponent);
      newFixture.detectChanges();

      tick();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    }));

    it('should show warning if password change not required', fakeAsync(() => {
      authServiceSpy.changePasswordRequired.and.returnValue(of(false));
      const newFixture = TestBed.createComponent(ChangePasswordComponent);
      newFixture.detectChanges();

      tick();

      expect(notificationServiceSpy.showWarning).toHaveBeenCalledWith(
        'Cannot change password currently'
      );
    }));
  });

  describe('form validation', () => {
    it('should require current password', () => {
      const control = component.currentPassword;
      expect(control?.hasError('required')).toBe(true);
    });

    it('should require new password', () => {
      const control = component.newPassword;
      expect(control?.hasError('required')).toBe(true);
    });

    it('should require confirm password', () => {
      const control = component.confirmPassword;
      expect(control?.hasError('required')).toBe(true);
    });

    it('should require new password to be at least 8 characters', () => {
      component.newPassword?.setValue('short');
      expect(component.newPassword?.hasError('minlength')).toBe(true);
    });

    it('should accept new password with 8 or more characters', () => {
      component.newPassword?.setValue('longpassword');
      expect(component.newPassword?.hasError('minlength')).toBe(false);
    });

    it('should be valid when all fields are filled correctly', () => {
      component.changePasswordFormGroup.patchValue({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      });
      expect(component.changePasswordFormGroup.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.changePasswordFormGroup.patchValue({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      });
    });

    it('should set waitingForResponse to true', () => {
      component.onSubmit();
      expect(component.waitingForResponse()).toBe(true);
    });

    it('should call changePassword with correct DTO', () => {
      component.onSubmit();
      expect(authServiceSpy.changePassword).toHaveBeenCalledWith({
        currentPassword: 'oldpassword',
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      });
    });

    it('should reset form on success', () => {
      component.onSubmit();
      expect(component.changePasswordFormGroup.get('currentPassword')?.value).toBeNull();
    });

    it('should navigate to home on success', () => {
      component.onSubmit();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should show success notification on success', fakeAsync(() => {
      component.onSubmit();
      tick();
      expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Password has been changed');
    }));

    it('should show error for incorrect current password (401)', () => {
      const error = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });
      authServiceSpy.changePassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
        'Current password is incorrect',
        'Error'
      );
      expect(component.waitingForResponse()).toBe(false);
    });

    it('should reset current password on 401 error', () => {
      const error = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });
      authServiceSpy.changePassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(component.currentPassword?.value).toBe('');
    });

    it('should show error for password validation failure (422)', () => {
      const error = new HttpErrorResponse({
        status: 422,
        statusText: 'Unprocessable Entity',
      });
      authServiceSpy.changePassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
        'Please check the new and confirm password fields again',
        'Error'
      );
      expect(component.waitingForResponse()).toBe(false);
    });

    it('should show generic error for other failures', () => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error',
      });
      authServiceSpy.changePassword.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
        'Something went wrong. please try again',
        'Error'
      );
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('formGroupToDto', () => {
    it('should convert form group to DTO', () => {
      component.changePasswordFormGroup.patchValue({
        currentPassword: 'old',
        newPassword: 'new12345',
        confirmPassword: 'new12345',
      });

      const dto = component.formGroupToDto();

      expect(dto).toEqual({
        currentPassword: 'old',
        newPassword: 'new12345',
        confirmPassword: 'new12345',
      });
    });
  });

  describe('hasErrors', () => {
    it('should return false for null control', () => {
      expect(component.hasErrors(null)).toBe(false);
    });

    it('should return false when control is valid', () => {
      component.currentPassword?.setValue('password123');
      expect(component.hasErrors(component.currentPassword)).toBe(false);
    });

    it('should return false when invalid but pristine and untouched', () => {
      expect(component.hasErrors(component.currentPassword)).toBe(false);
    });

    it('should return true when invalid and touched', () => {
      component.currentPassword?.markAsTouched();
      expect(component.hasErrors(component.currentPassword)).toBe(true);
    });

    it('should return true when invalid and dirty', () => {
      component.currentPassword?.markAsDirty();
      expect(component.hasErrors(component.currentPassword)).toBe(true);
    });
  });

  describe('getCurrentPasswordValidationMessages', () => {
    it('should return empty string when no errors', () => {
      component.currentPassword?.setValue('password');
      expect(component.getCurrentPasswordValidationMessages()).toBe('');
    });

    it('should return required message when empty and touched', () => {
      component.currentPassword?.markAsTouched();
      expect(component.getCurrentPasswordValidationMessages()).toBe('Current password is required');
    });
  });

  describe('getNewPasswordValidationMessages', () => {
    it('should return empty string when valid', () => {
      component.newPassword?.setValue('newpassword123');
      expect(component.getNewPasswordValidationMessages()).toBe('');
    });

    it('should return required message when empty and touched', () => {
      component.newPassword?.markAsTouched();
      expect(component.getNewPasswordValidationMessages()).toBe('New password is required');
    });

    it('should return minlength message when too short', () => {
      component.newPassword?.setValue('short');
      component.newPassword?.markAsTouched();
      expect(component.getNewPasswordValidationMessages()).toBe(
        'New password must be at least 8 characters long'
      );
    });

    it('should return same password error when new equals current', () => {
      component.changePasswordFormGroup.patchValue({
        currentPassword: 'samepassword',
        newPassword: 'samepassword',
        confirmPassword: 'samepassword',
      });
      expect(component.getNewPasswordValidationMessages()).toBe(
        'Password cannot be the same as your current password'
      );
    });
  });

  describe('getConfirmPasswordValidationMessages', () => {
    it('should return empty string when valid', () => {
      component.changePasswordFormGroup.patchValue({
        newPassword: 'newpassword123',
        confirmPassword: 'newpassword123',
      });
      expect(component.getConfirmPasswordValidationMessages()).toBe('');
    });

    it('should return required message when empty and touched', () => {
      component.confirmPassword?.markAsTouched();
      expect(component.getConfirmPasswordValidationMessages()).toBe('Confirm password is required');
    });

    it('should return mismatch error when passwords do not match', () => {
      component.changePasswordFormGroup.patchValue({
        newPassword: 'newpassword123',
        confirmPassword: 'differentpassword',
      });
      expect(component.getConfirmPasswordValidationMessages()).toBe(
        'Password does not match new password'
      );
    });
  });

  describe('getters', () => {
    it('should return currentPassword control', () => {
      expect(component.currentPassword).toBe(
        component.changePasswordFormGroup.get('currentPassword')
      );
    });

    it('should return newPassword control', () => {
      expect(component.newPassword).toBe(component.changePasswordFormGroup.get('newPassword'));
    });

    it('should return confirmPassword control', () => {
      expect(component.confirmPassword).toBe(
        component.changePasswordFormGroup.get('confirmPassword')
      );
    });
  });
});
