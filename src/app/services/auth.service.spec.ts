import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  const BASE_URL = environment.baseUrl + '/auth';

  // Sample JWT token (header.payload.signature format)
  // Payload: { sub: 'test@example.com', role: 'ADMIN', iat: 1700000000, exp: 1700086400 }
  const mockToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwODY0MDB9.mock_signature';

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showWarning',
      'showInfo',
    ]);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notificationServiceSpy },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should send POST request with credentials', () => {
      const username = 'test@example.com';
      const password = 'password123';

      service.login(username, password).subscribe((response) => {
        expect(response.token).toBe('test-token');
      });

      const req = httpMock.expectOne(BASE_URL + '/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ username, password });

      req.flush({ token: 'test-token' });
    });

    it('should return error on failed login', () => {
      const username = 'test@example.com';
      const password = 'wrongpassword';

      service.login(username, password).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.status).toBe(401);
        },
      });

      const req = httpMock.expectOne(BASE_URL + '/login');
      req.flush({ message: 'Invalid credentials' }, { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('logout', () => {
    it('should clear all localStorage items', () => {
      // Set up localStorage with data
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('role', 'ADMIN');
      localStorage.setItem('exp', '12345');
      localStorage.setItem('username', 'test@example.com');

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('role')).toBeNull();
      expect(localStorage.getItem('exp')).toBeNull();
      expect(localStorage.getItem('username')).toBeNull();
    });

    it('should clear userData', () => {
      // Set up userData through saveToken
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('role', 'ADMIN');
      localStorage.setItem('exp', '12345');
      localStorage.setItem('username', 'test@example.com');

      // Reinitialize service to pick up localStorage
      service = TestBed.inject(AuthService);

      service.logout();

      expect(service.userData.token).toBe('');
      expect(service.userData.role).toBe('');
      expect(service.userData.exp).toBe(0);
      expect(service.userData.username).toBe('');
    });
  });

  describe('saveToken', () => {
    it('should decode JWT and save to localStorage', () => {
      service.saveToken(mockToken);

      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(localStorage.getItem('role')).toBe('ADMIN');
      expect(localStorage.getItem('exp')).toBe('1700086400');
      expect(localStorage.getItem('username')).toBe('test@example.com');
    });

    it('should update userData after saving token', () => {
      service.saveToken(mockToken);

      expect(service.userData.token).toBe(mockToken);
      expect(service.userData.role).toBe('ADMIN');
      expect(service.userData.exp).toBe(1700086400);
      expect(service.userData.username).toBe('test@example.com');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token is valid and not expired', () => {
      // Set expiration far in the future
      const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      // Directly set userData (simulating what saveToken does)
      service.userData.token = 'valid-token';
      service.userData.exp = futureExp;

      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when token is expired', () => {
      // Set expiration in the past
      const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

      service.userData.token = 'expired-token';
      service.userData.exp = pastExp;

      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false when no token exists', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should return false when token is empty string', () => {
      service.userData.token = '';
      service.userData.exp = Math.floor(Date.now() / 1000) + 3600;

      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('changePasswordRequired', () => {
    it('should return true when password change is required', () => {
      service.changePasswordRequired().subscribe((required) => {
        expect(required).toBe(true);
      });

      const req = httpMock.expectOne(BASE_URL + '/changeCheck');
      expect(req.request.method).toBe('GET');
      req.flush({ required: true });
    });

    it('should return false when password change is not required', () => {
      service.changePasswordRequired().subscribe((required) => {
        expect(required).toBe(false);
      });

      const req = httpMock.expectOne(BASE_URL + '/changeCheck');
      req.flush({ required: false });
    });

    it('should show error notification on failure', () => {
      service.changePasswordRequired().subscribe({
        next: () => fail('Expected error'),
        error: () => {
          expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
            'Something went wrong, please try again.',
            'Error'
          );
        },
      });

      const req = httpMock.expectOne(BASE_URL + '/changeCheck');
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('changePassword', () => {
    it('should send PATCH request with password change DTO', () => {
      const dto = {
        currentPassword: 'oldPassword',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword',
      };

      service.changePassword(dto).subscribe();

      const req = httpMock.expectOne(BASE_URL + '/changePassword');
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(dto);

      req.flush(null);
    });
  });

  describe('completePasswordReset', () => {
    it('should send POST request with password reset token DTO', () => {
      const dto = {
        token: 'reset-token',
        newPassword: 'newPassword',
        confirmPassword: 'newPassword',
      };

      service.completePasswordReset(dto).subscribe();

      const req = httpMock.expectOne(BASE_URL + '/resetPassword');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(dto);

      req.flush(null);
    });
  });

  describe('userData initialization', () => {
    it('should load userData from localStorage on construction', () => {
      // Reset TestBed to get fresh instance
      TestBed.resetTestingModule();

      // Set localStorage BEFORE creating the service
      localStorage.setItem('token', 'stored-token');
      localStorage.setItem('role', 'MANAGER');
      localStorage.setItem('exp', '1234567890');
      localStorage.setItem('username', 'manager@example.com');

      TestBed.configureTestingModule({
        providers: [
          AuthService,
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: NotificationService, useValue: notificationServiceSpy },
        ],
      });

      const newService = TestBed.inject(AuthService);
      httpMock = TestBed.inject(HttpTestingController);

      expect(newService.userData.token).toBe('stored-token');
      expect(newService.userData.role).toBe('MANAGER');
      expect(newService.userData.exp).toBe(1234567890);
      expect(newService.userData.username).toBe('manager@example.com');
    });

    it('should handle missing localStorage items gracefully', () => {
      // Reset TestBed and clear localStorage to get fresh instance
      TestBed.resetTestingModule();
      localStorage.clear();

      TestBed.configureTestingModule({
        providers: [
          AuthService,
          provideHttpClient(),
          provideHttpClientTesting(),
          { provide: NotificationService, useValue: notificationServiceSpy },
        ],
      });

      const newService = TestBed.inject(AuthService);
      httpMock = TestBed.inject(HttpTestingController);

      expect(newService.userData.token).toBe('');
      expect(newService.userData.role).toBe('');
      expect(newService.userData.exp).toBe(0);
      expect(newService.userData.username).toBe('');
    });
  });
});
