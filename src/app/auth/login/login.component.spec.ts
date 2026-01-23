import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'saveToken']);
    authServiceSpy.login.and.returnValue(of({ token: 'test-token' }));

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showWarning',
      'showInfo',
    ]);

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // Suppress console.error in tests
    spyOn(console, 'error');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should have empty form controls initially', () => {
      expect(component.loginFormGroup.get('username')?.value).toBe('');
      expect(component.loginFormGroup.get('password')?.value).toBe('');
    });

    it('should have badCredentials as false initially', () => {
      expect(component.badCredentials()).toBe(false);
    });

    it('should have loading as false initially', () => {
      expect(component.loading()).toBe(false);
    });

    it('should have showPassword as false initially', () => {
      expect(component.showPassword()).toBe(false);
    });
  });

  describe('form validation', () => {
    it('should require username', () => {
      const usernameControl = component.loginFormGroup.get('username');
      expect(usernameControl?.hasError('required')).toBe(true);
    });

    it('should require password', () => {
      const passwordControl = component.loginFormGroup.get('password');
      expect(passwordControl?.hasError('required')).toBe(true);
    });

    it('should be valid when both fields are filled', () => {
      component.loginFormGroup.patchValue({
        username: 'test@example.com',
        password: 'password123',
      });
      expect(component.loginFormGroup.valid).toBe(true);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.loginFormGroup.patchValue({
        username: 'test@example.com',
        password: 'password123',
      });
    });

    it('should set loading to true', () => {
      component.onSubmit();
      expect(component.loading()).toBe(true);
    });

    it('should call authService.login with credentials', () => {
      component.onSubmit();
      expect(authServiceSpy.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });

    it('should save token on successful login', () => {
      component.onSubmit();
      expect(authServiceSpy.saveToken).toHaveBeenCalledWith('test-token');
    });

    it('should reset form on successful login', () => {
      component.onSubmit();
      expect(component.loginFormGroup.get('username')?.value).toBeNull();
      expect(component.loginFormGroup.get('password')?.value).toBeNull();
    });

    it('should navigate to home on successful login', () => {
      component.onSubmit();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should set badCredentials on 401 error', () => {
      const error = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });
      authServiceSpy.login.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(component.badCredentials()).toBe(true);
      expect(component.loading()).toBe(false);
    });

    it('should show error notification on non-401 error', () => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error',
      });
      authServiceSpy.login.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
        'Something went wrong, please try again',
        'Error'
      );
      expect(component.loading()).toBe(false);
    });

    it('should log error to console on non-401 error', () => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Server Error',
      });
      authServiceSpy.login.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe('getUsernameValidationMessages', () => {
    it('should return empty string when control has no errors', () => {
      component.loginFormGroup.patchValue({ username: 'test@example.com' });
      expect(component.getUsernameValidationMessages()).toBe('');
    });

    it('should return required message when username is required', () => {
      const usernameControl = component.loginFormGroup.get('username');
      usernameControl?.markAsTouched();
      expect(component.getUsernameValidationMessages()).toBe('Username is required');
    });

    it('should return empty string when control is pristine and untouched', () => {
      expect(component.getUsernameValidationMessages()).toBe('');
    });
  });

  describe('getPasswordValidationMessages', () => {
    it('should return empty string when control has no errors', () => {
      component.loginFormGroup.patchValue({ password: 'password123' });
      expect(component.getPasswordValidationMessages()).toBe('');
    });

    it('should return required message when password is required', () => {
      const passwordControl = component.loginFormGroup.get('password');
      passwordControl?.markAsTouched();
      expect(component.getPasswordValidationMessages()).toBe('Password is required');
    });

    it('should return empty string when control is pristine and untouched', () => {
      expect(component.getPasswordValidationMessages()).toBe('');
    });
  });

  describe('onUserInput', () => {
    it('should clear badCredentials when true', () => {
      component.badCredentials.set(true);
      component.onUserInput();
      expect(component.badCredentials()).toBe(false);
    });

    it('should do nothing when badCredentials is already false', () => {
      component.badCredentials.set(false);
      component.onUserInput();
      expect(component.badCredentials()).toBe(false);
    });
  });

  describe('hasErrors', () => {
    it('should return false when control is null', () => {
      expect(component.hasErrors(null)).toBe(false);
    });

    it('should return false when control is valid', () => {
      component.loginFormGroup.patchValue({ username: 'test@example.com' });
      expect(component.hasErrors(component.username)).toBe(false);
    });

    it('should return false when control is invalid but pristine and untouched', () => {
      expect(component.hasErrors(component.username)).toBe(false);
    });

    it('should return true when control is invalid and touched', () => {
      component.username?.markAsTouched();
      expect(component.hasErrors(component.username)).toBe(true);
    });

    it('should return true when control is invalid and dirty', () => {
      component.username?.markAsDirty();
      expect(component.hasErrors(component.username)).toBe(true);
    });
  });

  describe('getters', () => {
    it('should return username control', () => {
      expect(component.username).toBe(component.loginFormGroup.get('username'));
    });

    it('should return password control', () => {
      expect(component.password).toBe(component.loginFormGroup.get('password'));
    });
  });
});
