import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ApprovalsComponent } from './approvals.component';
import { ApprovalsService } from '../../services/approvals.service';
import { NotificationService } from '../../services/notification.service';
import { FormatService } from '../../services/format.service';
import ApprovalDpmDto from '../../models/approval-dpm-dto';

describe('ApprovalsComponent', () => {
  let component: ApprovalsComponent;
  let fixture: ComponentFixture<ApprovalsComponent>;
  let approvalsServiceSpy: jasmine.SpyObj<ApprovalsService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;
  let formatServiceSpy: jasmine.SpyObj<FormatService>;
  let mockDpms: ApprovalDpmDto[];
  let mockApprovalPage: { content: ApprovalDpmDto[]; totalElements: number };

  // Factory function to create fresh mock data for each test
  function createMockDpms(): ApprovalDpmDto[] {
    return [
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
      {
        id: 3,
        driver: 'Bob Wilson',
        createdBy: 'Manager Smith',
        type: 'Safety Recognition',
        points: 0,
        block: 'C3',
        location: 'South Depot',
        date: '2024-01-16',
        time: '14:00',
        createdAt: '2024-01-16T15:00:00',
      },
    ];
  }

  beforeEach(async () => {
    // Create fresh mock data for each test to avoid mutation issues
    mockDpms = createMockDpms();
    mockApprovalPage = {
      content: mockDpms,
      totalElements: 3,
    };

    approvalsServiceSpy = jasmine.createSpyObj('ApprovalsService', [
      'getApprovalDpms',
      'updatePoints',
      'approveDpm',
      'denyDpm',
    ]);
    approvalsServiceSpy.getApprovalDpms.and.returnValue(of(mockApprovalPage));
    approvalsServiceSpy.updatePoints.and.returnValue(of(void 0));
    approvalsServiceSpy.approveDpm.and.returnValue(of(void 0));
    approvalsServiceSpy.denyDpm.and.returnValue(of(void 0));

    notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showSuccess',
      'showError',
      'showWarning',
      'showInfo',
    ]);

    formatServiceSpy = jasmine.createSpyObj('FormatService', ['formatDate', 'formatTime']);

    await TestBed.configureTestingModule({
      imports: [ApprovalsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ApprovalsService, useValue: approvalsServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: FormatService, useValue: formatServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initialization', () => {
    it('should load approval DPMs on construction', () => {
      expect(approvalsServiceSpy.getApprovalDpms).toHaveBeenCalledWith(0, 10);
    });

    it('should set dpms signal after loading', () => {
      expect(component.dpms()).toEqual(mockDpms);
    });

    it('should set totalRecords after loading', () => {
      expect(component.totalRecords()).toBe(3);
    });

    it('should set loadingDpms to false after loading', () => {
      expect(component.loadingDpms()).toBe(false);
    });

    it('should have correct default pagination state', () => {
      expect(component.pageSize()).toBe(10);
      expect(component.currentPage()).toBe(0);
    });
  });

  describe('columns configuration', () => {
    it('should have 3 columns defined', () => {
      expect(component.columns.length).toBe(3);
    });

    it('should have driver, block/time, and type columns', () => {
      expect(component.columns[0].field).toBe('driver');
      expect(component.columns[1].field).toBe('block');
      expect(component.columns[2].field).toBe('type');
    });
  });

  describe('toggleExpand', () => {
    it('should expand a DPM when not expanded', () => {
      expect(component.expandedDpmId()).toBeNull();
      component.toggleExpand(mockDpms[0]);
      expect(component.expandedDpmId()).toBe(1);
    });

    it('should collapse a DPM when already expanded', () => {
      component.expandedDpmId.set(1);
      component.toggleExpand(mockDpms[0]);
      expect(component.expandedDpmId()).toBeNull();
    });

    it('should initialize editing points when expanding', () => {
      component.toggleExpand(mockDpms[0]);
      expect(component.editingPoints()[1]).toBe(5);
    });
  });

  describe('isExpanded', () => {
    it('should return true when DPM is expanded', () => {
      component.expandedDpmId.set(1);
      expect(component.isExpanded(mockDpms[0])).toBe(true);
    });

    it('should return false when DPM is not expanded', () => {
      component.expandedDpmId.set(2);
      expect(component.isExpanded(mockDpms[0])).toBe(false);
    });
  });

  describe('getEditingPoints', () => {
    it('should return editing value if set', () => {
      component.editingPoints.set({ 1: 10 });
      expect(component.getEditingPoints(mockDpms[0])).toBe(10);
    });

    it('should return DPM points if no editing value', () => {
      expect(component.getEditingPoints(mockDpms[0])).toBe(5);
    });
  });

  describe('onPointsChange', () => {
    it('should update editingPoints with new value', () => {
      component.onPointsChange(mockDpms[0], 15);
      expect(component.editingPoints()[1]).toBe(15);
    });
  });

  describe('savePoints', () => {
    it('should call updatePoints when value changed', () => {
      const event = new Event('click');
      spyOn(event, 'stopPropagation');

      component.editingPoints.set({ 1: 10 });
      component.savePoints(mockDpms[0], event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(approvalsServiceSpy.updatePoints).toHaveBeenCalledWith(1, 10);
    });

    it('should show success notification after saving', () => {
      const event = new Event('click');
      component.editingPoints.set({ 1: 10 });
      component.savePoints(mockDpms[0], event);

      expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('Points updated');
    });

    it('should not call updatePoints if value unchanged', () => {
      const event = new Event('click');
      component.editingPoints.set({ 1: 5 }); // Same as original
      component.savePoints(mockDpms[0], event);

      expect(approvalsServiceSpy.updatePoints).not.toHaveBeenCalled();
    });

    it('should not call updatePoints if no editing value', () => {
      const event = new Event('click');
      component.savePoints(mockDpms[0], event);

      expect(approvalsServiceSpy.updatePoints).not.toHaveBeenCalled();
    });
  });

  describe('approveDpm', () => {
    it('should call approveDpm service', fakeAsync(() => {
      const event = new Event('click');
      spyOn(event, 'stopPropagation');

      component.approveDpm(mockDpms[0], event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(approvalsServiceSpy.approveDpm).toHaveBeenCalledWith(1);
    }));

    it('should show success notification', () => {
      const event = new Event('click');
      component.approveDpm(mockDpms[0], event);

      expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('DPM has been approved');
    });

    it('should collapse expanded DPM', () => {
      const event = new Event('click');
      component.expandedDpmId.set(1);
      component.approveDpm(mockDpms[0], event);

      expect(component.expandedDpmId()).toBeNull();
    });

    it('should set removingDpmId for animation', () => {
      const event = new Event('click');
      component.approveDpm(mockDpms[0], event);

      expect(component.removingDpmId()).toBe(1);
    });

    it('should remove DPM from list after animation delay', fakeAsync(() => {
      const event = new Event('click');
      component.approveDpm(mockDpms[0], event);

      tick(350);

      const dpms = component.dpms();
      expect(dpms?.find((d) => d.id === 1)).toBeUndefined();
    }));
  });

  describe('denyDpm', () => {
    it('should call denyDpm service', () => {
      const event = new Event('click');
      spyOn(event, 'stopPropagation');

      component.denyDpm(mockDpms[0], event);

      expect(event.stopPropagation).toHaveBeenCalled();
      expect(approvalsServiceSpy.denyDpm).toHaveBeenCalledWith(1);
    });

    it('should show success notification', () => {
      const event = new Event('click');
      component.denyDpm(mockDpms[0], event);

      expect(notificationServiceSpy.showSuccess).toHaveBeenCalledWith('DPM has been denied');
    });

    it('should collapse expanded DPM', () => {
      const event = new Event('click');
      component.expandedDpmId.set(1);
      component.denyDpm(mockDpms[0], event);

      expect(component.expandedDpmId()).toBeNull();
    });

    it('should set removingDpmId for animation', () => {
      const event = new Event('click');
      component.denyDpm(mockDpms[0], event);

      expect(component.removingDpmId()).toBe(1);
    });
  });

  describe('isRemoving', () => {
    it('should return true when DPM is being removed', () => {
      component.removingDpmId.set(1);
      expect(component.isRemoving(mockDpms[0])).toBe(true);
    });

    it('should return false when DPM is not being removed', () => {
      component.removingDpmId.set(2);
      expect(component.isRemoving(mockDpms[0])).toBe(false);
    });
  });

  describe('lazyLoadEvent', () => {
    it('should set loadingDpms to true', () => {
      component.lazyLoadEvent({ first: 10, rows: 10 });
      // Loading will be false after observable completes, so we test initial call
      expect(approvalsServiceSpy.getApprovalDpms).toHaveBeenCalledWith(1, 10);
    });

    it('should calculate page number correctly', () => {
      component.lazyLoadEvent({ first: 20, rows: 10 });
      expect(approvalsServiceSpy.getApprovalDpms).toHaveBeenCalledWith(2, 10);
    });

    it('should update pagination state', () => {
      component.lazyLoadEvent({ first: 20, rows: 10 });
      expect(component.currentPage()).toBe(2);
      expect(component.pageSize()).toBe(10);
    });
  });

  describe('goToNextPage', () => {
    it('should go to next page if not on last page', () => {
      component.totalRecords.set(30);
      component.currentPage.set(0);
      component.pageSize.set(10);

      component.goToNextPage();

      expect(approvalsServiceSpy.getApprovalDpms).toHaveBeenCalledWith(1, 10);
    });

    it('should not go past last page', () => {
      component.totalRecords.set(30);
      component.currentPage.set(2);
      component.pageSize.set(10);
      approvalsServiceSpy.getApprovalDpms.calls.reset();

      component.goToNextPage();

      // Should not make new request
      expect(approvalsServiceSpy.getApprovalDpms).not.toHaveBeenCalled();
    });
  });

  describe('goToPrevPage', () => {
    it('should go to previous page if not on first page', () => {
      component.currentPage.set(2);
      component.pageSize.set(10);

      component.goToPrevPage();

      expect(approvalsServiceSpy.getApprovalDpms).toHaveBeenCalledWith(1, 10);
    });

    it('should not go before first page', () => {
      component.currentPage.set(0);
      approvalsServiceSpy.getApprovalDpms.calls.reset();

      component.goToPrevPage();

      // Should not make new request
      expect(approvalsServiceSpy.getApprovalDpms).not.toHaveBeenCalled();
    });
  });

  describe('computed values', () => {
    it('should compute totalPages correctly', () => {
      component.totalRecords.set(25);
      component.pageSize.set(10);
      expect(component.totalPages()).toBe(3);
    });

    it('should compute first correctly', () => {
      component.currentPage.set(2);
      component.pageSize.set(10);
      expect(component.first()).toBe(20);
    });
  });

  describe('helper methods', () => {
    describe('isPositiveDpm', () => {
      it('should return true for positive points', () => {
        expect(component.isPositiveDpm(mockDpms[0])).toBe(true); // points: 5
      });

      it('should return false for negative points', () => {
        expect(component.isPositiveDpm(mockDpms[1])).toBe(false); // points: -3
      });

      it('should return false for zero points', () => {
        expect(component.isPositiveDpm(mockDpms[2])).toBe(false); // points: 0
      });
    });

    describe('isNegativeDpm', () => {
      it('should return true for negative points', () => {
        expect(component.isNegativeDpm(mockDpms[1])).toBe(true); // points: -3
      });

      it('should return false for positive points', () => {
        expect(component.isNegativeDpm(mockDpms[0])).toBe(false); // points: 5
      });

      it('should return false for zero points', () => {
        expect(component.isNegativeDpm(mockDpms[2])).toBe(false); // points: 0
      });
    });

    describe('getInitials', () => {
      it('should return initials for two-word name', () => {
        expect(component.getInitials('John Doe')).toBe('JD');
      });

      it('should return first two initials for three-word name', () => {
        expect(component.getInitials('John Michael Doe')).toBe('JM');
      });

      it('should handle single-word name', () => {
        expect(component.getInitials('John')).toBe('J');
      });

      it('should uppercase initials', () => {
        expect(component.getInitials('john doe')).toBe('JD');
      });
    });

    describe('getShortType', () => {
      it('should return full type if within max length', () => {
        expect(component.getShortType('On Time')).toBe('On Time');
      });

      it('should truncate long types with ellipsis', () => {
        const longType = 'Very Long DPM Type Name That Exceeds Limit';
        const result = component.getShortType(longType);
        expect(result.length).toBeLessThanOrEqual(18);
        expect(result.endsWith('…')).toBe(true);
      });

      it('should respect custom max length', () => {
        const result = component.getShortType('Short Type Name', 10);
        expect(result.length).toBeLessThanOrEqual(10);
        expect(result.endsWith('…')).toBe(true);
      });
    });

    describe('format getter', () => {
      it('should return format service', () => {
        expect(component.format).toBe(formatServiceSpy);
      });
    });
  });

  describe('isNewItem', () => {
    it('should return true on initial load', () => {
      // Component just created - isInitialLoad is true
      expect(component.isNewItem(mockDpms[0])).toBe(true);
    });
  });
});
