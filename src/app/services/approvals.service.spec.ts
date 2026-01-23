import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ApprovalsService } from './approvals.service';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import { throwError } from 'rxjs';
import ApprovalDpmPage from '../models/approval-dpm-page';

describe('ApprovalsService', () => {
  let service: ApprovalsService;
  let httpMock: HttpTestingController;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;

  const BASE_URL = environment.baseUrl + '/dpms';

  const mockApprovalPage: ApprovalDpmPage = {
    content: [
      {
        id: 1,
        driver: 'John Doe',
        createdBy: 'Manager Smith',
        type: 'On Time',
        points: 5,
        block: 'A1',
        location: 'Main Station',
        date: '2024-01-15',
        time: '08:00',
        createdAt: '2024-01-15T10:00:00',
      },
      {
        id: 2,
        driver: 'Jane Smith',
        createdBy: 'Manager Jones',
        type: 'Late Arrival',
        points: -3,
        block: 'B2',
        location: 'North Hub',
        date: '2024-01-15',
        time: '09:30',
        createdAt: '2024-01-15T11:00:00',
        notes: 'Traffic delay',
      },
    ],
    totalElements: 2,
  };

  beforeEach(() => {
    errorServiceSpy = jasmine.createSpyObj('ErrorService', ['errorResponse']);
    errorServiceSpy.errorResponse.and.callFake((error, message) => {
      return throwError(() => new Error(message));
    });

    TestBed.configureTestingModule({
      providers: [
        ApprovalsService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ErrorService, useValue: errorServiceSpy },
      ],
    });

    service = TestBed.inject(ApprovalsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getApprovalDpms', () => {
    it('should return paginated approval DPMs', () => {
      const page = 0;
      const size = 10;

      service.getApprovalDpms(page, size).subscribe((response) => {
        expect(response).toEqual(mockApprovalPage);
        expect(response.content.length).toBe(2);
        expect(response.totalElements).toBe(2);
      });

      const req = httpMock.expectOne(`${BASE_URL}/approvals?page=${page}&size=${size}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApprovalPage);
    });

    it('should handle empty approval list', () => {
      const emptyPage = {
        content: [],
        totalElements: 0,
      };

      service.getApprovalDpms(0, 10).subscribe((response) => {
        expect(response.content).toEqual([]);
        expect(response.totalElements).toBe(0);
      });

      const req = httpMock.expectOne(`${BASE_URL}/approvals?page=0&size=10`);
      req.flush(emptyPage);
    });

    it('should request correct page and size', () => {
      const page = 2;
      const size = 25;

      service.getApprovalDpms(page, size).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/approvals?page=${page}&size=${size}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApprovalPage);
    });

    it('should call error service on failure', () => {
      service.getApprovalDpms(0, 10).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('unapproved dpm list');
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/approvals?page=0&size=10`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('updatePoints', () => {
    it('should send PATCH request with new points value', () => {
      const dpmId = 1;
      const newPoints = 10;

      service.updatePoints(dpmId, newPoints).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/${dpmId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ points: newPoints });
      req.flush(null);
    });

    it('should handle negative points', () => {
      const dpmId = 2;
      const negativePoints = -15;

      service.updatePoints(dpmId, negativePoints).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/${dpmId}`);
      expect(req.request.body).toEqual({ points: negativePoints });
      req.flush(null);
    });

    it('should handle zero points', () => {
      const dpmId = 3;

      service.updatePoints(dpmId, 0).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/${dpmId}`);
      expect(req.request.body).toEqual({ points: 0 });
      req.flush(null);
    });

    it('should call error service on failure', () => {
      service.updatePoints(1, 5).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain("user's points");
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/1`);
      req.flush({ message: 'Invalid points' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('approveDpm', () => {
    it('should send PATCH request with approved: true', () => {
      const dpmId = 1;

      service.approveDpm(dpmId).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/${dpmId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ approved: true });
      req.flush(null);
    });

    it('should retry twice on failure before calling error service', () => {
      const dpmId = 1;

      service.approveDpm(dpmId).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('approve the dpm');
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      // First attempt
      const req1 = httpMock.expectOne(`${BASE_URL}/${dpmId}`);
      req1.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });

      // First retry
      const req2 = httpMock.expectOne(`${BASE_URL}/${dpmId}`);
      req2.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });

      // Second retry
      const req3 = httpMock.expectOne(`${BASE_URL}/${dpmId}`);
      req3.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
    });

    it('should succeed on first retry after initial failure', () => {
      const dpmId = 1;
      let completed = false;

      service.approveDpm(dpmId).subscribe({
        next: () => {
          completed = true;
        },
      });

      // First attempt fails
      const req1 = httpMock.expectOne(`${BASE_URL}/${dpmId}`);
      req1.flush(
        { message: 'Temporary error' },
        { status: 503, statusText: 'Service Unavailable' }
      );

      // Retry succeeds
      const req2 = httpMock.expectOne(`${BASE_URL}/${dpmId}`);
      req2.flush(null);

      expect(completed).toBe(true);
    });
  });

  describe('denyDpm', () => {
    it('should send PATCH request with ignored: true', () => {
      const dpmId = 2;

      service.denyDpm(dpmId).subscribe();

      const req = httpMock.expectOne(`${BASE_URL}/${dpmId}`);
      expect(req.request.method).toBe('PATCH');
      expect(req.request.body).toEqual({ ignored: true });
      req.flush(null);
    });

    it('should call error service on failure', () => {
      const dpmId = 2;

      service.denyDpm(dpmId).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('deny the dpm');
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/${dpmId}`);
      req.flush({ message: 'DPM not found' }, { status: 404, statusText: 'Not Found' });
    });

    it('should not retry on failure (unlike approveDpm)', () => {
      const dpmId = 3;

      service.denyDpm(dpmId).subscribe({
        next: () => fail('Expected error'),
        error: () => {
          // Only one request should be made (no retries)
          expect(errorServiceSpy.errorResponse).toHaveBeenCalledTimes(1);
        },
      });

      // Only one request - no retries
      const req = httpMock.expectOne(`${BASE_URL}/${dpmId}`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });

      // Verify no additional requests are pending
      httpMock.expectNone(`${BASE_URL}/${dpmId}`);
    });
  });
});
