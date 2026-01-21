import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from './error.service';
import { NotificationService } from './notification.service';

describe('ErrorService', () => {
  let service: ErrorService;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showWarning',
      'showInfo',
    ]);

    TestBed.configureTestingModule({
      providers: [ErrorService, { provide: NotificationService, useValue: notificationServiceSpy }],
    });

    service = TestBed.inject(ErrorService);

    // Spy on console.error to prevent test output pollution
    spyOn(console, 'error');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('errorResponse', () => {
    it('should show warning and return specific error for 303 status', () => {
      const error = new HttpErrorResponse({
        status: 303,
        statusText: 'See Other',
      });

      service.errorResponse(error, 'Some detail message').subscribe({
        next: () => fail('Expected error'),
        error: (err) => {
          expect(err.message).toBe('Request failed, password change required');
          expect(notificationServiceSpy.showWarning).toHaveBeenCalledWith(
            'Password change required'
          );
          expect(notificationServiceSpy.showError).not.toHaveBeenCalled();
        },
      });
    });

    it('should show error notification for non-303 errors', () => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });

      service.errorResponse(error, 'Failed to load data').subscribe({
        next: () => fail('Expected error'),
        error: (err) => {
          expect(err.message).toBe('Failed to load data');
          expect(notificationServiceSpy.showError).toHaveBeenCalledWith(
            'Something went wrong, please try again.',
            'Error'
          );
        },
      });
    });

    it('should log error to console for non-303 errors', () => {
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
      });

      service.errorResponse(error, 'Validation failed').subscribe({
        next: () => fail('Expected error'),
        error: () => {
          expect(console.error).toHaveBeenCalledWith(error);
        },
      });
    });

    it('should not log to console for 303 errors', () => {
      const error = new HttpErrorResponse({
        status: 303,
        statusText: 'See Other',
      });

      service.errorResponse(error, 'Detail message').subscribe({
        next: () => fail('Expected error'),
        error: () => {
          expect(console.error).not.toHaveBeenCalled();
        },
      });
    });

    it('should return throwError observable that throws the detail message', () => {
      const error = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
      });
      const detailMessage = 'User not found with ID 123';

      service.errorResponse(error, detailMessage).subscribe({
        next: () => fail('Expected error'),
        error: (err) => {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toBe(detailMessage);
        },
      });
    });

    it('should handle 401 Unauthorized error', () => {
      const error = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
      });

      service.errorResponse(error, 'Authentication required').subscribe({
        next: () => fail('Expected error'),
        error: (err) => {
          expect(err.message).toBe('Authentication required');
          expect(notificationServiceSpy.showError).toHaveBeenCalled();
        },
      });
    });

    it('should handle 403 Forbidden error', () => {
      const error = new HttpErrorResponse({
        status: 403,
        statusText: 'Forbidden',
      });

      service.errorResponse(error, 'Access denied').subscribe({
        next: () => fail('Expected error'),
        error: (err) => {
          expect(err.message).toBe('Access denied');
          expect(notificationServiceSpy.showError).toHaveBeenCalled();
        },
      });
    });

    it('should handle 422 Unprocessable Entity error', () => {
      const error = new HttpErrorResponse({
        status: 422,
        statusText: 'Unprocessable Entity',
        error: { message: 'Email already exists' },
      });

      service.errorResponse(error, 'Failed to create user').subscribe({
        next: () => fail('Expected error'),
        error: (err) => {
          expect(err.message).toBe('Failed to create user');
          expect(notificationServiceSpy.showError).toHaveBeenCalled();
        },
      });
    });

    it('should handle network error (status 0)', () => {
      const error = new HttpErrorResponse({
        status: 0,
        statusText: 'Unknown Error',
        error: new ProgressEvent('error'),
      });

      service.errorResponse(error, 'Network connection failed').subscribe({
        next: () => fail('Expected error'),
        error: (err) => {
          expect(err.message).toBe('Network connection failed');
          expect(notificationServiceSpy.showError).toHaveBeenCalled();
        },
      });
    });

    it('should handle error with empty detail message', () => {
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });

      service.errorResponse(error, '').subscribe({
        next: () => fail('Expected error'),
        error: (err) => {
          expect(err.message).toBe('');
          expect(notificationServiceSpy.showError).toHaveBeenCalled();
        },
      });
    });
  });

  describe('error response behavior', () => {
    it('should return an Observable that never emits next value', (done) => {
      const error = new HttpErrorResponse({ status: 500 });
      let nextCalled = false;

      service.errorResponse(error, 'Test error').subscribe({
        next: () => {
          nextCalled = true;
        },
        error: () => {
          expect(nextCalled).toBe(false);
          done();
        },
      });
    });

    it('should complete after error', (done) => {
      const error = new HttpErrorResponse({ status: 500 });
      let completeCalled = false;

      service.errorResponse(error, 'Test error').subscribe({
        error: () => {
          // Error completes the observable - complete callback won't be called
          // But we can verify the error was thrown
          setTimeout(() => {
            expect(completeCalled).toBe(false);
            done();
          }, 0);
        },
        complete: () => {
          completeCalled = true;
        },
      });
    });
  });
});
