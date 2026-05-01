import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DpmService } from './dpm.service';
import { ErrorService } from './error.service';
import { environment } from '../../environments/environment';
import HomeDpmDto from '../models/home-dpm-dto';
import { DPMGroup } from '../models/dpm-type';
import { GetDpmColors } from '../models/get-dpm-colors';
import { throwError } from 'rxjs';

describe('DpmService', () => {
  let service: DpmService;
  let httpMock: HttpTestingController;
  let errorServiceSpy: jasmine.SpyObj<ErrorService>;

  const BASE_URL = environment.baseUrl + '/dpms';

  const mockHomeDpms: HomeDpmDto[] = [
    {
      type: 'On Time',
      points: 5,
      block: 'A1',
      location: 'Main Station',
      date: '2024-01-15',
      time: '08:00',
      notes: 'Good performance',
    },
    {
      type: 'Late Arrival',
      points: -3,
      block: 'B2',
      location: 'North Hub',
      date: '2024-01-15',
      time: '09:30',
    },
  ];

  const mockDpmGroups: DPMGroup[] = [
    {
      id: '1',
      groupName: 'Punctuality',
      dpms: [
        { id: 1, name: 'On Time', points: 5 },
        { id: 2, name: 'Early Arrival', points: 3 },
      ],
    },
    {
      id: '2',
      groupName: 'Safety',
      dpms: [
        { id: 3, name: 'Safety Violation', points: -10 },
        { id: 4, name: 'Safety Recognition', points: 5 },
      ],
    },
  ];

  const mockDpmColors: GetDpmColors[] = [
    { colorId: 1, colorName: 'Red', hexCode: '#FF5733' },
    { colorId: 2, colorName: 'Green', hexCode: '#33FF57' },
    { colorId: 3, colorName: 'Blue', hexCode: '#3357FF' },
  ];

  beforeEach(() => {
    errorServiceSpy = jasmine.createSpyObj('ErrorService', ['errorResponse']);
    errorServiceSpy.errorResponse.and.callFake((error, message) => {
      return throwError(() => new Error(message));
    });

    TestBed.configureTestingModule({
      providers: [
        DpmService,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ErrorService, useValue: errorServiceSpy },
      ],
    });

    service = TestBed.inject(DpmService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentDpms', () => {
    it('should return current DPMs for the user', () => {
      service.getCurrentDpms().subscribe((dpms) => {
        expect(dpms).toEqual(mockHomeDpms);
        expect(dpms.length).toBe(2);
      });

      const req = httpMock.expectOne(BASE_URL + '/current');
      expect(req.request.method).toBe('GET');
      req.flush(mockHomeDpms);
    });

    it('should return empty array when no DPMs exist', () => {
      service.getCurrentDpms().subscribe((dpms) => {
        expect(dpms).toEqual([]);
        expect(dpms.length).toBe(0);
      });

      const req = httpMock.expectOne(BASE_URL + '/current');
      req.flush([]);
    });

    it('should retry twice on failure before calling error service', () => {
      service.getCurrentDpms().subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain("user's current dpms");
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      // First attempt
      const req1 = httpMock.expectOne(BASE_URL + '/current');
      req1.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });

      // First retry
      const req2 = httpMock.expectOne(BASE_URL + '/current');
      req2.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });

      // Second retry
      const req3 = httpMock.expectOne(BASE_URL + '/current');
      req3.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('create', () => {
    it('should send POST request with DPM data', () => {
      const newDpm = {
        driver: 'John Doe',
        driverId: 1,
        date: '2024-01-15',
        type: 1,
        block: 'A1',
        location: 'Main Station',
        startTime: '08:00',
        endTime: '16:00',
        notes: 'Good work',
      };

      service.create(newDpm).subscribe();

      const req = httpMock.expectOne(BASE_URL);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newDpm);
      req.flush(null);
    });

    it('should call error service on failure', () => {
      const newDpm = {
        driver: 'John Doe',
        driverId: 1,
        date: '2024-01-15',
        type: 1,
        block: 'A1',
        location: 'Main Station',
        startTime: '08:00',
        endTime: '16:00',
      };

      service.create(newDpm).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('create the DPM');
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(BASE_URL);
      req.flush({ message: 'Validation error' }, { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('getAllForUser', () => {
    it('should fetch paginated DPMs for a user', () => {
      const userId = '123';
      const page = 0;
      const size = 10;
      const mockDpmDetails = [
        {
          id: 1,
          driver: 'John Doe',
          createdBy: 'Manager',
          type: 'On Time',
          points: 5,
          block: 'A1',
          location: 'Main Station',
          date: '2024-01-15',
          time: '08:00',
          createdAt: '2024-01-15T10:00:00',
          status: 'approved',
          ignored: false,
        },
      ];
      const mockResponse = {
        content: mockDpmDetails,
        totalElements: 1,
        totalPages: 1,
        number: 0,
      };

      service.getAllForUser(userId, page, size).subscribe((response) => {
        expect(response.content).toEqual(mockDpmDetails);
        expect(response.totalElements).toBe(1);
      });

      const req = httpMock.expectOne(`${BASE_URL}/user/${userId}?page=${page}&size=${size}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should call error service on failure', () => {
      const userId = '456';

      service.getAllForUser(userId, 0, 10).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain("user' dpms");
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/user/${userId}?page=0&size=10`);
      req.flush({ message: 'Not found' }, { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getDpmGroups', () => {
    it('should return list of DPM groups', () => {
      service.getDpmGroups().subscribe((groups) => {
        expect(groups).toEqual(mockDpmGroups);
        expect(groups.length).toBe(2);
        expect(groups[0].dpms.length).toBe(2);
      });

      const req = httpMock.expectOne(`${BASE_URL}/list`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDpmGroups);
    });

    it('should call error service on failure', () => {
      service.getDpmGroups().subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('DPM types');
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/list`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getDpmColors', () => {
    it('should return list of DPM colors', () => {
      service.getDpmColors().subscribe((colors) => {
        expect(colors).toEqual(mockDpmColors);
        expect(colors.length).toBe(3);
      });

      const req = httpMock.expectOne(`${BASE_URL}/colors`);
      expect(req.request.method).toBe('GET');
      req.flush(mockDpmColors);
    });

    it('should call error service on failure', () => {
      service.getDpmColors().subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('DPM colors');
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(`${BASE_URL}/colors`);
      req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('updateDpmGroups', () => {
    it('should send PUT request with updated groups', () => {
      const updatedGroups = [
        {
          groupName: 'Updated Punctuality',
          dpms: [{ dpmType: 'On Time', points: 10 }],
        },
      ];

      service.updateDpmGroups(updatedGroups).subscribe();

      const req = httpMock.expectOne(BASE_URL + '/list');
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedGroups);
      req.flush(null);
    });

    it('should call error service on failure', () => {
      const updatedGroups = [{ groupName: 'Test', dpms: [] }];

      service.updateDpmGroups(updatedGroups).subscribe({
        next: () => fail('Expected error'),
        error: (error) => {
          expect(error.message).toContain('update the DPM types');
          expect(errorServiceSpy.errorResponse).toHaveBeenCalled();
        },
      });

      const req = httpMock.expectOne(BASE_URL + '/list');
      req.flush({ message: 'Validation error' }, { status: 400, statusText: 'Bad Request' });
    });
  });
});
