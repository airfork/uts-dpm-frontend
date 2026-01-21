import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { DpmService } from '../../services/dpm.service';
import HomeDpmDto from '../../models/home-dpm-dto';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let dpmServiceSpy: jasmine.SpyObj<DpmService>;

  const mockDpms: HomeDpmDto[] = [
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
    {
      type: 'Safety Recognition',
      points: 10,
      block: 'C3',
      location: 'South Depot',
      date: '2024-01-16',
      time: '14:00',
    },
    {
      type: 'Early Departure',
      points: -2,
      block: 'D4',
      location: 'East Terminal',
      date: '2024-01-16',
      time: '16:00',
    },
  ];

  beforeEach(async () => {
    dpmServiceSpy = jasmine.createSpyObj('DpmService', ['getCurrentDpms']);
    dpmServiceSpy.getCurrentDpms.and.returnValue(of(mockDpms));

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: DpmService, useValue: dpmServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should call getCurrentDpms on construction', () => {
      expect(dpmServiceSpy.getCurrentDpms).toHaveBeenCalled();
    });

    it('should set currentDpms from service', () => {
      expect(component.currentDpms()).toEqual(mockDpms);
    });

    it('should have expandedDpm as null initially', () => {
      expect(component.expandedDpm()).toBeNull();
    });

    it('should be in initial load state', () => {
      expect(component.isInitialLoad()).toBe(true);
    });
  });

  describe('columns configuration', () => {
    it('should have 3 columns defined', () => {
      expect(component.columns.length).toBe(3);
    });

    it('should have type, points, and date columns', () => {
      expect(component.columns[0].field).toBe('type');
      expect(component.columns[1].field).toBe('points');
      expect(component.columns[2].field).toBe('date');
    });

    it('should have correct column headers', () => {
      expect(component.columns[0].header).toBe('Type');
      expect(component.columns[1].header).toBe('Points');
      expect(component.columns[2].header).toBe('Date');
    });
  });

  describe('computed values', () => {
    describe('totalCount', () => {
      it('should return the total number of DPMs', () => {
        expect(component.totalCount()).toBe(4);
      });

      it('should return 0 when no DPMs', () => {
        dpmServiceSpy.getCurrentDpms.and.returnValue(of([]));
        const emptyFixture = TestBed.createComponent(HomeComponent);
        const emptyComponent = emptyFixture.componentInstance;
        emptyFixture.detectChanges();
        expect(emptyComponent.totalCount()).toBe(0);
      });
    });

    describe('positivePoints', () => {
      it('should sum all positive points', () => {
        // 5 + 10 = 15
        expect(component.positivePoints()).toBe(15);
      });

      it('should return 0 when no positive points', () => {
        const negativeDpms: HomeDpmDto[] = [
          {
            type: 'Late',
            points: -3,
            block: 'A',
            location: 'X',
            date: '2024-01-01',
            time: '08:00',
          },
          {
            type: 'Early',
            points: -2,
            block: 'B',
            location: 'Y',
            date: '2024-01-01',
            time: '09:00',
          },
        ];
        dpmServiceSpy.getCurrentDpms.and.returnValue(of(negativeDpms));
        const negFixture = TestBed.createComponent(HomeComponent);
        const negComponent = negFixture.componentInstance;
        negFixture.detectChanges();
        expect(negComponent.positivePoints()).toBe(0);
      });
    });

    describe('negativePoints', () => {
      it('should sum all negative points', () => {
        // -3 + -2 = -5
        expect(component.negativePoints()).toBe(-5);
      });

      it('should return 0 when no negative points', () => {
        const positiveDpms: HomeDpmDto[] = [
          {
            type: 'Good',
            points: 5,
            block: 'A',
            location: 'X',
            date: '2024-01-01',
            time: '08:00',
          },
          {
            type: 'Great',
            points: 10,
            block: 'B',
            location: 'Y',
            date: '2024-01-01',
            time: '09:00',
          },
        ];
        dpmServiceSpy.getCurrentDpms.and.returnValue(of(positiveDpms));
        const posFixture = TestBed.createComponent(HomeComponent);
        const posComponent = posFixture.componentInstance;
        posFixture.detectChanges();
        expect(posComponent.negativePoints()).toBe(0);
      });
    });
  });

  describe('isExpanded', () => {
    it('should return true when DPM is expanded', () => {
      component.expandedDpm.set(mockDpms[0]);
      expect(component.isExpanded(mockDpms[0])).toBe(true);
    });

    it('should return false when DPM is not expanded', () => {
      component.expandedDpm.set(mockDpms[1]);
      expect(component.isExpanded(mockDpms[0])).toBe(false);
    });

    it('should return false when no DPM is expanded', () => {
      expect(component.isExpanded(mockDpms[0])).toBe(false);
    });
  });

  describe('toggleExpand', () => {
    it('should expand a DPM when not expanded', () => {
      component.toggleExpand(mockDpms[0]);
      expect(component.expandedDpm()).toBe(mockDpms[0]);
    });

    it('should collapse a DPM when already expanded', () => {
      component.expandedDpm.set(mockDpms[0]);
      component.toggleExpand(mockDpms[0]);
      expect(component.expandedDpm()).toBeNull();
    });

    it('should switch to different DPM when one is already expanded', () => {
      component.expandedDpm.set(mockDpms[0]);
      component.toggleExpand(mockDpms[1]);
      expect(component.expandedDpm()).toBe(mockDpms[1]);
    });

    it('should set isInitialLoad to false after first toggle', () => {
      expect(component.isInitialLoad()).toBe(true);
      component.toggleExpand(mockDpms[0]);
      expect(component.isInitialLoad()).toBe(false);
    });

    it('should keep isInitialLoad false after subsequent toggles', () => {
      component.toggleExpand(mockDpms[0]);
      component.toggleExpand(mockDpms[0]);
      expect(component.isInitialLoad()).toBe(false);
    });
  });

  describe('empty state', () => {
    it('should handle empty DPM list', () => {
      dpmServiceSpy.getCurrentDpms.and.returnValue(of([]));
      const emptyFixture = TestBed.createComponent(HomeComponent);
      const emptyComponent = emptyFixture.componentInstance;
      emptyFixture.detectChanges();

      expect(emptyComponent.currentDpms()).toEqual([]);
      expect(emptyComponent.totalCount()).toBe(0);
      expect(emptyComponent.positivePoints()).toBe(0);
      expect(emptyComponent.negativePoints()).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('should handle DPM with zero points', () => {
      const zeroDpm: HomeDpmDto[] = [
        {
          type: 'Neutral',
          points: 0,
          block: 'A',
          location: 'X',
          date: '2024-01-01',
          time: '08:00',
        },
      ];
      dpmServiceSpy.getCurrentDpms.and.returnValue(of(zeroDpm));
      const zeroFixture = TestBed.createComponent(HomeComponent);
      const zeroComponent = zeroFixture.componentInstance;
      zeroFixture.detectChanges();

      expect(zeroComponent.positivePoints()).toBe(0);
      expect(zeroComponent.negativePoints()).toBe(0);
      expect(zeroComponent.totalCount()).toBe(1);
    });
  });
});
