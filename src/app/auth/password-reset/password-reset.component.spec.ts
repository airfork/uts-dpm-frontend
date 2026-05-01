import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { PasswordResetComponent } from './password-reset.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

describe('PasswordResetComponent', () => {
  let component: PasswordResetComponent;
  let fixture: ComponentFixture<PasswordResetComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  async function setup(token: string | null = 'reset-token') {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['completePasswordReset']);
    authServiceSpy.completePasswordReset.and.returnValue(of(void 0));

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showWarning',
      'showInfo',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [PasswordResetComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap(token ? { token } : {}),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(console, 'error');
  }

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', async () => {
    await setup();

    expect(component).toBeTruthy();
  });

  it('should disable the form when reset token is missing', async () => {
    await setup(null);

    expect(component.invalidResetLink()).toBe(true);
    expect(component.passwordResetFormGroup.disabled).toBe(true);
  });

  it('should be valid when password fields match', async () => {
    await setup();

    component.passwordResetFormGroup.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    });

    expect(component.passwordResetFormGroup.valid).toBe(true);
  });

  it('should show mismatch message when passwords do not match', async () => {
    await setup();

    component.passwordResetFormGroup.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'different123',
    });

    expect(component.getConfirmPasswordValidationMessages()).toBe(
      'Password does not match new password'
    );
  });

  it('should call completePasswordReset with token and form values', async () => {
    await setup('reset-token-123');
    component.passwordResetFormGroup.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    });

    component.onSubmit();

    expect(authServiceSpy.completePasswordReset).toHaveBeenCalledWith({
      token: 'reset-token-123',
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    });
  });

  it('should navigate to login and show success on reset success', async () => {
    await setup();
    component.passwordResetFormGroup.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    });

    component.onSubmit();
    await fixture.whenStable();

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Password has been reset');
  });

  it('should disable the form for invalid or expired reset token responses', async () => {
    await setup();
    const error = new HttpErrorResponse({
      status: 422,
      statusText: 'Unprocessable Entity',
    });
    authServiceSpy.completePasswordReset.and.returnValue(throwError(() => error));
    component.passwordResetFormGroup.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    });

    component.onSubmit();

    expect(component.invalidResetLink()).toBe(true);
    expect(component.passwordResetFormGroup.disabled).toBe(true);
    expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
      'Reset link is invalid or expired',
      'Error'
    );
  });

  it('should show generic error for unexpected reset failures', async () => {
    await setup();
    const error = new HttpErrorResponse({
      status: 500,
      statusText: 'Server Error',
    });
    authServiceSpy.completePasswordReset.and.returnValue(throwError(() => error));
    component.passwordResetFormGroup.patchValue({
      newPassword: 'newpassword123',
      confirmPassword: 'newpassword123',
    });

    component.onSubmit();

    expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
      'Something went wrong. please try again',
      'Error'
    );
    expect(console.error).toHaveBeenCalledWith(error);
  });
});
