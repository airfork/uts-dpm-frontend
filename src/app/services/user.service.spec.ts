import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { UserService } from './user.service';
import { NotificationService } from './notification.service';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const BASE_URL = environment.baseUrl + '/users';

  const mockUserNames = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Wilson' },
  ];

  const mockUserDetail = {
    id: '1',
    email: 'john@example.com',
    firstname: 'John',
    lastname: 'Doe',
    points: 50,
    role: 'Driver',
    managerId: 1,
    manager: 'Manager Smith',
    fullTime: true,
    managers: [
      { id: 1, name: 'Manager Smith' },
      { id: 2, name: 'Manager Jones' },
    ],
  };

  beforeEach(() => {
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showWarning',
      'showInfo',
    ]);

    errorServiceSpy = jasmine.createSpyObj('ErrorService', ['errorResponse']);
    errorServiceSpy.errorResponse.and.callFake((error, message) => {
      return throwError(() => new Error(message));
    });

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    routerSpy.navigate.and.returnValue(Promise.resolve(true));

    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: ErrorService, useValue: errorServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserNames', () => {
    it('should return list of user names', () => {
      service.getUserNames().subscribe((names) => {
        expect(names).toEqual(mockUserNames);
        expect(names.length).toBe(3);
      });

      const req = httpMock.expectOne(`${BASE_URL}/names`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserNames);
    });

    it('should call error service on failure', () => {
      service.getUserNames().subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('user names');
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/names`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getUser', () => {
    it('should return user details', () => {
      const userId = '1';

      service.getUser(userId).subscribe((user) => {
        expect(user).toEqual(mockUserDetail);
        expect(user.email).toBe('john@example.com');
      });

      const req = httpMock.expectOne(`${BASE_URL}/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUserDetail);
    });

    it('should show warning and throw error on 303 (password change required)', () => {
      const userId = '1';

      service.getUser(userId).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('password change required');
          expect(notificationServiceSpy.showWarning).toHaveBeenCalledWith(
            'Password change required'
          );
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/${userId}`);
      req.flush({ message: 'Password change required' }, { status: 303, statusText: 'See Other' });
    });

    it('should navigate to 404 on user not found', () => {
      const userId = 'nonexistent';

      service.getUser(userId).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('Failed to find user');
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/errors/404']);
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/${userId}`);
      req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should show error notification on other errors', () => {
      const userId = '1';

      service.getUser(userId).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('Something went wrong');
          expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
            'Something went wrong, please try again.',
            'Error'
          );
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/${userId}`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('orderRoles', () => {
    it('should place current role first in the list', () => {
      const result = service.orderRoles('Driver');

      expect(result[0]).toBe('Driver');
      expect(result.length).toBe(5);
      expect(result).toContain('Admin');
      expect(result).toContain('Analyst');
      expect(result).toContain('Manager');
      expect(result).toContain('Supervisor');
    });

    it('should work with Admin role', () => {
      const result = service.orderRoles('Admin');

      expect(result[0]).toBe('Admin');
      expect(result.includes('Driver')).toBe(true);
    });

    it('should return default order for unknown role', () => {
      const result = service.orderRoles('Unknown');

      expect(result).toEqual(['Admin', 'Analyst', 'Driver', 'Manager', 'Supervisor']);
    });

    it('should not duplicate the current role', () => {
      const result = service.orderRoles('Manager');

      const managerCount = result.filter((r) => r === 'Manager').length;
      expect(managerCount).toBe(1);
    });
  });

  describe('orderManagers', () => {
    it('should place selected manager id first when manager names collide', () => {
      const managers = [
        { id: 1, name: 'Sam Driver' },
        { id: 2, name: 'Sam Driver' },
        { id: 3, name: 'Casey Lead' },
      ];

      const result = service.orderManagers(2, managers);

      expect(result[0]).toEqual({ id: 2, name: 'Sam Driver' });
      expect(result.length).toBe(3);
    });

    it('should place current manager first in the list', () => {
      const managers = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];
      const result = service.orderManagers(2, managers);

      expect(result[0]).toEqual({ id: 2, name: 'Bob' });
      expect(result.length).toBe(3);
    });

    it('should return original list if current manager not found', () => {
      const managers = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];
      const result = service.orderManagers(99, managers);

      expect(result).toEqual(managers);
    });

    it('should not duplicate the current manager', () => {
      const managers = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ];
      const result = service.orderManagers(1, managers);

      const aliceCount = result.filter((manager) => manager.id === 1).length;
      expect(aliceCount).toBe(1);
    });
  });

  describe('updateUser', () => {
    it('should send PATCH request with user data', () => {
      const userId = '1';
      const dto = {
        email: 'john@example.com',
        firstname: 'John',
        lastname: 'Updated',
        points: 60,
        role: 'Manager',
        managerId: 1,
        manager: 'Manager Smith',
        fullTime: true,
      };

      service.updateUser(dto, userId).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/${userId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual(dto);
      req.flush(null);
    });

    it('should call error service on failure', () => {
      const dto = {
        email: 'test@example.com',
        firstname: 'Test',
        lastname: 'User',
        points: 0,
        role: 'Driver',
        managerId: 1,
        manager: 'Manager',
        fullTime: true,
      };
      service.updateUser(dto, '1').subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('update the user');
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/1`);
      req.flush({ message: 'Validation error' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getManagers', () => {
    it('should return list of manager ids and names', () => {
      const managers = [
        { id: 1, name: 'Manager A' },
        { id: 2, name: 'Manager B' },
        { id: 3, name: 'Manager C' },
      ];

      service.getManagers().subscribe((result) => {
        expect(result).toEqual(managers);
        expect(result.length).toBe(3);
      });

      const req = httpMock.expectOne(`${BASE_URL}/managers`);
      expect(req.request.method).toBe('GET');
      req.flush(managers);
    });
  });

  describe('createUser', () => {
    it('should send POST request with new user data', () => {
      const newUser = {
        email: 'new@example.com',
        firstname: 'New',
        lastname: 'User',
        role: 'Driver',
        managerId: 1,
        manager: 'Manager Smith',
        fullTime: true,
      };

      service.createUser(newUser).subscribe();

      const req = httpMock.expectOne(BASE_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newUser);
      req.flush(null);
    });

    it('should call error service on duplicate email', () => {
      const newUser = {
        email: 'existing@example.com',
        firstname: 'Test',
        lastname: 'User',
        role: 'Driver',
        managerId: 1,
        manager: 'Manager Smith',
        fullTime: false,
      };

      service.createUser(newUser).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('create a user');
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(BASE_URL);
      req.flush(
        { message: 'Email already exists' },
        { status: 422, statusText: 'Unprocessable Entity' }
      );
    });
  });

  describe('resetPointBalances', () => {
    it('should send PATCH request to reset all points', () => {
      service.resetPointBalances().subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/points/reset`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toBeNull();
      req.flush(null);
    });
  });

  describe('deleteUser', () => {
    it('should send DELETE request', () => {
      const userId = '123';

      service.deleteUser(userId).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/${userId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should call error service on failure', () => {
      service.deleteUser('123').subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('delete the user');
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/123`);
      req.flush({ message: 'Cannot delete' }, { status: 409, statusText: 'Conflict' });
    });
  });

  describe('sendPointsBalance', () => {
    it('should send POST request to email user their points', () => {
      const userId = '123';

      service.sendPointsBalance(userId).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/${userId}/points`);
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });
  });

  describe('sendPointsBalanceAll', () => {
    it('should send POST request to email all users their points', () => {
      service.sendPointsBalanceAll().subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/points`);
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });
  });

  describe('resetPassword', () => {
    it('should send POST request to reset user password', () => {
      const userId = '123';

      service.resetPassword(userId).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/${userId}/reset`);
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });

    it('should call error service on failure', () => {
      service.resetPassword('123').subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain("reset the user' password");
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/123/reset`);
      req.flush({ message: 'User not found' }, { status: 404, statusText: 'Not Found' });
    });
  });
});
