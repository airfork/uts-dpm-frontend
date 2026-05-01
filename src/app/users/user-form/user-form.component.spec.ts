import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { UserFormComponent } from './user-form.component';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import GetUserDetailDto from '../../models/get-user-detail-dto';

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const mockManagers = [
    { id: 1, name: 'Manager Smith' },
    { id: 2, name: 'Manager Jones' },
    { id: 3, name: 'Manager Wilson' },
  ];

  const mockUserDetail: GetUserDetailDto = {
    email: 'john@example.com',
    firstname: 'John',
    lastname: 'Doe',
    points: 50,
    role: 'Driver',
    managerId: 1,
    manager: 'Manager Smith',
    fullTime: true,
    managers: mockManagers.slice(0, 2),
  };

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', [
      'orderRoles',
      'orderManagers',
      'updateUser',
      'createUser',
    ]);
    userServiceSpy.orderRoles.and.returnValue([
      'Driver',
      'Admin',
      'Analyst',
      'Manager',
      'Supervisor',
    ]);
    userServiceSpy.orderManagers.and.returnValue(mockManagers);
    userServiceSpy.updateUser.and.returnValue(of(void 0));
    userServiceSpy.createUser.and.returnValue(of(void 0));

    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      userData: { username: 'admin@example.com', token: '', role: '', exp: 0 },
    });

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showWarning',
      'showInfo',
    ]);

    await TestBed.configureTestingModule({
      imports: [UserFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    }).compileComponents();

    // Suppress console.error in tests
    spyOn(console, 'error');
  });

  describe('create layout', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(UserFormComponent);
      component = fixture.componentInstance;
      component.layout = 'create';
      component.managers = mockManagers;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize roles on create layout', () => {
      expect(userServiceSpy.orderRoles).toHaveBeenCalledWith('Driver');
      expect(component.roles().length).toBe(5);
    });

    it('should set manager and role defaults', () => {
      expect(component.userFormGroup.get('managerId')?.value).toBe(1);
      expect(component.userFormGroup.get('role')?.value).toBe('Driver');
    });

    it('should have waiting signal as false initially', () => {
      expect(component.waiting()).toBe(false);
    });

    describe('form validation', () => {
      it('should require email', () => {
        expect(component.email?.hasError('required')).toBe(true);
      });

      it('should validate email format', () => {
        component.email?.setValue('invalid-email');
        expect(component.email?.hasError('email')).toBe(true);
      });

      it('should accept valid email', () => {
        component.email?.setValue('test@example.com');
        expect(component.email?.hasError('email')).toBe(false);
      });

      it('should require firstname', () => {
        expect(component.firstname?.hasError('required')).toBe(true);
      });

      it('should require lastname', () => {
        expect(component.lastname?.hasError('required')).toBe(true);
      });
    });

    describe('onSubmit for create', () => {
      beforeEach(() => {
        component.userFormGroup.patchValue({
          email: 'new@example.com',
          firstname: 'New',
          lastname: 'User',
          managerId: 1,
          role: 'Driver',
          fullTime: true,
        });
      });

      it('should call createUser with correct DTO', () => {
        component.onSubmit();

        expect(userServiceSpy.createUser).toHaveBeenCalledWith({
          email: 'new@example.com',
          firstname: 'New',
          lastname: 'User',
          managerId: 1,
          manager: 'Manager Smith',
          role: 'Driver',
          fullTime: true,
        });
      });

      it('should show success notification on create', () => {
        component.onSubmit();

        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('User created');
      });

      it('should reset form after create', () => {
        component.onSubmit();

        expect(component.userFormGroup.get('email')?.value).toBeNull();
        expect(component.userFormGroup.get('firstname')?.value).toBeNull();
      });

      it('should show error for duplicate email (422)', () => {
        const error = new HttpErrorResponse({
          status: 422,
          statusText: 'Unprocessable Entity',
        });
        userServiceSpy.createUser.and.returnValue(throwError(() => error));

        component.onSubmit();

        expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
          'A user with this email/username already exists',
          'Error'
        );
      });

      it('should show generic error for other failures', () => {
        const error = new HttpErrorResponse({
          status: 500,
          statusText: 'Server Error',
        });
        userServiceSpy.createUser.and.returnValue(throwError(() => error));

        component.onSubmit();

        expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
          'Something went wrong, please try again',
          'Error'
        );
      });
    });

    describe('isButtonDisabled', () => {
      it('should be disabled when form is invalid', () => {
        expect(component.isButtonDisabled()).toBe(true);
      });

      it('should be enabled when form is valid', () => {
        component.userFormGroup.patchValue({
          email: 'test@example.com',
          firstname: 'Test',
          lastname: 'User',
          managerId: 1,
          role: 'Driver',
          fullTime: true,
        });
        expect(component.isButtonDisabled()).toBe(false);
      });
    });
  });

  describe('edit layout', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(UserFormComponent);
      component = fixture.componentInstance;
      component.layout = 'edit';
      component.userInfo = { user: mockUserDetail, id: '1' };
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load user data', () => {
      expect(component.user()).toEqual(mockUserDetail);
      expect(component.userId()).toBe('1');
    });

    it('should initialize roles with user current role first', () => {
      expect(userServiceSpy.orderRoles).toHaveBeenCalledWith('Driver');
    });

    it('should order managers with user current manager first', () => {
      expect(userServiceSpy.orderManagers).toHaveBeenCalledWith(1, mockUserDetail.managers);
    });

    it('should populate form with user data', () => {
      expect(component.userFormGroup.get('email')?.value).toBe('john@example.com');
      expect(component.userFormGroup.get('firstname')?.value).toBe('John');
      expect(component.userFormGroup.get('lastname')?.value).toBe('Doe');
      expect(component.userFormGroup.get('points')?.value).toBe(50);
      expect(component.userFormGroup.get('fullTime')?.value).toBe(true);
    });

    it('should log error if userInfo is not provided', () => {
      const newFixture = TestBed.createComponent(UserFormComponent);
      const newComponent = newFixture.componentInstance;
      newComponent.layout = 'edit';
      // Don't set userInfo
      newFixture.detectChanges();

      expect(console.error).toHaveBeenCalledWith(
        'User and id must be passed in if using the edit layout'
      );
    });

    describe('hasFormChanged', () => {
      it('should return false when no changes made', () => {
        expect(component.hasFormChanged()).toBe(false);
      });

      it('should return true when form value changed', () => {
        component.userFormGroup.patchValue({ firstname: 'Jane' });
        expect(component.hasFormChanged()).toBe(true);
      });
    });

    describe('hasFieldChanged', () => {
      it('should return false when field unchanged', () => {
        expect(component.hasFieldChanged('email')).toBe(false);
      });

      it('should return true when field changed', () => {
        component.userFormGroup.patchValue({ email: 'new@example.com' });
        expect(component.hasFieldChanged('email')).toBe(true);
      });
    });

    describe('resetForm', () => {
      it('should restore original values', () => {
        component.userFormGroup.patchValue({ firstname: 'Changed' });
        expect(component.hasFormChanged()).toBe(true);

        component.resetForm();

        expect(component.userFormGroup.get('firstname')?.value).toBe('John');
        expect(component.hasFormChanged()).toBe(false);
      });
    });

    describe('onSubmit for edit', () => {
      beforeEach(() => {
        component.userFormGroup.patchValue({ firstname: 'Updated' });
      });

      it('should call updateUser service', () => {
        component.onSubmit();
        expect(userServiceSpy.updateUser).toHaveBeenCalled();
      });

      it('should call updateUser with correct data', () => {
        component.onSubmit();

        expect(userServiceSpy.updateUser).toHaveBeenCalledWith(
          jasmine.objectContaining({
            email: 'john@example.com',
            firstname: 'Updated',
            lastname: 'Doe',
            managerId: 1,
            manager: 'Manager Smith',
          }),
          '1'
        );
      });

      it('should show success notification', () => {
        component.onSubmit();

        expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('User updated');
      });

      it('should set waiting to false after completion', () => {
        component.onSubmit();

        expect(component.waiting()).toBe(false);
      });

      it('should update original values after save', () => {
        component.onSubmit();

        // After save, the new values become the "original" values
        expect(component.hasFormChanged()).toBe(false);
      });

      it('should set waiting to false on error', () => {
        const error = new HttpErrorResponse({
          status: 500,
          statusText: 'Server Error',
        });
        userServiceSpy.updateUser.and.returnValue(throwError(() => error));

        component.onSubmit();

        expect(component.waiting()).toBe(false);
      });
    });

    describe('isButtonDisabled', () => {
      it('should be disabled when form is invalid', () => {
        component.userFormGroup.patchValue({ email: 'invalid' });
        expect(component.isButtonDisabled()).toBe(true);
      });

      it('should be disabled when form is valid but unchanged', () => {
        expect(component.isButtonDisabled()).toBe(true);
      });

      it('should be enabled when form is valid and changed', () => {
        component.userFormGroup.patchValue({ firstname: 'Changed' });
        expect(component.isButtonDisabled()).toBe(false);
      });
    });

    describe('role control for self-editing', () => {
      it('should disable role control when editing own profile', () => {
        const selfUser = { ...mockUserDetail, email: 'admin@example.com' };
        const selfFixture = TestBed.createComponent(UserFormComponent);
        const selfComponent = selfFixture.componentInstance;
        selfComponent.layout = 'edit';
        selfComponent.userInfo = { user: selfUser, id: '1' };
        selfFixture.detectChanges();

        expect(selfComponent.userFormGroup.get('role')?.disabled).toBe(true);
      });
    });
  });

  describe('validation message methods', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(UserFormComponent);
      component = fixture.componentInstance;
      component.layout = 'create';
      component.managers = mockManagers;
      fixture.detectChanges();
    });

    describe('getEmailValidationMessages', () => {
      it('should return empty string when valid', () => {
        component.email?.setValue('test@example.com');
        expect(component.getEmailValidationMessages()).toBe('');
      });

      it('should return required message when empty', () => {
        component.email?.markAsTouched();
        expect(component.getEmailValidationMessages()).toBe('Email is required');
      });

      it('should return invalid email message', () => {
        component.email?.setValue('invalid');
        component.email?.markAsTouched();
        expect(component.getEmailValidationMessages()).toBe('Input is not a valid email address');
      });
    });

    describe('getFirstnameValidationMessages', () => {
      it('should return empty string when valid', () => {
        component.firstname?.setValue('John');
        expect(component.getFirstnameValidationMessages()).toBe('');
      });

      it('should return required message when empty', () => {
        component.firstname?.markAsTouched();
        expect(component.getFirstnameValidationMessages()).toBe('First name is required');
      });
    });

    describe('getLastnameValidationMessages', () => {
      it('should return empty string when valid', () => {
        component.lastname?.setValue('Doe');
        expect(component.getLastnameValidationMessages()).toBe('');
      });

      it('should return required message when empty', () => {
        component.lastname?.markAsTouched();
        expect(component.getLastnameValidationMessages()).toBe('Last name is required');
      });
    });

    describe('getPointsValidationMessages', () => {
      beforeEach(() => {
        // For edit layout, points has validators
        const editFixture = TestBed.createComponent(UserFormComponent);
        const editComponent = editFixture.componentInstance;
        editComponent.layout = 'edit';
        editComponent.userInfo = { user: mockUserDetail, id: '1' };
        editFixture.detectChanges();
        component = editComponent;
        fixture = editFixture;
      });

      it('should return empty string when valid', () => {
        component.points?.setValue(50);
        expect(component.getPointsValidationMessages()).toBe('');
      });

      it('should return required message when empty', () => {
        component.points?.setValue(null);
        component.points?.markAsTouched();
        expect(component.getPointsValidationMessages()).toBe('Points is required');
      });

      it('should return pattern message for invalid number', () => {
        // Set an invalid value by bypassing type checking
        component.points?.setValue('abc' as unknown as number);
        component.points?.markAsTouched();
        expect(component.getPointsValidationMessages()).toBe('Points must be a valid number');
      });
    });
  });

  describe('hasErrors', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(UserFormComponent);
      component = fixture.componentInstance;
      component.layout = 'create';
      component.managers = mockManagers;
      fixture.detectChanges();
    });

    it('should return false for null control', () => {
      expect(component.hasErrors(null)).toBe(false);
    });

    it('should return false when control is valid', () => {
      component.email?.setValue('test@example.com');
      expect(component.hasErrors(component.email)).toBe(false);
    });

    it('should return false when invalid but pristine and untouched', () => {
      expect(component.hasErrors(component.email)).toBe(false);
    });

    it('should return true when invalid and touched', () => {
      component.email?.markAsTouched();
      expect(component.hasErrors(component.email)).toBe(true);
    });
  });

  describe('getInputBorderClass', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(UserFormComponent);
      component = fixture.componentInstance;
      component.layout = 'edit';
      component.userInfo = { user: mockUserDetail, id: '1' };
      fixture.detectChanges();
    });

    it('should return default class for null control', () => {
      const result = component.getInputBorderClass(null);
      expect(result).toContain('border-neutral-200');
    });

    it('should return error class when control has errors', () => {
      component.email?.setValue('invalid');
      component.email?.markAsTouched();
      const result = component.getInputBorderClass(component.email, 'email');
      expect(result).toContain('border-error-500');
    });

    it('should return success class when control is valid and changed', () => {
      component.email?.setValue('changed@example.com');
      const result = component.getInputBorderClass(component.email, 'email');
      expect(result).toContain('border-success-500');
    });

    it('should return default class when control is valid but unchanged', () => {
      const result = component.getInputBorderClass(component.email, 'email');
      expect(result).toContain('border-neutral-200');
    });
  });

  describe('getters', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(UserFormComponent);
      component = fixture.componentInstance;
      component.layout = 'create';
      component.managers = mockManagers;
      fixture.detectChanges();
    });

    it('should return email control', () => {
      expect(component.email).toBe(component.userFormGroup.get('email'));
    });

    it('should return firstname control', () => {
      expect(component.firstname).toBe(component.userFormGroup.get('firstname'));
    });

    it('should return lastname control', () => {
      expect(component.lastname).toBe(component.userFormGroup.get('lastname'));
    });

    it('should return points control', () => {
      expect(component.points).toBe(component.userFormGroup.get('points'));
    });
  });
});
